/**
 * ---
 * description: Table
 * namespace: $root.ui.table
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _enum: $root.lang.enumerable
 *   _arguments: $root.lang.arguments
 *   _template: $root.browser.template
 *   $: jQuery
 *   _tpl: $root.browser.template
 * exports:
 * - Table
 * - DataSource
 * files:
 * - src/ui/table.js
 */

;define('ui/table',[
    'lang/type',
    'lang/string',
    'lang/enumerable',
    'lang/arguments',
    'browser/template',
    'jQuery',
    'browser/template'
], function (_type,_str,_enum,_arguments,_template,$,_tpl){
    //'use strict';
    var exports = {};
        _tpl
            .set('$root.ui.Table.table',"<table class=\"ui-table\">\n<thead class=\"ui-thead\"></thead>\n<tbody class=\"ui-tbody-loading\"><tr><td>Loading</td></tr></tbody>\n<tbody class=\"ui-tbody-nodata\"><tr><td>No Data</td></tr></tbody>\n<tbody class=\"ui-tbody-data\"></tbody>\n<tfoot class=\"ui-tfoot\"></tfoot>\n</table>\n");
        var varArg = _arguments.varArg,
      tpl = _template.id$('$root.ui.Table');
    
    var DataSource = _type.create('$root.ui.DataSource', Array, {
      init: function(opts) {
        opts = opts || {};
        this.$attr('options', opts);
        var ad = opts.ajaxData = opts.ajaxData || {};
        ad.method = ad.method || 'get';
        ad.contentType = ad.contentType || 'application/json';
        if (opts.data) {
          this.$attr('data', opts.data);
        }
      },
      getData: function(success, process, failed) {
        var opts = this.options,
          url = opts.url,
          self = this;
        if (!url && !this.data) {
          throw new Error('Both data and url are empty!Forgot set url of data source?');
        }
        this.$attr('onSuccess', (success = success || _fn.noop), 'rw');
        this.$attr('onProcess', (process = process || _fn.return1st), 'rw');
        this.$attr('onFailed', (failed = failed || _fn.noop), 'rw');
        if (this.data) {
          success.call(this, this.data);
        } else {
          $.ajax(url, opts.ajaxData, function(resp) {
            var result = resp;
            if (process) {
              result = process.call(this, resp);
            }
            self.$attr('data', result);
            success.call(this, result);
          }, failed);
        }
        return this;
      },
      refresh: function() {
        return this.getData(this.onSuccess, this.onProcess, this.onFailed);
      }
    });
    
    var Table = _type.create('$root.ui.Table', jQuery, {
      init: function() {
        var va = varArg(arguments, this)
          .when('string', 'plainObject', function(sel, opt) {
            return [this.base(sel), opt];
          })
          .when('string', function(sel) {
            return [this.base(sel), {}];
          })
          .when('plainObject', function(opt) {
            return [this.base(Table.Template.Table, opt)];
          })
          .when(function() {
            return [this.base(Table.Template.Table), {}];
          });
    
        return va.invoke(function(self, opts) {
          this.$attr('options', opts);
          if (opts.columns) {
            this.setColumns(opts.columns);
          }
          if (opts.data) {
            this.setData(opts.data);
          }
          if (opts.url) {
            this.data = new DataSource(opts);
          }
          this.$attr('header', this.find('thead'), 'r');
          this.$attr('footer', this.find('tfoot'), 'r');
          this.$attr('body', this.sigil('data'), 'r');
          this.setStatus(Table.Status.Loading);
        });
      },
      setColumns: function() {
        var self = this;
        varArg(arguments, this)
          .when('arrayLike', function(columns) {
            var ths = _enum.map(columns, function(col) {
              return _str.format('<th>{0}</th>', [col]);
            }).join('');
            this.header.empty().append('<tr>' + ths + '</tr>');
            this.sigil('.loading').find('td:first').attr('colspan', columns.length);
            this.sigil('.nodata').find('td:first').attr('colspan', columns.length);
          })
          .otherwise(function(args) {
            this.setColumns.call(this, args);
          }).resolve();
        return this;
      },
      setData: function(data, notTriggerEvent) {
        this.$attr('data', data);
        if (!notTriggerEvent) {
          this.trigger(Table.Events.OnSetData, [data]);
        }
        Table_setData(self, data);
      },
      addRow: function() {},
      addColumn: function() {},
      clearAll: function() {
    
      },
      setStatus: function(status) {
        if (status == Table.Status.Loading) {
          this.find('tbody').hide();
          this.sigil('.loading').show();
        } else if (status == Table.Status.NoData) {
          this.find('tbody').hide();
          this.sigil('.nodata').show();
        } else {
          throw new Error("Don't know status:" + status + ', see Table.Status');
        }
        return this;
      }
    }).statics({
      Template: {
        Table: tpl('table')
      },
      Events: {
        OnSetData: 'SetData(event,data)'
      },
      Status: {
        Loading: 'loading',
        NoData: 'nodata'
      }
    });
    
    function Table_setData(self, data) {
      var va,
        ds = new DataSource(data);
    }
        
    ///sigils
    if (!Table.Sigils) Table.Sigils = {};
    Table.Sigils[".loading"] = ".ui-tbody-loading";
    Table.Sigils[".nodata"] = ".ui-tbody-nodata";
    Table.Sigils[".data"] = ".ui-tbody-data";

    exports['Table'] = Table;
    exports['DataSource'] = DataSource;
    exports.__doc__ = "Table";
    return exports;
});
//end of $root.ui.table
