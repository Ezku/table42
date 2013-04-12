(function(window){
/*! steroids-js - v0.6.1 - 2013-04-08 */
;var Bridge,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Bridge = (function() {

  Bridge.prototype.uid = 0;

  Bridge.prototype.callbacks = {};

  Bridge.bestNativeBridge = null;

  Bridge.getBestNativeBridge = function() {
    var bridgeClass, prioritizedList, _i, _len;
    prioritizedList = [AndroidBridge, WebsocketBridge];
    if (this.bestNativeBridge == null) {
      for (_i = 0, _len = prioritizedList.length; _i < _len; _i++) {
        bridgeClass = prioritizedList[_i];
        if (!(this.bestNativeBridge != null)) {
          if (bridgeClass.isUsable()) {
            this.bestNativeBridge = new bridgeClass();
          }
        }
      }
    }
    return this.bestNativeBridge;
  };

  function Bridge() {
    this.send = __bind(this.send, this);

    this.nativeCall = __bind(this.nativeCall, this);

    this.message_handler = __bind(this.message_handler, this);

  }

  Bridge.prototype.sendMessageToNative = function(options) {
    if (options == null) {
      options = {};
    }
    throw "ERROR: Bridge#sendMessageToNative not overridden by subclass!";
  };

  Bridge.isUsable = function() {
    throw "ERROR: Bridge.isUsable not overridden by subclass!";
  };

  Bridge.prototype.message_handler = function(e) {
    var msg;
    msg = JSON.parse(e);
    if ((msg != null ? msg.callback : void 0) != null) {
      if (this.callbacks[msg.callback] != null) {
        return this.callbacks[msg.callback].call(msg.parameters, msg.parameters);
      }
    }
  };

  Bridge.prototype.nativeCall = function(options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    return this.send({
      method: options.method,
      parameters: options.parameters,
      callbacks: {
        recurring: function(parameters) {
          var callback, _i, _len, _ref, _results;
          _ref = options.recurringCallbacks;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            callback = _ref[_i];
            if (callback != null) {
              _results.push(callback.call(_this, parameters, options));
            }
          }
          return _results;
        },
        success: function(parameters) {
          var callback, _i, _len, _ref, _results;
          _ref = options.successCallbacks;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            callback = _ref[_i];
            if (callback != null) {
              _results.push(callback.call(_this, parameters, options));
            }
          }
          return _results;
        },
        failure: function(parameters) {
          var callback, _i, _len, _ref, _results;
          _ref = options.failureCallbacks;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            callback = _ref[_i];
            if (callback != null) {
              _results.push(callback.call(_this, parameters, options));
            }
          }
          return _results;
        }
      }
    });
  };

  Bridge.prototype.send = function(options) {
    var callbacks, request;
    if (options == null) {
      options = {};
    }
    callbacks = this.storeCallbacks(options);
    request = {
      method: options.method,
      parameters: (options != null ? options.parameters : void 0) != null ? options.parameters : {},
      callbacks: callbacks
    };
    request.parameters["view"] = window.top.AG_VIEW_ID;
    request.parameters["screen"] = window.top.AG_SCREEN_ID;
    request.parameters["layer"] = window.top.AG_LAYER_ID;
    request.parameters["udid"] = window.top.AG_WEBVIEW_UDID;
    return this.sendMessageToNative(JSON.stringify(request));
  };

  Bridge.prototype.storeCallbacks = function(options) {
    var callback_prefix, callbacks,
      _this = this;
    if (options == null) {
      options = {};
    }
    if ((options != null ? options.callbacks : void 0) == null) {
      return {};
    }
    callback_prefix = "" + options.method + "_" + (this.uid++);
    callbacks = {};
    if (options.callbacks.recurring != null) {
      callbacks.recurring = "" + callback_prefix + "_recurring";
      this.callbacks[callbacks.recurring] = function(parameters) {
        return options.callbacks.recurring.call(parameters, parameters);
      };
    }
    if (options.callbacks.success != null) {
      callbacks.success = "" + callback_prefix + "_success";
      this.callbacks[callbacks.success] = function(parameters) {
        delete _this.callbacks[callbacks.success];
        delete _this.callbacks[callbacks.failure];
        return options.callbacks.success.call(parameters, parameters);
      };
    }
    if (options.callbacks.failure != null) {
      callbacks.failure = "" + callback_prefix + "_fail";
      this.callbacks[callbacks.failure] = function(parameters) {
        delete _this.callbacks[callbacks.success];
        delete _this.callbacks[callbacks.failure];
        return options.callbacks.failure.call(parameters, parameters);
      };
    }
    return callbacks;
  };

  return Bridge;

})();
;var AndroidBridge,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AndroidBridge = (function(_super) {

  __extends(AndroidBridge, _super);

  function AndroidBridge() {
    AndroidAPIBridge.registerHandler("steroids.nativeBridge.message_handler");
    window.AG_SCREEN_ID = AndroidAPIBridge.getAGScreenId();
    window.AG_LAYER_ID = AndroidAPIBridge.getAGLayerId();
    window.AG_VIEW_ID = AndroidAPIBridge.getAGViewId();
    return true;
  }

  AndroidBridge.isUsable = function() {
    return typeof AndroidAPIBridge !== 'undefined';
  };

  AndroidBridge.prototype.sendMessageToNative = function(message) {
    return AndroidAPIBridge.send(message);
  };

  return AndroidBridge;

})(Bridge);
;var WebsocketBridge,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

