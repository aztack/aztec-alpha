#encoding:utf-8
module Aztec
	#
    # Module manager
    #
    class JsModuleManager
        def initialize(src_dir, opt)
            @src_dir = src_dir
            @exclude = opt[:exclude] || []
            @verbose = opt[:verbose] || false
            @styles = []
            @output_dir = ''
            JsModule.src_dir = src_dir
            init
        end

        attr_reader :dependency
        attr_reader :src_dir
        attr_accessor :output_dir

        def scan
            Benchmark.bm do |bm|
                Dir["#{@src_dir}/**/*.js"].each do |js_file|
                    for ex in @exclude
                        next if js_file[ex]
                    end
                    begin
                        add_module js_file, bm
                    rescue =>ex
                        $stderr.puts "Error in #{js_file}"
                        raise ex
                    end
                end
            end
            self
        end

        def add_module(js_file, bm = nil)
            m = nil
            if @verbose
                s = Benchmark.measure(File.basename(js_file)){m = JsModule.new(js_file)}
                $stdout.puts "#{s.to_s.strip} #{File.basename(js_file)}"
                return nil if m.nil?
            else
                m = JsModule.new(js_file)
                return nil if m.nil?
            end
            cfg = m.config
            return if cfg.deprecated?
            @modules[m.namespace] << m
            if @dependency[m.namespace].nil?
                @dependency[m.namespace] = cfg.imports.nil? ? [] : cfg.imports.values
            else
                @dependency[m.namespace].concat cfg.imports.values
            end
            return m
        end

        alias :update_module :add_module

        def rescan
            init.scan
        end

        def to_ecma(namespace, spec = :umd)
            namespace = namespace.namespace if namespace.is_a? JsModule
            mods = @modules[namespace].sort
            return '' if mods.size.zero?
            js = StringIO.new
            main = mods[0]
            others = mods[1..-1]
            #seg = Utils.namespace_to_file_path(main.namespace)
            if others.size.zero?
                js.puts main.send(:"to_#{spec}")
            else
                #tmp = Marshal.load(Marshal.dump(main))
                #tmp.merge(others)
                #binding.pry if namespace == '$root.lang.arguments'
                tmp = main.dup.merge(others)
                tmp.parse false
                js.puts tmp.send(:"to_#{spec}")
            end
            #if namespace == "$root"
            #    js.puts js_dependency_module
            #end
            js.string
        end

        def to_styles(namespace)
            #TODO
        end

        def release(output_dir, overwrite = false, spec = :umd)
            FileUtils.mkdir output_dir unless File.exists? output_dir
            FileUtils.mkdir "#{output_dir}/css" rescue nil
            FileUtils.mkdir "#{output_dir}/images" rescue nil
            #styles = StringIO.new
            @modules.each do |namespace, m|
                #sort by priority
                m.sort!
                main = m[0]
                mods = m[1..-1]
                segment = Utils.namespace_to_file_path(main.namespace)
                output_images_path = nil
                filename_noext = File.basename(main.basename,'.js')
                src_images_path = "#{File.dirname(main.path)}/images"
                #if main.config.directory and false
                    #path = "#{output_dir}/#{main.config.directory}/#{main.basename}"
                    #output_images_path = "#{output_dir}/#{main.config.directory}/images"
                    #output_css_path = "#{output_dir}/#{main.config.directory}/#{filename_noext}.css"
                #else
                    path = "#{output_dir}/scripts/#{segment}.js"
                    output_css_path = "#{output_dir}/css/#{filename_noext}.css"
                #end
                raise "#{path} already exists!" if !overwrite and File.exists?(path)
                yield path if block_given?
                
                #javascript
                FileUtils.mkpath(File.dirname(path))
                File.open(path,'w:utf-8') do |f|
                    if mods.size.zero?
                        f.write main.send(:"to_#{spec}")
                    else
                        tmp = main.dup.merge(mods)
                        tmp.parse false
                        f.write tmp.send(:"to_#{spec}")
                    end
                end
                
                #style
                #styles.write main.styles
                #mods.each {|mod|styles.write mod.styles}
                css_text = main.styles
                if css_text and css_text.size > 0
                    File.open(output_css_path,"w:utf-8") do |f|
                        f.write main.styles
                    end
                end

                if output_images_path and File.exist?(src_images_path)
                    FileUtils.cp_r "#{output_dir}/images/", output_images_path
                end
            end
            #css_file_path = "#{output_dir}/#{Aztec.name('.css')}"
            #File.open(css_file_path, 'w') do |f|
            #    yield css_file_path if block_given?
            #    f.puts styles.string.strip
            #end
            #config_file_path = "#{output_dir}/config.js"
            #File.open(config_file_path,'w:utf-8') do |f|
            #    yield config_file_path if block_given?
            #    f.puts js_dependency_module
            #end
        end

        def release_single_js(output_dir, path, overwrite = true, spec = :umd) 
            FileUtils.mkdir output_dir unless File.exists? output_dir
            ns = Utils.file_path_to_namespace(path)

            index = nil
            ns_changed, mod_changed = @modules.find do |n, parts|
                index = parts.index{|part|part.config['files'].index(path)}
                n.downcase == ns || (not index.nil?)
            end
            mod_changed[index] = JsModule.new(path)
            mod_changed.sort!

            main = mod_changed[0]
            mods = mod_changed[1..-1]

            segment = Utils.namespace_to_file_path(main.namespace)
            output_path = "#{output_dir}/scripts/#{segment}.js"
            raise "#{path} already exists!" if !overwrite and File.exists?(path)
            yield path if block_given?
            
            FileUtils.mkpath(File.dirname(path))
            File.open(output_path,'w:utf-8') do |f|
                if mods.size.zero?
                    f.write main.send(:"to_#{spec}")
                else
                    tmp = main.dup.merge(mods)
                    tmp.parse false
                    f.write tmp.send(:"to_#{spec}")
                end
            end
        end

        def [](namespace)
            @modules[namespace].sort.first
        end

        def dependency_hash
            @dependency.tsort
        end

        def js_dependency_module
            map = {}
            depends = {}
            @modules.each do |ns, mod|
                map[ns] = "/release/#{ns}"
                next if ns == '$root'
                depends[ns] = dependency_of ns
            end
            #binding.pry
            [
                "\n;define('$root.config',function(_, exports){",
                "    exports.moduleUrls = #{map.to_json};",
                "    exports.moduleDependency = #{depends.to_json}",
                "    return exports;",
                "});"
            ].join "\n"
        end

        def dependency_of(mod, include_self = false)
            mod == '$root' ? [mod] : _dependency_of(mod, include_self).unshift('$root').uniq
        end

        def js_with_dependency(mod, spec = :umd,exclude = [])
            mods = dependency_of mod, true
			mods.reject!{|m|exclude.include? m} if not exclude.nil? and exclude.size > 0
            js mods, spec
        end

        def css_with_dependency(mod)
            mods = dependency_of mod, true
            css mods
        end

        def js(mods, spec)
            js = mods.join("\n").to_comment.endl
            js << mods.inject("") do |code, mod|
                if self[mod].nil?
                    code
                else
                    code << self.to_ecma(mod, spec)
                end
            end
            js
        end

        def css(mods)
            mods.inject("") do |code, mod|
                #binding.pry if code.nil?
                if self[mod].nil?
                    code
                else
                    styles = self[mod].xtemplate_styles
                    code << styles if not styles.nil?
                    code
                end
            end
        end

        def save_dependency_graph(filename)
            begin
                require 'graphviz'
                init.scan
                GraphViz::new(:G, :type => :digraph) do |g|
                    @dependency.each do |name, depends|
                        n = g.add_node name
                        depends.each{|dep|g.add_edges n, g.add_node(dep)}
                    end
                end.output :png => filename
            rescue LoadError
                $stderr.puts "GraphViz gem not installed, try `[sudo] gem install ruby-graphviz`"
            end
        end

        private
        def init
            @modules = Hash.new {|h,k|h[k] = []}
            @dependency = TsortableHash.new
            @dependency['$root'] = []
            @dependency['jQuery'] = []
            self
        end

        def _dependency_of(mod, include_self)
            raise "Can not found #{mod}!Check your spelling." if @modules[mod].nil?;
            m = @modules[mod].sort

            return include_self ? [mod] : [] if m.nil? or m.size.zero?
            imports = m.inject([]) do |all,md|
                all.concat md.config.imports.values
                all
            end
            return include_self ? [mod] : [] if imports.empty?
            ret = imports.inject([]){|s,im| s |= _dependency_of(im, include_self)}
            all = (ret + imports).uniq
            (include_self ? all << mod : all).uniq
        end
    end
end