/**
 * #Paginator#
 * =========
 * - Dependencies: `lang/type`,`lang/number`,`lang/string`,`lang/array`,`lang/range`,`browser/template`,`lang/arguments`,`ui/list`,`jquery`,`jQueryExt`
 * - Version: 0.0.1
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/paginator', ['lang/type', 'lang/number', 'lang/string', 'lang/array', 'lang/range', 'browser/template', 'lang/arguments', 'ui/list', 'jquery', 'jQueryExt'], factory);
    } else {
        var $root = global.$root,
            exports = $root._createNS('$root.ui.paginator');
        factory($root.lang.type, $root.lang.number, $root.lang.string, $root.lang.array, $root.lang.range, $root.browser.template, $root.lang.arguments, $root.ui.list, jQuery, jQueryExt, exports);
    }
}(this, function(_type, _num, _str, _ary, _range, _tpl, _arguments, _list, $, jqe, exports) {
    'use strict';
    exports = exports || {};
    
    //Features
    //[x] vertical paginator
    //
    
    var varArg = _arguments.varArg,
        List = _list.List;
    /**
     *
     */
    var Paginator = _type.create('$root.ui.Paginator', List, {
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
            this.empty();
            Paginator_makeButtons(this, this.options);
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
        maxButtonNumber: 5,
        firstPageButtonText: '<<',
        lastPageButtonText: '>>',
        prevPageButtonText: '<',
        nextPageButtonText: '>',
        ellipsis: '...',
        buttonLayout: '<<|<|.|>|>>|?/?',
        containerClass: 'ui-paginator',
        itemClass: 'ui-paginator-item',
        ratioFormat: '{page}/{totalPage}',
        onCreateButton: null,
        autoHideButton: true,
        alwaysTriggerPageChangedEvent: false
    }).statics({
        ButtonLayout: {
            Default: '<<|<|.|>|>>|?/?',
            Smart: '<|...|>',
            Layout0: '<<|<|.|>|>>',
            Layout1: '<|...|>'
        }
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
            if (pageIndex != prevIndex) {
                self.setPageIndex(pageIndex);
            }
            if (opts.alwaysTriggerPageChangedEvent || pageIndex != prevIndex) {
                self.trigger(Paginator.Events.OnPageChanged, [pageIndex, prevIndex, target.text()]);
            }
        });
        if (opts.page) {
            self.$attr('page', opts.page);
            self.$attr('pageIndex', opts.page - 1);
        } else if (opts.pageIndex != null) {
            self.$attr('pageIndex', opts.pageIndex);
            self.$attr('page', opts.pageIndex + 1);
        }
    
        function showHideNextPrevButtons(e, index) {
            var nextPageButton = self.find('.next-page'),
                prevPageButton = self.find('.prev-page');
            if (index === self.totalPage - 1) {
                nextPageButton.hide();
            } else if (index === 0) {
                prevPageButton.hide();
            } else {
                prevPageButton.show();
                nextPageButton.show();
            }
        }
    
        if (opts.autoHideButton) {
            self.on(Paginator.Events.OnPageChanged, showHideNextPrevButtons);
        }
    
        Paginator_makeButtons(self, opts);
        showHideNextPrevButtons(null, self.pageIndex);
    }
    
    function Paginator_makeButtons(self, opts) {
        var i, k = 0,
            totalPage = self.totalPage,
            layout = opts.buttonLayout.split('|'),
            btn, opt = {
                itemClass: opts.itemClass
            },
            userCreatedButton;
    
        for (k = 0; k < layout.length; ++k) {
            btn = layout[k];
            if (btn == '<<' || btn == 'first') {
                self.add(opts.firstPageButtonText, opt).addClass('first-page').data('action', 'first');
            } else if (btn == '<' || btn == 'prev') {
                self.add(opts.prevPageButtonText, opt).data('action', 'prev').addClass('prev-page');
            } else if (btn == '.') {
                Paginator_makeNumberedButton(self, opts, self.pageIndex);
            } else if (btn == '>' || btn == 'next') {
                self.add(opts.nextPageButtonText, opt).data('action', 'next').addClass('next-page');
            } else if (btn == '>>' || btn == 'last') {
                self.add(opts.lastPageButtonText, opt).addClass('last-page').data('action', 'last');
            } else if (btn == '?/?' || btn == 'ratio') {
                self.add(_str.format(opts.ratioFormat, {
                    page: self.page,
                    totalPage: self.totalPage
                })).addClass('ratio');
            } else if (btn == '...' || btn == 'ellipsis') {
                Paginator_makeNumberedButton(self, opts, self.pageIndex, true);
            } else {
                if (typeof opts.onCreateButton == 'function') {
                    userCreatedButton = opts.onCreateButton.call(this, btn);
                    if (userCreatedButton) self.add(userCreatedButton);
                }
            }
        }
    }
    
    function Paginator_makeNumberedButton(self, opts, index, withEllipsis) {
        var max = opts.maxButtonNumber,
            mid, page = index + 1,
            item, buttons = self.find('.ui-paginator-button'),
            from, to, pos, i, idx = 'data-index',
            currentPage = 'current-page',
            ellipsis = opts.ellipsis,
            total = self.totalPage,
            items, fmt, btncls = 'ui-paginator-button';
    
    
        if (withEllipsis) {
            if (total <= max) {
                self.add(_ary.fromRange(1, max));
            } else {
                fmt = function(page, tag, itemCls) {
                    var cls = itemCls ? ' class="' + itemCls + ' ' + btncls + '"' : '';
                    return _str.format('<{0}{2} data-index="{3}">{1}</{0}>', tag, page, cls, page - 1);
                };
                if (_range.create('[)', 1, max).covers(page)) {
                    items = self.add(_ary.fromRange(1, max - 1), fmt);
                    $(items.get(index)).addClass(currentPage);
    
                    self.add(ellipsis).addClass('ellipsis');
                    self.add(total).attr('data-index', total - 1);
                } else if (_range.create('[]', max, total - max + 1).covers(page)) {
                    mid = Math.floor(max / 2);
                    self.add(1).attr('data-index', 1);
                    self.add(ellipsis).addClass('ellipsis');
    
                    items = self.add(_ary.fromRange(index - mid, index + mid), fmt);
                    $(items.get(mid + 1)).addClass(currentPage);
    
                    self.add(ellipsis).addClass('ellipsis');
                    self.add(total).attr('data-index', total - 1);
                } else if (_range.create('(]', total - max + 1, total).covers(page)) {
                    mid = Math.floor(max / 2);
                    self.add(1).attr('data-index', 1);
                    self.add(ellipsis).addClass('ellipsis');
    
                    items = self.add(_ary.fromRange(total - max + 1, total), fmt);
                    $(items.get(index - total + max)).addClass(currentPage);
                }
            }
        } else {
            from = index - Math.floor(max / 2);
            to = from + max - 1;
            if (from < 0) {
                from = 0;
                to = max - 1;
            } else if (to >= total) {
                to = self.totalPage - 1;
                from = to - max + 1;
            }
            for (i = from; i <= to; ++i) {
                item = self.add(i + 1).attr(idx, i).addClass(btncls);
                if (i === index) item.addClass(currentPage);
            }
        }
    }
        
    ///sigils

    exports['Paginator'] = Paginator;
//     exports['create'] = create;
    exports.__doc__ = "Paginator";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.paginator
