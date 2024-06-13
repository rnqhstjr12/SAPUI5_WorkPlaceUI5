/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element","sap/ui/core/library","./library","./ListItemBase","./ColumnListItemRenderer","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/Selectors"],function(t,e,n,o,i,jQuery){"use strict";var s=n.ListType;var r=e.VerticalAlign;var a=o.extend("sap.m.ColumnListItem",{metadata:{interfaces:["sap.m.ITableItem"],library:"sap.m",properties:{vAlign:{type:"sap.ui.core.VerticalAlign",group:"Appearance",defaultValue:r.Inherit}},defaultAggregation:"cells",aggregations:{cells:{type:"sap.ui.core.Control",multiple:true,singularName:"cell",bindable:"bindable"}}},renderer:i});var p=t.extend("sap.m.TablePopin",{ontap:function(t){if(t.isMarked()||o.detectTextSelection(this.getDomRef())){return t.stopImmediatePropagation(true)}if(t.srcControl===this||!jQuery(t.target).is(":sapFocusable")){this.getParent().focus()}}});a.prototype.TagName="tr";a.prototype.init=function(){o.prototype.init.call(this);this._bNeedsTypeColumn=false;this._aClonedHeaders=[]};a.prototype.onBeforeRendering=function(){o.prototype.onBeforeRendering.call(this);this.aAriaOwns=[];if(this._oPopin&&this._oDomRef){this.$Popin().off()}};a.prototype.onAfterRendering=function(){if(this._oPopin){this.$().attr("aria-owns",this.aAriaOwns.join(" "));this.isActionable(true)&&this.$Popin().on("mouseenter mouseleave",function(t){this.previousSibling.classList.toggle("sapMPopinHovered",t.type=="mouseenter")})}o.prototype.onAfterRendering.call(this);this._checkTypeColumn()};a.prototype.exit=function(){o.prototype.exit.call(this);this._checkTypeColumn(false);this._destroyClonedHeaders();if(this._oPopin){this._oPopin.destroy(true);this._oPopin=null}};a.prototype.setVisible=function(t){o.prototype.setVisible.call(this,t);if(!t&&this.hasPopin()){this.removePopin()}return this};a.prototype.getTable=function(){var t=this.getParent();if(t&&t.isA("sap.m.Table")){return t}};a.prototype.getPopin=function(){if(!this._oPopin){this._oPopin=new p({id:this.getId()+"-sub"}).addDelegate({ontouchstart:this.ontouchstart,ontouchmove:this.ontouchmove,ontap:this.ontap,ontouchend:this.ontouchend,ontouchcancel:this.ontouchcancel,onsapup:this.onsapup,onsapdown:this.onsapdown,oncontextmenu:this.oncontextmenu,onkeydown:this.onkeydown,onfocusin:this.onfocusin,onfocusout:this.onfocusout},this).setParent(this,null,true)}return this._oPopin};a.prototype.$Popin=function(){return this.$("sub")};a.prototype.hasPopin=function(){return this._oPopin};a.prototype.removePopin=function(){this._oPopin&&this.$Popin().remove()};a.prototype.getTabbables=function(t){const e=t?this.$().find(".sapMListTblCell"):this.$();return e.add(this.$Popin()).find(":sapTabbable")};a.prototype.getDropAreaRect=function(){var t=null;var e=this.getDomRef();var n=e.getBoundingClientRect().toJSON();if(this._oPopin&&(t=this.getDomRef("sub"))){var o=t.getBoundingClientRect();n.bottom=o.bottom;n.height+=o.height}return n};a.prototype.getAccessibilityType=function(t){return t.getText("ACC_CTR_TYPE_ROW")};a.prototype.getContentAnnouncementOfCell=function(t){return l(t,this.getCells(),false)};function l(t,e,n){const i=e[t.getInitialOrder()];let s=o.getAccessibilityText(i,true);if(n){const e=t.getHeader();if(e&&e.getVisible()){s=o.getAccessibilityText(e)+" "+s}}return s}a.prototype.getContentAnnouncementOfPopin=function(){const t=this.getCells();const e=this.getTable()._getVisiblePopin().map(function(e){return l(e,t,true)});return e.filter(Boolean).join(" . ").trim()};a.prototype.getContentAnnouncement=function(){const t=this.getTable();if(!t){return}const e=this.getCells();const n=t.getRenderedColumns().map(function(t){return l(t,e,true)});return n.filter(Boolean).join(" . ").trim()};a.prototype.updateSelectedDOM=function(t,e){o.prototype.updateSelectedDOM.apply(this,arguments);e.find(".sapMTblCellFocusable").attr("aria-selected",t);if(this.hasPopin()){this.$("subcont").attr("aria-selected",t)}};a.prototype.onfocusin=function(e){if(e.isMarked()){return}if(e.srcControl===this){this.$().children(".sapMListTblCellDup").find(":sapTabbable").attr("tabindex",-1)}const n=this.getTable();const i=e.target;if(i.classList.contains("sapMListTblCell")){const o=t.getElementById(i.getAttribute("data-sap-ui-column"));n.updateInvisibleText(this.getContentAnnouncementOfCell(o));e.setMarked("contentAnnouncementGenerated")}else if(i.classList.contains("sapMListTblSubCnt")){n.updateInvisibleText(this.getContentAnnouncementOfPopin());e.setMarked("contentAnnouncementGenerated")}o.prototype.onfocusin.apply(this,arguments)};a.prototype.onfocusout=function(t){if(t.isMarked()){return}const e=t.target;if(e.matches(".sapMListTblCell")||e.matches(".sapMListTblSubCnt")){this.getTable().removeInvisibleTextAssociation(e)}o.prototype.onfocusout.apply(this,arguments)};a.prototype.onsapenter=a.prototype.onsapspace=function(t){if(t.isMarked()){return}var e=t.target.id;var n="on"+t.type;if(e==this.getId()+"-ModeCell"){t.target=this.getDomRef();n=this.getMode()=="Delete"?"onsapdelete":"onsapspace"}else if(e==this.getId()+"-TypeCell"){t.target=this.getDomRef();if(this.getType()=="Navigation"){n="onsapenter"}else{t.code="KeyE";t.ctrlKey=true;n="onkeydown"}}o.prototype[n].call(this,t)};a.prototype.setType=function(t){o.prototype.setType.call(this,t);this._checkTypeColumn();return this};a.prototype.setParent=function(){o.prototype.setParent.apply(this,arguments);this._checkTypeColumn();return this};a.prototype._checkTypeColumn=function(t){if(!this.getParent()){return}if(t==undefined){t=this._needsTypeColumn()}if(this._bNeedsTypeColumn!=t){this._bNeedsTypeColumn=t;this.informList("TypeColumnChange",t)}};a.prototype._needsTypeColumn=function(){var t=this.getType();return this.getVisible()&&(t==s.Detail||t==s.Navigation||t==s.DetailAndActive)};a.prototype._addClonedHeader=function(t){return this._aClonedHeaders.push(t)};a.prototype._destroyClonedHeaders=function(){if(this._aClonedHeaders.length){this._aClonedHeaders.forEach(function(t){t.destroy("KeepDom")});this._aClonedHeaders=[]}};a.prototype._activeHandlingInheritor=function(){this._toggleActiveClass(true)};a.prototype._inactiveHandlingInheritor=function(){this._toggleActiveClass(false)};a.prototype._toggleActiveClass=function(t){if(this.hasPopin()){this.$Popin().toggleClass("sapMLIBActive",t)}};return a});
//# sourceMappingURL=ColumnListItem.js.map