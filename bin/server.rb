# encoding:utf-8
require 'pp'
require 'json'
require 'pry'
require 'rkelly'
require 'erubis'
require 'sinatra'

require File.expand_path('common.rb',File.dirname(__FILE__))
require File.expand_path('builder.rb',File.dirname(__FILE__))
$ROOT = File.absolute_path(File.dirname(__FILE__) + "/../")
$stdout.puts "$ROOT=#{$ROOT}"

def ns_to_relative_path(m, ext)
    m.gsub(".",File::Separator).sub('$root','src') + ext
end

def readfile(path)
    $stdout.puts "reading file: #{path}"
    File.read path, :encoding => 'utf-8'
end

def rescan(m)
    #path = ns_to_relative_path(m, ".js")
    #path = "#{$ROOT}/#{path}"
    #$stdout.puts "Updating #{path}"
    files = $man[m].config.files
    if files.size == 1
        $man.update_module "#{$ROOT}/src/#{files.first}"
    else
        m = $man.update_module "#{$ROOT}/src/#{files.shift}"
        files.each do |p|
            jm = Aztec::JsModule.new p
            m << jm
        end
    end
end

$stdout.puts "Loading JavaScript Module Manager..."
$man = Aztec::JsModuleManager.new("#{$ROOT}/src",:exclude => ['/ui/'], :verbose => true).scan
$stdout.puts "Releasing Code..."
$man.release(File.absolute_path("#{$ROOT}/release"), true)
#$stdout.puts "Dependency hash:", $man.dependency_hash
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
    readfile "#{$ROOT}/#{path}"
end

get "/test/:module" do
    $man.rescan
    @mod = params[:module]
    erb :test
end

get "/demo/:module" do
    m = params[:module]
    rescan m
    #binding.pry
    path = $man[m].config.files.first.sub('.js','.html')
    readfile "#{$ROOT}/src/#{path}" rescue ''
end

get "/scripts/:module" do
    $man.rescan
    m = params[:module]
    content_type "text/javascript"
    $man.js_with_dependency m
end

get "/styles/:module" do
    m = params[:module]
    content_type = "text/css"
    $man.css_with_dependency m
end

__END__
@@test
<html>
<body>
<script type="text/javascript" src="/scripts/<%=@mod%>"></script>
<script type="text/javascript" src="/static/test/test.js"></script>
<script type="text/javascript" src="/static/test/<%=@mod%>.js"></script>
</body>
</html>