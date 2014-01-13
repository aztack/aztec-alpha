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
    tplMain,
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

tplMain = tpl('main');
tplLine = tpl('line');
$container = $(tplMain);

function main(){
    $container.appendTo(document.body);
    $content = $container.find('.ui-console-content');  
}

$(main);

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
