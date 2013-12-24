# encoding:utf-8

class ::String
	def double_quoted?
		self.start_with? '"' and self.end_with? '"'
	end

	def single_quoted?
		self.start_with? "'" and self.end_with? "'"
	end

	def quoted?
		double_quoted? or single_quoted?
	end
end