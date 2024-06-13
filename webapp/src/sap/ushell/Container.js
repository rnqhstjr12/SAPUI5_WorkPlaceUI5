// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(
  [
    "sap/base/assert",
    "sap/base/Log",
    "sap/base/util/deepExtend",
    "sap/base/util/extend",
    "sap/base/util/uid",
    "sap/ui/base/EventProvider",
    "sap/ui/core/Control",
    "sap/ui/core/EventBus",
    "sap/ui/core/service/ServiceFactoryRegistry",
    "sap/ui/performance/Measurement",
    "sap/ui/thirdparty/jquery",
    "sap/ui/thirdparty/URI",
    "sap/ui/util/Mobile",
    "sap/ushell/bootstrap/common/common.util",
    "sap/ushell/EventHub",
    "sap/ushell/System",
    "sap/ushell/Ui5ServiceFactory",
    "sap/ushell/utils",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/renderer/ShellLayout",
    "sap/base/util/Deferred",
    "sap/base/util/ObjectPath",
  ],
  function (
    e,
    t,
    r,
    n,
    i,
    a,
    o,
    s,
    u,
    l,
    jQuery,
    c,
    f,
    d,
    p,
    h,
    g,
    v,
    m,
    y,
    w,
    S
  ) {
    "use strict";
    var C = "sap.ushell.Container";
    var P = "sap.ushell.Container.dirtyState.";
    var b = {};
    var D;
    var A;
    var L = [];
    var I;
    function E() {
      close();
    }
    function R() {
      document.location = "about:blank";
    }
    function F(e) {
      if (A && A[e]) {
        return A[e];
      }
      return "sap.ushell.adapters." + e;
    }
    function N(e) {
      var r = D.services;
      if (!r) {
        return {};
      }
      if (e === "Notifications" || e === "NotificationsV2") {
        if (r.Notifications && r.NotificationsV2) {
          t.error(
            "Notifications and NotificationsV2 services should not be configured at the same time. NotificationsV2 configuration is ignored."
          );
        }
        return r.Notifications || r.NotificationsV2 || {};
      }
      return r[e] || {};
    }
    function M(e, t, r, n, i) {
      var a = N(e).adapter || {};
      var o;
      async function s(e) {
        let n;
        try {
          [n] = await v.requireAsync([e]);
        } catch (t) {
          if (e.endsWith("PersonalizationV2Adapter")) {
            const t = e.replace(
              "PersonalizationV2Adapter",
              "PersonalizationAdapter"
            );
            return s(t);
          }
          if (e.endsWith("FlpLaunchPageAdapter")) {
            const t = e.replace("FlpLaunchPageAdapter", "LaunchPageAdapter");
            return s(t);
          }
          throw t;
        }
        var i = new n(t, r, { config: a.config || {} });
        return i;
      }
      if (i === true) {
        o = a.module;
        if (o === undefined) {
          return n ? Promise.resolve() : undefined;
        }
      } else {
        o = a.module || F(t.getPlatform()) + "." + e + "Adapter";
      }
      var u = o.replace(/\./g, "/");
      function l(e) {
        var n;
        try {
          n = sap.ui.requireSync(e);
        } catch (t) {
          if (e.endsWith("PersonalizationV2Adapter")) {
            const t = e.replace(
              "PersonalizationV2Adapter",
              "PersonalizationAdapter"
            );
            n = sap.ui.requireSync(t);
          } else {
            throw t;
          }
        }
        return new n(t, r, { config: a.config || {} });
      }
      if (!n) {
        return l(u);
      }
      return s(u);
    }
    function U() {
      var u = new a();
      var d = false;
      var g = [];
      var F = {};
      var U;
      var _ = {};
      var O;
      var k;
      var x = v.getLocalStorage();
      var V = new v.Map();
      var q = new v.Map();
      var Y;
      var G = this;
      var B;
      var z = false;
      var K = new w();
      this.init = function (e, t) {
        S.set("sap.ushell.Container", I);
        return this._init(e, t)
          .then(function (e) {
            B = e;
          })
          .then(function () {
            U =
              "sap.ushell.Container." +
              B.getSystem().getPlatform() +
              ".remoteSystem.";
            Y =
              "sap.ushell.Container." +
              B.getSystem().getPlatform() +
              ".sessionTermination";
            j();
            z = true;
            K.resolve();
            return;
          });
      };
      this.isInitialized = function () {
        return z;
      };
      this.cancelLogon = function () {
        if (this.oFrameLogonManager) {
          this.oFrameLogonManager.abortLogon();
        }
      };
      this.createRenderer = function (e, r) {
        if (typeof e === "boolean") {
          r = e;
          e = undefined;
        }
        var n = { async: !!r };
        var i;
        var a;
        l.start("FLP:Container.InitLoading", "Initial Loading", "FLP");
        v.setPerformanceMark("FLP - renderer created");
        e = e || D.defaultRenderer;
        if (!e) {
          throw new Error("Missing renderer name");
        }
        a = (D && D.renderers && D.renderers[e]) || {};
        i =
          a.module ||
          (e.indexOf(".") < 0 ? "sap.ushell.renderers." + e + ".Renderer" : e);
        if (i === "sap.ushell.renderers.fiori2.Renderer") {
          i = "sap.ushell.renderer.Renderer";
        }
        if (a.componentData && a.componentData.config) {
          n.config = a.componentData.config;
        }
        function s(t) {
          var r = sap.ui.requireSync(t);
          var i = new r({ componentData: n });
          var a;
          var s = sap.ui.requireSync("sap/ui/core/UIComponent");
          if (i instanceof s) {
            var l = sap.ui.requireSync("sap/ui/core/ComponentContainer");
            a = new l({ component: i, height: "100%", width: "100%" });
          } else {
            a = i;
          }
          if (!(a instanceof o)) {
            throw new Error("Unsupported renderer type for name " + e);
          }
          f(a);
          d(a);
          F[e] = i;
          u.fireEvent("rendererCreated", { renderer: i });
          return a;
        }
        function c(t) {
          return new Promise(function (r, i) {
            sap.ui.require(
              [
                t,
                "sap/ui/core/ComponentContainer",
                "sap/ui/core/UIComponent",
                "sap/ui/core/routing/Router",
              ],
              function (t, a, s) {
                var l = new t({ componentData: n });
                if (l instanceof s) {
                  var c = new a({
                    component: l,
                    height: "100%",
                    width: "100%",
                    async: true,
                  });
                  f(c);
                  d(c);
                  F[e] = l;
                  l.rootControlLoaded().then(function () {
                    u.fireEvent("rendererCreated", { renderer: l });
                    r(c);
                  });
                } else if (l instanceof o) {
                  f(l);
                  d(l);
                  F[e] = l;
                  u.fireEvent("rendererCreated", { renderer: l });
                  r(l);
                } else {
                  i(new Error("Unsupported renderer type!"));
                }
              }
            );
          });
        }
        function f(e) {
          e.placeAt = function (e, t) {
            var r = e;
            var n = "canvas";
            var i = document.body;
            if (e === i.id) {
              r = document.createElement("div");
              r.setAttribute("id", n);
              r.classList.add("sapUShellFullHeight");
              switch (t) {
                case "first":
                  if (i.firstChild) {
                    i.insertBefore(r, i.firstChild);
                    break;
                  }
                case "only":
                  i.innerHTML = "";
                default:
                  i.appendChild(r);
              }
              e = n;
              t = "";
            }
            y.applyLayout(e);
            p.emit("ShellLayoutApplied", Date.now());
            o.prototype.placeAt.call(this, e, t);
          };
        }
        function d(e) {
          var t = e.destroy;
          e.destroy = function () {
            if (e.isA("sap.ui.core.ComponentContainer")) {
              return Promise.resolve(e.getComponentInstance().destroy()).then(
                function () {
                  return t.apply(e, arguments);
                }
              );
            }
            return Promise.resolve(t.apply(e, arguments));
          };
        }
        var h = i.replace(/\./g, "/");
        if (r) {
          return c(h);
        }
        t.error(
          "sap.ushell.Container.createRenderer() should always be called with bAsync:true."
        );
        return s(h);
      };
      this.createRendererInternal = async function (e) {
        var t = { async: true };
        var r;
        var n;
        l.start("FLP:Container.InitLoading", "Initial Loading", "FLP");
        v.setPerformanceMark("FLP - renderer created");
        e = e || D.defaultRenderer;
        if (!e) {
          throw new Error("Missing renderer name");
        }
        n = (D.renderers && D.renderers[e]) || {};
        r =
          n.module ||
          (e.indexOf(".") < 0 ? "sap.ushell.renderers." + e + ".Renderer" : e);
        if (r === "sap.ushell.renderers.fiori2.Renderer") {
          r = "sap.ushell.renderer.Renderer";
        }
        if (n.componentData && n.componentData.config) {
          t.config = n.componentData.config;
        }
        function i(e) {
          e.placeAt = function (e, t) {
            var r = e;
            var n = "canvas";
            var i = document.body;
            if (e === i.id) {
              r = document.createElement("div");
              r.setAttribute("id", n);
              r.classList.add("sapUShellFullHeight");
              switch (t) {
                case "first":
                  if (i.firstChild) {
                    i.insertBefore(r, i.firstChild);
                    break;
                  }
                case "only":
                  i.innerHTML = "";
                default:
                  i.appendChild(r);
              }
              e = n;
              t = "";
            }
            y.applyLayout(e);
            p.emit("ShellLayoutApplied", Date.now());
            o.prototype.placeAt.call(this, e, t);
          };
        }
        function a(e) {
          var t = e.destroy;
          e.destroy = function () {
            if (e.isA("sap.ui.core.ComponentContainer")) {
              return Promise.resolve(e.getComponentInstance().destroy()).then(
                function () {
                  return t.apply(e, arguments);
                }
              );
            }
            return Promise.resolve(t.apply(e, arguments));
          };
        }
        var s = r.replace(/\./g, "/");
        const [c, f, d] = await v.requireAsync([
          s,
          "sap/ui/core/ComponentContainer",
          "sap/ui/core/UIComponent",
          "sap/ui/core/routing/Router",
        ]);
        var h = new c({ componentData: t });
        if (h instanceof d) {
          var g = new f({
            component: h,
            height: "100%",
            width: "100%",
            async: true,
          });
          i(g);
          a(g);
          F[e] = h;
          await h.rootControlLoaded();
          u.fireEvent("rendererCreated", { renderer: h });
          return g;
        } else if (h instanceof o) {
          i(h);
          a(h);
          F[e] = h;
          u.fireEvent("rendererCreated", { renderer: h });
          return h;
        }
        throw new Error("Unsupported renderer type!");
      };
      this.getRenderer = function (e) {
        var r;
        e = e || D.defaultRenderer;
        if (e) {
          r = F[e];
        } else {
          var n = Object.keys(F);
          if (n.length === 1) {
            r = F[n[0]];
          } else {
            t.warning(
              "getRenderer() - cannot determine renderer, because no default renderer is configured and multiple instances exist.",
              null,
              C
            );
          }
        }
        if (r && r.isA("sap.ui.core.ComponentContainer")) {
          return r.getComponentInstance();
        }
        return r;
      };
      this.getRendererInternal = function (e) {
        var r;
        e = e || D.defaultRenderer;
        if (e) {
          r = F[e];
        } else {
          var n = Object.keys(F);
          if (n.length === 1) {
            r = F[n[0]];
          } else {
            t.warning(
              "getRendererInternal() - cannot determine renderer, because no default renderer is configured and multiple instances exist.",
              null,
              C
            );
          }
        }
        if (r && r.isA("sap.ui.core.ComponentContainer")) {
          return r.getComponentInstance();
        }
        return r;
      };
      this.DirtyState = {
        CLEAN: "CLEAN",
        DIRTY: "DIRTY",
        MAYBE_DIRTY: "MAYBE_DIRTY",
        PENDING: "PENDING",
        INITIAL: "INITIAL",
      };
      this.getGlobalDirty = function () {
        var e = new jQuery.Deferred();
        var r = i();
        var n = 0;
        var a = this.DirtyState.CLEAN;
        function o() {
          if (n === 0 || a === G.DirtyState.DIRTY) {
            e.resolve(a);
            t.debug(
              "getGlobalDirty() Resolving: " + a,
              null,
              "sap.ushell.Container"
            );
          }
        }
        function s(e) {
          if (
            e.key.indexOf(P) === 0 &&
            e.newValue !== G.DirtyState.INITIAL &&
            e.newValue !== G.DirtyState.PENDING
          ) {
            t.debug(
              "getGlobalDirty() Receiving event key: " +
                e.key +
                " value: " +
                e.newValue,
              null,
              "sap.ushell.Container"
            );
            if (
              e.newValue === G.DirtyState.DIRTY ||
              e.newValue === G.DirtyState.MAYBE_DIRTY
            ) {
              a = e.newValue;
            }
            n -= 1;
            o();
          }
        }
        try {
          x.setItem(r, "CHECK");
          x.removeItem(r);
        } catch (r) {
          t.warning(
            "Error calling localStorage.setItem(): " + r,
            null,
            "sap.ushell.Container"
          );
          return e.resolve(this.DirtyState.MAYBE_DIRTY).promise();
        }
        if (O) {
          throw new Error("getGlobalDirty already called!");
        }
        O = e;
        window.addEventListener("storage", s);
        e.always(function () {
          window.removeEventListener("storage", s);
          O = undefined;
        });
        for (var u = x.length - 1; u >= 0; u -= 1) {
          var l = x.key(u);
          if (l.indexOf(P) === 0) {
            if (x.getItem(l) === "PENDING") {
              x.removeItem(l);
              t.debug(
                "getGlobalDirty() Cleanup of unresolved 'PENDINGS':" + l,
                null,
                "sap.ushell.Container"
              );
            } else {
              n += 1;
              v.localStorageSetItem(l, this.DirtyState.PENDING, true);
              t.debug(
                "getGlobalDirty() Requesting status for: " + l,
                null,
                "sap.ushell.Container"
              );
            }
          }
        }
        o();
        setTimeout(function () {
          if (e.state() !== "resolved") {
            e.resolve("MAYBE_DIRTY");
            t.debug(
              "getGlobalDirty() Timeout reached, - resolved 'MAYBE_DIRTY'",
              null,
              "sap.ushell.Container"
            );
          }
        }, n * 2e3);
        return e.promise();
      };
      this.getLogonSystem = function () {
        if (!B) {
          t.error(
            "getLogonSystem: Container is not yet initialized - system cannot be determined!"
          );
        }
        return B.getSystem();
      };
      this.ready = function () {
        return K.promise;
      };
      this.getUser = function () {
        return B.getUser();
      };
      this.getDirtyFlag = function () {
        var e = d;
        var t = this._oShellNavigationInternal.getNavigationContext();
        for (var r = 0; r < g.length; r++) {
          e = e || g[r](t);
        }
        return e;
      };
      this.fnAsyncDirtyStateProvider = null;
      this.getDirtyFlagsAsync = function () {
        if (!this.fnAsyncDirtyStateProvider) {
          return Promise.resolve(this.getDirtyFlag());
        }
        var e = this._oShellNavigationInternal.getNavigationContext();
        return this.fnAsyncDirtyStateProvider(e).then(
          function (e) {
            return e || this.getDirtyFlag();
          }.bind(this)
        );
      };
      this.isAsyncDirtyStateProviderSet = function () {
        return typeof this.fnAsyncDirtyStateProvider === "function";
      };
      this.setAsyncDirtyStateProvider = function (e) {
        this.fnAsyncDirtyStateProvider = e;
      };
      this.setDirtyFlag = function (e) {
        d = e;
      };
      this.sessionKeepAlive = function () {
        if (B.sessionKeepAlive) {
          B.sessionKeepAlive();
        }
      };
      this.extendSession = function () {
        p.emit("nwbcUserIsActive", Date.now());
      };
      this.registerDirtyStateProvider = function (e) {
        if (typeof e !== "function") {
          throw new Error("fnDirty must be a function");
        }
        g.push(e);
      };
      this.deregisterDirtyStateProvider = function (e) {
        if (typeof e !== "function") {
          throw new Error("fnDirty must be a function");
        }
        var t = -1;
        for (var r = g.length - 1; r >= 0; r--) {
          if (g[r] === e) {
            t = r;
            break;
          }
        }
        if (t === -1) {
          return;
        }
        g.splice(t, 1);
      };
      this.getService = function (e, t, r) {
        return G._getServiceSync.apply(G, arguments);
      };
      this.getServiceAsync = function (e, t) {
        return G._getServiceAsync(e, t);
      };
      this._getServiceSync = function (e, r, n) {
        var i = {};
        function a(t) {
          var n = new jQuery.Deferred();
          if (!t) {
            throw new Error("Missing system");
          }
          n.resolve(M(e, t, r));
          sap.ushell.Container.addRemoteSystem(t);
          return n.promise();
        }
        if (!e) {
          throw new Error("Missing service name");
        }
        if (e.indexOf(".") >= 0) {
          throw new Error("Unsupported service name");
        }
        var o = N(e);
        var s = o.module || "sap.ushell.services." + e;
        var u = s + "/" + (r || "");
        var l = { config: o.config || {} };
        function c(e, t) {
          i.createAdapter = a;
          return new e(t, i, r, l);
        }
        function f(t, n) {
          var a;
          if (V.containsKey(u)) {
            a = V.get(u);
          } else if (t.hasNoAdapter) {
            a = new t(i, r, l);
          } else {
            var o = M(e, B.getSystem(), r, n, t.useConfiguredAdapterOnly);
            if (n) {
              return o.then(function (e) {
                var r = c(t, e);
                V.put(u, r);
                return r;
              });
            }
            a = c(t, o);
          }
          V.put(u, a);
          return n ? Promise.resolve(a) : a;
        }
        if (!V.containsKey(u)) {
          if (!n) {
            t.error(
              "Deprecated API call of 'sap.ushell.Container.getService'. Please use 'getServiceAsync' instead",
              null,
              "sap.ushell.Container"
            );
            var d = sap.ui.requireSync(s.replace(/[.]/g, "/"));
            return f(d);
          }
          if (!q.containsKey(u)) {
            var p = new Promise(function (e, t) {
              sap.ui.require(
                [s.replace(/[.]/g, "/")],
                function (t) {
                  e(f(t, true));
                },
                t
              );
            });
            q.put(u, p);
            return p;
          }
          return q.get(u);
        }
        if (n) {
          return Promise.resolve(V.get(u));
        }
        return V.get(u);
      };
      this._getServiceAsync = function (e, t) {
        var r = {};
        function n(r) {
          var n = new jQuery.Deferred();
          if (!r) {
            throw new Error("Missing system");
          }
          n.resolve(M(e, r, t));
          sap.ushell.Container.addRemoteSystem(r);
          return n.promise();
        }
        if (!e) {
          throw new Error("Missing service name");
        }
        if (e.indexOf(".") >= 0) {
          throw new Error("Unsupported service name");
        }
        var i = N(e);
        var a = i.module || "sap.ushell.services." + e;
        var o = a + "/" + (t || "");
        var s = { config: i.config || {} };
        function u(e, i) {
          r.createAdapter = n;
          return new e(i, r, t, s);
        }
        function l(n) {
          var i;
          if (V.containsKey(o)) {
            i = V.get(o);
          } else if (n.hasNoAdapter) {
            i = new n(r, t, s);
          } else {
            var a = M(e, B.getSystem(), t, true, n.useConfiguredAdapterOnly);
            return a.then(function (e) {
              var t = u(n, e);
              V.put(o, t);
              return t;
            });
          }
          V.put(o, i);
          return Promise.resolve(i);
        }
        if (!V.containsKey(o)) {
          if (!q.containsKey(o)) {
            var c = new Promise(function (e, t) {
              sap.ui.require(
                [a.replace(/[.]/g, "/")],
                function (t) {
                  e(l(t));
                },
                t
              );
            });
            q.put(o, c);
            return c;
          }
          return q.get(o);
        }
        return Promise.resolve(V.get(o));
      };
      function H() {
        for (var e = x.length - 1; e >= 0; e -= 1) {
          var t = x.key(e);
          if (t.indexOf(U) === 0) {
            try {
              var r = t.substring(U.length);
              var n = JSON.parse(x.getItem(t));
              _[r] = new h(n);
            } catch (e) {
              x.removeItem(t);
            }
          }
        }
        return _;
      }
      function W() {
        if (typeof OData === "undefined") {
          return;
        }
        function e(e, r, n) {
          t.warning(e, null, "sap.ushell.Container");
          if (n) {
            setTimeout(n.bind(null, e), 5e3);
          }
          return {
            abort: function () {
              return;
            },
          };
        }
        OData.read = function (t, r, n) {
          return e(
            "OData.read('" +
              (t && t.Uri ? t.requestUri : t) +
              "') disabled during logout processing",
            r,
            n
          );
        };
        OData.request = function (t, r, n) {
          return e(
            "OData.request('" +
              (t ? t.requestUri : "") +
              "') disabled during logout processing",
            r,
            n
          );
        };
      }
      this.addRemoteSystem = function (e) {
        var r = e.getAlias();
        var n = _[r];
        if (this._isLocalSystem(e)) {
          return;
        }
        if (n) {
          if (n.toString() === e.toString()) {
            return;
          }
          t.warning(
            "Replacing " + n + " by " + e,
            null,
            "sap.ushell.Container"
          );
        } else {
          t.debug("Added " + e, null, "sap.ushell.Container");
        }
        _[r] = e;
        v.localStorageSetItem(U + r, e);
      };
      this._isLocalSystem = function (e) {
        var t = e.getAlias();
        if (t && t.toUpperCase() === "LOCAL") {
          return true;
        }
        var r = new c(v.getLocationHref());
        var n = this.getLogonSystem().getClient() || "";
        if (e.getBaseUrl() === r.origin() && e.getClient() === n) {
          return true;
        }
        return false;
      };
      this.addRemoteSystemForServiceUrl = function (e) {
        var t = { baseUrl: ";o=" };
        if (!e || e.charAt(0) !== "/" || e.indexOf("//") === 0) {
          return;
        }
        var r = /^[^?]*;o=([^/;?]*)/.exec(e);
        if (r && r.length >= 2) {
          t.alias = r[1];
        }
        e = e.replace(/;[^/?]*/g, "");
        if (/^\/sap\/(bi|hana|hba)\//.test(e)) {
          t.platform = "hana";
          t.alias = t.alias || "hana";
        } else if (/^\/sap\/opu\//.test(e)) {
          t.platform = "abap";
        }
        if (t.alias && t.platform) {
          this.addRemoteSystem(new h(t));
        }
      };
      this.attachLogoutEvent = function (t, r) {
        var n = false;
        if (r === true) {
          e(
            typeof t === "function",
            "Container.attachLogoutEvent: fnFunction must be a function"
          );
          for (var i = 0; i < L.length; i++) {
            if (L[i] === t) {
              n = true;
              break;
            }
          }
          if (!n) {
            L.push(t);
          }
        } else {
          u.attachEvent("Logout", t);
        }
      };
      this.detachLogoutEvent = function (e) {
        u.detachEvent("Logout", e);
        for (var t = 0; t < L.length; t++) {
          if (L[t] === e) {
            L.splice(t, 1);
            break;
          }
        }
      };
      this.attachRendererCreatedEvent = function (e) {
        u.attachEvent("rendererCreated", e);
      };
      this.detachRendererCreatedEvent = function (e) {
        u.detachEvent("rendererCreated", e);
      };
      this.defaultLogout = function () {
        var e = new jQuery.Deferred();
        function r() {
          B.logout(true).always(function () {
            x.removeItem(Y);
            e.resolve();
          });
        }
        function n() {
          var e = new jQuery.Deferred();
          var t = e.promise();
          var n = [];
          if (L.length > 0) {
            for (var i = 0; i < L.length; i++) {
              n.push(L[i]());
            }
            Promise.all(n).then(e.resolve);
            setTimeout(e.resolve, 4e3);
          } else {
            e.resolve();
          }
          t.done(function () {
            if (u.fireEvent("Logout", true)) {
              r();
            } else {
              setTimeout(r, 1e3);
            }
          });
        }
        function i() {
          var e = [];
          if (k) {
            window.removeEventListener("storage", k);
          }
          v.localStorageSetItem(Y, "pending");
          G._suppressOData();
          var r = G._getRemoteSystems();
          Object.keys(r).forEach(function (n) {
            try {
              e.push(M("Container", r[n]).logout(false));
            } catch (e) {
              t.warning(
                "Could not create adapter for " + n,
                e.toString(),
                "sap.ushell.Container"
              );
            }
            x.removeItem(U + n);
          });
          jQuery.when.apply(jQuery, e).done(n);
        }
        if (typeof B.addFurtherRemoteSystems === "function") {
          B.addFurtherRemoteSystems().always(i);
        } else {
          i();
        }
        return e.promise();
      };
      this.logout = this.defaultLogout;
      this.registerLogout = function (e) {
        this.logout = e;
      };
      this.setLogonFrameProvider = function (e) {
        if (this.oFrameLogonManager) {
          this.oFrameLogonManager.logonFrameProvider = e;
        }
      };
      this.setXhrLogonTimeout = function (e, t) {
        if (this.oFrameLogonManager) {
          this.oFrameLogonManager.setTimeout(e, t);
        }
      };
      this.getFLPConfig = function () {
        var e = new Promise(
          function (e, t) {
            var r = { URL: this.getFLPUrl() };
            if (b.CDMPromise) {
              b.CDMPromise.then(function (t) {
                t.getSiteWithoutPersonalization().then(function (t) {
                  r.scopeId = t.site.identification.id;
                  e(r);
                });
              });
            } else {
              e(r);
            }
          }.bind(this)
        );
        return e;
      };
      this.getFLPUrl = function (e) {
        var t = v.getLocationHref();
        var r = t.indexOf(m.getShellHash(t));
        if (r === -1 || e === true) {
          return t;
        }
        return t.substr(0, r - 1);
      };
      this.getFLPUrlAsync = function (e) {
        return new jQuery.Deferred().resolve(G.getFLPUrl(e)).promise();
      };
      this.inAppRuntime = function () {
        return false;
      };
      this.runningInIframe = this.inAppRuntime;
      this._getAdapter = function () {
        return B;
      };
      this.getFLPPlatform = function (e) {
        if (e === true) {
          return D.flpPlatform;
        }
        return Promise.resolve(D.flpPlatform);
      };
      this._closeWindow = E;
      this._redirectWindow = R;
      this._getRemoteSystems = H;
      this._suppressOData = W;
      s.getInstance().subscribe(
        "sap.ushell.Container",
        "addRemoteSystemForServiceUrl",
        function (e, t, r) {
          G.addRemoteSystemForServiceUrl(r);
        }
      );
      this._init = function (e, i) {
        var a = new Promise(
          function (a) {
            f.init();
            D = n({}, window["sap-ushell-config"]);
            A = i;
            if (typeof window["sap.ushell.bootstrap.callback"] === "function") {
              setTimeout(window["sap.ushell.bootstrap.callback"]);
            }
            T(
              ["Personalization", "URLParsing", "CrossApplicationNavigation"],
              true
            );
            T(["Configuration"], false);
            var o = new h({ alias: "", platform: D.platform || e });
            M("Container", o, null, true)
              .then(function (e) {
                B = e;
                return B.load();
              })
              .then(
                function () {
                  function e() {
                    var e = window["sap-ushell-config"];
                    if (!e || !e.services) {
                      return false;
                    }
                    var t = e.services.PluginManager;
                    var r = t && t.config;
                    return r && r.loadPluginsFromSite;
                  }
                  var r = [this.getServiceAsync("PluginManager")];
                  if (e()) {
                    b.CDMPromise = this.getServiceAsync("CommonDataModel");
                    r.push(b.CDMPromise);
                  }
                  Promise.all(r)
                    .then(function (e) {
                      s(e);
                    })
                    .then(u);
                  var n = [];
                  if (
                    D.preloadServices !== undefined &&
                    Array.isArray(D.preloadServices)
                  ) {
                    D.preloadServices.forEach(
                      function (e) {
                        n.push(this.getServiceAsync(e));
                      }.bind(this)
                    );
                    t.error(
                      "Ushell Config's preloadServices should not be used!"
                    );
                  }
                  var i = this.getServiceAsync("ShellNavigationInternal").then(
                    function (e) {
                      this._oShellNavigationInternal = e;
                    }.bind(this)
                  );
                  n.push(i);
                  Promise.all(n).then(function () {
                    a(B);
                  });
                }.bind(this)
              );
            function s(e) {
              var t = e[0];
              var n = e[1];
              var i = n ? n.getPlugins() : jQuery.when({});
              i.then(function (e) {
                var n = r({}, D.bootstrapPlugins, e);
                t.registerPlugins(n);
              });
            }
            function u() {
              l();
              sap.ui.require(["sap/ushell/Config"], function (e) {
                c(e);
                d(e);
              });
            }
            function l() {
              if (v.hasFLPReady2NotificationCapability()) {
                sap.ui.require(["sap/ushell/NWBCInterface"], function (e) {
                  v.getPrivateEpcm().doEventFlpReady2(e);
                });
              } else if (v.hasFLPReadyNotificationCapability()) {
                v.getPrivateEpcm().doEventFlpReady();
              }
            }
            function c(e) {
              if (e.last("/core/darkMode/enabled")) {
                sap.ushell.Container.getServiceAsync("DarkModeSupport").then(
                  function (e) {
                    if (e && e.setup) {
                      e.setup();
                    }
                  }
                );
              }
            }
            function d(e) {
              var t = !!new URLSearchParams(window.location.search).get(
                "sap-ui-xx-ushell-UITraceEnabled"
              );
              if (e.last("/core/uiTracer/enabled") || t) {
                sap.ushell.Container.getServiceAsync("UITracer");
              }
            }
          }.bind(this)
        );
        return a;
      };
      function j() {
        if (typeof B.logoutRedirect === "function") {
          k = function (e) {
            function t() {
              G._closeWindow();
              G._redirectWindow();
            }
            if (sap.ushell.Container !== G) {
              return;
            }
            if (
              e.key.indexOf(U) === 0 &&
              e.newValue &&
              e.newValue !== x.getItem(e.key)
            ) {
              v.localStorageSetItem(e.key, e.newValue);
            }
            if (e.key === Y) {
              if (e.newValue === "pending") {
                G._suppressOData();
                if (u.fireEvent("Logout", true)) {
                  t();
                } else {
                  setTimeout(t, 1e3);
                }
              }
            }
          };
          window.addEventListener("storage", k);
        }
      }
      this._getFunctionsForUnitTest = function () {
        return { createAdapter: M };
      };
      this.resetServices = function () {
        V = new v.Map();
        q = new v.Map();
      };
      this.reset = function () {
        this.resetServices();
        x = v.getLocalStorage();
        d = false;
        g = [];
        F = {};
        this.fnAsyncDirtyStateProvider = undefined;
        z = false;
        K = new w();
      };
    }
    function T(e, t) {
      e.forEach(function (e) {
        var r = g.createServiceFactory(e, t);
        u.register("sap.ushell.ui5service." + e, r);
      });
    }
    I = new U();
    sap.ushell.bootstrap = function (e, r) {
      if (!window["sap-ushell-config-migration"]) {
        if (e === "local") {
          t.error(
            "Deprecated usage of the 'local' platform! Please replace it with the 'sandbox' scenario.",
            null,
            "sap.ushell.bootstrap"
          );
        } else {
          t.error(
            `Deprecated API call of sap.ushell.bootstrap. Please adapt the platform '${e}' accordingly.`,
            null,
            "sap.ushell.bootstrap"
          );
        }
        d.migrateV2ServiceConfig(window["sap-ushell-config"]);
      }
      var n = new jQuery.Deferred();
      I.init(e, r).then(function () {
        n.resolve();
      });
      return n.promise();
    };
    return I;
  }
);
//# sourceMappingURL=Container.js.map
