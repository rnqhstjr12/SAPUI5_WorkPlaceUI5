// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils","sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations","sap/base/util/deepExtend","sap/base/util/isEmptyObject","sap/base/util/ObjectPath","sap/base/util/merge","sap/base/util/deepEqual","sap/ushell/adapters/cdm/v3/_LaunchPage/readApplications","sap/ushell/utils/UrlParsing","sap/base/Log"],function(e,t,a,r,i,s,n,o,p,u){"use strict";var l={};l.getMember=function(t,a){return e.getMember(t,a)};l.getNestedObjectProperty=function(t,a,r){return e.getNestedObjectProperty(t,a,r)};l.mapOne=function(e,i,n,p,u,l){var c=false;i=a({},i);n=a({},n);p=a({},p);u=a({},u);p=p||{};u=u||{};var m={};m.semanticObject=this.getMember(i,"semanticObject");m.action=this.getMember(i,"action");var f=t.getConfig(p);m.title=t.getTitle([undefined,f,i,n]);m.info=t.getInfo([undefined,f,i,n]);m.icon=t.getIcon([undefined,f,i,n]);m.subTitle=t.getSubTitle([undefined,f,i,n]);m.shortTitle=t.getShortTitle([undefined,f,i,n]);m.keywords=t.getKeywords([undefined,f,i,n]);m.numberUnit=t.getNumberUnit([undefined,f,undefined,undefined]);m.deviceTypes=this.getMember(n,"sap|ui.deviceTypes")||{};["desktop","tablet","phone"].forEach(function(e){if(Object.prototype.hasOwnProperty.call(this.getMember(i,"deviceTypes")||{},e)){m.deviceTypes[e]=i.deviceTypes[e]}if(!Object.prototype.hasOwnProperty.call(m.deviceTypes,e)){m.deviceTypes[e]=true}m.deviceTypes[e]=!!m.deviceTypes[e]}.bind(this));m.signature=this.getMember(i,"signature")||{};m.signature.parameters=this.getMember(m,"signature.parameters")||{};m.signature.additionalParameters=this.getMember(i,"signature.additionalParameters")||"allowed";var d=this.getMember(m,"signature.parameters.sap-hide-intent-link");if(d&&d.hasOwnProperty("defaultValue")){m.hideIntentLink=d.defaultValue.value==="true"}if(d&&!d.required&&d.hasOwnProperty("defaultValue")){delete m.signature.parameters["sap-hide-intent-link"]}var g=this.getMember(n,"sap|platform|runtime");m.resolutionResult=a({},g);if(g){m.resolutionResult["sap.platform.runtime"]=a({},g)}if(this.getMember(n,"sap|ui.technology")==="GUI"){m.resolutionResult["sap.gui"]=this.getMember(n,"sap|gui")}if(this.getMember(n,"sap|ui.technology")==="WDA"){m.resolutionResult["sap.wda"]=this.getMember(n,"sap|wda")}if(this.getMember(n,"sap|ui.technology")==="URL"){if(n["sap.url"]){m.resolutionResult["sap.platform.runtime"]=m.resolutionResult["sap.platform.runtime"]||{};m.resolutionResult.url=n["sap.url"].uri;m.resolutionResult["sap.platform.runtime"].url=n["sap.url"].uri}else if(g&&g.uri){m.resolutionResult["sap.platform.runtime"].url=g.uri;m.resolutionResult.url=g.uri}}if(!m.resolutionResult["sap.ui"]){m.resolutionResult["sap.ui"]={}}m.resolutionResult["sap.ui"].technology=this.getMember(n,"sap|ui.technology");m.resolutionResult.applicationType=this._formatApplicationType(m.resolutionResult,n);m.resolutionResult.systemAlias=m.resolutionResult.systemAlias||this.getMember(i,"systemAlias");m.resolutionResult.systemAliasSemantics="apply";m.resolutionResult.text=m.title;m.resolutionResult.appId=this.getMember(n,"sap|app.id");var h;var b;var y=this.getMember(p,"vizConfig.sap|flp.indicatorDataSource");var v={};if(!r(u)){var M=this.getMember(u,"sap|app.type");if(M==="card"){c=true;v=s({},u,p.vizConfig)}else{v.componentName=this.getMember(u,"sap|ui5.componentName");var O=this.getMember(u,"sap|platform|runtime.componentProperties");if(O){v.componentProperties=O}if(this.getMember(u,"sap|platform|runtime.includeManifest")){v.componentProperties=v.componentProperties||{};v.componentProperties.manifest=s({},u,p.vizConfig);delete v.componentProperties.manifest["sap.platform.runtime"]}}}if(this.getMember(n,"sap|app.type")==="plugin"||this.getMember(n,"sap|flp.type")==="plugin"){return undefined}var T=this.getNestedObjectProperty([f,n,u],"sap|flp.tileSize");var R=this.getNestedObjectProperty([f,n,u],"sap|app.description");if(this.getMember(n,"sap|ui.technology")==="GUI"&&this.getMember(n,"sap|gui.transaction")){h=this.getMember(n,"sap|gui.transaction")}if(this.getMember(n,"sap|ui.technology")==="WDA"&&this.getMember(n,"sap|wda.applicationId")){h=this.getMember(n,"sap|wda.applicationId")}var P=this.getNestedObjectProperty([f,n,u],"sap|app.dataSources");if(this.getMember(n,"sap|app.id")){b=this.getMember(n,"sap|app.id")}var j=o.getContentProviderId(n)||"";m.tileResolutionResult={appId:b,title:m.title,subTitle:m.subTitle,icon:m.icon,size:T,info:m.info,keywords:m.keywords,tileComponentLoadInfo:v,indicatorDataSource:y,dataSources:P,description:R,runtimeInformation:g,technicalInformation:h,deviceTypes:m.deviceTypes,isCard:c,contentProviderId:j,numberUnit:m.numberUnit};var I=this.getMember(n,"sap|integration.urlTemplateId");var S=this.getTemplatePayloadFromSite(I,l);if(S){m.templateContext={payload:S,site:l,siteAppSection:n}}return m};l.getTemplatePayloadFromSite=function(e,t){if(!t||typeof e!=="string"){return null}var a=e.replace(/[.]/g,"|");return this.getMember(t.urlTemplates,a+".payload")};l._formatApplicationType=function(e,t){var a=e.applicationType;if(a){return a}var r=this.getMember(t,"sap|platform|runtime.componentProperties.self.name")||this.getMember(t,"sap|ui5.componentName");if(this.getMember(t,"sap|flp.appType")==="UI5"||this.getMember(t,"sap|ui.technology")==="UI5"){e.applicationType="SAPUI5";e.additionalInformation="SAPUI5.Component="+r;e.url=this.getMember(t,"sap|platform|runtime.componentProperties.url");e.applicationDependencies=this.getMember(t,"sap|platform|runtime.componentProperties");return"SAPUI5"}if(this.getMember(t,"sap|ui.technology")==="GUI"){e.applicationType="TR";e["sap.gui"]=this.getMember(t,"sap|gui");e.systemAlias=this.getMember(t,"sap|app.destination.name");return"TR"}if(this.getMember(t,"sap|ui.technology")==="WDA"){e.applicationType="WDA";e["sap.wda"]=this.getMember(t,"sap|wda");e.systemAlias=this.getMember(t,"sap|app.destination.name");return"WDA"}if(this.getMember(t,"sap|ui.technology")==="URL"){e.applicationType="URL";e.systemAlias=this.getMember(t,"sap|app.destination.name")}return"URL"};l.formatSite=function(e){var t=this;if(!e){return[]}var a=[];try{var r=Object.keys(e.applications||{}).sort();r.forEach(function(r){try{var i=e.applications[r];var s=this.getMember(i,"sap|app.crossNavigation.inbounds");if(s){var n=Object.keys(s).sort();n.forEach(function(r){var n=s[r];var p=t.mapOne(r,n,i,undefined,undefined,e);if(p){p.contentProviderId=o.getContentProviderId(i)||"";a.push(p)}})}}catch(e){u.error("Error in application "+r+": "+e,e.stack)}}.bind(this))}catch(e){u.error(e);u.error(e.stack);return[]}return a};l.toHashFromInbound=function(e){var t={target:{semanticObject:e.semanticObject,action:e.action},params:{}};var a=i.get("signature.parameters",e)||{};Object.keys(a).forEach(function(e){if(a[e].filter&&Object.prototype.hasOwnProperty.call(a[e].filter,"value")&&(a[e].filter.format===undefined||a[e].filter.format==="plain")){t.params[e]=[a[e].filter.value]}if(a[e].launcherValue&&Object.prototype.hasOwnProperty.call(a[e].launcherValue,"value")&&(a[e].launcherValue.format===undefined||a[e].launcherValue.format==="plain")){t.params[e]=[a[e].launcherValue.value]}});var r=p.constructShellHash(t);if(!r){return undefined}return r};l.toHashFromOutbound=function(e){var t={target:{semanticObject:e.semanticObject,action:e.action},params:{}};var a=e.parameters||{};Object.keys(a).forEach(function(e){if(a.hasOwnProperty(e)&&typeof a[e].value==="object"){t.params[e]=[a[e].value.value]}});var r=p.constructShellHash(t);if(!r){return undefined}return r};l.toHashFromVizData=function(e,t){if(!e.target){return undefined}var a=e.target;if(a.type==="URL"){return a.url}var r=a.appId;var i=a.inboundId;var s;if(r&&i){var n=o.getInboundTarget(t,r,i);s={};if(n){s.semanticObject=n.semanticObject;s.action=n.action;s.parameters=a.parameters||{};s.parameters["sap-ui-app-id-hint"]={value:{value:r,format:"plain"}};s.appSpecificRoute=a.appSpecificRoute||""}}else if(a.semanticObject&&a.action){s=a}return l.toHashFromTarget(s)};l.toHashFromTarget=function(e){try{var t={};var a=i.get("parameters",e)||{};Object.keys(a).forEach(function(e){t[e]=Array.isArray(a[e].value.value)?a[e].value.value:[a[e].value.value]});var r={target:{semanticObject:e.semanticObject,action:e.action},params:t,appSpecificRoute:e.appSpecificRoute};return"#"+p.constructShellHash(r)}catch(e){return undefined}};l.toTargetFromHash=function(e){var t=p.parseShellHash(e);if(t!==undefined){var a=t.params||{};if(Object.keys(a).length>0){t.parameters=[];Object.keys(a).forEach(function(e){var r=Array.isArray(a[e])?a[e]:[a[e]];r.forEach(function(a){var r={name:e,value:a};t.parameters.push(r)})})}delete t.params}else{t={type:"URL",url:e}}return t};l.isSameTarget=function(e,t){var a;if(e.type!==t.type){return false}if(e.type==="URL"){a=e.url===t.url}else{a=e.semanticObject===t.semanticObject&&e.action===t.action&&e.appSpecificRoute===t.appSpecificRoute&&n(e.parameters,t.parameters)}return a};return l});
//# sourceMappingURL=utilsCdm.js.map