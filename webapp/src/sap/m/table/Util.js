/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/i18n/Localization","sap/m/library","sap/ui/core/Lib","sap/ui/core/Locale","sap/ui/core/LocaleData","sap/ui/core/Theming","sap/ui/core/theming/Parameters","sap/m/IllustratedMessage","sap/m/Button","sap/ui/core/InvisibleMessage"],function(e,t,a,n,r,i,o,s,u,l){"use strict";var c={};var m="";var p=parseFloat(t.BaseFontSize);var d=null;var g=null;c.measureText=function(){var e=.05;var t=document.createElement("canvas").getContext("2d");var a=function(){m=[parseFloat(o.get({name:"sapMFontMediumSize"})||"0.875rem")*p+"px",o.get({name:"sapUiFontFamily"})||"Arial"].join(" ");return m};i.attachApplied(a);return function(n,r){t.font=r||m||a();return t.measureText(n||"").width/p+e}}();c.calcTypeWidth=function(){let t;var o=0;var s=[2023,9,26,22,47,58,999];var u=new Date(Date.UTC.apply(0,s));var l=new(Function.prototype.bind.apply(Date,[null].concat(s)));var m={Byte:3,SByte:3,Int16:5,Int32:9,Int64:12,Single:6,Float:12,Double:13,Decimal:15,Integer:9};i.attachApplied(function(){o=0});const p=function(){if(!t){const a=r.getInstance(new n(e.getLanguageTag())).getTimezoneTranslations();[t]=Object.entries(a).reduce(([e,t],[a,n])=>typeof n==="string"&&n.length>t?[a,n.length]:[e,t],["",0])}return t};return function(e,t){var n=e.getMetadata().getName().split(".").pop();var r=t&&t.maxWidth||19;var i=t&&t.gap||0;var s=function(e){return Math.min(e+i,r)};if(n=="Boolean"){if(!o){var d=a.getResourceBundleFor("sap.ui.core");var g=c.measureText(d.getText("YES"));var f=c.measureText(d.getText("NO"));o=Math.max(g,f)}return s(o)}if(n=="String"||e.isA("sap.ui.model.odata.type.String")){var v=parseInt(e.getConstraints().maxLength)||0;if(!v||v*.25>r){return r}var T=c.measureText("A".repeat(v));if(v<r||r<10){return s(T)}var h=Math.log(T-r*.16)/Math.log(r/3)*(r/2)*Math.pow(r/19,1/T);return s(Math.min(h,T))}if(n.startsWith("Date")||n.startsWith("Time")){var M=e.getFormatOptions();var x=M.UTC?u:l;var E=x.toLocaleDateString();if(n=="TimeOfDay"){E=new Intl.DateTimeFormat("de",{hour:"numeric",minute:"numeric",second:"numeric"}).format(x);E=e.formatValue(E,"string")}else if(e.isA("sap.ui.model.odata.type.Time")){E=e.formatValue({__edmType:"Edm.Time",ms:u.valueOf()},"string")}else if(e.isA("sap.ui.model.odata.type.DateTimeWithTimezone")){E=e.formatValue([x,p()],"string")}else{E=e.formatValue(M.interval?[x,new Date(x*1.009)]:x,"string");(e.oFormat&&e.oFormat.oFormatOptions&&e.oFormat.oFormatOptions.pattern||"").replace(/[MELVec]{3,4}/,function(e){E+=e.length==4?"---":"-"})}return s(c.measureText(E))}if(m[n]){var A=parseInt(e.getConstraints().scale)||0;var L=parseInt(e.getConstraints().precision)||20;L=Math.min(L,m[n]);var N=2*Math.pow(10,L-A-1);N=e.formatValue(N,"string");return s(c.measureText(N))}return t&&t.defaultWidth||8}}();c.calcHeaderWidth=function(){var e="";var t="";var a=function(){if(!e){e=[o.get({name:"sapUiColumnHeaderFontWeight"})||"normal",m].join(" ")}return e};var n=function(){if(!t){t=[o.get({name:"sapMFontLargeSize"})||"normal",m].join(" ")}return t};i.attachApplied(function(){e="";t=""});return function(e,t,r,i,o){var s=e.length;var u=0;r=r||19;i=i||2;if(t>r){return r}if(i>s){return i}if(o){u=.125+c.measureText("*",n())}if(!t){var l=c.measureText(e,a());return l+u}var m=c.measureText(e,a());m=Math.min(m,r*.7);t=Math.max(t,i);var p=Math.max(1,1-Math.log(Math.max(t-1.7,.2))/Math.log(r*.5)+1);var d=p*t;var g=Math.max(0,m-d);var l=g<.15?m:d+g*(1-1/t)/Math.E;return l+u}}();c.calcColumnWidth=function(e,t,a){if(!Array.isArray(e)){e=[e]}a=Object.assign({minWidth:2,maxWidth:19,defaultWidth:8,truncateLabel:true,padding:1.0625,gap:0},a);var n=0;var r=Math.max(1,a.minWidth);var i=Math.max(r,a.maxWidth);var o=a.treeColumn?3:0;var s=a.gap+o+e.reduce(function(e,t){var n=t,r={defaultWidth:a.defaultWidth,maxWidth:a.maxWidth};if(Array.isArray(t)){n=t[0];r=t[1]||r}var i=c.calcTypeWidth(n,r);return a.verticalArrangement?Math.max(e,i):e+i+(e&&.5)},0);if(t){n=c.calcHeaderWidth(t,a.truncateLabel?s:0,i,r,a.required);n+=a.headerGap?(8+14)/p:0}s=Math.max(r,s,n);s=Math.min(s,i);s=Math.ceil(s*100)/100;return s+a.padding+"rem"};c.getNoColumnsIllustratedMessage=function(e){var n=a.getResourceBundleFor("sap.m");var r=new s({illustrationType:t.IllustratedMessageType.AddColumn,title:n.getText("TABLE_NO_COLUMNS_TITLE"),description:n.getText("TABLE_NO_COLUMNS_DESCRIPTION")});if(e){var i=new u({icon:"sap-icon://action-settings",press:e});r.addAdditionalContent(i)}return r};c.getSelectAllPopover=function(){if(g){return g}g=new Promise(function(e){sap.ui.require(["sap/m/Popover","sap/m/Bar","sap/m/HBox","sap/m/Title","sap/ui/core/Icon","sap/ui/core/library","sap/m/Text"],function(t,a,n,r,i,o,s){e({Popover:t,Bar:a,HBox:n,Title:r,Icon:i,coreLib:o,Text:s})})}).then(function(e){var t=a.getResourceBundleFor("sap.m");var n=e.coreLib.IconColor.Critical,r=e.coreLib.TitleLevel.H2;d=new e.Popover({customHeader:new e.Bar({contentMiddle:[new e.HBox({items:[new e.Icon({src:"sap-icon://message-warning",color:n}).addStyleClass("sapUiTinyMarginEnd"),new e.Title({text:t.getText("TABLE_SELECT_LIMIT_TITLE"),level:r})],renderType:"Bare",justifyContent:"Center",alignItems:"Center"})]}),content:[new e.Text]}).addStyleClass("sapUiContentPadding");return{oSelectAllNotificationPopover:d,oResourceBundle:t}});return g};c.showSelectionLimitPopover=function(e,t){c.getSelectAllPopover().then(function(a){var n=a.oSelectAllNotificationPopover;var r=a.oResourceBundle;var i=r.getText("TABLE_SELECT_LIMIT",[e]);n.getContent()[0].setText(i);if(t){n.openBy(t)}})};c.hideSelectionLimitPopover=function(){if(d&&d.isOpen()){d.close()}};c.announceTableUpdate=function(e,t){var n=l.getInstance();if(n){var r=a.getResourceBundleFor("sap.m");if(t==undefined){n.announce(r.getText("table.ANNOUNCEMENT_TABLE_UPDATED",[e]))}else if(t>1){n.announce(r.getText("table.ANNOUNCEMENT_TABLE_UPDATED_MULT",[e,t]))}else if(t===1){n.announce(r.getText("table.ANNOUNCEMENT_TABLE_UPDATED_SING",[e,t]))}else{n.announce(r.getText("table.ANNOUNCEMENT_TABLE_UPDATED_NOITEMS",[e]))}}};c.announceEmptyColumnMenu=function(){var e=l.getInstance();var t=a.getResourceBundleFor("sap.m");e.announce(t.getText("table.ANNOUNCEMENT_EMPTY_COLUMN_MENU"))};c.isEmpty=function(e){if(!e){return true}var t=e.getLength();if(t===1&&e.isA("sap.ui.model.analytics.AnalyticalBinding")){var a=e?e.providesGrandTotal()&&e.hasTotaledMeasures():false;if(a){t=0}}return t<=0};c.isExportable=function(e){return!c.isEmpty(e)&&(!e?.getDownloadUrl||e.isResolved()&&e.getDownloadUrl()!==null)};c.isThemeApplied=function(){var e=false;var t=function(){e=true};i.attachApplied(t);i.detachApplied(t);return e};return c});
//# sourceMappingURL=Util.js.map