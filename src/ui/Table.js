({
	description: 'Table',
	namespace: $root.ui.table,
	imports: {
		_type: $root.lang.type,
		_str: $root.lang.string,
		_object: $root.lang.object,
		_enum: $root.lang.enumerable,
		_fn: $root.lang.fn,
		_arguments: $root.lang.arguments,
		_template: $root.browser.template,
		$: jQuery
	},
	exports: [
		Table,
		DataSource
	]
});

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
			this.$attr('tableData', opts.data);
		}
	},
	getData: function(success, process, failed) {
		var opts = this.options,
			url = opts.url,
			self = this;
		if (!url && !this.data) {
			throw new Error('Both data and url are empty!Forgot set url of data source?');
		}
		this.$attr('onSuccess', (success = success || opts.success || _fn.noop));
		this.$attr('onProcess', (process = process || opts.process || _fn.return1st));
		this.$attr('onFailed', (failed = failed || opts.failed || _fn.noop));
		if (this.data) {
			success.call(this, this.data);
		} else {
			$.ajax(url, opts.ajaxData).done(function(resp) {
				var result = resp;
				if (process) {
					result = process.call(this, resp);
				}
				self.$attr('tableData', result);
				success.call(this, result);
			}).fail(failed);
		}
		return this;
	},
	refresh: function() {
		return this.getData(this.onSuccess, this.onProcess, this.onFailed);
	}
});

/**
 * Table
 */
