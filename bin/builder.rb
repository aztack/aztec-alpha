# encoding:utf-8
require 'rkelly'
require 'execjs'
require 'json'

module Aztec

	module Utils
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

		def imports
			@config['imports']
		end

		def exports
			@config['exports']	
		end
	end

	#
	# JavaScript module
	#
	class JsModule
		def initialize(path)
			@path = path
			@source = File.read path, :encoding=>'utf-8'
			@ast = ::RKelly::Parser.new.parse @source
			read_module_config
			check_exports_existence
		end
		attr_reader :config

		def to_amd
			"$root = {};" +
			@config.imports.map{|k,v|"#{k} = '#{v};'"}.join("\n") + "\n" +
			@ast.to_ecma
		end

		private
		def read_module_config
			first_node = @ast.value.shift
			parenthetical_node = first_node.value
			config = Utils::JsModuleConfigToJsonVisitor.new.accept(parenthetical_node.value);
			config = config.chop if config.end_with? ';'
			@config = JsModuleConfig.new config
		end

		def check_exports_existence
			@js_context = nil;
			@config.exports.each do |name|
				node = node_with_value(RKelly::Nodes::FunctionDeclNode, name)
				if node.nil?
					node = node_with_value(RKelly::Nodes::VarDeclNode, name)
					if node.nil? and !in_exports?(name)
						throw "Can not found #{name} to exports in #{@path}"
					end
				end
			end
		end

		def in_exports?(name)
			transformed_source_code = to_amd
			puts transformed_source_code
			@js_context = ExecJS.compile(transformed_source_code) if @js_context.nil?
			not @js_context.eval("exports['#{name}']").nil?
		end

		def node_with_value(type, value)
			@ast.pointcut(type).matches.to_a.find{|n|n.value == value}
		end
	end

	#
	# Module manager
	#
	class JsModuleManager
		def initialize(src_root_dir)
			@dir = src_root_dir
			@modules = {}
			scan_dir
		end

		def scan_dir
			Dir["#{@dir}/**/*.js"].each do |js_file|
				puts js_file
				m = JsModule.new js_file
				@modules[m.namespace] = m
			end
		end

		def release(output_dir)
			
		end

		def [](namespace)
			@modules[namespace]
		end
	end
end

puts Aztec::JsModule.new("../src/lang/type.js").config.exports