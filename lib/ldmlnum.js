(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ldmlnum", [], factory);
	else if(typeof exports === 'object')
		exports["ldmlnum"] = factory();
	else
		root["ldmlnum"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var formatInt = __webpack_require__(2);
	var makelocale = __webpack_require__(4);
	var roundhalfeven = __webpack_require__(5);
	var splitSign = __webpack_require__(6);
	var unquote = __webpack_require__(7);
	var padright = __webpack_require__(3);
	
	var reSubpatt = /^((?:'[^']*'|[^';]+)*)(?:;(.*))?$/;
	var reChunker = /^((?:'[^']*'|[^0-9@#.,])*)([0-9@#.,E+]+)(.*)$/;
	var reNumbits = /^([^E.]*)(?:\.([^E]*))?(?:E(\+?)(.*))?$/;
	
	var e5h = makelocale();
	
	function numfmt(pattern) {
	  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en';
	
	  // resolve default pattern for locale if no pattern was provided
	  if (!pattern) {
	    pattern = '#,##0.###;-#,##0.###';
	  }
	
	  // localizable things
	  // be liberal accepting - and _
	
	  var _locale$split = locale.split(/[_-]/),
	      _locale$split2 = _slicedToArray(_locale$split, 2),
	      lang = _locale$split2[0],
	      subLang = _locale$split2[1];
	
	  var l10n = numfmt.locale[locale] || numfmt.locale[lang + '-' + subLang] || numfmt.locale[lang + '_' + subLang] || numfmt.locale[lang] || {};
	  var cGroup = l10n.thousands_separator || e5h.thousands_separator;
	  var cDecimal = l10n.decimal_separator || e5h.decimal_separator;
	  var cPlus = l10n.positive_sign || e5h.positive_sign;
	  var cMinus = l10n.negative_sign || e5h.negative_sign;
	  var cExp = l10n.exponent_symbol || e5h.exponent_symbol;
	  var cInf = l10n.infinity_symbol || e5h.infinity_symbol;
	  var cNaN = l10n.nan_symbol || e5h.nan_symbol;
	
	  var p = function p(n) {
	    var isNeg = (n < 0) * 1;
	    var f = '';
	    var i = '';
	    var v = void 0;
	    var e = void 0;
	
	    n *= p.scale;
	
	    // == normal formatting ==
	    if (!isFinite(n)) {
	      i = isNaN(n) ? cNaN : cInf;
	    } else if (p.exponent) {
	      v = Math.abs(n);
	      e = v ? Math.floor(Math.log(v) / Math.LN10) : 0;
	
	      if (p.int_min === p.int_max) {
	        // Minimum number of integer digits
	        e -= p.int_min - 1;
	      } else if (p.int_max && isFinite(p.int_max)) {
	        // Exponent grouping
	        e = Math.floor(e / p.int_max) * p.int_max;
	      }
	
	      v = e < 0 ? v * Math.pow(10, -e) : v / Math.pow(10, e);
	
	      var _splitSign = splitSign(v, p.frac_min + p.int_min, p.frac_max + p.int_max, p.pad);
	
	      var _splitSign2 = _slicedToArray(_splitSign, 2);
	
	      i = _splitSign2[0];
	      f = _splitSign2[1];
	
	
	      return p.prefix[0] + (isNeg ? cMinus : '') + (i + (f ? cDecimal + f : '')) + cExp + (e < 0 ? cMinus : p.exp_plus ? cPlus : '') + formatInt(Math.abs(e), p.exp_min, Infinity, p.pad) + p.suffix[0];
	    } else if (p.significance) {
	      var _splitSign3 = splitSign(n, p.sig_min, p.sig_max, p.pad);
	
	      var _splitSign4 = _slicedToArray(_splitSign3, 2);
	
	      i = _splitSign4[0];
	      f = _splitSign4[1];
	    } else {
	      if (p.frac_min === p.frac_max && !p.frac_min) {
	        v = Math.round(Math.abs(n));
	      } else {
	        v = Math.floor(Math.abs(n));
	      }
	
	      if (p.int_max !== Infinity) {
	        // is is possible to add a max digits to non-sci patterns?
	        // we should parse this as infinite and allow user to set int_max
	      }
	      i = formatInt(v, p.int_min, Infinity, p.pad);
	
	      if (n % 1) {
	        // have fraction
	        f = padright(String(numfmt.round(n, p.frac_max)).split('.')[1] || '', p.frac_min, p.pad);
	      } else {
	        // no fraction -- just add some zeros
	        f = padright(f, p.frac_min, '0');
	      }
	    }
	
	    if (isFinite(n) && p.grouping) {
	      var ret = '';
	      var ipos = i.length;
	      var gsize = p.group_sec;
	
	      if (ipos > p.group_pri) {
	        ret = cGroup + i.substr(ipos -= p.group_pri, p.group_pri) + ret;
	      }
	      while (ipos > gsize) {
	        ret = cGroup + i.substr(ipos -= gsize, gsize) + ret;
	      }
	      i = ipos ? i.substr(0, ipos) + ret : ret;
	    }
	
	    return p.prefix[isNeg] + i + (f ? cDecimal + f : '') + p.suffix[isNeg];
	  };
	
	  var s = reSubpatt.exec(pattern);
	  var posBits = reChunker.exec(s[1]);
	  var number = posBits[2] || '';
	  var negBits = s[2] ? reChunker.exec(s[2]) : null;
	  var numBits = reNumbits.exec(number);
	  var integer = numBits[1] || '';
	  var fraction = numBits[2] || '';
	
	  p.pattern = pattern;
	
	  p.significance = number.indexOf('@') >= 0;
	  p.exponent = number.indexOf('E') >= 0;
	
	  p.grouping = number.indexOf(',') >= 0;
	
	  p.exp_plus = !!numBits[3]; // show exponent positive mark
	
	
	  if (/\d(?=.*#)/.test(integer)) {
	    throw new Error('Nonsensical number pattern: ' + integer);
	  }
	  if (/#(?=.*\d)/.test(fraction)) {
	    throw new Error('Nonsensical number pattern: ' + fraction);
	  }
	  if (p.exponent && p.grouping) {
	    // "Exponential patterns may not contain grouping separators"
	    throw new Error('Exponential patterns must not contain ","');
	  }
	  if (p.significance && number.indexOf('.') >= 0) {
	    // "If a pattern uses significant digits, it may not contain a decimal separator [...]"
	    throw new Error('Significant digit patterns must not contain ".": ' + pattern);
	  }
	  if (p.significance && integer.indexOf('0') >= 0) {
	    // "If a pattern uses significant digits, it may not contain [...] the '0' pattern character."
	    throw new Error('Significant digit patterns must not contain "0": ' + pattern);
	  }
	
	  // parse min/max digit counts
	  p.int_max = !p.exponent && !p.significance ? Infinity : integer.replace(/[,]/g, '').length;
	  p.int_min = integer.length < 1 ? 0 : integer.replace(/[,#]/g, '').length || 1;
	  p.frac_max = fraction.replace(/[,]/g, '').length;
	  p.frac_min = fraction.replace(/[,#]/g, '').length;
	
	  p.prefix = [unquote(posBits[1]), unquote(negBits ? negBits[1] : '-' + posBits[1])];
	  p.suffix = [unquote(posBits[3]), unquote(negBits ? negBits[3] : posBits[3])];
	
	  p.pad = '0';
	  var clean = pattern.replace(/'([^']*)'/g, '');
	  p.scale = /%/.test(clean) ? 100 : 1;
	
	  if (p.significance) {
	    var sigBits = /(@+)([^.E]*)/.exec(number);
	    p.sig_min = sigBits[1].length;
	    p.sig_max = p.sig_min + sigBits[2].length;
	  } else {
	    p.sig_min = 1;
	    p.sig_max = Infinity;
	  }
	
	  if (p.grouping) {
	    var _s = (integer || '').split(',');
	    var sl = _s.length;
	    if (sl === 2) {
	      p.group_pri = p.group_sec = _s[1].length;
	    } else if (sl > 2) {
	      p.group_pri = _s[sl - 1].length;
	      p.group_sec = _s[sl - 2].length;
	    }
	  } else {
	    p.group_pri = 0;
	    p.group_sec = 0;
	  }
	
	  if (p.exponent) {
	    // The number of digit characters after the exponent character gives the
	    // minimum exponent digit count. There is no maximum.
	    p.exp_min = numBits[4].length;
	    if (p.significance) {
	      p.int_min = p.int_max = 1;
	      p.frac_min = p.sig_min;
	      p.frac_max = p.sig_max;
	    }
	  }
	
	  return p;
	}
	
	// export the interface
	numfmt.round = roundhalfeven;
	numfmt.locale = makelocale;
	numfmt.locale.en = makelocale();
	numfmt.locale.is = makelocale('.', ',');
	numfmt.locale.sv = makelocale('.', ',');
	
	module.exports = numfmt;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var padright = __webpack_require__(3);
	
	module.exports = function (n, min, max, pad) {
	  if (!n && !min) {
	    return '';
	  }
	  var i = String(n);
	  if (i.length > max) {
	    // For example, 1997 is formatted as "97" if the maximum integer digits is set to 2.
	    return i.slice(i.length - max);
	  }
	  return padright('', min - i.length, pad) + i;
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (s, l) {
	  var p = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '0';
	
	  while (s.length < l) {
	    s += p;
	  }
	  return s;
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function locale() {
	  var grp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ',';
	  var dec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';
	  var pos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '+';
	  var neg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '-';
	  var exp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'E';
	  var inf = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '∞';
	  var nan = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '☹';
	
	  return {
	    thousands_separator: grp,
	    decimal_separator: dec,
	    positive_sign: pos,
	    negative_sign: neg,
	    exponent_symbol: exp,
	    infinity_symbol: inf,
	    nan_symbol: nan
	  };
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	var EPSILON = 1e-12;
	
	module.exports = function roundhalfeven(value, places) {
	  if (value < 0) {
	    return -roundhalfeven(-value, places);
	  }
	  if (places) {
	    var p = Math.pow(10, places || 0) || 1;
	    return roundhalfeven(value * p, 0) / p;
	  }
	  var ipart = Math.floor(value);
	  var dist = value - (ipart + 0.5);
	  if (dist > -EPSILON && dist < EPSILON) {
	    return ipart % 2 < EPSILON ? ipart : Math.ceil(ipart + 0.5);
	  }
	  return Math.round(value);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var roundhalfeven = __webpack_require__(5);
	var padright = __webpack_require__(3);
	
	module.exports = function (n, min, max, pad) {
	  var inf = max === Infinity;
	  var d = inf ? 0 : Math.ceil(n ? Math.log(n < 0 ? -n : n) / Math.LN10 : 1);
	  var adj = inf ? Math.abs(n) : roundhalfeven(Math.abs(n), Math.floor(max - Math.floor(d)));
	  var v = Math.floor(adj);
	  var i = String(v);
	  var f = String(adj).split('.')[1] || '';
	  var w = adj ? (v && i.length) + f.length + (d < 0 ? d : 0) : 1;
	  return [i, f + padright('', min - w, pad)];
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function unquote(s) {
	  return s && s.replace(/'([^']+)'/g, '$1').replace(/''/g, "'");
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ldmlnum.js.map