WebsocketBridge = (function(_super) {

  __extends(WebsocketBridge, _super);

  function WebsocketBridge() {
    this.message_handler = __bind(this.message_handler, this);

    this.map_context = __bind(this.map_context, this);

    this.open = __bind(this.open, this);

    this.reopen = __bind(this.reopen, this);
    this.reopen();
  }

  WebsocketBridge.isUsable = function() {
    return true;
  };

  WebsocketBridge.prototype.reopen = function() {
    window.steroids.debug("websocket reopen");
    this.websocket = null;
    if (window.AG_CLIENT_VERSION && window.AG_CLIENT_VERSION !== "2.3.3") {
      return this.requestWebSocketPort(this.open);
    } else {
      return this.open("31337");
    }
  };

  WebsocketBridge.prototype.open = function(port) {
    var _this = this;
    this.websocket = new WebSocket("ws://localhost:" + port);
    this.websocket.onmessage = this.message_handler;
    this.websocket.onclose = this.reopen;
    this.websocket.onopen = function() {
      window.steroids.debug("websocket websocket opened");
      _this.map_context();
      return _this.markWebsocketUsable();
    };
    return window.steroids.debug("websocket websocket connecting");
  };

  WebsocketBridge.prototype.requestWebSocketPort = function(callback) {
    var xmlhttp,
      _this = this;
    window.steroids.debug("websocket request port");
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4) {
        window.steroids.debug("websocket request port success: " + xmlhttp.responseText);
        return callback(xmlhttp.responseText);
      }
    };
    xmlhttp.open("GET", "http://dolans.inetrnul.do.nut.cunnoct.localhost/");
    return xmlhttp.send();
  };

  WebsocketBridge.prototype.markWebsocketUsable = function() {
    window.steroids.debug("websocket open, marking usable");
    return window.steroids.fireSteroidsEvent("websocketUsable");
  };

  WebsocketBridge.prototype.map_context = function() {
    this.send({
      method: "mapWebSocketConnectionToContext"
    });
    return this;
  };

  WebsocketBridge.prototype.sendMessageToNative = function(message) {
    var _ref,
      _this = this;
    if (((_ref = this.websocket) != null ? _ref.readyState : void 0) === 1) {
      return this.websocket.send(message);
    } else {
      return window.steroids.on("websocketUsable", function() {
        return _this.websocket.send(message);
      });
    }
  };

  WebsocketBridge.prototype.message_handler = function(e) {
    return WebsocketBridge.__super__.message_handler.call(this, e.data);
  };

  return WebsocketBridge;

})(Bridge);
;var Events;