var Table = _type.create('$root.ui.Table', jQuery, {
	init: function() {
		var va = varArg(arguments, this)
			.when('string', 'plainObject', function(sel, opt) {
				return [this.base(sel), opt];
			})
			.when('string', function(sel) {
				return [this.base(sel), {}];
			})
			.when('plainObject', function(opts) {
				var template = Table.Template.Table;
				if (opts.fixhead || false) {
					template = Table.Template.FixHeadTable;
				}
				return [this.base(template), opts];
			})
			.when(function() {
				return [this.base(Table.Template.Table), {}];
			});

		return va.invoke(function(self, opts) {
			this.$attr('options', opts);
			this.$attr('header', this.sigil('.head'));
			this.$attr('footer', this.sigil('.foot'));
			this.$attr('body', this.sigil('.data'));
			Table_initialize(this, opts);
		});
	},
	setHeader: function() {
		varArg(arguments, this)
			.when('htmlFragment', function(html) {
				this.header.html(html);
			})
			.when('string', function(text) {
				this.header.text(text);
			})
			.when('arrayLike', function(headers) {
				var ths = _enum.map(headers, function(col) {
					return _str.format('<th>{0}</th>', [col]);
				}).join(''),
					lastTr = this.header.children().last(),
					html = '<tr>' + ths + '</tr>';
				if (lastTr.length) {
					lastTr.replaceWith(html);
				} else {
					this.header.empty().append(html);
				}
				Table_adjustColspan(this, headers.length);
			})
			.otherwise(function(args) {
				this.setHeader.call(this, args);
			}).resolve();
		return this;
	},
	setFooter: function() {
		varArg(arguments, this)
			.when('htmlFragment', function(html) {
				this.footer.html(html);
			})
			.when('string', function(text) {
				this.footer.text(text);
			})
			.when('*', function(arg) {
				this.footer.text(arg.toString());
			})
			.resolve();
		return this;
	},
	setData: function() {
		varArg(arguments, this)
			.when('*', function(data) {
				return [data, true, 'text'];
			})
			.when('*', 'string', function(data, type) {
				return [data, true, type];
			})
			.when('boolean', '*', function(isTriggerEvent, data) {
				return [data, isTriggerEvent, 'text'];
			})
			.when('boolean', '*', 'string', function(data, isTriggerEvent, type) {
				return [data, isTriggerEvent, type];
			})
			.invoke(function(data, isTriggerEvent, type) {
				if (isTriggerEvent) {
					this.trigger(Table.Events.OnSetData, [data]);
				}
				var args = [this, type, data].concat(_arguments.toArray(arguments, 3));
				Table_setData.apply(null, args);
			});
		return this;
	},
	insertRow: function() {
		varArg(arguments, this)
			.when('arrayLike', function(row) {
				var data = this.$get('tableData');
				row.length = this.header.find('th').length;
				data.push(row);
				Table_setData(this, 'text', data);
			})
			.otherwise(function(args) {
				this.insertRow.call(this, args);
			}).resolve();
		return this;
	},
	deleteRow: function() {
		var data = this.$get('tableData'),
			tb = this.body.parent()[0];
		varArg(arguments, this)
			.when('int', function(index) {
				data.splice(index, 1);
				tb.deleteRow(index);
			})
			.when('array', function(indexes) {
				var deleted = 0;
				indexes = indexes.sort();
				_enum.each(indexes, function(index) {
					newIndex = index - deleted;
					data.splice(newIndex, 1);
					tb.deleteRow(newIndex);
					deleted += 1;
				});
			})
			.when('jqueryOrElement', function(ele) {
				$(ele).closest('tr').remove();
			})
			.otherwise(function(args) {
				this.deleteRow.call(this, args);
			})
			.resolve();
		return this;
	},
	insertColumn: function() {
		varArg(arguments, this)
			.when('arrayLike', function(col) {
				var data = this.$get('tableData'),
					len = data.length,
					i = 0;
				for (; i < len; ++i) {
					data[i].push(col[i] || '');
				}
				Table_setData(this, 'text', data);
			})
			.otherwise(function(args) {
				this.insertColumn.call(this, args);
			}).resolve();
		return this;
	},
	deleteColumn: function() {
		var self = this,
			data = this.$get('tableData'),
			delcol = function(index) {
				var len = data.length,
					i = 0;
				for (; i < len; ++i) {
					data[i].splice(index, 1);
				}
			};
		varArg(arguments, this)
			.when('int', function(index) {
				delcol.call(self, index);
				Table_setData(self, 'text', data);
			})
			.when('arrayLike', function(indexes) {
				var c = 0;
				_enum.each(indexes.sort(), function(index) {
					delcol.call(self, index - c++);
				});
				Table_setData(self, 'text', data);
			})
			.otherwise(function(args) {
				this.deleteColumn.call(this, args);
			})
			.resolve();
		return this;
	},
	eachCell: function(fn) {
		var data = this.$get('tableData');
		if (typeof fn == 'function') {
			_enum.each(data, function(row, rowIndex) {
				var stop;
				_enum.each(row, function(cellData, colIndex) {
					return (stop = fn.call(this, cellData, rowIndex, colIndex));
				}, this, true);
				return stop;
			}, this, true);
		}
		return this;
	},
	getCell: function(row, col) {
		var tr = this.body.find('tr').get(row),
			cell = $(tr).find('td').get(col);
		return $(cell);
	},
	getCellData: function(row, col) {
		var data = this.$get('tableData');
		return varArg(arguments, this)
			.when('int', 'int', function(row, col) {
				return data[row][col];
			})
			.when('jqueryOrElement', function(jq) {
				if (!jq.jquery) jq = $(jq);
				var col = jq.index(),
					row = jq.parent().index();
				return data[row][col];
			}).args(0);
	},
	clearAll: function() {
		var d = [];
		this.$set('tableData', d);
		Table_setData(this, 'text', d);
		this.setStatus(Table.Status.NoData);
		return this;
	},
	setStatus: function(status) {
		var loadingEle = this.sigil('.loading'),
			nodataEle = this.sigil('.nodata'),
			dataEle = this.sigil('.data');
		if (status == Table.Status.Loading) {
			loadingEle.show();
			nodataEle.hide();
			dataEle.hide();
		} else if (status == Table.Status.NoData) {
			loadingEle.hide();
			nodataEle.show();
			dataEle.hide();
		} else if (status == Table.Status.Data) {
			loadingEle.hide();
			nodataEle.hide();
			dataEle.show();
		} else {
			throw new Error("Don't know status:" + status + ', see Table.Status');
		}
		return this;
	},
	refresh: function() {
		var data = this.$get('tableData');
		if (data instanceof DataSource) {
			data.getData(function(data) {
				Table_setData(this, 'text', data);
			});
		} else {
			Table_setData(this, 'text', data);
		}
	}
}).statics({
	Template: {
		Table: tpl('table'),
		FixHeadTable: tpl('fixHeadTable')
	},
	Status: {
		Loading: 'loading',
		NoData: 'nodata',
		Data: 'data'
	},
	Fn: {
		ProcessTableData: array_to_table
	}
}).events({
	OnSetData: 'SetData(event,data).Table',
	OnCellClicked: 'RowClicked(event,target,row,col).Table',
	OnHeaderClicked: 'HeaderClicked(event,target,index,text).Table'
});

