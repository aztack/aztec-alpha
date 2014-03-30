#encoding:utf-8
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

$:.unshift File.dirname(__FILE__)
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
end
require 'aztec/common'
require 'aztec/utils'
require 'aztec/xtemplate'
require 'aztec/js_module_config'
require 'aztec/js_module'
require 'aztec/js_module_manager'