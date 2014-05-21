/**
 * ---
 * description: Color Utils
 * version: 0.0.1
 * namespace: $root.lang.color
 * imports:
 *   _enum: $root.lang.enumerable
 * exports:
 * - BasicColor
 * - ExtendedColor
 * - hexColorString
 * - hexAbbr
 * files:
 * - src/lang/color.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/color',['lang/enumerable'], factory);
    } else {
        var exports = $root._createNS('$root.lang.color');
        factory($root.lang.enumerable,exports);
    }
}(this, function (_enum,exports) {
    //'use strict';
    exports = exports || {};
    
        //http://www.w3.org/TR/css3-color/
    var _basicColor = [{
        name: 'black',
        value: 0x000000,
        rgb: [0, 0, 0]
    }, {
        name: 'silver',
        value: 0xC0C0C0,
        rgb: [192, 192, 192]
    }, {
        name: 'gray',
        value: 0x808080,
        rgb: [128, 128, 128]
    }, {
        name: 'white',
        value: 0xFFFFFF,
        rgb: [255, 255, 255]
    }, {
        name: 'maroon',
        value: 0x800000,
        rgb: [128, 0, 0]
    }, {
        name: 'red',
        value: 0xFF0000,
        rgb: [255, 0, 0]
    }, {
        name: 'purple',
        value: 0x800080,
        rgb: [128, 0, 128]
    }, {
        name: 'fuchsia',
        value: 0xF00FF,
        rgb: [255, 0, 255]
    }, {
        name: 'green',
        value: 0x008000,
        rgb: [0, 128, 0]
    }, {
        name: 'lime',
        value: 0x00FF00,
        rgb: [0, 255, 0]
    }, {
        name: 'olive',
        value: 0x808000,
        rgb: [128, 128, 0]
    }, {
        name: 'yellow',
        value: 0xFFFF00,
        rgb: [255, 255, 0]
    }, {
        name: 'navy',
        value: 0x000080,
        rgb: [0, 0, 128]
    }, {
        name: 'blue',
        value: 0x0000FF,
        rgb: [0, 0, 255]
    }, {
        name: 'teal',
        value: 0x008080,
        rgb: [0, 128, 128]
    }, {
        name: 'aqua',
        value: 0x00FFFF,
        rgb: [0, 255, 255]
    }];
    
    var _extendedColor = [{
        name: 'aliceblue',
        value: 0xF0F8FF,
        rgb: [240, 248, 255]
    }, {
        name: 'antiquewhite',
        value: 0xFAEBD7,
        rgb: [250, 235, 215]
    }, {
        name: 'aqua',
        value: 0x00FFFF,
        rgb: [0, 255, 255]
    }, {
        name: 'aquamarine',
        value: 0x7FFFD4,
        rgb: [127, 255, 212]
    }, {
        name: 'azure',
        value: 0xF0FFFF,
        rgb: [240, 255, 255]
    }, {
        name: 'beige',
        value: 0xF5F5DC,
        rgb: [245, 245, 220]
    }, {
        name: 'bisque',
        value: 0xFFE4C4,
        rgb: [255, 228, 196]
    }, {
        name: 'black',
        value: 0x000000,
        rgb: [0, 0, 0]
    }, {
        name: 'blanchedalmond',
        value: 0xFFEBCD,
        rgb: [255, 235, 205]
    }, {
        name: 'blue',
        value: 0x0000FF,
        rgb: [0, 0, 255]
    }, {
        name: 'blueviolet',
        value: 0x8A2BE2,
        rgb: [138, 43, 226]
    }, {
        name: 'brown',
        value: 0xA52A2A,
        rgb: [165, 42, 42]
    }, {
        name: 'burlywood',
        value: 0xDEB887,
        rgb: [222, 184, 135]
    }, {
        name: 'cadetblue',
        value: 0x5F9EA0,
        rgb: [95, 158, 160]
    }, {
        name: 'chartreuse',
        value: 0x7FFF00,
        rgb: [127, 255, 0]
    }, {
        name: 'chocolate',
        value: 0xD2691E,
        rgb: [210, 105, 30]
    }, {
        name: 'coral',
        value: 0xFF7F50,
        rgb: [255, 127, 80]
    }, {
        name: 'cornflowerblue',
        value: 0x6495ED,
        rgb: [100, 149, 237]
    }, {
        name: 'cornsilk',
        value: 0xFFF8DC,
        rgb: [255, 248, 220]
    }, {
        name: 'crimson',
        value: 0xDC143C,
        rgb: [220, 20, 60]
    }, {
        name: 'cyan',
        value: 0x00FFFF,
        rgb: [0, 255, 255]
    }, {
        name: 'darkblue',
        value: 0x00008B,
        rgb: [0, 0, 139]
    }, {
        name: 'darkcyan',
        value: 0x008B8B,
        rgb: [0, 139, 139]
    }, {
        name: 'darkgoldenrod',
        value: 0xB8860B,
        rgb: [184, 134, 11]
    }, {
        name: 'darkgray',
        value: 0xA9A9A9,
        rgb: [169, 169, 169]
    }, {
        name: 'darkgreen',
        value: 0x006400,
        rgb: [0, 100, 0]
    }, {
        name: 'darkgrey',
        value: 0xA9A9A9,
        rgb: [169, 169, 169]
    }, {
        name: 'darkkhaki',
        value: 0xBDB76B,
        rgb: [189, 183, 107]
    }, {
        name: 'darkmagenta',
        value: 0x8B008B,
        rgb: [139, 0, 139]
    }, {
        name: 'darkolivegreen',
        value: 0x556B2F,
        rgb: [85, 107, 47]
    }, {
        name: 'darkorange',
        value: 0xFF8C00,
        rgb: [255, 140, 0]
    }, {
        name: 'darkorchid',
        value: 0x9932CC,
        rgb: [153, 50, 204]
    }, {
        name: 'darkred',
        value: 0x8B0000,
        rgb: [139, 0, 0]
    }, {
        name: 'darksalmon',
        value: 0xE9967A,
        rgb: [233, 150, 122]
    }, {
        name: 'darkseagreen',
        value: 0x8FBC8F,
        rgb: [143, 188, 143]
    }, {
        name: 'darkslateblue',
        value: 0x483D8B,
        rgb: [72, 61, 139]
    }, {
        name: 'darkslategray',
        value: 0x2F4F4F,
        rgb: [47, 79, 79]
    }, {
        name: 'darkslategrey',
        value: 0x2F4F4F,
        rgb: [47, 79, 79]
    }, {
        name: 'darkturquoise',
        value: 0x00CED1,
        rgb: [0, 206, 209]
    }, {
        name: 'darkviolet',
        value: 0x9400D3,
        rgb: [148, 0, 211]
    }, {
        name: 'deeppink',
        value: 0xFF1493,
        rgb: [255, 20, 147]
    }, {
        name: 'deepskyblue',
        value: 0x00BFFF,
        rgb: [0, 191, 255]
    }, {
        name: 'dimgray',
        value: 0x696969,
        rgb: [105, 105, 105]
    }, {
        name: 'dimgrey',
        value: 0x696969,
        rgb: [105, 105, 105]
    }, {
        name: 'dodgerblue',
        value: 0x1E90FF,
        rgb: [30, 144, 255]
    }, {
        name: 'firebrick',
        value: 0xB22222,
        rgb: [178, 34, 34]
    }, {
        name: 'floralwhite',
        value: 0xFFFAF0,
        rgb: [255, 250, 240]
    }, {
        name: 'forestgreen',
        value: 0x228B22,
        rgb: [34, 139, 34]
    }, {
        name: 'fuchsia',
        value: 0xFF00FF,
        rgb: [255, 0, 255]
    }, {
        name: 'gainsboro',
        value: 0xDCDCDC,
        rgb: [220, 220, 220]
    }, {
        name: 'ghostwhite',
        value: 0xF8F8FF,
        rgb: [248, 248, 255]
    }, {
        name: 'gold',
        value: 0xFFD700,
        rgb: [255, 215, 0]
    }, {
        name: 'goldenrod',
        value: 0xDAA520,
        rgb: [218, 165, 32]
    }, {
        name: 'gray',
        value: 0x808080,
        rgb: [128, 128, 128]
    }, {
        name: 'green',
        value: 0x008000,
        rgb: [0, 128, 0]
    }, {
        name: 'greenyellow',
        value: 0xADFF2F,
        rgb: [173, 255, 47]
    }, {
        name: 'grey',
        value: 0x808080,
        rgb: [128, 128, 128]
    }, {
        name: 'honeydew',
        value: 0xF0FFF0,
        rgb: [240, 255, 240]
    }, {
        name: 'hotpink',
        value: 0xFF69B4,
        rgb: [255, 105, 180]
    }, {
        name: 'indianred',
        value: 0xCD5C5C,
        rgb: [205, 92, 92]
    }, {
        name: 'indigo',
        value: 0x4B0082,
        rgb: [75, 0, 130]
    }, {
        name: 'ivory',
        value: 0xFFFFF0,
        rgb: [255, 255, 240]
    }, {
        name: 'khaki',
        value: 0xF0E68C,
        rgb: [240, 230, 140]
    }, {
        name: 'lavender',
        value: 0xE6E6FA,
        rgb: [230, 230, 250]
    }, {
        name: 'lavenderblush',
        value: 0xFFF0F5,
        rgb: [255, 240, 245]
    }, {
        name: 'lawngreen',
        value: 0x7CFC00,
        rgb: [124, 252, 0]
    }, {
        name: 'lemonchiffon',
        value: 0xFFFACD,
        rgb: [255, 250, 205]
    }, {
        name: 'lightblue',
        value: 0xADD8E6,
        rgb: [173, 216, 230]
    }, {
        name: 'lightcoral',
        value: 0xF08080,
        rgb: [240, 128, 128]
    }, {
        name: 'lightcyan',
        value: 0xE0FFFF,
        rgb: [224, 255, 255]
    }, {
        name: 'lightgoldenrodyellow',
        value: 0xFAFAD2,
        rgb: [250, 250, 210]
    }, {
        name: 'lightgray',
        value: 0xD3D3D3,
        rgb: [211, 211, 211]
    }, {
        name: 'lightgreen',
        value: 0x90EE90,
        rgb: [144, 238, 144]
    }, {
        name: 'lightgrey',
        value: 0xD3D3D3,
        rgb: [211, 211, 211]
    }, {
        name: 'lightpink',
        value: 0xFFB6C1,
        rgb: [255, 182, 193]
    }, {
        name: 'lightsalmon',
        value: 0xFFA07A,
        rgb: [255, 160, 122]
    }, {
        name: 'lightseagreen',
        value: 0x20B2AA,
        rgb: [32, 178, 170]
    }, {
        name: 'lightskyblue',
        value: 0x87CEFA,
        rgb: [135, 206, 250]
    }, {
        name: 'lightslategray',
        value: 0x778899,
        rgb: [119, 136, 153]
    }, {
        name: 'lightslategrey',
        value: 0x778899,
        rgb: [119, 136, 153]
    }, {
        name: 'lightsteelblue',
        value: 0xB0C4DE,
        rgb: [176, 196, 222]
    }, {
        name: 'lightyellow',
        value: 0xFFFFE0,
        rgb: [255, 255, 224]
    }, {
        name: 'lime',
        value: 0x00FF00,
        rgb: [0, 255, 0]
    }, {
        name: 'limegreen',
        value: 0x32CD32,
        rgb: [50, 205, 50]
    }, {
        name: 'linen',
        value: 0xFAF0E6,
        rgb: [250, 240, 230]
    }, {
        name: 'magenta',
        value: 0xFF00FF,
        rgb: [255, 0, 255]
    }, {
        name: 'maroon',
        value: 0x800000,
        rgb: [128, 0, 0]
    }, {
        name: 'mediumaquamarine',
        value: 0x66CDAA,
        rgb: [102, 205, 170]
    }, {
        name: 'mediumblue',
        value: 0x0000CD,
        rgb: [0, 0, 205]
    }, {
        name: 'mediumorchid',
        value: 0xBA55D3,
        rgb: [186, 85, 211]
    }, {
        name: 'mediumpurple',
        value: 0x9370DB,
        rgb: [147, 112, 219]
    }, {
        name: 'mediumseagreen',
        value: 0x3CB371,
        rgb: [60, 179, 113]
    }, {
        name: 'mediumslateblue',
        value: 0x7B68EE,
        rgb: [123, 104, 238]
    }, {
        name: 'mediumspringgreen',
        value: 0x00FA9A,
        rgb: [0, 250, 154]
    }, {
        name: 'mediumturquoise',
        value: 0x48D1CC,
        rgb: [72, 209, 204]
    }, {
        name: 'mediumvioletred',
        value: 0xC71585,
        rgb: [199, 21, 133]
    }, {
        name: 'midnightblue',
        value: 0x191970,
        rgb: [25, 25, 112]
    }, {
        name: 'mintcream',
        value: 0xF5FFFA,
        rgb: [245, 255, 250]
    }, {
        name: 'mistyrose',
        value: 0xFFE4E1,
        rgb: [255, 228, 225]
    }, {
        name: 'moccasin',
        value: 0xFFE4B5,
        rgb: [255, 228, 181]
    }, {
        name: 'navajowhite',
        value: 0xFFDEAD,
        rgb: [255, 222, 173]
    }, {
        name: 'navy',
        value: 0x000080,
        rgb: [0, 0, 128]
    }, {
        name: 'oldlace',
        value: 0xFDF5E6,
        rgb: [253, 245, 230]
    }, {
        name: 'olive',
        value: 0x808000,
        rgb: [128, 128, 0]
    }, {
        name: 'olivedrab',
        value: 0x6B8E23,
        rgb: [107, 142, 35]
    }, {
        name: 'orange',
        value: 0xFFA500,
        rgb: [255, 165, 0]
    }, {
        name: 'orangered',
        value: 0xFF4500,
        rgb: [255, 69, 0]
    }, {
        name: 'orchid',
        value: 0xDA70D6,
        rgb: [218, 112, 214]
    }, {
        name: 'palegoldenrod',
        value: 0xEEE8AA,
        rgb: [238, 232, 170]
    }, {
        name: 'palegreen',
        value: 0x98FB98,
        rgb: [152, 251, 152]
    }, {
        name: 'paleturquoise',
        value: 0xAFEEEE,
        rgb: [175, 238, 238]
    }, {
        name: 'palevioletred',
        value: 0xDB7093,
        rgb: [219, 112, 147]
    }, {
        name: 'papayawhip',
        value: 0xFFEFD5,
        rgb: [255, 239, 213]
    }, {
        name: 'peachpuff',
        value: 0xFFDAB9,
        rgb: [255, 218, 185]
    }, {
        name: 'peru',
        value: 0xCD853F,
        rgb: [205, 133, 63]
    }, {
        name: 'pink',
        value: 0xFFC0CB,
        rgb: [255, 192, 203]
    }, {
        name: 'plum',
        value: 0xDDA0DD,
        rgb: [221, 160, 221]
    }, {
        name: 'powderblue',
        value: 0xB0E0E6,
        rgb: [176, 224, 230]
    }, {
        name: 'purple',
        value: 0x800080,
        rgb: [128, 0, 128]
    }, {
        name: 'red',
        value: 0xFF0000,
        rgb: [255, 0, 0]
    }, {
        name: 'rosybrown',
        value: 0xBC8F8F,
        rgb: [188, 143, 143]
    }, {
        name: 'royalblue',
        value: 0x4169E1,
        rgb: [65, 105, 225]
    }, {
        name: 'saddlebrown',
        value: 0x8B4513,
        rgb: [139, 69, 19]
    }, {
        name: 'salmon',
        value: 0xFA8072,
        rgb: [250, 128, 114]
    }, {
        name: 'sandybrown',
        value: 0xF4A460,
        rgb: [244, 164, 96]
    }, {
        name: 'seagreen',
        value: 0x2E8B57,
        rgb: [46, 139, 87]
    }, {
        name: 'seashell',
        value: 0xFFF5EE,
        rgb: [255, 245, 238]
    }, {
        name: 'sienna',
        value: 0xA0522D,
        rgb: [160, 82, 45]
    }, {
        name: 'silver',
        value: 0xC0C0C0,
        rgb: [192, 192, 192]
    }, {
        name: 'skyblue',
        value: 0x87CEEB,
        rgb: [135, 206, 235]
    }, {
        name: 'slateblue',
        value: 0x6A5ACD,
        rgb: [106, 90, 205]
    }, {
        name: 'slategray',
        value: 0x708090,
        rgb: [112, 128, 144]
    }, {
        name: 'slategrey',
        value: 0x708090,
        rgb: [112, 128, 144]
    }, {
        name: 'snow',
        value: 0xFFFAFA,
        rgb: [255, 250, 250]
    }, {
        name: 'springgreen',
        value: 0x00FF7F,
        rgb: [0, 255, 127]
    }, {
        name: 'steelblue',
        value: 0x4682B4,
        rgb: [70, 130, 180]
    }, {
        name: 'tan',
        value: 0xD2B48C,
        rgb: [210, 180, 140]
    }, {
        name: 'teal',
        value: 0x008080,
        rgb: [0, 128, 128]
    }, {
        name: 'thistle',
        value: 0xD8BFD8,
        rgb: [216, 191, 216]
    }, {
        name: 'tomato',
        value: 0xFF6347,
        rgb: [255, 99, 71]
    }, {
        name: 'turquoise',
        value: 0x40E0D0,
        rgb: [64, 224, 208]
    }, {
        name: 'violet',
        value: 0xEE82EE,
        rgb: [238, 130, 238]
    }, {
        name: 'wheat',
        value: 0xF5DEB3,
        rgb: [245, 222, 179]
    }, {
        name: 'white',
        value: 0xFFFFFF,
        rgb: [255, 255, 255]
    }, {
        name: 'whitesmoke',
        value: 0xF5F5F5,
        rgb: [245, 245, 245]
    }, {
        name: 'yellow',
        value: 0xFFFF00,
        rgb: [255, 255, 0]
    }, {
        name: 'yellowgreen',
        value: 0x9ACD32,
        rgb: [154, 205, 50]
    }];
    
    var BasicColor = {},
        ExtendedColor = {},
        rhexColor = /(#?)([0-9a-f])\2([0-9a-f])\3([0-9a-f])\4/ig,
        replacement = "$1$2$3$4";
    
    function f(keyName, valueName) {
        return function(map, color, index) {
            var hex = color[valueName].toString(16),
                abbr;
            if (hex.length < 6) {
                hex = Array(7 - hex.length).join('0') + hex;
            }
            abbr = hexAbbr(hex);
            map[color[keyName]] = abbr;
            return map;
        };
    }
    _enum.inject(_basicColor, BasicColor, f('name', 'value'));
    _enum.inject(_extendedColor, ExtendedColor, f('name', 'value'));
    
    function hexColorString(englishName) {
        var name = englishName.toLowerCase();
        return BasicColor[name] || ExtendedColor[name];
    }
    
    function hexAbbr(hexString) {
        if (!hexString || hexString.length < 6) {
            return hexString;
        }
        return hexString.replace(rhexColor, replacement);
    }
    
    exports['BasicColor'] = BasicColor;
    exports['ExtendedColor'] = ExtendedColor;
    exports['hexColorString'] = hexColorString;
    exports['hexAbbr'] = hexAbbr;
    exports.__doc__ = "Color Utils";
    return exports;
}));
//end of $root.lang.color
