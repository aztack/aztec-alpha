# encoding:utf-8
require 'rkelly'
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
			
		end

		def dependency
			
		end

		def exports
			
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
		end

		def to_amd
			
		end

		private
		def read_module_config
			first_node = @ast.value.shift
			parenthetical_node = first_node.value
			config = Utils::JsModuleConfigToJsonVisitor.new.accept(parenthetical_node.value);
			config = config.chop if config.end_with? ';'
			puts config
			@config = JSON.parse(config)
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

Aztec::JsModule.new("../src/lang/type.js")