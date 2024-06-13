/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/CustomData","sap/base/Log","sap/m/library"],function(t,e,i){"use strict";var a=i.BadgeAnimationType;var n=t.extend("sap.m.BadgeCustomData",{metadata:{properties:{visible:{type:"boolean",group:"Appearance",defaultValue:true},animation:{type:"sap.m.BadgeAnimationType",group:"Appearance",defaultValue:a.Full}}}});n.prototype.init=function(){var t=this.getParent();if(t&&!t.isA("sap.m.IBadge")){e.warning("BadgeCustomData must be attached only to controls, which implement sap.m.IBadge")}};n.prototype.setValue=function(e){if(this.getValue()===e){return this}if(e===null||e===undefined){e=""}var i=this.getParent();e=e.toString();t.prototype.setValue.call(this,e);if(i){i.updateBadgeValue(e)}return this};n.prototype.setVisible=function(t){if(this.getVisible()===t){return this}this.setProperty("visible",t,true);var e=this.getParent();if(e){e.updateBadgeVisibility(t)}return this};n.prototype.setAnimation=function(t){if(this.getAnimation()===t){return this}this.setProperty("animation",t,true);var e=this.getParent();if(e){e.updateBadgeAnimation(t)}return this};n.prototype.setKey=function(){return this};return n});
//# sourceMappingURL=BadgeCustomData.js.map