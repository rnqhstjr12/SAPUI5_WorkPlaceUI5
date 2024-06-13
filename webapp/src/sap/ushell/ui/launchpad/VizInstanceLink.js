// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/library","sap/ushell/library","sap/m/GenericTile","sap/ushell/ui/launchpad/VizInstance","sap/ui/thirdparty/hasher","sap/ushell/Config","sap/ushell/utils/WindowUtils","sap/m/ActionSheet","sap/ushell/EventHub"],function(e,t,i,r,a,s,o,p,l){"use strict";var n=e.GenericTileMode;var h=e.GenericTileScope;var u=t.AppType;var c=t.DisplayFormat;var y=i.extend("sap.ushell.ui.launchpad.VizInstanceLink",{metadata:{library:"sap.ushell",properties:{title:{type:"string",defaultValue:"",group:"Appearance",bindable:true},subtitle:{type:"string",defaultValue:"",group:"Appearance",bindable:true},editable:{type:"boolean",defaultValue:false,group:"Behavior",bindable:true},removable:{type:"boolean",defaultValue:true,group:"Behavior",bindable:true},active:{type:"boolean",group:"Misc",defaultValue:false},targetURL:{type:"string",group:"Misc"},mode:{type:"sap.m.GenericTileMode",group:"Appearance",defaultValue:n.LineMode},displayFormat:{type:"sap.ushell.DisplayFormat",defaultValue:c.Compact},supportedDisplayFormats:{type:"sap.ushell.DisplayFormat[]",defaultValue:[c.Compact]},dataHelpId:{type:"string",defaultValue:""},vizRefId:{type:"string",defaultValue:""}},defaultAggregation:"tileActions",aggregations:{tileActions:{type:"sap.m.Button",forwarding:{getter:"_getTileActionSheet",aggregation:"buttons"}}},events:{beforeActionSheetOpen:{},afterActionSheetClose:{}}},renderer:i.getMetadata().getRenderer()});y.prototype.init=function(){i.prototype.init.apply(this,arguments);this.attachPress(this._handlePress,this)};y.prototype.exit=function(){if(this._oActionSheet){this._oActionSheet.destroy()}};y.prototype._getTileActionSheet=function(){if(!this._oActionSheet){this._oActionSheet=new p;this._oActionSheet.attachAfterClose(this.fireAfterActionSheetClose.bind(this))}return this._oActionSheet};y.prototype._handlePress=function(){if(this.getEditable()){if(!this._getTileActionSheet().isOpen()){this.fireBeforeActionSheetOpen()}this._getTileActionSheet().openBy(this);return}var e=this.getTargetURL();if(!e){return}l.emit("UITracer.trace",{reason:"LaunchApp",source:"Link",data:{targetUrl:e}});if(e[0]==="#"){a.setHash(e)}else{var t=s.last("/core/shell/enableRecentActivity")&&s.last("/core/shell/enableRecentActivityLogging");if(t){var i={title:this.getTitle(),appType:u.URL,url:this.getTargetURL(),appId:this.getTargetURL()};sap.ushell.Container.getRendererInternal("fiori2").logRecentActivity(i)}o.openURL(e,"_blank")}};y.prototype.load=r.prototype.load;y.prototype.setVizRefId=function(e){if(!this.getDataHelpId()){this.data("tile-id",e,true)}return this.setProperty("vizRefId",e)};y.prototype.setDataHelpId=function(e){this.data("help-id",e,true);this.data("tile-id",e,true);return this.setProperty("dataHelpId",e)};y.prototype.setTitle=function(e){this.setHeader(e);return this.setProperty("title",e)};y.prototype.setSubtitle=function(e){this.setSubheader(e);return this.setProperty("subtitle",e)};y.prototype.setTargetURL=function(e){this.setUrl(e);return this.setProperty("targetURL",e)};y.prototype.setProperty=function(e,t,r){if(e==="title"){this.setProperty("header",t,r)}if(e==="subtitle"){this.setProperty("subheader",t,r)}if(e==="targetURL"){this.setProperty("url",t,r)}if(e==="editable"){if(t&&this.getRemovable()){this.setProperty("scope",h.Actions,r)}else if(t){this.setProperty("scope",h.ActionMore,r)}else{this.setProperty("scope",h.Display,r)}}if(e==="removable"){var a=this.getEditable();if(t&&a){this.setProperty("scope",h.Actions,r)}else if(a){this.setProperty("scope",h.ActionMore,r)}else{this.setProperty("scope",h.Display,r)}}return i.prototype.setProperty.apply(this,arguments)};y.prototype.getAvailableDisplayFormats=r.prototype.getAvailableDisplayFormats;return y});
//# sourceMappingURL=VizInstanceLink.js.map