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
				self.$attr('data', result);
				success.call(this, result);
			}).fail(failed);
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
			this.$attr('header', this.find('thead'));
			this.$attr('footer', this.find('tfoot'));
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
				}).join('');
				this.header.empty().append('<tr>' + ths + '</tr>');
				this.sigil('.loading').find('td:first').attr('colspan', headers.length);
				this.sigil('.nodata').find('td:first').attr('colspan', headers.length);
			})
			.otherwise(function(args) {
				this.setHeader.call(this, args);
			}).resolve();
		return this;
	},
	setFooter: function() {
		var td = this.footer.find('td');
		varArg(arguments, this)
			.when('htmlFragment', function(html){
				td.html(html);
			})
			.when('string', function(text){
				td.text(text);
			})
			.when('*', function(arg){
				td.text(arg.toString());
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
				var data = this.$get('data');
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
		var data = this.$get('data'),
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
				var data = this.$get('data'),
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
		return this;
	},
	getCell: function(row, col) {
		var tr = this.body.find('tr').get(row);
		return $(tr).find('td').get(col);
	},
	clearAll: function() {
		//TODO
		this.$set('data', this.data);
	},
	setStatus: function(status) {
		if (status == Table.Status.Loading) {
			this.find('tbody').hide();
			this.sigil('.loading').show();
		} else if (status == Table.Status.NoData) {
			this.find('tbody').hide();
			this.sigil('.nodata').show();
		} else if (status == Table.Status.Data) {
			this.find('tbody').hide();
			this.sigil('.data').show();
		} else {
			throw new Error("Don't know status:" + status + ', see Table.Status');
		}
		return this;
	},
	refresh: function() {
		var data = this.$get('data');
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
	}
}).events({
	OnSetData: 'SetData(event,data).Table',
	OnRowClicked: 'RowClicked(event,target,rowData,rowIndex).Table',
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

	self.body.delegate('tr', 'click', function(e) {
		var tr = $(this),
			i = tr.data('i'),
			data = self.$get('data'),
			d = data[i];
		self.trigger(Table.Events.OnRowClicked, [e.target, d, i, tr[0]]);
	});

	self.header.delegate('th', 'click', function(e) {
		var ths = self.header.find('th'),
			i = ths.index(this),
			text = $(this).text();
		self.trigger(Table.Events.OnHeaderClicked, [e.target, i, text]);
	})
}

var fmt_td = '<td>{0}</td>',
	fmt_tr = '<tr data-i="{1}">{0}</tr>';

function td(x) {
	return _str.format(fmt_td, [x]);
}

function tr(x, i) {
	return _str.format(fmt_tr, [x, i]);
}

function array_to_table(data) {
	return _enum.map(data, function(row, i) {
		var a = tr(_enum.map(row, td).join(''), i);
		return a;
	}).join('');
}

function Table_setData(self, type) {
	var args = _arguments.toArray(arguments, 2),
		opts = self.$get('options'),
		html;
	html = varArg(args, self)
		.when('array<array>', function(data) {
			self.$attr('data', data);
			return [array_to_table(data)];
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
			self.$attr('data', data);
			return [array_to_table(data)];
		})
		.when(DataSource.constructorOf, function(dataSrc) {
			dataSrc.getData(function(data) {
				Table_setData.call(null, self, type, data);
			});
		})
		.invoke(function(html) {
			self.body.html(html);
			if (self.header.parent() != self.body.parent()) {
				Table_adjustColumnWidthAgainstHeaderWidth(self);
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