// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([],function(){"use strict";var e={apiVersion:2};e.render=function(e,n){var t=this._prepareControlsToBeRendered(n);e.openStart("div",n);e.class("sapUshellVizInstance");if(n.getEditable()){e.class("sapUshellVizInstanceEdit")}e.openEnd();t.forEach(function(n){e.renderControl(n)});e.close("div")};e._prepareControlsToBeRendered=function(e){var n=[e.getContent()];if(e.getEditable()){if(e.getRemovable()){var t=e._getRemoveIconVBox();n.unshift(t)}var o=e._getActionModeButtonIconVBox();n.push(o)}return n};return e});
//# sourceMappingURL=VizInstanceRenderer.js.map