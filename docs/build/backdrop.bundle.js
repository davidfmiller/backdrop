/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {


(function () {
  'use strict';

  window.Backdrop = __webpack_require__(1);
})();

/***/ }),
/* 1 */
/***/ (function(module, exports) {


(function () {
  'use strict';

  // prevent duplicate declaration
  //  if (window.Backdrop) { return; }

  let
  //
  RESIZE_LISTENED = false;

  const
  //
  DEFAULT_STYLES = {
    'color': 'transparent',
    'position': 'top left',
    'repeat': 'no-repeat',
    'attachment': 'fixed',
    'size': 'cover'
  },


  /*
   * Generate a unique string suitable for id attributes
   *
   * @param basename (String)
   * @return string
   */
  guid = function (basename) {
    return basename + '-' + parseInt(Math.random() * 100, 10) + '-' + parseInt(Math.random() * 1000, 10);
  },


  /*
   * Retrieve an object containing { top: xx, left: xx, bottom: xx, right: xx, width: xx, height: xx }
   *
   * @param node (DOMNode)
   */
  getRect = function (node) {
    const rect = node.getBoundingClientRect();

    // create a new object that is not read-only
    const ret = { top: rect.top, left: rect.left, bottom: rect.bottom, right: rect.right };

    ret.top += window.pageYOffset;
    ret.left += window.pageXOffset;

    ret.bottom += window.pageYOffset;
    ret.right += window.pageYOffset;

    ret.width = rect.right - rect.left;
    ret.height = rect.bottom - rect.top;

    return ret;
  },


  /*
   *
   * @param a
   * @param b
    * @return Object
   */
  merge = function (a, b) {
    let i;
    const o = {};
    for (i in a) {
      if (a.hasOwnProperty(i)) {
        o[i] = a[i];
      }
    }
    for (i in b) {
      if (b.hasOwnProperty(i)) {
        o[i] = b[i];
      }
    }
    return o;
  },
        setStyles = function (node, styles) {
    for (const key in styles) {
      if (styles.hasOwnProperty(key)) {
        node.style[key] = styles[key];
      }
    }
  },
        _applyStyles = function (node, styles) {
    for (const s in styles) {
      if (styles.hasOwnProperty(s)) {
        const key = 'background' + s.charAt(0).toUpperCase() + s.substr(1),
              style = styles[s];

        node.style[key] = style;
      }
    }
  };

  const Backdrop = function (config) {
    if (!config) {
      config = {};
    }

    this.events = {
      'end': function () {},
      'start': function () {}
    };

    this.node = config.hasOwnProperty('node') ? config.node : document.body;
    this.id = config.hasOwnProperty('id') ? config.id : guid('backdrop');
    this.url = config.hasOwnProperty('url') ? config.url : null;
    this.styles = config.hasOwnProperty('styles') ? config.styles : null;

    if (this.url) {
      this.drop(this.url);
    }
  };

  /**
   * Assign handler for a Screen event
   *
   * @param {String} eventName - event name to attach to, one of 'fullscreen' or 'exit'
   * @param {Function} func - function to invoke when event occurs
   * @return {Object} Instance of backdrop for chaining
   * @chainable
   */
  Backdrop.prototype.on = function (eventName, func) {
    this.events[eventName] = func;
    return this;
  };

  Backdrop.prototype.drop = function (config) {
    if (typeof config === 'string') {
      this.url = config;
      this.styles = null;
    } else if (config) {
      if (config.hasOwnProperty('url')) {
        this.url = config.url;
      }
      if (config.hasOwnProperty('styles')) {
        this.styles = config.styles;
      }
    }

    const img = new Image(),
          o = {};
    o.$ = this;
    o.node = document.createElement('div');
    o.node.setAttribute('id', this.id);
    o.node.classList.add('rmr-backdrop');

    o.$.resize();

    img.onload = function () {
      const styles = merge(DEFAULT_STYLES, o.$.styles);

      o.$.node.appendChild(o.node);
      o.$.resize();

      o.$.events.start(o.$.url);

      styles.image = 'url(' + this.src + ')';

      _applyStyles(o.node, styles);

      let val = 0,
          interval;

      const anim = function () {
        val += 0.04;
        o.node.style.opacity = val;

        if (val >= 1) {
          const styles = merge(DEFAULT_STYLES, o.$.styles);

          styles.image = 'url(' + img.src + ')';
          o.$.events.end(o.$.url);

          _applyStyles(o.$.node, styles);
          o.node.parentNode.removeChild(o.node);

          window.clearInterval(interval);
          interval = null;
        }
      };

      interval = window.setInterval(anim, 10);

      if (!RESIZE_LISTENED) {
        window.addEventListener('resize', function () {
          o.$.resize();
        });
      }
      RESIZE_LISTENED = true;
    };

    img.src = this.url;
    return this;
  };

  Backdrop.prototype.resize = function () {
    const node = document.getElementById(this.id),
          rect = getRect(this.node);

    if (this.node === document.body) {
      document.body.style.minHeight = window.innerHeight + 'px';
    }

    if (node) {
      setStyles(node, { width: rect.width + 'px', height: rect.height + 'px' });
    }

    return this;
  };

  Backdrop.prototype.toString = function () {
    return '[Backdrop v0.1]';
  };

  module.exports = Backdrop;
})();

/***/ })
/******/ ]);