# encoding:utf-8
require 'optparse'
require 'fileutils'
require 'pry'
require 'pp'
require './bin/aztec.rb'

man = Aztec::JsModuleManager.new('src',:verbose => true)

opt_parser = OptionParser.new do |opts|
	opts.banner = "builder.rb [options] or `watchr builder.rb`"

	opts.on('-g [png]','generate dependency graph') do |png|
		man.save_dependency_graph(png || 'module_dependency.png')
		$stdout.puts 'Done!'
	end
	
	opts.on('-d','print dependency hash') do
		man.scan
		pp man.dependency_hash
	end
	
	opts.on('-r [output_dir,overwrite,spec]', Array ,'release code to output_dir,spec=[amd|requirejs]') do |args|		
		output_dir, overwrite, spec = *args
		
		release_dir = File.absolute_path './release'
		default_output_dir = File.absolute_path './release/requirejs'

		if output_dir.nil?
			output_dir = default_output_dir
		else
			output_dir = File.absolute_path output_dir
		end
		
		overwrite = !!output_dir[release_dir] if overwrite.nil?
		spec = :requirejs if spec.nil?

		if File.absolute_path(output_dir)[File.absolute_path('./src')]
			$stderr.puts "DO NOT release code into the source directory!!!"
			exit
		end

		man.scan

		$stdout.puts "Output Directory: #{output_dir}"
		$stdout.puts "Overwrite: #{overwrite}"
		$stdout.puts "Output Spec: #{spec}"
		$stdout.puts "Release?(y/n)"
		if $stdin.gets.strip =~ /y|yes/i
			man.release output_dir, overwrite, spec.to_sym do |path|
				$stdout.puts path
			end
			$stdout.puts "Copying Images..."
			FileUtils.cp_r "src/ui/images/*", "#{output_dir}/ui/images"
			$stdout.puts 'Done!'
		end
	end

	opts.on_tail("-h", "--help", "Show this message") do
		puts opts
		exit
	end

end

opt_parser.parse! ARGV

if $0 =~/watchr/
	man.scan
	$stdout.puts "Start watching..."
	watch 'src/.*\.(js|html)' do |path|
		path = path[0]
		path.sub!('.html','.js')
		$stdout.write "#{path} saved."
		begin
			man.release_single_js('./release/requirejs', path) do |namespace|
				$stdout.write "Re-generate..."
			end
			$stdout.puts " Done!"
		rescue => e
			$stderr.puts e
		end
	end
end
