var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/.pnpm/@capacitor+core@5.6.0/node_modules/@capacitor/core/dist/index.js
var createCapacitorPlatforms, initPlatforms, CapacitorPlatforms, addPlatform, setPlatform, ExceptionCode, CapacitorException, getPlatformId, createCapacitor, initCapacitorGlobal, Capacitor, registerPlugin, Plugins, WebPlugin, encode, decode, CapacitorCookiesPluginWeb, CapacitorCookies, readBlobAsBase64, normalizeHttpHeaders, buildUrlParams, buildRequestInit, CapacitorHttpPluginWeb, CapacitorHttp;
var init_dist = __esm({
  "node_modules/.pnpm/@capacitor+core@5.6.0/node_modules/@capacitor/core/dist/index.js"() {
    createCapacitorPlatforms = (win) => {
      const defaultPlatformMap = /* @__PURE__ */ new Map();
      defaultPlatformMap.set("web", { name: "web" });
      const capPlatforms = win.CapacitorPlatforms || {
        currentPlatform: { name: "web" },
        platforms: defaultPlatformMap
      };
      const addPlatform2 = (name, platform) => {
        capPlatforms.platforms.set(name, platform);
      };
      const setPlatform2 = (name) => {
        if (capPlatforms.platforms.has(name)) {
          capPlatforms.currentPlatform = capPlatforms.platforms.get(name);
        }
      };
      capPlatforms.addPlatform = addPlatform2;
      capPlatforms.setPlatform = setPlatform2;
      return capPlatforms;
    };
    initPlatforms = (win) => win.CapacitorPlatforms = createCapacitorPlatforms(win);
    CapacitorPlatforms = /* @__PURE__ */ initPlatforms(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    addPlatform = CapacitorPlatforms.addPlatform;
    setPlatform = CapacitorPlatforms.setPlatform;
    (function(ExceptionCode2) {
      ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
      ExceptionCode2["Unavailable"] = "UNAVAILABLE";
    })(ExceptionCode || (ExceptionCode = {}));
    CapacitorException = class extends Error {
      constructor(message, code, data) {
        super(message);
        this.message = message;
        this.code = code;
        this.data = data;
      }
    };
    getPlatformId = (win) => {
      var _a, _b;
      if (win === null || win === void 0 ? void 0 : win.androidBridge) {
        return "android";
      } else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
        return "ios";
      } else {
        return "web";
      }
    };
    createCapacitor = (win) => {
      var _a, _b, _c, _d, _e;
      const capCustomPlatform = win.CapacitorCustomPlatform || null;
      const cap = win.Capacitor || {};
      const Plugins2 = cap.Plugins = cap.Plugins || {};
      const capPlatforms = win.CapacitorPlatforms;
      const defaultGetPlatform = () => {
        return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
      };
      const getPlatform = ((_a = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _a === void 0 ? void 0 : _a.getPlatform) || defaultGetPlatform;
      const defaultIsNativePlatform = () => getPlatform() !== "web";
      const isNativePlatform = ((_b = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _b === void 0 ? void 0 : _b.isNativePlatform) || defaultIsNativePlatform;
      const defaultIsPluginAvailable = (pluginName) => {
        const plugin = registeredPlugins.get(pluginName);
        if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
          return true;
        }
        if (getPluginHeader(pluginName)) {
          return true;
        }
        return false;
      };
      const isPluginAvailable = ((_c = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _c === void 0 ? void 0 : _c.isPluginAvailable) || defaultIsPluginAvailable;
      const defaultGetPluginHeader = (pluginName) => {
        var _a2;
        return (_a2 = cap.PluginHeaders) === null || _a2 === void 0 ? void 0 : _a2.find((h) => h.name === pluginName);
      };
      const getPluginHeader = ((_d = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _d === void 0 ? void 0 : _d.getPluginHeader) || defaultGetPluginHeader;
      const handleError = (err) => win.console.error(err);
      const pluginMethodNoop = (_target, prop, pluginName) => {
        return Promise.reject(`${pluginName} does not have an implementation of "${prop}".`);
      };
      const registeredPlugins = /* @__PURE__ */ new Map();
      const defaultRegisterPlugin = (pluginName, jsImplementations = {}) => {
        const registeredPlugin = registeredPlugins.get(pluginName);
        if (registeredPlugin) {
          console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
          return registeredPlugin.proxy;
        }
        const platform = getPlatform();
        const pluginHeader = getPluginHeader(pluginName);
        let jsImplementation;
        const loadPluginImplementation = async () => {
          if (!jsImplementation && platform in jsImplementations) {
            jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
          } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
            jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
          }
          return jsImplementation;
        };
        const createPluginMethod = (impl, prop) => {
          var _a2, _b2;
          if (pluginHeader) {
            const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
            if (methodHeader) {
              if (methodHeader.rtype === "promise") {
                return (options) => cap.nativePromise(pluginName, prop.toString(), options);
              } else {
                return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
              }
            } else if (impl) {
              return (_a2 = impl[prop]) === null || _a2 === void 0 ? void 0 : _a2.bind(impl);
            }
          } else if (impl) {
            return (_b2 = impl[prop]) === null || _b2 === void 0 ? void 0 : _b2.bind(impl);
          } else {
            throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
          }
        };
        const createPluginMethodWrapper = (prop) => {
          let remove;
          const wrapper = (...args) => {
            const p = loadPluginImplementation().then((impl) => {
              const fn = createPluginMethod(impl, prop);
              if (fn) {
                const p2 = fn(...args);
                remove = p2 === null || p2 === void 0 ? void 0 : p2.remove;
                return p2;
              } else {
                throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
              }
            });
            if (prop === "addListener") {
              p.remove = async () => remove();
            }
            return p;
          };
          wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
          Object.defineProperty(wrapper, "name", {
            value: prop,
            writable: false,
            configurable: false
          });
          return wrapper;
        };
        const addListener = createPluginMethodWrapper("addListener");
        const removeListener = createPluginMethodWrapper("removeListener");
        const addListenerNative = (eventName, callback) => {
          const call = addListener({ eventName }, callback);
          const remove = async () => {
            const callbackId = await call;
            removeListener({
              eventName,
              callbackId
            }, callback);
          };
          const p = new Promise((resolve) => call.then(() => resolve({ remove })));
          p.remove = async () => {
            console.warn(`Using addListener() without 'await' is deprecated.`);
            await remove();
          };
          return p;
        };
        const proxy = new Proxy({}, {
          get(_, prop) {
            switch (prop) {
              case "$$typeof":
                return void 0;
              case "toJSON":
                return () => ({});
              case "addListener":
                return pluginHeader ? addListenerNative : addListener;
              case "removeListener":
                return removeListener;
              default:
                return createPluginMethodWrapper(prop);
            }
          }
        });
        Plugins2[pluginName] = proxy;
        registeredPlugins.set(pluginName, {
          name: pluginName,
          proxy,
          platforms: /* @__PURE__ */ new Set([
            ...Object.keys(jsImplementations),
            ...pluginHeader ? [platform] : []
          ])
        });
        return proxy;
      };
      const registerPlugin2 = ((_e = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _e === void 0 ? void 0 : _e.registerPlugin) || defaultRegisterPlugin;
      if (!cap.convertFileSrc) {
        cap.convertFileSrc = (filePath) => filePath;
      }
      cap.getPlatform = getPlatform;
      cap.handleError = handleError;
      cap.isNativePlatform = isNativePlatform;
      cap.isPluginAvailable = isPluginAvailable;
      cap.pluginMethodNoop = pluginMethodNoop;
      cap.registerPlugin = registerPlugin2;
      cap.Exception = CapacitorException;
      cap.DEBUG = !!cap.DEBUG;
      cap.isLoggingEnabled = !!cap.isLoggingEnabled;
      cap.platform = cap.getPlatform();
      cap.isNative = cap.isNativePlatform();
      return cap;
    };
    initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
    Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    registerPlugin = Capacitor.registerPlugin;
    Plugins = Capacitor.Plugins;
    WebPlugin = class {
      constructor(config) {
        this.listeners = {};
        this.windowListeners = {};
        if (config) {
          console.warn(`Capacitor WebPlugin "${config.name}" config object was deprecated in v3 and will be removed in v4.`);
          this.config = config;
        }
      }
      addListener(eventName, listenerFunc) {
        const listeners = this.listeners[eventName];
        if (!listeners) {
          this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(listenerFunc);
        const windowListener = this.windowListeners[eventName];
        if (windowListener && !windowListener.registered) {
          this.addWindowListener(windowListener);
        }
        const remove = async () => this.removeListener(eventName, listenerFunc);
        const p = Promise.resolve({ remove });
        Object.defineProperty(p, "remove", {
          value: async () => {
            console.warn(`Using addListener() without 'await' is deprecated.`);
            await remove();
          }
        });
        return p;
      }
      async removeAllListeners() {
        this.listeners = {};
        for (const listener in this.windowListeners) {
          this.removeWindowListener(this.windowListeners[listener]);
        }
        this.windowListeners = {};
      }
      notifyListeners(eventName, data) {
        const listeners = this.listeners[eventName];
        if (listeners) {
          listeners.forEach((listener) => listener(data));
        }
      }
      hasListeners(eventName) {
        return !!this.listeners[eventName].length;
      }
      registerWindowListener(windowEventName, pluginEventName) {
        this.windowListeners[pluginEventName] = {
          registered: false,
          windowEventName,
          pluginEventName,
          handler: (event) => {
            this.notifyListeners(pluginEventName, event);
          }
        };
      }
      unimplemented(msg = "not implemented") {
        return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
      }
      unavailable(msg = "not available") {
        return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
      }
      async removeListener(eventName, listenerFunc) {
        const listeners = this.listeners[eventName];
        if (!listeners) {
          return;
        }
        const index = listeners.indexOf(listenerFunc);
        this.listeners[eventName].splice(index, 1);
        if (!this.listeners[eventName].length) {
          this.removeWindowListener(this.windowListeners[eventName]);
        }
      }
      addWindowListener(handle) {
        window.addEventListener(handle.windowEventName, handle.handler);
        handle.registered = true;
      }
      removeWindowListener(handle) {
        if (!handle) {
          return;
        }
        window.removeEventListener(handle.windowEventName, handle.handler);
        handle.registered = false;
      }
    };
    encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
    decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    CapacitorCookiesPluginWeb = class extends WebPlugin {
      async getCookies() {
        const cookies = document.cookie;
        const cookieMap = {};
        cookies.split(";").forEach((cookie) => {
          if (cookie.length <= 0)
            return;
          let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
          key = decode(key).trim();
          value = decode(value).trim();
          cookieMap[key] = value;
        });
        return cookieMap;
      }
      async setCookie(options) {
        try {
          const encodedKey = encode(options.key);
          const encodedValue = encode(options.value);
          const expires = `; expires=${(options.expires || "").replace("expires=", "")}`;
          const path = (options.path || "/").replace("path=", "");
          const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
          document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
        } catch (error) {
          return Promise.reject(error);
        }
      }
      async deleteCookie(options) {
        try {
          document.cookie = `${options.key}=; Max-Age=0`;
        } catch (error) {
          return Promise.reject(error);
        }
      }
      async clearCookies() {
        try {
          const cookies = document.cookie.split(";") || [];
          for (const cookie of cookies) {
            document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
          }
        } catch (error) {
          return Promise.reject(error);
        }
      }
      async clearAllCookies() {
        try {
          await this.clearCookies();
        } catch (error) {
          return Promise.reject(error);
        }
      }
    };
    CapacitorCookies = registerPlugin("CapacitorCookies", {
      web: () => new CapacitorCookiesPluginWeb()
    });
    readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
    normalizeHttpHeaders = (headers = {}) => {
      const originalKeys = Object.keys(headers);
      const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
      const normalized = loweredKeys.reduce((acc, key, index) => {
        acc[key] = headers[originalKeys[index]];
        return acc;
      }, {});
      return normalized;
    };
    buildUrlParams = (params, shouldEncode = true) => {
      if (!params)
        return null;
      const output = Object.entries(params).reduce((accumulator, entry) => {
        const [key, value] = entry;
        let encodedValue;
        let item;
        if (Array.isArray(value)) {
          item = "";
          value.forEach((str) => {
            encodedValue = shouldEncode ? encodeURIComponent(str) : str;
            item += `${key}=${encodedValue}&`;
          });
          item.slice(0, -1);
        } else {
          encodedValue = shouldEncode ? encodeURIComponent(value) : value;
          item = `${key}=${encodedValue}`;
        }
        return `${accumulator}&${item}`;
      }, "");
      return output.substr(1);
    };
    buildRequestInit = (options, extra = {}) => {
      const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
      const headers = normalizeHttpHeaders(options.headers);
      const type = headers["content-type"] || "";
      if (typeof options.data === "string") {
        output.body = options.data;
      } else if (type.includes("application/x-www-form-urlencoded")) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(options.data || {})) {
          params.set(key, value);
        }
        output.body = params.toString();
      } else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
        const form = new FormData();
        if (options.data instanceof FormData) {
          options.data.forEach((value, key) => {
            form.append(key, value);
          });
        } else {
          for (const key of Object.keys(options.data)) {
            form.append(key, options.data[key]);
          }
        }
        output.body = form;
        const headers2 = new Headers(output.headers);
        headers2.delete("content-type");
        output.headers = headers2;
      } else if (type.includes("application/json") || typeof options.data === "object") {
        output.body = JSON.stringify(options.data);
      }
      return output;
    };
    CapacitorHttpPluginWeb = class extends WebPlugin {
      /**
       * Perform an Http request given a set of options
       * @param options Options to build the HTTP request
       */
      async request(options) {
        const requestInit = buildRequestInit(options, options.webFetchExtra);
        const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
        const url = urlParams ? `${options.url}?${urlParams}` : options.url;
        const response = await fetch(url, requestInit);
        const contentType = response.headers.get("content-type") || "";
        let { responseType = "text" } = response.ok ? options : {};
        if (contentType.includes("application/json")) {
          responseType = "json";
        }
        let data;
        let blob;
        switch (responseType) {
          case "arraybuffer":
          case "blob":
            blob = await response.blob();
            data = await readBlobAsBase64(blob);
            break;
          case "json":
            data = await response.json();
            break;
          case "document":
          case "text":
          default:
            data = await response.text();
        }
        const headers = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        return {
          data,
          headers,
          status: response.status,
          url: response.url
        };
      }
      /**
       * Perform an Http GET request given a set of options
       * @param options Options to build the HTTP request
       */
      async get(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
      }
      /**
       * Perform an Http POST request given a set of options
       * @param options Options to build the HTTP request
       */
      async post(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
      }
      /**
       * Perform an Http PUT request given a set of options
       * @param options Options to build the HTTP request
       */
      async put(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
      }
      /**
       * Perform an Http PATCH request given a set of options
       * @param options Options to build the HTTP request
       */
      async patch(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
      }
      /**
       * Perform an Http DELETE request given a set of options
       * @param options Options to build the HTTP request
       */
      async delete(options) {
        return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
      }
    };
    CapacitorHttp = registerPlugin("CapacitorHttp", {
      web: () => new CapacitorHttpPluginWeb()
    });
  }
});

// node_modules/.pnpm/@codetrix-studio+capacitor-google-auth@3.3.6_@capacitor+core@5.6.0/node_modules/@codetrix-studio/capacitor-google-auth/dist/esm/web.js
var web_exports = {};
__export(web_exports, {
  GoogleAuthWeb: () => GoogleAuthWeb
});
var GoogleAuthWeb;
var init_web = __esm({
  "node_modules/.pnpm/@codetrix-studio+capacitor-google-auth@3.3.6_@capacitor+core@5.6.0/node_modules/@codetrix-studio/capacitor-google-auth/dist/esm/web.js"() {
    init_dist();
    GoogleAuthWeb = class extends WebPlugin {
      constructor() {
        super();
      }
      loadScript() {
        if (typeof document === "undefined") {
          return;
        }
        const scriptId = "gapi";
        const scriptEl = document === null || document === void 0 ? void 0 : document.getElementById(scriptId);
        if (scriptEl) {
          return;
        }
        const head = document.getElementsByTagName("head")[0];
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.defer = true;
        script.async = true;
        script.id = scriptId;
        script.onload = this.platformJsLoaded.bind(this);
        script.src = "https://apis.google.com/js/platform.js";
        head.appendChild(script);
      }
      initialize(_options = {
        clientId: "",
        scopes: [],
        grantOfflineAccess: false
      }) {
        var _a, _b;
        if (typeof window === "undefined") {
          return;
        }
        const metaClientId = (_a = document.getElementsByName("google-signin-client_id")[0]) === null || _a === void 0 ? void 0 : _a.content;
        const clientId = _options.clientId || metaClientId || "";
        if (!clientId) {
          console.warn("GoogleAuthPlugin - clientId is empty");
        }
        this.options = {
          clientId,
          grantOfflineAccess: (_b = _options.grantOfflineAccess) !== null && _b !== void 0 ? _b : false,
          scopes: _options.scopes || []
        };
        this.gapiLoaded = new Promise((resolve) => {
          window.gapiResolve = resolve;
          this.loadScript();
        });
        this.addUserChangeListener();
      }
      platformJsLoaded() {
        gapi.load("auth2", () => {
          const clientConfig = {
            client_id: this.options.clientId,
            plugin_name: "CodetrixStudioCapacitorGoogleAuth"
          };
          if (this.options.scopes.length) {
            clientConfig.scope = this.options.scopes.join(" ");
          }
          gapi.auth2.init(clientConfig);
          window.gapiResolve();
        });
      }
      async signIn() {
        return new Promise(async (resolve, reject) => {
          var _a;
          try {
            let serverAuthCode;
            const needsOfflineAccess = (_a = this.options.grantOfflineAccess) !== null && _a !== void 0 ? _a : false;
            if (needsOfflineAccess) {
              const offlineAccessResponse = await gapi.auth2.getAuthInstance().grantOfflineAccess();
              serverAuthCode = offlineAccessResponse.code;
            } else {
              await gapi.auth2.getAuthInstance().signIn();
            }
            const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
            if (needsOfflineAccess) {
              await googleUser.reloadAuthResponse();
            }
            const user = this.getUserFrom(googleUser);
            user.serverAuthCode = serverAuthCode;
            resolve(user);
          } catch (error) {
            reject(error);
          }
        });
      }
      async refresh() {
        const authResponse = await gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
        return {
          accessToken: authResponse.access_token,
          idToken: authResponse.id_token,
          refreshToken: ""
        };
      }
      async signOut() {
        return gapi.auth2.getAuthInstance().signOut();
      }
      async addUserChangeListener() {
        await this.gapiLoaded;
        gapi.auth2.getAuthInstance().currentUser.listen((googleUser) => {
          this.notifyListeners("userChange", googleUser.isSignedIn() ? this.getUserFrom(googleUser) : null);
        });
      }
      getUserFrom(googleUser) {
        const user = {};
        const profile = googleUser.getBasicProfile();
        user.email = profile.getEmail();
        user.familyName = profile.getFamilyName();
        user.givenName = profile.getGivenName();
        user.id = profile.getId();
        user.imageUrl = profile.getImageUrl();
        user.name = profile.getName();
        const authResponse = googleUser.getAuthResponse(true);
        user.authentication = {
          accessToken: authResponse.access_token,
          idToken: authResponse.id_token,
          refreshToken: ""
        };
        return user;
      }
    };
  }
});

// app/index.ts
init_dist();

// node_modules/.pnpm/@codetrix-studio+capacitor-google-auth@3.3.6_@capacitor+core@5.6.0/node_modules/@codetrix-studio/capacitor-google-auth/dist/esm/index.js
init_dist();
var GoogleAuth = registerPlugin("GoogleAuth", {
  web: () => Promise.resolve().then(() => (init_web(), web_exports)).then((m) => new m.GoogleAuthWeb())
});

// app/index.ts
var PROD_URL = "https://bagel03.github.io/drivegame2024/builds/prod";
var LOCAL_URL = "http://localhost:5500/dist";
var DIST_URL = localStorage.getItem("dev-env") ? LOCAL_URL : PROD_URL;
window.DIST_URL = DIST_URL;
GoogleAuth.initialize({
  clientId: "41009933978-vrdr3g1i3mhjh6u7vip1sce01o8rnijf.apps.googleusercontent.com",
  grantOfflineAccess: true,
  scopes: ["profile", "email"]
});
var BUNDLE_URL = DIST_URL + "/index.js";
var CSS_URL = DIST_URL + "/index.css";
document.body.innerHTML = `
    <div id="preloadScreen" style="z-index: 999; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; background-image: radial-gradient(#44403C, #171717)">
        <img src="./logo.png" />
            <h1 style="font-size: 24px; color: white" id="downloadText">Downloading Content...</h1>
    </div>
`;
if (Capacitor.isNativePlatform() || true) {
  window.google = {
    accounts: {
      //@ts-expect-error
      id: {
        renderButton(parent) {
          const container = document.createElement("div");
          const className = {
            container: "text-white text-xl bg-[#1a73e8] hover:bg-[#5194EE] cursor-pointer h-10 w-72 rounded-[4px] transition-colors duration-100 flex ",
            span: "text-white text-center grow flex justify-center items-center",
            icon: "fa-brands fa-google text-white self-end mr-2 flex justify-center items-center h-full"
          };
          container.className = className.container;
          const span = document.createElement("span");
          span.textContent = "Sign in with Google";
          span.className = className.span;
          container.append(span);
          const icon = document.createElement("i");
          icon.className = className.icon;
          container.appendChild(icon);
          container.onclick = async () => {
            const user = await GoogleAuth.signIn();
            const jwt = user.authentication.idToken;
            console.log(jwt);
            window.google.accounts.id.callback?.({ credential: jwt });
          };
          parent.appendChild(container);
        },
        initialize({ client_id, callback }) {
          GoogleAuth.initialize({
            clientId: client_id,
            scopes: ["profile", "email"],
            grantOfflineAccess: true
          });
          window.google.accounts.id.callback = callback;
        }
      }
    }
  };
} else {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  document.head.append(script);
}
var downloadText = document.querySelector("#downloadText");
var intervalId = setInterval(() => {
  const numPeriods = (downloadText.textContent.match(/\./g) || {}).length || 0;
  downloadText.textContent = downloadText.textContent.replace(/\./g, "") + ".".repeat(numPeriods % 3 + 1);
}, 1e3 / 3);
var link = document.createElement("link");
link.rel = "stylesheet";
link.href = CSS_URL;
document.head.appendChild(link);
link.onload = () => {
  const script = document.createElement("script");
  script.src = BUNDLE_URL;
  document.body.appendChild(script);
  script.onload = () => clearInterval(intervalId);
};
/*! Bundled license information:

@capacitor/core/dist/index.js:
  (*! Capacitor: https://capacitorjs.com/ - MIT License *)
*/
//# sourceMappingURL=index.js.map
