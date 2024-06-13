/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/i18n/Localization","sap/ui/core/ControlBehavior","sap/ui/core/RenderManager","sap/ui/events/KeyCodes","sap/ui/Device","sap/ui/core/Control","sap/ui/core/Element","sap/ui/core/InvisibleText","sap/ui/core/LabelEnablement","sap/ui/core/delegate/ItemNavigation","./library","sap/ui/core/library","./InstanceManager","./GrowingEnablement","./GroupHeaderListItem","./ListItemBase","./ListBaseRenderer","sap/base/strings/capitalize","sap/ui/thirdparty/jquery","sap/base/Log","sap/ui/core/InvisibleMessage","sap/m/table/Util","sap/ui/core/Lib","sap/ui/dom/jquery/Selectors","sap/ui/dom/jquery/Aria"],function(e,t,i,s,o,n,r,a,l,u,h,p,d,g,c,f,m,v,jQuery,y,I,_,S){"use strict";var b=h.ListType;var w=h.ListGrowingDirection;var T=h.SwipeDirection;var C=h.ListSeparators;var B=h.ListMode;var R=h.ListHeaderDesign;var D=h.Sticky;var M=h.MultiSelectMode;var x=p.TitleLevel;var L=n.extend("sap.m.ListBase",{metadata:{library:"sap.m",dnd:true,properties:{inset:{type:"boolean",group:"Appearance",defaultValue:false},headerText:{type:"string",group:"Misc",defaultValue:null},headerLevel:{type:"sap.ui.core.TitleLevel",group:"Misc",defaultValue:x.Auto},headerDesign:{type:"sap.m.ListHeaderDesign",group:"Appearance",defaultValue:R.Standard,deprecated:true},footerText:{type:"string",group:"Misc",defaultValue:null},mode:{type:"sap.m.ListMode",group:"Behavior",defaultValue:B.None},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"},includeItemInSelection:{type:"boolean",group:"Behavior",defaultValue:false},showUnread:{type:"boolean",group:"Misc",defaultValue:false},noDataText:{type:"string",group:"Misc",defaultValue:null},showNoData:{type:"boolean",group:"Misc",defaultValue:true},enableBusyIndicator:{type:"boolean",group:"Behavior",defaultValue:true},modeAnimationOn:{type:"boolean",group:"Misc",defaultValue:true},showSeparators:{type:"sap.m.ListSeparators",group:"Appearance",defaultValue:C.All},swipeDirection:{type:"sap.m.SwipeDirection",group:"Misc",defaultValue:T.Both},growing:{type:"boolean",group:"Behavior",defaultValue:false},growingThreshold:{type:"int",group:"Misc",defaultValue:20},growingTriggerText:{type:"string",group:"Appearance",defaultValue:null},growingScrollToLoad:{type:"boolean",group:"Behavior",defaultValue:false},growingDirection:{type:"sap.m.ListGrowingDirection",group:"Behavior",defaultValue:w.Downwards},rememberSelections:{type:"boolean",group:"Behavior",defaultValue:true},keyboardMode:{type:"sap.m.ListKeyboardMode",group:"Behavior",defaultValue:"Navigation"},sticky:{type:"sap.m.Sticky[]",group:"Appearance"},multiSelectMode:{type:"sap.m.MultiSelectMode",group:"Behavior",defaultValue:M.Default}},defaultAggregation:"items",aggregations:{items:{type:"sap.m.ListItemBase",multiple:true,singularName:"item",bindable:"bindable",selector:"#{id} .sapMListItems",dnd:true},swipeContent:{type:"sap.ui.core.Control",multiple:false},headerToolbar:{type:"sap.m.Toolbar",multiple:false},infoToolbar:{type:"sap.m.Toolbar",multiple:false},contextMenu:{type:"sap.ui.core.IContextMenu",multiple:false},_messageStrip:{type:"sap.m.MessageStrip",multiple:false,visibility:"hidden"},noData:{type:"sap.ui.core.Control",multiple:false,altTypes:["string"]}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{select:{deprecated:true,parameters:{listItem:{type:"sap.m.ListItemBase"}}},selectionChange:{parameters:{listItem:{type:"sap.m.ListItemBase"},listItems:{type:"sap.m.ListItemBase[]"},selected:{type:"boolean"},selectAll:{type:"boolean"}}},delete:{parameters:{listItem:{type:"sap.m.ListItemBase"}}},swipe:{allowPreventDefault:true,parameters:{listItem:{type:"sap.m.ListItemBase"},swipeContent:{type:"sap.ui.core.Control"},srcControl:{type:"sap.ui.core.Control"},swipeDirection:{type:"sap.m.SwipeDirection"}}},growingStarted:{deprecated:true,parameters:{actual:{type:"int"},total:{type:"int"}}},growingFinished:{deprecated:true,parameters:{actual:{type:"int"},total:{type:"int"}}},updateStarted:{parameters:{reason:{type:"string"},actual:{type:"int"},total:{type:"int"}}},updateFinished:{parameters:{reason:{type:"string"},actual:{type:"int"},total:{type:"int"}}},itemPress:{parameters:{listItem:{type:"sap.m.ListItemBase"},srcControl:{type:"sap.ui.core.Control"}}},beforeOpenContextMenu:{allowPreventDefault:true,parameters:{listItem:{type:"sap.m.ListItemBase"}}}},designtime:"sap/m/designtime/ListBase.designtime"},renderer:m});L.prototype.bAnnounceDetails=true;L.getInvisibleText=function(){if(!this.oInvisibleText){this.oInvisibleText=(new a).toStatic()}return this.oInvisibleText};L.prototype.sNavItemClass="sapMLIB";L.prototype.init=function(){this._aNavSections=[];this._aSelectedPaths=[];this._iItemNeedsHighlight=0;this._iItemNeedsNavigated=0;this._bItemsBeingBound=false;this._bSkippedInvalidationOnRebind=false;this.data("sap-ui-fastnavgroup","true",true)};L.prototype.onBeforeRendering=function(){this._bRendering=true;this._bActiveItem=false;this._aNavSections=[];this._removeSwipeContent()};L.prototype.onAfterRendering=function(){this._bRendering=false;this._sLastMode=this.getMode();this._startItemNavigation(true)};L.prototype.exit=function(){this._aNavSections=[];this._aSelectedPaths=[];this._destroyGrowingDelegate();this._destroyItemNavigation()};L.prototype.refreshItems=function(e){this._bRefreshItems=true;if(this._oGrowingDelegate){this._oGrowingDelegate.refreshItems(e)}else{if(!this._bReceivingData){this._updateStarted(e);this._bReceivingData=true}this.refreshAggregation("items")}};L.prototype.updateItems=function(e,t){if(t&&t.detailedReason==="AddVirtualContext"){A(this);if(this._oGrowingDelegate){this._oGrowingDelegate.reset(true)}return}else if(t&&t.detailedReason==="RemoveVirtualContext"){N(this);return}if(this._bSkippedInvalidationOnRebind&&this.getBinding("items").getLength()===0){this.invalidate()}if(this._oGrowingDelegate){this._oGrowingDelegate.updateItems(e)}else{if(this._bReceivingData){this._bReceivingData=false}else{this._updateStarted(e)}this.updateAggregation("items");this._updateFinished()}this._bSkippedInvalidationOnRebind=false};function A(e){var t=e.getBinding("items");var i=e.getBindingInfo("items");var s=e.getGrowing()?e.getGrowingThreshold():i.length;var o=e.getGrowing()||!i.startIndex?0:i.startIndex;var n=t.getContexts(o,s)[0];N(e);e._oVirtualItem=g.createItem(n,i,"virtual");e.addAggregation("dependents",e._oVirtualItem,true)}function N(e){if(e._oVirtualItem){e._oVirtualItem.destroy();delete e._oVirtualItem}}L.prototype.setBindingContext=function(e,t){var i=(this.getBindingInfo("items")||{}).model;if(i===t){this._resetItemsBinding()}return n.prototype.setBindingContext.apply(this,arguments)};L.prototype.bindAggregation=function(e){this._bItemsBeingBound=e==="items";N(this);n.prototype.bindAggregation.apply(this,arguments);this._bItemsBeingBound=false;return this};L.prototype._bindAggregation=function(e,t){function i(e,t,i){e.events=e.events||{};if(!e.events[t]){e.events[t]=i}else{var s=e.events[t];e.events[t]=function(){i.apply(this,arguments);s.apply(this,arguments)}}}if(e==="items"){this._resetItemsBinding();i(t,"dataRequested",this._onBindingDataRequestedListener.bind(this));i(t,"dataReceived",this._onBindingDataReceivedListener.bind(this))}n.prototype._bindAggregation.call(this,e,t)};L.prototype._onBindingDataRequestedListener=function(e){this._showBusyIndicator();if(this._dataReceivedHandlerId!=null){clearTimeout(this._dataReceivedHandlerId);delete this._dataReceivedHandlerId}};L.prototype._onBindingDataReceivedListener=function(e){if(this._dataReceivedHandlerId!=null){clearTimeout(this._dataReceivedHandlerId);delete this._dataReceivedHandlerId}this._dataReceivedHandlerId=setTimeout(function(){this._hideBusyIndicator();delete this._dataReceivedHandlerId}.bind(this),0);if(this._oGrowingDelegate){this._oGrowingDelegate._onBindingDataReceivedListener(e)}};L.prototype.destroyItems=function(e){if(!this.getItems(true).length){return this}this.destroyAggregation("items","KeepDom");if(!e){if(this._bItemsBeingBound){this._bSkippedInvalidationOnRebind=true}else{this.invalidate()}}return this};L.prototype.getItems=function(e){if(e){return this.mAggregations["items"]||[]}return this.getAggregation("items",[])};L.prototype.getId=function(e){var t=this.sId;return e?t+"-"+e:t};L.prototype.setGrowing=function(e){e=!!e;if(this.getGrowing()!=e){this.setProperty("growing",e,!e);if(e){this._oGrowingDelegate=new g(this)}else if(this._oGrowingDelegate){this._oGrowingDelegate.destroy();this._oGrowingDelegate=null}}return this};L.prototype.setGrowingThreshold=function(e){return this.setProperty("growingThreshold",e,true)};L.prototype.setEnableBusyIndicator=function(e){this.setProperty("enableBusyIndicator",e,true);this._hideBusyIndicator();return this};L.prototype.setNoData=function(e){this.setAggregation("noData",e,true);if(typeof e==="string"){this.$("nodata-text").text(e)}else if(e){this.invalidate()}else if(!e){this.$("nodata-text").text(this.getNoDataText())}return this};L.prototype.setNoDataText=function(e){this.setProperty("noDataText",e,true);if(!this.getNoData()){this.$("nodata-text").text(this.getNoDataText())}return this};L.prototype.getNoDataText=function(e){if(e&&this._bBusy){return""}var t=this.getProperty("noDataText");t=t||S.getResourceBundleFor("sap.m").getText("LIST_NO_DATA");return t};L.prototype.getSelectedItem=function(){var e=this.getItems(true);for(var t=0;t<e.length;t++){if(e[t].getSelected()){return e[t]}}return null};L.prototype.setSelectedItem=function(e,t,i){if(this.indexOfItem(e)<0){y.warning("setSelectedItem is called without valid ListItem parameter on "+this);return this}if(this._bSelectionMode){e.setSelected(t===undefined?true:!!t);i&&this._fireSelectionChangeEvent([e])}return this};L.prototype.getSelectedItems=function(){return this.getItems(true).filter(function(e){return e.getSelected()})};L.prototype.setSelectedItemById=function(e,t){var i=r.getElementById(e);return this.setSelectedItem(i,t)};L.prototype.getSelectedContexts=function(e){const t=this.getBindingInfo("items");const i=t?.model;const s=this.getModel(i);if(!t||!s){return[]}if(e&&this.getRememberSelections()){if(s.isA("sap.ui.model.odata.v4.ODataModel")){const e=this.getBinding("items").getAllCurrentContexts?.()||[];return e.filter(e=>this._aSelectedPaths.includes(e.getPath()))}return this._aSelectedPaths.map(e=>s.getContext(e))}return this.getSelectedItems().map(e=>e.getBindingContext(i))};L.prototype.removeSelections=function(e,t,i){var s=[];this._oSelectedItem=null;if(e){this._aSelectedPaths=[];if(!i){const e=this.getBinding("items");const t=e?.getAllCurrentContexts?.()||[];t[0]?.setSelected&&t.forEach(e=>e.setSelected(false))}}this.getItems(true).forEach(function(t){if(!t.getSelected()){return}if(i&&t.isSelectedBoundTwoWay()){return}t.setSelected(false,true);s.push(t);!e&&this._updateSelectedPaths(t)},this);if(t&&s.length){this._fireSelectionChangeEvent(s)}return this};L.prototype.selectAll=function(e){if(this.getMode()!="MultiSelect"||this.getMultiSelectMode()==M.ClearAll){return this}var t=[];this.getItems(true).forEach(function(e){if(e.isSelectable()&&!e.getSelected()){e.setSelected(true,true);t.push(e);this._updateSelectedPaths(e)}},this);if(e&&t.length){this._fireSelectionChangeEvent(t,e)}var i=this.getItems().filter(function(e){return e.isSelectable()}).length;if(e&&this.getGrowing()&&this.getMultiSelectMode()==="SelectAll"&&this.getBinding("items").getLength()>i){var s=this._getSelectAllCheckbox?this._getSelectAllCheckbox():undefined;if(s){_.showSelectionLimitPopover(i,s)}}return this};L.prototype.getLastMode=function(e){return this._sLastMode};L.prototype.setMode=function(e){e=this.validateProperty("mode",e);var t=this.getMode();if(t==e){return this}this._bSelectionMode=e.indexOf("Select")>-1;if(!this._bSelectionMode){this.removeSelections(true)}else{var i=this.getSelectedItems();if(i.length>1){this.removeSelections(true)}else if(t===B.MultiSelect){this._oSelectedItem=i[0]}}return this.setProperty("mode",e)};L.prototype.getGrowingInfo=function(){return this._oGrowingDelegate?this._oGrowingDelegate.getInfo():null};L.prototype.setRememberSelections=function(e){this.setProperty("rememberSelections",e,true);!this.getRememberSelections()&&(this._aSelectedPaths=[]);return this};L.prototype.setSelectedContextPaths=function(e){this._aSelectedPaths=e||[]};L.prototype.getSelectedContextPaths=function(e){if(!e||e&&this.getRememberSelections()){return this._aSelectedPaths.slice(0)}return this.getSelectedItems().map(function(e){return e.getBindingContextPath()})};L.prototype.isAllSelectableSelected=function(){if(this.getMode()!=B.MultiSelect){return false}var e=this.getItems(true),t=this.getSelectedItems().length,i=e.filter(function(e){return e.isSelectable()}).length;return e.length>0&&t==i};L.prototype.getVisibleItems=function(){return this.getItems(true).filter(function(e){return e.getVisible()})};L.prototype.getActiveItem=function(){return this._bActiveItem};L.prototype.onItemDOMUpdate=function(e){if(!this._bRendering&&this.bOutput){this._startItemNavigation(true)}var t=this.getVisibleItems().length>0;if(!t&&!this._bInvalidatedForNoData){this.invalidate();this._bInvalidatedForNoData=true}else if(t&&this._bInvalidatedForNoData){this.invalidate();this._bInvalidatedForNoData=false}};L.prototype.onItemActiveChange=function(e,t){this._bActiveItem=t};L.prototype.onItemHighlightChange=function(e,t){this._iItemNeedsHighlight+=t?1:-1;if(this._iItemNeedsHighlight==1&&t){this.$("listUl").addClass("sapMListHighlight")}else if(this._iItemNeedsHighlight==0){this.$("listUl").removeClass("sapMListHighlight")}};L.prototype.onItemNavigatedChange=function(e,t){this._iItemNeedsNavigated+=t?1:-1;if(this._iItemNeedsNavigated==1&&t){this.$("listUl").addClass("sapMListNavigated")}else if(this._iItemNeedsNavigated==0){this.$("listUl").removeClass("sapMListNavigated")}};L.prototype.onItemSelectedChange=function(e,t){if(this.getMode()==B.MultiSelect){this._updateSelectedPaths(e,t);return}if(t){this._aSelectedPaths=[];this._oSelectedItem&&this._oSelectedItem.setSelected(false,true);this._oSelectedItem=e}else if(this._oSelectedItem===e){this._oSelectedItem=null}this._updateSelectedPaths(e,t)};L.prototype.onItemAfterSelectedChange=function(e,t){this.fireEvent("itemSelectedChange",{listItem:e,selected:t})};L.prototype.getItemsContainerDomRef=function(){return this.getDomRef("listUl")};L.prototype.getStickyFocusOffset=function(){return 0};L.prototype.checkGrowingFromScratch=function(){};L.prototype.onBeforePageLoaded=function(e,t){this._fireUpdateStarted(t,e);this.fireGrowingStarted(e)};L.prototype.onAfterPageLoaded=function(e,t){this._fireUpdateFinished(e);this.fireGrowingFinished(e)};L.prototype.addNavSection=function(e){this._aNavSections.push(e);return e};L.prototype.getMaxItemsCount=function(){var e=this.getBinding("items");if(e&&e.getLength){return e.getLength()||0}return this.getItems(true).length};L.prototype.shouldRenderItems=function(){return true};L.prototype.shouldGrowingSuppressInvalidation=function(){return true};L.prototype._resetItemsBinding=function(){if(this.isBound("items")){this._bUpdating=false;this._bReceivingData=false;this.removeSelections(true,false,true);this._oGrowingDelegate&&this._oGrowingDelegate.reset();this._hideBusyIndicator();if(this._oItemNavigation&&document.activeElement.id!=this.getId("nodata")){this._oItemNavigation.iFocusedIndex=-1}}};L.prototype._updateStarted=function(e){if(!this._bReceivingData&&!this._bUpdating){this._bUpdating=true;this._fireUpdateStarted(e)}};L.prototype._fireUpdateStarted=function(e,t){this._sUpdateReason=v(e||"Refresh");this.fireUpdateStarted({reason:this._sUpdateReason,actual:t?t.actual:this.getItems(true).length,total:t?t.total:this.getMaxItemsCount()})};L.prototype.onThemeChanged=function(){if(this._oGrowingDelegate){this._oGrowingDelegate._updateTrigger()}};L.prototype._updateFinished=function(){if(!this._bReceivingData&&this._bUpdating){this._fireUpdateFinished();this._bUpdating=false}};L.prototype._fireUpdateFinished=function(e){setTimeout(function(){this._bItemNavigationInvalidated=true;this.fireUpdateFinished({reason:this._sUpdateReason,actual:e?e.actual:this.getItems(true).length,total:e?e.total:this.getMaxItemsCount()})}.bind(this),0)};L.prototype._showBusyIndicator=function(){if(this.getEnableBusyIndicator()&&!this.getBusy()&&!this._bBusy){this._bBusy=true;this.setBusy(true,"listUl")}};L.prototype._hideBusyIndicator=function(){if(this._bBusy){this._bBusy=false;if(this.getEnableBusyIndicator()){this.setBusy(false,"listUl");const e=this.getNavigationRoot();if(document.activeElement==e){jQuery(e).trigger("focus")}}}};L.prototype.setBusy=function(e,t){if(this.getBusy()==e){return this}n.prototype.setBusy.apply(this,arguments);if(!e||!window.IntersectionObserver){clearTimeout(this._iBusyTimer);return this}this._iBusyTimer=setTimeout(function(){var e=this.getDomRef(t);var i=this.getDomRef("busyIndicator");var s=h.getScrollDelegate(this,true);if(!e||!i||!s){return}var o=new window.IntersectionObserver(function(e){o.disconnect();var t=e.pop();var s=t.intersectionRatio;if(s<=0||s>=1){return}var n=i.firstChild.style;if(t.intersectionRect.height>=t.rootBounds.height){n.position="sticky"}else{n.top=((t.boundingClientRect.top<0?1-s:0)+s/2)*100+"%"}},{root:s.getContainerDomRef()});o.observe(e)}.bind(this),this.getBusyIndicatorDelay());return this};L.prototype.onItemBindingContextSet=function(e){if(!this._bSelectionMode||!this.getRememberSelections()||!this.isBound("items")){return}if(e.isSelectedBoundTwoWay()){return}var t=e.getBindingContextPath();if(t){var i=this._aSelectedPaths.indexOf(t)>-1;e.setSelected(i)}};L.prototype.onItemRemoved=function(e){e._bGroupHeader=false;if(this._oLastGroupHeader==e){this._oLastGroupHeader=null}if(this._oSelectedItem==e){this._oSelectedItem=null}};L.prototype.onItemInserted=function(e,t){if(this._oLastGroupHeader&&!e.isGroupHeader()){this._oLastGroupHeader.setGroupedItem(e)}if(t){this.onItemSelectedChange(e,true)}if(!this._bSelectionMode||!this._aSelectedPaths.length||!this.getRememberSelections()||!this.isBound("items")||e.isSelectedBoundTwoWay()||e.getSelected()){return}var i=e.getBindingContextPath();if(i&&this._aSelectedPaths.indexOf(i)>-1){e.setSelected(true)}};L.prototype.onItemSelect=function(e,t){var i=this.getMode();if(this._mRangeSelection){if(!this._mRangeSelection.selected){this._fireSelectionChangeEvent([e]);this._mRangeSelection.index=this.getVisibleItems().indexOf(e);this._mRangeSelection.selected=t;return}if(!t){e.setSelected(true);return}var s=this.indexOfItem(e),o=this.getItems(),n,r,a=[],l;if(s<this._mRangeSelection.index){n=this._mRangeSelection.index-s;l=-1}else{n=s-this._mRangeSelection.index;l=1}for(var u=1;u<=n;u++){r=o[this._mRangeSelection.index+u*l];if(r.isSelectable()&&r.getVisible()&&!r.getSelected()){r.setSelected(true);a.push(r)}else if(r===e){a.push(r)}}this._fireSelectionChangeEvent(a);return}if(i===B.MultiSelect||this._bSelectionMode&&t){this._fireSelectionChangeEvent([e]);if(this.getAriaRole()==="list"&&document.activeElement===e.getDomRef()){var h=S.getResourceBundleFor("sap.m");I.getInstance().announce(t?h.getText("LIST_ITEM_SELECTED"):h.getText("LIST_ITEM_NOT_SELECTED"),"Assertive")}}};L.prototype._fireSelectionChangeEvent=function(e,t){var i=e&&e[0];if(!i){return}this.fireSelectionChange({listItem:i,listItems:e,selected:i.getSelected(),selectAll:!!t});if(this.getGrowing()){this._bSelectAll=t}this.fireSelect({listItem:i})};L.prototype.onItemDelete=function(e){this.fireDelete({listItem:e})};L.prototype.onItemPress=function(e,t){if(e.getType()==b.Inactive){return}setTimeout(function(){this.fireItemPress({listItem:e,srcControl:t})}.bind(this),0)};L.prototype.onItemKeyDown=function(e,t){if(!t.shiftKey||t.ctrlKey||t.altKey||t.metaKey||t.code=="Tab"||this.getMode()!==B.MultiSelect||!e.isSelectable()||t.which===s.F6){if(this._mRangeSelection){this._mRangeSelection=null}return}var i=this.getVisibleItems(),o=i.some(function(e){return!!e.getSelected()});if(!o){return}if(!this._mRangeSelection){this._mRangeSelection={index:this.indexOfItem(e),selected:e.getSelected()}}};L.prototype.onItemKeyUp=function(e,t){if(t.which===s.SHIFT){this._mRangeSelection=null}};L.prototype._updateSelectedPaths=function(e,t){if(!this.getRememberSelections()||!this.isBound("items")){return}const i=this.getBindingInfo("items").model;const s=e.getBindingContext(i);const o=s?.getPath();if(!o){return}const n=this._aSelectedPaths.indexOf(o);t=t===undefined?e.getSelected():t;if(t){n<0&&this._aSelectedPaths.push(o)}else{n>-1&&this._aSelectedPaths.splice(n,1)}if(s.setSelected&&!s.isTransient()){s.setSelected(t)}};L.prototype._destroyGrowingDelegate=function(){if(this._oGrowingDelegate){this._oGrowingDelegate.destroy();this._oGrowingDelegate=null}};L.prototype._destroyItemNavigation=function(){if(this._oItemNavigation){this.removeEventDelegate(this._oItemNavigation);this._oItemNavigation.destroy();this._oItemNavigation=null}};L.prototype._getTouchBlocker=function(){return this.$().children()};L.prototype._getSwipeContainer=function(){if(!this._$swipeContainer){this._$swipeContainer=jQuery("<div>",{id:this.getId("swp"),class:"sapMListSwp"})}return this._$swipeContainer};L.prototype._setSwipePosition=function(){if(this._isSwipeActive){return this._getSwipeContainer().css("top",this._swipedItem.$().position().top)}};L.prototype._renderSwipeContent=function(){var e=this._swipedItem.$(),t=this._getSwipeContainer();this.$().prepend(t.css({top:e.position().top,height:e.outerHeight(true)}));if(this._bRerenderSwipeContent){this._bRerenderSwipeContent=false;var s=(new i).getInterface();s.render(this.getSwipeContent(),t.empty()[0]);s.destroy()}return this};L.prototype._swipeIn=function(){var e=this,t=e._getTouchBlocker(),i=e._getSwipeContainer();e._isSwipeActive=true;e._renderSwipeContent();d.addPopoverInstance(e);window.document.activeElement.blur();jQuery(window).on("resize.swp",function(){e._setSwipePosition()});t.css("pointer-events","none").on("touchstart.swp mousedown.swp",function(e){if(!i[0].firstChild.contains(e.target)){e.preventDefault();e.stopPropagation()}});i.on("webkitAnimationEnd animationend",function(){jQuery(this).off("webkitAnimationEnd animationend");i.css("opacity",1).trigger("focus");t.parent().on("touchend.swp touchcancel.swp mouseup.swp",function(t){if(!i[0].firstChild.contains(t.target)){e.swipeOut()}})}).removeClass("sapMListSwpOutAnim").addClass("sapMListSwpInAnim")};L.prototype._onSwipeOut=function(e){this._getSwipeContainer().css("opacity",0).remove();jQuery(window).off("resize.swp");this._getTouchBlocker().css("pointer-events","auto").off("touchstart.swp mousedown.swp");if(typeof e=="function"){e.call(this,this._swipedItem,this.getSwipeContent())}this._isSwipeActive=false;d.removePopoverInstance(this)};L.prototype.swipeOut=function(e){if(!this._isSwipeActive){return this}var t=this,i=this._getSwipeContainer();this._getTouchBlocker().parent().off("touchend.swp touchend.swp touchcancel.swp mouseup.swp");i.on("webkitAnimationEnd animationend",function(){jQuery(this).off("webkitAnimationEnd animationend");t._onSwipeOut(e)}).removeClass("sapMListSwpInAnim").addClass("sapMListSwpOutAnim");return this};L.prototype._removeSwipeContent=function(){if(this._isSwipeActive){this.swipeOut()._onSwipeOut()}};L.prototype.close=L.prototype._removeSwipeContent;L.prototype._onSwipe=function(e,t){var i=this.getSwipeContent(),s=e.srcControl;if(i&&s&&!this._isSwipeActive&&this!==s&&!this._eventHandledByControl&&o.support.touch){for(var n=s;n&&!(n instanceof f);n=n.oParent);if(n instanceof f){this._swipedItem=n;this.fireSwipe({listItem:this._swipedItem,swipeContent:i,srcControl:s,swipeDirection:t},true)&&this._swipeIn()}}};L.prototype.ontouchstart=function(e){this._eventHandledByControl=e.isMarked()};L.prototype.onswipeleft=function(t){var i=e.getRTL();var s=i?T.EndToBegin:T.BeginToEnd;var o=this.getSwipeDirection();if(o===T.LeftToRight){o=T.BeginToEnd}else if(o===T.RightToLeft){o=T.EndToBegin}if(o!=s){if(o==T.Both){o=i?T.BeginToEnd:T.EndToBegin}this._onSwipe(t,o)}};L.prototype.onswiperight=function(t){var i=e.getRTL();var s=i?T.BeginToEnd:T.EndToBegin;var o=this.getSwipeDirection();if(o===T.LeftToRight){o=T.BeginToEnd}else if(o===T.RightToLeft){o=T.EndToBegin}if(o!=s){if(o==T.Both){o=i?T.EndToBegin:T.BeginToEnd}this._onSwipe(t,o)}};L.prototype.setSwipeDirection=function(e){return this.setProperty("swipeDirection",e,true)};L.prototype.getSwipedItem=function(){return this._isSwipeActive?this._swipedItem:null};L.prototype.setSwipeContent=function(e){this._bRerenderSwipeContent=true;this.toggleStyleClass("sapMListSwipable",!!e);return this.setAggregation("swipeContent",e,!this._isSwipeActive)};L.prototype.invalidate=function(e){if(e&&e===this.getSwipeContent()){this._bRerenderSwipeContent=true;this._isSwipeActive&&this._renderSwipeContent();return}return n.prototype.invalidate.apply(this,arguments)};L.prototype.addItemGroup=function(e,t,i){if(!t){t=this.getGroupHeaderTemplate(e)}t._bGroupHeader=true;this.addAggregation("items",t,i);this.setLastGroupHeader(t);return t};L.prototype.getGroupHeaderTemplate=function(e){var t=new c;t.setTitle(e.text||e.key);return t};L.prototype.setLastGroupHeader=function(e){this._oLastGroupHeader=e};L.prototype.getLastGroupHeader=function(){return this._oLastGroupHeader};L.prototype.removeGroupHeaders=function(e){this.getItems(true).forEach(function(t){if(t.isGroupHeader()){t.destroy(e)}})};L.prototype.getAccessibilityType=function(){return S.getResourceBundleFor("sap.m").getText("ACC_CTR_TYPE_LIST")};L.prototype.getAccessibilityStates=function(){if(!this.getItems(true).length){return""}var e="",t=B,i=this.getMode(),s=S.getResourceBundleFor("sap.m");if(l.isRequired(this)){e+=s.getText("LIST_REQUIRED")+" "}if(i==t.Delete){e+=s.getText("LIST_DELETABLE")+" . "}else if(this.getAriaRole()=="list"){if(i==t.MultiSelect){e+=s.getText("LIST_MULTISELECTABLE")+" . "}else if(i!=t.None){e+=s.getText("LIST_SELECTABLE")+" . "}}if(this.isGrouped()){e+=s.getText("LIST_GROUPED")+" . "}return e};L.prototype.getAccessibilityInfo=function(){return{description:this.getAccessibilityStates().trim(),focusable:true}};L.prototype.getAccessbilityPosition=function(e){var t,i,s=this.getVisibleItems(),o=this.getAriaRole(),n=o==="list"||o==="listbox";if(n){s=s.filter(function(e){return!e.isGroupHeader()})}if(e){i=s.indexOf(e)+1}var r=this.getBinding("items");if(r&&this.getGrowing()&&this.getGrowingScrollToLoad()){t=r.getLength();if(!n&&r.isGrouped()){t+=s.filter(function(e){return e.isGroupHeader()}).length}}else{t=s.length}return{setsize:t,posinset:i}};L.prototype.onItemFocusIn=function(e,i,s){this._handleStickyItemFocus(e.getDomRef());if(e!==i||s.isMarked("contentAnnouncementGenerated")||!t.isAccessibilityEnabled()){return}var o=e.getDomRef();if(!e.getContentAnnouncement){this.getNavigationRoot().setAttribute("aria-activedescendant",o.id)}else{var n=e.getAccessibilityInfo(),r=S.getResourceBundleFor("sap.m"),a=n.type?n.type+" . ":"";if(this.isA("sap.m.Table")){var l=this.getAccessbilityPosition(e);a+=r.getText("LIST_ITEM_POSITION",[l.posinset,l.setsize])+" . "}a+=n.description;this.updateInvisibleText(a,o);return a}};L.prototype.onItemFocusOut=function(e){this.removeInvisibleTextAssociation(e.getDomRef())};L.prototype.removeInvisibleTextAssociation=function(e){const t=L.getInvisibleText(),i=jQuery(e||document.activeElement);i.removeAriaLabelledBy(t.getId())};L.prototype.updateInvisibleText=function(e,t,i){var s=L.getInvisibleText(),o=jQuery(t||document.activeElement);if(this.bAnnounceDetails){this.bAnnounceDetails=false;e=this.getAccessibilityInfo().description+" "+e}s.setText(e.trim());o.addAriaLabelledBy(s.getId(),i)};L.prototype.getNavigationRoot=function(){return this.getDomRef("listUl")};L.prototype.getFocusDomRef=function(){return this.getNavigationRoot()};L.prototype._startItemNavigation=function(e){var t=this.getDomRef();if(!o.system.desktop||!t){return}if(!this.getShowNoData()&&!this.getVisibleItems().length&&t){t.classList.add("sapMListPreventFocus");this._destroyItemNavigation();return}if(t){t.classList.remove("sapMListPreventFocus")}var i=this.getNavigationRoot();if(e&&i&&!i.contains(document.activeElement)){this._bItemNavigationInvalidated=true;i.tabIndex="0";return}if(!this._oItemNavigation){this._oItemNavigation=new u;this._oItemNavigation.setCycling(false);this.addDelegate(this._oItemNavigation);this._oItemNavigation.setTabIndex0(0);this._oItemNavigation.iActiveTabIndex=-1;this._oItemNavigation.setTableMode(true,true).setColumns(1);this._oItemNavigation.setDisabledModifiers({sapnext:["alt","meta","ctrl"],sapprevious:["alt","meta","ctrl"]})}this._oItemNavigation.setPageSize(this.getGrowingThreshold());this._oItemNavigation.setRootDomRef(i);this.setNavigationItems(this._oItemNavigation,i);this._bItemNavigationInvalidated=false;if(document.activeElement==i){jQuery(i).trigger("focus")}};L.prototype.setNavigationItems=function(e,t){var i=jQuery(t).children(".sapMLIB").get();e.setItemDomRefs(i);if(e.getFocusedIndex()==-1){if(this.getGrowing()&&this.getGrowingDirection()==w.Upwards){e.setFocusedIndex(i.length-1)}else{e.setFocusedIndex(0)}}};L.prototype.getItemNavigation=function(){return this._oItemNavigation};L.prototype.forwardTab=function(e){this._bIgnoreFocusIn=true;this.$(e?"after":"before").trigger("focus")};L.prototype.onsaptabnext=L.prototype.onsaptabprevious=function(e){if(e.isMarked()||e.target.id==this.getId("trigger")){return}if(e.target.matches(".sapMLIBFocusable,.sapMTblCellFocusable")||e.target===jQuery(this.getNavigationRoot()).find(":sapTabbable").get(e.type=="saptabnext"?-1:0)){this.forwardTab(e.type=="saptabnext");e.setMarked()}};L.prototype._navToSection=function(e){var t;var i=0;var s=e?1:-1;var o=this._aNavSections.length;this._aNavSections.some(function(e,t){var s=e?window.document.getElementById(e):null;if(s&&s.contains(document.activeElement)){i=t;return true}});var n=this.getItemsContainerDomRef();var r=jQuery(document.getElementById(this._aNavSections[i]));if(r[0]===n&&this._oItemNavigation){r.data("redirect",this._oItemNavigation.getFocusedIndex())}this._aNavSections.some(function(){i=(i+s+o)%o;t=jQuery(document.getElementById(this._aNavSections[i]));if(t[0]===n&&this._oItemNavigation){var e=t.data("redirect");var r=this._oItemNavigation.getItemDomRefs();var a=r[e]||n.children[0];t=jQuery(a)}if(t.is(":focusable")){t.trigger("focus");return true}},this);return t};L.prototype.onsapshow=function(e){if(e.isMarked()||e.which==s.F4||e.target.id!=this.getId("trigger")&&!jQuery(e.target).hasClass(this.sNavItemClass)){return}if(this._navToSection(true)){e.preventDefault();e.setMarked()}};L.prototype.onsaphide=function(e){if(e.isMarked()||e.target.id!=this.getId("trigger")&&!jQuery(e.target).hasClass(this.sNavItemClass)){return}if(this._navToSection(false)){e.preventDefault();e.setMarked()}};L.prototype.onkeydown=function(e){if(e.isMarked()){return}var t=jQuery(e.target);var i=t.closest(".sapMLIBFocusable").next(".sapMListTblSubRow").addBack();if(!i[0]){i=t.closest(".sapMListTblSubRow").prev(".sapMLIBFocusable").addBack()}if(!i[0]){return}var s=t.hasClass("sapMLIBFocusable");var o=function(){e.preventDefault();e.setMarked()};if(e.code=="KeyA"&&(e.metaKey||e.ctrlKey)&&s&&this.getMode()==B.MultiSelect){var n=this.getMultiSelectMode()==M.ClearAll;if(e.shiftKey){if(n){this.removeSelections(false,true)}}else if(!n){if(this.isAllSelectableSelected()){this.removeSelections(false,true)}else{this.selectAll(true)}}return o()}if((e.code=="Enter"||e.code=="F2")&&t.hasClass("sapMTblCellFocusable")){t.find(":sapTabbable").first().trigger("focus");return o()}if(e.code=="F2"&&s||e.code=="F7"&&s&&this._iFocusIndexOfItem==undefined){i.find(":sapTabbable").first().trigger("focus");return o()}if(e.code=="F2"&&!s){jQuery(t.closest(".sapMTblCellFocusable")[0]||i[0]).trigger("focus");return o()}if(e.code=="F7"){if(s){i.find(":sapFocusable").eq(this._iFocusIndexOfItem).trigger("focus")}else{this._iFocusIndexOfItem=i.find(":sapFocusable").index(t);i.eq(0).trigger("focus")}return o()}};L.prototype.onmousedown=function(e){if(this._bItemNavigationInvalidated){this._startItemNavigation()}if(e.shiftKey&&this._mRangeSelection&&e.srcControl.getId().includes("-selectMulti")){e.preventDefault()}};L.prototype.focusPrevious=function(){if(!this._oItemNavigation){return}var e=this._oItemNavigation.getItemDomRefs();var t=this._oItemNavigation.getFocusedIndex();var i=jQuery(e[t]);this.bAnnounceDetails=true;if(this.getKeyboardMode()=="Edit"){var s=i.find(":sapTabbable").first();s[0]?s.trigger("focus"):i.trigger("focus")}else{i.trigger("focus")}};L.prototype.onfocusin=function(e){if(this._bIgnoreFocusIn){this._bIgnoreFocusIn=false;e.stopImmediatePropagation(true);return}if(this._bItemNavigationInvalidated){this._startItemNavigation()}var t=e.target;if(t.id==this.getId("nodata")){var i=this.getNoData();var s=i||this.getNoDataText();if(i&&typeof i!=="string"){s=f.getAccessibilityText(i)}this.updateInvisibleText(s,t)}else if(t.id==this.getId("listUl")&&this.getKeyboardMode()=="Edit"){this.focusPrevious();e.stopImmediatePropagation(true);return}if(this._oItemNavigation&&!t.matches(".sapMLIBFocusable,.sapMTblCellFocusable")){var o=t.closest(".sapMLIBFocusable,.sapMTblCellFocusable");if(o){var n=this._oItemNavigation.getItemDomRefs().indexOf(o);if(n>=0){this._oItemNavigation.iFocusedIndex=this.getKeyboardMode()=="Edit"?n:n-n%this._oItemNavigation.iColumns}}}if(e.isMarked()||!this._oItemNavigation||t.id!=this.getId("after")){return}this.focusPrevious();e.setMarked()};L.prototype.onsapfocusleave=function(e){if(this._oItemNavigation&&!this.bAnnounceDetails&&!this.getNavigationRoot().contains(document.activeElement)){this.bAnnounceDetails=true}};L.prototype.onItemArrowUpDown=function(e,t){if(t.target instanceof HTMLTextAreaElement){return}var i=this.getVisibleItems(true),s=t.type=="sapup"||t.type=="sapupmodifiers"?-1:1,o=i.indexOf(e)+s,n=i[o];if(n&&n.isGroupHeader()){n=i[o+s]}if(!n){return}var r=n.getTabbables(),a=e.getTabbables().index(t.target),l=r.eq(r[a]?a:-1);l[0]?l.trigger("focus"):n.focus();l[0]&&l[0].select&&l[0].select();t.preventDefault();t.setMarked()};L.prototype.onItemContextMenu=function(e,t){var i=this.getContextMenu();if(!i){return}var s=this.fireBeforeOpenContextMenu({listItem:e,column:r.getElementById(jQuery(t.target).closest(".sapMListTblCell",this.getNavigationRoot()).attr("data-sap-ui-column"))});if(s){t.setMarked();t.preventDefault();var o,n=this.getBindingInfo("items");if(n){o=e.getBindingContext(n.model);i.setBindingContext(o,n.model)}i.openAsContextMenu(t,e)}};L.prototype.onItemUpDownModifiers=function(e,t,i){if(t.srcControl!=e){if(!t.shiftKey&&(t.metaKey||t.ctrlKey)){this.onItemArrowUpDown(e,t)}return}if(!this._mRangeSelection){return}var s=this.getVisibleItems(),o=s.indexOf(e),n=s[o+i];if(!n){if(this._mRangeSelection){this._mRangeSelection=null}t.setMarked();return}var r=n.getSelected();if(this._mRangeSelection.direction===undefined){this._mRangeSelection.direction=i}else if(this._mRangeSelection.direction!==i){if(this._mRangeSelection.index!==s.indexOf(e)){n=e;r=n.getSelected();if(this._mRangeSelection.selected&&r){this.setSelectedItem(n,false,true);return}}else{this._mRangeSelection.direction=i}}if(this._mRangeSelection.selected!==r&&n.isSelectable()){this.setSelectedItem(n,this._mRangeSelection.selected,true)}};L.prototype.isGrouped=function(){var e=this.getBinding("items");return e&&e.isGrouped()};L.prototype.setContextMenu=function(e){this.setAggregation("contextMenu",e,true);return this};L.prototype.destroyContextMenu=function(){this.destroyAggregation("contextMenu",true);return this};L.prototype.getStickyStyleValue=function(){var e=this.getSticky();if(!e||!e.length){this._iStickyValue=0;return this._iStickyValue}var t=0,i=this.getHeaderText(),s=this.getHeaderToolbar(),o=i||s&&s.getVisible(),n=this.getInfoToolbar(),r=n&&n.getVisible(),a=false;if(this.isA("sap.m.Table")){a=this.getColumns().some(function(e){return e.getVisible()&&e.getHeader()})}e.forEach(function(e){if(e===D.HeaderToolbar&&o){t+=1}else if(e===D.InfoToolbar&&r){t+=2}else if(e===D.ColumnHeaders&&a){t+=4}});this._iStickyValue=t;return this._iStickyValue};L.prototype._handleStickyItemFocus=function(e){if(!this._iStickyValue){return}var t=h.getScrollDelegate(this,true);if(!t){return}var i=0,s=0,o=0,n=0,r=0,a=0,l=this.getStickyFocusOffset();if(this._iStickyValue&4){var u=this.getDomRef("tblHeader").firstChild;var p=u.getBoundingClientRect();s=parseInt(p.bottom);i=parseInt(p.height)}if(this._iStickyValue&2){var d=this.getDomRef().querySelector(".sapMListInfoTBarContainer");if(d){var g=d.getBoundingClientRect();n=parseInt(g.bottom);o=parseInt(g.height)}}if(this._iStickyValue&1){var c=this.getDomRef().querySelector(".sapMListHdr");if(c){var f=c.getBoundingClientRect();a=parseInt(f.bottom);r=parseInt(f.height)}}var m=Math.round(e.getBoundingClientRect().top);if(s>m||n>m||a>m){window.requestAnimationFrame(function(){t.scrollToElement(e,0,[0,-i-o-r-l],true)})}};L.prototype.setHeaderToolbar=function(e){return this._setToolbar("headerToolbar",e)};L.prototype.setInfoToolbar=function(e){return this._setToolbar("infoToolbar",e)};L.prototype.scrollToIndex=function(e){return new Promise(function(t,i){var s,o;o=h.getScrollDelegate(this,true);if(!o){return i()}s=E(this,e);if(!s){return i()}setTimeout(function(){try{o.scrollToElement(s.getDomRef(),null,[0,this._getStickyAreaHeight()*-1],true);t()}catch(e){i(e)}}.bind(this),0)}.bind(this))};L.prototype.requestItems=function(e){if(e<=0||!this.getGrowing()||!this._oGrowingDelegate){throw new Error("The prerequisites to use 'requestItems' are not met. Please read the documentation for more details.")}if(e!=null){var t=this.getGrowingThreshold();this.setGrowingThreshold(e);this._oGrowingDelegate.requestNewPage();this.setGrowingThreshold(t)}else{this._oGrowingDelegate.requestNewPage()}};function E(e,t){var i=e.getVisibleItems();var s=i.length;if(typeof t!=="number"||t<-1){t=0}if(t>=s||t===-1){t=s-1}return i[t]}L.prototype._setFocus=function(e,t){return new Promise(function(i,s){var o=E(this,e);if(!o){return s()}if(t===true){var n=o.getTabbables(true);if(n.length){n[0].focus();return i()}}o.focus();return i()}.bind(this))};L.prototype._getStickyAreaHeight=function(){var e=this.getSticky();if(!(e&&e.length)){return 0}return e.reduce(function(e,t){var i,s;switch(t){case D.HeaderToolbar:i=this.getHeaderToolbar();s=i&&i.getDomRef()||this.getDomRef("header");break;case D.InfoToolbar:i=this.getInfoToolbar();s=i&&i.getDomRef();break;case D.ColumnHeaders:s=this.getDomRef("tblHeader");break;default:}return e+(s?s.offsetHeight:0)}.bind(this),0)};L.prototype._setToolbar=function(e,t){var i=this.getAggregation(e);if(i){i.detachEvent("_change",this._onToolbarPropertyChanged,this)}this.setAggregation(e,t);if(t){t.attachEvent("_change",this._onToolbarPropertyChanged,this)}return this};L.prototype._onToolbarPropertyChanged=function(e){if(e.getParameter("name")!=="visible"){return}var t=this._iStickyValue,i=this.getStickyStyleValue();if(t!==i){var s=this.getDomRef();if(s){var o=s.classList;o.toggle("sapMSticky",!!i);o.remove("sapMSticky"+t);o.toggle("sapMSticky"+i,!!i)}}};L.prototype.getAriaRole=function(){return"list"};return L});
//# sourceMappingURL=ListBase.js.map