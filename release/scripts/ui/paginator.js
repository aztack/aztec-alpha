/**
 * ---
 * description: Paginator
 * namespace: $root.ui.paginator
 * directory: ui/Paginator
 * imports:
 *   _type: $root.lang.type
 *   _num: $root.lang.number
 *   _str: $root.lang.string
 *   _tpl: $root.browser.template
 *   _arguments: $root.lang.arguments
 *   _list: $root.ui.list
 *   $: jQuery
 * exports:
 * - Paginator
 * - create
 * files:
 * - src/ui/Paginator/Paginator.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/paginator',['lang/type','lang/number','lang/string','browser/template','lang/arguments','ui/list','jQuery'], factory);
    } else {
        var exports = $root._createNS('$root.ui.paginator');
        factory($root.lang.type,$root.lang.number,$root.lang.string,$root.browser.template,$root.lang.arguments,$root.ui.list,jQuery,exports);
    }
}(this, function (_type,_num,_str,_tpl,_arguments,_list,$,exports) {
    //'use strict';
    exports = exports || {};
    
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
      setIndex: function(index) {
        index = _num.confined(index, 0, this.totalPage - 1, index < 0);
        this.$attr({
          'pageIndex': index,
          'page': index + 1
        });
        var currentPage = 'current-page',
          ratioText = _str.format(this.options.ratioFormat, this);
        this.find('.current-page').removeClass(currentPage);
        this.find('[data-index=' + index + ']').addClass(currentPage);
        this.find('.ratio').text(ratioText);
        return this;
      },
      setPage: function(page) {
        if(page < 1) page = 1;
        return this.setIndex(page - 1);
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
      OnPageChanged: 'PageChanged(event,page,prevPage,text).Paginator'
    }).options({
      page: 1,
      index: 0,
      perPage: 10,
      total: 0,
      maxButtonNumber: 10,
      firstPage: '<<',
      lastPage: '>>',
      prevPage: '<',
      nextPage: '>',
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
        self.setIndex(pageIndex)
          .trigger(Paginator.Events.OnPageChanged, [pageIndex, prevIndex, target.text()]);
      });
      if(opts.page) {
        self.setPage(opts.page);
      } else if(opts.pageIndex != null) {
        self.setIndex(opts.pageIndex);
      }
    
      Paginator_makeButtons(self, opts);
    }
    
    function Paginator_makeButtons(self, opts) {
      var k = 0,
        totalPage = self.totalPage,
        i, idx = 'data-index',
        layout = opts.buttonLayout.split('|'),
        btn, opt = {
          itemClass: opts.itemClass.substr(1)
        }, userCreatedButton, max = opts.maxButtonNumber,
        from, to;
      
      from = self.pageIndex - Math.floor(max /2);
      to = from + max;
    
      if(from < 0) {
        from = 0;
        to = max - 1;
      } else if(to >= self.totalPage) {
        to = self.totalPage - 1;
        from = to - max + 1;
      }
    
      for (k = 0; k < layout.length; ++k) {
        btn = layout[k];
        if (btn == '<<' || btn == 'first') {
          self.add(opts.firstPage, opt).addClass('first-page').data('action', 'first');
        } else if (btn == '<' || btn == 'prev') {
          self.add(opts.prevPage, opt).data('action', 'prev');
        } else if (btn == '.') {
          for (i = from; i < to ; ++i) {
            self.add(i + 1, opt).attr('data-index', i);
          }
        } else if (btn == '>' || btn == 'next') {
          self.add(opts.nextPage, opt).data('action', 'next');
        } else if (btn == '>>' || btn == 'last') {
          self.add(opts.lastPage, opt).addClass('last-page').data('action', 'last');
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
        
    ///sigils

    exports['Paginator'] = Paginator;
//     exports['create'] = create;
    exports.__doc__ = "Paginator";
    return exports;
}));
//end of $root.ui.paginator
