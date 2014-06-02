#encoding:utf-8
module Aztec
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
            @config['files'] = [path.sub(%r|^.*/src|,'')]
            parse
        end
        def basename
            File.basename(@path)
        end

        def dup
            JsModule.new(@path)
        end

        def <=>(other)
            k = 'priority'
            a, b = @config[k] || 0, other.config[k] || 0
            a <=> b
        end

        def release_path
            Utils.namespace_to_file_path namespace
        end

        attr_reader :config
        attr_reader :source
        attr_reader :path
        
        def parse(drop_config_object = true)
            if @config.notransform
                @ast = nil
                @source = @source.sub CONFIG_PATTERN, ''
                @xtemplate = nil
            else
                begin
                    @ast = ::RKelly::Parser.new.parse(@source)
                rescue Rkelly::SytaxError
                end
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

                #TODO
                #sass
            end
        end

        def is_root
            ns = @config.namespace
            ns == '$root' || ns["."].nil?
        end

        def to_amd
            tpl = is_root ?  "<%=@meta%>\n<%=@original%>\n" : Utils.load_template(:amd)
            eruby = Erubis::Eruby.new tpl
            ctx = prepare_context
            code = eruby.evaluate ctx
            code.gsub(/\t/,'  ')
        end

        def to_requirejs
            tpl = Utils.load_template :requirejs
            eruby = Erubis::Eruby.new tpl
            ctx = prepare_context
            code = eruby.evaluate ctx
            code.gsub(/\t/,'  ')
        end

        def to_umd
            tpl = Utils.load_template :umd
            eruby = Erubis::Eruby.new tpl
            ctx = prepare_context
            code = eruby.evaluate ctx
            code.gsub(/\t/,'  ')
        end

        def prepare_context
            ctx = Erubis::Context.new
            ctx[:notransform] = @config.notransform
            ctx[:config] = @config
            ctx[:ver] = @config.ver
            ctx[:name] = name
            ctx[:name_requirejs] = Utils.namespace_to_file_path(name)
            imports = @config.imports
            
            #xtemplate
            if not @xtemplate.nil? and @xtemplate.templates.size > 0
                js = []
                @xtemplate.templates.each do |data, t|
                    id = data.split(',').first
                    js << ".set('#{id}',#{t})".indent(8)
                end
                js.join("\n").indent(4) + ';'
                ctx[:xtemplate_amd] = ["require('$root.browser.template')"].concat(js).join("\n")+ ';'
                ctx[:xtemplate_requirejs] = ["_tpl"].concat(js).join("\n")+ ';'
                imports['_tpl'] = '$root.browser.template';
            else
                ctx[:xtemplate_amd] = ctx[:xtemplate_requirejs]  = ''
            end

            #imports
            if not imports.size.zero?
                ctx[:imports] = imports
                ctx[:imports_amd] = imports.values.map{|e|"'#{e}'"}.join(',')
                
                requires = imports.map{|k,v| "#{k} = require('#{v}')"}.join(",")
                ctx[:requires] = "var #{requires};"
                ctx[:imports_requirejs] = imports.size == 0 ? '' : imports.values.map{|e|"'#{Utils.namespace_to_file_path(e)}'"}.join(', ')
            else
                ctx[:imports] = ctx[:imports_amd] = ctx[:imports_requirejs] = {}
                ctx[:requires] = ''
            end

            #sigils
            if not @xtemplate.nil?
                ctx[:sigils] = "\n///sigils\n".indent(4)
                @xtemplate.sigils.each do |sigil_class, sigils|
                    js = ["if (!#{sigil_class}.Sigils) #{sigil_class}.Sigils = {};"]
                    #js << sigils.inject([%Q["length": #{sigils.size}].indent(4)]) do |all, (sigil, selector)|
                    js << sigils.inject([]) do |all, (sigil, selector)|
                       all << %Q[#{sigil_class}.Sigils["#{sigil}"] = "#{selector}";]
                    end.join("\n")

                    js = js.join("\n").indent(4);                    
                    #$stdout.puts js
                    if not declared?(sigil_class)
                        js = "//ERROR:sigils defined in xtemplate but variable or function #{sigil_class} not found"
                        js = js.to_comment
                    end
                    ctx[:sigils] << js.endl
                end
            end
            
            ctx[:meta] = @config.to_ecma.to_multiline_comment.endl
            #preprocess
            ctx[:original] = is_root ? @source : @source.indent(4)
            ctx[:usestrict] = "//'use strict';"
            
            #exports
            doc = "\n" + ("exports.__doc__ = " + @config['description'].inspect + ";").indent(4)
            exports = @config.exports
            if not exports.size.zero?
                ctx[:exports] = @config.exports.map do |name|
                    c = "exports['#{name}'] = #{name};".indent(4)
                    c = c.to_comment unless declared?(name)
                    c
                end.join("\n").lstrip
                ctx[:exports] << doc
            else
                ctx[:exports] = doc
            end

            ctx[:returnstatement] = if @config.returns.nil?
                ctx['custom_return'] = false;
                'return exports;'
            else
                ctx['custom_return'] = true;
                "return #{@config.returns};"
            end
            ctx
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
            cfg = @source[CONFIG_PATTERN]
            begin
                first_node = ::RKelly::Parser.new.parse cfg
                @meta = parenthetical_node = first_node.value[0].value
                config = Utils::JsModuleConfigToJsonVisitor.new.accept(parenthetical_node.value);
                config = config.chop if config.end_with? ';'
                @config = JsModuleConfig.new config
            rescue => e
                $stderr.puts cfg
                raise "There is syntax error(s) in above module config!"
            end
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
            #xtpl_path = JsModule.src_dir + @path.sub(/\.js$/,'.html')
            xtpl_path = @path.sub(/\.js$/,'.html')
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
end