# encoding:utf-8
require 'pp'
require 'json'
require 'pry'
require 'rkelly'
require 'erubis'
require 'sinatra'

require File.expand_path('common.rb',File.dirname(__FILE__))
require File.expand_path('builder.rb',File.dirname(__FILE__))
$ROOT = File.dirname(__FILE__) + '/..'

def ns_to_relative_path(m, ext)
    m.gsub(".",File::Separator).sub('$root','src') + ext
end

def readfile(relative_path)
    path = "#{$ROOT}/#{relative_path}"
    $stdout.puts "reading file: #{path}"
    File.read path, :encoding => 'utf-8'
end

def rescan(m)
    path = ns_to_relative_path(m, ".js")
    path = "#{$ROOT}/#{path}"
    $stdout.puts "Updating #{path}"
    $man.update_module path
end

$stdout.puts "Loading JavaScript Module Manager..."
$man = Aztec::JsModuleManager.new('../src',:exclude => ['/ui/'], :verbose => true).scan
$stdout.puts "dependency hash:", $man.dependency_hash
$stdout.puts "Done!"

set :public_folder, $ROOT

get "/modules" do
    $man.dependency.to_json
end

get "/module/:module" do
    m = params[:module]
    content_type "text/javascript"
    begin
        $man[m].to_amd
    rescue => e
        $stderr.puts "#{m} not found!"
        $stderr.puts e.to_s
    end
end

get "/static/*" do
    path = params[:splat].first
    path = path.sub('$root.','')
    if path[".js"]
        content_type "text/javascript"
    elsif path[".css"]
        content_type "text/stylesheet"
    end
    readfile path
end

get "/test/:module" do
    $man.rescan
    @mod = params[:module]
    erb :test
end

get "/demo/:module" do
    m = params[:module]
    rescan m
    path = ns_to_relative_path(m,'.html')
    readfile path
end

get "/scripts/:module" do
    $man.rescan
    m = params[:module]
    content_type "text/javascript"
    @mods = $man.dependency_of(m, true)
    js = @mods.join("\n").to_comment.endl
    js << @mods.inject("") do |code, mod|
        if $man[mod].nil?
            $stderr.puts "Can not found module #{mod}!"
            code
        else
            #code << $man[mod].to_amd
            code << $man.to_ecma(mod)
        end
    end
end

get "/styles/:module" do
    m = params[:module]
    content_type = "text/css"
    @mods = $man.dependency_of(m, true)
    css = @mods.inject("") do |code, mod|
        if $man[mod].nil?
            $stderr.puts "Can not found module #{mod}!"
            code
        else
            code << $man[mod].xtemplate_styles
        end
    end
end

__END__
@@test
<script type="text/javascript" src="/scripts/<%=@mod%>"></script>
<script type="text/javascript" src="/static/test/test.js"></script>
<script type="text/javascript" src="/static/test/<%=@mod%>.js"></script>
