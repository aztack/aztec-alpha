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
$man = Aztec::JsModuleManager.new('../src',['/ui/']).scan
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
	@mod = params[:module]
	rescan @mod
	erb :test
end

get "/demo/:module" do
	m = params[:module]
	rescan m
	path = ns_to_relative_path(m,'.html')
	readfile path
end

get "/scripts/:module" do
	m = params[:module]
	content_type "text/javascript"
	@mods = $man.dependency_of(m, true)
	js = @mods.join("\n").to_comment.endl
	js << @mods.inject("") do |code, mod|
		if $man[mod].nil?
			$stderr.puts "Can not found module #{mod}!"
			code
		else
			code << $man[mod].to_amd
		end
	end
end

get "/rescan/:module" do
	m = params[:module]
	if m.nil?
		$man.rescan
	else
		rescan m
	end
	"Done! #{m}"
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
