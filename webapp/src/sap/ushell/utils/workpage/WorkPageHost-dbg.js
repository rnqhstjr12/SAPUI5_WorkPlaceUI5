//Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file WorkPageHost for WorkPageBuilder and DWSPageBuilder
 * @version 1.123.1
 */

sap.ui.define([
    "sap/ui/integration/Host",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ui/model/resource/ResourceModel"
], function (
    Host,
    JSONModel,
    Container,
    EventHub,
    ResourceModel
) {
    "use strict";

    /**
     * @alias sap.ushell.utils.workpage.WorkPageHost
     * @class
     * @classdesc WorkPageHost for WorkPageBuilder and DWSPageBuilder
     *
     * @param {string} sId the ID of the host.
     * @param {object} [mSettings] the settings of the host instance.
     *
     * @augments sap.ui.integration.Host
     *
     * @private
     */
    return function (sId, mSettings) {
        var oHost = new Host(sId, mSettings);

        // private variables to store context information , filled lazy after by getContext, getContextValue was called, via _applyHostContext.
        oHost._oHostContext = null;
        oHost._oHostContextModel = null;

        /**
         * Resolves the destination for a given name
         * @param {string} The name of the destination to resolve.
         * @returns {Promise<string>} Promise with the target destination
         */
        oHost.setResolveDestination(function (sDestinationName) {
            if (!sDestinationName) {
                return Promise.reject();
            }
            return Promise.resolve(location.origin + "/dynamic_dest/" + sDestinationName);
        });

        /**
         * Handles cardStateChange events and emits an Init entry the usage of the card to the UITracer.trace event.
         * The event is fired multiple times today.
         * The referenceId property (providerId) needs to be maintained on the card instance in the WorkPage or InterestCardService
         */
        oHost.attachCardInitialized(function (oEvent) {
            var oCard = oEvent.getParameter("card");
            if (oCard && oCard.isA && oCard.isA("sap.ui.integration.widgets.Card")) {
                EventHub.emit("UITracer.trace", {
                    source: "Card",
                    reason: "Init",
                    data: {
                        cardId: oCard.getManifestEntry("/sap.app/id"),
                        providerId: oCard.getReferenceId()
                    }
                });
            }
        });

        /**
         * Sets the UShell Container to be used to create the Navigation service.
         *
         * @param {sap.ushell.Container} oContainer the UShell container to be used.
         */
        oHost._setContainer = function (oContainer) {
            this.oContainer = oContainer;
        };

        /**
         * Sets whether the navigation action is disabled
         *
         * @param {boolean} bValue value of navigation disabled.
         */
        oHost._setNavigationDisabled = function (bValue) {
            this._bNavigationDisabled = !!bValue;
        };

        /**
         * Executes the Navigation. If event's type is Navigation, a new window will be opened
         *
         * @param {sap.base.Event} oEvent Event triggered by the card
         * @returns {Promise<undefined>} Promise that will resolve if Navigation is successful
         */
        oHost._executeNavigation = function (oEvent) {

            var oParameters = oEvent.getParameter("parameters"),
                    oCard = oEvent.getParameter("card");

            if (oEvent.getParameter("type") !== "Navigation" ||
                    this._bNavigationDisabled) {
                    return Promise.resolve();
            }
            if (oParameters && oParameters.hasOwnProperty("url")) {
                    EventHub.emit("UITracer.trace", {
                            reason: "LaunchApp",
                            source: "Card",
                            data: {
                                    cardId: oCard.getManifestEntry("/sap.app/id"),
                                    providerId: oCard.getReferenceId(),
                                    targetUrl: oParameters.url
                            }
                    });
                    return Promise.resolve();
            }
            // Prevent event bubbling here, to avoid opening the same target twice
            oEvent.preventDefault(true);


            return this.oContainer.getServiceAsync("Navigation")
                    .then(function (oNavigationService) {
                            var oNavigationParameters = {};
                            if (oParameters.hasOwnProperty("ibnTarget")) {
                                    oNavigationParameters.target = oParameters.ibnTarget;
                            }
                            if (oParameters.hasOwnProperty("ibnParams")) {
                                    oNavigationParameters.params = oParameters.ibnParams;
                            }
                            if (oParameters.hasOwnProperty("ibnAppSpecificRoute")) {
                                    oNavigationParameters.appSpecificRoute = oParameters.ibnAppSpecificRoute;
                            }
                            EventHub.emit("UITracer.trace", {
                                    reason: "LaunchApp",
                                    source: "Card",
                                    data: {
                                            cardId: oCard.getManifestEntry("/sap.app/id"),
                                            providerId: oCard.getReferenceId(),
                                            targetUrl: "#" + oNavigationParameters.target.semanticObject + "-" + oNavigationParameters.target.action
                                    }
                            });
                            return oNavigationService.navigate(oNavigationParameters);
                    });

        };
        oHost.attachAction(oHost._executeNavigation.bind(oHost));

        /**
         * Handle fetch call of cards and and emits a FetchData entry to the UITracer.trace event
         * The status, statusText, url (resource) of the response are logged.
         * statusText is normalized as the native Response.statusText might be missing for http2
         * @param {string} sResource This defines the resource that you wish to fetch.
         * @param {object} mOptions An object containing any custom settings that you want to apply to the request.
         * @param {object} mRequestSettings The map of request settings defined in the card manifest. Use this only for reading, they can not be modified.
         * @param {sap.ui.integration.widgets.Card} oCard The card which initiated the request.
         * @returns {Promise<Response>} A <code>Promise</code> that resolves to a <code>Response</code> object.
         *
         * @see sap.ui.integration.Host#fetch
         *
         * @since 1.117.0
         * @private
         * @alias sap.ushell.utils.workpage.WorkPageHost#fetch
         */
        oHost.fetch = function (sResource, mOptions, mRequestSettings, oCard) {
            if (oCard && oCard.isA && oCard.isA("sap.ui.integration.widgets.Card")) {
                return Host.prototype.fetch.apply(this, arguments)
                    .then(function (oRes) {
                        EventHub.emit("UITracer.trace", {
                            source: "Card",
                            reason: "FetchData",
                            data: {
                                cardId: oCard.getManifestEntry("/sap.app/id"),
                                providerId: oCard.getReferenceId(),
                                targetUrl: sResource,
                                status: oRes.status
                            }
                        });
                        return oRes;
                    });
            }
            return Host.prototype.fetch.apply(this, arguments);
        };

        /**
         * Resolves host context value based on a given content path
         *
         * @param {string} sPath The context path used at runtime, e.g "sap.workzone/currentUser/value".
         *
         * @returns {Promise<any>} Promise that resolves to the context paths value.
         *
         * @since 1.115.0
         * @private
         * @alias sap.ushell.utils.workpage.WorkPageHost#getContextValue
         */
        oHost.getContextValue = function (sPath) {
            try {
                if (!sPath) {
                    return Promise.reject();
                }
                if (sPath.charAt(0) === "/") {
                    return oHost.getContextValue(sPath.substring(1));
                }
                return oHost.getContext().then(function () {
                    return oHost._oHostContextModel.getProperty("/" + sPath);
                });
            } catch (ex) {
                return Promise.resolve();
            }
        };

        /**
         * Returns the promise with the host context information.
         *
         * The information is collected from the UserInfo service once and stored in
         * this.oHostContext member.
         * The context contains information for id, name, email and timezone of the user.
         *
         * Additionally this structure is used for the configuration editor of cards that can
         * select a corresponding value from a drop down. Label, placeholder and descriptions for
         * such configuration is also added.
         *
         * This structure is returned for the configuration editor of the card via the 'getContext' method of the host.
         *
         * For the Standard Edition the content object will contain:
         * {
         *    "sap.workzone": {
         *      currentUser: {
         *        id: {
         *          label: string
         *          description: string,
         *          placeholder: string,
         *          type: "string",
         *          value: The user id as string
         *        },
         *        name: {
         *          label: string
         *          description: string,
         *          placeholder: string,
         *          type: "string",
         *          value: The users full name as string
         *        },
         *        firstName: {
         *          label: string
         *          description: string,
         *          placeholder: string,
         *          type: "string",
         *          value: The firstName name as string
         *        },
         *        lastName: {
         *          label: string
         *          description: string,
         *          placeholder: string,
         *          type: "string",
         *          value: The users lastName as string
         *        },
         *        email: {
         *          label: string
         *          description: string,
         *          placeholder: string,
         *          type: "string",
         *          value: The users email as string
         *        }
         *      }
         *    }
         * }
         *
         * @returns {Promise<object>} The sap.workzone context object
         *
         * @since 1.115.0
         * @private
         * @alias sap.ushell.utils.workpage.WorkPageHost#getContext
         */
        oHost.getContext = function () {
            if (!oHost._oHostContext) {
                oHost._oHostContext = Container.getServiceAsync("UserInfo")
                    .then(function (UserInfo) {
                        return oHost._getBundle()
                            .then(function (oBundle) {
                                return oHost._applyHostContext(UserInfo, oBundle);
                            })
                            .catch(function () {
                                return oHost._applyHostContext(UserInfo);
                            });
                })
                .catch(function () {
                    return {};
                });
            }
            return Promise.resolve(oHost._oHostContext);
        };

        // loads resource bundle
        oHost._getBundle = function () {
            return new ResourceModel({
                bundleName: "sap.ushell.utils.workpage.resources.resources",
                        async: true
            }).getResourceBundle();
        };

        /**
         * Applies a oHost._HostContext object and oHost._HostContextModel as json model to access the context values via getContextValue.
         *
         * @param {sap.ushell.services.UserInfo} UserInfo UserInfo Service instance.
         * @param {sap.base.i18n.ResourceBundle} [oBundle] Resource bundle for context labels, descriptions and placeholders.
         * @returns {object} the created _oHostContext object.
         */
        oHost._applyHostContext = function (UserInfo, oBundle) {
            if (!oBundle) {
                oBundle = {
                    getText: function (s) {
                        return s;
                    }
                };
            }
            oHost._oHostContext = {
                "sap.workzone": {
                    label: oBundle.getText("WorkPage.Host.Context.WorkZone.Label"),
                    currentUser: {
                        label: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.Label"),
                        id: {
                            label: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.Id.Label"),
                            type: "string",
                            tags: ["technical"],
                            placeholder: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder"),
                            description: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc"),
                            value: UserInfo.getId()
                        },
                        name: {
                            label: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.Name.Label"),
                            type: "string",
                            placeholder: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder"),
                            description: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc"),
                            value: UserInfo.getFullName()
                        },
                        firstName: {
                            label: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label"),
                            type: "string",
                            placeholder: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder"),
                            description: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc"),
                            value: UserInfo.getFirstName()
                        },
                        lastName: {
                            label: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label"),
                            type: "string",
                            placeholder: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder"),
                            description: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc"),
                            value: UserInfo.getLastName()
                        },
                        email: {
                            label: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.Email.Label"),
                            type: "string",
                            placeholder: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder"),
                            description: oBundle.getText("WorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc"),
                            value: UserInfo.getEmail()
                        }
                    }
                }
            };
            oHost._oHostContextModel = new JSONModel(oHost._oHostContext);
            return oHost._oHostContext;
        };

        return oHost;
    };
});
