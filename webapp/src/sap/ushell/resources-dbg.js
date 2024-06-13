// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview This file handles the resource bundles.
 */

sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ui/model/resource/ResourceModel"
], function (
    Localization,
    ResourceModel
) {
    "use strict";

    // ensure that sap.ushell exists
    var oResources = {};

    oResources.getTranslationModel = function (sLocale) {
        if (!this._oResourceModel) {
            // create translation resource model
            this._oResourceModel = new ResourceModel({
                bundleUrl: sap.ui.require.toUrl("sap/ushell/renderer/resources/resources.properties"),
                bundleLocale: sLocale
            });
        }
        return this._oResourceModel;
    };

    oResources.i18nModel = oResources.getTranslationModel(Localization.getLanguage());
    oResources.i18n = oResources.i18nModel.getResourceBundle();

    return oResources;
}, /* bExport= */ true);
