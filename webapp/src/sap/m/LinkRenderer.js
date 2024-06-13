/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Lib","sap/ui/core/Renderer","sap/ui/core/library","sap/ui/core/AccessKeysEnablement","sap/ui/util/defaultLinkTypes","./library"],function(e,t,a,i,r,s){"use strict";var n=a.TextDirection;var o=a.aria.HasPopup;var p=s.LinkAccessibleRole;var l={apiVersion:2};var d=s.EmptyIndicatorMode;var c=e.getResourceBundleFor("sap.m");l.render=function(e,a){var i=a.getTextDirection(),s=t.getTextAlign(a.getTextAlign(),i),l=a._determineSelfReferencePresence(),c=a.getAriaHasPopup(),g=r(a.getRel(),a.getTarget()),u=a.getHref(),f=a.getAccessibleRole(),T={labelledby:l?{value:a.getId(),append:true}:undefined,haspopup:c===o.None?null:c.toLowerCase()},b=a.getEnabled(),E="",x=a.getProperty("accesskey");e.openStart("a",a);e.class("sapMLnk");if(a.getSubtle()){e.class("sapMLnkSubtle");E+=a._sAriaLinkSubtleId}if(a.getEmphasized()){e.class("sapMLnkEmphasized");E+=" "+a._sAriaLinkEmphasizedId}if(x){e.attr("data-ui5-accesskey",x)}switch(f){case p.Button:T.role=p.Button.toLowerCase();break;default:u=u&&a._isHrefValid(u)&&a.getEnabled()?u:"#";e.attr("href",u)}T.describedby=E?{value:E.trim(),append:true}:undefined;if(!b){e.class("sapMLnkDsbl");e.attr("aria-disabled","true")}e.attr("tabindex",a._getTabindex());if(a.getWrapping()){e.class("sapMLnkWrapping")}if(a.getEmptyIndicatorMode()!==d.Off&&!a.getText()){e.class("sapMLinkContainsEmptyIdicator")}if(a.getTooltip_AsString()){e.attr("title",a.getTooltip_AsString())}if(a.getTarget()){e.attr("target",a.getTarget())}if(g){e.attr("rel",g)}if(a.getWidth()){e.style("width",a.getWidth())}else{e.class("sapMLnkMaxWidth")}if(s){e.style("text-align",s)}if(i!==n.Inherit){e.attr("dir",i.toLowerCase())}a.getDragDropConfig().forEach(function(t){if(!t.getEnabled()){e.attr("draggable",false)}});e.accessibilityState(a,T);e.openEnd();if(this.writeText){this.writeText(e,a)}else{this.renderText(e,a)}e.close("a")};l.renderText=function(e,t){var a=t.getText();if(t.getEmptyIndicatorMode()!==d.Off&&!t.getText()){this.renderEmptyIndicator(e,t)}else{e.text(a)}};l.renderEmptyIndicator=function(e,t){e.openStart("span");e.class("sapMEmptyIndicator");e.class("sapMLnkDsbl");if(t.getEmptyIndicatorMode()===d.Auto){e.class("sapMEmptyIndicatorAuto")}e.openEnd();e.openStart("span");e.attr("aria-hidden",true);e.openEnd();e.text(c.getText("EMPTY_INDICATOR"));e.close("span");e.openStart("span");e.class("sapUiPseudoInvisibleText");e.openEnd();e.text(c.getText("EMPTY_INDICATOR_TEXT"));e.close("span");e.close("span")};return l},true);
//# sourceMappingURL=LinkRenderer.js.map