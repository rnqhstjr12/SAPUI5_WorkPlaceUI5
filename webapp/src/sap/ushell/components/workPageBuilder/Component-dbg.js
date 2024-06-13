//Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview WorkPageBuilder Component
 * This UIComponent gets initialized by the FLP renderer upon visiting a work page if work pages are enabled (/core/workPages/enabled).
 *
 * @version 1.123.1
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/base/util/ObjectPath",
    "sap/base/Log"
], function (UIComponent, ObjectPath, Log) {
    "use strict";

    /**
     * Component of the WorkPagesRuntime view.
     *
     * @param {string} sId Component id
     * @param {object} oSParams Component parameter
     *
     * @class
     * @extends sap.ui.core.UIComponent
     *
     * @private
     * @since 1.99.0
     * @alias sap.ushell.components.workPageBuilder.Component
     */
    return UIComponent.extend("sap.ushell.components.workPageBuilder.Component", /** @lends sap.ushell.components.workPageBuilder.Component.prototype */{
        metadata: {
            manifest: "json",
            library: "sap.ushell",
            events: {
                workPageEdited: {},
                visualizationFilterApplied: {
                    parameters: {
                        /**
                         * An array with objects containing {filterKey: "<key>", filterValue: "<value>"}
                         */
                        filters: { type: "array" }
                    }
                },
                closeEditMode: {
                    parameters: {
                        /**
                         * Indicates if the changes have to be saved
                         */
                        saveChanges: { type: "boolean" }
                    }
                }
            }
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
        },

        /**
         * API to call the getEditMode function on the WorkPageBuilder controller.
         * @returns {boolean} Returns the value of editMode
         * @since 1.109.0
         * @private
         * @ui5-restricted portal-cf-*
         */
        getEditMode: function () {
            return this.getRootControl().getController().getEditMode();
        },

        /**
         * API to call the setEditMode function on the WorkPageBuilder controller.
         * @param {boolean} bEditMode true or false
         *
         * @since 1.109.0
         * @private
         * @ui5-restricted portal-cf-*
         */
        setEditMode: function (bEditMode) {
            this.getRootControl().getController().setEditMode(bEditMode);
        },

        /**
         * API to call the setPreviewMode function on the WorkPageBuilder controller.
         * @param {boolean} bPreviewMode true or false
         *
         * @since 1.116.0
         * @private
         * @ui5-restricted portal-cf-*
         */
        setPreviewMode: function (bPreviewMode) {
            this.getRootControl().getController().setPreviewMode(bPreviewMode);
        },

        /**
         * API to call the getPreviewMode function on the WorkPageBuilder controller.
         * @returns {boolean} Returns the value of previewMode
         *
         * @since 1.116.0
         * @private
         * @ui5-restricted portal-cf-*
         */
        getPreviewMode: function () {
            return this.getRootControl().getController().getPreviewMode();
        },

        /**
         * API to call the getPageData function on the WorkPageBuilder controller.
         * @returns {{workPage: {contents: object }}} Returns the pageData which might have been modified by the user.

         * @since 1.109.0
         * @private
         * @ui5-restricted portal-cf-*
         */
        getPageData: function () {
            return this.getRootControl().getController().getPageData();
        },

        /**
         * API to call the setPageData function on the WorkPageBuilder controller.
         * @param {{workPage: {contents: object, usedVisualizations: {nodes: object}}}} oPageData WorkPage data object
         * @returns {Promise} A promise resolving when the data was set.
         *
         * @since 1.109.0
         * @private
         * @ui5-restricted portal-cf-*
         */
        setPageData: function (oPageData) {
            this.getRootControl().getController().setPageData(oPageData);
            return Promise.resolve();
        },

        /**
         * API to call the setVisualizationDataPaginated function on the WorkPageRuntime controller.
         * @param {{visualizations: {nodes: object[], totalCount: int}}} oVizNodes Array of Visualizations
         * @returns {Promise} A promise resolving when the data was set.
         *
         * @since 1.115.0
         * @private
         * @ui5-restricted portal-cf-*
         */
        setVisualizationData: function (oVizNodes) {
            return this.getRootControl().getController().setVisualizationData(oVizNodes);
        },

        /**
         * API to check if navigation is disabled
         * @returns {boolean} Returns navigationDisabled
         * @since 1.110.0
         * @private
         * @ui5-restricted portal-cf-*
         */
        getNavigationDisabled: function () {
            return this.getRootControl().getController().getNavigationDisabled();
        },

        /**
         * API for enabling/disabling navigation
         * @param {boolean} bNavigation true or false
         *
         * @since 1.110.0
         * @private
         * @ui5-restricted portal-cf-*
         */
        setNavigationDisabled: function (bNavigation) {
            this.getRootControl().getController().setNavigationDisabled(bNavigation);
        },

        /**
         * Helper method to retrieve the sap.ushell.Container from the current frame or the parent frame.
         *
         * @since 1.110.0
         * @private
         * @returns {sap.ushell.Container} The ushell container
         */
        getUshellContainer: function () {
            return ObjectPath.get("sap.ushell.Container") || ObjectPath.get("parent.sap.ushell.Container");
        },

        /**
         * API for showing/hiding Footer bar
         * @param {boolean} bVisible true or false
         *
         * @since 1.110.0
         * @private
         * @ui5-restricted portal-cf-*
         */
        setShowFooter: function (bVisible) {
            this.getRootControl().getController().setShowFooter(bVisible);
        },


        /**
         * API for showing/hiding Page title
         * @param {boolean} bVisible true or false
         *
         * @since 1.116.0
         * @private
         * @ui5-restricted portal-cf-*
         */
        setShowPageTitle: function (bVisible) {
            this.getRootControl().getController().setShowPageTitle(bVisible);
        }
    });
});
