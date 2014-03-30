#encoding:utf-8
module Aztec
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
            c = @config[key] = a.send(merege_method, b)
            c.uniq! if c.respond_to? :uniq!
        end
    end
end