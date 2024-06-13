//@ui5-bundle sap/ushell/components/tiles/cdm/applauncherdynamic/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/components/tiles/cdm/applauncherdynamic/Component.js":function(){
// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/XMLView","sap/ui/core/UIComponent"],function(e,t){"use strict";return t.extend("sap.ushell.components.tiles.cdm.applauncherdynamic.Component",{metadata:{interfaces:["sap.ui.core.IAsyncContentCreation"]},createContent:function(){var t=this.getComponentData();var i=t.properties||{};var r=i.tilePersonalization||{};var o=i.indicatorDataSource;if(o&&o.path){r.serviceUrl=o.path;r.serviceRefreshInterval=o.refresh}var n=t.startupParameters;if(n&&n["sap-system"]&&n["sap-system"][0]){r["sap-system"]=n["sap-system"][0]}if(r.serviceUrl&&r.serviceUrl.charAt(0)!=="/"&&i.dataSource&&i.dataSource.uri){var s=i.dataSource.uri;if(r["sap-system"]){if(s.charAt(s.length-1)==="/"){s=s.slice(0,s.length-1)}s+=";o="+r["sap-system"]}if(s.charAt(s.length-1)!=="/"){s+="/"}s+=r.serviceUrl;r.serviceUrl=s}return e.create({viewName:"sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",viewData:{properties:i,configuration:r}}).then(function(e){this._oController=e.getController();this._oController.visibleHandler(this.bIsVisible);return e}.bind(this))},tileSetVisualProperties:function(e){if(this._oController){this._oController.updateVisualPropertiesHandler(e)}},tileRefresh:function(){if(this._oController){this._oController.refreshHandler()}},tileSetVisible:function(e){if(this._oController){this._oController.visibleHandler(e)}else{this.bIsVisible=e}},tileSetEditMode:function(e){if(this._oController){this._oController.editModeHandler(e)}},tileSetSizeBehavior:function(e){if(this._oController){this._oController.sizeBehaviorHandler(e)}},tileSetPreview:function(e){if(this._oController){this._oController.previewHandler(e)}},exit:function(){this._oController=null}})});
},
	"sap/ushell/components/tiles/cdm/applauncherdynamic/DynamicTile.controller.js":function(){
// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ushell/components/tiles/utils","sap/ui/core/format/NumberFormat","sap/ushell/Config","sap/ushell/utils/WindowUtils","sap/ui/model/json/JSONModel","sap/m/library","sap/ushell/library","sap/base/Log","sap/base/util/merge","sap/ushell/utils/DynamicTileRequest","sap/ushell/utils","sap/ushell/utils/UrlParsing","sap/ushell/EventHub"],function(e,t,r,i,a,o,s,n,l,u,p,f,d,c){"use strict";var h=s.GenericTileScope;var m=s.DeviationIndicator;var g=s.ValueColor;var v=s.FrameType;var b=n.DisplayFormat;var y=n.AppType;var _="sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile";var D="<RESET>";var R={title:"",subtitle:"",icon:"",info:"",infoState:g.Neutral,targetURL:"",number_value:"...",number_unit:"",number_factor:"",number_state_arrow:m.None,number_value_state:g.Neutral};return e.extend(_,{_aDoables:[],timer:null,iLastTimeoutStart:0,oDataRequest:null,bShouldNotRefreshDataAfterInit:false,_getConfiguration:function(e){var t={};var r;t.configuration=e.configuration;t.properties=e.properties;t.properties.info=t.properties.info||R.info;t.properties.number_value=t.properties.preview?1234:R.number_value;t.properties.number_value_state=R.number_value_state;t.properties.number_state_arrow=R.number_state_arrow;t.properties.number_factor=R.number_factor;t.properties.number_unit=t.properties.numberUnit||R.number_unit;var a=t.configuration["sap-system"];var o=t.properties.targetURL;if(o&&a){if(d.isIntentUrl(o)){r=d.parseShellHash(o);if(!r.params){r.params={}}r.params["sap-system"]=a;o="#"+d.constructShellHash(r)}else{o+=(o.indexOf("?")<0?"?":"&")+"sap-system="+a}t.properties.targetURL=o}t.properties.configSizeBehavior=i.last("/core/home/sizeBehavior");t.properties.wrappingType=i.last("/core/home/wrappingType");switch(t.properties.displayFormat){case b.Flat:t.properties.frameType=v.OneByHalf;break;case b.FlatWide:t.properties.frameType=v.TwoByHalf;break;case b.StandardWide:t.properties.frameType=v.TwoByOne;break;default:{t.properties.frameType=v.OneByOne}}t.originalProperties=u({},e.properties);return t},onInit:function(){var e=this.getView();var t=new o;var r=e.getViewData();var a=r.properties;t.setData(this._getConfiguration(r));const s=i.last("/core/contentProviders/providerInfo/enabled");const n=i.last("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations");t.setProperty("/properties/showContentProviderInfoInTooltip",s);t.setProperty("/properties/showContentProviderInfoOnVisualizations",s&&n);if(s){this._aDoables.push(i.on("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations").do(function(e){t.setProperty("/properties/showContentProviderInfoOnVisualizations",e)}))}e.setModel(t);this._aDoables.push(i.on("/core/home/sizeBehavior").do(function(e){t.setProperty("/properties/configSizeBehavior",e)}));if(a.preview){this.previewHandler(true)}},refreshHandler:function(){this.loadData(0,true)},visibleHandler:function(e){if(e){if(!this.oDataRequest||this.timer===null){this.initRequestInterval()}}else{this.stopRequests()}},editModeHandler:function(e){var t=e?h.ActionMore:h.Display;this.getView().getModel().setProperty("/properties/scope",t)},sizeBehaviorHandler:function(e){this.getView().getModel().setProperty("/properties/customSizeBehavior",e)},previewHandler:function(e){var t=this.getView();var r=t.getModel();if(e){var i=t.getViewData();var a=u({},i,{properties:{preview:true}});var o=this._getConfiguration(a);var s=u({},o.properties,{customSizeBehavior:r.getProperty("/properties/customSizeBehavior"),configSizeBehavior:r.getProperty("/properties/configSizeBehavior")});r.setProperty("/properties",s);return}r.setProperty("/properties/preview",false)},updateVisualPropertiesHandler:function(e){var t=this.getView().getModel().getProperty("/properties");var r=this.getView().getModel().getProperty("/originalProperties");if(f.isDefined(e.title)){t.title=e.title;r.title=e.title}if(f.isDefined(e.subtitle)){t.subtitle=e.subtitle;r.subtitle=e.subtitle}if(f.isDefined(e.icon)){t.icon=e.icon;r.icon=e.icon}if(f.isDefined(e.targetURL)){t.targetURL=e.targetURL;r.targetURL=e.targetURL}if(f.isDefined(e.info)){t.info=e.info;r.info=e.info}this.getView().getModel().refresh()},stopRequests:function(){if(this.timer){clearTimeout(this.timer);this.timer=null}if(this.oDataRequest){this.oDataRequest.abort()}},onPress:function(e){if(e.getSource().getScope&&e.getSource().getScope()===h.Display){var t=this.getView().getModel().getProperty("/properties/targetURL");var r=this.getView().getModel().getProperty("/properties/title");if(!t){return}c.emit("UITracer.trace",{reason:"LaunchApp",source:"Tile",data:{targetUrl:t}});if(t[0]==="#"){hasher.setHash(t)}else{var o=i.last("/core/shell/enableRecentActivity")&&i.last("/core/shell/enableRecentActivityLogging");if(o){var s={title:r,appType:y.URL,url:t,appId:t};sap.ushell.Container.getRendererInternal("fiori2").logRecentActivity(s)}a.openURL(t,"_blank")}}},initRequestInterval:function(){var e=this.getView().getModel();var t=e.getProperty("/configuration/serviceRefreshInterval");if(!t||t==="0"){t=0;if(this.oDataRequest){this.bShouldNotRefreshDataAfterInit=true}}else if(t<10){var r=e.getProperty("/configuration/serviceUrl");l.warning("Refresh Interval "+t+" seconds for service URL "+r+" is less than 10 seconds, which is not supported. Increased to 10 seconds automatically.",null,_);t=10}this.loadData(t,false)},loadData:function(e,t){if(!t&&this.bShouldNotRefreshDataAfterInit){return}var r=this.getView().getModel();var i=r.getProperty("/properties/preview");var a=r.getProperty("/configuration/serviceUrl");if(i){l.info("Tile in preview mode",_);return}if(!a){l.error("No service URL given!",_);this._setTileIntoErrorState();return}var o=e*1e3-(Date.now()-this.iLastTimeoutStart);if(!t&&!this.timer&&o>0){l.info("Started timeout to call "+a+" again in "+Math.ceil(o/1e3)+" seconds",null,_);this.timer=setTimeout(this.loadData.bind(this,e,false),f.sanitizeTimeoutDelay(o));return}if(!this.oDataRequest||this.oDataRequest.sUrl!==a){if(this.oDataRequest){this.oDataRequest.destroy()}var s=r.getProperty("/properties/contentProviderId");var n={dataSource:r.getProperty("/properties/dataSource")};this.oDataRequest=new p(a,this.successHandlerFn.bind(this),this.errorHandlerFn.bind(this),s,n)}else if(this.oDataRequest){this.oDataRequest.refresh()}if(e>0){l.info("Started timeout to call "+a+" again in "+e+" seconds",null,_);this.iLastTimeoutStart=Date.now();this.timer=setTimeout(this.loadData.bind(this,e,false),f.sanitizeTimeoutDelay(e*1e3))}},successHandlerFn:function(e){this.updatePropertiesHandler(e)},errorHandlerFn:function(e){var t=e&&e.message?e.message:e;var r=this.getView().getModel().getProperty("/configuration/serviceUrl");if(e.statusText==="Abort"||e.aborted===true){l.info("Data request from service "+r+" was aborted",null,_);this.bShouldNotRefreshDataAfterInit=false}else{if(e.response){t+=" - "+e.response.statusCode+" "+e.response.statusText}l.error("Failed to update data via service "+r+": "+t,null,_);this._setTileIntoErrorState()}},_setTileIntoErrorState:function(){var e=t.getResourceBundleModel().getResourceBundle();this.updatePropertiesHandler({number:"???",info:e.getText("dynamic_data.error")})},_normalizeNumber:function(e,t,i,a){var o;if(isNaN(e)){o=e}else{var s=r.getFloatInstance({maxFractionDigits:a});if(!i){var n=Math.abs(e);if(n>=1e9){i="B";e/=1e9}else if(n>=1e6){i="M";e/=1e6}else if(n>=1e3){i="K";e/=1e3}}o=s.format(e)}var l=o;var u=l[t-1];t-=u==="."||u===","?1:0;l=l.substring(0,t);return{displayNumber:l,numberFactor:i}},updatePropertiesHandler:function(e){var t=this.getView().getModel().getProperty("/originalProperties");var a=this.getView().getModel().getProperty("/properties");var o=[{dataField:"title",modelField:"title"},{dataField:"subtitle",modelField:"subtitle"},{dataField:"icon",modelField:"icon"},{dataField:"info",modelField:"info"},{dataField:"infoState",modelField:"infoState"},{dataField:"targetURL",modelField:"targetURL"},{dataField:"stateArrow",modelField:"number_state_arrow"},{dataField:"numberState",modelField:"number_value_state"},{dataField:"numberUnit",modelField:"number_unit"},{dataField:"numberFactor",modelField:"number_factor"}];o.forEach(function(r){var i=e[r.dataField];var o=!i;var s=R[r.modelField];if(o){a[r.modelField]=t[r.modelField]||s}else if(this._isResetValue(i)){a[r.modelField]=s}else{a[r.modelField]=i}}.bind(this));a.number_value=!isNaN(e.number)?e.number:R.number_value;a.number_digits=e.numberDigits>=0?e.numberDigits:4;var s=[];if(e.targetParams){s.push(e.targetParams)}if(e.results){var n;var l;var u=0;e.results.forEach(function(e){l=e.number||0;if(typeof l==="string"){l=parseFloat(l)}u+=l;n=e.targetParams;if(n){s.push(n)}});a.number_value=u}if(s.length>0){var p=a.targetURL.indexOf("?")!==-1?"&":"?";a.targetURL+=p+s.join("&")}if(!isNaN(e.number)){if(typeof e.number==="string"){e.number=e.number.trim()}var f=this._shouldProcessDigits(e.number,e.numberDigits);var d=a.icon?4:5;if(e.number&&e.number.toString().length>=d||f){var c=this._normalizeNumber(e.number,d,e.numberFactor,e.numberDigits);a.number_factor=c.numberFactor;a.number_value=c.displayNumber}else{var h=r.getFloatInstance({maxFractionDigits:d});a.number_value=h.format(e.number)}}a.configSizeBehavior=i.last("/core/home/sizeBehavior");this.getView().getModel().refresh()},_shouldProcessDigits:function(e,t){var r;e=typeof e!=="string"?e.toString():e;if(e.indexOf(".")!==-1){r=e.split(".")[1].length;if(r>t){return true}}return false},_getLeanUrl:function(e){return a.getLeanURL(e)},_formatValueColor:function(e){if(e==="Positive"){return g.Good}if(e==="Negative"){return g.Error}return g[e]||g.Neutral},_getValueColor:function(e){var t=this._formatValueColor(e);if(t===g.Neutral){return g.None}return t},_isResetValue:function(e){if(typeof e!=="string"){return false}return e===D},onExit:function(){if(this.oDataRequest){this.stopRequests();this.oDataRequest.destroy()}this._aDoables.forEach(function(e){e.off()});this._aDoables=[]}})},true);
},
	"sap/ushell/components/tiles/cdm/applauncherdynamic/DynamicTile.view.js":function(){
// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/View","sap/m/GenericTile","sap/m/TileContent","sap/m/NumericContent","sap/m/library"],function(e,t,r,i,o){"use strict";var n=o.ValueColor;return e.extend("sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",{getControllerName:function(){return"sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile"},createContent:function(e){this.setHeight("100%");this.setWidth("100%");if(this.getContent().length===1){return this.getContent()[0]}return new t({header:"{/properties/title}",scope:"{/properties/scope}",subheader:"{/properties/subtitle}",sizeBehavior:"{= ${/properties/customSizeBehavior} || ${/properties/configSizeBehavior}}",frameType:"{/properties/frameType}",wrappingType:"{/properties/wrappingType}",url:{parts:["/properties/targetURL"],formatter:e.formatters&&e.formatters.leanURL},tileContent:new r({footer:"{/properties/info}",footerColor:{path:"/properties/infoState",formatter:function(e){if(e==="Positive"){e=n.Good}if(e==="Negative"){e=n.Error}if(!n[e]){e=n.Neutral}return e}},unit:"{/properties/number_unit}",content:new i({truncateValueTo:5,scale:"{/properties/number_factor}",value:"{/properties/number_value}",indicator:"{/properties/number_state_arrow}",valueColor:{path:"/properties/number_value_state",formatter:function(e){if(!e||e==="Neutral"||!n[e]){return n.None}return e}},icon:"{/properties/icon}",withMargin:false,width:"100%"})}),additionalTooltip:"{/properties/contentProviderLabel}",press:[e.onPress,e]})}})});
},
	"sap/ushell/components/tiles/cdm/applauncherdynamic/DynamicTile.view.xml":'<mvc:View\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"\n    controllerName="sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile"\n    height="100%"\n    width="100%"><GenericTile\n        additionalTooltip="{= ${/properties/showContentProviderInfoInTooltip} ? ${/properties/contentProviderLabel} : \'\'}"\n        systemInfo="{= ${/properties/showContentProviderInfoOnVisualizations} ? ${/properties/contentProviderLabel} : \'\'}"\n        frameType="{/properties/frameType}"\n        header="{/properties/title}"\n        scope="{/properties/scope}"\n        sizeBehavior="{= ${/properties/customSizeBehavior} || ${/properties/configSizeBehavior}}"\n        subheader="{/properties/subtitle}"\n        url="{\n            path: \'/properties/targetURL\',\n            formatter: \'._getLeanUrl\'\n        }"\n        wrappingType="{/properties/wrappingType}"\n        press=".onPress"><TileContent\n            id="numericTileContent"\n            footer="{/properties/info}"\n            footerColor="{\n                path: \'/properties/infoState\',\n                formatter: \'._formatValueColor\'\n            }"\n            unit="{/properties/number_unit}"><NumericContent\n                icon="{/properties/icon}"\n                indicator="{/properties/number_state_arrow}"\n                scale="{/properties/number_factor}"\n                truncateValueTo="5"\n                value="{/properties/number_value}"\n                valueColor="{\n                    path: \'/properties/number_value_state\',\n                    formatter: \'._getValueColor\'\n                }"\n                withMargin="false"\n                width="100%" /></TileContent></GenericTile></mvc:View>\n',
	"sap/ushell/components/tiles/cdm/applauncherdynamic/manifest.json":'{"_version":"1.21.0","sap.flp":{"type":"tile","tileSize":"1x1","vizOptions":{"displayFormats":{"supported":["standard","standardWide","compact","flat","flatWide"],"default":"standard"}}},"sap.app":{"id":"sap.ushell.components.tiles.cdm.applauncherdynamic","_version":"1.0.0","type":"component","applicationVersion":{"version":"1.0.0"},"title":"","description":"","tags":{"keywords":[]},"ach":"CA-FLP-FE-COR"},"sap.ui":{"_version":"1.1.0","icons":{"icon":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_belize","sap_belize_plus"]},"sap.ui5":{"_version":"1.1.0","componentName":"sap.ushell.components.tiles.cdm.applauncherdynamic","dependencies":{"minUI5Version":"1.42","libs":{"sap.m":{}}},"rootView":{"viewName":"sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile","type":"JS"},"handleValidation":false}}'
});
//# sourceMappingURL=Component-preload.js.map
