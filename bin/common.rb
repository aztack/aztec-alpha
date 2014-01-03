# encoding:utf-8

class ::String
	def double_quoted?
		self.start_with? '"' and self.end_with? '"'
	end

	def double_quote
		double_quoted? ? self : %Q|"#{self}"|
	end

	def single_quoted?
		self.start_with? "'" and self.end_with? "'"
	end

	def single_quote
		single_quoted? ? self : %Q|'#{self}'|
	end

	def quoted?
		double_quoted? or single_quoted?
	end

	def unquote
		quoted? ? self[1...-1] : self
	end

	def indent(n)
		self[Regexp.new("^"+' '*n)] ? self : self.gsub!(/^/,' '*n)
	end

	def to_comment
		self.gsub!(/^/,'// ')
	end

	def endl
		self << "\n"
	end

	def enclose(s)
		s + self + s
	end

	def as_file(extension)
		ext = if extension.start_with? "."
			extension
		else
			extension[1..-1]
		end
		path = File.dirname(self) + File::Separator + File.basename(self,".*") + ext
		path.gsub("\\",File::Separator)
	end
end