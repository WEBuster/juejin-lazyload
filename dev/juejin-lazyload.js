(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.JuejinLazyload = factory());
}(this, (function () { 'use strict';

function on(element, eventName, fn) {
  var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  element.addEventListener(eventName, fn, useCapture);
  return function () {
    element.removeEventListener(eventName, fn, useCapture);
  };
}

function getViewportSize() {
  var root = document.documentElement;
  return {
    width: Math.max(root.clientWidth, window.innerWidth || 0),
    height: Math.max(root.clientHeight, window.innerHeight || 0)
  };
}

function loadIamge(url, onLoaded, onError) {
  if (!url) {
    return;
  }
  var image = new Image();
  image.onload = function () {
    onLoaded && onLoaded(url);
  };
  image.onerror = function () {
    onError && onError(url);
  };
  image.src = url;
}

function throttle(fn, interval) {
  var lastTime = 0;
  interval = interval / 2;
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (Date.now() - lastTime >= interval) {
      lastTime = Date.now();
      setTimeout(function () {
        fn.apply(null, args);
      }, interval);
    }
  };
}

function debounce(fn, delay) {
  var token = 0;
  return function () {
    var _this = this;

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    clearTimeout(token);
    token = setTimeout(function () {
      return fn.apply(_this, args);
    }, delay);
  };
}

function getPlaceholderDataUrl(width, height) {
  return ['data:image/svg+xml;utf8,', '<?xml version="1.0"?>', '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" ', 'width="' + width + '" height="' + height + '"', '></svg>'].join('');
}

function isInArea(areaRect, tarRect) {
  return !(tarRect.bottom < areaRect.top || tarRect.top > areaRect.bottom || tarRect.right < areaRect.left || tarRect.left > areaRect.right);
}

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var DEFAULT_OPTIONS = {
  threshold: 0,
  interval: 300,
  debounce: false,
  reactive: true,
  infoGetter: null,
  visibleAreaGetter: null,
  onStateChange: null
};

var INFO_PROP_NAME = '__JUEJIN_LAZYLOAD';

var JuejinLazyload = function () {
  function JuejinLazyload(elementList, options) {
    classCallCheck(this, JuejinLazyload);

    this.setOptions(options);
    this.addOrUpdateElement(elementList);
    this.initEventListener();
  }

  createClass(JuejinLazyload, [{
    key: 'setOptions',
    value: function setOptions(options) {
      this.options = _extends({}, DEFAULT_OPTIONS, options);
    }
  }, {
    key: 'initEventListener',
    value: function initEventListener() {
      var _this = this;

      if (this.options.reactive) {
        var onStateChange = this.options.debounce ? debounce(function () {
          return _this.updateState();
        }, this.options.interval) : throttle(function () {
          return _this.updateState();
        }, this.options.interval);
        this.removeScrollEventListener = on(window, 'scroll', onStateChange);
        this.removeResizeEventListener = on(window, 'resize', onStateChange);
      }
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener() {
      this.removeScrollEventListener && this.removeScrollEventListener();
      this.removeResizeEventListener && this.removeResizeEventListener();
    }
  }, {
    key: 'addOrUpdateElement',
    value: function addOrUpdateElement(elementList) {
      var list = this.getElementList(elementList);
      var newList = list.filter(function (element) {
        return !element[INFO_PROP_NAME];
      });
      this.elementList = (this.elementList || []).concat(newList);
      list.forEach(this.initElement.bind(this));
      this.updateState();
    }
  }, {
    key: 'removeElement',
    value: function removeElement(elementList) {
      var list = this.getElementList(elementList);
      this.elementList = this.elementList.filter(function (element) {
        return list.indexOf(element) === -1;
      });
      list.forEach(this.removeInfo.bind(this));
    }
  }, {
    key: 'clean',
    value: function clean() {
      this.elementList.forEach(this.removeInfo.bind(this));
      this.elementList = [];
    }
  }, {
    key: 'getElementList',
    value: function getElementList(descriptor) {
      if (typeof descriptor === 'string') {
        return [].slice.call(document.querySelectorAll(descriptor));
      } else if (descriptor instanceof Array) {
        return descriptor;
      } else {
        return descriptor ? [descriptor] : [];
      }
    }
  }, {
    key: 'initElement',
    value: function initElement(element) {
      var imgInfo = this.options.infoGetter && this.options.infoGetter(element);
      var info = _extends({}, imgInfo, {
        isImg: element.nodeName === 'IMG',
        loading: false,
        loaded: false,
        error: false
      });
      info.hasPlaceholder = info.isImg && info.width && info.height;
      if (info.hasPlaceholder) {
        element.src = getPlaceholderDataUrl(info.width, info.height);
      }
      element[INFO_PROP_NAME] = info;
    }
  }, {
    key: 'removeInfo',
    value: function removeInfo(element) {
      if (element[INFO_PROP_NAME]) {
        element[INFO_PROP_NAME] = null;
      }
    }
  }, {
    key: 'updateState',
    value: function updateState() {
      var _this2 = this;

      if (!this.elementList.length) {
        return;
      }
      var activeArea = this.getActiveArea();
      this.elementList.forEach(function (element) {
        var _element$INFO_PROP_NA = element[INFO_PROP_NAME],
            loading = _element$INFO_PROP_NA.loading,
            loaded = _element$INFO_PROP_NA.loaded,
            error = _element$INFO_PROP_NA.error;

        if (loading || loaded || error) {
          return;
        }
        if (isInArea(activeArea, element.getBoundingClientRect())) {
          _this2.loadIamge(element);
        }
      });
    }
  }, {
    key: 'getActiveArea',
    value: function getActiveArea() {
      var visibleArea = this.getVisibleArea();
      var threshold = this.options.threshold || 0;
      return {
        top: visibleArea.top - threshold,
        left: visibleArea.left - threshold,
        right: visibleArea.right + threshold,
        bottom: visibleArea.bottom + threshold
      };
    }
  }, {
    key: 'getVisibleArea',
    value: function getVisibleArea() {
      if (this.options.visibleAreaGetter) {
        return this.options.visibleAreaGetter();
      } else {
        var _getViewportSize = getViewportSize(),
            width = _getViewportSize.width,
            height = _getViewportSize.height;

        return {
          top: 0,
          left: 0,
          right: width,
          bottom: height
        };
      }
    }
  }, {
    key: 'loadIamge',
    value: function loadIamge$$1(element) {
      var _this3 = this;

      var info = element[INFO_PROP_NAME];
      var url = info.url,
          isImg = info.isImg;

      element.classList.add('loading');
      info.loading = true;
      info.loaded = false;
      info.error = false;
      this.invokeStateHook('loading', url, element);
      loadIamge(url, function () {
        if (isImg) {
          element.src = url;
        } else {
          element.style.backgroundImage = 'url(' + url + ')';
        }
        element.classList.remove('loading');
        element.classList.add('loaded');
        info.loading = false;
        info.loaded = true;
        _this3.invokeStateHook('loaded', url, element);
      }, function () {
        element.classList.remove('loading');
        element.classList.add('error');
        info.loading = false;
        info.error = true;
        _this3.invokeStateHook('error', url, element);
      });
    }
  }, {
    key: 'invokeStateHook',
    value: function invokeStateHook(state, url, element) {
      if (this.options.onStateChange) {
        this.options.onStateChange(state, url, element, this);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeEventListener();
      this.clean();
      this.setOptions({});
    }
  }]);
  return JuejinLazyload;
}();

return JuejinLazyload;

})));
