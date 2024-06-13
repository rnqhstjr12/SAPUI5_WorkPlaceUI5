/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/base/util/LoaderExtensions","sap/ui/core/Manifest","sap/base/util/deepClone","sap/base/util/deepExtend","sap/base/util/each","sap/base/util/isPlainObject","sap/base/util/isEmptyObject","sap/base/util/merge","sap/base/Log","./ParameterMap","sap/ui/integration/util/CardMerger"],function(e,t,s,i,r,n,o,a,f,u,c,p){"use strict";var h="/{SECTION}/configuration/parameters",l="/{SECTION}/configuration/filters",d="/{SECTION}",g="/sap.app/dataSources",y=/\{\{(?!parameters.)(?!destinations.)(?!csrfTokens.)([^\}\}]+)\}\}|\{i18n>([^\}]+)\}/g;var b=e.extend("sap.ui.integration.util.Manifest",{constructor:function(t,r,n,o){e.call(this);this._sBaseUrl=n;this._aChanges=o;this._sSection=t;this.PARAMETERS=h.replace("{SECTION}",t);this.FILTERS=l.replace("{SECTION}",t);this.CONFIGURATION=d.replace("{SECTION}",t);if(r){var a={},f;a.process=false;this._oInitialJson=i(r,500);if(n){a.baseUrl=n}else{a.baseUrl="/";u.info("Property baseUrl is not provided and manifest URL is unknown. Relative resources may not be loaded correctly.","sap.ui.integration.widgets.Card")}this._registerManifestModulePath(r,n||"/");if(this._aChanges){f=this.mergeDeltaChanges(r)}else{f=r}this._oManifest=new s(f,a);this.oJson=this._oManifest.getRawJson()}}});b.prototype.mergeDeltaChanges=function(e){return p.mergeCardDelta(e,this._aChanges,this._sSection)};b.prototype.getJson=function(){return this._unfreeze(this.oJson)};b.prototype.getProcessableJson=function(){const e=r({},this._oManifest.getRawJson());if(e["sap.card"]?.type==="AdaptiveCard"){delete e["sap.card"].content}return this._unfreeze(e)};b.prototype.setJson=function(e){_(e);this.oJson=e};b.prototype.getInitialJson=function(){return this._oInitialJson};b.prototype.get=function(e){return this._unfreeze(O(this.oJson,e))};b.prototype.getUrl=function(){return this._oManifest.resolveUri("./","manifest")};b.prototype.getResourceBundle=function(){return this.oResourceBundle};b.prototype._unfreeze=function(e){if(typeof e==="object"){return JSON.parse(JSON.stringify(e))}return e};b.prototype.destroy=function(){this.oJson=null;this.oResourceBundle=null;if(this._oManifest){this._oManifest.destroy()}this._bIsDestroyed=true};b.prototype.isDestroyed=function(){return this._bIsDestroyed};b.prototype.load=function(e){if(!e||!e.manifestUrl){if(this._oManifest){return this.loadI18n().then(function(){this.processManifest()}.bind(this))}return new Promise(function(e){e()})}return s.load({manifestUrl:e.manifestUrl,async:true,processJson:function(t){var s=this._sBaseUrl||e.manifestUrl.replace(/\/+[^\/]*$/,"")||"/";this._registerManifestModulePath(t,s);this._oInitialJson=i(t,500);if(this._aChanges){return this.mergeDeltaChanges(t)}return t}.bind(this)}).then(function(e){this._oManifest=e;this.oJson=this._oManifest.getRawJson();return this.loadI18n().then(function(){this.processManifest()}.bind(this))}.bind(this))};b.prototype.loadDependenciesAndIncludes=function(){return this._oManifest.loadDependenciesAndIncludes(true)};b.prototype.loadI18n=function(){var e=false;s.processObject(this.getProcessableJson(),function(t,s,i){if(!e&&i.match(y)){e=true}});if(this.get("/sap.app/i18n")){e=true}if(!e){return Promise.resolve()}return this._oManifest._loadI18n(true).then(function(e){this.oResourceBundle=e}.bind(this))};b.prototype.processManifest=function(){var e=0,t=15,s=this.getProcessableJson(),i=this.get(g);M(s,this.oResourceBundle,e,t,this._oCombinedParams,i,this._oCombinedFilters);this.setJson(f(this.getJson(),s))};function _(e){if(e&&typeof e==="object"&&!Object.isFrozen(e)){Object.freeze(e);for(var t in e){if(e.hasOwnProperty(t)){_(e[t])}}}}function m(e){return typeof e==="string"&&e.match(y)&&e.indexOf("{{")===0&&e.indexOf("}}")===e.length-2}function P(e){return typeof e==="string"&&(e.indexOf("{{parameters.")>-1||e.indexOf("{{dataSources")>-1||e.indexOf("{{filters.")>-1)}b._processPlaceholder=function(e,t,s,i){var r=c.processPredefinedParameter(e),n,o;if(!a(t)){for(var f in t){n=t[f].value;o="{{parameters."+f;r=v(r,n,o)}}if(s){r=v(r,s,"{{dataSources")}if(i){r=v(r,i,"{{filters")}return r};function v(e,t,s){if(o(t)||Array.isArray(t)){for(var i in t){e=v(e,t[i],s+"."+i)}}else if(e.includes(s+"}}")){e=e.replace(new RegExp(s+"}}","g"),t)}return e}function M(e,t,s,i,r,n,o){if(s===i){return}if(Array.isArray(e)){e.forEach(function(e,a,f){if(typeof e==="object"){M(e,t,s+1,i,r,n,o)}else if(P(e)){f[a]=b._processPlaceholder(e,r,n,o)}else if(m(e)&&t){f[a]=t.getText(e.substring(2,e.length-2))}},this)}else{for(var a in e){if(typeof e[a]==="object"){M(e[a],t,s+1,i,r,n,o)}else if(P(e[a])){e[a]=b._processPlaceholder(e[a],r,n,o)}else if(m(e[a])&&t){e[a]=t.getText(e[a].substring(2,e[a].length-2))}}}}function O(e,t){if(t==="/"){return e}if(e&&t&&typeof t==="string"&&t[0]==="/"){var s=t.substring(1).split("/"),i;for(var r=0,n=s.length;r<n;r++){i=s[r];e=e.hasOwnProperty(i)?e[i]:undefined;if(e===null||typeof e!=="object"){if(r+1<n&&e!==undefined){e=undefined}break}}return e}return e&&e[t]}b.prototype.processFilters=function(e){if(!this._oManifest){return}var t=this.get(this.FILTERS),s={};if(e.size&&!t){u.error("If runtime filters are set, they have to be defined in the manifest configuration as well.");return}n(t,function(t,i){var r=e.get(t)||i.value;s[t]=r});this._oCombinedFilters=s;this.processManifest()};b.prototype.processParameters=function(e){if(!this._oManifest){return}var t=this.get(this.PARAMETERS);if(!a(e)&&!t){u.error("If parameters property is set, parameters should be described in the manifest");return}this._oCombinedParams=this._syncParameters(e,t);this.processManifest()};b.prototype.getProcessedParameters=function(e){var t=this.get(this.PARAMETERS),s=this._syncParameters(e,t);M(s,this.oResourceBundle,0,15,e);return s};b.prototype._syncParameters=function(e,t){if(a(e)){return t}var s=i(t||{},500),r=Object.getOwnPropertyNames(e),n=Object.getOwnPropertyNames(s);for(var o=0;o<n.length;o++){for(var f=0;f<r.length;f++){if(n[o]===r[f]){s[n[o]].value=e[r[f]]}}}return s};b.prototype.findDataSections=function(e){var t=[],s;if(!e){e=this.get(this.CONFIGURATION)}if(!o(e)){return[]}if(e.data){t.push(e.data)}for(s in e){if(e[s]){t=t.concat(this.findDataSections(e[s]))}}return t};b.prototype._registerManifestModulePath=function(e,s){var i=e&&e["sap.app"]&&e["sap.app"].id;if(!i){return}t.registerResourcePath(i.replace(/\./g,"/"),s)};return b});
//# sourceMappingURL=Manifest.js.map