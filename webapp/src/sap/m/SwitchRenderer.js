/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/m/library","sap/ui/core/Configuration","sap/ui/core/ControlBehavior"],function(e,t,i,n){"use strict";var a=t.SwitchType;var s={apiVersion:2};s.CSS_CLASS="sapMSwt";s.render=function(t,a){var l=a.getState(),d=l?a._sOn:a._sOff,r=a.getTooltip_AsString(),o=a.getEnabled(),c=a.getName(),p=n.isAccessibilityEnabled(),f=n.getAnimationMode(),S=s.CSS_CLASS;t.openStart("div",a);t.class(S+"Cont");if(!o){t.class(S+"ContDisabled")}if(o){t.attr("tabindex","0")}if(r){t.attr("title",r)}if(p){this.writeAccessibilityState(t,a)}t.openEnd();t.openStart("div",a.getId()+"-switch");t.attr("aria-hidden","true");t.class(S);if(f!==i.AnimationMode.none&&f!==i.AnimationMode.minimal){t.class(S+"Trans")}t.class(l?S+"On":S+"Off");t.class(S+a.getType());if(e.system.desktop&&o){t.class(S+"Hoverable")}if(!o){t.class(S+"Disabled")}if(a._sOn===" "&&a._sOff===" "){t.class(S+"NoLabel")}t.openEnd();t.openStart("div",a.getId()+"-inner");t.class(S+"Inner");t.openEnd();this.renderText(t,a);this.renderHandle(t,a,d);t.close("div");t.close("div");if(c){this.renderCheckbox(t,a,d)}if(p){this.renderInvisibleElement(t,a,{id:a.getInvisibleElementId(),text:a.getInvisibleElementText(l)})}t.close("div")};s.renderText=function(e,t){var i=s.CSS_CLASS,n=t.getType()===a.Default;e.openStart("div",t.getId()+"-texton");e.class(i+"Text");e.class(i+"TextOn");e.openEnd();e.openStart("span");e.class(i+"Label");e.class(i+"LabelOn");e.openEnd();if(n){e.text(t._sOn)}e.close("span");e.close("div");e.openStart("div",t.getId()+"-textoff");e.class(i+"Text");e.class(i+"TextOff");e.openEnd();e.openStart("span");e.class(i+"Label");e.class(i+"LabelOff");e.openEnd();if(n){e.text(t._sOff)}e.close("span");e.close("div")};s.renderHandle=function(e,t,i){var n=s.CSS_CLASS;e.openStart("div",t.getId()+"-handle");e.attr("data-sap-ui-swt",i);e.class(n+"Handle");e.openEnd();e.close("div")};s.renderCheckbox=function(e,t,i){e.voidStart("input",t.getId()+"-input");e.attr("type","checkbox");e.attr("name",t.getName());e.attr("value",i);if(t.getState()){e.attr("checked","checked")}if(!t.getEnabled()){e.attr("disabled","disabled")}e.voidEnd()};s.writeAccessibilityState=function(e,t){var i=t.getAriaLabelledBy(),n;if(i){i={value:t.getInvisibleElementId(),append:true}}n={role:"switch",checked:t.getState(),labelledby:i};e.accessibilityState(t,n)};s.renderInvisibleElement=function(e,t,i){e.openStart("span",i.id);e.attr("aria-hidden","true");e.class("sapUiInvisibleText");e.openEnd();e.text(i.text);e.close("span")};return s},true);
//# sourceMappingURL=SwitchRenderer.js.map