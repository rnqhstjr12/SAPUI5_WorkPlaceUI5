/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Lib","sap/ui/core/library","./DynamicDateOption","./Label","./RadioButton","./RadioButtonGroup","sap/ui/core/date/UniversalDateUtils","sap/ui/core/date/UniversalDate","sap/m/DynamicDateValueHelpUIType","./library"],function(e,t,a,s,T,r,n,E,A,R){"use strict";var S=t.VerticalAlign;var c=a.extend("sap.m.StandardDynamicDateOption",{metadata:{library:"sap.m",properties:{calendarWeekNumbering:{type:"sap.ui.core.date.CalendarWeekNumbering",group:"Appearance",defaultValue:null}}}});var i=1;var l=6e3;var D={DATE:"DATE",DATETIME:"DATETIME",DATERANGE:"DATERANGE",DATETIMERANGE:"DATETIMERANGE",TODAY:"TODAY",YESTERDAY:"YESTERDAY",TOMORROW:"TOMORROW",SPECIFICMONTH:"SPECIFICMONTH",SPECIFICMONTHINYEAR:"SPECIFICMONTHINYEAR",FIRSTDAYWEEK:"FIRSTDAYWEEK",LASTDAYWEEK:"LASTDAYWEEK",FIRSTDAYMONTH:"FIRSTDAYMONTH",LASTDAYMONTH:"LASTDAYMONTH",FIRSTDAYQUARTER:"FIRSTDAYQUARTER",LASTDAYQUARTER:"LASTDAYQUARTER",FIRSTDAYYEAR:"FIRSTDAYYEAR",LASTDAYYEAR:"LASTDAYYEAR",THISWEEK:"THISWEEK",THISMONTH:"THISMONTH",THISQUARTER:"THISQUARTER",THISYEAR:"THISYEAR",LASTWEEK:"LASTWEEK",LASTMONTH:"LASTMONTH",LASTQUARTER:"LASTQUARTER",LASTYEAR:"LASTYEAR",NEXTWEEK:"NEXTWEEK",NEXTMONTH:"NEXTMONTH",NEXTQUARTER:"NEXTQUARTER",NEXTYEAR:"NEXTYEAR",LASTMINUTES:"LASTMINUTES",LASTHOURS:"LASTHOURS",LASTDAYS:"LASTDAYS",LASTWEEKS:"LASTWEEKS",LASTMONTHS:"LASTMONTHS",LASTQUARTERS:"LASTQUARTERS",LASTYEARS:"LASTYEARS",NEXTMINUTES:"NEXTMINUTES",NEXTHOURS:"NEXTHOURS",NEXTDAYS:"NEXTDAYS",NEXTWEEKS:"NEXTWEEKS",NEXTMONTHS:"NEXTMONTHS",NEXTQUARTERS:"NEXTQUARTERS",NEXTYEARS:"NEXTYEARS",FROM:"FROM",TO:"TO",FROMDATETIME:"FROMDATETIME",TODATETIME:"TODATETIME",YEARTODATE:"YEARTODATE",DATETOYEAR:"DATETOYEAR",TODAYFROMTO:"TODAYFROMTO",QUARTER1:"QUARTER1",QUARTER2:"QUARTER2",QUARTER3:"QUARTER3",QUARTER4:"QUARTER4"};var u={SingleDates:1,DateRanges:2,Weeks:3,Months:4,Quarters:5,Years:6};var g={DATE:u.SingleDates,DATETIME:u.SingleDates,DATERANGE:u.DateRanges,DATETIMERANGE:u.DateRanges,TODAY:u.SingleDates,YESTERDAY:u.SingleDates,TOMORROW:u.SingleDates,SPECIFICMONTH:u.Months,SPECIFICMONTHINYEAR:u.Months,FIRSTDAYWEEK:u.SingleDates,LASTDAYWEEK:u.SingleDates,FIRSTDAYMONTH:u.SingleDates,LASTDAYMONTH:u.SingleDates,FIRSTDAYQUARTER:u.SingleDates,LASTDAYQUARTER:u.SingleDates,FIRSTDAYYEAR:u.SingleDates,LASTDAYYEAR:u.SingleDates,THISWEEK:u.Weeks,THISMONTH:u.Months,THISQUARTER:u.Quarters,THISYEAR:u.Years,LASTWEEK:u.Weeks,LASTMONTH:u.Months,LASTQUARTER:u.Quarters,LASTYEAR:u.Years,NEXTWEEK:u.Weeks,NEXTMONTH:u.Months,NEXTQUARTER:u.Quarters,NEXTYEAR:u.Years,LASTMINUTES:u.DateRanges,LASTHOURS:u.DateRanges,LASTDAYS:u.DateRanges,LASTWEEKS:u.DateRanges,LASTMONTHS:u.DateRanges,LASTQUARTERS:u.DateRanges,LASTYEARS:u.DateRanges,NEXTMINUTES:u.DateRanges,NEXTHOURS:u.DateRanges,NEXTDAYS:u.DateRanges,NEXTWEEKS:u.DateRanges,NEXTMONTHS:u.DateRanges,NEXTQUARTERS:u.DateRanges,NEXTYEARS:u.DateRanges,FROM:u.DateRanges,TO:u.DateRanges,FROMDATETIME:u.DateRanges,TODATETIME:u.DateRanges,YEARTODATE:u.DateRanges,DATETOYEAR:u.DateRanges,TODAYFROMTO:u.DateRanges,QUARTER1:u.Quarters,QUARTER2:u.Quarters,QUARTER3:u.Quarters,QUARTER4:u.Quarters};var o=["LASTMINUTES","LASTHOURS","LASTDAYS","LASTWEEKS","LASTMONTHS","LASTQUARTERS","LASTYEARS"];var O=["NEXTMINUTES","NEXTHOURS","NEXTDAYS","NEXTWEEKS","NEXTMONTHS","NEXTQUARTERS","NEXTYEARS"];c.LastXKeys=o;c.NextXKeys=O;var N=e.getResourceBundleFor("sap.m");c.Keys=D;c.prototype.exit=function(){if(this.aValueHelpUITypes){while(this.aValueHelpUITypes.length){this.aValueHelpUITypes.pop().destroy()}delete this.aValueHelpUITypes}};c.prototype.getText=function(e){var t=this.getKey();var a=e._getOptions();var s=this.getValueHelpUITypes(e);var T=this._getOptionParams(o,a);var r=this._getOptionParams(O,a);if(T){s.push(T)}if(r){s.push(r)}switch(t){case D.LASTMINUTES:case D.LASTHOURS:case D.LASTDAYS:case D.LASTWEEKS:case D.LASTMONTHS:case D.LASTQUARTERS:case D.LASTYEARS:case D.NEXTMINUTES:case D.NEXTHOURS:case D.NEXTDAYS:case D.NEXTWEEKS:case D.NEXTMONTHS:case D.NEXTQUARTERS:case D.NEXTYEARS:return this._getXPeriodTitle(s[1].getOptions());case D.FROMDATETIME:case D.TODATETIME:case D.DATETIMERANGE:return e._findOption(t)._bAdditionalTimeText?N.getText("DYNAMIC_DATE_"+t+"_TITLE")+" ("+N.getText("DYNAMIC_DATE_DATETIME_TITLE")+")":N.getText("DYNAMIC_DATE_"+t+"_TITLE");default:return N.getText("DYNAMIC_DATE_"+t+"_TITLE")}};c.prototype.getValueHelpUITypes=function(e){var t=this.getKey();if(!this.aValueHelpUITypes){switch(t){case D.TODAY:case D.YESTERDAY:case D.TOMORROW:case D.FIRSTDAYWEEK:case D.LASTDAYWEEK:case D.FIRSTDAYMONTH:case D.LASTDAYMONTH:case D.FIRSTDAYQUARTER:case D.LASTDAYQUARTER:case D.FIRSTDAYYEAR:case D.LASTDAYYEAR:case D.THISWEEK:case D.THISMONTH:case D.THISQUARTER:case D.THISYEAR:case D.LASTWEEK:case D.LASTMONTH:case D.LASTQUARTER:case D.LASTYEAR:case D.NEXTWEEK:case D.NEXTMONTH:case D.NEXTQUARTER:case D.NEXTYEAR:case D.YEARTODATE:case D.DATETOYEAR:case D.QUARTER1:case D.QUARTER2:case D.QUARTER3:case D.QUARTER4:this.aValueHelpUITypes=[];break;case D.DATETIME:case D.FROMDATETIME:case D.TODATETIME:this.aValueHelpUITypes=[new A({type:"datetime"})];break;case D.DATE:case D.FROM:case D.TO:this.aValueHelpUITypes=[new A({type:"date"})];break;case D.DATERANGE:this.aValueHelpUITypes=[new A({type:"daterange"})];break;case D.SPECIFICMONTH:this.aValueHelpUITypes=[new A({type:"month"})];break;case D.SPECIFICMONTHINYEAR:this.aValueHelpUITypes=[new A({type:"custommonth"})];break;case D.LASTMINUTES:case D.LASTHOURS:case D.LASTDAYS:case D.LASTWEEKS:case D.LASTMONTHS:case D.LASTQUARTERS:case D.LASTYEARS:case D.NEXTMINUTES:case D.NEXTHOURS:case D.NEXTDAYS:case D.NEXTWEEKS:case D.NEXTMONTHS:case D.NEXTQUARTERS:case D.NEXTYEARS:this.aValueHelpUITypes=[new A({text:N.getText("DDR_LASTNEXTX_LABEL"),type:"int"})];break;case D.TODAYFROMTO:this.aValueHelpUITypes=[new A({text:N.getText("DDR_TODAYFROMTO_FROM_LABEL"),type:"int",additionalText:N.getText("DDR_TODAYFROMTO_TO_ADDITIONAL_LABEL")}),new A({text:N.getText("DDR_TODAYFROMTO_TO_LABEL"),type:"int",additionalText:N.getText("DDR_TODAYFROMTO_TO_ADDITIONAL_LABEL")})];break;case D.DATETIMERANGE:this.aValueHelpUITypes=[new A({text:N.getText("DDR_DATETIMERANGE_FROM_LABEL"),type:"datetime"}),new A({text:N.getText("DDR_DATETIMERANGE_TO_LABEL"),type:"datetime"})];break}}return this.aValueHelpUITypes.slice(0)};c.prototype.createValueHelpUI=function(e,t){var a=e._getOptions(),T=e.getValue()&&Object.assign({},e.getValue()),r=this.getValueHelpUITypes(e),n=[],E,A=e.getCalendarWeekNumbering();if(!e.aControlsByParameters){e.aControlsByParameters={}}e.aControlsByParameters[this.getKey()]=[];var R=this._getOptionParams(o,a),c=this._getOptionParams(O,a);if(R){r.push(R)}if(c){r.push(c)}if(T&&T.values){T.values=T.values.map(function(e){return e})}for(var i=0;i<r.length;i++){E=null;if(r[i].getOptions()&&r[i].getOptions().length<=1){break}else if(r[i].getText()){E=new s({text:r[i].getText(),width:"100%"});n.push(E)}var l;switch(r[i].getType()){case"int":l=this._createIntegerControl(T,i,t);if(T&&r[1]&&r[1].getOptions()&&r[1].getOptions().indexOf(T.operator.slice(4).toLowerCase())!==-1){l.setValue(T.values[i])}break;case"date":l=this._createDateControl(T,i,t,A);break;case"datetime":if(r.length===1){l=this._createDateTimeInnerControl(T,i,t,A)}else if(r.length===2){l=this._createDateTimeControl(T,i,t,A)}break;case"daterange":l=this._createDateRangeControl(T,i,t,A);break;case"month":l=this._createMonthControl(T,i,t);break;case"custommonth":l=this._createCustomMonthControl(T,i,t);break;case"options":l=this._createOptionsControl(T,i,t,r);break;default:break}n.push(l);E&&E.setLabelFor(l);if(r[i].getAdditionalText()){n.push(new s({vAlign:S.Bottom,text:r[i].getAdditionalText()}).addStyleClass("sapMDDRAdditionalLabel"))}e.aControlsByParameters[this.getKey()].push(l)}return n};c.prototype._createIntegerControl=function(e,t,s){var T=a.prototype._createIntegerControl.call(this,e,t,s);var r=this.getKey()==="TODAYFROMTO"?-l:i;var n=!e||this.getKey()!==e.operator;if(n){T.setValue(1)}T.setMin(r);T.setMax(l);return T};c.prototype._createOptionsControl=function(e,t,a,s){var T=new r({buttons:[s[t].getOptions().map(I)]});if(e){var n=s[t].getOptions().indexOf(e.operator.slice(4).toLowerCase());if(n!==-1){T.setSelectedIndex(n)}}if(a instanceof Function){T.attachSelect(function(){a(this)},this)}return T};c.prototype._getOptionParams=function(e,t){if(e.indexOf(this.getKey())!==-1){return new A({text:N.getText("DDR_LASTNEXTX_TIME_PERIODS_LABEL"),type:"options",options:t?t.filter(function(t){return e.indexOf(t.getKey())!==-1}).map(function(e){return e.getKey().slice(4).toLowerCase()}):[]})}return undefined};c.prototype.validateValueHelpUI=function(e){var t=this.getValueHelpUITypes();for(var a=0;a<t.length;a++){var s=e.aControlsByParameters[this.getKey()][a];switch(t[a].getType()){case"int":if(s._isLessThanMin(s.getValue())||s._isMoreThanMax(s.getValue())){return false}break;case"month":case"custommonth":case"date":case"daterange":if(!s.getSelectedDates()||s.getSelectedDates().length==0){return false}break;case"datetime":if(t.length===1){if(!s.getCalendar().getSelectedDates()||s.getCalendar().getSelectedDates().length==0){return false}}else if(!s.getDateValue()&&t.length===2){return false}break;case"options":if(s.getSelectedIndex()<0){return false}break;default:break}}return true};c.prototype.getValueHelpOutput=function(e){var t=e._getOptions();var a=this.getValueHelpUITypes(e),s={},T;if(o.indexOf(this.getKey())!==-1&&e.aControlsByParameters[this.getKey()].length>1){s.operator=t.filter(function(e){return o.indexOf(e.getKey())!==-1})[e.aControlsByParameters[this.getKey()][1].getSelectedIndex()].getKey()}else if(O.indexOf(this.getKey())!==-1&&e.aControlsByParameters[this.getKey()].length>1){s.operator=t.filter(function(e){return O.indexOf(e.getKey())!==-1})[e.aControlsByParameters[this.getKey()][1].getSelectedIndex()].getKey()}else{s.operator=this.getKey()}s.values=[];for(var r=0;r<a.length;r++){var n=e.aControlsByParameters[this.getKey()][r];switch(a[r].getType()){case"int":T=n.getValue();break;case"month":if(!n.getSelectedDates()||!n.getSelectedDates().length){return null}T=n.getSelectedDates()[0].getStartDate().getMonth();break;case"custommonth":if(!n.getSelectedDates()||!n.getSelectedDates().length){return null}T=[n.getSelectedDates()[0].getStartDate().getMonth(),n.getSelectedDates()[0].getStartDate().getFullYear()];break;case"date":if(!n.getSelectedDates().length){return null}T=n.getSelectedDates()[0].getStartDate();break;case"datetime":if(a.length===1){var E,A,R,S;R=n.getCalendar();S=n.getClocks();if(!R.getSelectedDates().length){return null}E=R.getSelectedDates()[0].getStartDate();A=S.getTimeValues();E.setHours(A.getHours(),A.getMinutes(),A.getSeconds());T=E}else if(a.length===2){if(!n.getDateValue()){return null}T=n.getDateValue()}break;case"daterange":if(!n.getSelectedDates().length){return null}var c=n.getSelectedDates()[0].getEndDate()||n.getSelectedDates()[0].getStartDate();T=[n.getSelectedDates()[0].getStartDate(),c];break;default:break}if(Array.isArray(T)){s.values=Array.prototype.concat.apply(s.values,T)}else{T!==null&&T!==undefined&&s.values.push(T)}}return s};c.prototype.getGroup=function(){return g[this.getKey()]};c.prototype.getGroupHeader=function(){return N.getText("DDR_OPTIONS_GROUP_"+g[this.getKey()])};c.prototype.format=function(e,t){return t.format(e,true)};c.prototype.parse=function(e,t){return t.parse(e,this.getKey())};c.prototype.toDates=function(e,t){if(!e){return null}var a=e.operator;var s=e.values[0]||0;switch(a){case"SPECIFICMONTH":var T=new E;T.setMonth(e.values[0]);T=n.getMonthStartDate(T);return n.getRange(0,"MONTH",T);case"SPECIFICMONTHINYEAR":var T=new E;T.setMonth(e.values[0]);T.setFullYear(e.values[1]);T=n.getMonthStartDate(T);return n.getRange(0,"MONTH",T);case"DATE":return n.getRange(0,"DAY",E.getInstance(e.values[0]));case"DATETIME":var r=new E.getInstance(e.values[0]);return[r,r];case"DATERANGE":var A=E.getInstance(e.values[0]);var R=E.getInstance(e.values[1]);return[n.resetStartTime(A),n.resetEndTime(R)];case"DATETIMERANGE":var A=E.getInstance(e.values[0]);var R=E.getInstance(e.values[1]);A.setMilliseconds(0);R.setMilliseconds(999);return[A,R];case"TODAY":return n.ranges.today();case"YESTERDAY":return n.ranges.yesterday();case"TOMORROW":return n.ranges.tomorrow();case"FIRSTDAYWEEK":return n.ranges.firstDayOfWeek(t);case"LASTDAYWEEK":return n.ranges.lastDayOfWeek(t);case"FIRSTDAYMONTH":return n.ranges.firstDayOfMonth();case"LASTDAYMONTH":return n.ranges.lastDayOfMonth();case"FIRSTDAYQUARTER":return n.ranges.firstDayOfQuarter();case"LASTDAYQUARTER":return n.ranges.lastDayOfQuarter();case"FIRSTDAYYEAR":return n.ranges.firstDayOfYear();case"LASTDAYYEAR":return n.ranges.lastDayOfYear();case"THISWEEK":return n.ranges.currentWeek(t);case"THISMONTH":return n.ranges.currentMonth();case"THISQUARTER":return n.ranges.currentQuarter();case"THISYEAR":return n.ranges.currentYear();case"LASTWEEK":return n.ranges.lastWeek(t);case"LASTMONTH":return n.ranges.lastMonth();case"LASTQUARTER":return n.ranges.lastQuarter();case"LASTYEAR":return n.ranges.lastYear();case"NEXTWEEK":return n.ranges.nextWeek(t);case"NEXTMONTH":return n.ranges.nextMonth();case"NEXTQUARTER":return n.ranges.nextQuarter();case"NEXTYEAR":return n.ranges.nextYear();case"LASTMINUTES":return n.ranges.lastMinutes(s);case"LASTHOURS":return n.ranges.lastHours(s);case"LASTDAYS":return n.ranges.lastDays(s);case"LASTWEEKS":return n.ranges.lastWeeks(s,t);case"LASTMONTHS":return n.ranges.lastMonths(s);case"LASTQUARTERS":return n.ranges.lastQuarters(s);case"LASTYEARS":return n.ranges.lastYears(s);case"NEXTMINUTES":return n.ranges.nextMinutes(s);case"NEXTHOURS":return n.ranges.nextHours(s);case"NEXTDAYS":return n.ranges.nextDays(s);case"NEXTWEEKS":return n.ranges.nextWeeks(s,t);case"NEXTMONTHS":return n.ranges.nextMonths(s);case"NEXTQUARTERS":return n.ranges.nextQuarters(s);case"NEXTYEARS":return n.ranges.nextYears(s);case"FROM":return[E.getInstance(e.values[0])];case"TO":return[E.getInstance(e.values[0])];case"FROMDATETIME":var T=E.getInstance(e.values[0]);T.setMilliseconds(0);return[T];case"TODATETIME":var T=E.getInstance(e.values[0]);T.setMilliseconds(999);return[T];case"YEARTODATE":return n.ranges.yearToDate();case"DATETOYEAR":return n.ranges.dateToYear();case"TODAYFROMTO":if(e.values.length!==2){return[]}var S=e.values[0];var c=e.values[1];var A=S>=0?n.ranges.lastDays(S)[0]:n.ranges.nextDays(-S)[1];var R=c>=0?n.ranges.nextDays(c)[1]:n.ranges.lastDays(-c)[0];if(A.oDate.getTime()>R.oDate.getTime()){R=[A,A=R][0]}return[n.resetStartTime(A),n.resetEndTime(R)];case"QUARTER1":return n.ranges.quarter(1);case"QUARTER2":return n.ranges.quarter(2);case"QUARTER3":return n.ranges.quarter(3);case"QUARTER4":return n.ranges.quarter(4);default:return[]}};c.prototype.enhanceFormattedValue=function(){switch(this.getKey()){case"TODAY":case"YESTERDAY":case"TOMORROW":case"FIRSTDAYWEEK":case"LASTDAYWEEK":case"FIRSTDAYMONTH":case"LASTDAYMONTH":case"FIRSTDAYQUARTER":case"LASTDAYQUARTER":case"FIRSTDAYYEAR":case"LASTDAYYEAR":case"THISWEEK":case"THISMONTH":case"THISQUARTER":case"THISYEAR":case"LASTWEEK":case"LASTMONTH":case"LASTQUARTER":case"LASTYEAR":case"NEXTWEEK":case"NEXTMONTH":case"NEXTQUARTER":case"NEXTYEAR":case"YEARTODATE":case"DATETOYEAR":case"QUARTER1":case"QUARTER2":case"QUARTER3":case"QUARTER4":return true;default:return false}};c.prototype._getXPeriodTitle=function(e){var t,a=this.getKey();if(e.length===1){return N.getText("DYNAMIC_DATE_"+a+"_TITLE")}t=e.map(function(e){return N.getText("DYNAMIC_DATE_"+e.toUpperCase())}).join(" / ");if(a.indexOf("LAST")===0){return N.getText("DYNAMIC_DATE_LASTX_TITLE",t)}if(a.indexOf("NEXT")===0){return N.getText("DYNAMIC_DATE_NEXTX_TITLE",t)}};function I(e){return new T({text:N.getText("DYNAMIC_DATE_"+e.toUpperCase())})}return c});
//# sourceMappingURL=StandardDynamicDateOption.js.map