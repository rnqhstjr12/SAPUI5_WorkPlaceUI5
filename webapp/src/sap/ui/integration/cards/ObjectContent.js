/*!
* OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["./BaseContent","./ObjectContentRenderer","sap/ui/integration/library","sap/m/library","sap/m/IllustratedMessageType","sap/m/FlexItemData","sap/m/HBox","sap/m/VBox","sap/m/Text","sap/m/Avatar","sap/m/Link","sap/m/Label","sap/m/RatingIndicator","sap/m/Image","sap/ui/integration/controls/ObjectStatus","sap/m/ComboBox","sap/m/TextArea","sap/m/Input","sap/m/TimePicker","sap/base/Log","sap/base/util/isEmptyObject","sap/base/util/isPlainObject","sap/base/util/merge","sap/ui/core/ResizeHandler","sap/ui/layout/AlignedFlowLayout","sap/ui/dom/units/Rem","sap/ui/integration/util/BindingHelper","sap/ui/integration/util/BindingResolver","sap/ui/integration/util/Utils","sap/ui/integration/util/Form","sap/ui/integration/util/DateRangeHelper","sap/ui/integration/util/Duration","sap/ui/integration/controls/ImageWithOverlay","sap/f/AvatarGroup","sap/f/AvatarGroupItem","sap/f/cards/NumericIndicators","sap/f/cards/NumericSideIndicator","sap/f/cards/loading/ObjectPlaceholder","sap/f/library","sap/m/OverflowToolbar","sap/m/OverflowToolbarButton","sap/ui/core/ListItem"],function(e,t,a,i,r,o,n,s,l,u,p,c,d,m,g,f,h,v,y,b,I,C,_,w,F,S,x,A,B,O,T,P,R,G,L,j,D,V,k,z,M,E){"use strict";var N=i.AvatarSize;var U=i.AvatarColor;var q=i.AvatarImageFitType;var W=i.ButtonType;var H=i.FlexRendertype;var K=i.FlexJustifyContent;var X=a.CardActionArea;var J=k.AvatarGroupType;var Q=i.ToolbarStyle;var Y=i.ImageMode;var Z=e.extend("sap.ui.integration.cards.ObjectContent",{metadata:{library:"sap.ui.integration",aggregations:{_form:{type:"sap.ui.integration.util.Form",multiple:false,visibility:"hidden"}}},renderer:t});Z.prototype.exit=function(){e.prototype.exit.apply(this,arguments);if(this._sResizeListenerId){w.deregister(this._sResizeListenerId);this._sResizeListenerId=""}};Z.prototype.createLoadingPlaceholder=function(e){return new V};Z.prototype.onDataChanged=function(){var e=this.getCardInstance();if(this._hasData()){this.hideNoDataMessage()}else{this.showNoDataMessage({illustrationType:r.NoData,title:this.getCardInstance().getTranslatedText("CARD_NO_ITEMS_ERROR_CHART")})}this._getForm().updateModel();if(e.isReady()){this.validateControls(false)}};Z.prototype._getForm=function(){var e=this.getAggregation("_form");if(!e){e=new O(this.getCardInstance());this.setAggregation("_form",e)}return e};Z.prototype.validateControls=function(e,t){this._getForm().validate(e,t)};Z.prototype._hasData=function(){var e=this.getConfiguration();if(!e.hasOwnProperty("hasData")){return true}var t=A.resolveValue(e.hasData,this,this.getBindingContext().getPath());if(Array.isArray(t)&&!t.length||C(t)&&I(t)){return false}return!!t};Z.prototype.applyConfiguration=function(){var e=this.getParsedConfiguration();if(!e){return}if(e.groups){this._addGroups(e)}};Z.prototype.getStaticConfiguration=function(){var e=this.getParsedConfiguration(),t;if(!this.getBindingContext()){return e}else{t=this.getBindingContext().getPath()}if(e.groups){e.groups.forEach(function(e){var a=[];if(e.items){e.items.forEach(function(e){var i=this._resolveGroupItem(e,e.path,t);a.push(i)}.bind(this))}e.items=a}.bind(this))}return e};Z.prototype._resolveGroupItem=function(e,t,a){var i=_({},e),r=[],o=a+t,n=["TextArea","Input","ComboBox","Duration","DateRange"].includes(e.type),s=["ButtonGroup","IconGroup"].includes(e.type);if(n){i=_(i,this._getForm().resolveControl(e))}if(e.type==="ComboBox"){if(e.item){s=true;o=a+e.item.path.substring(1);e.template=e.item.template;delete i.item}else{s=false}}if(s){var l=e.template,u=this.getModel().getProperty(o);u.forEach(function(e,t){var a=A.resolveValue(l,this,o+"/"+t+"/");if(a.icon&&a.icon.src){a.icon.src=this._oIconFormatter.formatSrc(a.icon.src)}else if(a.icon&&typeof a.icon==="string"){a.icon=this._oIconFormatter.formatSrc(a.icon)}r.push(a)}.bind(this));i.items=r;delete i.path;delete i.template}if(e.icon&&e.icon.src){i.icon.src=this._oIconFormatter.formatSrc(A.resolveValue(e.icon.src,this))}return i};Z.prototype._getRootContainer=function(){var e=this.getAggregation("_content");if(!e){e=new s({renderType:H.Bare});this.setAggregation("_content",e);this._sResizeListenerId=w.register(e,this._onResize.bind(this))}return e};Z.prototype._addGroups=function(e){var t=this._getRootContainer(),a,i=true,r=e.groups||[];r.forEach(function(e,n){var s=this._createGroup(e,"/sap.card/content/groups/"+n);if(e.alignment==="Stretch"){s.setLayoutData(new o({growFactor:1}));t.addItem(s);i=true}else{if(i){a=this._createAFLayout();t.addItem(a);i=false}a.addContent(s)}if(n===r.length-1){s.addStyleClass("sapFCardObjectGroupLastInColumn")}},this);this._oActions.attach({area:X.Content,actions:e.actions,control:this})};Z.prototype._createGroup=function(e,t){var a;if(typeof e.visible=="string"){a=!B.hasFalsyValueAsString(e.visible)}else{a=e.visible}var i=new s({visible:a,renderType:H.Bare}).addStyleClass("sapFCardObjectGroup");if(e.title){i.addItem(new l({text:e.title,maxLines:e.titleMaxLines||1}).addStyleClass("sapFCardObjectItemTitle sapMTitle sapMTitleStyleAuto"));i.addStyleClass("sapFCardObjectGroupWithTitle")}e.items.forEach(function(a,r){a.labelWrapping=e.labelWrapping;this._createGroupItems(a,t+"/items/"+r).forEach(i.addItem,i)},this);return i};Z.prototype._createGroupItems=function(e,t){var a=e.label,i=e.showColon,r,o,l;e.showColon=i===undefined?true:i;if(typeof e.visible=="string"){o=!B.hasFalsyValueAsString(e.visible)}else{o=e.visible}if(a){r=new c({text:a,visible:o,wrapping:e.labelWrapping,showColon:e.showColon}).addStyleClass("sapFCardObjectItemLabel");r.addEventDelegate({onBeforeRendering:function(){r.setVisible(r.getVisible()&&!!r.getText())}})}l=this._createItem(e,o,r,t);if(l&&!l.isA("sap.m.Image")){l.addStyleClass("sapFCardObjectItemValue")}if(e.icon){var u=new s({renderType:H.Bare,justifyContent:K.Center,items:[r,l]}).addStyleClass("sapFCardObjectItemPairContainer");var p=new n({visible:o,renderType:H.Bare,items:[this._createGroupItemAvatar(e.icon),u]}).addStyleClass("sapFCardObjectItemLabel");return[p]}else{return[r,l]}};Z.prototype._createGroupItemAvatar=function(e){var t=x.formattedProperty(e.src,function(e){return this._oIconFormatter.formatSrc(e)}.bind(this));var a=e.initials||e.text;var i=new u({displaySize:e.size||N.XS,src:t,initials:a,displayShape:e.shape,tooltip:e.alt,backgroundColor:e.backgroundColor||(a?undefined:U.Transparent),imageFitType:q.Contain,visible:e.visible}).addStyleClass("sapFCardObjectItemAvatar sapFCardIcon");return i};Z.prototype._createItem=function(e,t,a,i){var r,o=e.value,n=e.tooltip,s;switch(e.type){case"NumericData":r=this._createNumericDataItem(e,t);break;case"Status":r=this._createStatusItem(e,t);break;case"IconGroup":r=this._createIconGroupItem(e,t);break;case"ButtonGroup":r=this._createButtonGroupItem(e,t);break;case"ComboBox":r=this._createComboBoxItem(e,t,a,i);break;case"TextArea":r=this._createTextAreaItem(e,t,a,i);break;case"RatingIndicator":r=this._createRatingIndicatorItem(e,t);break;case"Image":r=this._createImageItem(e,t);break;case"Input":r=this._createInputItem(e,t,a,i);break;case"Duration":r=this._createDurationItem(e,t,a,i);break;case"DateRange":r=this._createDateRangeItem(e,t,a,i);break;case"link":b.warning("Usage of Object Group Item property 'type' with value 'link' is deprecated. Use Card Actions for navigation instead.",null,"sap.ui.integration.widgets.Card");r=new p({href:e.url||o,text:o,tooltip:n,target:e.target||"_blank",visible:x.reuse(t)});break;case"email":b.warning("Usage of Object Group Item property 'type' with value 'email' is deprecated. Use Card Actions for navigation instead.",null,"sap.ui.integration.widgets.Card");var l=[];if(e.value){l.push(e.value)}if(e.emailSubject){l.push(e.emailSubject)}s=x.formattedProperty(l,function(e,t){if(t){return"mailto:"+e+"?subject="+t}else{return"mailto:"+e}});r=new p({href:s,text:o,tooltip:n,visible:x.reuse(t)});break;case"phone":b.warning("Usage of Object Group Item property 'type' with value 'phone' is deprecated. Use Card Actions for navigation instead.",null,"sap.ui.integration.widgets.Card");s=x.formattedProperty(o,function(e){return"tel:"+e});r=new p({href:s,text:o,tooltip:n,visible:x.reuse(t)});break;default:r=this._createTextItem(e,t,a)}return r};Z.prototype._createNumericDataItem=function(e,t){var a=new s({visible:x.reuse(t)});var i=new j({number:e.mainIndicator.number,numberSize:e.mainIndicator.size,scale:e.mainIndicator.unit,trend:e.mainIndicator.trend,state:e.mainIndicator.state}).addStyleClass("sapUiIntOCNumericIndicators");a.addItem(i);if(e.sideIndicators){e.sideIndicators.forEach(function(e){i.addSideIndicator(new D({title:e.title,number:e.number,unit:e.unit,state:e.state}))})}if(e.details){a.addItem(new l({text:e.details,maxLines:1}).addStyleClass("sapUiIntOCNumericIndicatorsDetails"))}return a};Z.prototype._createStatusItem=function(e,t){var a=new g({text:e.value,visible:x.reuse(t),state:e.state,showStateIcon:e.showStateIcon,icon:e.customStateIcon});return a};Z.prototype._createTextItem=function(e,t,a){var i=e.value,r=e.tooltip,o;if(i&&e.actions){o=new p({text:i,tooltip:r,visible:x.reuse(t)});if(a){o.addAriaLabelledBy(a)}else{b.warning("Missing label for Object group item with actions.",null,"sap.ui.integration.widgets.Card")}this._oActions.attach({area:X.ContentItemDetail,actions:e.actions,control:this,actionControl:o,enabledPropertyName:"enabled"});o=new n({renderType:H.Bare,items:o})}else if(i){o=new l({text:i,visible:x.reuse(t),maxLines:e.maxLines})}return o};Z.prototype._createButtonGroupItem=function(e,t){var a=e.template;if(!a){return null}var i=new z({visible:x.reuse(t),style:Q.Clear});i.addStyleClass("sapUiIntCardObjectButtonGroup");var r=new M({icon:x.formattedProperty(a.icon,function(e){return this._oIconFormatter.formatSrc(e)}.bind(this)),text:a.text||a.tooltip,tooltip:a.tooltip||a.text,type:W.Transparent,visible:a.visible});if(a.actions){r.attachPress(function(e){this._onButtonGroupPress(e,a.actions)}.bind(this))}i.bindAggregation("content",{path:e.path||"/",template:r,templateShareable:false});return i};Z.prototype._onButtonGroupPress=function(e,t){var a=e.getSource();var i=A.resolveValue(t,a,a.getBindingContext().getPath());var r=i[0];this.getActions().fireAction(this,r.type,r.parameters)};Z.prototype._createIconGroupItem=function(e,t){var a=e.template;if(!a){return null}var i=new G({avatarDisplaySize:e.size||N.XS,groupType:J.Individual,visible:x.reuse(t)});i._oShowMoreButton.setType(W.Transparent);i._oShowMoreButton.setEnabled(false);if(a.actions){i.attachPress(function(e){this._onIconGroupPress(e,a.actions)}.bind(this))}else{i._setInteractive(false)}var r=new L({src:x.formattedProperty(a.icon.src,function(e){return this._oIconFormatter.formatSrc(e)}.bind(this)),initials:a.icon.initials||a.icon.text,tooltip:a.icon.alt});i.bindAggregation("items",{path:e.path||"/",template:r,templateShareable:false});return i};Z.prototype._onIconGroupPress=function(e,t){if(e.getParameter("overflowButtonPressed")){}else{var a=e.getParameter("eventSource");var i=A.resolveValue(t,a,a.getBindingContext().getPath());var r=i[0];this.getActions().fireAction(this,r.type,r.parameters)}};Z.prototype._createComboBoxItem=function(e,t,a,i){var r=this._getForm(),o={visible:x.reuse(t),placeholder:e.placeholder,required:r.getRequiredValidationValue(e)},n,s;if(e.selectedKey){o.selectedKey=e.selectedKey}else if(e.value){o.value=e.value}n=new f(o);if(a){a.setLabelFor(n)}if(e.item){s=new E({key:e.item.template.key,text:e.item.template.title});n.bindItems({path:e.item.path||"/",template:s,templateShareable:false})}r.addControl("change",n,e,i);return n};Z.prototype.setFormFieldValue=function(e){this._getForm().setControlValue(e)};Z.prototype._createTextAreaItem=function(e,t,a,i){var r=this._getForm(),o=new h({required:r.getRequiredValidationValue(e),value:e.value,visible:x.reuse(t),rows:e.rows,placeholder:e.placeholder});if(a){a.setLabelFor(o)}r.addControl("liveChange",o,e,i);return o};Z.prototype._createInputItem=function(e,t,a,i){var r=this._getForm(),o=new v({required:r.getRequiredValidationValue(e),value:e.value,visible:x.reuse(t),placeholder:e.placeholder});if(a){a.setLabelFor(o)}r.addControl("liveChange",o,e,i);return o};Z.prototype._createDurationItem=function(e,t,a,i){var r=this._getForm(),o=new y({valueFormat:"HH:mm",displayFormat:"HH:mm",support2400:true,required:r.getRequiredValidationValue(e),value:x.formattedProperty(e.value,P.fromISO),visible:x.reuse(t),placeholder:e.placeholder});if(a){a.setLabelFor(o)}r.addControl("change",o,e,i);return o};Z.prototype._createRatingIndicatorItem=function(e,t){var a=new d({editable:false,displayOnly:true,maxValue:e.maxValue,value:e.value,visualMode:e.visualMode,visible:x.reuse(t),iconSize:"1rem"});return a};Z.prototype._createImageItem=function(e,t){var a=x.formattedProperty(e.src,function(e){return this._oIconFormatter.formatSrc(e)}.bind(this));var i;var r=new m({src:a,alt:e.alt,height:e.height});if(e.imageFit||e.imagePosition){r.setMode(Y.Background);r.setBackgroundSize(e.imageFit);r.setBackgroundPosition(e.imagePosition)}if(e.overlay){r.addStyleClass("sapUiIntImgWithOverlayImg");i=new R({image:r,tooltip:e.tooltip,supertitle:e.overlay.supertitle,title:e.overlay.title,subTitle:e.overlay.subTitle,verticalPosition:e.overlay.verticalPosition,horizontalPosition:e.overlay.horizontalPosition,textColor:e.overlay.textColor,textFilter:e.overlay.textFilter,background:e.overlay.background,padding:e.overlay.padding,animation:e.overlay.animation,visible:x.reuse(t)}).addStyleClass("sapFCardObjectImage");this.addStyleClass("sapFCardObjectContentWithOverlay")}else{r.setTooltip(e.tooltip);r.setVisible(x.reuse(t));r.addStyleClass("sapFCardObjectImage");i=r}if(e.fullWidth){i.addStyleClass("sapFCardObjectImageFullWidth")}return i};Z.prototype._createDateRangeItem=function(e,t,a,i){var r={options:["date"],value:e.value};var o=this._getForm();var n=T.createInput(r,this.getCardInstance(),true);if(x.isBindingInfo(t)){n.bindProperty("visible",x.reuse(t))}else{n.setVisible(t)}n.setRequired(o.getRequiredValidationValue(e));if(a){a.setLabelFor(n)}o.addControl("change",n,e,i);return n};Z.prototype._createAFLayout=function(){var e=new F;e.addEventDelegate({onAfterRendering:function(){this.getContent().forEach(function(e){if(!e.getVisible()){document.getElementById("sap-ui-invisible-"+e.getId()).parentElement.classList.add("sapFCardInvisibleContent")}})}},e);return e};Z.prototype._onResize=function(e){if(e.size.width===e.oldSize.width){return}var t=this._getRootContainer().getItems();t.forEach(function(a,i){if(a.isA("sap.ui.layout.AlignedFlowLayout")){this._onAlignedFlowLayoutResize(a,e,i===t.length-1)}}.bind(this))};Z.prototype._onAlignedFlowLayoutResize=function(e,t,a){var i=e.getMinItemWidth(),r,o=e.getContent().filter(function(e){return e.getVisible()}).length;if(i.lastIndexOf("rem")!==-1){r=S.toPx(i)}else if(i.lastIndexOf("px")!==-1){r=parseFloat(i)}var n=Math.floor(t.size.width/r);if(n>o){n=o}var s=n-1,l=Math.ceil(o/n);e.getContent().forEach(function(e,t){e.addStyleClass("sapFCardObjectSpaceBetweenGroup");if(s===t&&s<o){e.removeStyleClass("sapFCardObjectSpaceBetweenGroup");s+=n}if(a&&t+1>(l-1)*n){e.addStyleClass("sapFCardObjectGroupLastInColumn")}else{e.removeStyleClass("sapFCardObjectGroupLastInColumn")}})};return Z});
//# sourceMappingURL=ObjectContent.js.map