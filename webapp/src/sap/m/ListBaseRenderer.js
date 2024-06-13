/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/ui/core/library","sap/ui/Device","sap/ui/core/InvisibleText","./ListItemBaseRenderer"],function(e,t,r,a,i){"use strict";var s=e.ListGrowingDirection;var n=e.ToolbarDesign;var o=t.TitleLevel;var l={apiVersion:2};l.ModeOrder={None:0,Delete:1,MultiSelect:-1,SingleSelect:1,SingleSelectLeft:-1,SingleSelectMaster:0};l.render=function(e,t){e.openStart("div",t);e.class("sapMList");if(t.getInset()){e.class("sapMListInsetBG")}e.style("width",t.getWidth());if(t.getBackgroundDesign){e.class("sapMListBG"+t.getBackgroundDesign())}var r=t.getTooltip_AsString();if(r){e.attr("title",r)}var a=t.getStickyStyleValue();if(a){e.class("sapMSticky");e.class("sapMSticky"+a)}this.renderContainerAttributes(e,t);e.openEnd();e.renderControl(t.getAggregation("_messageStrip"));var i=t.getHeaderText();var l=t.getHeaderToolbar();if(l){l.setDesign(n.Transparent,true);l.addStyleClass("sapMListHdr");l.addStyleClass("sapMListHdrTBar");l.addStyleClass("sapMTBHeader-CTX");e.renderControl(l)}else if(i){e.openStart("div",t.getId("header"));e.attr("role","heading");var d=t.getHeaderLevel();if(d!=o.Auto){e.attr("aria-level",d[d.length-1])}e.class("sapMListHdr").class("sapMListHdrText").openEnd();e.text(i);e.close("div")}var g=t.getInfoToolbar();if(g){g.setDesign(n.Info,true);g.addStyleClass("sapMListInfoTBar");e.openStart("div").class("sapMListInfoTBarContainer").openEnd();e.renderControl(g);e.close("div")}var c=t.getItems(),p=t.getShowNoData(),f=t.shouldRenderItems()&&c.length,u=t.getGrowingDirection()==s.Upwards&&t.getGrowing();if(u){this.renderGrowing(e,t)}this.renderDummyArea(e,t,"before","-1");this.renderListStartAttributes(e,t);e.class("sapMListUl");if(t._iItemNeedsHighlight){e.class("sapMListHighlight")}if(f||p){e.attr("tabindex","0")}e.class("sapMListShowSeparators"+t.getShowSeparators());e.class("sapMListMode"+t.getMode());if(t._iItemNeedsNavigated){e.class("sapMListNavigated")}e.openEnd();this.renderListHeadAttributes(e,t);if(f){if(u){c.reverse()}for(var v=0;v<c.length;v++){e.renderControl(c[v])}}var S=t.getVisibleItems().length>0;if(p&&(!f||!S)){this.renderNoData(e,t)}this.renderListEndAttributes(e,t);this.renderDummyArea(e,t,"after","0");if(!u){this.renderGrowing(e,t)}if(t.getFooterText()){e.openStart("footer",t.getId("footer")).class("sapMListFtr").openEnd();e.text(t.getFooterText());e.close("footer")}e.close("div")};l.renderContainerAttributes=function(e,t){};l.renderListHeadAttributes=function(e,t){};l.renderListStartAttributes=function(e,t){e.openStart("ul",t.getId("listUl"));e.class("sapMListItems");t.addNavSection(t.getId("listUl"));e.accessibilityState(t,this.getAccessibilityState(t))};l.getNoDataAriaRole=function(e){return null};l.getAriaLabelledBy=function(e){var t=e.getHeaderToolbar();if(t){var r=t.getTitleControl();if(r){var a=r.getId();if(e.getAriaLabelledBy().indexOf(a)===-1){return a}}}else if(e.getHeaderText()){return e.getId("header")}};l.getAriaDescribedBy=function(e){if(e.getFooterText()){return e.getId("footer")}};l.getAccessibilityState=function(e){var t=e.getAriaRole();return{role:t,multiselectable:t!="list"&&e._bSelectionMode?e.getMode()=="MultiSelect":undefined,labelledby:{value:this.getAriaLabelledBy(e),append:true},describedby:{value:this.getAriaDescribedBy(e),append:true}}};l.renderListEndAttributes=function(e,t){e.close("ul")};l.renderNoData=function(e,t){e.openStart("li",t.getId("nodata"));e.attr("tabindex","-1");var r=this.getNoDataAriaRole(t);if(r){e.attr("role",r)}e.class("sapMLIB").class("sapMListNoData").class("sapMLIBTypeInactive");i.addFocusableClasses.call(i,e);e.openEnd();e.openStart("div",t.getId("nodata-text")).class("sapMListNoDataText");var a=t.getNoData();if(a&&typeof a!=="string"){e.class("sapMListNoDataContent")}e.openEnd();this.renderNoDataArea(e,t);e.close("div");e.close("li")};l.renderNoDataArea=function(e,t){var r=t.getNoData()||t.getNoDataText();if(typeof r==="string"){e.text(r)}else{e.renderControl(r)}};l.renderDummyArea=function(e,t,a,i){e.openStart("div",t.getId(a)).attr("role","none").attr("tabindex",i);if(r.system.desktop){e.class("sapMListDummyArea");if(a=="after"){e.class("sapMListDummyAreaSticky")}}e.openEnd().close("div")};l.renderGrowing=function(e,t){var r=t._oGrowingDelegate;if(r){r.render(e)}};l.getAriaAnnouncement=function(e){return a.getStaticId("sap.m",e)};return l},true);
//# sourceMappingURL=ListBaseRenderer.js.map