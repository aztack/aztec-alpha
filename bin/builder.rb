# encoding:utf-8
require 'rkelly'
require 'json'
require 'tsort'
require 'erubis'
require 'execjs'
require 'nokogiri'
require 'stringio'
require 'fileutils'
require 'benchmark'

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
    
        def self.namespace_to_file_path(namespace)
            if namespace.index '.'
                namespace.sub('$root.','').gsub('.','/')
            else
                namespace == '$root' ? Aztec.name : namespace
            end
        end
        #
        # Convert module config js-object into ruby-hash
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

        def self.load_template(name)
            path = "#{File.dirname(__FILE__)}/#{name}.erb"
            File.read path
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
                html = ele.to_html.inspect
                tpls[id] = html
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
        end

        def [](key)
            @config[key]
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
    end

    #
    # JavaScript module
    #
    class JsModule
        CONFIG_PATTERN = /(^\(\{\n*.*?\}\);)$/m
        
        def initialize(path)
            @path = path
            @source = File.read path, :encoding=>'utf-8'
            read_module_config
            if @config.notransform
                @ast = nil
                @source = @source.sub CONFIG_PATTERN, ''
                @xtemplate = nil
            else
                @ast = ::RKelly::Parser.new.parse(@source) rescue nil
                throw "There are SytaxError in #{path}!" if @ast.nil?
                @ast.value.shift #drop config object literal
                from = @meta.range.to.index + 2
                @source = @source[from..-1].strip
                @xtemplate = load_xtemplate
            end
        end
        attr_reader :config

        def namespace
            @config['namespace']
        end

        def xtemplate_styles
            if @xtemplate.nil? or @xtemplate.styles.empty?
                ''
            else
                css = @xtemplate.styles
                "/* #{namespace} */".endl + css
            end
        end

        def is_root
            ns = @config['namespace']
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
                requires = @config.imports.map{|k,v| "#{k} = require('#{v}')"}.join(',')
                ctx[:requires] = "var #{requires};"
            else
                ctx[:imports] = ctx[:requires] = ''
            end

            ctx[:xtemplate] = if not @xtemplate.nil?
                js = ["require('$root.browser.template')"]
                @xtemplate.templates.each do |data, t|
                    id = data.split(',').first
                    js << ".set('#{id}',#{t})".indent(4)
                end
                js.join("\n").indent(4) + ';'
            else
                ''
            end
            
            ctx[:meta] = @meta.to_ecma.to_comment.endl
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

        alias :name :namespace
        alias :styles :xtemplate_styles
        
        private
        def read_module_config
            raise "#{@path} has not module config!" unless @source.index(CONFIG_PATTERN).zero?
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
            xtpl_path = File.absolute_path @path.sub(/\.js$/,'.html')
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
            init
        end

        attr_reader :dependency
        attr_reader :src_dir

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
            @modules[m.namespace] = m
            @dependency[m.namespace] = cfg.imports.nil? ? [] : cfg.imports.values
        end

        alias :update_module :add_module

        def rescan
            init.scan
        end

        def release(output_dir, overwrite = false)
            raise "#{output_dir} not exits!" unless File.exists? output_dir
            styles = StringIO.new
            @modules.each do |namespace, m|
                segment = Utils.namespace_to_file_path(m.namespace)
                path = "#{output_dir}/#{segment}.js"
                raise "#{path} already exists!" if !overwrite and File.exists?(path)
                yield path if block_given?
                
                #javascript
                FileUtils.mkpath(File.dirname(path))
                File.open(path,'w:utf-8'){|f| f.write m.to_amd}
                
                #style
                styles.puts m.styles
                styles.puts
            end
            css_file_path = "#{output_dir}/#{Aztec.name('.css')}"
            File.open(css_file_path, 'w') do |f|
                yield css_file_path if block_given?
                f.puts styles.string.strip
            end
        end

        def [](namespace)
            @modules[namespace]
        end

        def dependency_hash
            @dependency.tsort
        end

        def dependency_of(mod, include_self = false)
            mod == '$root' ? [mod] : _dependency_of(mod, include_self).unshift('$root').uniq
        end

        def save_dependency_graph(filename)
            require 'graphviz'
            if (Object.const_get(:GraphViz) rescue nil).nil?
                $stderr.puts "GraphViz gem not installed, try `[sudo] gem install ruby-graphviz`"
                return
            end
            init.scan
            GraphViz::new(:G, :type => :digraph) do |g|
                @dependency.each do |name, depends|
                    n = g.add_node name
                    depends.each{|dep|g.add_edges n, g.add_node(dep)}
                end
            end.output :png => filename
        end

        private
        def init
            @modules = {}
            @dependency = TsortableHash.new
            @dependency['$root'] = []
            @dependency['jQuery'] = []
            self
        end

        def _dependency_of(mod, include_self)
            m = @modules[mod]
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
    man = Aztec::JsModuleManager.new('../src',:verbose => true)
    man.scan
    #puts Aztec::JsModule.new(File.read("#{File.dirname(__FILE__)}/../src/ui/UIControl.js")).to_amd
    #Aztec::JsModuleManager.new('src').scan.save_dependency_graph 'module_dependency.png'
    #puts Aztec::JsModuleManager.new('src').scan.dependency_hash
    
    #pp man.dependency_hash
    #pp man.dependency_of("$root", true)
    #puts Aztec::JsModule.new("../src/aztec.js").to_amd
    #puts man['$root.browser.console'].xtemplate_styles
    man.release(File.absolute_path('../release'), true) {|path| puts "Writting #{path}"}
end
