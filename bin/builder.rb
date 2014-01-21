# encoding:utf-8
require 'rkelly'
require 'json'
require 'tsort'
require 'yaml'
require 'erubis'
require 'nokogiri'
require 'stringio'
require 'fileutils'
require 'benchmark'
require 'css_parser'

require File.expand_path('common.rb',File.dirname(__FILE__))

module Aztec
    
    def self.name(ext = nil)
        n = 'aztec'
        ext.nil? ? n : n + ext
    end
    
    class TsortableHash < Hash
        include TSort
        alias tsort_each_node each_key
        def tsort_each_child(node, &block)
            fetch(node).each(&block)
        end
    end

    module Utils
    
        def self.load_template(name)
            path = "#{File.dirname(__FILE__)}/#{name}.erb"
            File.read path
        end
        
        def self.namespace_to_file_path(namespace)
            if namespace.index '.'
                namespace.sub('$root.','').gsub('.','/')
            else
                namespace == '$root' ? Aztec.name : namespace
            end
        end
        #
        # Convert module config from javascript object into ruby hash
        #
        class JsModuleConfigToJsonVisitor < ::RKelly::Visitors::ECMAVisitor
            def initialize
                super
                @property_nodes = []
            end

            def visit_PropertyNode(o)
                if (o.name == 'namespace' && @property_nodes.size == 0) or
                    (@property_nodes.size == 1 && @property_nodes.last.name == 'imports')
                    %Q|"#{o.name}": "#{o.value.to_ecma}"|
                else
                    @indent += 1
                    @property_nodes.push o
                    code = %Q|"#{o.name}": #{o.value.accept(self)}|
                    @property_nodes.pop
                    @indent -= 1
                    code
                end
            end

            def visit_ResolveNode(o)
                if @property_nodes.length > 0
                    %Q|"#{o.value}"|
                else
                    super(o)
                end
            end

            def visit_StringNode(o)
                if o.value.single_quoted?
                    o.value.unquote.double_quote
                else
                    o.value
                end
            end
        end

    end

    class XTemplate
        XTEMPLATE_ID_ATTR = 'data-xtemplate'
        XTEMPLATE_ID_ATTR_SEL = '[data-xtemplate]'

        def initialize(path)
            @path = path
            @source = File.read path, :encoding => 'utf-8'
            @doc = ::Nokogiri::HTML @source
            collect_styles
            collect_template
        end

        attr_reader :styles, :templates

        private
        def collect_styles
            style_nodes = @doc.css('style')
            @styles = if style_nodes.size > 0
                css = style_nodes.map(&:text).join('\n')
                css.dedent_block.sub(/^\n*/,'').rstrip
            else
                ''
            end
        end

        def collect_template
            @templates = @doc.css(XTEMPLATE_ID_ATTR_SEL).inject({}) do |tpls, ele|
                id = ele.attr XTEMPLATE_ID_ATTR
                ele.remove_attribute XTEMPLATE_ID_ATTR
                inline_style = ele.attr('style').to_s.gsub(%r|\s*display\s*:\s*none;*\s*|,'')
                if inline_style.size < 4
                    ele.remove_attribute 'style'
                else
                    ele.set_attribute('style', inline_style)
                end
                html = if ele.name.downcase == 'script'
                    ele.inner_html
                else
                    ele.to_html
                end
                tpls[id] = Nokogiri::XML(html,&:noblanks).to_html.inspect
                tpls
            end
        end
    end

    #
    # Representing JSON config at top of a js module
    #
    class JsModuleConfig
        attr_reader :desciption, :namespace
        def initialize(json)
            @config = JSON.parse json
        rescue
            $stderr.puts "Parsing Module Config Error: #{json}"
        end

        def [](key)
            @config[key]
        end

        def []=(key, value)
            @config[key] = value
        end

        def imports
            @config['imports'] || {}
        end

        def exports
            @config['exports'] || {}
        end
        
        def notransform
            @config['notransform'] == true
        end
        
        def description 
            @config['description'] || ''
        end
        
        def namespace
            @config['namespace']
        end

        def files
            @config['files']
        end

        def <<(config)
            merge('imports', config, :merge, {})
            merge('exports', config, :'+', [])
            merge('files', config, :'+', [])
        end

        def to_ecma
            @config.to_yaml
        end

        private
        def merge(key, config, merege_method, default)
            a = @config[key] || default.dup
            b = config[key] || default.dup
            @config[key] = a.send(merege_method, b)
        end
    end

    #
    # JavaScript module
    #
    class JsModule
        include Comparable
        CONFIG_PATTERN = /(^\(\{\n*.*?\}\);)$/m

        def self.src_dir
            @src_dir
        end

        def self.src_dir=(v)
            @src_dir = v
        end
        
        def initialize(path)
            @path = path
            @source = File.read path, :encoding=>'utf-8'
            read_module_config
            path.sub!(%r|^.*/src|,'')
            @config['files'] = [path]
            parse
        end

        def <=>(other)
            k = 'priority'
            a, b = @config[k] || 0, other.config[k] || 0
            a <=> b
        end

        attr_reader :config
        attr_reader :source
        
        def parse(drop_config_object = true)
            if @config.notransform
                @ast = nil
                @source = @source.sub CONFIG_PATTERN, ''
                @xtemplate = nil
            else
                @ast = ::RKelly::Parser.new.parse(@source) rescue nil
                throw "There are SytaxError in #{@path}!\n" if @ast.nil?
                if drop_config_object
                    @ast.value.shift
                    from = @meta.range.to.index + 2
                    @source = @source[from..-1].strip
                    @xtemplate = load_xtemplate
                end
            end
        end

        def namespace
            @config.namespace
        end

        def xtemplate_styles
            if @xtemplate.nil? or @xtemplate.styles.empty?
                nil
            else
                css = @xtemplate.styles
                p = CssParser::Parser.new
                p.add_block! css.strip
                "/* #{namespace} */".endl + p.to_s
            end
        end

        def is_root
            ns = @config.namespace
            ns == '$root' || ns["."].nil?
        end

        def to_amd
            tpl = is_root ?  "<%=@meta%>\n<%=@original%>\n" : Utils.load_template(:amd)
            eruby = Erubis::Eruby.new tpl
            ctx = Erubis::Context.new
            ctx[:name] = name
            imports = @config.imports
            if not imports.size.zero?
                ctx[:imports] = imports.values.map(&:single_quote).join(',')
                requires = @config.imports.map{|k,v| "#{k} = require('#{v}')"}.join(",\n" + ' '*8)
                ctx[:requires] = "var #{requires};"
            else
                ctx[:imports] = ctx[:requires] = ''
            end

            ctx[:xtemplate] = if not @xtemplate.nil? and @xtemplate.templates.size > 0
                js = ["\n///xtemplate","require('$root.browser.template')"]
                @xtemplate.templates.each do |data, t|
                    id = data.split(',').first
                    js << ".set('#{id}',#{t})".indent(8)
                end
                js.join("\n").indent(4) + ';'
            else
                ''
            end
            
            ctx[:meta] = @config.to_ecma.to_multiline_comment.endl
            #preprocess
            ctx[:original] = is_root ? @source : @source.indent(4)
            ctx[:usestrict] = "//'use strict';"
            
            exports = @config.exports
            if not exports.size.zero?
                ctx[:exports] = @config.exports.map do |name|
                    c = "exports['#{name}'] = #{name};".indent(4)
                    c = c.to_comment unless declared?(name)
                    c
                end.join("\n").lstrip
            else
                ctx[:exports] = ''
            end
            ctx[:returnstatement] = 'return exports;'
            code = eruby.evaluate ctx
            code.gsub(/\t/,'  ')
        end

        #
        # merge two or more modules into one
        #
        def merge(others)
            if others.nil? or others.size.zero?
                self
            else
                others.each{|e| self << e}
                self
            end
        end

        def <<(other)
            if @config.namespace != other.config.namespace
                raise "Can not merge two module with different namespace!" 
                return
            end
            cfg = other.config
            desc = cfg.files.first.to_comment.newline
            desc << cfg['description'].to_multiline_comment.newline.endl
            @config << cfg
            @source << desc << other.source
        end

        alias :name :namespace
        alias :styles :xtemplate_styles
        
        private
        def read_module_config
            i = @source.index(CONFIG_PATTERN)
            raise "#{@path} has not module config!" if i.nil? or i < 0
            first_node = ::RKelly::Parser.new.parse @source[CONFIG_PATTERN]
            @meta = parenthetical_node = first_node.value[0].value
            config = Utils::JsModuleConfigToJsonVisitor.new.accept(parenthetical_node.value);
            config = config.chop if config.end_with? ';'
            @config = JsModuleConfig.new config
        end

        def decl_nodes
            if @decls.nil?
                @decls = @ast.pointcut(RKelly::Nodes::FunctionDeclNode).matches.to_a +
                    @ast.pointcut(RKelly::Nodes::VarDeclNode).matches.to_a
                @decls.uniq!
            end
            @decls
        end

        def declared?(value)
            not decl_nodes.find do |n|
                if n.is_a? RKelly::Nodes::FunctionDeclNode
                    n.value == value
                else
                    n.name == value
                end
            end.nil?
        end

        #  //#include '/path/to/file'
        PREPROCESS_PATTERN = /\n*(?<indent>\s*)\/\/#(?<code>.*)\n*/
        def preprocess
            while (match = @source.match PREPROCESS_PATTERN)
                #puts match
                code, str = match[:code], match.string
                @source[str] = begin
                    self.instance_eval(code).enclose("\n")
                rescue
                    str.sub('//','//!')
                end
            end
        end

        def load_xtemplate
            xtpl_path = JsModule.src_dir + @path.sub(/\.js$/,'.html')
            return nil unless File.exists?(xtpl_path)
            XTemplate.new xtpl_path
        end

        #
        # builtin preprocess functions
        #
        def include(path)
            relative_path = File.expand_path(path, @path)
            File.read relative_path, :encoding => 'utf-8'
        end
    end

    #
    # Module manager
    #
    class JsModuleManager
        def initialize(src_dir, opt)
            @src_dir = src_dir
            @exclude = opt['exclude'] || []
            @verbose = opt['verbose'] || false
            @styles = []
            JsModule.src_dir = src_dir
            init
        end

        attr_reader :dependency
        attr_reader :src_dirw

        def scan
            Dir["#{@src_dir}/**/*.js"].each do |js_file|
                for ex in @exclude
                    next if js_file[ex]
                end
                add_module js_file
            end
            self
        end

        def add_module(js_file)
            m = nil
            if @verbose            
                s = Benchmark.measure {m = JsModule.new(js_file) rescue nil}
                return nil if m.nil?
                $stdout.puts "#{s.to_s.strip} #{js_file}"
            else
                m = JsModule.new(js_file)
                return nil if m.nil?
            end
            cfg = m.config
            @modules[m.namespace] << m
            @dependency[m.namespace] = cfg.imports.nil? ? [] : cfg.imports.values
            return m
        end

        alias :update_module :add_module

        def rescan
            init.scan
        end

        def to_ecma(namespace)
            namespace = namespace.namespace if namespace.is_a? JsModule
            mods = @modules[namespace].sort
            return '' if mods.size.zero?
            js = StringIO.new
            main = mods[0]
            others = mods[1..-1]
            seg = Utils.namespace_to_file_path(main.namespace)
            if others.size.zero?
                js.puts main.to_amd
            else
                tmp = main.dup.merge(others)
                tmp.parse false
                js.puts tmp.to_amd
            end
            js.string
        end

        def to_styles(namespace)
            #TODO
        end

        def release(output_dir, overwrite = false)
            FileUtils.mkdir output_dir unless File.exists? output_dir
            styles = StringIO.new
            @modules.each do |namespace, m|
                m = m.sort
                main = m[0]
                mods = m[1..-1]
                segment = Utils.namespace_to_file_path(main.namespace)
                path = "#{output_dir}/#{segment}.js"
                raise "#{path} already exists!" if !overwrite and File.exists?(path)
                yield path if block_given?
                
                #javascript
                FileUtils.mkpath(File.dirname(path))
                File.open(path,'w:utf-8') do |f|
                    if mods.size.zero?
                        f.write main.to_amd
                    else
                        tmp = main.dup.merge(mods)
                        tmp.parse false
                        f.write tmp.to_amd
                    end
                end
                
                #style
                styles.write main.styles
                mods.each do |m|
                    styles.write m.styles
                end
            end
            css_file_path = "#{output_dir}/#{Aztec.name('.css')}"
            File.open(css_file_path, 'w') do |f|
                yield css_file_path if block_given?
                f.puts styles.string.strip
            end
        end

        def [](namespace)
            @modules[namespace].sort.first
        end

        def dependency_hash
            @dependency.tsort
        end

        def dependency_of(mod, include_self = false)
            mod == '$root' ? [mod] : _dependency_of(mod, include_self).unshift('$root').uniq
        end

        def js_with_dependency(mod)
            mods = dependency_of mod, true
            js mods
        end

        def css_with_dependency(mod)
            mods = dependency_of mod, true
            css mods
        end

        def js(mods)
            js = mods.join("\n").to_comment.endl
            js << mods.inject("") do |code, mod|
                if $man[mod].nil?
                    code
                else
                    code << self.to_ecma(mod)
                end
            end
        end

        def css(mods)
            css = mods.inject("") do |code, mod|
            if self[mod].nil?
                code
            else
                code << self[mod].xtemplate_styles
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
            @modules = Hash.new{|h,k| h[k] = []}
            @dependency = TsortableHash.new
            @dependency['$root'] = []
            @dependency['jQuery'] = []
            self
        end

        def _dependency_of(mod, include_self)
            m = @modules[mod].sort.first
            return include_self ? [mod] : [] if m.nil? or m.config.imports.empty?
            cfg = m.config
            imports = cfg.imports.values
            ret = imports.inject([]){|s,im| s |= _dependency_of(im, include_self)}
            all = (ret + imports).uniq
            (include_self ? all << mod : all).uniq
        end
    end
end

if __FILE__ == $0
    require 'pp'
    require 'pry'
    $ROOT = File.absolute_path(File.dirname(__FILE__)+'/../')
    $stdout.puts "$ROOT=#{$ROOT}"
    man = Aztec::JsModuleManager.new("#{$ROOT}/src",:verbose => true)
    man.scan
    #puts Aztec::JsModule.new(File.read("#{File.dirname(__FILE__)}/../src/ui/UIControl.js")).to_amd
    #Aztec::JsModuleManager.new("#{$ROOT}/src",{}).scan.save_dependency_graph 'module_dependency.png'
    #puts Aztec::JsModuleManager.new('src').scan.dependency_hash
    
    #pp man.dependency_hash
    #binding.pry
    #pp man.dependency_of("$root.ui", true)
    #puts Aztec::JsModule.new("../src/aztec.js").to_amd
    #puts man['$root.browser.console'].xtemplate_styles
    man.release(File.absolute_path("#{$ROOT}/release"), true) {|path| puts "Writting #{path}"}
    
    #puts man.to_ecma('$root.ui.dialog')
end