function Table_initialize(self, opts) {
	self.setStatus(Table.Status.Loading);
	if (opts.columns) {
		self.setColumns(opts.columns);
	}
	if (opts.data) {
		self.setData(opts.data);
	}
	if (opts.url) {
		self.data = new DataSource(opts);
	}
	if (!opts.footer) {
		self.footer.remove();
		self.$attr('footer', $());
	}

	self.body.delegate('td', 'click', function(e) {
		var data = self.$get('tableData'),
			td = $(this),
			tr = td.closest('tr'),
			data = self.$get('tableData'),
			col = tr.children().index(td),
			row = tr.parent().children().index(tr);
		self.trigger(Table.Events.OnCellClicked, [e.target, row, col, data[row][col]]);
	});

	self.header.delegate('th', 'click', function(e) {
		var ths = self.header.find('th'),
			i = ths.index(this),
			text = $(this).text();
		self.trigger(Table.Events.OnHeaderClicked, [e.target, i, text]);
	});
}

var fmt_td = '<td>{0}</td>',
	fmt_tr = '<tr>{0}</tr>';

function td(x) {
	return _str.format(fmt_td, [x]);
}

function tr(x) {
	return _str.format(fmt_tr, [x]);
}

function array_to_table(data, opts) {
	var _tr = opts.tr || tr,
		_td = opts.td || td;
	return _enum.map(data, function(row) {
		var a = _tr(_enum.map(row, _td).join(''));
		return a;
	}).join('');
}

function Table_setData(self, type) {
	var args = _arguments.toArray(arguments, 2),
		opts = self.$get('options'),
		process = opts.process || Table.Fn.ProcessTableData,
		html;
	html = varArg(args, self)
		.when('array<array>', function(data) {
			self.$attr('tableData', data);
			return [process(data, opts)];
		})
		.when('array<object>', '*', function(data, transform) {
			var headers = _object.keys(data[0]);
			if (_type.isPlaintObject(transform)) {
				header = _object.map(header, function(n) {
					return transform[n] || '';
				});
			} else if (_type.isFunction(transform)) {
				header = transform(header);
			}
			this.setHeader(headers);
			self.$attr('tableData', data);
			return [process(data, opts)];
		})
		.when(DataSource.constructorOf, function(dataSrc) {
			dataSrc.getData(function(data) {
				Table_setData.call(null, self, type, data);
			});
		})
		.invoke(function(html) {
			self.body.html(html);
			var p1 = self.header.parent(),
				p2 = self.body.parent();
			if (p1 && p2 && p1[0] != p2[0]) {
				Table_adjustColumnWidthAgainstHeaderWidth(self);
			} else {
				Table_adjustColspan(this);
			}
			self.setStatus(Table.Status.Data);
		});
	return self;
}

function Table_adjustColumnWidthAgainstHeaderWidth(self) {
	var ths = self.header.find('th');
	self.body.find('tr:first td').each(function(i, e) {
		$(e).width(ths[i].offsetWidth);
	});
}

function Table_adjustColspan(self, span) {
	var sel = 'td:first',
		attr = 'colspan',
		data = self.$get('tableData');
	if (!data || data.length === 0) return;
	setTimeout(function() {
		span = data[0].length;
		self.sigil('.loading').find(sel).attr(attr, span);
		self.sigil('.nodata').find(sel).attr(attr, span);
		self.footer.find(sel).attr(attr, span);
	}, 0);

}