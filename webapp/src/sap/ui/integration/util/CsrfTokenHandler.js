/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/base/util/isPlainObject","sap/base/util/merge","sap/ui/model/json/JSONModel","../cards/data/CsrfToken"],function(t,e,o,r,n){"use strict";var i=/\{\{csrfTokens.([^\}]+)\}\}/;var s="X-CSRF-Token";var a=t.extend("sap.ui.integration.util.CsrfTokenHandler",{metadata:{library:"sap.ui.integration"},constructor:function(e){t.call(this);e=e||{};this._mTokens=new Map;this._oModel=e.model;this._oHost=e.host;this._oConfiguration=e.configuration;this._oDataProviderFactory=e.dataProviderFactory;for(const[t,o]of Object.entries(e.configuration)){this._mTokens.set(t,new n(t,o,this))}}});a.prototype.getUsedToken=function(t){const e=this._findTokenName(t);return this._mTokens.get(e)};a.prototype.fetchValue=function(t){t=o({},t);return this._requestToken(t.data)};a.prototype.fetchValueByHost=function(t){if(this._oHost){t=o({},t);return this._oHost.getCsrfToken(t)}return Promise.resolve()};a.prototype.onTokenFetched=function(t,e){this._setCsrfModelValue(t,e)};a.prototype.setHost=function(t){this._oHost=t};a.prototype.isExpiredToken=function(t){if(!t){return false}var e=t.headers.get(s);return e&&e.toLowerCase()==="required"&&t.status===403};a.prototype.replacePlaceholders=function(t){if(!t){return t}if(Array.isArray(t)){return t.map(t=>this.replacePlaceholders(t))}if(e(t)){const e={};for(const o in t){e[o]=this.replacePlaceholders(t[o])}return e}if(typeof t==="string"){const e=this._mTokens.get(this._getTokenName(t));if(e){return t.replace(i,e.value)}}return t};a.prototype._requestToken=function(t){if(!t){return Promise.reject("CSRF definition is incorrect")}const e=this._oDataProviderFactory.create(t);const o=e.getData().then(o=>{var n,i;if(t.path){i=new r(o);n=i.getProperty(t.path);i.destroy()}else{n=e.getLastResponse().headers.get(s)}return n}).catch(function(){throw"CSRF token cannot be resolved"});if(this._oHost){this._oHost.csrfTokenFetched(t,o)}return o};a.prototype.markExpiredTokenByRequest=function(t){const e=this._findTokenName(t);if(!e){return}this._mTokens.get(e).markExpired();if(this._oHost){this._oHost.csrfTokenExpired(this._getTokenConfig(e))}};a.prototype._getTokenConfig=function(t){return this._oConfiguration[t]};a.prototype._setCsrfModelValue=function(t,e){this._oModel.setProperty(`/${t}`,{value:e})};a.prototype._findTokenName=function(t){var o,r,n;for(r in t){o=t[r];if(typeof o==="string"){n=this._getTokenName(o);if(n){return n}}if(e(o)){o=this._findTokenName(o);if(o){return o}}}return null};a.prototype._getTokenName=function(t){const e=/\{csrfTokens\>\/([^\/]*).*}/;let o=t.match(e);if(!o){o=t.match(i);if(!o){return""}}return o[1]};return a});
//# sourceMappingURL=CsrfTokenHandler.js.map