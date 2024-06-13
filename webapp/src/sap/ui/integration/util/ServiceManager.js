/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/EventProvider","sap/base/Log"],function(e,r){"use strict";var t=e.extend("sap.ui.integration.util.ServiceManager",{constructor:function(r,t){if(!r){throw new Error("Missing manifest services reference!")}if(!t){throw new Error("Missing context object")}e.call(this);this._mServiceFactoryReferences=r;this._mServices={};this._oServiceContext=t;this._initAllServices()}});t.prototype._initAllServices=function(){for(var e in this._mServiceFactoryReferences){this._initService(e)}};t.prototype._initService=function(e){var i=this._mServices[e]||{};i.promise=t._getService(this._oServiceContext,e,this._mServiceFactoryReferences).then(function(e){i.instance=e}).catch(function(e){r.error(e.message)});this._mServices[e]=i};t.prototype.getService=function(e){var r="Invalid service";return new Promise(function(t,i){if(!e||!this._mServices[e]||!Object.keys(this._mServices[e])){i(r);return}this._mServices[e].promise.then(function(){if(this._mServices[e].instance){t(this._mServices[e].instance)}else{i(r)}}.bind(this)).catch(i)}.bind(this))};t.prototype.destroy=function(){this._mServices=null};t._getService=function(e,r,t){return new Promise(function(i,n){var c,s;if(e.bIsDestroyed){n(new Error("Service "+r+" could not be loaded as the requestor "+e.getMetadata().getName()+" was destroyed."));return}if(!t){n(new Error("No Services declared"));return}else{c=t[r]}if(!c||!c.factoryName){n(new Error("No Service '"+r+"' declared or factoryName missing"));return}else{s=c.factoryName}sap.ui.require(["sap/ui/core/service/ServiceFactoryRegistry"],function(t){var o=t.get(s);if(o){o.createInstance({scopeObject:e,scopeType:"component",settings:c.settings||{}}).then(function(e){if(e.getInterface){i(e.getInterface())}else{i(e)}}).catch(n)}else{var a=new Error("ServiceFactory '"+s+"' for Service '"+r+"' not found in ServiceFactoryRegistry");a._optional=c.optional;n(a)}})})};return t});
//# sourceMappingURL=ServiceManager.js.map