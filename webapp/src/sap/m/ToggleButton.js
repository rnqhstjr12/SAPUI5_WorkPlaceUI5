/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Button","./library","sap/ui/core/EnabledPropagator","./ToggleButtonRenderer","sap/ui/core/Lib","sap/ui/events/KeyCodes"],function(e,t,s,i,r,o){"use strict";var n=e.extend("sap.m.ToggleButton",{metadata:{interfaces:["sap.m.IToolbarInteractiveControl"],library:"sap.m",designtime:"sap/m/designtime/ToggleButton.designtime",properties:{pressed:{type:"boolean",group:"Data",defaultValue:false}},events:{press:{parameters:{pressed:{type:"boolean"}}}}},renderer:i});s.call(n.prototype);n.prototype.ontap=function(e){e.setMarked();if(this.getEnabled()){this.setPressed(!this.getPressed());this.firePress({pressed:this.getPressed()})}};n.prototype.setPressed=function(e){e=!!e;if(e!=this.getPressed()){this.setProperty("pressed",e);this.$().attr("aria-pressed",e);this.$("inner").toggleClass("sapMToggleBtnPressed",e&&!this._isUnstyled())}return this};n.prototype.onkeydown=function(e){if(e.which===o.ENTER&&!e.ctrlKey&&!e.metaKey){this.ontap(e)}if(e.which===o.SPACE){this._bPressedSpace=true}if(e.which===o.SHIFT&&this._bPressedSpace){this._bPressedShift=true}};n.prototype.onkeyup=function(e){if(!this._bPressedShift&&e.which===o.SPACE||e.which===o.ENTER){e.setMarked()}if(!this._bPressedShift&&e.which===o.SPACE){this.ontap(e)}if(e.which===o.SPACE){this._bPressedShift=false}};n.prototype.getAccessibilityInfo=function(){var t=e.prototype.getAccessibilityInfo.apply(this,arguments);if(this.getPressed()){t.description=((t.description||"")+" "+r.getResourceBundleFor("sap.m").getText("ACC_CTR_STATE_PRESSED")).trim()}return t};n.prototype._getToolbarInteractive=function(){return true};n.prototype._toggleLiveChangeAnnouncement=function(){};return n});
//# sourceMappingURL=ToggleButton.js.map