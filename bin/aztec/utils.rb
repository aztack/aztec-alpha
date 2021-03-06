#encoding:utf-8
module Aztec
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

        def self.file_path_to_namespace(path)
            path.sub(/.*src\//,'$root.').gsub('/','.').sub('.js','')
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
                    @property_nodes.push o
                    code = %Q|"#{o.name}": #{o.value.accept(self)}|
                    @property_nodes.pop
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
end