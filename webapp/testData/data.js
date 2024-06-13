// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([], function () {
    "use strict";

    var aVisualizations = [];

    // for (var i = 0; i < 200; i++) {
    //     aVisualizations.push({
    //         id: "test-tile-app-" + i,
    //         type: "sap.ushell.StaticAppLauncher",
    //         descriptor: {
    //             value: {
    //                 "sap.app": {
    //                     id: "test-tile-app-" + i,
    //                     applicationVersion: {
    //                         version: "1.0.0"
    //                     },
    //                     title: "Test App Tile " + i,
    //                     shortTitle: "A test app shortTitle",
    //                     subTitle: "A test app subtitle",
    //                     info: "A test app info"
    //                 },
    //                 "sap.ui": {
    //                     technology: "UI5",
    //                     icons: {
    //                         icon: "sap-icon://settings"
    //                     },
    //                     deviceTypes: {
    //                         desktop: true,
    //                         tablet: true,
    //                         phone: true
    //                     }
    //                 },
    //                 "sap.fiori": {
    //                     registrationIds: [
    //                         "F2424"
    //                     ]
    //                 },
    //                 "sap.ui5": {
    //                     componentName: "sap.ushell.demo.AppStateSample"
    //                 },
    //                 "sap.platform.runtime": {
    //                     componentProperties: {
    //                         url: "../../demoapps/AppStateSample"
    //                     }
    //                 }
    //             }
    //         }
    //     });
    // }

    // for (var j = 0; j < 4; j++) {
    //     aVisualizations.push({
    //         id: "test-card-app-" + j,
    //         type: "sap.card",
    //         descriptor: {
    //             value: {
    //                 "sap.app": {
    //                     id: "test-card-app-" + j,
    //                     applicationVersion: {
    //                         version: "1.0.0"
    //                     },
    //                     title: "Test App Card " + j,
    //                     shortTitle: "A test app shortTitle",
    //                     subTitle: "A test app subtitle",
    //                     info: "A card info"
    //                 },
    //                 "sap.card": {
    //                     type: "Analytical",
    //                     header: {
    //                         data: {
    //                             json: {
    //                                 n: "84",
    //                                 u: "%",
    //                                 trend: "Up",
    //                                 valueColor: "Good"
    //                             }
    //                         },
    //                         type: "Numeric",
    //                         title: "{parameters>/title/value}",
    //                         details: "{parameters>/details/value}",
    //                         subTitle: "{parameters>/subTitle/value}",
    //                         icon: {
    //                             src: "sap-icon://desktop-mobile"
    //                         },
    //                         mainIndicator: {
    //                             unit: "{u}",
    //                             state: "{valueColor}",
    //                             trend: "{trend}",
    //                             number: "{n}"
    //                         },
    //                         sideIndicators: [
    //                             {
    //                                 unit: "%",
    //                                 title: "Target",
    //                                 number: "85"
    //                             },
    //                             {
    //                                 unit: "%",
    //                                 title: "Deviation",
    //                                 number: "15"
    //                             }
    //                         ],
    //                         unitOfMeasurement: "%"
    //                     },
    //                     content: {
    //                         data: {
    //                             json: {
    //                                 list: [
    //                                     {
    //                                         Cost: 230000,
    //                                         Week: "Mar",
    //                                         Cost1: 24800.63,
    //                                         Cost2: 205199.37,
    //                                         Cost3: 199999.37,
    //                                         Budget: 210000,
    //                                         Target: 500000,
    //                                         Revenue: 78
    //                                     },
    //                                     {
    //                                         Cost: 238000,
    //                                         Week: "Apr",
    //                                         Cost1: 99200.39,
    //                                         Cost2: 138799.61,
    //                                         Cost3: 200199.37,
    //                                         Budget: 224000,
    //                                         Target: 500000,
    //                                         Revenue: 80
    //                                     },
    //                                     {
    //                                         Cost: 221000,
    //                                         Week: "May",
    //                                         Cost1: 70200.54,
    //                                         Cost2: 150799.46,
    //                                         Cost3: 80799.46,
    //                                         Budget: 238000,
    //                                         Target: 500000,
    //                                         Revenue: 82
    //                                     },
    //                                     {
    //                                         Cost: 280000,
    //                                         Week: "Jun",
    //                                         Cost1: 158800.73,
    //                                         Cost2: 121199.27,
    //                                         Cost3: 108800.46,
    //                                         Budget: 252000,
    //                                         Target: 500000,
    //                                         Revenue: 91
    //                                     },
    //                                     {
    //                                         Cost: 325000,
    //                                         Week: "Jul",
    //                                         Cost1: 237200.74,
    //                                         Cost2: 87799.26,
    //                                         Cost3: 187799.26,
    //                                         Budget: 294000,
    //                                         Target: 600000,
    //                                         Revenue: 95
    //                                     }
    //                                 ]
    //                             },
    //                             path: "/list"
    //                         },
    //                         feeds: [
    //                             {
    //                                 uid: "categoryAxis",
    //                                 type: "Dimension",
    //                                 values: [
    //                                     "Weeks"
    //                                 ]
    //                             },
    //                             {
    //                                 uid: "valueAxis",
    //                                 type: "Measure",
    //                                 values: [
    //                                     "Revenue"
    //                                 ]
    //                             }
    //                         ],
    //                         measures: [
    //                             {
    //                                 name: "Revenue",
    //                                 value: "{Revenue}"
    //                             },
    //                             {
    //                                 name: "Cost"
    //                             }
    //                         ],
    //                         chartType: "stacked_column",
    //                         dimensions: [
    //                             {
    //                                 name: "Weeks",
    //                                 value: "{Week}"
    //                             }
    //                         ],
    //                         chartProperties: {
    //                             title: {
    //                                 text: "Utilization Projection",
    //                                 alignment: "left"
    //                             },
    //                             plotArea: {
    //                                 dataLabel: {
    //                                     visible: false,
    //                                     showTotal: true
    //                                 }
    //                             },
    //                             valueAxis: {
    //                                 title: {
    //                                     visible: false
    //                                 }
    //                             },
    //                             legendGroup: {
    //                                 position: "bottom",
    //                                 alignment: "topLeft"
    //                             },
    //                             categoryAxis: {
    //                                 title: {
    //                                     visible: false
    //                                 }
    //                             }
    //                         }
    //                     },
    //                     configuration: {
    //                         parameters: {
    //                             title: {
    //                                 label: "Title",
    //                                 value: "Digital Practice"
    //                             },
    //                             subTitle: {
    //                                 label: "Subtitle",
    //                                 value: "Current and Forecasted Utilization"
    //                             },
    //                             details: {
    //                                 label: "Details",
    //                                 value: "Based on planned project dates"
    //                             }
    //                         }
    //                     }
    //                 },
    //                 "sap.ui": {
    //                     technology: "UI5",
    //                     icons: {
    //                         icon: "sap-icon://Fiori2/F0005"
    //                     },
    //                     deviceTypes: {
    //                         desktop: true,
    //                         tablet: true,
    //                         phone: true
    //                     }
    //                 },
    //                 "sap.ui5": {
    //                     componentName: "sap.ushell.demo.AppStateSample"
    //                 },
    //                 "sap.platform.runtime": {
    //                     componentProperties: {
    //                         url: "../../demoapps/AppStateSample"
    //                     }
    //                 }
    //             }
    //         }
    //     });
    // }
    return {
        visualizations: {
            nodes: aVisualizations
        },
        workPage: {
            id: "cep-standard-workpage",
            contents: {
                descriptor: {
                    value: {
                        title: "테스트 WorkPage",
                        description: ""
                    },
                    schemaVersion: "3.2.0"
                },
            }

        }
    };
});
