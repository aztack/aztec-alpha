# encoding:utf-8
require 'rkelly'
require 'nokogiri'
require 'json'
require 'erubis'
require 'sinatra'

require File.expand_path('common.rb',File.dirname(__FILE__))
require File.expand_path('builder.rb',File.dirname(__FILE__))

$stdout.puts "Loading JavaScript Module Manager..."
man = Aztec::JsModuleManager.new('../src').scan
$stdout.puts "Done!"

get "/modules" do
	man.dependency.to_json
end

get "/:module" do
	m = params[:module]
	content_type "text/javascript"
	begin
		man[m].to_amd
	rescue => e
		$stderr.puts "#{m} not found!"
		$stderr.puts e.to_s
	end
end

get "/demo/:module" do
	m = params[:module]
	path = m.gsub(".",File::Separator).sub('$root','src')
	"<h1>#{path}</h1>"
end

get "/script/:module" do
	m = params[:module]
	(man.dependency_of(m) << m).map do |mod|
		%Q[<script type="text/javascript" src="/#{mod}"></script>]
	end.join
end


