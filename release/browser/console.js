// ({
//   description: "console",
//   version: '0.0.1',
//   namespace: $root.browser.console,
//   imports: {
//     _type: $root.lang.type,
//     _str: $root.lang.string,
//     _tpl: $root.browser.template,
//     $: jQuery
// },
//   exports: [open, close, log, error]
// })

;define('$root.browser.console',['$root.lang.type','$root.lang.string','$root.browser.template','jQuery'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),_str = require('$root.lang.string'),_tpl = require('$root.browser.template'),$ = require('jQuery');
    require('$root.browser.template')
    .set('$root.browser.console.main',"<div class=\"ui-console\">\n\t\t\t\t\t<div class=\"ui-console-content\"></div>\n\t\t\t\t</div>")
    .set('$root.browser.console.line',"\n\t\t\t\t<div class=\"ui-content-line\">\n\t\t\t\t\t<span class=\"ui-console-prompt\"></span>\n\t\t\t\t\t<span class=\"ui-console-text\"></span>\n\t\t\t\t</div>\n\t\t");
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
  exports['open'] = open;
    exports['close'] = close;
    exports['log'] = log;
    exports['error'] = error;
    return exports;
});
//end of $root.browser.console
