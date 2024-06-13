/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/ToolbarLayoutData","sap/m/library","sap/base/Log"],function(e,t,r){"use strict";var o=t.OverflowToolbarPriority;var a=e.extend("sap.m.OverflowToolbarLayoutData",{metadata:{properties:{moveToOverflow:{type:"boolean",defaultValue:true,deprecated:true},stayInOverflow:{type:"boolean",defaultValue:false,deprecated:true},priority:{type:"sap.m.OverflowToolbarPriority",group:"Behavior",defaultValue:o.High},group:{type:"int",group:"Behavior",defaultValue:0},closeOverflowOnInteraction:{type:"boolean",group:"Behavior",defaultValue:true}}}});a.prototype.invalidate=function(){var t=this.getPriority(),a=t===o.AlwaysOverflow||t===o.NeverOverflow;if(this.getGroup()&&a){r.error("It is not allowed to set AlwaysOverflow or NeverOverflow to a group items.")}return e.prototype.invalidate.call(this)};a.prototype.setPriority=function(e){var t;if(this.getPriority()===e){return this}if(this.isInvalidateSuppressed()){t=this.setProperty("priority",e,true);this.invalidate()}else{t=this.setProperty("priority",e)}return t};return a});
//# sourceMappingURL=OverflowToolbarLayoutData.js.map