Events = (function() {

  function Events() {}

  Events.dispatchVisibilitychangedEvent = function(options) {
    var visibilityChangeCustomEvent;
    if (options == null) {
      options = {};
    }
    steroids.debug({
      msg: "dispatched visibilitychanged"
    });
    visibilityChangeCustomEvent = document.createEvent("CustomEvent");
    visibilityChangeCustomEvent.initCustomEvent("visibilitychange", true, true);
    return document.dispatchEvent(visibilityChangeCustomEvent);
  };

  Events.initializeVisibilityState = function(options) {
    if (options == null) {
      options = {};
    }
    steroids.debug({
      msg: "set document.visibilityState to unloaded"
    });
    document.visibilityState = "unloaded";
    document.hidden = "true";
    return document.addEventListener("DOMContentLoaded", function() {
      steroids.debug({
        msg: "got DOMContentLoaded, setting document.visibilityState to prerender"
      });
      return document.visibilityState = "prerender";
    });
  };

  Events.checkInitialVisibility = function(options, callbacks) {
    var setVisibilityStatus;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    setVisibilityStatus = function(event) {
      document.hidden = event.currentVisibility === "hidden";
      document.visibilityState = event.currentVisibility;
      return steroids.markComponentReady("Events.initialVisibility");
    };
    return steroids.nativeBridge.nativeCall({
      method: "getCurrentVisibility",
      successCallbacks: [setVisibilityStatus, callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  Events.extend = function(options, callbacks) {
    var becomeHiddenEvent, becomeVisibleEvent, focusAdded, lostFocusAdded,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    this.initializeVisibilityState();
    this.checkInitialVisibility();
    focusAdded = function() {
      steroids.debug({
        msg: "focus added"
      });
      return steroids.nativeBridge.nativeCall({
        method: "addEventListener",
        parameters: {
          event: "lostFocus"
        },
        successCallbacks: [lostFocusAdded, callbacks.onSuccess],
        recurringCallbacks: [becomeHiddenEvent, callbacks.onFailure]
      });
    };
    lostFocusAdded = function() {
      steroids.debug({
        msg: "lostfocus added"
      });
      return steroids.markComponentReady("Events.focuslisteners");
    };
    becomeVisibleEvent = function() {
      steroids.debug({
        msg: "become visible"
      });
      document.visibilityState = "visible";
      document.hidden = false;
      return _this.dispatchVisibilitychangedEvent();
    };
    becomeHiddenEvent = function() {
      steroids.debug({
        msg: "document become hidden"
      });
      document.visibilityState = "hidden";
      document.hidden = true;
      return _this.dispatchVisibilitychangedEvent();
    };
    return steroids.nativeBridge.nativeCall({
      method: "addEventListener",
      parameters: {
        event: "focus"
      },
      successCallbacks: [focusAdded, callbacks.onSuccess],
      recurringCallbacks: [becomeVisibleEvent, callbacks.onFailure]
    });
  };

  return Events;

}).call(this);
;var Torch;

Torch = (function() {

  function Torch() {}

  Torch.prototype.turnOn = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "cameraFlashOn",
      parameters: options,
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  Torch.prototype.turnOff = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "cameraFlashOff",
      parameters: options,
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  Torch.prototype.toggle = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "cameraFlashToggle",
      parameters: options,
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return Torch;

})();
;var Device,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Device = (function() {

  function Device() {
    this.getIPAddress = __bind(this.getIPAddress, this);

    this.ping = __bind(this.ping, this);

  }

  Device.prototype.torch = new Torch();

  Device.prototype.ping = function(options, callbacks) {
    var data;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    data = options.constructor.name === "String" ? options : options.data;
    return steroids.nativeBridge.nativeCall({
      method: "ping",
      parameters: {
        payload: data
      },
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  Device.prototype.getIPAddress = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "getIPAddress",
      parameters: {},
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return Device;

})();
;var Animation,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Animation = (function() {

  Animation.TRANSITION_REVERSION_MAPPING = {
    slideFromLeft: "slideFromRight",
    slideFromRight: "slideFromLeft",
    slideFromBottom: "slideFromTop",
    slideFromTop: "slideFromBottom",
    curlUp: "curlDown",
    curlDown: "curlUp",
    fade: "fade",
    flipVerticalFromBottom: "flipVerticalFromTop",
    flipVerticalFromTop: "flipVerticalFromBottom",
    flipHorizontalFromLeft: "flipHorizontalFromRight",
    flipHorizontalFromRight: "flipHorizontalFromLeft"
  };

  function Animation(options) {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    if (options == null) {
      options = {};
    }
    this.perform = __bind(this.perform, this);

    this.transition = options.constructor.name === "String" ? options : (_ref = options.transition) != null ? _ref : "curlUp";
    if (this.transition == null) {
      throw "transition required";
    }
    this.reversedTransition = (_ref1 = options.reversedTransition) != null ? _ref1 : this.constructor.TRANSITION_REVERSION_MAPPING[this.transition];
    this.duration = (_ref2 = options.duration) != null ? _ref2 : 0.7;
    this.reversedDuration = (_ref3 = options.reversedDuration) != null ? _ref3 : this.duration;
    this.curve = (_ref4 = options.curve) != null ? _ref4 : "easeInOut";
    this.reversedCurve = (_ref5 = options.reversedCurve) != null ? _ref5 : "easeInOut";
  }

  Animation.prototype.perform = function(options, callbacks) {
    var _ref, _ref1;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    if (window.orientation !== 0 && ((_ref = this.transition) === "slideFromRight" || _ref === "slideFromLeft" || _ref === "slideFromTop" || _ref === "slideFromBottom")) {
      if ((_ref1 = callbacks.onFailure) != null) {
        _ref1.call();
      }
      return;
    }
    return steroids.nativeBridge.nativeCall({
      method: "performTransition",
      parameters: {
        transition: this.transition,
        curve: options.curve || this.curve,
        duration: options.duration || this.duration
      },
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return Animation;

})();
;var App;

App = (function() {

  App.prototype.path = void 0;

  App.prototype.userFilesPath = void 0;

  App.prototype.absolutePath = void 0;

  App.prototype.absoluteUserFilesPath = void 0;

  function App() {
    var _this = this;
    this.getPath({}, {
      onSuccess: function(params) {
        _this.path = params.applicationPath;
        _this.userFilesPath = params.userFilesPath;
        _this.absolutePath = params.applicationFullPath;
        _this.absoluteUserFilesPath = params.userFilesFullPath;
        return steroids.markComponentReady("App");
      }
    });
  }

  App.prototype.getPath = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "getApplicationPath",
      parameters: {},
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  App.prototype.getLaunchURL = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return window.AG_STEROIDS_SCANNER_URL;
  };

  return App;

})();
;var Modal;

Modal = (function() {

  function Modal() {}

  Modal.prototype.show = function(options, callbacks) {
    var parameters, view;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    view = options.constructor.name === "Object" ? options.view : options;
    switch (view.constructor.name) {
      case "PreviewFileView":
        return steroids.nativeBridge.nativeCall({
          method: "previewFile",
          parameters: {
            filenameWithPath: view.getNativeFilePath()
          },
          successCallbacks: [callbacks.onSuccess],
          failureCallbacks: [callbacks.onFailure]
        });
      case "WebView":
        parameters = view.id != null ? {
          id: view.id
        } : {
          url: view.location
        };
        if (options.keepLoading === true) {
          parameters.keepTransitionHelper = true;
        }
        return steroids.nativeBridge.nativeCall({
          method: "openModal",
          parameters: parameters,
          successCallbacks: [callbacks.onSuccess],
          failureCallbacks: [callbacks.onFailure]
        });
      default:
        throw "Unsupported view sent to steroids.modal.show - " + view.constructor.name;
    }
  };

  Modal.prototype.hide = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "closeModal",
      parameters: options,
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return Modal;

})();
;var LayerCollection;

LayerCollection = (function() {

  function LayerCollection() {
    this.array = [];
  }

  LayerCollection.prototype.pop = function(options, callbacks) {
    var defaultOnSuccess,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    defaultOnSuccess = function() {
      return _this.array.pop();
    };
    return steroids.nativeBridge.nativeCall({
      method: "popLayer",
      successCallbacks: [defaultOnSuccess, callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  LayerCollection.prototype.popAll = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "popAllLayers",
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  LayerCollection.prototype.push = function(options, callbacks) {
    var defaultOnSuccess, parameters, view,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    defaultOnSuccess = function() {
      return _this.array.push(view);
    };
    view = options.constructor.name === "WebView" ? options : options.view;
    parameters = view.id != null ? {
      id: view.id
    } : {
      url: view.location
    };
    if (options.navigationBar === false) {
      parameters.hidesNavigationBar = true;
    }
    if (options.keepLoading === true) {
      parameters.keepTransitionHelper = true;
    }
    if (options.animation != null) {
      parameters.pushAnimation = options.animation.transition;
      parameters.pushAnimationDuration = options.animation.duration;
      parameters.popAnimation = options.animation.reversedTransition;
      parameters.popAnimationDuration = options.animation.reversedDuration;
      parameters.pushAnimationCurve = options.animation.curve;
      parameters.popAnimationCurve = options.animation.reversedCurve;
    }
    return steroids.nativeBridge.nativeCall({
      method: "openLayer",
      parameters: parameters,
      successCallbacks: [defaultOnSuccess, callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return LayerCollection;

})();
;var NavigationBarButton;

NavigationBarButton = (function() {

  function NavigationBarButton(options) {
    if (options == null) {
      options = {};
    }
    this.title = options.title;
    this.onTap = options.onTap;
  }

  return NavigationBarButton;

})();
;var NavigationBar;

NavigationBar = (function() {

  function NavigationBar() {}

  NavigationBar.prototype.hide = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "hideNavigationBar",
      parameters: {},
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  NavigationBar.prototype.show = function(options, callbacks) {
    var title;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    title = options.constructor.name === "String" ? options : options.title;
    return steroids.nativeBridge.nativeCall({
      method: "showNavigationBar",
      parameters: {
        title: title
      },
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  NavigationBar.prototype.setButtons = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    steroids.debug("steroids.navigationBar.setButtons options: " + (JSON.stringify(options)) + " callbacks: " + (JSON.stringify(callbacks)));
    if ((options.right != null) && options.right !== []) {
      steroids.debug("steroids.navigationBar.setButtons showing right button title: " + options.right[0].title + " callback: " + options.right[0].onTap);
      return steroids.nativeBridge.nativeCall({
        method: "showNavigationBarRightButton",
        parameters: {
          title: options.right[0].title
        },
        successCallbacks: [callbacks.onSuccess],
        recurringCallbacks: [options.right[0].onTap],
        failureCallbacks: [callbacks.onFailure]
      });
    } else {
      steroids.debug("steroids.navigationBar.setButtons hiding right button");
      return steroids.nativeBridge.nativeCall({
        method: "hideNavigationBarRightButton",
        parameters: {},
        successCallbacks: [callbacks.onSuccess],
        failureCallbacks: [callbacks.onFailure]
      });
    }
  };

  return NavigationBar;

})();
;var BounceShadow;

BounceShadow = (function() {

  function BounceShadow() {}

  BounceShadow.prototype.hide = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return this.setVisibility({
      visibility: false
    }, callbacks);
  };

  BounceShadow.prototype.show = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return this.setVisibility({
      visibility: true
    }, callbacks);
  };

  BounceShadow.prototype.setVisibility = function(options, callbacks) {
    var visibility;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    visibility = options.constructor.name === "String" ? options : options.visibility;
    return steroids.nativeBridge.nativeCall({
      method: "setWebViewBounceShadowVisibility",
      parameters: {
        visibility: visibility
      },
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return BounceShadow;

})();
;var WebView,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

WebView = (function() {

  WebView.prototype.params = {};

  WebView.prototype.id = null;

  WebView.prototype.location = null;

  WebView.prototype.allowedRotations = null;

  WebView.prototype.navigationBar = new NavigationBar;

  WebView.prototype.bounceShadow = new BounceShadow;

  function WebView(options) {
    if (options == null) {
      options = {};
    }
    this.location = options.constructor.name === "String" ? options : options.location;
    if (this.location.indexOf("://") === -1) {
      if (window.location.href.indexOf("file://") === -1) {
        this.location = "" + window.location.protocol + "//" + window.location.host + "/" + this.location;
      }
    }
    this.params = this.getParams();
    this.setAllowedRotations([]);
  }

  WebView.prototype.preload = function(options, callbacks) {
    var proposedId, setIdOnSuccess,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    steroids.debug("preload called for WebView " + (JSON.stringify(this)));
    proposedId = options.id || this.location;
    setIdOnSuccess = function() {
      steroids.debug("preload success: setting id");
      return _this.id = proposedId;
    };
    return steroids.nativeBridge.nativeCall({
      method: "preloadLayer",
      parameters: {
        id: proposedId,
        url: options.location || this.location
      },
      successCallbacks: [setIdOnSuccess, callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  WebView.prototype.getParams = function() {
    var pair, pairString, pairStrings, params, _i, _len;
    params = {};
    pairStrings = this.location.slice(this.location.indexOf('?') + 1).split('&');
    for (_i = 0, _len = pairStrings.length; _i < _len; _i++) {
      pairString = pairStrings[_i];
      pair = pairString.split('=');
      params[pair[0]] = pair[1];
    }
    return params;
  };

  WebView.prototype.removeLoading = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "removeTransitionHelper",
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  WebView.prototype.setAllowedRotations = function(options, callbacks) {
    var _ref,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    this.allowedRotations = options.constructor.name === "Array" ? options : options.allowedRotations;
    window.shouldRotateToOrientation = function(orientation) {
      if (__indexOf.call(_this.allowedRotations, orientation) >= 0) {
        return true;
      } else {
        return false;
      }
    };
    return (_ref = callbacks.onSuccess) != null ? _ref.call() : void 0;
  };

  WebView.prototype.setBackgroundColor = function(options, callbacks) {
    var newColor;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    newColor = options.constructor.name === "String" ? options : options.color;
    return steroids.nativeBridge.nativeCall({
      method: "setWebViewBackgroundColor",
      parameters: {
        color: newColor
      },
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return WebView;

})();
;var PreviewFileView;

PreviewFileView = (function() {

  function PreviewFileView(options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    this.filePath = options.constructor.name === "String" ? options : options.filePath;
    this.relativeTo = (_ref = options.relativeTo) != null ? _ref : steroids.app.path;
  }

  PreviewFileView.prototype.getNativeFilePath = function() {
    return "" + this.relativeTo + "/" + this.filePath;
  };

  return PreviewFileView;

})();
;var Audio;

Audio = (function() {

  function Audio() {}

  Audio.prototype.play = function(options, callbacks) {
    var readyCapableDevice,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    readyCapableDevice = false;
    setTimeout(function() {
      if (readyCapableDevice) {
        return;
      }
      return navigator.notification.alert("Audio playback requires a newer version of Scanner, please update from the App Store.", null, "Update Required");
    }, 500);
    return steroids.on("ready", function() {
      var mediaPath, relativeTo, _ref;
      readyCapableDevice = true;
      relativeTo = (_ref = options.relativeTo) != null ? _ref : steroids.app.path;
      mediaPath = options.constructor.name === "String" ? "" + relativeTo + "/" + options : "" + relativeTo + "/" + options.path;
      return steroids.nativeBridge.nativeCall({
        method: "play",
        parameters: {
          filenameWithPath: mediaPath
        },
        successCallbacks: [callbacks.onSuccess],
        failureCallbacks: [callbacks.onFailure]
      });
    });
  };

  Audio.prototype.prime = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "primeAudioPlayer",
      parameters: options,
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return Audio;

})();
;var OAuth2Flow;

OAuth2Flow = (function() {

  function OAuth2Flow(options) {
    this.options = options != null ? options : {};
    this.options.callbackUrl = "http://localhost:13101/" + this.options.callbackPath;
  }

  OAuth2Flow.prototype.authenticate = function() {
    throw "ERROR: " + this.name + " has not overridden authenticate method";
  };

  OAuth2Flow.prototype.concatenateUrlParams = function(params) {
    var first, key, result, value;
    first = true;
    result = "";
    for (key in params) {
      value = params[key];
      if (first) {
        result = result.concat("?");
        first = false;
      } else {
        result = result.concat("&");
      }
      result = result.concat("" + key + "=" + (encodeURIComponent(value)));
    }
    return result;
  };

  OAuth2Flow.prototype.urlEncode = function(string) {
    var c, hex, i, reserved_chars, str_len, string_arr;
    hex = function(code) {
      var result;
      result = code.toString(16).toUpperCase();
      if (result.length < 2) {
        result = 0 + result;
      }
      return "%" + result;
    };
    if (!string) {
      return "";
    }
    string = string + "";
    reserved_chars = /[ \r\n!*"'();:@&=+$,\/?%#\[\]<>{}|`^\\\u0080-\uffff]/;
    str_len = string.length;
    i = void 0;
    string_arr = string.split("");
    c = void 0;
    i = 0;
    while (i < str_len) {
      if (c = string_arr[i].match(reserved_chars)) {
        c = c[0].charCodeAt(0);
        if (c < 128) {
          string_arr[i] = hex(c);
        } else if (c < 2048) {
          string_arr[i] = hex(192 + (c >> 6)) + hex(128 + (c & 63));
        } else if (c < 65536) {
          string_arr[i] = hex(224 + (c >> 12)) + hex(128 + ((c >> 6) & 63)) + hex(128 + (c & 63));
        } else {
          if (c < 2097152) {
            string_arr[i] = hex(240 + (c >> 18)) + hex(128 + ((c >> 12) & 63)) + hex(128 + ((c >> 6) & 63)) + hex(128 + (c & 63));
          }
        }
      }
      i++;
    }
    return string_arr.join("");
  };

  return OAuth2Flow;

})();
;var AuthorizationCodeFlow,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AuthorizationCodeFlow = (function(_super) {

  __extends(AuthorizationCodeFlow, _super);

  function AuthorizationCodeFlow() {
    this.finish = __bind(this.finish, this);

    this.authenticate = __bind(this.authenticate, this);
    return AuthorizationCodeFlow.__super__.constructor.apply(this, arguments);
  }

  AuthorizationCodeFlow.prototype.authenticate = function() {
    var authenticationLayer, authorizationUrl;
    this.xhrAuthorizationParams = {
      response_type: "code",
      client_id: this.options.clientID,
      redirect_uri: this.options.callbackUrl,
      scope: this.options.scope || ""
    };
    authorizationUrl = this.options.authorizationUrl.concat(this.concatenateUrlParams(this.xhrAuthorizationParams));
    authenticationLayer = new steroids.views.WebView({
      location: authorizationUrl
    });
    return steroids.modal.show({
      layer: authenticationLayer
    });
  };

  AuthorizationCodeFlow.prototype.finish = function(callback) {
    var body, key, request, value, _ref,
      _this = this;
    this.xhrAccessTokenParams = {
      client_id: this.options.clientID,
      client_secret: this.options.clientSecret,
      redirect_uri: this.callbackUrl,
      grant_type: "authorization_code"
    };
    request = new XMLHttpRequest();
    request.open("POST", this.options.accessTokenUrl);
    body = [];
    _ref = this.xhrAccessTokenParams;
    for (key in _ref) {
      value = _ref[key];
      body.push("" + key + "=" + (this.urlEncode(value)));
    }
    body.push("code=" + steroids.view.params['code']);
    body = body.sort().join('&');
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function() {
      var responseJSON;
      if (request.readyState === 4) {
        responseJSON = JSON.parse(request.responseText);
        callback(responseJSON.access_token);
        return steroids.modal.hide();
      }
    };
    return request.send(body);
  };

  return AuthorizationCodeFlow;

})(OAuth2Flow);
;var ClientCredentialsFlow,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ClientCredentialsFlow = (function(_super) {

  __extends(ClientCredentialsFlow, _super);

  function ClientCredentialsFlow() {
    return ClientCredentialsFlow.__super__.constructor.apply(this, arguments);
  }

  ClientCredentialsFlow.prototype.authenticate = function(callback) {
    var body, key, request, value, _ref,
      _this = this;
    this.xhrAccessTokenParams = {
      client_id: this.options.clientID,
      client_secret: this.options.clientSecret,
      scope: this.options.scope || "",
      grant_type: "client_credentials"
    };
    request = new XMLHttpRequest();
    request.open("POST", this.options.accessTokenUrl);
    body = [];
    _ref = this.xhrAccessTokenParams;
    for (key in _ref) {
      value = _ref[key];
      body.push("" + key + "=" + (this.urlEncode(value)));
    }
    body = body.sort().join('&');
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function() {
      var responseJSON;
      if (request.readyState === 4) {
        responseJSON = JSON.parse(request.responseText);
        return callback(responseJSON.access_token);
      }
    };
    return request.send(body);
  };

  return ClientCredentialsFlow;

})(OAuth2Flow);
;var OAuth2;

OAuth2 = (function() {

  function OAuth2() {}

  OAuth2.AuthorizationCodeFlow = AuthorizationCodeFlow;

  OAuth2.ClientCredentialFlow = ClientCredentialsFlow;

  return OAuth2;

})();
;var TouchDB;

TouchDB = (function() {

  TouchDB.baseURL = "http://.touchdb.";

  function TouchDB(options) {
    this.options = options != null ? options : {};
    if (!this.options.name) {
      throw "Database name required";
    }
    this.replicas = {};
    this.baseURL = "" + TouchDB.baseURL + "/" + this.options.name;
  }

  TouchDB.prototype.startMonitoringChanges = function(options, callbacks) {
    var request,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    request = new XMLHttpRequest();
    request.open("GET", "" + this.baseURL + "/_changes?feed=continuous");
    request.onreadystatechange = function() {
      if (request.readyState !== 3) {
        return;
      }
      return callbacks.onChange();
    };
    return request.send();
  };

  TouchDB.prototype.createDB = function(options, callbacks) {
    var request,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    request = new XMLHttpRequest();
    request.open("PUT", "" + this.baseURL + "/");
    request.onreadystatechange = function() {
      var errorObj, responseObj;
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 412) {
        errorObj = JSON.parse(request.responseText);
        if (callbacks.onFailure) {
          callbacks.onFailure(errorObj);
        }
      }
      if (request.status === 201) {
        responseObj = JSON.parse(request.responseText);
        if (callbacks.onSuccess) {
          return callbacks.onSuccess(responseObj);
        }
      }
    };
    return request.send();
  };

  TouchDB.prototype.addTwoWayReplica = function(options, callbacks) {
    var fromCloudAdded, fromCloudFailed, toCloudAdded, toCloudFailed,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    toCloudAdded = function() {
      return _this.startReplication({
        source: options.url,
        target: _this.options.name
      }, {
        onSuccess: fromCloudAdded,
        onFailure: fromCloudFailed
      });
    };
    toCloudFailed = function() {
      if (callbacks.onFailure) {
        return callbacks.onFailure();
      }
    };
    fromCloudAdded = function() {
      _this.replicas[options.url] = {};
      if (callbacks.onSuccess) {
        return callbacks.onSuccess();
      }
    };
    fromCloudFailed = function() {
      if (callbacks.onFailure) {
        return callbacks.onFailure();
      }
    };
    return this.startReplication({
      source: this.options.name,
      target: options.url
    }, {
      onSuccess: toCloudAdded,
      onFailure: toCloudFailed
    });
  };

  TouchDB.prototype.startReplication = function(options, callbacks) {
    var request,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    request = new XMLHttpRequest();
    request.open("POST", "" + TouchDB.baseURL + "/_replicate");
    request.onreadystatechange = function() {
      var errorObj, responseObj;
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 412) {
        errorObj = JSON.parse(request.responseText);
        callbacks.onFailure(errorObj);
      }
      if (request.status === 200) {
        responseObj = JSON.parse(request.responseText);
        return callbacks.onSuccess.call(responseObj);
      }
    };
    return request.send(JSON.stringify({
      source: options.source,
      target: options.target,
      continuous: true
    }));
  };

  return TouchDB;

})();
;var XHR,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

XHR = (function() {

  XHR.prototype.headers = [];

  function XHR() {
    this.setRequestHeader = __bind(this.setRequestHeader, this);

    this.send = __bind(this.send, this);
    this.method = void 0;
    this.url = void 0;
    this.async = void 0;
    this.status = 0;
    this.readyState = 0;
    this.headers = {};
  }

  XHR.prototype.open = function(methodString, urlString, isAsync) {
    if (isAsync == null) {
      isAsync = true;
    }
    this.method = methodString;
    this.url = urlString;
    return this.async = isAsync;
  };

  XHR.prototype.send = function(data) {
    if (!(this.method && this.url)) {
      throw "Error: INVALID_STATE_ERR: DOM Exception 11";
    }
    if (this.method !== "GET") {
      throw "Method not implemented";
    }
    return this.fetch({
      url: this.url,
      filenameWithPath: "temp",
      headers: this.headers
    });
  };

  XHR.prototype.setRequestHeader = function(name, value) {
    return this.headers[name] = value;
  };

  XHR.prototype.fetch = function(options, callbacks) {
    var destinationPath;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    destinationPath = options.constructor.name === "String" ? options : options.absoluteDestinationPath;
    return steroids.nativeBridge.nativeCall({
      method: "downloadFile",
      parameters: {
        url: options.url || this.url,
        headers: options.headers || this.headers,
        filenameWithPath: destinationPath
      },
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return XHR;

})();
;var Analytics;

Analytics = (function() {

  function Analytics() {}

  Analytics.prototype.recordEvent = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "recordEvent",
      parameters: {
        type: "custom",
        attributes: options.event
      },
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return Analytics;

})();
;var Screen;

Screen = (function() {

  function Screen() {}

  Screen.prototype.freeze = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "freeze",
      parameters: options,
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  Screen.prototype.unfreeze = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "unfreeze",
      parameters: options,
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  Screen.prototype.capture = function(options, callbacks) {
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    return steroids.nativeBridge.nativeCall({
      method: "takeScreenshot",
      parameters: options,
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return Screen;

})();
;var File;

File = (function() {

  function File(options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    this.path = options.constructor.name === "String" ? options : options.path;
    this.relativeTo = (_ref = options.relativeTo) != null ? _ref : steroids.app.path;
  }

  File.prototype.resizeImage = function(options, callbacks) {
    var nativeCompression, parameters, userCompression, _ref, _ref1, _ref2, _ref3;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    if (this.relativeTo !== steroids.app.userFilesPath) {
      throw "Cannot resize images outside `steroids.app.userFilesPath`. Files must first be copied under application document root and then resized.";
    }
    userCompression = (_ref = (_ref1 = options.format) != null ? _ref1.compression : void 0) != null ? _ref : 100;
    nativeCompression = 1 - (userCompression / 100);
    parameters = {
      filenameWithPath: "" + this.relativeTo + "/" + this.path,
      format: (_ref2 = (_ref3 = options.format) != null ? _ref3.type : void 0) != null ? _ref2 : "jpg",
      compression: nativeCompression
    };
    if (options.constraint != null) {
      switch (options.constraint.dimension) {
        case "width":
          parameters.size = {
            width: options.constraint.length
          };
          break;
        case "height":
          parameters.size = {
            height: options.constraint.length
          };
          break;
        default:
          throw "unknown constraint name";
      }
    } else {
      throw "constraint not specified";
    }
    return steroids.nativeBridge.nativeCall({
      method: "resizeImage",
      parameters: parameters,
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  File.prototype.unzip = function(options, callbacks) {
    var destinationPath, parameters, sourcePath;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    sourcePath = "" + this.relativeTo + "/" + this.path;
    destinationPath = options.constructor.name === "String" ? options : options.destinationPath;
    parameters = {
      filenameWithPath: sourcePath,
      path: destinationPath
    };
    return steroids.nativeBridge.nativeCall({
      method: "unzip",
      parameters: parameters,
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return File;

})();
;var OpenURL;

OpenURL = (function() {

  function OpenURL() {}

  OpenURL.open = function(options, callbacks) {
    var url;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    url = options.constructor.name === "String" ? options : options.url;
    return steroids.nativeBridge.nativeCall({
      method: "openURL",
      parameters: {
        url: url
      },
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return OpenURL;

})();
;var Notifications;

Notifications = (function() {

  function Notifications() {}

  Notifications.prototype.post = function(options, callbacks) {
    var message;
    if (options == null) {
      options = {};
    }
    if (callbacks == null) {
      callbacks = {};
    }
    message = options.constructor.name === "String" ? options : options.message;
    return steroids.nativeBridge.nativeCall({
      method: "postNotification",
      parameters: {
        body: message
      },
      successCallbacks: [callbacks.onSuccess],
      failureCallbacks: [callbacks.onFailure]
    });
  };

  return Notifications;

})();
;var PostMessage;

PostMessage = (function() {

  function PostMessage() {}

  PostMessage.postMessage = function(message, targetOrigin) {
    var callbacks, escapedJSONMessage;
    callbacks = {};
    escapedJSONMessage = escape(JSON.stringify(message));
    return steroids.nativeBridge.nativeCall({
      method: "broadcastJavascript",
      parameters: {
        javascript: "steroids.PostMessage.dispatchMessageEvent('" + escapedJSONMessage + "', '*');"
      },
      successCallbacks: [callbacks.onSuccess],
      recurringCallbacks: [callbacks.onFailure]
    });
  };

  PostMessage.dispatchMessageEvent = function(escapedJSONMessage, targetOrigin) {
    var e, message;
    message = JSON.parse(unescape(escapedJSONMessage));
    e = document.createEvent("MessageEvent");
    e.initMessageEvent("message", false, false, message, "", "", window, null);
    return window.dispatchEvent(e);
  };

  return PostMessage;

}).call(this);
;
window.steroids = {
  version: "0.6.1",
  Animation: Animation,
  XHR: XHR,
  File: File,
  views: {
    WebView: WebView,
    PreviewFileView: PreviewFileView
  },
  buttons: {
    NavigationBarButton: NavigationBarButton
  },
  data: {
    TouchDB: TouchDB,
    OAuth2: OAuth2
  },
  eventCallbacks: {},
  waitingForComponents: [],
  debugMessages: [],
  debugEnabled: false,
  debug: function(options) {
    var debugMessage, msg;
    if (options == null) {
      options = {};
    }
    if (!steroids.debugEnabled) {
      return;
    }
    msg = options.constructor.name === "String" ? options : options.msg;
    debugMessage = "" + window.location.href + " - " + msg;
    window.steroids.debugMessages.push(debugMessage);
    return console.log(debugMessage);
  },
  on: function(event, callback) {
    var _base;
    this.debug("on event " + event);
    if (this["" + event + "_has_fired"] != null) {
      this.debug("on event " + event + ", alrueady fierd");
      return callback();
    } else {
      this.debug("on event " + event + ", waiting");
      (_base = this.eventCallbacks)[event] || (_base[event] = []);
      return this.eventCallbacks[event].push(callback);
    }
  },
  fireSteroidsEvent: function(event) {
    var callback, callbacks, _i, _len, _results;
    this.debug("firign event " + event);
    this["" + event + "_has_fired"] = new Date().getTime();
    if (this.eventCallbacks[event] != null) {
      callbacks = this.eventCallbacks[event].splice(0);
      _results = [];
      for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
        callback = callbacks[_i];
        this.debug("firing event callback");
        _results.push(callback());
      }
      return _results;
    }
  },
  markComponentReady: function(model) {
    this.debug("" + model + " is ready");
    this.waitingForComponents.splice(this.waitingForComponents.indexOf(model), 1);
    if (this.waitingForComponents.length === 0) {
      this.debug("steroids is ready");
      return this.fireSteroidsEvent("ready");
    }
  }
};

window.steroids.nativeBridge = Bridge.getBestNativeBridge();

window.steroids.waitingForComponents.push("App");

window.steroids.app = new App;

window.steroids.waitingForComponents.push("Events.focuslisteners");

window.steroids.waitingForComponents.push("Events.initialVisibility");

Events.extend();

window.steroids.layers = new LayerCollection;

window.steroids.view = new steroids.views.WebView({
  location: window.location.href
});

window.steroids.modal = new Modal;

window.steroids.audio = new Audio;

window.steroids.navigationBar = new NavigationBar;

window.steroids.openURL = OpenURL.open;

window.steroids.device = new Device;

window.steroids.analytics = new Analytics;

window.steroids.screen = new Screen;

window.steroids.notifications = new Notifications;

window.steroids.PostMessage = PostMessage;

window.postMessage = PostMessage.postMessage;

})(window)
