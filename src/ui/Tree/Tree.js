({
    description: 'Tree',
    namespace: $root.ui.tree,
    directory: 'ui/Tree',
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string,
        _fn: $root.lang.fn,
        _tpl: $root.browser.template,
        _arguments: $root.lang.arguments,
        _enum: $root.lang.enumerable,
        $: jQuery
    },
    exports: [
        Tree
    ]
});

var tpl = _tpl.id$('$root.ui.Tree'),
    varArg = _arguments.varArg,
    toArray = _arguments.toArray;

var TreeNode = _type.create('$root.ui.TreeNode', jQuery, {
    init: function() {
        varArg(arguments, this)
            .when('jqueryOrElement', function(ele) {
                var data = {}, jq = $(ele);
                data.checked = jq.hasClass('checked');
                data.expand = jq.hasClass('expand');
                return [ele, data];
            })
            .when('jqueryOrElement', '{*}', _arguments.asArray)
            .invoke(function(ele, data) {
                this.base(ele);
                this.$attr('nodeData', data);
            });
    },
    expaned: function() {
        //TODO
    },
    collapse: function() {
        //TODO
    }
});

var Tree = _type.create('$root.ui.Tree', jQuery, {
    init: function() {
        varArg(arguments, this)
            .same(['string'], ['jqueryOrElement'], function(arg) {
                this.base(arg);
                return [{}];
            })
            .same(['string', '{*}'], ['jqueryOrElement', '{*}'], function(arg, opts) {
                this.base(arg);
                return [opts];
            })
            .when('plainObject', function(opts) {
                this.base('<div>');
                return [opts];
            })
            .invoke(function(opts) {
                this.$attr('options', opts);
                this.addClass('ui-tree')
                    .append('<ul class="root">');
                Tree_initialize(this, opts);
            });
    },
    setData: function(data) {
        var root = this.$get('root'),
            opts = this.$get('options'),
            nodes = [];
        root.empty();
        this.$attr('nodeData', data);
        Tree_createTree(this, opts, root, data, 0, nodes);
        this.data('nodes', nodes);
    },
    eachNode: function(callback) {
        var nodes = this.data('nodes');
        if (!nodes || nodes.length === 0) return this;
        _enum.each(nodes, function(node, index) {
            return callback.call(this, node, index);
        }, this, true);
        return this;
    },
    setTitle: function() {

    }
}).events({
    OnNodeSelected: 'NodeSelected(event,text,nodeData,node).Tree'
}).statics({
    Fn: {
        OnNodeSelected: Tree_onNodeSelected
    }
});

function Tree_initialize(self, opts) {
    var root = self.children().filter('ul');
    self.$attr('root', root);

    if (opts.noCheckbox) {
        self.addClass('nocheckbox');
    }

    if (typeof opts.onNodeSelected != 'function') {
        opts.onNodeSelected = Tree.Fn.OnNodeSelected;
    }

    root.delegate('li', 'click', function(e) {
        var li = $(e.target).closest('li'),
            nodeData = li.data('nodeData'),
            text = typeof nodeData == 'string' ? nodeData : nodeData.text;
        self.trigger(Tree.Events.OnNodeSelected, [text, new TreeNode(li[0], nodeData)]);
        return false;
    }).delegate('.expander', 'click', function(e) {
        var li = $(e.target).closest('li'),
            nodeData = li.data('nodeData');
        opts.onNodeSelected(self, li, nodeData);
        return false;
    }).delegate('.checkbox', 'click', function(e) {
        var li = $(e.target).closest('li'),
            nodeData = li.data('nodeData');
        nodeData.checked = !nodeData.checked;
        if (nodeData.checked) {
            _check(li);
        } else {
            _uncheck(li);
        }
        return false;
    });

    if (opts.data) {
        self.setData(opts.data);
    }
}

function Tree_climbUp(self, li, root, callback) {
    var ul = li.parent();
    if (ul !== root) {
        callback.call(self, ul);
        Tree_climbUp(self, ul, root, callback);
    }
}

function Tree_onNodeSelected(self, li, nodeData) {
    var branch = li.find('>ul');
    if (!nodeData.items || nodeData.items.length === 0) return;
    if (branch.is(':visible')) {
        branch.hide();
        nodeData.expand = false;
        _collapse(li);
    } else {
        branch.show();
        nodeData.expand = true;
        _expand(li);
    }
}

function Tree_createNode(li, nodeData, indent) {
    varArg([nodeData], li)
        .when('plainObject', function(data) {
            return [data];
        })
        .when('->', function(calc) {
            var data = calc.call(this);
            Tree_createNode.call(this, data);
        })
        .when('*', function(text) {
            return [{
                text: String(text)
            }];
        })
        .invoke(function(nodeData) {
            if (nodeData.items && nodeData.items.length > 0) {
                if (nodeData.expand) {
                    _expand(this);
                } else {
                    this.find('>ul').hide();
                    _collapse(this);
                }
            }
            if (nodeData.checked) {
                _check(this);
            } else {
                _uncheck(this);
            }
            if (nodeData.checkbox) {
                this.find('.checkbox').css('display', 'inline-block');
            }
            this.sigil('.text').text(nodeData.text);
            this.data('nodeData', nodeData);
        });
    return li;
}

function Tree_createTree(self, opts, root, data, indent, nodes) {
    var indentUnit = opts.indent || 12;
    _enum.each(data, function(item, index, _, ary) {
        var n = $(tpl('node')),
            branch;
        if (_type.isArray(item.items)) {
            nodes.push(Tree_createNode(n, item, indent));
            if (data.length - 1 === index) {
                n.addClass('last');
            }
            branch = $('<ul>').appendTo(n).css('margin-left', ++indent * indentUnit + 'px');
            n.addClass('more');
            Tree_createTree(self, opts, branch, item.items, indent, nodes);
        } else {
            nodes.push(Tree_createNode(n, item));
            if (ary.length - 1 == index) {
                n.addClass('last');
            }
        }
        root.append(n);
    });
}

function _check(jq) {
    jq.addClass('checked');
}

function _uncheck(jq) {
    jq.removeClass('checked');
}

function _expand(jq) {
    jq.addClass('open').removeClass('close')
        .sigil('.expander').first().addClass('open-expander').removeClass('close-expander');
}

function _collapse(jq) {
    jq.addClass('close').removeClass('open')
        .sigil('.expander').first().addClass('close-expander').removeClass('open-expander');
}
