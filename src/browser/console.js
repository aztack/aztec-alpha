({
	description: "console",
	version: '0.0.1',
	namespace: $root.browser.console,
	imports: {
		_type: $root.lang.type,
		_str: $root.lang.string,
		_tpl: $root.browser.template,
		$: jQuery
	},
	exports: [
		open,
		close,
		log,
		error
	]
});

//vars
var console = exports,
  $container,
  $content,
	tplLine,
	tpl = _tpl.id$('$root.browser.console');

//helper

//impl
function puts(s){
	var line = $(tplLine).text(s).show();
  line.appendTo($content);
	line[0].scrollIntoView(true);
	return console;
}

//exports
function open() {
	$container.show();
}

function close() {
  $container.hide();
}

function log(s) {
	puts(s);
}

function error() {
	puts(s);
}

$(function(){
  $container = $(tpl('main'));
  $content = $container.find('.ui-console-content').show();
	tplLine = tpl('line');
	$container.appendTo(document.body);
});