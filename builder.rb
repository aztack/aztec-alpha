# encoding:utf-8
require 'optparse'
require 'pry'
require 'pp'
require './bin/aztec.rb'

release_dir = "./release/requirejs"
man = Aztec::JsModuleManager.new('src',:verbose => true)

opt_parser = OptionParser.new do |opts|
	opts.banner = "Usage: builder.rb [options]"

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
	watch 'src/.*\.js' do |path|
		$stdout.puts "#{path[0]} saved"
		begin
			man.release_single_js('./release/requirejs', path[0])
			$stdout.puts "Done!"
		rescue => e
			$stderr.puts e
		end
	end
end
