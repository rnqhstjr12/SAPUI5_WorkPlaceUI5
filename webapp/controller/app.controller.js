//Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/base/i18n/Localization",
    "sap/base/util/ObjectPath",
    "sap/base/util/deepExtend",
    "sap/f/GridContainerItemLayoutData",
    "sap/m/library",
    "sap/ui/core/Component",
    "sap/ui/core/Element",
    "sap/ui/core/Fragment",
    "sap/ui/core/InvisibleMessage",
    "sap/ui/core/library",
    "sap/ui/core/mvc/Controller",
    "sap/ui/integration/ActionDefinition",
    "sap/ushell/utils/workpage/WorkPageHost",
    "sap/ui/integration/widgets/Card",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations",
    "sap/ushell/adapters/cdm/v3/utilsCdm",
    "sap/ushell/ui/launchpad/VizInstanceCdm",
    "sap/ushell/utils",
    "sap/ushell/utils/workpage/WorkPageVizInstantiation",
    "sap/ushell/components/workPageBuilder/controller/WorkPageBuilder.accessibility",
    "sap/ushell/components/workPageBuilder/controller/WorkPageBuilder.layout",
    "sap/ui/integration/library",
    "../testData/data"
],
    function (
        Log,
        Localization,
        ObjectPath,
        deepExtend,
        GridContainerItemLayoutData,
        mLibrary,
        Component,
        Element,
        Fragment,
        InvisibleMessage,
        coreLibrary,
        Controller,
        ActionDefinition,
        WorkPageHost,
        Card,
        JSONModel,
        readUtils,
        readVisualizations,
        utilsCdm,
        VizInstanceCdm,
        utils,
        WorkPageVizInstantiation,
        WorkPageBuilderAccessibility,
        WorkPageBuilderLayoutHelper,
        integrationLibrary,
        WorkPageBuilderData) {
        "use strict";

        var ValueState, CONFIGURATION_LEVELS, MIN_GRID_COLUMN_WIDTH, MAX_GRID_COLUMN_WIDTH, STEP_SIZE;
        var MAX_COLUMNS_PER_ROW, LoadState, InvisibleMessageMode, CardPreviewMode, aVisualizations;
        
        /**
         * Controller of the WorkPageBuilder view.
         *
         * @param {string} sId Controller id
         * @param {object} oParams Controller parameters
         * @class
         * @assigns sap.ui.core.mvc.Controller
         * @private
         * @since 1.99.0
         * @alias sap.ushell.components.workPageBuilder.controller.WorkPages
         */
        
        return Controller.extend("project1.controller.app", {
            /** @lends sap.ushell.components.workPageBuilder.controller.WorkPageBuilder.prototype */
            onInit: async function () {
                this._globalVarSet();
                this._viewDataSet();
                // this._VisualizationSet();

                // let test = await this.get("/gilro_srv/event/Event_Bcc/$count");
                // console.log(test)

                this.test = await this.get("https://services.odata.org/northwind/northwind.svc/Customers/$count");
                console.log(this.test)
                this.test2 = await this.get("Northwind/V4/Northwind/Northwind.svc/Customers");
                console.log(this.test2)
            },

            onDataCheck: function (oEvent) {
                console.log(aVisualizations);
            },

            __dummyData: function () {
                let ttest = this.test;
                let aDummy = []
                for (var i = 0; i < 5; i++) {
                    aDummy.push({
                        id: "test-tile-app-" + i,
                        type: "sap.ushell.DynamicAppLauncher",
                        descriptor: {
                            value: {
                                "sap.app": {
                                    id: "test-tile-app-" + i,
                                    title: "테스트용 타일 " + i,
                                    shortTitle: "테스트 shortTitle " + i,
                                    subTitle: "테스트용 서브타이틀 " + i,
                                    info: "테스트용 정보 " + i,
                                    number: 1123
                                },
                                "sap.ui": {
                                    icons: {
                                        icon: "sap-icon://decline",
                                    },
                                },
                                "sap.flp": {
                                    // 타일의 타입
                                    type: "tile",
                                    vizOptions: {
                                        displayFormats: {
                                            supported: [
                                                // 지원 가능한 타입 (compact는 적용이 되지않았음)
                                                "standard",
                                                "standardWide",
                                                "flat",
                                                "flatWide",
                                                "compact",
                                            ],
                                            default: "standard",
                                        },
                                    },
                                    target: {
                                        semanticObject: "Action", // "Object", "Action", "Display", "Edit", "Navigate" 등 들어갈수 있음
                                        action: "toappnavsample",
                                        // type: "URL",
                                        // url: "https://fiorilaunchpad.sap.com/sites#lunch-menu&/favorites/?language=de"

                                    },
                                    indicatorDataSource: {
                                        // dataSource: "https://services.odata.org",
                                        path: "https://services.odata.org/northwind/northwind.svc/Customers/$count",
                                        refresh: 10,
                                    },
                                    descriptorResources: {
                                        // 기본 경로
                                        baseUrl: "", // 데이터를 가져올 경로
                                        descriptorPath: "", // 이동할 경로
                                    },
                                },
                            }
                        },
                    });
                }

                return aDummy;
            },

            _globalVarSet: async function () {
                // this._test();
                this._fnDeleteRowHandler = this.deleteRow.bind(this);
                this._fnDeleteCellHandler = this.deleteCell.bind(this);
                this._fnSaveCardConfiguration = this._onSaveCardEditor.bind(this);
                this._fnResetCardConfiguration = this._onResetCardConfigurations.bind(this);

                ValueState = coreLibrary.ValueState;
                CONFIGURATION_LEVELS = ["PR", "CO", "PG" /*, "US"*/];
                MIN_GRID_COLUMN_WIDTH = 6;
                MAX_GRID_COLUMN_WIDTH = 24;
                STEP_SIZE = 2;
                MAX_COLUMNS_PER_ROW = 4;
                LoadState = mLibrary.LoadState;
                InvisibleMessageMode = coreLibrary.InvisibleMessageMode;
                CardPreviewMode = integrationLibrary.CardPreviewMode;
                aVisualizations = WorkPageBuilderData.visualizations.nodes;
                let aDummy = this.__dummyData();
                aDummy.forEach(element => {
                    aVisualizations.push(element);
                });
                // this._tileSet();

                this.oWorkPageBuilderAccessibility = new WorkPageBuilderAccessibility();
                this.oWorkPageVizInstantiation = await WorkPageVizInstantiation.getInstance();
            },

            _VisualizationSet: async function () {
                aVisualizations = [];
                this._tileSet();

                const oData = {
                    visualizations: {
                        node: aVisualizations
                    },
                    workPage: {
                        id: "cep-standard-workpage",
                        descriptor: {
                            value: {
                                title: "CEP Standard WorkPage",
                                description: "",
                            },
                            schemaVersion: "3.2.0",
                        },
                        rows: [
                            {
                                id: "row0",
                                configurations: [],
                                descriptor: {
                                    value: {
                                        title: "First Section: Tiles",
                                    },
                                    schemaVersion: "3.2.0",
                                },
                                columns: [
                                    {
                                        id: "row0_col0",
                                        descriptor: {
                                            value: {
                                                columnWidth: 12,
                                            },
                                            schemaVersion: "3.2.0",
                                        },
                                        configurations: [],
                                        cells: [
                                            {
                                                id: "row0_col0_cell0",
                                                descriptor: {
                                                    value: {
                                                        mode: "Section",
                                                    },
                                                    schemaVersion: "3.2.0",
                                                },
                                                configurations: [],
                                                widgets: [
                                                    {
                                                        id: "dynamic_tile_0",
                                                        tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
                                                        instanceId:
                                                            "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
                                                        configurations: [],
                                                        visualization: {
                                                            id: "test 0",
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ]
                            }
                        ]
                    }
                }


            },

            _tileSet: async function () { // 미리 불러올 tile
                const sUrl = "/workplaceUI5/workplaceUI5_widget_list"
                await this.get(sUrl).then(async (oResult) => {
                    console.log(oResult.value);
                    let aResult = oResult.value;
                    aResult.forEach(result => {
                        aVisualizations.push(JSON.parse(result.obj));
                    });
                })
            },

            _cardSet: async function () { // 미리 불러올 card
                // const sUrl = "/workplaceUI5/workplaceUI5_widget_list"
                // await this.get(sUrl).then(async (oResult) => {
                //   console.log(oResult.value);
                //   let aResult = oResult.value;
                //   aResult.forEach(result => {
                //     aVisualizations.push(JSON.parse(result.obj));
                //   });
                // })
            },

            _test: async function () {
                const dummy = this.__dummyData();
                const sUrl = "/workplaceUI5/WidgetInfo"
                for (let i = 0; i < dummy.length; i++) {

                    const data = {
                        visualization_id: "test " + i,
                        object_string: JSON.stringify(dummy[i])
                    }
                    await this.post(sUrl, data);
                }
            },

            _viewDataSet: function () {
                var oWorkPage = this.byId("workpagesBuilder");

                // let string =
                //   '{"workPage":{"descriptor":{"value":{"title":"CEP Standard WorkPage","description":""},"schemaVersion":"3.2.0"},"rows":[{"id":"row0","configurations":[],"descriptor":{"value":{"title":"First Section: Tiles"},"schemaVersion":"3.2.0"},"columns":[{"id":"row0_col0","descriptor":{"value":{"columnWidth":12},"schemaVersion":"3.2.0"},"configurations":[],"cells":[{"id":"row0_col0_cell0","descriptor":{"value":{"mode":"Section"},"schemaVersion":"3.2.0"},"configurations":[],"widgets":[{"id":"dynamic_tile_0","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"provider2_97176e7f-b2ea-4e31-842a-3efa5086b329#Default-VizId"}},{"id":"static_tile_0","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"provider1_f95ad84a-65d0-4c39-9a67-09a4efe04f92#Default-VizId"}},{"id":"lunch_tile_0","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"provider1_8adf91e9-b17a-425e-8053-f39b62f0c31e#Default-VizId"}},{"id":"static_tile_1","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"provider1_a152d792-a43e-48eb-aafd-51451a6168e9#Default-VizId"}},{"id":"static_tile_2","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"AppDescId1234"}},{"id":"static_tile_3","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"startWDA"}},{"id":"static_tile_4","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"sap.ushell.example.startURL"}},{"id":"static_tile_5","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"sap.ushell.example.startURL2"}},{"id":"static_tile_6","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"sap.ushell.example.startURL3"}},{"id":"static_tile_7","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"sap.ushell.demo.AppNavSample"}},{"id":"static_tile_8","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"sap.ushell.demo.LauncherValue"}},{"id":"static_tile_9","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"sap.ushell.demo.bookmark"}}]}]},{"id":"row0_col1","descriptor":{"value":{"columnWidth":12},"schemaVersion":"3.2.0"},"configurations":[],"cells":[{"id":"row0_col1_cell0","descriptor":{"value":{"tileMode":true},"schemaVersion":"3.2.0"},"configurations":[],"widgets":[{"id":"dynamic_tile_2","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"provider2_2ce8c859-b668-40d8-9c22-3a7dc018afd3#Default-VizId"}},{"id":"static_tile_2","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"provider1_f95ad84a-65d0-4c39-9a67-09a4efe04f92#Default-VizId"}},{"id":"lunch_tile_2","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"provider1_8adf91e9-b17a-425e-8053-f39b62f0c31e#Default-VizId"}},{"id":"lunch_tile_3","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"DisplayOnDesktopOnly"}},{"id":"lunch_tile_4","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[],"visualization":{"id":"OnlyInCat"}},{"id":"line-card","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[{"id":"conf_widget_0","level":"US","settings":{"value":{"/sap.card/header/title":"Project Cloud Transformation (US - Widget)"},"schemaVersion":"3.2.0"}},{"id":"conf_widget_1","level":"PR","settings":{"value":{"/sap.card/header/title":"Project Cloud Transformation (PR - Widget)"},"schemaVersion":"3.2.0"}},{"id":"conf_widget_2","level":"CO","settings":{"value":{"/sap.card/header/title":"Project Cloud Transformation (CO - Widget)"},"schemaVersion":"3.2.0"}},{"id":"conf_widget_3","level":"PG","settings":{"value":{"/sap.card/header/title":"Project Cloud Transformation (PG - Widget)"},"schemaVersion":"3.2.0"}}],"visualization":{"id":"my.comp.ns.cpkg_my.company.ns.line.chart.card.app#my.company.ns.line.chart.card.viz"}}]}]}]},{"id":"row1","configurations":[],"descriptor":{"value":{"title":"Second Section: Cards"},"schemaVersion":"3.2.0"},"columns":[{"id":"row1_col0","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","descriptor":{"value":{"columnWidth":12},"schemaVersion":"3.2.0"},"configurations":[],"cells":[{"id":"row1_col0_cell0","descriptor":{"value":{},"schemaVersion":"3.2.0"},"configurations":[],"widgets":[{"id":"stacked-column-card","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[{"id":"conf_widget_0","level":"PG","settings":{"value":{"/sap.card/configuration/parameters/title/value":"Digital Practice (PG - Widget)"},"schemaVersion":"3.2.0"}},{"id":"conf_widget_1","level":"CO","settings":{"value":{"/sap.card/configuration/parameters/title/value":"Digital Practice (CO - Widget)","/sap.card/configuration/parameters/subTitle/value":"Current and Forecasted Utilization (CO - Widget)"},"schemaVersion":"3.2.0"}}],"visualization":{"id":"provider2_1e504721-8532-4a80-8fdd-0d88744c336f#Default-VizId"}}]}]},{"id":"row1_col1","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","descriptor":{"value":{"columnWidth":12},"schemaVersion":"3.2.0"},"configurations":[],"cells":[{"id":"row1_col0_cell0","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","descriptor":{"value":{},"schemaVersion":"3.2.0"},"configurations":[],"widgets":[{"id":"table-card","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a5","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","configurations":[{"id":"conf_widget_1","level":"CO","settings":{"value":{"/sap.card/configuration/parameters/title/value":"Project Staffing Watchlist (CO - Widget)"},"schemaVersion":"3.2.0"}}],"visualization":{"id":"provider2_5a119bf3-8540-42b6-a0b4-059db20cd459#Default-VizId"}}]}]}]},{"id":"row3","configurations":[],"descriptor":{"value":{"title":"Fourth Section"},"schemaVersion":"3.2.0"},"columns":[{"id":"row3_col0","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a2","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","descriptor":{"value":{"columnWidth":4},"schemaVersion":"3.2.0"},"configurations":[],"cells":[]},{"id":"row3_col1","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a2","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","descriptor":{"value":{"columnWidth":4},"schemaVersion":"3.2.0"},"configurations":[],"cells":[]},{"id":"row3_col2","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a2","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","descriptor":{"value":{"columnWidth":4},"schemaVersion":"3.2.0"},"configurations":[],"cells":[]},{"id":"row3_col3","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a2","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","descriptor":{"value":{"columnWidth":4},"schemaVersion":"3.2.0"},"configurations":[],"cells":[]},{"id":"row3_col4","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a2","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","descriptor":{"value":{"columnWidth":4},"schemaVersion":"3.2.0"},"configurations":[],"cells":[]},{"id":"row3_col5","tenantId":"a12ff5b4-f542-4fd0-ae52-319bddd789a2","instanceId":"1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a","descriptor":{"value":{"columnWidth":4},"schemaVersion":"3.2.0"},"configurations":[],"cells":[]}]}]},"visualizations":[],"usedVisualizations":{"provider1_8adf91e9-b17a-425e-8053-f39b62f0c31e#Default-VizId":{"id":"provider1_8adf91e9-b17a-425e-8053-f39b62f0c31e#Default-VizId","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"tile1","title":"I am hungry","subTitle":"lets eat"},"sap.flp":{"target":{"type":"URL","url":"https://fiorilaunchpad.sap.com/sites#lunch-menu&/favorites/?language=de"},"indicatorDataSource":{"path":"/mockbackend/dynamictile","refresh":60},"vizOptions":{"displayFormats":{"supported":["standard","standardWide","flat","flatWide","compact"],"default":"flat"}}},"sap.ui":{"icons":{"icon":"sap-icon://meal"}}}},"descriptorResources":{"baseUrl":"","descriptorPath":""}},"provider1_f95ad84a-65d0-4c39-9a67-09a4efe04f92#Default-VizId":{"id":"provider1_f95ad84a-65d0-4c39-9a67-09a4efe04f92#Default-VizId","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.ui":{"icons":{"icon":"sap-icon://Fiori9/F1354"}},"sap.app":{"ach":"SLC-EVL","title":"Translate Evaluation Templates","subTitle":"Evaluation"},"sap.flp":{"vizOptions":{"displayFormats":{"supported":["standard","standardWide","flat","flatWide","compact"],"default":"standard"}},"target":{"type":"IBN","appId":"uyz200pp_0D3DD649E4DE6B79D2AF02C3D904A3AF","inboundId":"ET090PW4NWFHYIXAAGVEZB82L","parameters":{"sap-ui-tech-hint":{"value":{"value":"UI5","format":"plain"}}}}},"sap.fiori":{"registrationIds":["F2198"]}}},"descriptorResources":{"baseUrl":"","descriptorPath":""}},"provider1_a152d792-a43e-48eb-aafd-51451a6168e9#Default-VizId":{"id":"provider1_a152d792-a43e-48eb-aafd-51451a6168e9#Default-VizId","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"ach":"MM-PUR-REQ","title":"Monitor Purchase Requisition Items"},"sap.flp":{"target":{"semanticObject":"PurchaseRequisitionItem","action":"monitor"}},"sap.fiori":{"registrationIds":["F2424"]}}},"descriptorResources":{"baseUrl":"","descriptorPath":""}},"provider2_97176e7f-b2ea-4e31-842a-3efa5086b329#Default-VizId":{"id":"provider2_97176e7f-b2ea-4e31-842a-3efa5086b329#Default-VizId","type":"sap.ushell.DynamicAppLauncher","descriptor":{"value":{"sap.app":{"title":"Capital Projects","subTitle":"All about Finance","info":"desktop only"},"sap.ui":{"icons":{"icon":"sap-icon://capital-projects"}},"sap.flp":{"type":"tile","vizOptions":{"displayFormats":{"supported":["standard","standardWide","compact","flat","flatWide"],"default":"standard"}},"target":{"semanticObject":"Action","action":"toappnavsample"},"indicatorDataSource":{"path":"../../test/counts/v2/$count.txt","refresh":300}}}},"descriptorResources":{"baseUrl":"","descriptorPath":""}},"provider2_2ce8c859-b668-40d8-9c22-3a7dc018afd3#Default-VizId":{"id":"provider2_2ce8c859-b668-40d8-9c22-3a7dc018afd3#Default-VizId","type":"sap.ushell.DynamicAppLauncher","descriptor":{"value":{"sap.app":{"title":"Dynamic Tile","subTitle":"with separate dataSource and content provider","dataSources":{"indicator":{"uri":"../../test/counts"}}},"sap.ui":{"icons":{"icon":"sap-icon://number-sign"}},"sap.flp":{"type":"tile","vizOptions":{"displayFormats":{"supported":["standard","standardWide","compact","flat","flatWide"],"default":"standard"}},"target":{"type":"IBN","appId":"sap.ushell.demo.bookmark-LOCAL_REL_XHR_PATHPREFIX","inboundId":"target"},"indicatorDataSource":{"path":"count22.json","refresh":300,"dataSource":"indicator"}}}},"descriptorResources":{"baseUrl":"","descriptorPath":""}},"provider2_1e504721-8532-4a80-8fdd-0d88744c336f#Default-VizId":{"id":"provider2_1e504721-8532-4a80-8fdd-0d88744c336f#Default-VizId","type":"sap.card","descriptor":{"value":{"sap.ui":{"icons":{"icon":"sap-icon://full-stacked-column-chart"},"technology":"UI5"},"sap.app":{"id":"card.explorer.stacked.column.card","info":"Additional information about this Card","tags":{"keywords":["Analytical","Card","Stacked Column","Sample"]},"type":"card","title":"Sample of a Stacked Column Chart","subTitle":"Sample of a Stacked Column Chart","shortTitle":"A short title for this Card","description":"A long description for this Card","applicationVersion":{"version":"1.0.0"}},"_version":"1.14.0","sap.card":{"type":"Analytical","header":{"data":{"json":{"n":"84","u":"%","trend":"Up","valueColor":"Good"}},"type":"Numeric","title":"{parameters>/title/value}","details":"{parameters>/details/value}","subTitle":"{parameters>/subTitle/value}","icon":{"src":"sap-icon://desktop-mobile"},"mainIndicator":{"unit":"{u}","state":"{valueColor}","trend":"{trend}","number":"{n}"},"sideIndicators":[{"unit":"%","title":"Target","number":"85"},{"unit":"%","title":"Deviation","number":"15"}],"unitOfMeasurement":"%"},"content":{"data":{"json":{"list":[{"Cost":230000,"Week":"Mar","Cost1":24800.63,"Cost2":205199.37,"Cost3":199999.37,"Budget":210000,"Target":500000,"Revenue":78},{"Cost":238000,"Week":"Apr","Cost1":99200.39,"Cost2":138799.61,"Cost3":200199.37,"Budget":224000,"Target":500000,"Revenue":80},{"Cost":221000,"Week":"May","Cost1":70200.54,"Cost2":150799.46,"Cost3":80799.46,"Budget":238000,"Target":500000,"Revenue":82},{"Cost":280000,"Week":"Jun","Cost1":158800.73,"Cost2":121199.27,"Cost3":108800.46,"Budget":252000,"Target":500000,"Revenue":91},{"Cost":325000,"Week":"Jul","Cost1":237200.74,"Cost2":87799.26,"Cost3":187799.26,"Budget":294000,"Target":600000,"Revenue":95}]},"path":"/list"},"feeds":[{"uid":"categoryAxis","type":"Dimension","values":["Weeks"]},{"uid":"valueAxis","type":"Measure","values":["Revenue"]}],"measures":[{"name":"Revenue","value":"{Revenue}"},{"name":"Cost"}],"chartType":"stacked_column","dimensions":[{"name":"Weeks","value":"{Week}"}],"chartProperties":{"title":{"text":"Utilization Projection","alignment":"left"},"plotArea":{"dataLabel":{"visible":false,"showTotal":true}},"valueAxis":{"title":{"visible":false}},"legendGroup":{"position":"bottom","alignment":"topLeft"},"categoryAxis":{"title":{"visible":false}}}},"configuration":{"parameters":{"title":{"label":"Title","value":"Digital Practice"},"subTitle":{"label":"Subtitle","value":"Current and Forecasted Utilization"},"details":{"label":"Details","value":"Based on planned project dates"}}}}}},"configurations":[{"id":"conf_viz_0","level":"PG","settings":{"value":{"/sap.card/configuration/parameters/title/value":"Digital Practice (PG - Viz)"},"schemaVersion":"3.2.0"}},{"id":"conf_viz_1","level":"CO","settings":{"value":{"/sap.card/configuration/parameters/title/value":"Digital Practice (CO - Viz)"},"schemaVersion":"3.2.0"}}],"descriptorResources":{"baseUrl":"","descriptorPath":""}},"my.comp.ns.cpkg_my.company.ns.line.chart.card.app#my.company.ns.line.chart.card.viz":{"id":"my.comp.ns.cpkg_my.company.ns.line.chart.card.app#my.company.ns.line.chart.card.viz","type":"sap.card","descriptor":{"value":{"sap.ui":{"icons":{"icon":"sap-icon://line-chart"},"technology":"UI5"},"sap.app":{"id":"my.company.ns.line.chart.card","i18n":"i18n/i18n.properties","info":"Additional information about this Card","tags":{"keywords":["{{DONUT_CHART_KEYWORD1}}","{{DONUT_CHART_KEYWORD2}}","{{DONUT_CHART_KEYWORD3}}","{{DONUT_CHART_KEYWORD4}}"]},"type":"card","title":"Line Chart Card","subTitle":"Sample of a Line Chart","shortTitle":"A short title for this Card","description":"A long description for this Card","artifactVersion":{"version":"1.0.0"}},"sap.flp":{"vizOptions":{"displayFormats":{"default":"standard","supported":["standard","standardWide","flat","flatWide","compact"]}}},"_version":"1.14.0","sap.card":{"type":"Analytical","header":{"data":{"json":{"unit":"K","state":"Error","trend":"Down","number":"65.34","target":{"unit":"K","number":100},"details":"Q1, 2018","deviation":{"state":"Critical","number":34.7}}},"type":"Numeric","title":"Project Cloud Transformation","details":"{details}","subTitle":"Revenue","mainIndicator":{"unit":"{unit}","state":"{state}","trend":"{trend}","number":"{number}"},"sideIndicators":[{"unit":"{target/unit}","title":"Target","number":"{target/number}"},{"unit":"%","state":"{deviation/state}","title":"Deviation","number":"{deviation/number}"}],"unitOfMeasurement":"EUR"},"content":{"data":{"json":{"list":[{"Cost":230000,"Week":"CW14","Cost1":24800.63,"Cost2":205199.37,"Cost3":199999.37,"Budget":210000,"Target":500000,"Revenue":431000.22},{"Cost":238000,"Week":"CW15","Cost1":99200.39,"Cost2":138799.61,"Cost3":200199.37,"Budget":224000,"Target":500000,"Revenue":494000.3},{"Cost":221000,"Week":"CW16","Cost1":70200.54,"Cost2":150799.46,"Cost3":80799.46,"Budget":238000,"Target":500000,"Revenue":491000.17},{"Cost":280000,"Week":"CW17","Cost1":158800.73,"Cost2":121199.27,"Cost3":108800.46,"Budget":252000,"Target":500000,"Revenue":536000.34},{"Cost":230000,"Week":"CW18","Cost1":140000.91,"Cost2":89999.09,"Cost3":100099.09,"Budget":266000,"Target":600000,"Revenue":675000},{"Cost":250000,"Week":"CW19","Cost1":172800.15,"Cost2":77199.85,"Cost3":57199.85,"Budget":280000,"Target":600000,"Revenue":680000},{"Cost":325000,"Week":"CW20","Cost1":237200.74,"Cost2":87799.26,"Cost3":187799.26,"Budget":294000,"Target":600000,"Revenue":659000.14}],"legend":{"visible":true,"position":"bottom","alignment":"topLeft"},"measures":{"costLabel":"Costs","revenueLabel":"Revenue"},"dimensions":{"weekLabel":"Weeks"}},"path":"/list"},"feeds":[{"uid":"valueAxis","type":"Measure","values":["{measures/revenueLabel}","{measures/costLabel}"]},{"uid":"categoryAxis","type":"Dimension","values":["{dimensions/weekLabel}"]}],"measures":[{"name":"{measures/revenueLabel}","value":"{Revenue}"},{"name":"{measures/costLabel}","value":"{Cost}"}],"chartType":"Line","dimensions":[{"name":"{dimensions/weekLabel}","value":"{Week}"}],"chartProperties":{"title":{"text":"Line Chart","visible":true,"alignment":"left"},"legend":{"visible":"{legend/visible}"},"plotArea":{"dataLabel":{"visible":true}},"valueAxis":{"title":{"visible":false}},"legendGroup":{"layout":{"position":"{legend/position}","alignment":"{legend/alignment}"}},"categoryAxis":{"title":{"visible":false}}}}}}},"configurations":[{"id":"conf_viz_0","level":"US","settings":{"value":{"/sap.card/header/title":"Project Cloud Transformation (US - Viz)"},"schemaVersion":"3.2.0"}},{"id":"conf_viz_1","level":"PR","settings":{"value":{"/sap.card/header/title":"Project Cloud Transformation (PR - Viz)"},"schemaVersion":"3.2.0"}},{"id":"conf_viz_2","level":"CO","settings":{"value":{"/sap.card/header/title":"Project Cloud Transformation (CO - Viz)"},"schemaVersion":"3.2.0"}},{"id":"conf_viz_3","level":"PG","settings":{"value":{"/sap.card/header/title":"Project Cloud Transformation (PG - Viz)","/sap.card/header/subTitle":"Revenue (PG - Viz)"},"schemaVersion":"3.2.0"}}],"descriptorResources":{"baseUrl":"/content-repository/v2/cards/my.company.ns.line.chart.card/e1087df0d5fcc0818a58d0ef778ee683","descriptorPath":""}},"provider2_5a119bf3-8540-42b6-a0b4-059db20cd459#Default-VizId":{"id":"provider2_5a119bf3-8540-42b6-a0b4-059db20cd459#Default-VizId","type":"sap.card","descriptor":{"value":{"sap.ui":{"icons":{"icon":"sap-icon://table-view"},"technology":"UI5"},"sap.app":{"id":"card.explorer.table.card","info":"Additional information about this Card","tags":{"keywords":["Table","Card","Sample"]},"type":"card","title":"Sample of a Table Card","subTitle":"Sample of a Table Card","shortTitle":"A short title for this Card","description":"A long description for this Card","applicationVersion":{"version":"1.0.0"}},"_version":"1.15.0","sap.card":{"data":{"json":[{"status":"Canceled","netAmount":"29","salesOrder":"5000010050","statusState":"Error","customerName":"Robert Brown","deliveryProgress":59},{"status":"Starting","netAmount":"30 | 230","salesOrder":"5000010051","statusState":"Warning","customerName":"SAP ERP Metraneo","deliveryProgress":85},{"status":"In Progress","netAmount":"12 | 69","salesOrder":"5000010052","statusState":"Error","customerName":"4KG AG","deliveryProgress":50},{"status":"Delayed","netAmount":"84","salesOrder":"5000010052","statusState":"Warning","customerName":"Clonemine","deliveryProgress":41}],"mockData":{"json":[{"status":"Canceled","netAmount":"29","salesOrder":"5000010050","statusState":"Error","customerName":"[Mocked] Robert Brown","deliveryProgress":59},{"status":"Starting","netAmount":"30 | 230","salesOrder":"5000010051","statusState":"Warning","customerName":"[Mocked] SAP ERP Metraneo","deliveryProgress":85},{"status":"In Progress","netAmount":"12 | 69","salesOrder":"5000010052","statusState":"Error","customerName":"[Mocked] 4KG AG","deliveryProgress":50},{"status":"Delayed","netAmount":"84","salesOrder":"5000010052","statusState":"Warning","customerName":"[Mocked] Clonemine","deliveryProgress":41}]}},"type":"Table","header":{"title":"{parameters>/title/value}","subTitle":"{parameters>/subTitle/value}","actions":[]},"content":{"row":{"actions":[],"columns":[{"title":"Project","value":"{salesOrder}","identifier":true},{"title":"Customer","value":"{customerName}"},{"title":"Staffing","value":"{netAmount}","hAlign":"End"},{"state":"{statusState}","title":"Status","value":"{status}"},{"title":"Staffing","progressIndicator":{"text":"{= format.percent(${deliveryProgress} / 100)}","state":"{statusState}","percent":"{deliveryProgress}"}}]}},"configuration":{"parameters":{"title":{"label":"Title","value":"Project Staffing Watchlist"},"subTitle":{"label":"Subtitle","value":"Today"}}}}}},"descriptorResources":{"baseUrl":"","descriptorPath":""},"configurations":[{"id":"conf_viz_0","level":"US","settings":{"value":{"/sap.card/configuration/parameters/subTitle/value":"Today (US - Viz)"},"schemaVersion":"3.2.0"}}]},"AppDescId1234":{"id":"AppDescId1234","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"AppDescId1234","title":"translated title of application","ach":"FIN-XX","applicationVersion":{"version":"1.0.0"},"destination":{"name":"U1YCLNT000"},"crossNavigation":{"inbounds":{"start":{"semanticObject":"Start","action":"me","signature":{"parameters":{"myParam":{"defaultValue":{"value":"myValue"},"required":true}},"additionalParameters":"allowed"}}}}},"sap.ui5":{"componentName":"sap.ushell.StaticAppLauncher"},"sap.ui":{"technology":"WDA","icons":{"icon":"sap-icon:\\\\/\\\\/Fiori2\\\\/F0018"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.wda":{"applicationId":"WDR_TEST_PORTAL_NAV_TARGET"},"sap.flp":{"type":"application","vizOptions":{"displayFormats":{"supported":["standard","standardWide","flat","flatWide","compact"],"default":"flatWide"}}}}}},"DisplayOnDesktopOnly":{"id":"DisplayOnDesktopOnly","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"title":"Display only on Desktop","id":"DisplayOnDesktopOnly","ach":"FIN-XX","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"start":{"semanticObject":"Display","action":"Desktop"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon:\\\\/\\\\/Fiori2\\\\/F0018"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.flp":{"type":"application","vizOptions":{"displayFormats":{"supported":["standard","standardWide","flat","flatWide","compact"],"default":"standardWide"}}}}}},"DisplayOnMobileOnly":{"id":"DisplayOnMobileOnly","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"title":"Display on Mobile","id":"DisplayOnMobileOnly","ach":"FIN-XX","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"start":{"semanticObject":"Display","action":"mobile"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon:\\\\/\\\\/Fiori2\\\\/F0018"},"deviceTypes":{"desktop":false,"tablet":false,"phone":true}},"sap.flp":{"type":"application"}}}},"DisplayOnTabletOnly":{"id":"DisplayOnTabletOnly","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"title":"Display on Tablet","id":"DisplayOnTabletOnly","ach":"FIN-XX","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"start":{"semanticObject":"Display","action":"tablet"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon:\\\\/\\\\/Fiori2\\\\/F0018"},"deviceTypes":{"desktop":false,"tablet":true,"phone":false}},"sap.flp":{"type":"application"}}}},"OnlyInCat":{"id":"OnlyInCat","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"OnlyInCat","title":"This App only in a catalog","ach":"FIN-XX","applicationVersion":{"version":"1.0.0"},"destination":{"name":"U1YCLNT000"},"crossNavigation":{"inbounds":{"start":{"semanticObject":"Only","action":"incat","signature":{}}}}},"sap.ui":{"technology":"WDA","icons":{"icon":"sap-icon:\\\\/\\\\/Fiori2\\\\/F0022"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.wda":{"applicationId":"WDR_TEST_PORTAL_NAV_TARGET"},"sap.flp":{"type":"application"}}}},"startWDA":{"id":"startWDA","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"startWDA","title":"Generic starter for WDA","subTitle":"sub title","ach":"CA-UI2-INT-FE","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"inb1":{"semanticObject":"Shell","action":"startWda","title":"start wda","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"technology":"WDA","icons":{"icon":"sap-icon:\\\\/\\\\/Fiori2\\\\/F0018"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.wda":{"applicationId":"WDR_TEST_PORTAL_NAV_TARGET"},"sap.flp":{"type":"application"}}}},"sap.ushell.example.startURL":{"id":"sap.ushell.example.startURL","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"X-SAP-UI2-CATALOGPAGE:ZGFCATA:ET091D7N8BTE2AR8TMMBRPBCK","applicationVersion":{"version":"1.0.0"},"title":"New York Times","subTitle":"","info":"The New York Times is an American daily newspaper","crossNavigation":{"inbounds":{"Shell-launchURL":{"semanticObject":"Shell","action":"launchURL","signature":{"parameters":{"sap-external-url":{"required":true,"filter":{"value":"https://www.nytimes.com","format":"plain"}}}}}}}},"sap.ui":{"_version":"1.3.0","technology":"URL","icons":{"icon":"sap-icon://world"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.url":{"uri":"https://www.nytimes.com"}}}},"sap.ushell.example.startURL2":{"id":"sap.ushell.example.startURL2","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"sap.ushell.example.startURL2","applicationVersion":{"version":"1.0.0"},"title":"Example Page...","subTitle":"a real example","description":"X-SAP-UI2-CATALOGPAGE:ZGFCATA:ET091D7N8BTE2AR8TMMBRPBCK","crossNavigation":{"inbounds":{"Shell-launchURL":{"semanticObject":"Shell","action":"launchURL","signature":{"parameters":{"sap-external-url":{"required":true,"filter":{"value":"https://www.example.com","format":"plain"}}}}}}}},"sap.ui":{"_version":"1.3.0","technology":"URL","icons":{"icon":"sap-icon://world"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.platform.runtime":{"uri":"https://www.example.com"}}}},"sap.ushell.example.startURL3":{"id":"sap.ushell.example.startURL3","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"sap.ushell.example.startURL3","applicationVersion":{"version":"1.0.0"},"title":"UI5 Demokit","subTitle":"a real demokit!","description":"X-SAP-UI2-CATALOGPAGE:ZGFCATA:ET091D7N8BTE2AR8TMMBRPBCK","crossNavigation":{"inbounds":{"Shell-launchURL":{"semanticObject":"Shell","action":"launchURL","signature":{"parameters":{"sap-external-url":{"required":true,"filter":{"value":"https://ui5.sap.com","format":"plain"}}}}}}}},"sap.ui":{"_version":"1.3.0","technology":"URL","icons":{"icon":"sap-icon://sap-ui5"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.platform.runtime":{"uri":"https://www.example.com"}}}},"sap.ushell.demo.AppNavSample":{"id":"sap.ushell.demo.AppNavSample","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"sap.ushell.demo.AppNavSample","title":"Demo actual title AppNavSample : Demos startup parameter passing","subTitle":"AppNavSample","ach":"CA-UI2-INT-FE","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"inb1":{"semanticObject":"Action","action":"toappnavsample","title":"This AppNavSample action has a special default value, but requires /ui2/par","signature":{"parameters":{"/ui2/par":{"required":true},"aand":{"defaultValue":{"value":"ddd=1234"}}},"additionalParameters":"allowed"}},"inb2":{"semanticObject":"Action","action":"toappnavsample","signature":{"parameters":{"P1":{"renameTo":"P1New"}},"additionalParameters":"allowed"}}}}},"sap.flp":{"type":"application"},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori2/F0018"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.ui5":{"componentName":"sap.ushell.demo.AppNavSample"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/AppNavSample?A=URL"}}}}},"sap.ushell.demo.LauncherValue":{"id":"sap.ushell.demo.LauncherValue","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"sap.ushell.demo.LauncherValue","title":"LauncherValue gets attached","subTitle":"Launch with value","ach":"CA-UI2-INT-FE","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"inb1":{"semanticObject":"Action","action":"toLauncher","signature":{"parameters":{"launch":{"required":true,"launcherValue":{"value":"putMeIntoTile"}},"aand":{"defaultValue":{"value":"ddd=1234"}}},"additionalParameters":"allowed"}}}}},"sap.flp":{"type":"application"},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori2/F0018"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.ui5":{"componentName":"sap.ushell.demo.AppNavSample"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/AppNavSample?A=URL"}}}}},"sap.ushell.demo.bookmark":{"id":"sap.ushell.demo.bookmark","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"sap.ushell.demo.bookmark","title":"Bookmark Sample App","subTitle":"sample subtitle","ach":"CA-UI2-INT-FE","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"target":{"semanticObject":"Action","action":"toBookmark","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.flp":{"type":"application"},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://favorite"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.demo.bookmark"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/BookmarkSample"}}}}},"OverloadedApp1":{"id":"OverloadedApp1","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"OverloadedApp1","title":"Bookmark Sample","subTitle":"#Overloaded-start","ach":"CA-UI2-INT-FE","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"Overloaded-start":{"semanticObject":"Overloaded","action":"start","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.flp":{"type":"application"},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://favorite"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.demo.bookmark"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/BookmarkSample"}}}}},"OverloadedApp2":{"id":"OverloadedApp2","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"OverloadedApp2","title":"AppNav Sample","subTitle":"#Overloaded-start","ach":"CA-UI2-INT-FE","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"Overloaded-start":{"semanticObject":"Overloaded","action":"start","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.flp":{"type":"application"},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori2/F0018"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.ui5":{"componentName":"sap.ushell.demo.AppNavSample"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/AppNavSample?A=URL"}}}}},"parameterRenameCase1":{"id":"parameterRenameCase1","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"X-PAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TRA8B06OQ70S","applicationVersion":{"version":"1.0.0"},"title":"Action parameter Rename Case 1","subTitle":"parameter Rename Case 1","ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"Action-parameterRename":{"semanticObject":"Action","action":"parameterRename","signature":{"additionalParameters":"allowed","parameters":{"Case":{"defaultValue":{"value":"1"}},"Description":{"defaultValue":{"value":"P1 -> P1New, P2 -> P2New"}},"P1":{"renameTo":"P1New"},"P2":{"renameTo":"P1New"}}}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori2/F0005"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.demoapps.ReceiveParametersTestApp"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/ReceiveParametersTestApp"}}}}},"appstateformsampledynamictile":{"id":"appstateformsampledynamictile","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"appstateformsampledynamictile","applicationVersion":{"version":"1.0.0"},"title":"App State form sample","subTitle":"parameter Rename Case 1","ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"Action-toappstateformsample":{"semanticObject":"Action","action":"toappstateformsample","indicatorDataSource":{"path":"../../test/counts/count1.json"},"signature":{"additionalParameters":"allowed","parameters":{"Case":{"defaultValue":{"value":"1"}},"Description":{"defaultValue":{"value":"Showed some dynamic tiles"}},"P1":{"renameTo":"P1New"},"P2":{"renameTo":"P1New"}}}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori2/F0005"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.demo.AppStateFormSample"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/AppStateFormSample"}}}}},"AppStateSampleIcon":{"id":"AppStateSampleIcon","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"AppStateSampleIcon","applicationVersion":{"version":"1.0.0"},"title":"App State - Icons","shortTitle":"icons","subTitle":"icons with categories","ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"Action-toappstatesample":{"semanticObject":"Action","action":"toappstatesample","signature":{"additionalParameters":"allowed","parameters":{}}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori2/F0005"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.demo.AppStateSample"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/AppStateSample"}}}}},"AppPersSampleFav":{"id":"AppPersSampleFav","type":"sap.ushell.DynamicAppLauncher","descriptor":{"value":{"sap.app":{"id":"AppPersSampleFav","applicationVersion":{"version":"1.0.0"},"title":"App Personalization Sample Favourites","subTitle":"set favourites","shortTitle":"fav","ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"Action-toAppPersSampleFav":{"semanticObject":"Action","action":"toAppPersSampleFav","signature":{"additionalParameters":"allowed","parameters":{}}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://undefined/favorite"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.demo.AppPersSample"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/AppPersSample"}}}}}}}';
                // console.log(JSON.parse(string));
                this.oModel = new JSONModel({
                    maxColumns: MAX_COLUMNS_PER_ROW,
                    editMode: false,
                    previewMode: false,
                    loaded: false,
                    navigationDisabled: false,
                    showFooter: false,
                    showPageTitle: true,
                    data: {
                        workPage: null,
                        visualizations: [],
                        usedVisualizations: []
                    }
                });
                // this._ViewData();
                this.oModel.setSizeLimit(Infinity);
                this._saveHost();

                oWorkPage.bindElement({
                    path: "/data/workPage",
                });

                this.getView().setModel(this.oModel);
                this.getView().getModel();
                WorkPageBuilderLayoutHelper.register(oWorkPage);
                this.getView().setModel(WorkPageBuilderLayoutHelper.getModel(), "viewSettings");
            },



            workPageBuilderComponentCreated: function (oEvent) {
                this.oComponent = oEvent.getParameter("component");

                this.oComponent.setNavigationDisabled(true);

                this.oComponent.attachEvent("visualizationFilterApplied", this.getVisualizations, this);

                this.oComponent.setPageData(WorkPageBuilderData);
            },

            getVisualizations: function (oEvent) {
                var iSkip = oEvent.getParameter("pagination").skip;
                var iTop = oEvent.getParameter("pagination").top;
                var aTypes = oEvent.getParameter("types") || [];
                var sSearchTerm = oEvent.getParameter("search");

                if (aTypes.length > 0) {
                    aVisualizations = aVisualizations.filter(function (oViz) {
                        return aTypes.indexOf(oViz.type) > -1;
                    });
                }

                if (sSearchTerm) {
                    aVisualizations = aVisualizations.filter(function (oViz) {
                        return oViz.descriptor.value["sap.app"].title.indexOf(sSearchTerm) > -1;
                    });
                }

                // Fake server call time
                setTimeout(function () {
                    this.oComponent.setVisualizationData({
                        visualizations: {
                            totalCount: aVisualizations.length,
                            nodes: aVisualizations.slice(iSkip, iSkip + iTop)
                        }
                    });
                }.bind(this), 2000);
            },

            toggleEditMode: function (oEvent) {
                var bEditMode = oEvent.getParameter("state");
                this.byId("toggleFooter").setEnabled(bEditMode);
                this.oComponent.setEditMode(oEvent.getParameter("state"));
            },
            togglePreviewMode: function (oEvent) {
                this.oComponent.setPreviewMode(oEvent.getParameter("state"));
            },
            togglePageTitle: function (oEvent) {
                this.oComponent.setShowPageTitle(oEvent.getParameter("state"));
            },
            toggleFooter: function (oEvent) {
                this.oComponent.setShowFooter(oEvent.getParameter("state"));
            },

            // _ViewData: function () {
            //   // let usedVisualizations =
            //   //   '{"provider1_8adf91e9-b17a-425e-8053-f39b62f0c31e#Default-VizId":{"id":"provider1_8adf91e9-b17a-425e-8053-f39b62f0c31e#Default-VizId","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"tile1","title":"I am hungry","subTitle":"lets eat"},"sap.flp":{"target":{"type":"URL","url":"https://fiorilaunchpad.sap.com/sites#lunch-menu&/favorites/?language=de"},"indicatorDataSource":{"path":"/mockbackend/dynamictile","refresh":60},"vizOptions":{"displayFormats":{"supported":["standard","standardWide","flat","flatWide","compact"],"default":"flat"}}},"sap.ui":{"icons":{"icon":"sap-icon://meal"}}}},"descriptorResources":{"baseUrl":"","descriptorPath":""}},"provider1_f95ad84a-65d0-4c39-9a67-09a4efe04f92#Default-VizId":{"id":"provider1_f95ad84a-65d0-4c39-9a67-09a4efe04f92#Default-VizId","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.ui":{"icons":{"icon":"sap-icon://Fiori9/F1354"}},"sap.app":{"ach":"SLC-EVL","title":"Translate Evaluation Templates","subTitle":"Evaluation"},"sap.flp":{"vizOptions":{"displayFormats":{"supported":["standard","standardWide","flat","flatWide","compact"],"default":"standard"}},"target":{"type":"IBN","appId":"uyz200pp_0D3DD649E4DE6B79D2AF02C3D904A3AF","inboundId":"ET090PW4NWFHYIXAAGVEZB82L","parameters":{"sap-ui-tech-hint":{"value":{"value":"UI5","format":"plain"}}}}},"sap.fiori":{"registrationIds":["F2198"]}}},"descriptorResources":{"baseUrl":"","descriptorPath":""}},"provider1_a152d792-a43e-48eb-aafd-51451a6168e9#Default-VizId":{"id":"provider1_a152d792-a43e-48eb-aafd-51451a6168e9#Default-VizId","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"ach":"MM-PUR-REQ","title":"Monitor Purchase Requisition Items"},"sap.flp":{"target":{"semanticObject":"PurchaseRequisitionItem","action":"monitor"}},"sap.fiori":{"registrationIds":["F2424"]}}},"descriptorResources":{"baseUrl":"","descriptorPath":""}},"provider2_97176e7f-b2ea-4e31-842a-3efa5086b329#Default-VizId":{"id":"provider2_97176e7f-b2ea-4e31-842a-3efa5086b329#Default-VizId","type":"sap.ushell.DynamicAppLauncher","descriptor":{"value":{"sap.app":{"title":"Capital Projects","subTitle":"All about Finance","info":"desktop only"},"sap.ui":{"icons":{"icon":"sap-icon://capital-projects"}},"sap.flp":{"type":"tile","vizOptions":{"displayFormats":{"supported":["standard","standardWide","compact","flat","flatWide"],"default":"standard"}},"target":{"semanticObject":"Action","action":"toappnavsample"},"indicatorDataSource":{"path":"../../test/counts/v2/$count.txt","refresh":300}}}},"descriptorResources":{"baseUrl":"","descriptorPath":""}},"provider2_2ce8c859-b668-40d8-9c22-3a7dc018afd3#Default-VizId":{"id":"provider2_2ce8c859-b668-40d8-9c22-3a7dc018afd3#Default-VizId","type":"sap.ushell.DynamicAppLauncher","descriptor":{"value":{"sap.app":{"title":"Dynamic Tile","subTitle":"with separate dataSource and content provider","dataSources":{"indicator":{"uri":"../../test/counts"}}},"sap.ui":{"icons":{"icon":"sap-icon://number-sign"}},"sap.flp":{"type":"tile","vizOptions":{"displayFormats":{"supported":["standard","standardWide","compact","flat","flatWide"],"default":"standard"}},"target":{"type":"IBN","appId":"sap.ushell.demo.bookmark-LOCAL_REL_XHR_PATHPREFIX","inboundId":"target"},"indicatorDataSource":{"path":"count22.json","refresh":300,"dataSource":"indicator"}}}},"descriptorResources":{"baseUrl":"","descriptorPath":""}},"provider2_1e504721-8532-4a80-8fdd-0d88744c336f#Default-VizId":{"id":"provider2_1e504721-8532-4a80-8fdd-0d88744c336f#Default-VizId","type":"sap.card","descriptor":{"value":{"sap.ui":{"icons":{"icon":"sap-icon://full-stacked-column-chart"},"technology":"UI5"},"sap.app":{"id":"card.explorer.stacked.column.card","info":"Additional information about this Card","tags":{"keywords":["Analytical","Card","Stacked Column","Sample"]},"type":"card","title":"Sample of a Stacked Column Chart","subTitle":"Sample of a Stacked Column Chart","shortTitle":"A short title for this Card","description":"A long description for this Card","applicationVersion":{"version":"1.0.0"}},"_version":"1.14.0","sap.card":{"type":"Analytical","header":{"data":{"json":{"n":"84","u":"%","trend":"Up","valueColor":"Good"}},"type":"Numeric","title":"{parameters>/title/value}","details":"{parameters>/details/value}","subTitle":"{parameters>/subTitle/value}","icon":{"src":"sap-icon://desktop-mobile"},"mainIndicator":{"unit":"{u}","state":"{valueColor}","trend":"{trend}","number":"{n}"},"sideIndicators":[{"unit":"%","title":"Target","number":"85"},{"unit":"%","title":"Deviation","number":"15"}],"unitOfMeasurement":"%"},"content":{"data":{"json":{"list":[{"Cost":230000,"Week":"Mar","Cost1":24800.63,"Cost2":205199.37,"Cost3":199999.37,"Budget":210000,"Target":500000,"Revenue":78},{"Cost":238000,"Week":"Apr","Cost1":99200.39,"Cost2":138799.61,"Cost3":200199.37,"Budget":224000,"Target":500000,"Revenue":80},{"Cost":221000,"Week":"May","Cost1":70200.54,"Cost2":150799.46,"Cost3":80799.46,"Budget":238000,"Target":500000,"Revenue":82},{"Cost":280000,"Week":"Jun","Cost1":158800.73,"Cost2":121199.27,"Cost3":108800.46,"Budget":252000,"Target":500000,"Revenue":91},{"Cost":325000,"Week":"Jul","Cost1":237200.74,"Cost2":87799.26,"Cost3":187799.26,"Budget":294000,"Target":600000,"Revenue":95}]},"path":"/list"},"feeds":[{"uid":"categoryAxis","type":"Dimension","values":["Weeks"]},{"uid":"valueAxis","type":"Measure","values":["Revenue"]}],"measures":[{"name":"Revenue","value":"{Revenue}"},{"name":"Cost"}],"chartType":"stacked_column","dimensions":[{"name":"Weeks","value":"{Week}"}],"chartProperties":{"title":{"text":"Utilization Projection","alignment":"left"},"plotArea":{"dataLabel":{"visible":false,"showTotal":true}},"valueAxis":{"title":{"visible":false}},"legendGroup":{"position":"bottom","alignment":"topLeft"},"categoryAxis":{"title":{"visible":false}}}},"configuration":{"parameters":{"title":{"label":"Title","value":"Digital Practice"},"subTitle":{"label":"Subtitle","value":"Current and Forecasted Utilization"},"details":{"label":"Details","value":"Based on planned project dates"}}}}}},"configurations":[{"id":"conf_viz_0","level":"PG","settings":{"value":{"/sap.card/configuration/parameters/title/value":"Digital Practice (PG - Viz)"},"schemaVersion":"3.2.0"}},{"id":"conf_viz_1","level":"CO","settings":{"value":{"/sap.card/configuration/parameters/title/value":"Digital Practice (CO - Viz)"},"schemaVersion":"3.2.0"}}],"descriptorResources":{"baseUrl":"","descriptorPath":""}},"my.comp.ns.cpkg_my.company.ns.line.chart.card.app#my.company.ns.line.chart.card.viz":{"id":"my.comp.ns.cpkg_my.company.ns.line.chart.card.app#my.company.ns.line.chart.card.viz","type":"sap.card","descriptor":{"value":{"sap.ui":{"icons":{"icon":"sap-icon://line-chart"},"technology":"UI5"},"sap.app":{"id":"my.company.ns.line.chart.card","i18n":"i18n/i18n.properties","info":"Additional information about this Card","tags":{"keywords":["{{DONUT_CHART_KEYWORD1}}","{{DONUT_CHART_KEYWORD2}}","{{DONUT_CHART_KEYWORD3}}","{{DONUT_CHART_KEYWORD4}}"]},"type":"card","title":"Line Chart Card","subTitle":"Sample of a Line Chart","shortTitle":"A short title for this Card","description":"A long description for this Card","artifactVersion":{"version":"1.0.0"}},"sap.flp":{"vizOptions":{"displayFormats":{"default":"standard","supported":["standard","standardWide","flat","flatWide","compact"]}}},"_version":"1.14.0","sap.card":{"type":"Analytical","header":{"data":{"json":{"unit":"K","state":"Error","trend":"Down","number":"65.34","target":{"unit":"K","number":100},"details":"Q1, 2018","deviation":{"state":"Critical","number":34.7}}},"type":"Numeric","title":"Project Cloud Transformation","details":"{details}","subTitle":"Revenue","mainIndicator":{"unit":"{unit}","state":"{state}","trend":"{trend}","number":"{number}"},"sideIndicators":[{"unit":"{target/unit}","title":"Target","number":"{target/number}"},{"unit":"%","state":"{deviation/state}","title":"Deviation","number":"{deviation/number}"}],"unitOfMeasurement":"EUR"},"content":{"data":{"json":{"list":[{"Cost":230000,"Week":"CW14","Cost1":24800.63,"Cost2":205199.37,"Cost3":199999.37,"Budget":210000,"Target":500000,"Revenue":431000.22},{"Cost":238000,"Week":"CW15","Cost1":99200.39,"Cost2":138799.61,"Cost3":200199.37,"Budget":224000,"Target":500000,"Revenue":494000.3},{"Cost":221000,"Week":"CW16","Cost1":70200.54,"Cost2":150799.46,"Cost3":80799.46,"Budget":238000,"Target":500000,"Revenue":491000.17},{"Cost":280000,"Week":"CW17","Cost1":158800.73,"Cost2":121199.27,"Cost3":108800.46,"Budget":252000,"Target":500000,"Revenue":536000.34},{"Cost":230000,"Week":"CW18","Cost1":140000.91,"Cost2":89999.09,"Cost3":100099.09,"Budget":266000,"Target":600000,"Revenue":675000},{"Cost":250000,"Week":"CW19","Cost1":172800.15,"Cost2":77199.85,"Cost3":57199.85,"Budget":280000,"Target":600000,"Revenue":680000},{"Cost":325000,"Week":"CW20","Cost1":237200.74,"Cost2":87799.26,"Cost3":187799.26,"Budget":294000,"Target":600000,"Revenue":659000.14}],"legend":{"visible":true,"position":"bottom","alignment":"topLeft"},"measures":{"costLabel":"Costs","revenueLabel":"Revenue"},"dimensions":{"weekLabel":"Weeks"}},"path":"/list"},"feeds":[{"uid":"valueAxis","type":"Measure","values":["{measures/revenueLabel}","{measures/costLabel}"]},{"uid":"categoryAxis","type":"Dimension","values":["{dimensions/weekLabel}"]}],"measures":[{"name":"{measures/revenueLabel}","value":"{Revenue}"},{"name":"{measures/costLabel}","value":"{Cost}"}],"chartType":"Line","dimensions":[{"name":"{dimensions/weekLabel}","value":"{Week}"}],"chartProperties":{"title":{"text":"Line Chart","visible":true,"alignment":"left"},"legend":{"visible":"{legend/visible}"},"plotArea":{"dataLabel":{"visible":true}},"valueAxis":{"title":{"visible":false}},"legendGroup":{"layout":{"position":"{legend/position}","alignment":"{legend/alignment}"}},"categoryAxis":{"title":{"visible":false}}}}}}},"configurations":[{"id":"conf_viz_0","level":"US","settings":{"value":{"/sap.card/header/title":"Project Cloud Transformation (US - Viz)"},"schemaVersion":"3.2.0"}},{"id":"conf_viz_1","level":"PR","settings":{"value":{"/sap.card/header/title":"Project Cloud Transformation (PR - Viz)"},"schemaVersion":"3.2.0"}},{"id":"conf_viz_2","level":"CO","settings":{"value":{"/sap.card/header/title":"Project Cloud Transformation (CO - Viz)"},"schemaVersion":"3.2.0"}},{"id":"conf_viz_3","level":"PG","settings":{"value":{"/sap.card/header/title":"Project Cloud Transformation (PG - Viz)","/sap.card/header/subTitle":"Revenue (PG - Viz)"},"schemaVersion":"3.2.0"}}],"descriptorResources":{"baseUrl":"/content-repository/v2/cards/my.company.ns.line.chart.card/e1087df0d5fcc0818a58d0ef778ee683","descriptorPath":""}},"provider2_5a119bf3-8540-42b6-a0b4-059db20cd459#Default-VizId":{"id":"provider2_5a119bf3-8540-42b6-a0b4-059db20cd459#Default-VizId","type":"sap.card","descriptor":{"value":{"sap.ui":{"icons":{"icon":"sap-icon://table-view"},"technology":"UI5"},"sap.app":{"id":"card.explorer.table.card","info":"Additional information about this Card","tags":{"keywords":["Table","Card","Sample"]},"type":"card","title":"Sample of a Table Card","subTitle":"Sample of a Table Card","shortTitle":"A short title for this Card","description":"A long description for this Card","applicationVersion":{"version":"1.0.0"}},"_version":"1.15.0","sap.card":{"data":{"json":[{"status":"Canceled","netAmount":"29","salesOrder":"5000010050","statusState":"Error","customerName":"Robert Brown","deliveryProgress":59},{"status":"Starting","netAmount":"30 | 230","salesOrder":"5000010051","statusState":"Warning","customerName":"SAP ERP Metraneo","deliveryProgress":85},{"status":"In Progress","netAmount":"12 | 69","salesOrder":"5000010052","statusState":"Error","customerName":"4KG AG","deliveryProgress":50},{"status":"Delayed","netAmount":"84","salesOrder":"5000010052","statusState":"Warning","customerName":"Clonemine","deliveryProgress":41}],"mockData":{"json":[{"status":"Canceled","netAmount":"29","salesOrder":"5000010050","statusState":"Error","customerName":"[Mocked] Robert Brown","deliveryProgress":59},{"status":"Starting","netAmount":"30 | 230","salesOrder":"5000010051","statusState":"Warning","customerName":"[Mocked] SAP ERP Metraneo","deliveryProgress":85},{"status":"In Progress","netAmount":"12 | 69","salesOrder":"5000010052","statusState":"Error","customerName":"[Mocked] 4KG AG","deliveryProgress":50},{"status":"Delayed","netAmount":"84","salesOrder":"5000010052","statusState":"Warning","customerName":"[Mocked] Clonemine","deliveryProgress":41}]}},"type":"Table","header":{"title":"{parameters>/title/value}","subTitle":"{parameters>/subTitle/value}","actions":[]},"content":{"row":{"actions":[],"columns":[{"title":"Project","value":"{salesOrder}","identifier":true},{"title":"Customer","value":"{customerName}"},{"title":"Staffing","value":"{netAmount}","hAlign":"End"},{"state":"{statusState}","title":"Status","value":"{status}"},{"title":"Staffing","progressIndicator":{"text":"{= format.percent(${deliveryProgress} / 100)}","state":"{statusState}","percent":"{deliveryProgress}"}}]}},"configuration":{"parameters":{"title":{"label":"Title","value":"Project Staffing Watchlist"},"subTitle":{"label":"Subtitle","value":"Today"}}}}}},"descriptorResources":{"baseUrl":"","descriptorPath":""},"configurations":[{"id":"conf_viz_0","level":"US","settings":{"value":{"/sap.card/configuration/parameters/subTitle/value":"Today (US - Viz)"},"schemaVersion":"3.2.0"}}]},"AppDescId1234":{"id":"AppDescId1234","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"AppDescId1234","title":"translated title of application","ach":"FIN-XX","applicationVersion":{"version":"1.0.0"},"destination":{"name":"U1YCLNT000"},"crossNavigation":{"inbounds":{"start":{"semanticObject":"Start","action":"me","signature":{"parameters":{"myParam":{"defaultValue":{"value":"myValue"},"required":true}},"additionalParameters":"allowed"}}}}},"sap.ui5":{"componentName":"sap.ushell.StaticAppLauncher"},"sap.ui":{"technology":"WDA","icons":{"icon":"sap-icon:\\\\/\\\\/Fiori2\\\\/F0018"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.wda":{"applicationId":"WDR_TEST_PORTAL_NAV_TARGET"},"sap.flp":{"type":"application","vizOptions":{"displayFormats":{"supported":["standard","standardWide","flat","flatWide","compact"],"default":"flatWide"}}}}}},"DisplayOnDesktopOnly":{"id":"DisplayOnDesktopOnly","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"title":"Display only on Desktop","id":"DisplayOnDesktopOnly","ach":"FIN-XX","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"start":{"semanticObject":"Display","action":"Desktop"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon:\\\\/\\\\/Fiori2\\\\/F0018"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.flp":{"type":"application","vizOptions":{"displayFormats":{"supported":["standard","standardWide","flat","flatWide","compact"],"default":"standardWide"}}}}}},"DisplayOnMobileOnly":{"id":"DisplayOnMobileOnly","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"title":"Display on Mobile","id":"DisplayOnMobileOnly","ach":"FIN-XX","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"start":{"semanticObject":"Display","action":"mobile"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon:\\\\/\\\\/Fiori2\\\\/F0018"},"deviceTypes":{"desktop":false,"tablet":false,"phone":true}},"sap.flp":{"type":"application"}}}},"DisplayOnTabletOnly":{"id":"DisplayOnTabletOnly","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"title":"Display on Tablet","id":"DisplayOnTabletOnly","ach":"FIN-XX","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"start":{"semanticObject":"Display","action":"tablet"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon:\\\\/\\\\/Fiori2\\\\/F0018"},"deviceTypes":{"desktop":false,"tablet":true,"phone":false}},"sap.flp":{"type":"application"}}}},"OnlyInCat":{"id":"OnlyInCat","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"OnlyInCat","title":"This App only in a catalog","ach":"FIN-XX","applicationVersion":{"version":"1.0.0"},"destination":{"name":"U1YCLNT000"},"crossNavigation":{"inbounds":{"start":{"semanticObject":"Only","action":"incat","signature":{}}}}},"sap.ui":{"technology":"WDA","icons":{"icon":"sap-icon:\\\\/\\\\/Fiori2\\\\/F0022"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.wda":{"applicationId":"WDR_TEST_PORTAL_NAV_TARGET"},"sap.flp":{"type":"application"}}}},"startWDA":{"id":"startWDA","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"startWDA","title":"Generic starter for WDA","subTitle":"sub title","ach":"CA-UI2-INT-FE","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"inb1":{"semanticObject":"Shell","action":"startWda","title":"start wda","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"technology":"WDA","icons":{"icon":"sap-icon:\\\\/\\\\/Fiori2\\\\/F0018"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.wda":{"applicationId":"WDR_TEST_PORTAL_NAV_TARGET"},"sap.flp":{"type":"application"}}}},"sap.ushell.example.startURL":{"id":"sap.ushell.example.startURL","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"X-SAP-UI2-CATALOGPAGE:ZGFCATA:ET091D7N8BTE2AR8TMMBRPBCK","applicationVersion":{"version":"1.0.0"},"title":"New York Times","subTitle":"","info":"The New York Times is an American daily newspaper","crossNavigation":{"inbounds":{"Shell-launchURL":{"semanticObject":"Shell","action":"launchURL","signature":{"parameters":{"sap-external-url":{"required":true,"filter":{"value":"https://www.nytimes.com","format":"plain"}}}}}}}},"sap.ui":{"_version":"1.3.0","technology":"URL","icons":{"icon":"sap-icon://world"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.url":{"uri":"https://www.nytimes.com"}}}},"sap.ushell.example.startURL2":{"id":"sap.ushell.example.startURL2","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"sap.ushell.example.startURL2","applicationVersion":{"version":"1.0.0"},"title":"Example Page...","subTitle":"a real example","description":"X-SAP-UI2-CATALOGPAGE:ZGFCATA:ET091D7N8BTE2AR8TMMBRPBCK","crossNavigation":{"inbounds":{"Shell-launchURL":{"semanticObject":"Shell","action":"launchURL","signature":{"parameters":{"sap-external-url":{"required":true,"filter":{"value":"https://www.example.com","format":"plain"}}}}}}}},"sap.ui":{"_version":"1.3.0","technology":"URL","icons":{"icon":"sap-icon://world"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.platform.runtime":{"uri":"https://www.example.com"}}}},"sap.ushell.example.startURL3":{"id":"sap.ushell.example.startURL3","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"sap.ushell.example.startURL3","applicationVersion":{"version":"1.0.0"},"title":"UI5 Demokit","subTitle":"a real demokit!","description":"X-SAP-UI2-CATALOGPAGE:ZGFCATA:ET091D7N8BTE2AR8TMMBRPBCK","crossNavigation":{"inbounds":{"Shell-launchURL":{"semanticObject":"Shell","action":"launchURL","signature":{"parameters":{"sap-external-url":{"required":true,"filter":{"value":"https://ui5.sap.com","format":"plain"}}}}}}}},"sap.ui":{"_version":"1.3.0","technology":"URL","icons":{"icon":"sap-icon://sap-ui5"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.platform.runtime":{"uri":"https://www.example.com"}}}},"sap.ushell.demo.AppNavSample":{"id":"sap.ushell.demo.AppNavSample","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"sap.ushell.demo.AppNavSample","title":"Demo actual title AppNavSample : Demos startup parameter passing","subTitle":"AppNavSample","ach":"CA-UI2-INT-FE","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"inb1":{"semanticObject":"Action","action":"toappnavsample","title":"This AppNavSample action has a special default value, but requires /ui2/par","signature":{"parameters":{"/ui2/par":{"required":true},"aand":{"defaultValue":{"value":"ddd=1234"}}},"additionalParameters":"allowed"}},"inb2":{"semanticObject":"Action","action":"toappnavsample","signature":{"parameters":{"P1":{"renameTo":"P1New"}},"additionalParameters":"allowed"}}}}},"sap.flp":{"type":"application"},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori2/F0018"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.ui5":{"componentName":"sap.ushell.demo.AppNavSample"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/AppNavSample?A=URL"}}}}},"sap.ushell.demo.LauncherValue":{"id":"sap.ushell.demo.LauncherValue","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"sap.ushell.demo.LauncherValue","title":"LauncherValue gets attached","subTitle":"Launch with value","ach":"CA-UI2-INT-FE","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"inb1":{"semanticObject":"Action","action":"toLauncher","signature":{"parameters":{"launch":{"required":true,"launcherValue":{"value":"putMeIntoTile"}},"aand":{"defaultValue":{"value":"ddd=1234"}}},"additionalParameters":"allowed"}}}}},"sap.flp":{"type":"application"},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori2/F0018"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.ui5":{"componentName":"sap.ushell.demo.AppNavSample"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/AppNavSample?A=URL"}}}}},"sap.ushell.demo.bookmark":{"id":"sap.ushell.demo.bookmark","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"sap.ushell.demo.bookmark","title":"Bookmark Sample App","subTitle":"sample subtitle","ach":"CA-UI2-INT-FE","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"target":{"semanticObject":"Action","action":"toBookmark","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.flp":{"type":"application"},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://favorite"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.demo.bookmark"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/BookmarkSample"}}}}},"OverloadedApp1":{"id":"OverloadedApp1","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"OverloadedApp1","title":"Bookmark Sample","subTitle":"#Overloaded-start","ach":"CA-UI2-INT-FE","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"Overloaded-start":{"semanticObject":"Overloaded","action":"start","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.flp":{"type":"application"},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://favorite"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.demo.bookmark"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/BookmarkSample"}}}}},"OverloadedApp2":{"id":"OverloadedApp2","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"OverloadedApp2","title":"AppNav Sample","subTitle":"#Overloaded-start","ach":"CA-UI2-INT-FE","applicationVersion":{"version":"1.0.0"},"crossNavigation":{"inbounds":{"Overloaded-start":{"semanticObject":"Overloaded","action":"start","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.flp":{"type":"application"},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori2/F0018"},"deviceTypes":{"desktop":true,"tablet":false,"phone":false}},"sap.ui5":{"componentName":"sap.ushell.demo.AppNavSample"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/AppNavSample?A=URL"}}}}},"parameterRenameCase1":{"id":"parameterRenameCase1","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"X-PAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TRA8B06OQ70S","applicationVersion":{"version":"1.0.0"},"title":"Action parameter Rename Case 1","subTitle":"parameter Rename Case 1","ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"Action-parameterRename":{"semanticObject":"Action","action":"parameterRename","signature":{"additionalParameters":"allowed","parameters":{"Case":{"defaultValue":{"value":"1"}},"Description":{"defaultValue":{"value":"P1 -> P1New, P2 -> P2New"}},"P1":{"renameTo":"P1New"},"P2":{"renameTo":"P1New"}}}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori2/F0005"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.demoapps.ReceiveParametersTestApp"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/ReceiveParametersTestApp"}}}}},"appstateformsampledynamictile":{"id":"appstateformsampledynamictile","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"appstateformsampledynamictile","applicationVersion":{"version":"1.0.0"},"title":"App State form sample","subTitle":"parameter Rename Case 1","ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"Action-toappstateformsample":{"semanticObject":"Action","action":"toappstateformsample","indicatorDataSource":{"path":"../../test/counts/count1.json"},"signature":{"additionalParameters":"allowed","parameters":{"Case":{"defaultValue":{"value":"1"}},"Description":{"defaultValue":{"value":"Showed some dynamic tiles"}},"P1":{"renameTo":"P1New"},"P2":{"renameTo":"P1New"}}}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori2/F0005"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.demo.AppStateFormSample"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/AppStateFormSample"}}}}},"AppStateSampleIcon":{"id":"AppStateSampleIcon","type":"sap.ushell.StaticAppLauncher","descriptor":{"value":{"sap.app":{"id":"AppStateSampleIcon","applicationVersion":{"version":"1.0.0"},"title":"App State - Icons","shortTitle":"icons","subTitle":"icons with categories","ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"Action-toappstatesample":{"semanticObject":"Action","action":"toappstatesample","signature":{"additionalParameters":"allowed","parameters":{}}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://Fiori2/F0005"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.demo.AppStateSample"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/AppStateSample"}}}}},"AppPersSampleFav":{"id":"AppPersSampleFav","type":"sap.ushell.DynamicAppLauncher","descriptor":{"value":{"sap.app":{"id":"AppPersSampleFav","applicationVersion":{"version":"1.0.0"},"title":"App Personalization Sample Favourites","subTitle":"set favourites","shortTitle":"fav","ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"Action-toAppPersSampleFav":{"semanticObject":"Action","action":"toAppPersSampleFav","signature":{"additionalParameters":"allowed","parameters":{}}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://undefined/favorite"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.demo.AppPersSample"},"sap.platform.runtime":{"componentProperties":{"url":"../../demoapps/AppPersSample"}}}}}}';
            //   const oData = {
            //     workPage: {
            //       id: "cep-standard-workpage",
            //       descriptor: {
            //         value: {
            //           title: "CEP Standard WorkPage",
            //           description: "",
            //         },
            //         schemaVersion: "3.2.0",
            //       },
            //       rows: [
            //         {
            //           id: "row0",
            //           configurations: [],
            //           descriptor: {
            //             value: {
            //               title: "First Section: Tiles",
            //             },
            //             schemaVersion: "3.2.0",
            //           },
            //           columns: [
            //             {
            //               id: "row0_col0",
            //               descriptor: {
            //                 value: {
            //                   columnWidth: 12,
            //                 },
            //                 schemaVersion: "3.2.0",
            //               },
            //               configurations: [],
            //               cells: [
            //                 {
            //                   id: "row0_col0_cell0",
            //                   descriptor: {
            //                     value: {
            //                       mode: "Section",
            //                     },
            //                     schemaVersion: "3.2.0",
            //                   },
            //                   configurations: [],
            //                   widgets: [
            //                     {
            //                       id: "dynamic_tile_0",
            //                       tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
            //                       instanceId:
            //                         "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
            //                       configurations: [],
            //                       visualization: {
            //                         id: "hello",
            //                       },
            //                     },
            //                   ],
            //                 },
            //               ],
            //             },
            //             {
            //               id: "row0_col1",
            //               descriptor: {
            //                 value: {
            //                   columnWidth: 12,
            //                 },
            //                 schemaVersion: "3.2.0",
            //               },
            //               configurations: [],
            //               cells: [
            //                 {
            //                   id: "row0_col1_cell0",
            //                   descriptor: {
            //                     value: {
            //                       mode: "Section",
            //                     },
            //                     schemaVersion: "3.2.0",
            //                   },
            //                   configurations: [],
            //                   widgets: [
            //                     {
            //                       id: "dynamic_tile_0",
            //                       tenantId: "a12ff5b4-f542-4fd0-ae52-319bddd789a5",
            //                       instanceId:
            //                         "1d59c4d7-5985-4f21-ad3c-1ac66bf14d2a",
            //                       configurations: [
            //                         {
            //                           id: "conf_widget_3",
            //                           level: "PG",
            //                           settings: {
            //                             value: {
            //                               "/sap.card/header/title":
            //                                 "Project Cloud Transformation (PG - Widget)",
            //                             },
            //                             schemaVersion: "3.2.0",
            //                           },
            //                         },
            //                       ],
            //                       visualization: {
            //                         id: "hello2",
            //                       },
            //                     },
            //                   ],
            //                 },
            //               ],
            //             },
            //           ],
            //         },
            //       ],
            //     },
            //     usedVisualizations: {
            //       hello: {
            //         id: "hello",
            //         type: "sap.ushell.StaticAppLauncher",
            //         descriptor: {
            //           /// 타일의 content
            //           value: {
            //             "sap.app": {
            //               // 타일의 정보
            //               id: "tile1",
            //               title: "테스트 타일",
            //               subTitle: "테스트중 입니다",
            //             },
            //             "sap.flp": {
            //               // 타일의 타입
            //               type: "tile",
            //               vizOptions: {
            //                 displayFormats: {
            //                   supported: [
            //                     // 지원 가능한 타입 (compact는 적용이 되지않았음)
            //                     "standard",
            //                     "standardWide",
            //                     "flat",
            //                     "flatWide",
            //                     "compact",
            //                   ],
            //                   default: "standard",
            //                 },
            //               },
            //               target: {
            //                 semanticObject: "Action", // "Object", "Action", "Display", "Edit", "Navigate" 등 들어갈수 있음
            //                 action: "",
            //               },
            //               indicatorDataSource: {
            //                 // 지표데이터
            //                 path: "", // 지표 데이터의 경로(content)
            //                 refresh: 300, // 데이터를 업데이트 하는데 사용되는 간격지정
            //               },
            //             },
            //             "sap.ui": {
            //               // icon에 대한 정보
            //               icons: {
            //                 icon: "sap-icon://feed",
            //               },
            //             },
            //           },
            //         },
            //         descriptorResources: {
            //           // 기본 경로
            //           baseUrl: "", // 데이터를 가져올 경로
            //           descriptorPath: "", // 이동할 경로
            //         },
            //       },
            //       hello2: {
            //         id: "hello2",
            //         type: "sap.card",
            //         descriptor: {
            //           value: {
            //             "sap.ui": {
            //               icons: {
            //                 icon: "sap-icon://line-chart",
            //               },
            //               technology: "UI5",
            //             },
            //             "sap.app": {
            //               id: "card1",
            //               i18n: "i18n/i18n.properties",
            //               info: "Additional information about this Card",
            //               tags: {
            //                 keywords: [
            //                   "{{DONUT_CHART_KEYWORD1}}",
            //                   "{{DONUT_CHART_KEYWORD2}}",
            //                   "{{DONUT_CHART_KEYWORD3}}",
            //                   "{{DONUT_CHART_KEYWORD4}}",
            //                 ],
            //               },
            //               type: "card",
            //               title: "Line Chart Card",
            //               subTitle: "Sample of a Line Chart",
            //               shortTitle: "A short title for this Card",
            //               description: "A long description for this Card",
            //               artifactVersion: {
            //                 version: "1.0.0",
            //               },
            //             },
            //             "sap.flp": {
            //               vizOptions: {
            //                 displayFormats: {
            //                   supported: [
            //                     "standard",
            //                     "standardWide",
            //                     "flat",
            //                     "flatWide",
            //                     "compact",
            //                   ],
            //                   default: "standard",
            //                 },
            //               },
            //             },
            //             _version: "1.14.0",
            //             "sap.card": {
            //               type: "Analytical",
            //               header: {
            //                 data: {
            //                   json: {
            //                     unit: "K",
            //                     state: "Error",
            //                     trend: "Down",
            //                     number: "65.34",
            //                     target: {
            //                       unit: "K",
            //                       number: 100,
            //                     },
            //                     details: "Q1, 2018",
            //                     deviation: {
            //                       state: "Critical",
            //                       number: 34.7,
            //                     },
            //                   },
            //                 },
            //                 type: "Numeric",
            //                 title: "Project Cloud Transformation",
            //                 details: "{details}",
            //                 subTitle: "Revenue",
            //                 mainIndicator: {
            //                   unit: "{unit}",
            //                   state: "{state}",
            //                   trend: "{trend}",
            //                   number: "{number}",
            //                 },
            //                 sideIndicators: [
            //                   {
            //                     unit: "{target/unit}",
            //                     title: "Target",
            //                     number: "{target/number}",
            //                   },
            //                   {
            //                     unit: "%",
            //                     state: "{deviation/state}",
            //                     title: "Deviation",
            //                     number: "{deviation/number}",
            //                   },
            //                 ],
            //                 unitOfMeasurement: "EUR",
            //               },
            //               content: {
            //                 data: {
            //                   json: {
            //                     list: [
            //                       {
            //                         Cost: 230000,
            //                         Week: "1월",
            //                         Cost1: 24800.63,
            //                         Cost2: 205199.37,
            //                         Cost3: 199999.37,
            //                         Budget: 210000,
            //                         Target: 500000,
            //                         Revenue: 431000.22,
            //                       },
            //                       {
            //                         Cost: 238000,
            //                         Week: "2월",
            //                         Cost1: 99200.39,
            //                         Cost2: 138799.61,
            //                         Cost3: 200199.37,
            //                         Budget: 224000,
            //                         Target: 500000,
            //                         Revenue: 494000.3,
            //                       },
            //                       {
            //                         Cost: 221000,
            //                         Week: "3월",
            //                         Cost1: 70200.54,
            //                         Cost2: 150799.46,
            //                         Cost3: 80799.46,
            //                         Budget: 238000,
            //                         Target: 500000,
            //                         Revenue: 491000.17,
            //                       },
            //                       {
            //                         Cost: 280000,
            //                         Week: "4월",
            //                         Cost1: 158800.73,
            //                         Cost2: 121199.27,
            //                         Cost3: 108800.46,
            //                         Budget: 252000,
            //                         Target: 500000,
            //                         Revenue: 536000.34,
            //                       },
            //                       {
            //                         Cost: 230000,
            //                         Week: "5월",
            //                         Cost1: 140000.91,
            //                         Cost2: 89999.09,
            //                         Cost3: 100099.09,
            //                         Budget: 266000,
            //                         Target: 600000,
            //                         Revenue: 675000,
            //                       },
            //                       {
            //                         Cost: 250000,
            //                         Week: "6월",
            //                         Cost1: 172800.15,
            //                         Cost2: 77199.85,
            //                         Cost3: 57199.85,
            //                         Budget: 280000,
            //                         Target: 600000,
            //                         Revenue: 680000,
            //                       },
            //                       {
            //                         Cost: 325000,
            //                         Week: "7월",
            //                         Cost1: 237200.74,
            //                         Cost2: 87799.26,
            //                         Cost3: 187799.26,
            //                         Budget: 294000,
            //                         Target: 600000,
            //                         Revenue: 659000.14,
            //                       },
            //                     ],
            //                     legend: {
            //                       visible: true,
            //                       position: "bottom",
            //                       alignment: "topLeft",
            //                     },
            //                     measures: {
            //                       costLabel: "Costs",
            //                       revenueLabel: "Revenue",
            //                     },
            //                     dimensions: {
            //                       weekLabel: "Weeks",
            //                     },
            //                   },
            //                   path: "/list",
            //                 },
            //                 feeds: [
            //                   {
            //                     uid: "valueAxis",
            //                     type: "Measure",
            //                     values: [
            //                       "{measures/revenueLabel}",
            //                       "{measures/costLabel}",
            //                     ],
            //                   },
            //                   {
            //                     uid: "categoryAxis",
            //                     type: "Dimension",
            //                     values: ["{dimensions/weekLabel}"],
            //                   },
            //                 ],
            //                 measures: [
            //                   {
            //                     name: "{measures/revenueLabel}",
            //                     value: "{Revenue}",
            //                   },
            //                   {
            //                     name: "{measures/costLabel}",
            //                     value: "{Cost}",
            //                   },
            //                 ],
            //                 chartType: "Line",
            //                 dimensions: [
            //                   {
            //                     name: "{dimensions/weekLabel}",
            //                     value: "{Week}",
            //                   },
            //                 ],
            //                 chartProperties: {
            //                   title: {
            //                     text: "Line Chart",
            //                     visible: true,
            //                     alignment: "left",
            //                   },
            //                   legend: {
            //                     visible: "{legend/visible}",
            //                   },
            //                   plotArea: {
            //                     dataLabel: {
            //                       visible: true,
            //                     },
            //                   },
            //                   valueAxis: {
            //                     title: {
            //                       visible: false,
            //                     },
            //                   },
            //                   legendGroup: {
            //                     layout: {
            //                       position: "{legend/position}",
            //                       alignment: "{legend/alignment}",
            //                     },
            //                   },
            //                   categoryAxis: {
            //                     title: {
            //                       visible: false,
            //                     },
            //                   },
            //                 },
            //               },
            //             },
            //           },
            //         },
            //         configurations: [
            //           {
            //             id: "conf_viz_0",
            //             level: "US",
            //             settings: {
            //               value: {
            //                 "/sap.card/header/title":
            //                   "Project Cloud Transformation (US - Viz)",
            //               },
            //               schemaVersion: "3.2.0",
            //             },
            //           },
            //           {
            //             id: "conf_viz_1",
            //             level: "PR",
            //             settings: {
            //               value: {
            //                 "/sap.card/header/title":
            //                   "Project Cloud Transformation (PR - Viz)",
            //               },
            //               schemaVersion: "3.2.0",
            //             },
            //           },
            //           {
            //             id: "conf_viz_2",
            //             level: "CO",
            //             settings: {
            //               value: {
            //                 "/sap.card/header/title":
            //                   "Project Cloud Transformation (CO - Viz)",
            //               },
            //               schemaVersion: "3.2.0",
            //             },
            //           },
            //           {
            //             id: "conf_viz_3",
            //             level: "PG",
            //             settings: {
            //               value: {
            //                 "/sap.card/header/title":
            //                   "Project Cloud Transformation (PG - Viz)",
            //                 "/sap.card/header/subTitle": "Revenue (PG - Viz)",
            //               },
            //               schemaVersion: "3.2.0",
            //             },
            //           },
            //         ],
            //         descriptorResources: {
            //           baseUrl:
            //             "/content-repository/v2/cards/my.company.ns.line.chart.card/e1087df0d5fcc0818a58d0ef778ee683",
            //           descriptorPath: "",
            //         },
            //       },
            //     },
            //   };

            //   this.oModel = new JSONModel({
            //     maxColumns: MAX_COLUMNS_PER_ROW,
            //     editMode: true,
            //     previewMode: false,
            //     loaded: false,
            //     navigationDisabled: false,
            //     showFooter: false,
            //     showPageTitle: true,
            //     data: oData,
            //   });
            //   // this.oModel.setSizeLimit(Infinity);
            //   console.log(this.oModel);
            //   // this.getView().setModel(this.oModel);
            // },

            onExit: function () {
                WorkPageBuilderLayoutHelper.deregister();

                if (this.oContentFinderPromise) {
                    this.oContentFinderPromise.then((oComponent) => {
                        oComponent.destroy();
                    });
                }

                if (this.oCardEditorDialogPromise) {
                    this.oCardEditorDialogPromise.then((oDialog) => {
                        oDialog.destroy();
                    });
                }
                if (this.oCardResetDialogPromise) {
                    this.oCardResetDialogPromise.then((oDialog) => {
                        oDialog.destroy();
                    });
                }
                if (this.oDeleteCell) {
                    this.oDeleteCell.then((oDialog) => {
                        oDialog.destroy();
                    });
                }

                if (this.oLoadDeleteDialog) {
                    this.oLoadDeleteDialog.then((oDialog) => {
                        oDialog.destroy();
                    });
                }
            },

            /**
             * Handler for the "borderReached" event of the GridContainer.
             * Calculates which GridContainer in the given direction is the nearest to the currently focused one.
             * Afterwards shifts the focus to the found GridContainer. If none is found nothing happens and the focus stays with the current one.
             *
             * @param {sap.base.Event} oEvent The "borderReached" event of the GridContainer
             */
            onGridContainerBorderReached: function (oEvent) {
                var oWorkPage = this.byId("workPage");
                this.oWorkPageBuilderAccessibility._handleBorderReached(
                    oEvent,
                    oWorkPage
                );
            },

            /**
             * Handler for the "addColumn" event of the WorkPageColumn.
             * Creates an empty column on the left or the right of the event source and calculates
             * the new width of the neighboring columns.
             *
             * @param {sap.base.Event} oEvent The "addColumn" event.
             */
            onAddColumn: function (oEvent) {
                var oModel = this.getView().getModel();
                var oColumnControl = oEvent.getSource();
                var oRow = oColumnControl.getParent();
                var iColumnIndex = oRow.indexOfAggregation("columns", oColumnControl);
                var sRowBindingContextPath = oRow.getBindingContext().getPath();
                var sColumnPath = sRowBindingContextPath + "/columns/";
                var sColumnColumnWidthPath =
                    oColumnControl.getBindingContext().getPath() +
                    "/descriptor/value/columnWidth";
                var aColumnsData = oModel.getProperty(sColumnPath);
                var iColumnCount = aColumnsData.length;
                var bAddToLeft = oEvent.getParameter("left");
                if (iColumnCount >= MAX_COLUMNS_PER_ROW) {
                    return;
                }
                var iColumnWidth = oColumnControl.getProperty("columnWidth");
                var iColSize =
                    Math.floor(iColumnWidth / 2) >= MIN_GRID_COLUMN_WIDTH
                        ? Math.floor(iColumnWidth / 2)
                        : MIN_GRID_COLUMN_WIDTH;
                var iModulo = iColSize % 2;
                oModel.setProperty(sColumnColumnWidthPath, iColSize + iModulo);

                var iIndex =
                    oRow.indexOfAggregation("columns", oColumnControl) +
                    (bAddToLeft === true ? 0 : 1);
                var oNewColumn = this._createEmptyColumn(iColSize - iModulo);

                // Insert the new column by creating a new array to avoid mutation of the original array.
                var aNewColumnsData = [
                    aColumnsData.slice(0, iIndex),
                    oNewColumn,
                    aColumnsData.slice(iIndex),
                ].flat();

                var iTotalColumns = aNewColumnsData.reduce(
                    function (iAccumulator, oSingleColumn) {
                        return iAccumulator + this._getColumnWidth(oSingleColumn);
                    }.bind(this),
                    0
                );

                if (iTotalColumns > MAX_GRID_COLUMN_WIDTH) {
                    this._calculateColWidths(
                        aNewColumnsData,
                        iColumnIndex,
                        iTotalColumns
                    );
                }
                oModel.setProperty(sColumnPath, aNewColumnsData);
                this.getOwnerComponent().fireEvent("workPageEdited");
            },

            /**
             * Sets the focus on the first item in the first GridContainer on the WorkPage.
             *
             * @param {sap.base.Event} oEvent The afterRendering event.
             * @since 1.116.0
             * @private
             */
            focusFirstItem: function (oEvent) {
                var oWorkPage = oEvent.getSource();
                this.oWorkPageBuilderAccessibility.focusFirstItem(oWorkPage);
            },

            /**
             * Set the editMode to true or false
             * @param {boolean} bEditMode true or false
             *
             * @private
             * @since 1.109.0
             */
            setEditMode: function (bEditMode) {
                this.oModel.setProperty("/editMode", !!bEditMode);
            },

            /**
             * Set the previewMode to true or false
             * @param {boolean} bPreviewMode true or false
             *
             * @private
             * @since 1.116.0
             */
            setPreviewMode: function (bPreviewMode) {
                this.oModel.setProperty("/previewMode", !!bPreviewMode);
            },

            /**
             * Get the previewMode property from the model
             * @returns {boolean} the previewMode property value
             * @private
             * @since 1.116.0
             */
            getPreviewMode: function () {
                return this.oModel.getProperty("/previewMode");
            },

            /**
             * Get the editMode property from the model
             * @returns {boolean} the editMode property value
             * @private
             * @since 1.109.0
             */
            getEditMode: function () {
                return this.oModel.getProperty("/editMode");
            },

            /**
             * Set the showFooter property to true or false
             * @param {boolean} bVisible true or false
             *
             * @private
             * @since 1.110.0
             */
            setShowFooter: function (bVisible) {
                this.oModel.setProperty("/showFooter", !!bVisible);
            },

            /**
             * Set the showPageTitle property to true or false
             * @param {boolean} bVisible true or false
             *
             * @private
             * @since 1.116.0
             */
            setShowPageTitle: function (bVisible) {
                this.oModel.setProperty("/showPageTitle", !!bVisible);
            },

            /**
             * Set the model data with the WorkPage data
             * @param {{workPage: object, usedVisualizations: object[]}} oPageData WorkPage data object
             *
             * @private
             * @since 1.109.0
             */
            setPageData: function (oPageData) {
                var oMappedVisualizations = {};
                var aUsedVisualizations = ObjectPath.get(
                    "workPage.usedVisualizations.nodes",
                    oPageData
                );
                var oWorkPageContents = ObjectPath.get(
                    "workPage.contents",
                    oPageData
                );

                if (aUsedVisualizations && aUsedVisualizations.length > 0) {
                    // create a map for the usedVisualizations using the id as a key.
                    oMappedVisualizations = aUsedVisualizations.reduce(function (
                        oAcc,
                        oViz
                    ) {
                        oAcc[oViz.id] = oViz;
                        return oAcc;
                    },
                        {});
                }

                this.oModel.setProperty(
                    "/data/usedVisualizations",
                    oMappedVisualizations
                );
                this.oModel.setProperty("/data/workPage", oWorkPageContents);
                this.oModel.setProperty("/loaded", true);
            },

            /**
             * Get the WorkPage data from the model.
             * It must also include the usedVisualizations array, because of the reuse scenario.
             * It is necessary that the same data structure is returned that is put into setPageData.
             *
             * @returns {{workPage: {contents: object, usedVisualizations: {nodes: object[]} }}} The WorkPage data to save.
             * @private
             * @since 1.109.0
             */
            getPageData: function () {
                var oMappedVisualizations =
                    this.oModel.getProperty("/data/usedVisualizations") || {};
                return {
                    workPage: {
                        contents: this.oModel.getProperty("/data/workPage"),
                        usedVisualizations: {
                            nodes: Object.values(oMappedVisualizations),
                        },
                    },
                };
            },

            /**
             * Set the paginated visualization data for the ContentFinder.
             *
             * @param {{visualizations: {nodes: object[]}}} oVizNodes an Array of Visualizations' objects
             * @returns {Promise} A promise resolving when the data has been set to the contentFinder
             *
             * @private
             * @since 1.115.0
             */
            setVisualizationData: function (oVizNodes) {
                return this.oContentFinderPromise.then(function (oContentFinder) {
                    oContentFinder.setVisualizationData(oVizNodes);
                });
            },

            /**
             * Called if the amount of grid columns in the GridContainer of a WorkPageCell changes.
             * Sets all the cards in the cell to the new amount of columns.
             *
             * @param {sap.base.Event} oEvent The gridColumnsChange event.
             */
            onGridColumnsChange: function (oEvent) {
                var iColumnCount = oEvent.getParameter("columns");
                var oCell = oEvent.getSource();

                oCell
                    .getWidgets()
                    .filter(function (oItem) {
                        return oItem.isA("sap.ui.integration.widgets.Card");
                    })
                    .forEach(function (oCard) {
                        oCard.setLayoutData(
                            new GridContainerItemLayoutData({
                                columns: iColumnCount,
                                minRows: 1,
                            })
                        );
                    });
            },

            /**
             * Handler for the "removeColumn" event of the WorkPageColumn.
             * Removes the column that issues the event and calculates the width of the remaining columns.
             *
             * @param {sap.base.Event} oEvent The "removeColumn" event.
             */
            onDeleteColumn: function (oEvent) {
                var oModel = this.getView().getModel();
                var oColumn = oEvent.getSource();
                var iColumnWidth = oColumn.getColumnWidth();
                var oRow = oColumn.getParent();
                var iColumnIndex = oRow.indexOfAggregation("columns", oColumn);
                var sRowBindingContextPath = oRow.getBindingContext().getPath();
                var sColumnPath = sRowBindingContextPath + "/columns/";
                var aColumns = oModel.getProperty(sColumnPath);

                // filter out the column at the iColumnIndex instead of splicing to avoid mutation of the original array.
                var aNewColumns = aColumns.filter(function (oCol, iIndex) {
                    return iIndex !== iColumnIndex;
                });

                // split the columnWidth among remaining cols
                var iLoopCount = iColumnWidth / 2;
                var iIndex = iColumnIndex - 1 < 0 ? iColumnIndex : iColumnIndex - 1;
                while (iLoopCount > 0) {
                    var oCurrentColumn = aNewColumns[iIndex];
                    this._setColumnWidth(
                        oCurrentColumn,
                        this._getColumnWidth(oCurrentColumn) + STEP_SIZE
                    );
                    iIndex = ++iIndex >= aNewColumns.length ? 0 : iIndex++;
                    iLoopCount--;
                }

                oModel.setProperty(sColumnPath, aNewColumns);
                // Invalidate row to render correct css class for amount of columns.
                oRow.invalidate();
                this.getOwnerComponent().fireEvent("workPageEdited");
            },

            /**
             * Handler for the "Add Row" button on an empty WorkPage.
             * Creates an array with an empty row and sets it to the model.
             *
             */
            onAddFirstRow: function () {
                var sRowsPath = "/data/workPage/rows/";
                this.getView()
                    .getModel()
                    .setProperty(sRowsPath, [this._createEmptyRow()]);
                this.getOwnerComponent().fireEvent("workPageEdited");
            },

            /**
             * Handler for the "Add Row" button on a WorkPageRow.
             * Creates a new empty row and adds it to the existing rows.
             *
             * @param {sap.base.Event} oEvent The "addRow" event.
             */
            onAddRow: function (oEvent) {
                var oModel = this.getView().getModel();
                var oRow = oEvent.getSource();
                var oPage = this.byId("workPage");
                var sRowsPath = "/data/workPage/rows/";
                var aRows = oModel.getProperty(sRowsPath);
                var oNewRow = this._createEmptyRow();

                var iIndex =
                    oPage.indexOfAggregation("rows", oRow) +
                    (oEvent.getParameter("bottom") === true ? 1 : 0);

                // Insert the new row into the array by creating a new array to avoid mutation.
                var aNewRows = [
                    aRows.slice(0, iIndex),
                    oNewRow,
                    aRows.slice(iIndex),
                ].flat();

                oModel.setProperty(sRowsPath, aNewRows);
                this.getOwnerComponent().fireEvent("workPageEdited");
            },

            /**
             * Handler for the "columnResized" event issued by the WorkPageColumn.
             * Calculates the required resize steps left or right and updates the model accordingly.
             *
             * @param {sap.base.Event} oEvent The "columnResized" event.
             */
            onResize: function (oEvent) {
                var iDiff = oEvent.getParameter("posXDiff");
                var oColumn = oEvent.getSource();
                var oRow = oColumn.getParent();
                var iSingleColumnWidthPx = oRow.getSingleColumnWidth();

                if (iSingleColumnWidthPx <= 0) {
                    return;
                }

                var bRtl = Localization.getRTL();
                var fDeltaFromOrigin = iDiff / iSingleColumnWidthPx;

                if (fDeltaFromOrigin > -1 && fDeltaFromOrigin < 1) {
                    return;
                }

                var iColumnsDelta =
                    fDeltaFromOrigin < 0
                        ? Math.floor(iDiff / iSingleColumnWidthPx)
                        : Math.ceil(iDiff / iSingleColumnWidthPx);
                var sDragDirection = iColumnsDelta >= 0 ? "right" : "left";
                var iFlexStep = sDragDirection === "right" ? STEP_SIZE : -STEP_SIZE;
                var iRightColumnIndex = oRow.indexOfAggregation("columns", oColumn);
                var iLeftColumnIndex = iRightColumnIndex - 1;
                var aColumnFlexValues = oRow.getColumnFlexValues();

                iFlexStep = bRtl ? iFlexStep : -iFlexStep;

                if (
                    !this._resizeAllowed(
                        aColumnFlexValues.length,
                        aColumnFlexValues[iLeftColumnIndex],
                        aColumnFlexValues[iRightColumnIndex],
                        iFlexStep
                    )
                ) {
                    return;
                }

                aColumnFlexValues[iLeftColumnIndex] -= iFlexStep;
                aColumnFlexValues[iRightColumnIndex] += iFlexStep;

                oRow.setGridLayoutString(aColumnFlexValues);
                this._updateModelWithColumnWidths(
                    oRow,
                    iLeftColumnIndex,
                    iRightColumnIndex,
                    aColumnFlexValues[iLeftColumnIndex],
                    aColumnFlexValues[iRightColumnIndex]
                );
            },

            /**
             * Checks if WorkPageColumn resize is allowed based on the given input parameters.
             *
             * @param {int} iColumnCount The count of WorkPageColumns in this row.
             * @param {int} iLeftFlex The old flex value of the left column.
             * @param {int} iRightFlex The old flex value of the right column.
             * @param {int} iFlexStep The step to decrease / increase both columns.
             * @returns {boolean} The result.
             * @private
             * @since 1.118.0
             */
            _resizeAllowed: function (
                iColumnCount,
                iLeftFlex,
                iRightFlex,
                iFlexStep
            ) {
                var oViewSettingsModel = this.getView().getModel("viewSettings");
                var iColumnMinFlex = oViewSettingsModel.getProperty(
                    "/currentBreakpoint/columnMinFlex"
                );

                // resize to left would result in too small column on the left
                if (iLeftFlex - iFlexStep < iColumnMinFlex) {
                    return false;
                }

                // resize to right would result in too small column on the right
                if (iRightFlex + iFlexStep < iColumnMinFlex) {
                    return false;
                }

                var iMaxColumnsPerRow = oViewSettingsModel.getProperty(
                    "/currentBreakpoint/maxColumnsPerRow"
                );

                // no resize allowed if there is a line break for WorkPageRows
                if (iColumnCount > iMaxColumnsPerRow) {
                    return false;
                }

                return true;
            },

            /**
             * Handler for the "columnResizeCompleted" event issued by the WorkPageColumn.
             * Fires the "workPageEdited" event to indicate that there was a data change.
             *
             */
            onResizeCompleted: function () {
                this.getOwnerComponent().fireEvent("workPageEdited");
            },

            /**
             * Handler for the "press" event in the WorkPageCell OverflowToolbar button.
             * Opens a confirmation dialog for widgets, except cards.
             *
             * @param {sap.base.Event} oEvent The button click event.
             * @returns {Promise} A promise resolving when the dialog was opened or the card was deleted.
             */
            onDeleteCell: function (oEvent) {
                var oCell = oEvent.getSource().getParent().getParent();

                // No dialog is shown if the ell contains only a card.
                var aWidgets = oCell.getWidgets();
                if (
                    aWidgets?.[0] &&
                    aWidgets.length === 1 &&
                    aWidgets[0].isA("sap.ui.integration.widgets.Card")
                ) {
                    return this.deleteCell(oEvent, {
                        cell: oCell,
                        dialog: false,
                    });
                }

                // Show dialog for all other widgets.
                if (!this.oDeleteCell) {
                    var oRootView = this.getOwnerComponent().getRootControl();
                    this.oDeleteCell = Fragment.load({
                        id: oRootView.createId("cellDeleteDialog"),
                        name: "sap.ushell.components.workPageBuilder.view.WorkPageCellDeleteDialog",
                        controller: this,
                    }).then(
                        function (oDialog) {
                            oDialog.setModel(
                                this.getOwnerComponent().getModel("i18n"),
                                "i18n"
                            );
                            return oDialog;
                        }.bind(this)
                    );
                }

                return this.oDeleteCell.then(
                    function (oDialog) {
                        oDialog
                            .getBeginButton()
                            .detachEvent("press", this._fnDeleteCellHandler);
                        oDialog.getBeginButton().attachEvent(
                            "press",
                            {
                                cell: oCell,
                                dialog: true,
                            },
                            this._fnDeleteCellHandler
                        );
                        oDialog.open();
                    }.bind(this)
                );
            },

            /**
             * Deletes the cell from the model.
             *
             * @param {sap.base.Event} oEvent The button click event.
             */

            /**
             * Deletes the provided cell.
             *
             * @param {sap.base.Event} oEvent The "press" event.
             * @param {object} cellData Object containing the cell to delete.
             * @param {sap.ushell.components.workPageBuilder.controls.WorkPageCell} cellData.cell The cell to delete.
             * @param {boolean} cellData.dialog True if a dialog is shown to confirm the deletion.
             * @returns {Promise} A promise resolving when the cell has been deleted.
             */
            deleteCell: function (oEvent, cellData) {
                var oCell = cellData.cell;
                var oModel = this.getView().getModel();
                var oColumn = oCell.getParent();
                var iCellIndex = oColumn.indexOfAggregation("cells", oCell);
                var sCellsPath = oColumn.getBindingContext().getPath() + "/cells";
                var aCells = oModel.getProperty(sCellsPath);

                // Filter out the cell at iCellIndex instead of splicing to avoid mutation of the original array.
                var aNewCells = aCells.filter(function (oOriginalCell, iIndex) {
                    return iIndex !== iCellIndex;
                });

                oModel.setProperty(sCellsPath, aNewCells);
                this.getOwnerComponent().fireEvent("workPageEdited");
                if (cellData.dialog) {
                    return this.oDeleteCell.then(function (oDialog) {
                        oDialog.close();
                    });
                }
                return Promise.resolve();
            },

            /**
             * Handler for the "deleteVisualization" event issued by the VizInstance.
             * Deletes the visualization from the model.
             *
             * @param {sap.ushell.ui.launchpad.VizInstanceCdm|sap.ushell.ui.launchpad.VizInstanceLink} oVizInstance the viz instance.
             */
            _deleteVisualization: function (oVizInstance) {
                var oCell = oVizInstance.getParent().getParent();
                var oVizInstanceContext = oVizInstance.getBindingContext();
                var sVizInstancePath = oVizInstanceContext.getPath();
                var oModel = this.getView().getModel();
                var sWidgetsPath = sVizInstancePath.substring(
                    0,
                    sVizInstancePath.lastIndexOf("/")
                );
                var iWidgetIndex = oCell.indexOfAggregation("widgets", oVizInstance);
                var aWidgets = oModel.getProperty(sWidgetsPath);

                // Filter out the widget at iWidgetIndex instead of splicing to avoid mutation of the original array.
                var aNewWidgets = aWidgets.filter(function (oWidget, iIndex) {
                    return iIndex !== iWidgetIndex;
                });

                oModel.setProperty(sWidgetsPath, aNewWidgets);
                this.getOwnerComponent().fireEvent("workPageEdited");
            },

            /**
             * Handler for the "change" event of the edit title input.
             * Set the dirty flag
             */
            onEditTitle: function () {
                this.getOwnerComponent().fireEvent("workPageEdited");
            },

            /**
             * Handler for the "addWidget" event of the ContentFinderDialog.
             * Set the dirty flag
             */
            onWidgetAdded: function () {
                this.getOwnerComponent().fireEvent("workPageEdited");
            },

            /**
             * Returns an array of WidgetGroups to set then in the Content Finder's widget gallery
             *
             * @since 1.113.0
             * @returns {object[]} the WidgetGroups array
             * @private
             */
            _getWidgetGroups: function () {
                var oResourceBundle = this.getOwnerComponent()
                    .getModel("i18n")
                    .getResourceBundle();

                var aWidgetGroups = [
                    {
                        id: "applicationWidgets",
                        widgets: [
                            {
                                id: "widgets-tiles",
                                title: oResourceBundle.getText(
                                    "ContentFinder.Widgets.Tiles.Title"
                                ),
                                description: oResourceBundle.getText(
                                    "ContentFinder.Widgets.Tiles.Description"
                                ),
                                icon: "sap-icon://header",
                                target: "appSearch_tiles",
                            },
                            {
                                id: "widgets-cards",
                                title: oResourceBundle.getText(
                                    "ContentFinder.Widgets.Cards.Title"
                                ),
                                description: oResourceBundle.getText(
                                    "ContentFinder.Widgets.Cards.Description"
                                ),
                                icon: "sap-icon://card",
                                target: "appSearch_cards",
                            },
                        ],
                    },
                ];

                return aWidgetGroups;
            },

            /**
             * Create the ContentFinder Component
             * @returns {Promise} A Promise that resolves the ContentFinderComponent
             *
             * @since 1.113.0
             * @private
             */
            createContentFinderComponent: function () {
                this.oContentFinderPromise = Component.create({
                    id: this.getOwnerComponent().createId("workPageContentFinder"),
                    name: "sap.ushell.components.contentFinder",
                });

                return this.oContentFinderPromise;
            },

            /**
             * Open ContentFinder's WidgetGallery view.
             *
             * @param {sap.base.Event} oEvent The "addWidget" event.
             * @returns {Promise} When resolved, opens the ContentFinder dialog.
             *
             * @since 1.113.0
             * @public
             */
            openWidgetGallery: function (oEvent) {
                var oSource = oEvent.getSource(); //WorkPageColumn
                console.log(oSource);
                if (!this.oContentFinderPromise) {
                    this.oContentFinderPromise = this.createContentFinderComponent();
                }

                return this.oContentFinderPromise.then(
                    function (oContentFinderComponent) {
                        oContentFinderComponent.setWidgetGroups(this._getWidgetGroups());
                        oContentFinderComponent.attachVisualizationsAdded(
                            oSource,
                            this._onAddVisualization,
                            this
                        );
                        oContentFinderComponent.attachVisualizationFilterApplied(
                            oSource,
                            function (oAppliedEvent) {
                                this.getOwnerComponent().fireEvent(
                                    "visualizationFilterApplied",
                                    oAppliedEvent.getParameters()
                                );
                            },
                            this
                        );
                        oContentFinderComponent.show("widgetGallery");
                    }.bind(this)
                );
            },

            /**
             * Open ContentFinder's AppSearch view
             * @param {sap.base.Event} oEvent The "addApplications" event
             * @returns {Promise} Promise that resolves the ContentFinder Component
             *
             * @since 1.113.0
             * @public
             */
            openTilesAppSearch: function (oEvent) {
                var oSource = oEvent.getSource().getParent().getParent(); //WorkPageCell

                if (!this.oContentFinderPromise) {
                    this.oContentFinderPromise = this.createContentFinderComponent();
                }

                return this.oContentFinderPromise.then(
                    function (oContentFinderComponent) {
                        oContentFinderComponent.setContextData({
                            restrictedVisualizations:
                                this._getRestrictedVisualizationIds(oSource),
                        });
                        oContentFinderComponent.setRestrictedMode(true);
                        oContentFinderComponent.attachVisualizationsAdded(
                            oSource,
                            this._onAddVisualization,
                            this
                        );
                        oContentFinderComponent.attachVisualizationFilterApplied(
                            oSource,
                            function (oAppliedEvent) {
                                this.getOwnerComponent().fireEvent(
                                    "visualizationFilterApplied",
                                    oAppliedEvent.getParameters()
                                );
                            },
                            this
                        );
                        oContentFinderComponent.show("appSearch_tiles");
                    }.bind(this)
                );
            },

            /**
             * Returns an array of Widget's VizRefIds. The Widgets are contained in the WorkPageCell
             *
             * @param {sap.ushell.components.workPageBuilder.controls.WorkPageCell} oCell The WorkPageCell control.
             * @returns {string[]} The VizRefIds array
             *
             * @since 1.113.0
             * @private
             */
            _getRestrictedVisualizationIds: function (oCell) {
                return oCell.getWidgets().map(function (oWidget) {
                    if (oWidget.isA("sap.ushell.ui.launchpad.VizInstanceCdm")) {
                        return oWidget.getProperty("vizRefId");
                    }
                });
            },

            /**
             * Add Visualization to the WorkPageColum or WorkPageCell
             * @param {sap.base.Event} oEvent The "addApplications" event.
             * @param {sap.ushell.components.workPageBuilder.controls.WorkPageCell|sap.ushell.components.workPageBuilder.controls.WorkPageColumn} oSource The WorkPageColumn or WorkPageCell control
             *
             * @since 1.113.0
             * @private
             */
            _onAddVisualization: function (oEvent, oSource) {
                const oModel = this.getView().getModel();
                var aSelectedVisualizations = oEvent.getParameter("visualizations");

                if (aSelectedVisualizations.length > 0) {
                    aSelectedVisualizations.forEach(function (oVisualization) {
                        var sVizSelectedItemPath =
                            "/data/usedVisualizations/" + oVisualization.id;
                        if (!oModel.getProperty(sVizSelectedItemPath)) {
                            oModel.setProperty(
                                sVizSelectedItemPath,
                                oVisualization.vizData
                            );
                        }
                    });

                    var aWidgetData = this._instantiateWidgetData(
                        aSelectedVisualizations
                    );

                    if (
                        oSource.isA(
                            "sap.ushell.components.workPageBuilder.controls.WorkPageCell"
                        )
                    ) {
                        this._setCellData(oSource, aWidgetData);
                    }
                    if (
                        oSource.isA(
                            "sap.ushell.components.workPageBuilder.controls.WorkPageColumn"
                        )
                    ) {
                        this._setColumnData(oSource, aWidgetData);
                    }
                }
            },

            /**
             * For each selected visualization in the ContentFinder, instantiate the initial WidgetData
             * @param {object[]} aSelectedVisualizations The ContentFinder's selected visualizations
             * @returns {object[]} The WidgetData array
             *
             * @since 1.113.0
             * @private
             */
            _instantiateWidgetData: function (aSelectedVisualizations) {
                var aIds = [];
                var sId;

                return aSelectedVisualizations.map(
                    function (oTile) {
                        sId = this._generateUniqueId(aIds);
                        aIds = aIds.concat([sId]);
                        return {
                            id: sId,
                            visualization: {
                                id: oTile.vizData.id,
                            },
                        };
                    }.bind(this)
                );
            },

            /**
             * Add Widgets into the WorkPageCell's Widgets aggregation
             * @param {sap.ushell.components.workPageBuilder.controls.WorkPageCell} oCell The WorkPageCell control.
             * @param {object[]} aWidgetData The WidgetData array
             *
             * @since 1.113.0
             * @private
             */
            _setCellData: function (oCell, aWidgetData) {
                const oModel = this.getView().getModel();
                var sCellPath = oCell.getBindingContext().getPath();
                var oCellData = Object.assign({}, oModel.getProperty(sCellPath));

                oCellData.widgets = oCellData.widgets.concat(aWidgetData);

                oModel.setProperty(sCellPath, oCellData);
                this.onWidgetAdded();
            },

            /**
             * Add Widgets into WorkPageColumn's Cell aggregation
             * @param {sap.ushell.components.workPageBuilder.controls.WorkPageColumn} oColumn The WorkPageCell control.
             * @param {object[]} aWidgetData The WidgetData array
             * @param {int|undefined} iPosition The position where the new Cell should be placed. Defaults to the end if undefined
             *
             * @since 1.113.0
             * @private
             */
            _setColumnData: function (oColumn, aWidgetData, iPosition) {
                const oModel = this.getView().getModel();
                let sColumnPath = oColumn.getBindingContext().getPath();
                let oColumnData = Object.assign({}, oModel.getProperty(sColumnPath));
                let oNewCellData = {
                    id: this._generateUniqueId(),
                    descriptor: {
                        value: {},
                        schemaVersion: "3.2.0",
                    },
                    widgets: aWidgetData.concat([]),
                };

                if (!oColumnData.cells) {
                    oColumnData.cells = [];
                }

                if (iPosition === undefined || iPosition > oColumnData.cells.length) {
                    iPosition = oColumnData.cells.length;
                }

                let aCellCopy = oColumnData.cells.concat([]);
                aCellCopy.splice(iPosition, 0, oNewCellData);
                oColumnData.cells = aCellCopy;

                oModel.setProperty(sColumnPath, oColumnData);
                this.onWidgetAdded();
            },

            /**
             * Handler for the "press" event in the WorkPageRow OverflowToolbar button.
             * Opens a confirmation dialog.
             * @returns {Promise} A promise resolving when the dialog was opened.
             * @param {sap.base.Event} oEvent The "deleteRow" event.
             */
            onDeleteRow: function (oEvent) {
                var oRootView = this.getOwnerComponent().getRootControl();
                var oWorkPageRowContext = oEvent.getSource().getBindingContext();

                if (!this.oLoadDeleteDialog) {
                    this.oLoadDeleteDialog = Fragment.load({
                        id: oRootView.createId("rowDeleteDialog"),
                        name: "sap.ushell.components.workPageBuilder.view.WorkPageRowDeleteDialog",
                        controller: this,
                    }).then(
                        function (oDialog) {
                            oDialog.setModel(this.getView().getModel("i18n"), "i18n");
                            return oDialog;
                        }.bind(this)
                    );
                }

                return this.oLoadDeleteDialog.then(
                    function (oDialog) {
                        oDialog
                            .getBeginButton()
                            .detachEvent("press", this._fnDeleteRowHandler);
                        oDialog.getBeginButton().attachEvent(
                            "press",
                            {
                                rowContext: oWorkPageRowContext,
                            },
                            this._fnDeleteRowHandler
                        );
                        oDialog.open();
                    }.bind(this)
                );
            },

            /**
             * Deletes the row with the context given in oRowData.
             *
             * @returns {Promise} A promise resolving when the row has been deleted.
             *
             * @param {sap.base.Event} oEvent The "press" event.
             * @param {object} oRowData Object containing the WorkPageRow context to delete.
             */
            deleteRow: function (oEvent, oRowData) {
                var oModel = this.getView().getModel();
                var oWorkPageRowContext = oRowData.rowContext;
                var aRows = oModel.getProperty("/data/workPage/rows");
                var oRowContextData = oWorkPageRowContext.getObject();

                // Filter out the row with the given id to avoid mutation of the original array.
                var aFilteredRows = aRows.filter(function (oRow) {
                    return oRow.id !== oRowContextData.id;
                });

                oModel.setProperty("/data/workPage/rows", aFilteredRows);
                this.getOwnerComponent().fireEvent("workPageEdited");
                return this.oLoadDeleteDialog.then(function (oDialog) {
                    oDialog.close();
                });
            },

            /**
             * Called when the "Cancel" button is pressed on the RowDelete dialog.
             * @returns {Promise} A promise resolving when the dialog has been closed
             */
            onRowDeleteCancel: function () {
                return this.oLoadDeleteDialog.then(function (oDialog) {
                    oDialog.close();
                });
            },

            /**
             * Called when the "Cancel" button is pressed on the cell delete dialog.
             *
             * @returns {Promise} A promise resolving when the dialog has been closed
             */
            onCellDeleteCancel: function () {
                return this.oDeleteCell.then(function (oDialog) {
                    oDialog.close();
                });
            },

            /**
             * Returns a GenericTile control instance to render in error case.
             *
             * @returns {sap.m.GenericTile} A GenericTile with state: failed
             * @private
             */
            _createErrorTile: function () {
                return new VizInstanceCdm({
                    state: LoadState.Failed,
                })
                    .attachPress(this.onVisualizationPress, this)
                    .bindEditable("/editMode")
                    .bindSizeBehavior("viewSettings>/currentBreakpoint/sizeBehavior")
                    .setLayoutData(
                        new GridContainerItemLayoutData({
                            columns: 2,
                            rows: 2,
                        })
                    );
            },

            /**
             * Creates a widget based on the given widgetContext.
             *
             * @param {string} sWidgetId The id for the widget.
             * @param {sap.ui.model.Context} oWidgetContext The widget context.
             * @returns {sap.ushell.ui.launchpad.VizInstance|sap.m.GenericTile|sap.ui.integration.widgets.Card} The resulting control.
             */
            widgetFactory: function (sWidgetId, oWidgetContext) {
                var sVizId = oWidgetContext.getProperty("visualization/id");

                if (!sVizId) {
                    Log.error("No vizId found in widget context.");
                    return this._createErrorTile();
                }

                var oVizData = this.getView()
                    .getModel()
                    .getProperty("/data/usedVisualizations/" + sVizId);

                if (!oVizData || !oVizData.type) {
                    Log.error("No viz or vizType found for vizId " + sVizId);
                    return this._createErrorTile();
                }

                var aWidgetConfigurations =
                    oWidgetContext.getProperty("configurations") || [];
                var aVizConfigurations = oVizData.configurations || [];
                var aMergedAndSortedConfigurations =
                    this._getMergedAndSortedConfigurations(
                        aWidgetConfigurations,
                        aVizConfigurations
                    );
                var sWidgetContextPath = oWidgetContext.getPath();

                switch (oVizData.type) {
                    case "sap.card":
                        return this._createCard(
                            oVizData,
                            aWidgetConfigurations,
                            aMergedAndSortedConfigurations,
                            sWidgetContextPath
                        );
                    case "sap.ushell.StaticAppLauncher":
                    case "sap.ushell.DynamicAppLauncher":
                        return this._createVizInstance(oVizData);
                    default:
                        Log.error("Unknown type for widget " + oVizData.type);
                        return this._createErrorTile();
                }
            },

            /**
             * @typedef {object} Configuration A configuration entry.
             * @property {string} id the id of the configuration entry.
             * @property {string} level the level of the configuration entry.
             * @property {object} settings map of values that the configuration entry overrides.
             */

            /**
             * Group the widget configurations and the visualization configurations by level and then merge settings for each level.
             * The widget configurations override the viz configurations.
             *
             * @since 1.114.0
             * @param {Configuration[]} aWidgetConfigurations The widget configuration items.
             * @param {Configuration[]} aVizConfigurations The viz configuration items.
             * @returns {object[]} The merged array of configurations, sorted by level.
             * @private
             */
            _getMergedAndSortedConfigurations: function (
                aWidgetConfigurations,
                aVizConfigurations
            ) {
                // No configurations -> return
                if (
                    aWidgetConfigurations.length === 0 &&
                    aVizConfigurations.length === 0
                ) {
                    return [];
                }

                // First, widget configurations and viz configurations are merged for each level in CONFIGURATION_LEVELS
                // Second, the merged configurations are sorted
                var oConfigurations = CONFIGURATION_LEVELS.reduce(function (
                    oMergedConfigurations,
                    sLevel
                ) {
                    var oWidgetConfigByLevel = aWidgetConfigurations.find(function (
                        oWidgetConfig
                    ) {
                        return oWidgetConfig.level === sLevel;
                    });
                    var oVizConfigByLevel = aVizConfigurations.find(function (
                        oVizConfig
                    ) {
                        return oVizConfig.level === sLevel;
                    });

                    var oMergedConfigurationsByLevel = deepExtend(
                        {},
                        oVizConfigByLevel,
                        oWidgetConfigByLevel
                    );

                    if (Object.keys(oMergedConfigurationsByLevel).length > 0) {
                        oMergedConfigurations[sLevel] = oMergedConfigurationsByLevel;
                    }

                    return oMergedConfigurations;
                },
                    {});

                return this._sortConfigurations(Object.values(oConfigurations));
            },

            /**
             * Sort the widget's configuration by level: PR: Provider, CO: (Content) Administrator, PG: Page Administrator, US: End User
             *
             * @since 1.114.0
             * @param {Configuration[]} aConfigurations The configurations.
             * @returns {Configuration[]} The configurations sorted by level.
             * @private
             */

            _sortConfigurations: function (aConfigurations) {
                var oSortedConfigurations =
                    aConfigurations &&
                    aConfigurations.sort(function (oWidgetConfigA, oWidgetConfigB) {
                        return (
                            CONFIGURATION_LEVELS.indexOf(oWidgetConfigA.level) -
                            CONFIGURATION_LEVELS.indexOf(oWidgetConfigB.level)
                        );
                    });

                // PR —> CO —> PG —> US
                return oSortedConfigurations.map(function (oWidgetConfiguration) {
                    return oWidgetConfiguration.settings.value;
                });
            },

            /**
             * Creates a VizInstance with given vizData using the VizInstantiation service.
             *
             * @since 1.110.0
             * @param {object} oVizData VisualizationData for the visualization.
             * @returns {sap.ushell.ui.launchpad.VizInstance|sap.m.GenericTile} The CDM VizInstance.
             * @private
             */
            _createVizInstance: function (oVizData) {
                const oExtendedVizData = deepExtend({}, oVizData, {
                    preview: this.oModel.getProperty("/previewMode"),
                });

                if (
                    this.oModel.getProperty("/navigationDisabled") &&
                    oExtendedVizData._siteData
                ) {
                    delete oExtendedVizData._siteData.target;
                    delete oExtendedVizData._siteData.targetURL;
                }

                var oVizInstance =
                    this.oWorkPageVizInstantiation.createVizInstance(oExtendedVizData);

                if (!oVizInstance) {
                    Log.error("No VizInstance was created.");
                    return this._createErrorTile();
                }

                return oVizInstance
                    .setActive(true)
                    .bindPreview("/previewMode")
                    .attachPress(this.onVisualizationPress, this)
                    .bindEditable("/editMode")
                    .bindSizeBehavior("viewSettings>/currentBreakpoint/sizeBehavior")
                    .bindClickable({
                        path: "/navigationDisabled",
                        formatter: function (bValue) {
                            return !bValue;
                        },
                    })
                    .setLayoutData(
                        new GridContainerItemLayoutData(oVizInstance.getLayout())
                    );
            },

            /**
             * Returns the aria label for a WorkPageRow (section).
             *
             * If there is a title, the title will be returned in a translated string.
             * If there is no tile, the translated string for unnamed sections will be returned, including the position of the section.
             *
             * @param {string} sId The section dom id.
             * @param {object[]} aRows The rows array of the work page.
             * @param {string} sTitle The title of the section.
             * @returns {string} The string to be used as aria-label attribute.
             */
            formatRowAriaLabel: function (sId, aRows = [], sTitle) {
                const i18nBundle = this.getOwnerComponent()
                    .getModel("i18n")
                    .getResourceBundle();

                if (sTitle) {
                    return i18nBundle.getText("WorkPage.Row.Named.AriaLabel", [sTitle]);
                }

                const iIndex = aRows.findIndex((oRow) => oRow.id === sId);
                if (iIndex < 0) {
                    return "";
                }

                return i18nBundle.getText("WorkPage.Row.Unnamed.AriaLabel", [
                    iIndex + 1,
                ]);
            },

            /**
             * Seeks the dataSource in the available dataSources.
             *
             * @param {object} oDataSources The available dataSources.
             * @param {object} oIndicatorDataSource The indicator dataSource.
             * @returns {object|null} The dataSource if found.
             * @private
             */
            _getDataSource: function (oDataSources, oIndicatorDataSource) {
                if (!oIndicatorDataSource || !oDataSources) {
                    return;
                }
                return oDataSources[oIndicatorDataSource.dataSource];
            },

            /**
             * Called if a vizInstance was pressed and proceeds to delete it from the data.
             *
             * @param {sap.base.Event} oEvent The press event.
             */
            onVisualizationPress: function (oEvent) {
                var sScope = oEvent.getParameter("scope");
                var sAction = oEvent.getParameter("action");

                if (sScope === "Actions" && sAction === "Remove") {
                    this._deleteVisualization(oEvent.getSource());
                }
            },

            /**
             * Creates a new Card.
             *
             * @since 1.110.0
             * @param {object} oViz The visualization data. Defaults to {}.
             * @param {Configuration[]} aWidgetConfigurations The configurations on widget level. Defaults to [].
             * @param {object[]} aManifestChangesToApply The configurations to apply to the card. Defaults. to [].
             * @param {string} sWidgetContextPath The widget configurations path. Defaults to "".
             * @returns {sap.ui.integration.widgets.Card} The card instance.
             * @private
             */
            _createCard: function (
                oViz = {},
                aWidgetConfigurations = [],
                aManifestChangesToApply = [],
                sWidgetContextPath = ""
            ) {
                var oOptions = {};
                var bHasDescriptor =
                    oViz.descriptor &&
                    oViz.descriptor.value &&
                    oViz.descriptor.value["sap.card"];
                var bHasDescriptorResources =
                    oViz.descriptorResources &&
                    (oViz.descriptorResources.baseUrl ||
                        oViz.descriptorResources.descriptorPath);
                var bPgLevelConfigurationsExist = aWidgetConfigurations.some(
                    function (oConfig) {
                        return oConfig.level === "PG";
                    }
                );
                var bIsConfigurable;

                if (!bHasDescriptor && !bHasDescriptorResources) {
                    Log.error("No descriptor or descriptorResources for Card");
                    return new Card().setLayoutData(
                        new GridContainerItemLayoutData({
                            columns: 2,
                            rows: 2,
                        })
                    );
                }

                if (bHasDescriptor) {
                    oOptions.manifest = oViz.descriptor.value;
                    bIsConfigurable = !!ObjectPath.get(
                        ["descriptor", "value", "sap.card", "configuration"],
                        oViz
                    );

                    if (bHasDescriptorResources) {
                        oOptions.baseUrl =
                            oViz.descriptorResources.baseUrl +
                            oViz.descriptorResources.descriptorPath;
                    }
                } else if (bHasDescriptorResources) {
                    oOptions.manifest =
                        oViz.descriptorResources.baseUrl +
                        oViz.descriptorResources.descriptorPath;

                    if (!oOptions.manifest.endsWith(".json")) {
                        oOptions.manifest += "/manifest.json";
                    }
                }

                oOptions.referenceId = "";
                if (oViz.id) {
                    var iProviderPrefixIndex = oViz.id.indexOf("_");
                    if (iProviderPrefixIndex > 0) {
                        var sProvider = oViz.id.substring(0, iProviderPrefixIndex);
                        oOptions.referenceId = sProvider;
                    }
                }

                // Ensure trailing slash for base url
                if (oOptions.baseUrl && oOptions.baseUrl.substr(-1) !== "/") {
                    oOptions.baseUrl += "/";
                }

                var oCard = new Card(oOptions);

                if (bIsConfigurable) {
                    var oConfigureActionDefinition =
                        this._createCardConfigurationActionDefinition(
                            oCard,
                            sWidgetContextPath,
                            this._openCardConfigurationEditor.bind(this)
                        );
                    oCard.addActionDefinition(oConfigureActionDefinition);
                }

                if (bPgLevelConfigurationsExist) {
                    var oResetActionDefinition = this._createCardResetActionDefinition(
                        aWidgetConfigurations,
                        sWidgetContextPath,
                        this._openResetCardConfigurationDialog.bind(this)
                    );
                    oCard.addActionDefinition(oResetActionDefinition);
                }

                return oCard
                    .setModel(this.oModel, "workPageModel")
                    .bindProperty("previewMode", {
                        path: "workPageModel>/previewMode",
                        formatter: function (bValue) {
                            return bValue ? CardPreviewMode.MockData : CardPreviewMode.Off;
                        },
                    })
                    .setManifestChanges(aManifestChangesToApply)
                    .addStyleClass("workpageCellWidget")
                    .setHost(this.oHost)
                    .setLayoutData(
                        new GridContainerItemLayoutData({
                            columns: 16,
                            minRows: 1,
                        })
                    );
            },

            /**
             * Create an ActionDefinition to enable the user to configure the card with the CardEditor.
             *
             * @since 1.114.0
             * @param {sap.ui.integration.widgets.Card} oCard The card to configure.
             * @param {string} sWidgetContextPath The card to configure.
             * @param {function} fnOnPress Handler function, called when the ActionDefinition button is pressed.
             *
             * @returns {sap.ui.integration.ActionDefinition} The ActionDefinition item.
             * @private
             */
            _createCardConfigurationActionDefinition: function (
                oCard,
                sWidgetContextPath,
                fnOnPress
            ) {
                const sActionDefinitionText = this.getView()
                    .getModel("i18n")
                    .getResourceBundle()
                    .getText("WorkPage.Card.ActionDefinition.Configure");
                const oActionDefinition = new ActionDefinition({
                    type: "Custom",
                    visible: "{/editMode}",
                    buttonType: "Transparent",
                    text: sActionDefinitionText,
                });

                oActionDefinition.setModel(this.oModel);
                oActionDefinition.attachPress(
                    {
                        card: oCard,
                        widgetContextPath: sWidgetContextPath,
                    },
                    fnOnPress
                );
                return oActionDefinition;
            },

            /**
             * Create an ActionDefinition to enable the user to reset the card when some configuration was made.
             *
             * @since 1.117.0
             * @param {Configuration[]} aWidgetConfigurations The widget configuration items.
             * @param {string} sWidgetContextPath The path of the card data in the model.
             * @param {function} fnOnPress Handler function, called when the ActionDefinition button is pressed.
             *
             * @returns {sap.ui.integration.ActionDefinition} The ActionDefinition item.
             * @private
             */
            _createCardResetActionDefinition: function (
                aWidgetConfigurations,
                sWidgetContextPath,
                fnOnPress
            ) {
                const sActionDefinitionText = this.getView()
                    .getModel("i18n")
                    .getResourceBundle()
                    .getText("WorkPage.Card.ActionDefinition.Reset");
                const oActionDefinition = new ActionDefinition({
                    type: "Custom",
                    visible: "{/editMode}",
                    buttonType: "Transparent",
                    text: sActionDefinitionText,
                });

                oActionDefinition.setModel(this.oModel);
                oActionDefinition.attachPress(
                    {
                        widgetContextPath: sWidgetContextPath,
                        widgetConfigurations: aWidgetConfigurations,
                    },
                    fnOnPress
                );
                return oActionDefinition;
            },

            /**
             * Adds the CardEditor into the Dialog and opens it.
             *
             * @since 1.113.0
             * @param {sap.base.Event} oEvent The event object.
             * @param {{card: sap.ui.integration.widgets.Card, widgetContextPath: string}} oContextData The context data.
             * @returns {Promise} Promise that will resolve the Dialog
             * @private
             */
            _openCardConfigurationEditor: function (oEvent, oContextData) {
                if (!this.oCardEditorDialogPromise) {
                    this.oCardEditorDialogPromise = this._createCardEditorDialog(
                        oContextData.card
                    );
                }

                var oCardEditorPromise = this._createCardEditor(oContextData.card);

                return Promise.all([
                    oCardEditorPromise,
                    this.oCardEditorDialogPromise,
                ]).then(
                    function (aInstances) {
                        this.oCardEditorDialog = aInstances[1];
                        this.oCardEditorDialog.removeAllContent();
                        this.oCardEditorDialog
                            .getBeginButton()
                            .detachPress(this._fnSaveCardConfiguration)
                            .attachPress(
                                oContextData.widgetContextPath,
                                this._fnSaveCardConfiguration
                            );
                        this._setCardDialogTitle(
                            this.oCardEditorDialog,
                            oContextData.card
                        );
                        this.oCardEditorDialog.addContent(aInstances[0]);
                        this.oCardEditorDialog.open();
                    }.bind(this)
                );
            },

            /**
             * Opens the card reset dialog and attaches the reset button handler.
             *
             * @since 1.117.0
             * @param {sap.base.Event} oEvent The press event.
             * @param { {
             *  card: sap.ui.integration.widgets.Card,
             *  widgetContextPath: string,
             *  widgetConfigurations: Configuration[],
             *  vizConfigurations: Configuration[]
             * } } oContextData The required context data.
             * @returns {Promise} A promise resolving when the card dialog was opened.
             * @private
             */
            _openResetCardConfigurationDialog: function (oEvent, oContextData) {
                if (!this.oCardResetDialogPromise) {
                    this.oCardResetDialogPromise =
                        this._createResetCardConfigurationDialog();
                }

                return this.oCardResetDialogPromise.then(
                    function (oCardResetDialog) {
                        this.oCardResetDialog = oCardResetDialog;
                        this.getView().addDependent(this.oCardResetDialog);
                        this.oCardResetDialog
                            .getBeginButton()
                            .detachPress(this._fnResetCardConfiguration)
                            .attachPress(oContextData, this._fnResetCardConfiguration);
                        this.oCardResetDialog.open();
                    }.bind(this)
                );
            },

            /**
             *
             * @param {sap.base.Event} oEvent The press event.
             * @param {{ widgetContextPath: string, widgetConfigurations: Configuration[] }} oContextData The context data object.
             * @since 1.117.0
             * @private
             */
            _onResetCardConfigurations: function (oEvent, oContextData) {
                var oDialog = oEvent.getSource().getParent();
                var aWidgetConfigurations = oContextData.widgetConfigurations;
                var sWidgetConfigurationsPath =
                    oContextData.widgetContextPath + "/configurations";
                var aRemainingConfigurations = aWidgetConfigurations.filter(function (
                    oConfig
                ) {
                    return oConfig.level !== "PG";
                });

                this.oModel.setProperty(
                    sWidgetConfigurationsPath,
                    aRemainingConfigurations
                );

                this.getOwnerComponent().fireEvent("workPageEdited");

                oDialog.close();
            },

            /**
             * Resets the configuration of the card after confirming a failsafe dialog.
             * @returns {Promise<sap.m.Dialog>} A Promise resolving the the sap.m.Dialog control.
             *
             * @since 1.117.0
             * @private
             */
            _createResetCardConfigurationDialog: function () {
                var oI18nBundle = this.getView().getModel("i18n").getResourceBundle();
                var sDialogTitle = oI18nBundle.getText(
                    "WorkPage.CardEditor.DeleteConfigurationDialog.Title"
                );
                var sDialogContent = oI18nBundle.getText(
                    "WorkPage.CardEditor.DeleteConfigurationDialog.Content"
                );
                var sBeginButtonText = oI18nBundle.getText(
                    "WorkPage.CardEditor.DeleteConfigurationDialog.Accept"
                );
                var sEndButtonText = oI18nBundle.getText(
                    "WorkPage.CardEditor.DeleteConfigurationDialog.Deny"
                );

                return new Promise((resolve, reject) => {
                    sap.ui.require(
                        ["sap/m/Dialog", "sap/m/Button", "sap/m/Text"],
                        (Dialog, Button, Text) => {
                            var oDialog = new Dialog({
                                id: this.createId("cardConfigurationResetDialog"),
                                type: mLibrary.DialogType.Message,
                                state: ValueState.Warning,
                                title: sDialogTitle,
                                content: new Text({
                                    text: sDialogContent,
                                }),
                                beginButton: new Button({
                                    type: mLibrary.ButtonType.Emphasized,
                                    text: sBeginButtonText,
                                }),
                                endButton: new Button({
                                    text: sEndButtonText,
                                    press: function () {
                                        oDialog.close();
                                    },
                                }),
                            });
                            resolve(oDialog);
                        },
                        reject
                    );
                });
            },

            /**
             *
             * @param {sap.m.Dialog} oDialog The dialog control.
             * @param {sap.ui.integration.widgets.Card} oCard The card control.
             * @private
             */
            _setCardDialogTitle: function (oDialog, oCard) {
                var oI18nBundle = this.getView().getModel("i18n").getResourceBundle();
                var sCardEditorTitle = this._getCardTitle(oCard)
                    ? oI18nBundle.getText("WorkPage.CardEditor.Title", [
                        this._getCardTitle(oCard),
                    ])
                    : oI18nBundle.getText("WorkPage.CardEditor.Title.NoCardTitle");
                oDialog.setTitle(sCardEditorTitle);
            },

            /**
             * Creates and returns the CardEditor.
             * @param {sap.ui.integration.widgets.Card} oCard The card control.
             * @since 1.114.0
             *
             * @returns {sap.ui.integration.designtime.editor.CardEditor} The CardEditor instance.
             * @private
             */
            _createCardEditor: function (oCard) {
                return new Promise((fResolve, fReject) => {
                    sap.ui.require(
                        ["sap-ui-integration-card-editor"],
                        () => {
                            sap.ui.require(
                                ["sap/ui/integration/designtime/editor/CardEditor"],
                                (CardEditor) => {
                                    fResolve(
                                        new CardEditor({
                                            previewPosition: "right",
                                            card: oCard,
                                            mode: "content",
                                        })
                                    );
                                },
                                fReject
                            );
                        },
                        fReject
                    );
                });
            },

            /**
             * Creates a dialog to be used with the CardEditor.
             * @since 1.114.0
             * @param {sap.ui.integration.widgets.Card} oCard The card control instance.
             * @returns {Promise<sap.m.Dialog>} Promise that will resolve the Dialog
             * @private
             */
            _createCardEditorDialog: function (oCard) {
                var oI18nBundle = this.getView().getModel("i18n").getResourceBundle();
                var sCardEditorSaveText = oI18nBundle.getText(
                    "WorkPage.CardEditor.Save"
                );
                var sCardEditorCancelText = oI18nBundle.getText(
                    "WorkPage.CardEditor.Cancel"
                );

                return new Promise((resolve, reject) => {
                    sap.ui.require(
                        ["sap/m/Dialog", "sap/m/Button"],
                        (Dialog, Button) => {
                            var oDialog = new Dialog({
                                id: this.createId("cardEditorDialog"),
                                contentWidth: "40rem",
                                beginButton: new Button({
                                    text: sCardEditorSaveText,
                                    type: mLibrary.ButtonType.Emphasized,
                                }),
                                endButton: new Button({
                                    text: sCardEditorCancelText,
                                    press: function () {
                                        oDialog.close();
                                    },
                                }),
                            });
                            resolve(oDialog);
                        },
                        reject
                    );
                });
            },

            /**
             * Returns the card title. First checks if the card has a header title, falls back to the manifest title.
             *
             * @param {sap.ui.integration.widgets.Card} oCard The card control instance.
             * @returns {string} The card title.
             * @since 1.114.0
             */
            _getCardTitle: function (oCard) {
                if (oCard.getCardHeader() && oCard.getCardHeader().getTitle()) {
                    return oCard.getCardHeader().getTitle();
                }
            },

            /**
             * Saves the card's new configuration
             * @since 1.114.0
             * @param {sap.base.Event} oEvent The event object.
             * @param {string} sWidgetContextPath The path to the card.
             * @private
             */
            _onSaveCardEditor: function (oEvent, sWidgetContextPath) {
                var oDialog = oEvent.getSource().getParent();
                var oCardEditor = oDialog.getContent()[0];
                var oCard = oCardEditor.getCard();
                var sWidgetConfigurationsPath =
                    sWidgetContextPath + "/configurations";
                var oCurrentSettings = oCardEditor.getCurrentSettings();
                var aWidgetConfigurations =
                    this.oModel.getProperty(sWidgetConfigurationsPath) || [];

                var oWidgetConfiguration = aWidgetConfigurations.find(function (
                    oConfiguration
                ) {
                    return oConfiguration.level === "PG";
                });

                if (!oWidgetConfiguration) {
                    oWidgetConfiguration = {};
                    oWidgetConfiguration.id = this._generateUniqueId();
                    oWidgetConfiguration.level = "PG";
                    oWidgetConfiguration.settings = {
                        value: oCurrentSettings,
                        schemaVersion: "3.2.0",
                    };
                    aWidgetConfigurations.push(oWidgetConfiguration);
                } else {
                    aWidgetConfigurations = aWidgetConfigurations.map(function (
                        oConfiguration
                    ) {
                        if (oConfiguration.level === "PG") {
                            oConfiguration.settings.value = deepExtend(
                                {},
                                oConfiguration.settings.value,
                                oCurrentSettings
                            );
                        }
                        return oConfiguration;
                    });
                }

                this.oModel.setProperty(
                    sWidgetConfigurationsPath,
                    aWidgetConfigurations
                );

                oCard.setManifestChanges([oCurrentSettings]);

                this.getOwnerComponent().fireEvent("workPageEdited");

                oDialog.close();
            },

            /**
             * Close the edit mode and request to save changes by firing the "closeEditMode" event. The edit mode needs to be managed
             * the outer component to also handle the UserAction Menu button for edit mode.´
             */
            saveEditChanges: function () {
                this.getOwnerComponent().fireEvent("closeEditMode", {
                    saveChanges: true,
                });
            },

            /**
             * Close the edit mode and request to cancel changes by firing the "closeEditMode" event. The edit mode needs to be managed
             * the outer component to also handle the UserAction Menu button for edit mode.´
             */
            cancelEditChanges: function () {
                this.getOwnerComponent().fireEvent("closeEditMode", {
                    saveChanges: false,
                });
            },

            /**
             * Called if a WorkPageCell is dropped before or after another WorkPageCell in a WorkPageColumn.
             *
             * @param {sap.base.Event} oEvent The drop event.
             *
             * @since 1.116.0
             * @private
             */
            onCellDrop: function (oEvent) {
                var oSourceCell = oEvent.getParameter("draggedControl");
                var oTargetCell = oEvent.getParameter("droppedControl");
                var sDropPosition = oEvent.getParameter("dropPosition");
                var oSourceColumn = oSourceCell.getParent();
                var oTargetColumn = oTargetCell.getParent();

                var iSourceIndex = oSourceColumn.indexOfAggregation(
                    "cells",
                    oSourceCell
                );
                var iTargetIndex = oTargetColumn.indexOfAggregation(
                    "cells",
                    oTargetCell
                );

                // Increase the drop position if the dragged element is moved below the target element.
                if (sDropPosition === "After") {
                    iTargetIndex++;
                }

                this._moveCell(
                    oSourceColumn,
                    oTargetColumn,
                    iSourceIndex,
                    iTargetIndex
                );
            },

            /**
             * Called if a WorkPageCell is dropped on an empty WorkPageColumn.
             *
             * @param {sap.base.Event} oEvent The drop event.
             *
             * @since 1.116.0
             * @private
             */
            onCellDropOnEmptyColumn: function (oEvent) {
                var oSourceCell = oEvent.getParameter("draggedControl");
                var oTargetColumn = oEvent.getParameter("droppedControl");
                var oSourceColumn = oSourceCell.getParent();

                var iSourceIndex = oSourceColumn.indexOfAggregation(
                    "cells",
                    oSourceCell
                );
                var iTargetIndex = 0;

                this._moveCell(
                    oSourceColumn,
                    oTargetColumn,
                    iSourceIndex,
                    iTargetIndex
                );
            },

            /**
             * Called if a Visualization is dropped between Cells (e.g. a tile is dropped between two cards)
             *
             * @param {sap.base.Event} oEvent The drop event
             *
             * @since 1.118.0
             * @private
             */
            onVisualizationDropBetweenCells: function (oEvent) {
                const oSourceVisualization = oEvent.getParameter("draggedControl");
                const oTargetCell = oEvent.getParameter("droppedControl");
                const sDropPosition = oEvent.getParameter("dropPosition");
                const oSourceCell = oSourceVisualization.getParent().getParent();
                const oTargetColumn = oTargetCell.getParent();
                let iPositionInTargetColumn = oTargetColumn.indexOfAggregation(
                    "cells",
                    oTargetCell
                );

                if (sDropPosition === "After") {
                    iPositionInTargetColumn++;
                }

                this._moveVisualizationToCellOrColumn(
                    oSourceVisualization,
                    oSourceCell,
                    oTargetColumn,
                    iPositionInTargetColumn
                );
            },

            /**
             * Called when a Visualization is dropped on top of a Cell (e.g. a tile is dropped on top of an empty cells illustrated message)
             *
             * @param {sap.base.Event} oEvent The drop event.
             *
             * @since 1.118.0
             * @private
             */
            onVisualizationDropOnCell: function (oEvent) {
                const oSourceVisualization = oEvent.getParameter("draggedControl");
                const oTargetColumn = oEvent.getParameter("droppedControl");
                const oSourceCell = oSourceVisualization.getParent().getParent();
                const iPositionInTargetColumn = 0;

                this._moveVisualizationToCellOrColumn(
                    oSourceVisualization,
                    oSourceCell,
                    oTargetColumn,
                    iPositionInTargetColumn
                );
            },

            /**
             * Called when a Visualization is dropped on an empty Widget Container
             *
             * @param {sap.base.Event} oEvent The drop event.
             *
             * @since 1.118.0
             * @private
             */
            onVisualizationDropOnEmptyWidgetContainer: function (oEvent) {
                const oSourceVisualization = oEvent.getParameter("draggedControl");
                const oTargetCell = oEvent.getParameter("droppedControl");
                const oSourceCell = oSourceVisualization.getParent().getParent();

                this._moveVisualizationToCellOrColumn(
                    oSourceVisualization,
                    oSourceCell,
                    oTargetCell
                );
            },

            /**
             * Moves a visualization to an empty spot in a Column or into an empty Cell
             *
             * @param {object} oVisualization The Visualization
             * @param {object} oSourceCell The Cell where the tile was initially
             * @param {object} oTargetControl The target control (Column or empty Cell)
             * @param {int} [iPositionInTargetColumn] The position in the target column. Only needed when target control is a WorkPageColumn
             *
             * @since 1.118.0
             * @private
             */
            _moveVisualizationToCellOrColumn: function (
                oVisualization,
                oSourceCell,
                oTargetControl,
                iPositionInTargetColumn
            ) {
                const oModel = this.getView().getModel();
                const sCellWidgetsPath =
                    oSourceCell.getBindingContext().getPath() + "/widgets";
                const aCellWidgets = oModel.getProperty(sCellWidgetsPath);
                const iIndexInSourceCell = oSourceCell.indexOfAggregation(
                    "widgets",
                    oVisualization
                );
                const sSourceVisPath = oVisualization.getBindingContext().getPath();
                const oSourceVisWidgetData = oModel.getProperty(sSourceVisPath);

                aCellWidgets.splice(iIndexInSourceCell, 1);

                // Insert the dragged object into a new target array to avoid mutation.
                const aNewCellWidgets = [].concat(aCellWidgets);

                oModel.setProperty(sCellWidgetsPath, aNewCellWidgets);
                if (
                    oTargetControl.isA(
                        "sap.ushell.components.workPageBuilder.controls.WorkPageCell"
                    )
                ) {
                    this._setCellData(oTargetControl, [oSourceVisWidgetData]);
                } else if (
                    oTargetControl.isA(
                        "sap.ushell.components.workPageBuilder.controls.WorkPageColumn"
                    )
                ) {
                    this._setColumnData(
                        oTargetControl,
                        [oSourceVisWidgetData],
                        iPositionInTargetColumn
                    );
                }
                InvisibleMessage.getInstance().announce(
                    this.getView()
                        .getModel("i18n")
                        .getResourceBundle()
                        .getText("WorkPage.Message.WidgetMoved"),
                    InvisibleMessageMode.Assertive
                );
                this.getOwnerComponent().fireEvent("workPageEdited");
            },

            /**
             * Moves a cell between two columns and updates the model accordingly.
             *
             * @param {sap.ushell.components.workPageBuilder.controls.WorkPageColumn} oSourceColumn The column from where the cell originates from
             * @param {sap.ushell.components.workPageBuilder.controls.WorkPageColumn} oTargetColumn The column where the cell will be moved to
             * @param {int} iSourceIndex The position in the column where the cell originates from
             * @param {int} iTargetIndex The position in the column where the cell will be moved to
             *
             * @private
             * @since 1.116.0
             */
            _moveCell: function (
                oSourceColumn,
                oTargetColumn,
                iSourceIndex,
                iTargetIndex
            ) {
                var oModel = this.getView().getModel();

                var bSameContainer = oTargetColumn.getId() === oSourceColumn.getId();

                var sSourceColumnCellsPath =
                    oSourceColumn.getBindingContext().getPath() + "/cells";
                var sTargetColumnCellsPath =
                    oTargetColumn.getBindingContext().getPath() + "/cells";

                var aSourceColumnCells = oModel.getProperty(sSourceColumnCellsPath);
                var aTargetColumnCells = oModel.getProperty(sTargetColumnCellsPath);

                if (bSameContainer) {
                    // Decrease drop position if the dragged element is taken from before the drop position in the same container.
                    if (iSourceIndex < iTargetIndex) {
                        iTargetIndex--;
                    }
                    // Return if the result is the same for drag position and drop position in the same container (and prevent the MessageToast).
                    if (iSourceIndex === iTargetIndex) {
                        return;
                    }
                }

                // Filter the dragged item from the source array instead of splicing to avoid mutation.
                var aNewDragColumnCells = aSourceColumnCells.filter(function (
                    oWidget,
                    iIndex
                ) {
                    return iIndex !== iSourceIndex;
                });

                // If dnd happened in the same cell, the drop cells become the dragged cells without the dragged object.
                if (bSameContainer) {
                    aTargetColumnCells = aNewDragColumnCells;
                }

                // Insert the dragged object into a new target array to avoid mutation.
                var aNewDropColumnCells = [
                    aTargetColumnCells.slice(0, iTargetIndex),
                    aSourceColumnCells[iSourceIndex],
                    aTargetColumnCells.slice(iTargetIndex),
                ].flat();

                oModel.setProperty(sSourceColumnCellsPath, aNewDragColumnCells);
                oModel.setProperty(sTargetColumnCellsPath, aNewDropColumnCells);

                InvisibleMessage.getInstance().announce(
                    this.getView()
                        .getModel("i18n")
                        .getResourceBundle()
                        .getText("WorkPage.Message.WidgetMoved"),
                    InvisibleMessageMode.Assertive
                );
                this.getOwnerComponent().fireEvent("workPageEdited");
            },

            /**
             * Called if a widget is dropped on the WorkPageCell.
             * @since 1.116.0
             * @param {sap.base.Event} oEvent The drop event.
             */
            onWidgetOnCellDrop: function (oEvent) {
                var oDragged = oEvent.getParameter("draggedControl");
                var oSourceCell = oDragged.getParent().getParent();
                var oTargetCell = oEvent.getParameter("droppedControl");
                var iDragPosition = oSourceCell.indexOfAggregation(
                    "widgets",
                    oDragged
                );
                var iDropPosition = oTargetCell
                    .getBindingContext()
                    .getProperty("widgets").length;

                this._moveVisualization(
                    oSourceCell,
                    oTargetCell,
                    iDragPosition,
                    iDropPosition
                );
            },

            /**
             * Called when a Widget is dragged over a Cell. Prevents the drop for Cells with tiles or based on conditions defined by the parameters.
             * Note: The Tile drop event is prevented here because it is handled by a different drag/drop option via the GridContainer
             *
             * @param {sap.base.Event} oEvent The dragEnter event.
             * @param {object} bEmptyCellExpected Determines whether it is expected that Widgets are already present in the target Cell
             */
            onWidgetOnCellDragEnter: function (oEvent, bEmptyCellExpected) {
                let oCell = oEvent.getParameter("target");
                let bWidgetsPresent = !!oCell
                    .getBindingContext()
                    .getProperty("widgets").length;
                if (
                    (oCell.getTileMode() && bWidgetsPresent) ||
                    bEmptyCellExpected === bWidgetsPresent
                ) {
                    oEvent.preventDefault();
                }
            },

            /**
             * Called if a widget is dropped to a certain position in the GridContainer.
             * @since 1.110.0
             * @param {sap.base.Event} oEvent The drop event.
             */
            onGridDrop: function (oEvent) {
                var oTargetCell = oEvent.getSource();
                var oDragged = oEvent.getParameter("draggedControl");
                var oDropped = oEvent.getParameter("droppedControl");
                var sInsertPosition = oEvent.getParameter("dropPosition");
                var oSourceCell = oDragged.getParent().getParent();

                var iDragPosition = oSourceCell.indexOfAggregation(
                    "widgets",
                    oDragged
                );
                var iDropPosition = oTargetCell.indexOfAggregation(
                    "widgets",
                    oDropped
                );

                var bSameContainer = oTargetCell.getId() === oSourceCell.getId();

                // Increase the drop position if the dragged element is moved to the right.
                if (sInsertPosition === "After") {
                    iDropPosition++;
                }

                if (bSameContainer) {
                    // Decrease drop position if the dragged element is taken from before the drop position in the same container.
                    if (iDragPosition < iDropPosition) {
                        iDropPosition--;
                    }
                    // Return if the result is the same for drag position and drop position in the same container (and prevent the MessageToast).
                    if (iDragPosition === iDropPosition) {
                        return;
                    }
                }

                this._moveVisualization(
                    oSourceCell,
                    oTargetCell,
                    iDragPosition,
                    iDropPosition
                );
            },

            /**
             * Updates the model according to the new positions.
             * Removes the widget data from the widgets in the source cell at the drag position.
             * Inserts the object into the widgets array in the target cell at the drop position.
             *
             * @since 1.110.0
             * @param {sap.ushell.components.workPageBuilder.controls.WorkPageCell} oSourceCell The cell from which the widget was dragged.
             * @param {sap.ushell.components.workPageBuilder.controls.WorkPageCell} oTargetCell The cell into which the widget was dropped.
             * @param {int} iDragPosition The position the widget was dragged from.
             * @param {int} iDropPosition The position the widget was dropped to.
             * @private
             */
            _moveVisualization: function (
                oSourceCell,
                oTargetCell,
                iDragPosition,
                iDropPosition
            ) {
                var oModel = this.getView().getModel();

                var sDragContainerWidgetsPath =
                    oSourceCell.getBindingContext().getPath() + "/widgets";
                var sDropContainerWidgetsPath =
                    oTargetCell.getBindingContext().getPath() + "/widgets";
                var bSameCell =
                    sDragContainerWidgetsPath === sDropContainerWidgetsPath;

                var aDragContainerWidgets = oModel.getProperty(
                    sDragContainerWidgetsPath
                );
                var aDropContainerWidgets = oModel.getProperty(
                    sDropContainerWidgetsPath
                );

                var oDraggedObject = aDragContainerWidgets[iDragPosition];

                // Filter the dragged item from the source array instead of splicing to avoid mutation.
                var aNewDragContainerWidgets = aDragContainerWidgets.filter(function (
                    oWidget,
                    iIndex
                ) {
                    return iIndex !== iDragPosition;
                });

                // If dnd happened in the same cell, the drop widgets become the dragged widgets without the dragged object.
                if (bSameCell) {
                    aDropContainerWidgets = aNewDragContainerWidgets;
                }

                // Insert the dragged object into a new target array to avoid mutation.
                var aNewDropContainerWidgets = [
                    aDropContainerWidgets.slice(0, iDropPosition),
                    oDraggedObject,
                    aDropContainerWidgets.slice(iDropPosition),
                ].flat();

                oModel.setProperty(
                    sDragContainerWidgetsPath,
                    aNewDragContainerWidgets
                );
                oModel.setProperty(
                    sDropContainerWidgetsPath,
                    aNewDropContainerWidgets
                );

                InvisibleMessage.getInstance().announce(
                    this.getView()
                        .getModel("i18n")
                        .getResourceBundle()
                        .getText("WorkPage.Message.WidgetMoved"),
                    InvisibleMessageMode.Assertive
                );
                this.getOwnerComponent().fireEvent("workPageEdited");
            },

            /**
             * Returns true if the aWidgets array does not contain cards.
             *
             * @param {sap.ui.core.Control[]} aWidgets The array of widget controls.
             * @returns {boolean} The result indicating if tileMode is active.
             */
            tileMode: function (aWidgets) {
                var oModel = this.getView().getModel();
                var oUsedViz;

                return (
                    !!aWidgets &&
                    (aWidgets.length > 1 ||
                        !aWidgets.some(function (oWidget) {
                            oUsedViz = oModel.getProperty(
                                "/data/usedVisualizations/" +
                                ObjectPath.get("visualization.id", oWidget)
                            );
                            return ObjectPath.get("type", oUsedViz) === "sap.card";
                        }))
                );
            },

            /**
             * Formatter for the appsearch button. Returns true if the cell is in tileMode and editMode is active.
             *
             * @param {object[]} aWidgets The widgets array.
             * @param {boolean} bEditMode The editMode flag
             * @returns {boolean} The result.
             */
            showAppSearchButton: function (aWidgets, bEditMode) {
                return this.tileMode(aWidgets) && bEditMode;
            },

            /**
             * Updates the model with the columnWidths.
             *
             * @param {sap.ushell.components.workPageBuilder.controls.WorkPageRow} oRow The surrounding row.
             * @param {int} iLeftColumnIndex The index of the left column to update.
             * @param {int} iRightColumnIndex The index of the right column to update.
             * @param {int} iNewLeftColumnWidth The new columnWidth value for the left column.
             * @param {int} iNewRightColumnWidth The new columnWidth value for the right column.
             * @private
             */
            _updateModelWithColumnWidths: function (
                oRow,
                iLeftColumnIndex,
                iRightColumnIndex,
                iNewLeftColumnWidth,
                iNewRightColumnWidth
            ) {
                var oModel = this.getView().getModel();
                var oRowBindingContext = oRow.getBindingContext();
                var sRowBindingContextPath = oRowBindingContext.getPath();
                var sLeftColumnPath =
                    sRowBindingContextPath +
                    "/columns/" +
                    iLeftColumnIndex +
                    "/descriptor/value/columnWidth";
                var sRightColumnPath =
                    sRowBindingContextPath +
                    "/columns/" +
                    iRightColumnIndex +
                    "/descriptor/value/columnWidth";
                oModel.setProperty(sLeftColumnPath, iNewLeftColumnWidth);
                oModel.setProperty(sRightColumnPath, iNewRightColumnWidth);
            },

            /**
             * Gets the column width from the column descriptor entry, falls back to max column width if the columnWidth is empty.
             *
             * @param {object} oColumn The column data object.
             * @returns {int} The column width as an integer.
             * @private
             */
            _getColumnWidth: function (oColumn) {
                return (
                    ObjectPath.get("descriptor.value.columnWidth", oColumn) ||
                    MAX_GRID_COLUMN_WIDTH
                );
            },

            /**
             * Sets the column width to the column descriptor.
             *
             * @param {object} oColumn The column data object.
             * @param {int} iColumnWidth The column data object.
             * @private
             */
            _setColumnWidth: function (oColumn, iColumnWidth) {
                ObjectPath.set("descriptor.value.columnWidth", iColumnWidth, oColumn);
            },

            /**
             *
             * @param {sap.ushell.components.workPageBuilder.controls.WorkPageColumn[]} aColumns An array of WorkPageColumn controls.
             * @param {int} iColumnIndex The column index.
             * @param {int} iTotalColumns The total number of columns.
             * @returns {sap.ushell.components.workPageBuilder.controls.WorkPageColumn[]} The updated array of WorkPageColumn controls.
             * @private
             */
            _calculateColWidths: function (aColumns, iColumnIndex, iTotalColumns) {
                var oColumn = aColumns[iColumnIndex];

                if (
                    this._getColumnWidth(oColumn) - STEP_SIZE >=
                    MIN_GRID_COLUMN_WIDTH
                ) {
                    this._setColumnWidth(
                        oColumn,
                        this._getColumnWidth(oColumn) - STEP_SIZE
                    );
                    iTotalColumns = iTotalColumns - STEP_SIZE;
                }

                if (iTotalColumns > MAX_GRID_COLUMN_WIDTH) {
                    var nextIndex =
                        iColumnIndex - 1 >= 0 ? iColumnIndex - 1 : aColumns.length - 1;
                    this._calculateColWidths(aColumns, nextIndex, iTotalColumns);
                }

                return aColumns;
            },

            /**
             * Returns the data representation of an empty WorkPageColumn.
             *
             * @param {int} iColumnWidth The columnWidth for the column.
             * @returns {object} The WorkPageColumn data object.
             * @private
             */
            _createEmptyColumn: function (iColumnWidth) {
                return {
                    id: this._generateUniqueId(),
                    descriptor: {
                        value: {
                            columnWidth: iColumnWidth,
                        },
                        schemaVersion: "3.2.0",
                    },
                    configurations: [],
                    cells: [],
                };
            },

            /**
             * Returns the data representation of an empty WorkPageRow.
             *
             * @returns {object} The WorkPageRow data object.
             * @private
             */
            _createEmptyRow: function () {
                return {
                    id: this._generateUniqueId(),
                    descriptor: {
                        value: {
                            title: "",
                        },
                        schemaVersion: "3.2.0",
                    },
                    columns: [this._createEmptyColumn(MAX_GRID_COLUMN_WIDTH)],
                };
            },

            /**
             * Saves the host in a variable to be attached to a card.
             *
             * @private
             */
            _saveHost: function () {
                this.oHost = Element.getElementById("sap.shell.host.environment");
                if (!this.oHost) {
                    this.oHost = new WorkPageHost("sap.shell.host.environment");
                    // set the ushell container on the host for navigation service access
                    this.oHost._setContainer(
                        this.getOwnerComponent().getUshellContainer()
                    );
                    // create a property binding for navigationDisabled to forward to host if a model is present.
                    if (this.oModel) {
                        var oNavDisabledBinding = this.oModel.bindProperty(
                            "/navigationDisabled"
                        );
                        this.oHost._setNavigationDisabled(oNavDisabledBinding.getValue());
                        // listen to changes on navigationDisabled and propagate to host
                        oNavDisabledBinding.attachChange(
                            function (oEvent) {
                                this.oHost._setNavigationDisabled(
                                    oEvent.getSource().getValue()
                                );
                            }.bind(this)
                        );
                    }
                }
            },

            /**
             * Check if Navigation is disabled
             *
             * @private
             * @since 1.109.0
             */

            getNavigationDisabled: function () {
                return this.oModel.getProperty("/navigationDisabled");
            },

            /**
             * Disable the navigation on tiles and widgets
             * @param {boolean} bNavigation true or false
             *
             * @private
             * @since 1.109.0
             */

            setNavigationDisabled: function (bNavigation) {
                this.oModel.setProperty("/navigationDisabled", bNavigation);
            },

            /**
             * Returns a unique id which does not yet exist on the WorkPage.
             * Optionally an array of existing IDs can be given as an argument.
             * This can be helpful if new entities are created in a loop but not yet entered into the model.
             *
             * @since 1.112.0
             * @param {string[]} [aExistingIds] An array of existing IDs as strings.
             * @returns {string} A unique ID.
             * @private
             */
            _generateUniqueId: function (aExistingIds) {
                // make a copy to not change the passed array.
                var aIds = (aExistingIds || []).concat([]);
                var oWorkPage = this.oModel.getProperty("/data/workPage");
                var fnCollectIds = this._collectIds.bind(this);

                aIds = aIds.concat(fnCollectIds(oWorkPage));

                (oWorkPage.rows || []).forEach(function (oRow) {
                    aIds = aIds.concat(fnCollectIds(oRow));
                    (oRow.columns || []).forEach(function (oColumn) {
                        aIds = aIds.concat(fnCollectIds(oColumn));
                        (oColumn.cells || []).forEach(function (oCell) {
                            aIds = aIds.concat(fnCollectIds(oCell));
                            (oCell.widgets || []).forEach(function (oWidget) {
                                aIds = aIds.concat(fnCollectIds(oWidget));
                            });
                        });
                    });
                });

                aIds = aIds.filter(function (sId) {
                    return !!sId;
                });

                return utils.generateUniqueId(aIds);
            },

            /**
             * Collects the id and all the configuration ids of an entity on the WorkPage.
             *
             * @param {object} oEntity An entity on the WorkPage
             * @returns {string[]} An array of all ids related to this entity.
             * @private
             * @since 1.116.0
             */
            _collectIds: function (oEntity) {
                var aIds = [oEntity.id];
                var aSettings = oEntity.configurations || [];

                var aConfigIds = aSettings.map(function (oConfig) {
                    return oConfig.id;
                });

                return aIds.concat(aConfigIds);
            },

            // 길로 모듈 get
            get: function (url) {
                let settings = {
                    type: "get",
                    async: true,
                    url: url,
                };
                return new Promise((resolve) => {
                    $.ajax(settings)
                        .done((result, textStatus, request) => {
                            resolve(result);
                        })
                        .fail(function (xhr) {
                            MessageBox.error("Data Read Failed");
                            console.log(xhr);
                        })
                });
            },

            // 길로 모듈 post
            post: function (url, data) {
                return new Promise((resolve) => {
                    $.ajax({
                        url: url,
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('X-CSRF-Token', "Fetch");
                        },
                    })
                        .done((result, textStatus, xhr) => {
                            let token = xhr.getResponseHeader("X-CSRF-Token");
                            $.ajax({
                                type: 'post',
                                async: false,
                                data: JSON.stringify(data),
                                url: url,
                                beforeSend: function (xhr) {
                                    xhr.setRequestHeader('X-CSRF-Token', token);
                                    xhr.setRequestHeader('Content-type', 'application/json');
                                }
                            })
                                .done(function (status) {
                                    resolve(status);
                                })
                                .fail(function (xhr) {
                                    resolve(xhr);
                                    MessageBox.error("Post Request Failed");
                                    console.log(xhr);
                                })
                        })
                        .fail(function (xhr) {
                            MessageBox.error("Token Request Failed");
                            console.log(xhr);
                        })
                });
            },
        });
    });
