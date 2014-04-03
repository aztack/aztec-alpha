# encoding:utf-8
require './aztec.rb'

if __FILE__ == $0
    require 'pp'
    require 'pry'
    $ROOT = File.absolute_path(File.dirname(__FILE__)+'/../')
    $stdout.puts "$ROOT=#{$ROOT}"
    man = Aztec::JsModuleManager.new("#{$ROOT}/src",:verbose => true)
    $stdout.puts "Scanning.."
    man.scan
    #puts Aztec::JsModule.new(File.read("#{File.dirname(__FILE__)}/../src/ui/UIControl.js")).to_amd
    #Aztec::JsModuleManager.new("#{$ROOT}/src",{}).scan.save_dependency_graph 'module_dependency.png'
    #puts Aztec::JsModuleManager.new('src').scan.dependency_hash
    
    #pp man.dependency_hash
    #binding.pry
    #pp man.dependency_of("$root.ui", true)
    #puts Aztec::JsModule.new("../src/aztec.js").to_amd
    #puts man['$root.browser.console'].xtemplate_styles
    release_dir = File.absolute_path("#{$ROOT}/release/requirejs") 
    man.release(release_dir, true, :requirejs) {|path| puts "Writting #{path}"}
    
    #puts man.to_ecma('$root.ui.dialog')
end
