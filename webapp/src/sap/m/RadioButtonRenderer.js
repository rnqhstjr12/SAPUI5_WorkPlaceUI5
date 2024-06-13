/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/ControlBehavior","sap/ui/core/ValueStateSupport","sap/ui/core/library","sap/ui/Device"],function(e,t,a,s){"use strict";var r=a.ValueState;var i={apiVersion:2};i.render=function(e,t){this.addWOuterDivStyles(e,t);this.addInnerDivStyles(e,t);this.renderSvg(e,t);this.renderInput(e,t);this.closeDiv(e);e.renderControl(t._oLabel);this.renderTooltip(e,t);this.closeDiv(e)};i.addWOuterDivStyles=function(e,t){var a=t.getId(),s=t.getEnabled(),r=!t.getProperty("editableParent"),i=!t.getEditable()||r,n=t.getValueState();e.openStart("div",t).class("sapMRb");if(t.getUseEntireWidth()){e.style("width",t.getWidth())}var l=this.getTooltipText(t);if(l){e.attr("title",l)}e.accessibilityState(t,{role:"radio",readonly:null,selected:null,checked:t.getSelected(),disabled:i?true:undefined,labelledby:{value:a+"-label",append:true},describedby:{value:l?a+"-Descr":undefined,append:true}});if(t.getSelected()){e.class("sapMRbSel")}if(!s){e.class("sapMRbDis")}if(i){e.class("sapMRbRo")}if(!this.isButtonReadOnly(t)){this.addValueStateClass(e,n)}if(s){e.attr("tabindex",t.hasOwnProperty("_iTabIndex")?t._iTabIndex:0)}e.openEnd()};i.addInnerDivStyles=function(e,t){e.openStart("div").class("sapMRbB");if(!this.isButtonReadOnly(t)&&s.system.desktop){e.class("sapMRbHoverable")}e.openEnd()};i.renderSvg=function(e,t){e.openStart("svg").attr("xmlns","http://www.w3.org/2000/svg").attr("version","1.0").accessibilityState({role:"presentation"}).class("sapMRbSvg").openEnd();e.openStart("circle",t.getId()+"-Button").attr("stroke","black").attr("r","50%").attr("stroke-width","2").attr("fill","none").class("sapMRbBOut").openEnd().close("circle");e.openStart("circle").attr("stroke-width","10").class("sapMRbBInn").openEnd().close("circle");e.close("svg")};i.renderInput=function(e,t){e.voidStart("input",t.getId()+"-RB").attr("type","radio").attr("tabindex","-1").attr("name",t.getGroupName());if(t.getSelected()){e.attr("checked","checked")}if(this.isButtonReadOnly(t)){e.attr("readonly","readonly");e.attr("disabled","disabled")}e.voidEnd()};i.renderTooltip=function(t,a){var s=this.getTooltipText(a);if(s&&e.isAccessibilityEnabled()){t.openStart("span",a.getId()+"-Descr").style("display","none").openEnd().text(s).close("span")}};i.isButtonReadOnly=function(e){var t=e.getEnabled(),a=!e.getProperty("editableParent"),s=!e.getEditable()||a;return!t||s};i.closeDiv=function(e){e.close("div")};i.getTooltipText=function(e){var a=e.getProperty("valueStateText"),s=e.getTooltip_AsString();if(a){return(s?s+" - ":"")+a}else{return t.enrichTooltip(e,s)}};i.addValueStateClass=function(e,t){switch(t){case r.Error:e.class("sapMRbErr");break;case r.Warning:e.class("sapMRbWarn");break;case r.Success:e.class("sapMRbSucc");break;case r.Information:e.class("sapMRbInfo");break;default:break}};return i},true);
//# sourceMappingURL=RadioButtonRenderer.js.map