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
        re = Regexp.new("^[\t ]{#{n}}'")
        self[re] ? self : self.gsub!(/^/,' '*n)
    end
    
    def dedent_block
        firstline = self.sub(/^\n+/,'')
        firstline = firstline[0...firstline.index("\n")]
        return self if firstline.nil? or firstline.empty?
        n = if firstline.index("\t") == 0
            firstline.match(/^(\t)*/).size
        elsif firstline.index(" ") == 0
            firstline.match(/^( )*/).size
        end
        n == 0 ? self : self.gsub(Regexp.new("^[\\t ]{,#{n}}"), '')
    end

    def to_comment
        self.gsub(/^/, '// ')
    end

    def to_multiline_comment
        "/**\n" + self.gsub(/^/, ' * ').rstrip + "\n */"
    end


    def endl
        self << "\n"
    end

    def newline
        "\n" + self
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