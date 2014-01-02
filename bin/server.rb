# encoding:utf-8
require 'rkelly'
require 'nokogiri'
require 'json'
require 'erubis'
require 'sinatra'
require 'pp'

require File.expand_path('common.rb',File.dirname(__FILE__))
require File.expand_path('builder.rb',File.dirname(__FILE__))
$ROOT = File.dirname(__FILE__) + '/..'

def readfile(relative_path)
	path = "#{$ROOT}/#{relative_path}"
	$stdout.puts "reading file: #{path}"
	File.read path, :encoding => 'utf-8'
end

$stdout.puts "Loading JavaScript Module Manager..."
man = Aztec::JsModuleManager.new('../src',['/ui/']).scan
$stdout.puts "Done!"

set :public_folder, $ROOT

get "/modules" do
	man.dependency.to_json
end

get "/module/:module" do
	m = params[:module]
	content_type "text/javascript"
	begin
		man[m].to_amd
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
	@mod = params[:module]
	#mod.sub(/^$root\./,'')
	erb :test
end

get "/demo/:module" do
	m = params[:module]
	path = m.gsub(".",File::Separator).sub('$root','src')
	"<h1>#{path}</h1>"
end

get "/scripts/:module" do
	m = params[:module]
	content_type "text/javascript"
	@mods = ['$root'] + man.dependency_of(m, true)
	js = @mods.inject("") do |code, mod|
		code << man[mod].to_amd
	end
	js << @mods.map(&:to_comment).join("\n")
end

__END__
@@insert_script
;(function(){
	<% @mods.each do |src| %>
	var s = document.createElement('script');
	s.src = '<%=src%>';
	document.head.appendChild(s);
	<% end %>
}());

@@test
<script type="text/javascript" src="/scripts/<%=@mod%>"></script>
<script type="text/javascript" src="/static/test/test.js"></script>
<script type="text/javascript" src="/static/test/<%=@mod%>.js"></script>
