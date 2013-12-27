# encoding:utf-8
require 'rkelly'
require 'execjs'
require 'json'
require 'tsort'
require 'erubis'
require 'fuzzy_match'

require File.expand_path('common.rb')

module Aztec

	class TsortableHash < Hash
		include TSort
		alias tsort_each_node each_key
		def tsort_each_child(node, &block)
			fetch(node).each(&block)
		end
	end

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

		def [](key)
			@config[key]
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

			#TODO
			#check_exports_existence
		end
		attr_reader :config

		def name
			@config['namespace']
		end

		def to_amd
			tpl = <<-AMD
			<%=@meta%>
			define("<%=@name%>",[<%=@imports%>],function(exports){
				<%=@requires%>
				<%=@original%>
				<%=@exports%>
			});
			AMD
			tpl.gsub!(tpl[/^\s+/],'')
			eruby = Erubis::Eruby.new(tpl)
			ctx = Erubis::Context.new
			ctx[:name] = name
			ctx[:imports] = @config.imports.values.map(&:single_quote).join(',')
			requires = @config.imports.map{|k,v| "#{k} = require('#{v}')"}.join(',')
			ctx[:meta] = @meta.to_ecma.to_comment
			ctx[:requires] = "var #{requires};"
			ctx[:original] = @ast.to_ecma
			exported = []
			
			exports = @config.exports.map do |name|
				if declared?(name)
					"exports['#{name}'] = #{name};\n  "
					exported << name
				else
					real_name = find_similiar_decl(name[1...-1], exported)
					#puts "#{name}=#{real_name}"
					if real_name != nil
						throw "Can not find #{name} to export! Do you mean #{real_name} instead of #{name}?"
					end
				end
			end.join
			ctx[:exports] = exports
			code = eruby.evaluate ctx
			RKelly::Parser.new.parse(code).to_ecma
		end

		private
		def read_module_config
			first_node = @ast.value.shift
			@meta = parenthetical_node = first_node.value
			config = Utils::JsModuleConfigToJsonVisitor.new.accept(parenthetical_node.value);
			config = config.chop if config.end_with? ';'
			@config = JsModuleConfig.new config
		end

		def decl_nodes
			if @decls.nil?
				@decls = @ast.pointcut(RKelly::Nodes::FunctionDeclNode).matches.to_a +
					@ast.pointcut(RKelly::Nodes::VarDeclNode).matches.to_a
			end
			@decls.uniq
		end
		def declared?(value)
			not decl_nodes.find{|n|n.value == value}.nil?
		end

		def find_similiar_decl(name,exclude)
			decls_names = decl_nodes.map do |n|
				n.is_a?(RKelly::Nodes::FunctionDeclNode) ? n.value : n.name
			end
			candidates = decls_names - exclude
			FuzzyMatch.new(candidates).find(name)
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

		def dependency_graph
		end
	end
end

puts Aztec::JsModule.new("../src/lang/type.js").to_amd