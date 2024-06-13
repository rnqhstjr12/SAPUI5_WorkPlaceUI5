// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([],function(){"use strict";var t=function(t){this._oData=t};t.prototype.getAlias=function(){return this._oData.alias};t.prototype.getBaseUrl=function(){return this._oData.baseUrl};t.prototype.getClient=function(){return this._oData.client};t.prototype.getClientRole=function(){return this._oData.clientRole};t.prototype.getName=function(){return this._oData.system};t.prototype.getPlatform=function(){return this._oData.platform};t.prototype.getProductVersion=function(){return this._oData.productVersion};t.prototype.getProductName=function(){return this._oData.productName};t.prototype.getSystemName=function(){return this._oData.systemName};t.prototype.getSystemRole=function(){return this._oData.systemRole};t.prototype.getTenantRole=function(){return this._oData.tenantRole};t.prototype.isTrial=function(){return!!this._oData.isTrialSystem};t.prototype.getSysInfoBar=function(){return!!this._oData.sysInfoBar};t.prototype.getSysInfoBarColor=function(){return this._oData.sysInfoBarColor};t.prototype.getSysInfoBarMainText=function(){return this._oData.sysInfoBarMainText};t.prototype.getSysInfoBarSecondaryText=function(){return this._oData.sysInfoBarSecondaryText};t.prototype.getSysInfoBarIcon=function(){return this._oData.sysInfoBarIcon};t.prototype.adjustUrl=function(t){if(t.indexOf("/")!==0||t==="/"){throw new Error("Invalid URL: "+t)}if(this._oData.baseUrl===";o="){if(this._oData.alias){t=t+";o="+this._oData.alias}}else if(this._oData.baseUrl){t=this._oData.baseUrl.replace(/\/$/,"")+t}if(this._oData.client){t+=(t.indexOf("?")>=0?"&":"?")+"sap-client="+this._oData.client}return t};t.prototype.toString=function(){return JSON.stringify(this._oData)};return t},true);
//# sourceMappingURL=System.js.map