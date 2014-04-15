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
			.when('plainObject', function(opt) {
				return [this.base(Table.Template.Table, opt)];
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
		var self = this;
		varArg(arguments, this)
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
				this.$attr('data', data);
				Table_setData(this, type, data);
			});
		return this;
	},
	addRow: function() {
		varArg(arguments, this)
			.when('arrayLike', function(row) {
				var data = this.$get('data');
				data.push(row);
				this.refresh();
			})
			.otherwise(function(args) {
				this.addRow.call(this, args);
			}).resolve();
		return this;
	},
	addColumn: function() {
		varArg(arguments, this)
			.when('arrayLike', function(col) {
				var data = this.$get('data'),
					len = data.length,
					i = 0;
				for (; i < len; ++i) {
					data[i].push(col[i] || '');
				}
				this.refresh();
			})
			.otherwise(function(args) {
				this.addColumn.call(this, args);
			}).resolve();
		return this;
	},
	clearAll: function() {
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
		Table: tpl('table')
	},
	Events: {
		OnSetData: 'SetData(event,data)'
	},
	Status: {
		Loading: 'loading',
		NoData: 'nodata',
		Data: 'data'
	}
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
}

var fmt_td = '<td>{0}</td>',
	fmt_tr = '<tr>{0}</tr>';

function td(x) {
	return _str.format(fmt_td, [x]);
}

function tr(x) {
	return _str.format(fmt_tr, [x]);
}

function array_to_table(data) {
	return _enum.map(data, function(row) {
		var a = tr(_enum.map(row, td).join(''));
		return a;
	}).join('');
}

function Table_setData(self, type) {
	var args = _arguments.toArray(arguments, 2),
		html;

	function doSetData(html) {
		self.body.html(html);
		self.setStatus(Table.Status.Data);
	}
	html = varArg(args, self)
		.when('array<array>', function(data) {
			return [array_to_table(data)];
		})
		.when('array<object>', function(data) {
			var headers = _object.keys(data[0]);
			this.setHeader(headers);
			return [array_to_table(data)];
		})
		.when(DataSource.constructorOf, function(dataSrc) {
			dataSrc.getData(function(data) {
				Table_setData.call(self, data);
			});
		})
		.invoke(doSetData);
	return self;
}