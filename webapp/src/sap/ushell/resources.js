// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/i18n/Localization","sap/ui/model/resource/ResourceModel"],function(e,o){"use strict";var r={};r.getTranslationModel=function(e){if(!this._oResourceModel){this._oResourceModel=new o({bundleUrl:sap.ui.require.toUrl("sap/ushell/renderer/resources/resources.properties"),bundleLocale:e})}return this._oResourceModel};r.i18nModel=r.getTranslationModel(e.getLanguage());r.i18n=r.i18nModel.getResourceBundle();return r},true);
//# sourceMappingURL=resources.js.map