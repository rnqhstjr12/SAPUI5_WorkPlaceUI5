/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BaseListContent","./ListContentRenderer","sap/ui/util/openWindow","sap/m/library","sap/m/List","sap/f/cards/loading/ListPlaceholder","sap/ui/integration/controls/ObjectStatus","sap/ui/integration/library","sap/ui/integration/util/BindingHelper","sap/ui/integration/util/BindingResolver","sap/ui/integration/controls/Microchart","sap/ui/integration/controls/MicrochartLegend","sap/ui/integration/controls/ListContentItem","sap/ui/integration/controls/ActionsStrip","sap/ui/integration/cards/list/MicrochartsResizeHelper"],function(t,i,e,o,n,s,r,a,c,h,l,p,g,u,d){"use strict";var f=o.AvatarColor;var m=o.ListType;var I=o.ListSeparators;var y=a.CardActionArea;var _=o.EmptyIndicatorMode;var v="_legendColorsLoad";var b=t.extend("sap.ui.integration.cards.ListContent",{metadata:{library:"sap.ui.integration",aggregations:{_legend:{multiple:false,visibility:"hidden"}}},renderer:i});b.prototype.onBeforeRendering=function(){t.prototype.onBeforeRendering.apply(this,arguments);this._getList().setBackgroundDesign(this.getDesign())};b.prototype.exit=function(){t.prototype.exit.apply(this,arguments);if(this._oItemTemplate){this._oItemTemplate.destroy();this._oItemTemplate=null}if(this._oMicrochartsResizeHelper){this._oMicrochartsResizeHelper.destroy();this._oMicrochartsResizeHelper=null}};b.prototype.createLoadingPlaceholder=function(t){var e=this.getCardInstance(),o=e.getContentMinItems(t);const n=h.resolveValue(t.item,this);const r=g.getPlaceholderInfo(n);return new s({minItems:o!==null?o:2,hasIcon:r.hasIcon,attributesLength:r.attributesLength,hasChart:r.hasChart,hasActionsStrip:r.hasActionsStrip,hasDescription:r.hasDescription,itemHeight:i.getItemMinHeight(t,this)+"rem"})};b.prototype.loadDependencies=function(t){if(!this.isSkeleton()&&t.get("/sap.card/content/item/chart")){return l.loadDependencies()}return Promise.resolve()};b.prototype.applyConfiguration=function(){t.prototype.applyConfiguration.apply(this,arguments);var i=this.getParsedConfiguration();if(!i){return}if(i.items){this._setStaticItems(i.items);return}if(i.item){this._setItem(i)}};b.prototype.getStaticConfiguration=function(){var t=this.getInnerList().getItems(),i=this.getParsedConfiguration(),e=t[0]&&t[0].isA("sap.m.GroupHeaderListItem"),o=[],n=[],s;t.forEach(function(t){if(t.isA("sap.m.GroupHeaderListItem")){if(s){n.push(s)}o=[];s={title:t.getTitle(),items:o}}else{var e=h.resolveValue(i.item,this,t.getBindingContext().getPath());if(e.icon&&e.icon.src){e.icon.src=this._oIconFormatter.formatSrc(e.icon.src)}o.push(e)}}.bind(this));if(s){n.push(s)}var r={};if(e){r.groups=n}else{r.groups=[{items:o}]}return r};b.prototype.getItemsLength=function(){return this._getList().getItems().filter(t=>!t.isA("sap.m.GroupHeaderListItem")).length};b.prototype.onDataChanged=function(){t.prototype.onDataChanged.apply(this,arguments);this._checkHiddenNavigationItems(this.getParsedConfiguration().item);this._getList().getItems().forEach(t=>{if(t.getActionsStrip&&t.getActionsStrip()){t.getActionsStrip().onDataChanged()}})};b.prototype._getList=function(){if(this._bIsBeingDestroyed){return null}if(!this._oList){this._oList=new n({id:this.getId()+"-list",growing:false,showNoData:false,ariaLabelledBy:this.getHeaderTitleId(),updateFinished:function(){if(this._iVisibleItems){var t=this._oList.getItems();for(var i=this._iVisibleItems+1;i<t.length;i++){t[i].setVisible(false)}}}.bind(this)});this._oList.onItemFocusIn=function(t,i){this._oList._handleStickyItemFocus(t.getDomRef())}.bind(this);this._oList.addEventDelegate({onfocusin:function(t){if(!(t.srcControl instanceof g)){return}var i=t.target.getBoundingClientRect().bottom;var e=this.getDomRef().getBoundingClientRect().bottom;var o=Math.abs(i-e);var n=10;if(o<n){t.srcControl.addStyleClass("sapUiIntLCIRoundedCorners")}}},this);this.setAggregation("_content",this._oList)}return this._oList};b.prototype._setItem=function(t){var i=t.item,e=this._getList(),o=this.isSkeleton(),n,s={title:i.title&&(i.title.value||i.title),description:i.description&&(i.description.value||i.description),descriptionVisible:i.description?i.description.visible:undefined,highlight:i.highlight,highlightText:i.highlightText,info:i.info&&i.info.value,infoState:i.info&&i.info.state,infoVisible:i.info&&i.info.visible,showInfoStateIcon:i.info&&i.info.showStateIcon,customInfoStatusIcon:i.info&&i.info.customStateIcon,attributes:[]};if(i.icon){s.icon=c.formattedProperty(i.icon.src,function(t){return this._oIconFormatter.formatSrc(t)}.bind(this));s.iconAlt=i.icon.alt;s.iconDisplayShape=i.icon.shape;s.iconInitials=i.icon.initials||i.icon.text;s.iconVisible=i.icon.visible;if(i.icon.size){s.iconSize=i.icon.size}s.iconBackgroundColor=i.icon.backgroundColor||(s.iconInitials?undefined:f.Transparent)}if(i.attributesLayoutType){s.attributesLayoutType=i.attributesLayoutType}if(i.attributes){i.attributes.forEach(function(t){n=new r({text:t.value,state:t.state,emptyIndicatorMode:_.On,visible:t.visible,showStateIcon:t.showStateIcon,icon:t.customStateIcon});s.attributes.push(n)})}if(!o){if(i.chart){s.microchart=this._createChartAndAddLegend(i.chart)}if(i.actionsStrip){s.actionsStrip=u.create(i.actionsStrip,this.getCardInstance());e.setShowSeparators(I.All)}else{e.setShowSeparators(I.None)}}this._oItemTemplate=new g(s);this._oActions.attach({area:y.ContentItem,actions:i.actions,control:this,actionControl:this._oItemTemplate,enabledPropertyName:"type",enabledPropertyValue:m.Active,disabledPropertyValue:m.Inactive});var a=t.group;if(a){this._oSorter=this._getGroupSorter(a)}var h={template:this._oItemTemplate,sorter:this._oSorter};this._bindAggregationToControl("items",e,h)};b.prototype._createChartAndAddLegend=function(t){var i=l.create(t);this.destroyAggregation("_legend");if(t.type==="StackedBar"){var e=new p({chart:i.getChart(),colorsLoad:function(){this.fireEvent(v)}.bind(this),visible:t.visible});e.initItemsTitles(t.bars,this.getBindingContext().getPath());this.setAggregation("_legend",e);this.awaitEvent(v)}this._oMicrochartsResizeHelper=new d(this._oList);return i};b.prototype._setStaticItems=function(t){var i=this._getList();t.forEach(function(t){var o=new g({title:t.title?t.title:"",description:t.description?t.description:"",icon:t.icon?t.icon:"",infoState:t.infoState?t.infoState:"None",info:t.info?t.info:"",highlight:t.highlight?t.highlight:"None",highlightText:t.highlightText?t.highlightText:""});if(t.action){o.setType("Navigation");if(t.action.url){o.attachPress(function(){e(t.action.url,t.target||"_blank")})}}i.addItem(o)});this.fireEvent("_actionContentReady")};b.prototype.getInnerList=function(){return this._getList()};return b});
//# sourceMappingURL=ListContent.js.map