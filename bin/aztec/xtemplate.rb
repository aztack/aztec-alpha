#encoding:utf-8
module Aztec
	class XTemplate
        XTEMPLATE_ID_ATTR = 'xtemplate'
        XTEMPLATE_ID_ATTR_SEL = '[xtemplate]'
        XTEMPLATE_SIGIL_ATTR = 'sigil'
        XTEMPLATE_SIGIL_ATTR_SEL = '[sigil]'

        def initialize(path)
            @path = path
            @source = File.read path, :encoding => 'utf-8'
            @doc = ::Nokogiri::HTML @source
            @sigils = {}
            collect_styles
            collect_templates
        end

        attr_reader :styles, :templates, :sigils

        private
        def collect_styles
            style_nodes = @doc.css('style').reject{|n|n.attr 'ignore'}
            @styles = if style_nodes.size > 0
                css = style_nodes.map(&:text).join('\n').strip
                css.size == 0 ? '' : css.dedent_block.sub(/^\n*/,'').rstrip
            else
                ''
            end
        end

        def collect_templates
            template_nodes = @doc.css(XTEMPLATE_ID_ATTR_SEL)
            @templates = if template_nodes.size > 0
                template_nodes.inject({}) do |tpls, ele|
                    #collect sigils before attributes were removed
                    collect_sigils ele

                    id = ele.attr XTEMPLATE_ID_ATTR
                    ele.remove_attribute XTEMPLATE_ID_ATTR
                    ele.remove_attribute XTEMPLATE_SIGIL_ATTR
                    inline_style = ele.attr('style').to_s.gsub(%r|\s*display\s*:\s*none;*\s*|,'')
                    if inline_style.size < 4
                        ele.remove_attribute 'style'
                    else
                        ele.set_attribute('style', inline_style)
                    end
                    remove_interal_attrs ele
                    html = ele.name.downcase == 'script' ? ele.inner_html : ele.to_html
                    id = id.split(',').first
                    tpls[id] = Nokogiri::XML(html,&:noblanks).to_html.inspect
                    #$stdout.puts tpls[id]
                    tpls
                end
            else
                ''
            end
        end

        def get_selector_from(sigil, ele)
            if sigil[0] == '.'
                clazz = ele.attr('class')
                if clazz.nil? or clazz.empty?
                    throw "#{sigil} has no corresponding class attribute!"
                else
                    '.' + clazz.split(' ').first
                end
            elsif sigil[0] == '#'
                id = ele.attr('id')
                if id.nil? or id.empty?
                    throw "#{sigil} has no corresponding id attribute"
                else
                    '#' + id
                end
            else
                ele.name
            end
        end

        def collect_sigils(xtemplate_node)
            sigil_class = xtemplate_node.attr('sigil-class')
            #$stdout.puts xtemplate_node.css(XTEMPLATE_SIGIL_ATTR_SEL).map{|e|e.attr(XTEMPLATE_SIGIL_ATTR)}
            #$stdout.puts xtemplate_node.to_html
            return if sigil_class.nil? or sigil_class.empty?
            #binding.pry if @path['dialog']
            @sigils[sigil_class] = {} if not @sigils.has_key?(sigil_class)

            tmp = xtemplate_node.css(XTEMPLATE_SIGIL_ATTR_SEL).inject({}) do |sigils, ele|
                sigil = ele.attr XTEMPLATE_SIGIL_ATTR
                begin
                    sigils[sigil] = get_selector_from sigil, ele
                rescue => e

                end
                #$stdout.puts sigils[sigil]
                sigils
            end
            @sigils[sigil_class].merge! tmp
            
            if sigil = xtemplate_node.attr('sigil')
               @sigils[sigil_class][sigil] = get_selector_from sigil, xtemplate_node
            end
        end

        def remove_interal_attrs(xtemplate_node)
            xtemplate_node.remove_attribute 'sigil-class'
            %w[sigil comment].each do |attr|
                xtemplate_node.css("[#{attr}]").each{|e|e.remove_attribute attr}
            end
        end
    end
end