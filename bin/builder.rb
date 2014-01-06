# encoding:utf-8
require 'rkelly'
require 'json'
require 'tsort'
require 'erubis'

require File.expand_path('common.rb',File.dirname(__FILE__))

module Aztec

	module Message
		def self.ExportsNotFound(name)
			"warning:#{name} not found in var statement or function declaration\n"
		end
	end

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
	end

	#
	# JavaScript module
	#
	class JsModule
		def initialize(path)
			@source = File.read path, :encoding=>'utf-8'
			@ast = ::RKelly::Parser.new.parse @source rescue nil
			throw "There are SytaxError in #{path}!" if @ast.nil?
			read_module_config
			from = @meta.range.to.index + 2
			@source = @source[from..-1].strip
		end
		attr_reader :config

		def namespace
			@config['namespace']
		end

		def is_root
			ns = @config['namespace']
			ns == '$root' || ns["."].nil?
		end

		alias :name :namespace

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
			ctx[:returnstatement] = has_last_return_statement ? '' : 'return exports;'
			code = eruby.evaluate ctx
			code.gsub(/\t/,'  ')
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

		def has_last_return_statement
			@ast.value.last.is_a? RKelly::Nodes::ReturnNode
		end

		#  //#include '/path/to/file'
		PREPROCESS_PATTERN = /\n*(?<indent>\s*)\/\/#(?<code>.*)\n*/
		def preprocess
			while (match = @source.match PREPROCESS_PATTERN)
				puts match
				code, str = match[:code], match.string
				@source[str] = begin
					self.instance_eval(code).enclose("\n")
				rescue => e
					str.sub('//','//!')
				end
			end
		end

		#
		# builtin preprocess functions
		#
		def include(path)
			relative_path = File.expand_path(path, @path)
			File.read relative_path, :encoding => 'utf-8'
		end

		def echo(arg)
			"#{arg}"
		end
	end

	#
	# Module manager
	#
	class JsModuleManager
		def initialize(src_dir, exclude = [])
			@src_dir = src_dir
			@exclude = exclude
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
			m = JsModule.new js_file
			cfg = m.config
			@modules[m.namespace] = m
			@dependency[m.namespace] = cfg.imports.nil? ? [] : cfg.imports.values
		end

		alias :update_module :add_module

		def rescan
			init.scan
		end

		def release(output_dir)
			
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
			init.scan_dir
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
	man = Aztec::JsModuleManager.new('../src').scan
	#puts Aztec::JsModule.new(File.read("#{File.dirname(__FILE__)}/../src/ui/UIControl.js")).to_amd
	#Aztec::JsModuleManager.new('src').scan.save_dependency_graph 'module_dependency.png'
	#puts Aztec::JsModuleManager.new('src').scan.dependency_hash
	#puts man.dependency_hash
	#pp man.dependency_of("$root", true)
	puts Aztec::JsModule.new("../src/aztec.js").to_amd
end