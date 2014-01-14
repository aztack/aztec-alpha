/**
 * ---
 * description: Base class for all UI controls
 * namespace: $root.ui
 * imports:
 *   _type: $root.lang.type
 *   _tpl: $root.browser.template
 *   _event: $root.browser.event
 *   $: jQuery
 * exports:
 * - UIControl
 * files:
 * - ../src/ui/UIControl.js
 * - ../src/ui/UIControl.dev.js
 */

;define('$root.ui',['$root.lang.type','$root.browser.template','$root.browser.event','jQuery'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _tpl = require('$root.browser.template'),
        _event = require('$root.browser.event'),
        $ = require('jQuery');
        
    ///xtemplate
    require('$root.browser.template')
            .set('$root.ui.UIControl',"<div>\n            \n        </div>");
        var tpl = _tpl.id$('$root.ui'),
        EventEmitter = _event.EventEmitter;
    
    var UIControl = _type.create('UIControl', EventEmitter, {
        initialize: function(options) {
            var clazz = this.getClass(),
                template = options.container || clazz.template(),
                cont;
            UIControl.all(clazz.typename(), clazz);
    
            cont = this.$ = $(template, options.props);
            cont.addClass('ui-control');
            if (options.css) {
                cont.css(options.css);
            }
            if (options.appendTo) {
                cont.appendTo(options.appendTo);
            }
            if (options.prependTo) {
                cont.prependTo(options.prependTo);
            }
        },
        getOptions: function() {
            return {};
        },
        getContainer: function() {
            return this.$;
        },
        parentControl: function() {
            return null;
        },
        dragable: function() {
            return false;
        }
    }).statics(function() {
        var registeredControls = {},
            template = tpl('UIControl');
    
        return {
            template: function() {
                return template;
            },
            all: function(namespace, control) {
                if (!_type.isEmpty(namespace)) {
                    if (_type.isFunction(control)) {
                        registeredControls[namespace] = control;
                        return this;
                    } else {
                        return registeredControls[namespace];
                    }
                } else {
                    return registeredControls;
                }
            },
            createOptions: function() {
                return {};
            }
        };
    });
    // ../src/ui/UIControl.dev.js
    /**
     * UIControl visual development support part
     */
    UIControl.statics({
      dev: function () {
        this.dev = true;
      }
    });
    exports['UIControl'] = UIControl;
    return exports;
});
//end of $root.ui
