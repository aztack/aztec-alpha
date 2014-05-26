({
    description: 'Paginator',
    namespace: $root.ui.paginator,
    directory: 'ui/Paginator',
    imports: {
        _type: $root.lang.type,
        _num: $root.lang.number,
        _str: $root.lang.string,
        _tpl: $root.browser.template,
        _arguments: $root.lang.arguments,
        _list: $root.ui.list,
        $: jQuery
    },
    exports: [
        Paginator,
        create
    ]
});

var varArg = _arguments.varArg,
    List = _list.List;
/**
 *
 */
var Paginator = _type.create('$root.ui.paginator.Paginator', List, {
    init: function() {
        varArg(arguments, this)
            .when(function() {
                return [null, null];
            })
            .when('{*}', function(opt) {
                return [null, opt];
            })
            .when('*', function(arg) {
                return [arg, null];
            })
            .when('*', '{*}', function(arg, opts) {
                return [arg, opts];
            })
            .invoke(function(arg, opts) {
                opts = Paginator.options(opts || {});
                this.base.call(this, arg || opts.containerTag, opts);
                this.$attr('options', opts);
                opts = this.options;
                this.$attr('total', opts.total || 0);
                this.$attr('perPage', opts.perPage || 10);
                this.$attr('page', opts.page || 0);
                Paginator_initialize(this, opts);
            });
        return this;
    },
    setPageIndex: function(index) {
        index = _num.confined(index, 0, this.totalPage - 1, index < 0);
        this.$attr({
            'pageIndex': index,
            'page': index + 1
        });
        var currentPage = 'current-page',
            ratioText = _str.format(this.options.ratioFormat, this);
        this.find('.current-page').removeClass(currentPage);
        this.find('.ratio').text(ratioText);
        Paginator_updateButtonWithPageNumber(this, this.options, index);
        return this;
    },
    setPage: function(page) {
        if (page < 1) page = 1;
        return this.setPageIndex(page - 1);
    },
    nextPage: function() {
        return this.setPage(this.page + 1);
    },
    prevPage: function() {
        return this.setPage(this.page - 1);
    },
    setTotal: function(total) {
        if (total < 0) throw new Error('total must be positive!');
        this.$attr('total', total);
        return this.setPage(this.page);
    },
    setPerPage: function(perPage) {
        if (perPage < 0) throw new Error('perPage must be positive!');
        this.$attr('perPage', perPage);
        return this.setPage(this.page);
    }
}).events({
    OnPageChanged: 'PageChanged(event,index,prevIndex,text).Paginator'
}).options({
    page: 1,
    index: 0,
    perPage: 10,
    total: 0,
    maxButtonNumber: 10,
    firstPageButton: '<<',
    lastPageButton: '>>',
    prevPageButton: '<',
    nextPageButton: '>',
    buttonLayout: '<<|<|.|>|>>|?/?',
    containerClass: 'ui-paginator',
    itemClass: 'ui-paginator-item',
    ratioFormat: '{page}/{totalPage}',
    onCreateButton: null,
    alwaysTriggerPageChangedEvent: false
});

function Paginator_initialize(self, opts) {
    var totalPage = Math.ceil(self.total / self.perPage),
        sel = opts.itemClass;

    self.$attr('totalPage', totalPage);

    self.delegate('.' + sel, 'click', function(e) {
        var target = $(e.target),
            act = target.data('action'),
            pageIndex = target.data('index'),
            prevIndex = self.pageIndex;
        if (typeof pageIndex == 'undefined') {
            if (act == 'prev' && prevIndex > 0) {
                pageIndex = prevIndex - 1;
            } else if (act == 'next' && prevIndex < self.totalPage - 1) {
                pageIndex = prevIndex + 1;
            } else if (act == 'first') {
                pageIndex = 0;
            } else if (act == 'last') {
                pageIndex = self.totalPage - 1;
            } else {
                return;
            }
        }
        if (pageIndex === prevIndex && !opts.alwaysTriggerPageChangedEvent) return;
        self.setPageIndex(pageIndex)
            .trigger(Paginator.Events.OnPageChanged, [pageIndex, prevIndex, target.text()]);
    });
    if (opts.page) {
        self.$attr('page', opts.page);
        self.$attr('pageIndex', opts.page - 1);
    } else if (opts.pageIndex != null) {
        self.$attr('pageIndex', opts.pageIndex);
        self.$attr('page', opts.pageIndex + 1);
    }

    Paginator_makeButtons(self, opts);
}

function Paginator_makeButtons(self, opts) {
    var i, k = 0,
        totalPage = self.totalPage,
        layout = opts.buttonLayout.split('|'),
        btn, opt = {
            itemClass: opts.itemClass.substr(1)
        }, userCreatedButton;

    for (k = 0; k < layout.length; ++k) {
        btn = layout[k];
        if (btn == '<<' || btn == 'first') {
            self.add(opts.firstPageButton, opt).addClass('first-page').data('action', 'first');
        } else if (btn == '<' || btn == 'prev') {
            self.add(opts.prevPageButton, opt).data('action', 'prev').addClass('prev-page');
        } else if (btn == '.') {
            Paginator_updateButtonWithPageNumber(self, opts, self.pageIndex);
        } else if (btn == '>' || btn == 'next') {
            self.add(opts.nextPageButton, opt).data('action', 'next').addClass('next-page');
        } else if (btn == '>>' || btn == 'last') {
            self.add(opts.lastPageButton, opt).addClass('last-page').data('action', 'last');
        } else if (btn == '?/?' || btn == 'ratio') {
            self.add(_str.format(opts.ratioFormat, self)).addClass('ratio');
        } else {
            if (typeof opts.onCreateButton == 'function') {
                userCreatedButton = opts.onCreateButton.call(this, btn);
                if (userCreatedButton) self.add(userCreatedButton);
            }
        }
    }
}

function Paginator_updateButtonWithPageNumber(self, opts, index) {
    var max = opts.maxButtonNumber,
        item, buttons = self.find('.ui-paginator-button'),
        from, to, pos, i, idx = 'data-index',
        currentPage = 'current-page'
    cls = 'ui-paginator-button',
    rangeChanged = false;
    from = index - Math.floor(max / 2);
    to = from + max - 1;
    if (from < 0) {
        from = 0;
        to = max - 1;
    } else if (to >= self.totalPage) {
        to = self.totalPage;
        from = to - max + 1;
    }
    rangeChanged = from != buttons.first().data('index') || to - 1 != buttons.last().data('index');
    if (!buttons.length) {
        for (i = from; i < to; ++i) {
            item = self.add(i + 1).attr(idx, i).addClass(cls);
            if (i === index) item.addClass(currentPage);
        }
    } else if (rangeChanged) {
        pos = buttons.first().index() - 1;
        buttons.remove();
        for (i = from; i < to; ++i) {
            item = self.insert(i + 1, pos++).attr(idx, i).addClass(cls);
            if (i === index) item.addClass(currentPage);
        }
    } else {
        $(buttons.get(index - from)).addClass(currentPage);
    }
}