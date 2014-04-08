# encoding: utf-8
require 'rubygems'
require 'fileutils'
require 'rbconfig'
require 'colorize'
require 'thor'
require 'erubis'
require 'pp'

require File.expand_path("bin/aztec/common.rb",File.dirname(__FILE__))

# windows console GBK patch
$OS = :unix
if RbConfig::CONFIG['host_os'] =~ /mswin|mingw|cygwin/
    $OS = :windows
    require 'win32console'
    class ::String
        def to_con
            self.encode('gbk','utf-8') rescue self
        end

        def from_con
            self.encode('utf-8','gbk') rescue self
        end
    end
else
    class ::String
        def to_con;self;end
        def from_con;self;end
    end
end

class A < Thor
    
    ENV['EDITOR'] ||= "sublime_text"
    EDITOR = ENV['EDITOR']
    
    desc 'new_module name[,desc,[,force]]','create a new module with given name'
    def new_module path, desc, force = false
        code = template(:module) do |ctx|
            seg = namespace_segment_of path
            ctx[:namespace] = "$root.#{seg}"
            ctx[:desc] = desc
        end
        try_write_file(path.as_file('.js'), code, force){|js|edit_it? js}
    end

    desc 'new_xtpl name[,desc[,force]]', 'create a xtemplate(html) file for module'
    def new_xtpl path, desc, force = false
        code = template(:xtemplate) do |ctx|
            seg = namespace_segment_of path            
            ctx[:namespace] = "$root.#{seg}"
            ctx[:desc] = desc
        end
        try_write_file(path.as_file('.html'), code, force){|js|edit_it? js}
    end

    no_commands do
        def namespace_segment_of(path)
            seg = path.sub(/^src[\/\\]/,'').gsub(/\/|\\/,'.').sub(/\.js$/,'')
        end
        def editor
            if EDITOR.nil?
                throw "Please set enironment variable EDITOR!" 
            else
                EDITOR
            end
        end

        def template(name)
            eruby = Erubis::Eruby.new File.read("bin/#{name}.erb")
            ctx = Erubis::Context.new
            yield ctx
            eruby.evaluate ctx
        end

        def try_write_file(path, content, force)
            if !force and File.exists? path
                throw "#{path} already exits!"
            else
                File.write(path, content, :encoding => 'utf-8')
                $stdout.puts "Done!"
                yield path
            end
        end

        def edit_it?(path)
            $stdout.puts "Do you want to edit `#{path}'?"
            if $stdin.gets.strip =~ /y|yes/i
                path = File.realpath path
                `#{EDITOR} "#{path}"`
            end
        end
    end
end