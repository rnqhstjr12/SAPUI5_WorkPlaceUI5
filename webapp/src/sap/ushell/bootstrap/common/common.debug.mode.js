// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(["./common.constants"],function(t){"use strict";var e;var n=/[?&]sap-ui-debug=(true|x|X)(&|$)/.test(window.location.search);if(!n){try{e=window.localStorage.getItem(t.uiDebugKey);n=!!e&&/^(true|x|X)$/.test(e)}catch(t){}}return{isDebug:function(){return n}}});
//# sourceMappingURL=common.debug.mode.js.map