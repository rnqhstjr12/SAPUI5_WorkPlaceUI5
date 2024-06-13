//@ui5-bundle sap/ushell/components/workPageBuilder/Component-preload.js
sap.ui.require.preload({
  "sap/ushell/components/workPageBuilder/Component.js": function () {
    //Copyright (c) 2009-2023 SAP SE, All Rights Reserved
    sap.ui.define(
      ["sap/ui/core/UIComponent", "sap/base/util/ObjectPath", "sap/base/Log"],
      function (t, e, o) {
        "use strict";
        return t.extend("sap.ushell.components.workPageBuilder.Component", {
          metadata: {
            manifest: "json",
            library: "sap.ushell",
            events: {
              workPageEdited: {},
              visualizationFilterApplied: {
                parameters: { filters: { type: "array" } },
              },
              closeEditMode: {
                parameters: { saveChanges: { type: "boolean" } },
              },
            },
          },
          init: function () {
            t.prototype.init.apply(this, arguments);
          },
          getEditMode: function () {
            return this.getRootControl().getController().getEditMode();
          },
          setEditMode: function (t) {
            this.getRootControl().getController().setEditMode(t);
          },
          setPreviewMode: function (t) {
            this.getRootControl().getController().setPreviewMode(t);
          },
          getPreviewMode: function () {
            return this.getRootControl().getController().getPreviewMode();
          },
          getPageData: function () {
            return this.getRootControl().getController().getPageData();
          },
          setPageData: function (t) {
            this.getRootControl().getController().setPageData(t);
            return Promise.resolve();
          },
          setVisualizationData: function (t) {
            return this.getRootControl()
              .getController()
              .setVisualizationData(t);
          },
          getNavigationDisabled: function () {
            return this.getRootControl()
              .getController()
              .getNavigationDisabled();
          },
          setNavigationDisabled: function (t) {
            this.getRootControl().getController().setNavigationDisabled(t);
          },
          getUshellContainer: function () {
            return (
              e.get("sap.ushell.Container") ||
              e.get("parent.sap.ushell.Container")
            );
          },
          setShowFooter: function (t) {
            this.getRootControl().getController().setShowFooter(t);
          },
          setShowPageTitle: function (t) {
            this.getRootControl().getController().setShowPageTitle(t);
          },
        });
      }
    );
  },
  "sap/ushell/components/workPageBuilder/controller/WorkPageBuilder.accessibility.js":
    function () {
      //Copyright (c) 2009-2023 SAP SE, All Rights Reserved
      sap.ui.define(["sap/f/library"], function (t) {
        "use strict";
        var i = t.NavigationDirection;
        var e = function () {
          this._oFocusHistory = {
            oLastGrid: null,
            sLastDirection: null,
            iLastRow: null,
            iTargetRow: null,
          };
          this._bInitialItemFocused = false;
        };
        e.prototype._handleBorderReached = function (t, i) {
          var e = this._getCurrentFocusElement();
          var r = t.getSource().getAggregation("_gridContainer");
          var o = t.getParameter("direction");
          var n = t.getParameter("row");
          var s = t.getParameter("column");
          if (
            this._isOppositeDirection(o) &&
            this._oFocusHistory.oLastGrid &&
            !this._oFocusHistory.oLastGrid.isDestroyed() &&
            n === this._oFocusHistory.iTargetRow
          ) {
            this._oFocusHistory.oLastGrid.focusItemByDirection(
              o,
              this._oFocusHistory.iLastRow,
              s
            );
            this._saveFocusHistory(r, o, n);
          } else {
            var a = this._findNextGrid(e, i, o);
            if (a) {
              var u = this._findSuitableRowInGrid(a, e, o);
              a.focusItemByDirection(o, u, s);
              this._saveFocusHistory(r, o, n, u);
            }
          }
        };
        e.prototype._isOppositeDirection = function (t) {
          switch (this._oFocusHistory.sLastDirection) {
            case i.Right:
              return t === i.Left;
            case i.Left:
              return t === i.Right;
            case i.Up:
              return t === i.Down;
            case i.Down:
              return t === i.Up;
            default:
              return false;
          }
        };
        e.prototype._findNextGrid = function (t, i, e) {
          var r = this._getAllGrids(i);
          var o = [];
          r.forEach(
            function (i) {
              if (i === t) {
                return;
              }
              var r = this._getDistanceToElementInDirection(
                t,
                i.getDomRef(),
                e
              );
              if (r) {
                o.push({ oGrid: i, iDistance: r });
              }
            }.bind(this)
          );
          var n = o.sort(function (t, i) {
            return t.iDistance - i.iDistance;
          });
          return n[0] ? n[0].oGrid : null;
        };
        e.prototype._getAllGrids = function (t) {
          var i = t.getRows();
          var e = [];
          i.forEach(function (t) {
            var i = t.getColumns();
            i.forEach(function (t) {
              var i = t.getCells();
              i.forEach(function (t) {
                var i = t.getAggregation("_gridContainer");
                if (i) {
                  e.push(i);
                }
              });
            });
          });
          return e;
        };
        e.prototype._findSuitableRowInGrid = function (t, i, e) {
          var r = t.getNavigationMatrix();
          var o;
          var n;
          o = r.findIndex(
            function (t) {
              return t.find(
                function (t) {
                  if (t === false || t === n) {
                    return false;
                  }
                  n = t;
                  if (this._getDistanceToElementInDirection(i, t, e) !== null) {
                    return true;
                  }
                }.bind(this)
              );
            }.bind(this)
          );
          return o >= 0 ? o : 0;
        };
        e.prototype._getDistanceToElementInDirection = function (t, e, r) {
          var o = e.getBoundingClientRect();
          var n = t.getBoundingClientRect();
          switch (r) {
            case i.Right:
              if (n.right < o.left && n.bottom > o.top && n.top < o.bottom) {
                return o.left - n.right;
              }
              break;
            case i.Left:
              if (n.left > o.right && n.bottom > o.top && n.top < o.bottom) {
                return n.left - o.right;
              }
              break;
            case i.Down:
              if (n.bottom < o.top && n.left < o.right && n.right > o.left) {
                return o.top - n.bottom;
              }
              break;
            case i.Up:
              if (n.top > o.bottom && n.left < o.right && n.right > o.left) {
                return n.top - o.bottom;
              }
              break;
            default:
              break;
          }
          return null;
        };
        e.prototype._saveFocusHistory = function (t, i, e, r) {
          this._oFocusHistory.oLastGrid = t;
          this._oFocusHistory.sLastDirection = i;
          this._oFocusHistory.iLastRow = e;
          this._oFocusHistory.iTargetRow = r;
        };
        e.prototype._getCurrentFocusElement = function () {
          return document.activeElement;
        };
        e.prototype.focusFirstItem = function (t) {
          var i = this._getAllGrids(t);
          var e = i.find(function (t) {
            return t.getItems().length > 0;
          });
          if (e && !this._bInitialItemFocused) {
            this._bInitialItemFocused = true;
            var r = e.getItems()[0];
            var o = r.getDomRef();
            if (o) {
              var n = o.closest(".sapFGridContainerItemWrapper");
              if (n) {
                n.focus({ preventScroll: true });
              }
            }
          }
        };
        return e;
      });
    },
  "sap/ushell/components/workPageBuilder/controller/WorkPageBuilder.controller.js":
    function () {
      //Copyright (c) 2009-2023 SAP SE, All Rights Reserved
      sap.ui.define(
        [
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
        ],
        function (
          e,
          t,
          i,
          r,
          o,
          n,
          a,
          s,
          d,
          l,
          g,
          u,
          c,
          h,
          f,
          v,
          p,
          C,
          P,
          m,
          w,
          D,
          y,
          _,
          M
        ) {
          "use strict";
          var E = g.ValueState;
          var V = ["PR", "CO", "PG"];
          var k = 6;
          var b = 24;
          var W = 2;
          var x = 4;
          var B = n.LoadState;
          var R = g.InvisibleMessageMode;
          var z = M.CardPreviewMode;
          return u.extend(
            "sap.ushell.components.workPageBuilder.controller.WorkPageBuilder",
            {
              onInit: async function () {
                var e = this.byId("workPage");
                this._fnDeleteRowHandler = this.deleteRow.bind(this);
                this._fnDeleteCellHandler = this.deleteCell.bind(this);
                this._fnSaveCardConfiguration =
                  this._onSaveCardEditor.bind(this);
                this._fnResetCardConfiguration =
                  this._onResetCardConfigurations.bind(this);
                this.oModel = new v({
                  maxColumns: x,
                  editMode: false,
                  previewMode: false,
                  loaded: false,
                  navigationDisabled: false,
                  showFooter: false,
                  showPageTitle: true,
                  data: {
                    workPage: null,
                    visualizations: [],
                    usedVisualizations: [],
                  },
                });
                this.oModel.setSizeLimit(Infinity);
                this._saveHost();
                e.bindElement({ path: "/data/workPage" });
                this.oWorkPageBuilderAccessibility = new y();
                this.oWorkPageVizInstantiation = await D.getInstance();
                this.getView().setModel(this.oModel);
                _.register(e);
                this.getView().setModel(_.getModel(), "viewSettings");
              },
              onExit: function () {
                _.deregister();
                if (this.oContentFinderPromise) {
                  this.oContentFinderPromise.then((e) => {
                    e.destroy();
                  });
                }
                if (this.oCardEditorDialogPromise) {
                  this.oCardEditorDialogPromise.then((e) => {
                    e.destroy();
                  });
                }
                if (this.oCardResetDialogPromise) {
                  this.oCardResetDialogPromise.then((e) => {
                    e.destroy();
                  });
                }
                if (this.oDeleteCell) {
                  this.oDeleteCell.then((e) => {
                    e.destroy();
                  });
                }
                if (this.oLoadDeleteDialog) {
                  this.oLoadDeleteDialog.then((e) => {
                    e.destroy();
                  });
                }
              },
              onGridContainerBorderReached: function (e) {
                var t = this.byId("workPage");
                this.oWorkPageBuilderAccessibility._handleBorderReached(e, t);
              },
              onAddColumn: function (e) {
                var t = this.getView().getModel();
                var i = e.getSource();
                var r = i.getParent();
                var o = r.indexOfAggregation("columns", i);
                var n = r.getBindingContext().getPath();
                var a = n + "/columns/";
                var s =
                  i.getBindingContext().getPath() +
                  "/descriptor/value/columnWidth";
                var d = t.getProperty(a);
                var l = d.length;
                var g = e.getParameter("left");
                if (l >= x) {
                  return;
                }
                var u = i.getProperty("columnWidth");
                var c = Math.floor(u / 2) >= k ? Math.floor(u / 2) : k;
                var h = c % 2;
                t.setProperty(s, c + h);
                var f =
                  r.indexOfAggregation("columns", i) + (g === true ? 0 : 1);
                var v = this._createEmptyColumn(c - h);
                var p = [d.slice(0, f), v, d.slice(f)].flat();
                var C = p.reduce(
                  function (e, t) {
                    return e + this._getColumnWidth(t);
                  }.bind(this),
                  0
                );
                if (C > b) {
                  this._calculateColWidths(p, o, C);
                }
                t.setProperty(a, p);
                this.getOwnerComponent().fireEvent("workPageEdited");
              },
              focusFirstItem: function (e) {
                var t = e.getSource();
                this.oWorkPageBuilderAccessibility.focusFirstItem(t);
              },
              setEditMode: function (e) {
                this.oModel.setProperty("/editMode", !!e);
              },
              setPreviewMode: function (e) {
                this.oModel.setProperty("/previewMode", !!e);
              },
              getPreviewMode: function () {
                return this.oModel.getProperty("/previewMode");
              },
              getEditMode: function () {
                return this.oModel.getProperty("/editMode");
              },
              setShowFooter: function (e) {
                this.oModel.setProperty("/showFooter", !!e);
              },
              setShowPageTitle: function (e) {
                this.oModel.setProperty("/showPageTitle", !!e);
              },
              setPageData: function (e) {
                var t = {};
                var r = i.get("workPage.usedVisualizations.nodes", e);
                var o = i.get("workPage.contents", e);
                if (r && r.length > 0) {
                  t = r.reduce(function (e, t) {
                    e[t.id] = t;
                    return e;
                  }, {});
                }
                this.oModel.setProperty("/data/usedVisualizations", t);
                this.oModel.setProperty("/data/workPage", o);
                this.oModel.setProperty("/loaded", true);
              },
              getPageData: function () {
                var e =
                  this.oModel.getProperty("/data/usedVisualizations") || {};
                return {
                  workPage: {
                    contents: this.oModel.getProperty("/data/workPage"),
                    usedVisualizations: { nodes: Object.values(e) },
                  },
                };
              },
              setVisualizationData: function (e) {
                return this.oContentFinderPromise.then(function (t) {
                  t.setVisualizationData(e);
                });
              },
              onGridColumnsChange: function (e) {
                var t = e.getParameter("columns");
                var i = e.getSource();
                i.getWidgets()
                  .filter(function (e) {
                    return e.isA("sap.ui.integration.widgets.Card");
                  })
                  .forEach(function (e) {
                    e.setLayoutData(new o({ columns: t, minRows: 1 }));
                  });
              },
              onDeleteColumn: function (e) {
                var t = this.getView().getModel();
                var i = e.getSource();
                var r = i.getColumnWidth();
                var o = i.getParent();
                var n = o.indexOfAggregation("columns", i);
                var a = o.getBindingContext().getPath();
                var s = a + "/columns/";
                var d = t.getProperty(s);
                var l = d.filter(function (e, t) {
                  return t !== n;
                });
                var g = r / 2;
                var u = n - 1 < 0 ? n : n - 1;
                while (g > 0) {
                  var c = l[u];
                  this._setColumnWidth(c, this._getColumnWidth(c) + W);
                  u = ++u >= l.length ? 0 : u++;
                  g--;
                }
                t.setProperty(s, l);
                o.invalidate();
                this.getOwnerComponent().fireEvent("workPageEdited");
              },
              onAddFirstRow: function () {
                var e = "/data/workPage/rows/";
                this.getView()
                  .getModel()
                  .setProperty(e, [this._createEmptyRow()]);
                this.getOwnerComponent().fireEvent("workPageEdited");
              },
              onAddRow: function (e) {
                var t = this.getView().getModel();
                var i = e.getSource();
                var r = this.byId("workPage");
                var o = "/data/workPage/rows/";
                var n = t.getProperty(o);
                var a = this._createEmptyRow();
                var s =
                  r.indexOfAggregation("rows", i) +
                  (e.getParameter("bottom") === true ? 1 : 0);
                var d = [n.slice(0, s), a, n.slice(s)].flat();
                t.setProperty(o, d);
                this.getOwnerComponent().fireEvent("workPageEdited");
              },
              onResize: function (e) {
                var i = e.getParameter("posXDiff");
                var r = e.getSource();
                var o = r.getParent();
                var n = o.getSingleColumnWidth();
                if (n <= 0) {
                  return;
                }
                var a = t.getRTL();
                var s = i / n;
                if (s > -1 && s < 1) {
                  return;
                }
                var d = s < 0 ? Math.floor(i / n) : Math.ceil(i / n);
                var l = d >= 0 ? "right" : "left";
                var g = l === "right" ? W : -W;
                var u = o.indexOfAggregation("columns", r);
                var c = u - 1;
                var h = o.getColumnFlexValues();
                g = a ? g : -g;
                if (!this._resizeAllowed(h.length, h[c], h[u], g)) {
                  return;
                }
                h[c] -= g;
                h[u] += g;
                o.setGridLayoutString(h);
                this._updateModelWithColumnWidths(o, c, u, h[c], h[u]);
              },
              _resizeAllowed: function (e, t, i, r) {
                var o = this.getView().getModel("viewSettings");
                var n = o.getProperty("/currentBreakpoint/columnMinFlex");
                if (t - r < n) {
                  return false;
                }
                if (i + r < n) {
                  return false;
                }
                var a = o.getProperty("/currentBreakpoint/maxColumnsPerRow");
                if (e > a) {
                  return false;
                }
                return true;
              },
              onResizeCompleted: function () {
                this.getOwnerComponent().fireEvent("workPageEdited");
              },
              onDeleteCell: function (e) {
                var t = e.getSource().getParent().getParent();
                var i = t.getWidgets();
                if (
                  i?.[0] &&
                  i.length === 1 &&
                  i[0].isA("sap.ui.integration.widgets.Card")
                ) {
                  return this.deleteCell(e, { cell: t, dialog: false });
                }
                if (!this.oDeleteCell) {
                  var r = this.getOwnerComponent().getRootControl();
                  this.oDeleteCell = d
                    .load({
                      id: r.createId("cellDeleteDialog"),
                      name: "sap.ushell.components.workPageBuilder.view.WorkPageCellDeleteDialog",
                      controller: this,
                    })
                    .then(
                      function (e) {
                        e.setModel(this.getView().getModel("i18n"), "i18n");
                        return e;
                      }.bind(this)
                    );
                }
                return this.oDeleteCell.then(
                  function (e) {
                    e.getBeginButton().detachEvent(
                      "press",
                      this._fnDeleteCellHandler
                    );
                    e.getBeginButton().attachEvent(
                      "press",
                      { cell: t, dialog: true },
                      this._fnDeleteCellHandler
                    );
                    e.open();
                  }.bind(this)
                );
              },
              deleteCell: function (e, t) {
                var i = t.cell;
                var r = this.getView().getModel();
                var o = i.getParent();
                var n = o.indexOfAggregation("cells", i);
                var a = o.getBindingContext().getPath() + "/cells";
                var s = r.getProperty(a);
                var d = s.filter(function (e, t) {
                  return t !== n;
                });
                r.setProperty(a, d);
                this.getOwnerComponent().fireEvent("workPageEdited");
                if (t.dialog) {
                  return this.oDeleteCell.then(function (e) {
                    e.close();
                  });
                }
                return Promise.resolve();
              },
              _deleteVisualization: function (e) {
                var t = e.getParent().getParent();
                var i = e.getBindingContext();
                var r = i.getPath();
                var o = this.getView().getModel();
                var n = r.substring(0, r.lastIndexOf("/"));
                var a = t.indexOfAggregation("widgets", e);
                var s = o.getProperty(n);
                var d = s.filter(function (e, t) {
                  return t !== a;
                });
                o.setProperty(n, d);
                this.getOwnerComponent().fireEvent("workPageEdited");
              },
              onEditTitle: function () {
                this.getOwnerComponent().fireEvent("workPageEdited");
              },
              onWidgetAdded: function () {
                this.getOwnerComponent().fireEvent("workPageEdited");
              },
              _getWidgetGroups: function () {
                var e = this.getView().getModel("i18n").getResourceBundle();
                var t = [
                  {
                    id: "applicationWidgets",
                    widgets: [
                      {
                        id: "widgets-tiles",
                        title: e.getText("ContentFinder.Widgets.Tiles.Title"),
                        description: e.getText(
                          "ContentFinder.Widgets.Tiles.Description"
                        ),
                        icon: "sap-icon://header",
                        target: "appSearch_tiles",
                      },
                      {
                        id: "widgets-cards",
                        title: e.getText("ContentFinder.Widgets.Cards.Title"),
                        description: e.getText(
                          "ContentFinder.Widgets.Cards.Description"
                        ),
                        icon: "sap-icon://card",
                        target: "appSearch_cards",
                      },
                    ],
                  },
                ];
                return t;
              },
              createContentFinderComponent: function () {
                this.oContentFinderPromise = a.create({
                  id: this.getOwnerComponent().createId(
                    "workPageContentFinder"
                  ),
                  name: "sap.ushell.components.contentFinder",
                });
                return this.oContentFinderPromise;
              },
              openWidgetGallery: function (e) {
                var t = e.getSource();
                if (!this.oContentFinderPromise) {
                  this.oContentFinderPromise =
                    this.createContentFinderComponent();
                }
                return this.oContentFinderPromise.then(
                  function (e) {
                    e.setWidgetGroups(this._getWidgetGroups());
                    e.attachVisualizationsAdded(
                      t,
                      this._onAddVisualization,
                      this
                    );
                    e.attachVisualizationFilterApplied(
                      t,
                      function (e) {
                        this.getOwnerComponent().fireEvent(
                          "visualizationFilterApplied",
                          e.getParameters()
                        );
                      },
                      this
                    );
                    e.show("widgetGallery");
                  }.bind(this)
                );
              },
              openTilesAppSearch: function (e) {
                var t = e.getSource().getParent().getParent();
                if (!this.oContentFinderPromise) {
                  this.oContentFinderPromise =
                    this.createContentFinderComponent();
                }
                return this.oContentFinderPromise.then(
                  function (e) {
                    e.setContextData({
                      restrictedVisualizations:
                        this._getRestrictedVisualizationIds(t),
                    });
                    e.setRestrictedMode(true);
                    e.attachVisualizationsAdded(
                      t,
                      this._onAddVisualization,
                      this
                    );
                    e.attachVisualizationFilterApplied(
                      t,
                      function (e) {
                        this.getOwnerComponent().fireEvent(
                          "visualizationFilterApplied",
                          e.getParameters()
                        );
                      },
                      this
                    );
                    e.show("appSearch_tiles");
                  }.bind(this)
                );
              },
              _getRestrictedVisualizationIds: function (e) {
                return e.getWidgets().map(function (e) {
                  if (e.isA("sap.ushell.ui.launchpad.VizInstanceCdm")) {
                    return e.getProperty("vizRefId");
                  }
                });
              },
              _onAddVisualization: function (e, t) {
                const i = this.getView().getModel();
                var r = e.getParameter("visualizations");
                if (r.length > 0) {
                  r.forEach(function (e) {
                    var t = "/data/usedVisualizations/" + e.id;
                    if (!i.getProperty(t)) {
                      i.setProperty(t, e.vizData);
                    }
                  });
                  var o = this._instantiateWidgetData(r);
                  if (
                    t.isA(
                      "sap.ushell.components.workPageBuilder.controls.WorkPageCell"
                    )
                  ) {
                    this._setCellData(t, o);
                  }
                  if (
                    t.isA(
                      "sap.ushell.components.workPageBuilder.controls.WorkPageColumn"
                    )
                  ) {
                    this._setColumnData(t, o);
                  }
                }
              },
              _instantiateWidgetData: function (e) {
                var t = [];
                var i;
                return e.map(
                  function (e) {
                    i = this._generateUniqueId(t);
                    t = t.concat([i]);
                    return { id: i, visualization: { id: e.vizData.id } };
                  }.bind(this)
                );
              },
              _setCellData: function (e, t) {
                const i = this.getView().getModel();
                var r = e.getBindingContext().getPath();
                var o = Object.assign({}, i.getProperty(r));
                o.widgets = o.widgets.concat(t);
                i.setProperty(r, o);
                this.onWidgetAdded();
              },
              _setColumnData: function (e, t, i) {
                const r = this.getView().getModel();
                let o = e.getBindingContext().getPath();
                let n = Object.assign({}, r.getProperty(o));
                let a = {
                  id: this._generateUniqueId(),
                  descriptor: { value: {}, schemaVersion: "3.2.0" },
                  widgets: t.concat([]),
                };
                if (!n.cells) {
                  n.cells = [];
                }
                if (i === undefined || i > n.cells.length) {
                  i = n.cells.length;
                }
                let s = n.cells.concat([]);
                s.splice(i, 0, a);
                n.cells = s;
                r.setProperty(o, n);
                this.onWidgetAdded();
              },
              onDeleteRow: function (e) {
                var t = this.getOwnerComponent().getRootControl();
                var i = e.getSource().getBindingContext();
                if (!this.oLoadDeleteDialog) {
                  this.oLoadDeleteDialog = d
                    .load({
                      id: t.createId("rowDeleteDialog"),
                      name: "sap.ushell.components.workPageBuilder.view.WorkPageRowDeleteDialog",
                      controller: this,
                    })
                    .then(
                      function (e) {
                        e.setModel(this.getView().getModel("i18n"), "i18n");
                        return e;
                      }.bind(this)
                    );
                }
                return this.oLoadDeleteDialog.then(
                  function (e) {
                    e.getBeginButton().detachEvent(
                      "press",
                      this._fnDeleteRowHandler
                    );
                    e.getBeginButton().attachEvent(
                      "press",
                      { rowContext: i },
                      this._fnDeleteRowHandler
                    );
                    e.open();
                  }.bind(this)
                );
              },
              deleteRow: function (e, t) {
                var i = this.getView().getModel();
                var r = t.rowContext;
                var o = i.getProperty("/data/workPage/rows");
                var n = r.getObject();
                var a = o.filter(function (e) {
                  return e.id !== n.id;
                });
                i.setProperty("/data/workPage/rows", a);
                this.getOwnerComponent().fireEvent("workPageEdited");
                return this.oLoadDeleteDialog.then(function (e) {
                  e.close();
                });
              },
              onRowDeleteCancel: function () {
                return this.oLoadDeleteDialog.then(function (e) {
                  e.close();
                });
              },
              onCellDeleteCancel: function () {
                return this.oDeleteCell.then(function (e) {
                  e.close();
                });
              },
              _createErrorTile: function () {
                return new m({ state: B.Failed })
                  .attachPress(this.onVisualizationPress, this)
                  .bindEditable("/editMode")
                  .bindSizeBehavior(
                    "viewSettings>/currentBreakpoint/sizeBehavior"
                  )
                  .setLayoutData(new o({ columns: 2, rows: 2 }));
              },
              widgetFactory: function (t, i) {
                var r = i.getProperty("visualization/id");
                if (!r) {
                  e.error("No vizId found in widget context.");
                  return this._createErrorTile();
                }
                var o = this.getView()
                  .getModel()
                  .getProperty("/data/usedVisualizations/" + r);
                if (!o || !o.type) {
                  e.error("No viz or vizType found for vizId " + r);
                  return this._createErrorTile();
                }
                var n = i.getProperty("configurations") || [];
                var a = o.configurations || [];
                var s = this._getMergedAndSortedConfigurations(n, a);
                var d = i.getPath();
                switch (o.type) {
                  case "sap.card":
                    return this._createCard(o, n, s, d);
                  case "sap.ushell.StaticAppLauncher":
                  case "sap.ushell.DynamicAppLauncher":
                    return this._createVizInstance(o);
                  default:
                    e.error("Unknown type for widget " + o.type);
                    return this._createErrorTile();
                }
              },
              _getMergedAndSortedConfigurations: function (e, t) {
                if (e.length === 0 && t.length === 0) {
                  return [];
                }
                var i = V.reduce(function (i, o) {
                  var n = e.find(function (e) {
                    return e.level === o;
                  });
                  var a = t.find(function (e) {
                    return e.level === o;
                  });
                  var s = r({}, a, n);
                  if (Object.keys(s).length > 0) {
                    i[o] = s;
                  }
                  return i;
                }, {});
                return this._sortConfigurations(Object.values(i));
              },
              _sortConfigurations: function (e) {
                var t =
                  e &&
                  e.sort(function (e, t) {
                    return V.indexOf(e.level) - V.indexOf(t.level);
                  });
                return t.map(function (e) {
                  return e.settings.value;
                });
              },
              _createVizInstance: function (t) {
                const i = r({}, t, {
                  preview: this.oModel.getProperty("/previewMode"),
                });
                if (
                  this.oModel.getProperty("/navigationDisabled") &&
                  i._siteData
                ) {
                  delete i._siteData.target;
                  delete i._siteData.targetURL;
                }
                var n = this.oWorkPageVizInstantiation.createVizInstance(i);
                if (!n) {
                  e.error("No VizInstance was created.");
                  return this._createErrorTile();
                }
                return n
                  .setActive(true)
                  .bindPreview("/previewMode")
                  .attachPress(this.onVisualizationPress, this)
                  .bindEditable("/editMode")
                  .bindSizeBehavior(
                    "viewSettings>/currentBreakpoint/sizeBehavior"
                  )
                  .bindClickable({
                    path: "/navigationDisabled",
                    formatter: function (e) {
                      return !e;
                    },
                  })
                  .setLayoutData(new o(n.getLayout()));
              },
              formatRowAriaLabel: function (e, t = [], i) {
                const r = this.getView().getModel("i18n").getResourceBundle();
                if (i) {
                  return r.getText("WorkPage.Row.Named.AriaLabel", [i]);
                }
                const o = t.findIndex((t) => t.id === e);
                if (o < 0) {
                  return "";
                }
                return r.getText("WorkPage.Row.Unnamed.AriaLabel", [o + 1]);
              },
              _getDataSource: function (e, t) {
                if (!t || !e) {
                  return;
                }
                return e[t.dataSource];
              },
              onVisualizationPress: function (e) {
                var t = e.getParameter("scope");
                var i = e.getParameter("action");
                if (t === "Actions" && i === "Remove") {
                  this._deleteVisualization(e.getSource());
                }
              },
              _createCard: function (t = {}, r = [], n = [], a = "") {
                var s = {};
                var d =
                  t.descriptor &&
                  t.descriptor.value &&
                  t.descriptor.value["sap.card"];
                var l =
                  t.descriptorResources &&
                  (t.descriptorResources.baseUrl ||
                    t.descriptorResources.descriptorPath);
                var g = r.some(function (e) {
                  return e.level === "PG";
                });
                var u;
                if (!d && !l) {
                  e.error("No descriptor or descriptorResources for Card");
                  return new f().setLayoutData(new o({ columns: 2, rows: 2 }));
                }
                if (d) {
                  s.manifest = t.descriptor.value;
                  u = !!i.get(
                    ["descriptor", "value", "sap.card", "configuration"],
                    t
                  );
                  if (l) {
                    s.baseUrl =
                      t.descriptorResources.baseUrl +
                      t.descriptorResources.descriptorPath;
                  }
                } else if (l) {
                  s.manifest =
                    t.descriptorResources.baseUrl +
                    t.descriptorResources.descriptorPath;
                  if (!s.manifest.endsWith(".json")) {
                    s.manifest += "/manifest.json";
                  }
                }
                s.referenceId = "";
                if (t.id) {
                  var c = t.id.indexOf("_");
                  if (c > 0) {
                    var h = t.id.substring(0, c);
                    s.referenceId = h;
                  }
                }
                if (s.baseUrl && s.baseUrl.substr(-1) !== "/") {
                  s.baseUrl += "/";
                }
                var v = new f(s);
                if (u) {
                  var p = this._createCardConfigurationActionDefinition(
                    v,
                    a,
                    this._openCardConfigurationEditor.bind(this)
                  );
                  v.addActionDefinition(p);
                }
                if (g) {
                  var C = this._createCardResetActionDefinition(
                    r,
                    a,
                    this._openResetCardConfigurationDialog.bind(this)
                  );
                  v.addActionDefinition(C);
                }
                return v
                  .setModel(this.oModel, "workPageModel")
                  .bindProperty("previewMode", {
                    path: "workPageModel>/previewMode",
                    formatter: function (e) {
                      return e ? z.MockData : z.Off;
                    },
                  })
                  .setManifestChanges(n)
                  .addStyleClass("workpageCellWidget")
                  .setHost(this.oHost)
                  .setLayoutData(new o({ columns: 16, minRows: 1 }));
              },
              _createCardConfigurationActionDefinition: function (e, t, i) {
                const r = this.getView()
                  .getModel("i18n")
                  .getResourceBundle()
                  .getText("WorkPage.Card.ActionDefinition.Configure");
                const o = new c({
                  type: "Custom",
                  visible: "{/editMode}",
                  buttonType: "Transparent",
                  text: r,
                });
                o.setModel(this.oModel);
                o.attachPress({ card: e, widgetContextPath: t }, i);
                return o;
              },
              _createCardResetActionDefinition: function (e, t, i) {
                const r = this.getView()
                  .getModel("i18n")
                  .getResourceBundle()
                  .getText("WorkPage.Card.ActionDefinition.Reset");
                const o = new c({
                  type: "Custom",
                  visible: "{/editMode}",
                  buttonType: "Transparent",
                  text: r,
                });
                o.setModel(this.oModel);
                o.attachPress(
                  { widgetContextPath: t, widgetConfigurations: e },
                  i
                );
                return o;
              },
              _openCardConfigurationEditor: function (e, t) {
                if (!this.oCardEditorDialogPromise) {
                  this.oCardEditorDialogPromise = this._createCardEditorDialog(
                    t.card
                  );
                }
                var i = this._createCardEditor(t.card);
                return Promise.all([i, this.oCardEditorDialogPromise]).then(
                  function (e) {
                    this.oCardEditorDialog = e[1];
                    this.oCardEditorDialog.removeAllContent();
                    this.oCardEditorDialog
                      .getBeginButton()
                      .detachPress(this._fnSaveCardConfiguration)
                      .attachPress(
                        t.widgetContextPath,
                        this._fnSaveCardConfiguration
                      );
                    this._setCardDialogTitle(this.oCardEditorDialog, t.card);
                    this.oCardEditorDialog.addContent(e[0]);
                    this.oCardEditorDialog.open();
                  }.bind(this)
                );
              },
              _openResetCardConfigurationDialog: function (e, t) {
                if (!this.oCardResetDialogPromise) {
                  this.oCardResetDialogPromise =
                    this._createResetCardConfigurationDialog();
                }
                return this.oCardResetDialogPromise.then(
                  function (e) {
                    this.oCardResetDialog = e;
                    this.getView().addDependent(this.oCardResetDialog);
                    this.oCardResetDialog
                      .getBeginButton()
                      .detachPress(this._fnResetCardConfiguration)
                      .attachPress(t, this._fnResetCardConfiguration);
                    this.oCardResetDialog.open();
                  }.bind(this)
                );
              },
              _onResetCardConfigurations: function (e, t) {
                var i = e.getSource().getParent();
                var r = t.widgetConfigurations;
                var o = t.widgetContextPath + "/configurations";
                var n = r.filter(function (e) {
                  return e.level !== "PG";
                });
                this.oModel.setProperty(o, n);
                this.getOwnerComponent().fireEvent("workPageEdited");
                i.close();
              },
              _createResetCardConfigurationDialog: function () {
                var e = this.getView().getModel("i18n").getResourceBundle();
                var t = e.getText(
                  "WorkPage.CardEditor.DeleteConfigurationDialog.Title"
                );
                var i = e.getText(
                  "WorkPage.CardEditor.DeleteConfigurationDialog.Content"
                );
                var r = e.getText(
                  "WorkPage.CardEditor.DeleteConfigurationDialog.Accept"
                );
                var o = e.getText(
                  "WorkPage.CardEditor.DeleteConfigurationDialog.Deny"
                );
                return new Promise((e, a) => {
                  sap.ui.require(
                    ["sap/m/Dialog", "sap/m/Button", "sap/m/Text"],
                    (a, s, d) => {
                      var l = new a({
                        id: this.createId("cardConfigurationResetDialog"),
                        type: n.DialogType.Message,
                        state: E.Warning,
                        title: t,
                        content: new d({ text: i }),
                        beginButton: new s({
                          type: n.ButtonType.Emphasized,
                          text: r,
                        }),
                        endButton: new s({
                          text: o,
                          press: function () {
                            l.close();
                          },
                        }),
                      });
                      e(l);
                    },
                    a
                  );
                });
              },
              _setCardDialogTitle: function (e, t) {
                var i = this.getView().getModel("i18n").getResourceBundle();
                var r = this._getCardTitle(t)
                  ? i.getText("WorkPage.CardEditor.Title", [
                      this._getCardTitle(t),
                    ])
                  : i.getText("WorkPage.CardEditor.Title.NoCardTitle");
                e.setTitle(r);
              },
              _createCardEditor: function (e) {
                return new Promise((t, i) => {
                  sap.ui.require(
                    ["sap-ui-integration-card-editor"],
                    () => {
                      sap.ui.require(
                        ["sap/ui/integration/designtime/editor/CardEditor"],
                        (i) => {
                          t(
                            new i({
                              previewPosition: "right",
                              card: e,
                              mode: "content",
                            })
                          );
                        },
                        i
                      );
                    },
                    i
                  );
                });
              },
              _createCardEditorDialog: function (e) {
                var t = this.getView().getModel("i18n").getResourceBundle();
                var i = t.getText("WorkPage.CardEditor.Save");
                var r = t.getText("WorkPage.CardEditor.Cancel");
                return new Promise((e, t) => {
                  sap.ui.require(
                    ["sap/m/Dialog", "sap/m/Button"],
                    (t, o) => {
                      var a = new t({
                        id: this.createId("cardEditorDialog"),
                        contentWidth: "40rem",
                        beginButton: new o({
                          text: i,
                          type: n.ButtonType.Emphasized,
                        }),
                        endButton: new o({
                          text: r,
                          press: function () {
                            a.close();
                          },
                        }),
                      });
                      e(a);
                    },
                    t
                  );
                });
              },
              _getCardTitle: function (e) {
                if (e.getCardHeader() && e.getCardHeader().getTitle()) {
                  return e.getCardHeader().getTitle();
                }
              },
              _onSaveCardEditor: function (e, t) {
                var i = e.getSource().getParent();
                var o = i.getContent()[0];
                var n = o.getCard();
                var a = t + "/configurations";
                var s = o.getCurrentSettings();
                var d = this.oModel.getProperty(a) || [];
                var l = d.find(function (e) {
                  return e.level === "PG";
                });
                if (!l) {
                  l = {};
                  l.id = this._generateUniqueId();
                  l.level = "PG";
                  l.settings = { value: s, schemaVersion: "3.2.0" };
                  d.push(l);
                } else {
                  d = d.map(function (e) {
                    if (e.level === "PG") {
                      e.settings.value = r({}, e.settings.value, s);
                    }
                    return e;
                  });
                }
                this.oModel.setProperty(a, d);
                n.setManifestChanges([s]);
                this.getOwnerComponent().fireEvent("workPageEdited");
                i.close();
              },
              saveEditChanges: function () {
                this.getOwnerComponent().fireEvent("closeEditMode", {
                  saveChanges: true,
                });
              },
              cancelEditChanges: function () {
                this.getOwnerComponent().fireEvent("closeEditMode", {
                  saveChanges: false,
                });
              },
              onCellDrop: function (e) {
                var t = e.getParameter("draggedControl");
                var i = e.getParameter("droppedControl");
                var r = e.getParameter("dropPosition");
                var o = t.getParent();
                var n = i.getParent();
                var a = o.indexOfAggregation("cells", t);
                var s = n.indexOfAggregation("cells", i);
                if (r === "After") {
                  s++;
                }
                this._moveCell(o, n, a, s);
              },
              onCellDropOnEmptyColumn: function (e) {
                var t = e.getParameter("draggedControl");
                var i = e.getParameter("droppedControl");
                var r = t.getParent();
                var o = r.indexOfAggregation("cells", t);
                var n = 0;
                this._moveCell(r, i, o, n);
              },
              onVisualizationDropBetweenCells: function (e) {
                const t = e.getParameter("draggedControl");
                const i = e.getParameter("droppedControl");
                const r = e.getParameter("dropPosition");
                const o = t.getParent().getParent();
                const n = i.getParent();
                let a = n.indexOfAggregation("cells", i);
                if (r === "After") {
                  a++;
                }
                this._moveVisualizationToCellOrColumn(t, o, n, a);
              },
              onVisualizationDropOnCell: function (e) {
                const t = e.getParameter("draggedControl");
                const i = e.getParameter("droppedControl");
                const r = t.getParent().getParent();
                const o = 0;
                this._moveVisualizationToCellOrColumn(t, r, i, o);
              },
              onVisualizationDropOnEmptyWidgetContainer: function (e) {
                const t = e.getParameter("draggedControl");
                const i = e.getParameter("droppedControl");
                const r = t.getParent().getParent();
                this._moveVisualizationToCellOrColumn(t, r, i);
              },
              _moveVisualizationToCellOrColumn: function (e, t, i, r) {
                const o = this.getView().getModel();
                const n = t.getBindingContext().getPath() + "/widgets";
                const a = o.getProperty(n);
                const s = t.indexOfAggregation("widgets", e);
                const d = e.getBindingContext().getPath();
                const g = o.getProperty(d);
                a.splice(s, 1);
                const u = [].concat(a);
                o.setProperty(n, u);
                if (
                  i.isA(
                    "sap.ushell.components.workPageBuilder.controls.WorkPageCell"
                  )
                ) {
                  this._setCellData(i, [g]);
                } else if (
                  i.isA(
                    "sap.ushell.components.workPageBuilder.controls.WorkPageColumn"
                  )
                ) {
                  this._setColumnData(i, [g], r);
                }
                l.getInstance().announce(
                  this.getView()
                    .getModel("i18n")
                    .getResourceBundle()
                    .getText("WorkPage.Message.WidgetMoved"),
                  R.Assertive
                );
                this.getOwnerComponent().fireEvent("workPageEdited");
              },
              _moveCell: function (e, t, i, r) {
                var o = this.getView().getModel();
                var n = t.getId() === e.getId();
                var a = e.getBindingContext().getPath() + "/cells";
                var s = t.getBindingContext().getPath() + "/cells";
                var d = o.getProperty(a);
                var g = o.getProperty(s);
                if (n) {
                  if (i < r) {
                    r--;
                  }
                  if (i === r) {
                    return;
                  }
                }
                var u = d.filter(function (e, t) {
                  return t !== i;
                });
                if (n) {
                  g = u;
                }
                var c = [g.slice(0, r), d[i], g.slice(r)].flat();
                o.setProperty(a, u);
                o.setProperty(s, c);
                l.getInstance().announce(
                  this.getView()
                    .getModel("i18n")
                    .getResourceBundle()
                    .getText("WorkPage.Message.WidgetMoved"),
                  R.Assertive
                );
                this.getOwnerComponent().fireEvent("workPageEdited");
              },
              onWidgetOnCellDrop: function (e) {
                var t = e.getParameter("draggedControl");
                var i = t.getParent().getParent();
                var r = e.getParameter("droppedControl");
                var o = i.indexOfAggregation("widgets", t);
                var n = r.getBindingContext().getProperty("widgets").length;
                this._moveVisualization(i, r, o, n);
              },
              onWidgetOnCellDragEnter: function (e, t) {
                let i = e.getParameter("target");
                let r = !!i.getBindingContext().getProperty("widgets").length;
                if ((i.getTileMode() && r) || t === r) {
                  e.preventDefault();
                }
              },
              onGridDrop: function (e) {
                var t = e.getSource();
                var i = e.getParameter("draggedControl");
                var r = e.getParameter("droppedControl");
                var o = e.getParameter("dropPosition");
                var n = i.getParent().getParent();
                var a = n.indexOfAggregation("widgets", i);
                var s = t.indexOfAggregation("widgets", r);
                var d = t.getId() === n.getId();
                if (o === "After") {
                  s++;
                }
                if (d) {
                  if (a < s) {
                    s--;
                  }
                  if (a === s) {
                    return;
                  }
                }
                this._moveVisualization(n, t, a, s);
              },
              _moveVisualization: function (e, t, i, r) {
                var o = this.getView().getModel();
                var n = e.getBindingContext().getPath() + "/widgets";
                var a = t.getBindingContext().getPath() + "/widgets";
                var s = n === a;
                var d = o.getProperty(n);
                var g = o.getProperty(a);
                var u = d[i];
                var c = d.filter(function (e, t) {
                  return t !== i;
                });
                if (s) {
                  g = c;
                }
                var h = [g.slice(0, r), u, g.slice(r)].flat();
                o.setProperty(n, c);
                o.setProperty(a, h);
                l.getInstance().announce(
                  this.getView()
                    .getModel("i18n")
                    .getResourceBundle()
                    .getText("WorkPage.Message.WidgetMoved"),
                  R.Assertive
                );
                this.getOwnerComponent().fireEvent("workPageEdited");
              },
              tileMode: function (e) {
                var t = this.getView().getModel();
                var r;
                return (
                  !!e &&
                  (e.length > 1 ||
                    !e.some(function (e) {
                      r = t.getProperty(
                        "/data/usedVisualizations/" +
                          i.get("visualization.id", e)
                      );
                      return i.get("type", r) === "sap.card";
                    }))
                );
              },
              showAppSearchButton: function (e, t) {
                return this.tileMode(e) && t;
              },
              _updateModelWithColumnWidths: function (e, t, i, r, o) {
                var n = this.getView().getModel();
                var a = e.getBindingContext();
                var s = a.getPath();
                var d = s + "/columns/" + t + "/descriptor/value/columnWidth";
                var l = s + "/columns/" + i + "/descriptor/value/columnWidth";
                n.setProperty(d, r);
                n.setProperty(l, o);
              },
              _getColumnWidth: function (e) {
                return i.get("descriptor.value.columnWidth", e) || b;
              },
              _setColumnWidth: function (e, t) {
                i.set("descriptor.value.columnWidth", t, e);
              },
              _calculateColWidths: function (e, t, i) {
                var r = e[t];
                if (this._getColumnWidth(r) - W >= k) {
                  this._setColumnWidth(r, this._getColumnWidth(r) - W);
                  i = i - W;
                }
                if (i > b) {
                  var o = t - 1 >= 0 ? t - 1 : e.length - 1;
                  this._calculateColWidths(e, o, i);
                }
                return e;
              },
              _createEmptyColumn: function (e) {
                return {
                  id: this._generateUniqueId(),
                  descriptor: {
                    value: { columnWidth: e },
                    schemaVersion: "3.2.0",
                  },
                  configurations: [],
                  cells: [],
                };
              },
              _createEmptyRow: function () {
                return {
                  id: this._generateUniqueId(),
                  descriptor: { value: { title: "" }, schemaVersion: "3.2.0" },
                  columns: [this._createEmptyColumn(b)],
                };
              },
              _saveHost: function () {
                this.oHost = s.getElementById("sap.shell.host.environment");
                if (!this.oHost) {
                  this.oHost = new h("sap.shell.host.environment");
                  this.oHost._setContainer(
                    this.getOwnerComponent().getUshellContainer()
                  );
                  if (this.oModel) {
                    var e = this.oModel.bindProperty("/navigationDisabled");
                    this.oHost._setNavigationDisabled(e.getValue());
                    e.attachChange(
                      function (e) {
                        this.oHost._setNavigationDisabled(
                          e.getSource().getValue()
                        );
                      }.bind(this)
                    );
                  }
                }
              },
              getNavigationDisabled: function () {
                return this.oModel.getProperty("/navigationDisabled");
              },
              setNavigationDisabled: function (e) {
                this.oModel.setProperty("/navigationDisabled", e);
              },
              _generateUniqueId: function (e) {
                var t = (e || []).concat([]);
                var i = this.oModel.getProperty("/data/workPage");
                var r = this._collectIds.bind(this);
                t = t.concat(r(i));
                (i.rows || []).forEach(function (e) {
                  t = t.concat(r(e));
                  (e.columns || []).forEach(function (e) {
                    t = t.concat(r(e));
                    (e.cells || []).forEach(function (e) {
                      t = t.concat(r(e));
                      (e.widgets || []).forEach(function (e) {
                        t = t.concat(r(e));
                      });
                    });
                  });
                });
                t = t.filter(function (e) {
                  return !!e;
                });
                return w.generateUniqueId(t);
              },
              _collectIds: function (e) {
                var t = [e.id];
                var i = e.configurations || [];
                var r = i.map(function (e) {
                  return e.id;
                });
                return t.concat(r);
              },
            }
          );
        }
      );
    },
  "sap/ushell/components/workPageBuilder/controller/WorkPageBuilder.layout.js":
    function () {
      // Copyright (c) 2009-2023 SAP SE, All Rights Reserved
      sap.ui.define(
        [
          "sap/m/library",
          "sap/ui/core/ResizeHandler",
          "sap/base/Log",
          "sap/ui/model/json/JSONModel",
          "sap/ushell/Config",
          "sap/ushell/EventHub",
          "sap/ushell/utils",
        ],
        function (e, t, i, o, l, s, n) {
          "use strict";
          var r = e.TileSizeBehavior;
          var a = function () {
            this._oLayoutModel = new o({ currentBreakpoint: {} });
          };
          a.prototype._onLayoutChange = function () {
            var e;
            if (!this._oControl) {
              return;
            }
            if (this._oControl instanceof Element) {
              e = this._oControl;
            } else {
              e = this._oControl.isA("sap.ui.core.Control")
                ? this._oControl.getDomRef()
                : null;
            }
            if (!e) {
              return;
            }
            this.onResize({ size: { width: e.getBoundingClientRect().width } });
          };
          a.prototype.register = function (e) {
            if (this._sResizeHandlerId) {
              i.warning(
                "A ResizeHandler is already registered. Deregister first."
              );
              return;
            }
            this._oControl = e;
            this._sResizeHandlerId = t.register(
              this._oControl,
              this.onResize.bind(this)
            );
            l.on("/core/home/sizeBehavior").do(this._onLayoutChange.bind(this));
            s.on("themeChanged").do(this._onLayoutChange.bind(this));
          };
          a.prototype.getModel = function () {
            return this._oLayoutModel;
          };
          a.prototype.deregister = function () {
            if (this._sResizeHandlerId) {
              t.deregister(this._sResizeHandlerId);
              this._sResizeHandlerId = null;
            }
          };
          a.prototype.onResize = async function (e) {
            if (this.iWidth === e.size.width) {
              return;
            }
            this.iWidth = e.size.width;
            var t = await this._getBreakpointSettingsForWidth(e.size.width);
            this._oLayoutModel.setProperty("/currentBreakpoint", t);
          };
          a.prototype._getBreakpointSettingsForWidth = async function (e) {
            var t = await this._getBreakpointSettings();
            for (var i in t) {
              if (e <= t[i].high && e >= t[i].low) {
                return t[i];
              }
            }
          };
          a.prototype._formatNumericThemeParam = function (e) {
            if (e && e.indexOf(".") === 0) {
              e = "0" + e;
            }
            return e;
          };
          a.prototype._getWorkPageColumnMinFlex = function (e) {
            const t = this._oControl.getDomRef();
            if (!t) {
              return 4;
            }
            const i = t.querySelector(".workPageRowInner");
            if (!i) {
              return 4;
            }
            if (i.offsetWidth <= 0) {
              return 4;
            }
            return Math.ceil(e / (i.offsetWidth / 24));
          };
          a.prototype._getBreakpointSettings = async function () {
            var e = l.last("/core/home/sizeBehavior");
            var t = e === r.Small ? r.Small : r.Responsive;
            var i =
              e === r.Small
                ? "_sap_ushell_Tile_SpacingXS"
                : "_sap_ushell_Tile_Spacing";
            var o =
              e === r.Small
                ? "_sap_ushell_Tile_WidthXS"
                : "_sap_ushell_Tile_Width";
            var s = {
              "lt-lp": this._getWorkPageColumnMinFlex(416),
              "lt-sp": this._getWorkPageColumnMinFlex(400),
              "st-lp": this._getWorkPageColumnMinFlex(352),
              "st-sp": this._getWorkPageColumnMinFlex(336),
            };
            const [a, h] = await n.getThemingParameters([
              i,
              "_sap_ushell_Tile_SpacingXS",
            ]);
            var m = {
              lt: this._formatNumericThemeParam(a),
              st: this._formatNumericThemeParam(h),
            };
            const [p, u] = await n.getThemingParameters([
              o,
              "_sap_ushell_Tile_WidthXS",
            ]);
            var g = {
              lt: this._formatNumericThemeParam(p),
              st: this._formatNumericThemeParam(u),
            };
            return [
              {
                high: Infinity,
                low: 1724,
                sizeBehavior: t,
                gap: m.lt,
                rowSize: g.lt,
                name: "lt-lp-4",
                maxColumnsPerRow: 4,
                columnMinFlex: s["lt-lp"],
              },
              {
                high: 1723,
                low: 1660,
                sizeBehavior: t,
                gap: m.lt,
                rowSize: g.lt,
                name: "lt-sp-4",
                maxColumnsPerRow: 4,
                columnMinFlex: s["lt-sp"],
              },
              {
                high: 1659,
                low: 1468,
                sizeBehavior: r.Small,
                gap: m.st,
                rowSize: g.st,
                name: "st-lp-4",
                maxColumnsPerRow: 4,
                columnMinFlex: s["st-lp"],
              },
              {
                high: 1467,
                low: 1404,
                sizeBehavior: r.Small,
                gap: m.st,
                rowSize: g.st,
                name: "st-sp-4",
                maxColumnsPerRow: 4,
                columnMinFlex: s["st-sp"],
              },
              {
                high: 1403,
                low: 1296,
                sizeBehavior: t,
                gap: m.lt,
                rowSize: g.lt,
                name: "lt-lp-3",
                maxColumnsPerRow: 3,
                columnMinFlex: s["lt-lp"],
              },
              {
                high: 1295,
                low: 1248,
                sizeBehavior: t,
                gap: m.lt,
                rowSize: g.lt,
                name: "lt-sp-3",
                maxColumnsPerRow: 3,
                columnMinFlex: s["lt-sp"],
              },
              {
                high: 1247,
                low: 1104,
                sizeBehavior: r.Small,
                gap: m.st,
                rowSize: g.st,
                name: "st-lp-3",
                maxColumnsPerRow: 3,
                columnMinFlex: s["st-lp"],
              },
              {
                high: 1103,
                low: 1056,
                sizeBehavior: r.Small,
                gap: m.st,
                rowSize: g.st,
                name: "st-sp-3",
                maxColumnsPerRow: 3,
                columnMinFlex: s["st-sp"],
              },
              {
                high: 1055,
                low: 880,
                sizeBehavior: t,
                gap: m.lt,
                rowSize: g.lt,
                name: "lt-lp-2",
                maxColumnsPerRow: 2,
                columnMinFlex: s["lt-lp"],
              },
              {
                high: 879,
                low: 848,
                sizeBehavior: t,
                gap: m.lt,
                rowSize: g.lt,
                name: "lt-sp-2",
                maxColumnsPerRow: 2,
                columnMinFlex: s["lt-sp"],
              },
              {
                high: 847,
                low: 752,
                sizeBehavior: r.Small,
                gap: m.st,
                rowSize: g.st,
                name: "st-lp-2",
                maxColumnsPerRow: 2,
                columnMinFlex: s["st-lp"],
              },
              {
                high: 751,
                low: 720,
                sizeBehavior: r.Small,
                gap: m.st,
                rowSize: g.st,
                name: "st-sp-2",
                maxColumnsPerRow: 2,
                columnMinFlex: s["st-sp"],
              },
              {
                high: 719,
                low: 456,
                sizeBehavior: t,
                gap: m.lt,
                rowSize: g.lt,
                name: "lt-lp-1",
                maxColumnsPerRow: 1,
                columnMinFlex: s["lt-lp"],
              },
              {
                high: 455,
                low: 440,
                sizeBehavior: t,
                gap: m.lt,
                rowSize: g.lt,
                name: "lt-sp-1",
                maxColumnsPerRow: 1,
                columnMinFlex: s["lt-sp"],
              },
              {
                high: 439,
                low: 392,
                sizeBehavior: r.Small,
                gap: m.st,
                rowSize: g.st,
                name: "st-lp-1",
                maxColumnsPerRow: 1,
                columnMinFlex: s["st-lp"],
              },
              {
                high: 391,
                low: 376,
                sizeBehavior: r.Small,
                gap: m.st,
                rowSize: g.st,
                name: "st-sp-1",
                maxColumnsPerRow: 1,
                columnMinFlex: s["st-sp"],
              },
              {
                high: 375,
                low: 0,
                sizeBehavior: r.Small,
                gap: m.st,
                rowSize: g.st,
                name: "st-sp-0",
                maxColumnsPerRow: 1,
                columnMinFlex: s["st-sp"],
              },
            ];
          };
          return new a();
        }
      );
    },
  "sap/ushell/components/workPageBuilder/controls/WorkPage.js": function () {
    // Copyright (c) 2009-2023 SAP SE, All Rights Reserved
    sap.ui.define(
      [
        "sap/ui/core/Control",
        "sap/ushell/components/workPageBuilder/controls/WorkPageRenderer",
        "sap/m/IllustratedMessage",
        "sap/m/IllustratedMessageType",
        "sap/m/IllustratedMessageSize",
        "sap/m/Button",
        "sap/ushell/utils",
        "sap/ushell/ui/launchpad/ExtendedChangeDetection",
      ],
      function (e, t, i, a, s, l, r, n) {
        "use strict";
        var o = e.extend(
          "sap.ushell.components.workPageBuilder.controls.WorkPage",
          {
            metadata: {
              library: "sap.ushell",
              properties: {
                editMode: {
                  type: "boolean",
                  group: "Misc",
                  defaultValue: false,
                  bindable: true,
                },
                showTitle: {
                  type: "boolean",
                  group: "Misc",
                  defaultValue: true,
                  bindable: true,
                },
                emptyIllustrationTitle: {
                  type: "string",
                  group: "Misc",
                  defaultValue: "",
                  bindable: true,
                },
                emptyIllustrationMessage: {
                  type: "string",
                  group: "Misc",
                  defaultValue: "",
                  bindable: true,
                },
                emptyIllustrationButtonText: {
                  type: "string",
                  group: "Misc",
                  defaultValue: "",
                  bindable: true,
                },
                loaded: {
                  type: "boolean",
                  defaultValue: false,
                  bindable: true,
                },
                breakpoint: {
                  type: "string",
                  defaultValue: "lt-lp-4",
                  bindable: true,
                },
              },
              defaultAggregation: "rows",
              aggregations: {
                rows: {
                  type: "sap.ushell.components.workPageBuilder.controls.WorkPageRow",
                  multiple: true,
                  singularName: "row",
                  bindable: true,
                },
                title: {
                  type: "sap.ui.core.Control",
                  multiple: false,
                  defaultValue: null,
                  bindable: true,
                },
                _emptyIllustration: {
                  type: "sap.m.IllustratedMessage",
                  multiple: false,
                  visibility: "hidden",
                },
              },
              events: { addFirstRow: {}, afterRendering: {} },
            },
            renderer: t,
          }
        );
        o.prototype.init = function () {
          this._oRowsChangeDetection = new n("rows", this);
          this.oDelegate = {
            onAfterRendering: function () {
              r.setPerformanceMark("FLP -- work page after rendering");
            },
          };
          this.addDelegate(this.oDelegate);
          e.prototype.init.apply(this, arguments);
        };
        o.prototype.onAfterRendering = function () {
          this.fireEvent("afterRendering");
        };
        o.prototype.exit = function () {
          this._oRowsChangeDetection.destroy();
          this.removeDelegate(this.oDelegate);
          e.prototype.exit.apply(this, arguments);
        };
        o.prototype.getIllustratedMessage = function () {
          if (!this.getAggregation("_emptyIllustration")) {
            this.setAggregation(
              "_emptyIllustration",
              this._createIllustratedMessage()
            );
          }
          return this.getAggregation("_emptyIllustration");
        };
        o.prototype._createIllustratedMessage = function () {
          return new i(`${this.getId()}-emptyWorkpageMessage`, {
            illustrationType: a.AddColumn,
            illustrationSize: s.Spot,
            title: this.getEmptyIllustrationTitle(),
            description: this.getEmptyIllustrationMessage(),
            additionalContent: [
              new l(`${this.getId()}-addFirstRowButton`, {
                text: this.getEmptyIllustrationButtonText(),
                press: function () {
                  this.fireEvent("addFirstRow");
                }.bind(this),
              }).addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginEnd"),
            ],
            visible: "{/editMode}",
          });
        };
        return o;
      }
    );
  },
  "sap/ushell/components/workPageBuilder/controls/WorkPageButton.js":
    function () {
      // Copyright (c) 2009-2023 SAP SE, All Rights Reserved
      sap.ui.define(
        ["sap/ui/core/Control", "sap/ui/core/Icon"],
        function (t, e) {
          "use strict";
          var n = t.extend(
            "sap.ushell.components.workPageBuilder.controls.WorkPageButton",
            {
              metadata: {
                library: "sap.ushell",
                properties: {
                  icon: {
                    type: "sap.ui.core.URI",
                    defaultValue: "",
                    bindable: true,
                  },
                  tooltip: { type: "string", defaultValue: "", bindable: true },
                },
                aggregations: {
                  _icon: {
                    type: "sap.ui.core.Icon",
                    multiple: false,
                    defaultValue: null,
                    visibility: "hidden",
                  },
                },
                events: { press: {} },
              },
              renderer: {
                apiVersion: 2,
                render: function (t, e) {
                  t.openStart("button", e);
                  t.class("workPageButton");
                  t.attr("title", e.getTooltip());
                  t.openEnd();
                  t.openStart("span");
                  t.class("workPageButtonInner");
                  t.openEnd();
                  t.renderControl(e.getIconControl());
                  t.close("span");
                  t.close("button");
                },
              },
            }
          );
          n.prototype.init = function () {
            this._fnHandleClick = this.onClick.bind(this);
            t.prototype.init.apply(this, arguments);
          };
          n.prototype.onClick = function (t) {
            t.preventDefault();
            t.stopPropagation();
            this.fireEvent("press");
          };
          n.prototype.onBeforeRendering = function () {
            if (this.getDomRef()) {
              this.getDomRef().removeEventListener(
                "click",
                this._fnHandleClick
              );
            }
          };
          n.prototype.onAfterRendering = function () {
            this.getDomRef().addEventListener("click", this._fnHandleClick);
          };
          n.prototype.getIconControl = function () {
            if (!this.getAggregation("_icon")) {
              this.setAggregation(
                "_icon",
                new e(`${this.getId()}-icon`, {
                  src: this.getIcon(),
                  tooltip: this.getTooltip(),
                }).addStyleClass("workPageButtonIcon")
              );
            }
            return this.getAggregation("_icon");
          };
          return n;
        }
      );
    },
  "sap/ushell/components/workPageBuilder/controls/WorkPageCell.js":
    function () {
      // Copyright (c) 2009-2023 SAP SE, All Rights Reserved
      sap.ui.define(
        [
          "sap/f/GridContainer",
          "sap/f/GridContainerSettings",
          "sap/f/dnd/GridDropInfo",
          "sap/m/IllustratedMessage",
          "sap/m/IllustratedMessageSize",
          "sap/m/IllustratedMessageType",
          "sap/ui/core/Control",
          "sap/ui/core/dnd/DragInfo",
          "sap/ui/core/library",
          "sap/ui/core/ResizeHandler",
          "sap/ushell/ui/launchpad/ExtendedChangeDetection",
        ],
        function (e, t, i, r, a, o, n, s, l, g, d) {
          "use strict";
          var p = l.dnd.DropLayout;
          var u = l.dnd.DropPosition;
          var h = n.extend(
            "sap.ushell.components.workPageBuilder.controls.WorkPageCell",
            {
              metadata: {
                library: "sap.ushell",
                properties: {
                  deleteWidgetTooltip: {
                    type: "string",
                    defaultValue: "",
                    bindable: true,
                  },
                  addApplicationButtonText: {
                    type: "string",
                    defaultValue: "",
                    bindable: true,
                  },
                  editMode: {
                    type: "boolean",
                    defaultValue: false,
                    bindable: true,
                  },
                  tileMode: {
                    type: "boolean",
                    defaultValue: false,
                    bindable: true,
                  },
                  gridContainerGap: {
                    type: "string",
                    group: "Appearance",
                    defaultValue: "0.5rem",
                    bindable: true,
                  },
                  gridContainerRowSize: {
                    type: "string",
                    group: "Appearance",
                    defaultValue: "5.25rem",
                    bindable: true,
                  },
                  emptyIllustrationTitle: {
                    type: "string",
                    group: "Misc",
                    defaultValue: "",
                    bindable: true,
                  },
                  emptyIllustrationMessage: {
                    type: "string",
                    group: "Misc",
                    defaultValue: "",
                    bindable: true,
                  },
                },
                defaultAggregation: "widgets",
                aggregations: {
                  widgets: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    singularName: "widget",
                    bindable: true,
                    dnd: true,
                    forwarding: {
                      getter: "getGridContainer",
                      aggregation: "items",
                    },
                  },
                  _gridContainer: {
                    type: "sap.f.GridContainer",
                    multiple: false,
                    visibility: "hidden",
                  },
                  headerBar: { type: "sap.m.OverflowToolbar", multiple: false },
                  _emptyIllustration: {
                    type: "sap.m.IllustratedMessage",
                    multiple: false,
                    visibility: "hidden",
                  },
                },
                events: {
                  moveVisualization: {},
                  gridColumnsChange: {},
                  gridContainerBorderReached: {},
                },
              },
              renderer: {
                apiVersion: 2,
                render: function (e, t) {
                  e.openStart("div", t);
                  e.class("workPageCell");
                  if (t.getTileMode()) {
                    e.class("workPageCellTileMode");
                  } else {
                    e.class("workPageCellCardMode");
                  }
                  e.openEnd();
                  e.openStart("div");
                  e.class("workpageCellWidgetToolbar");
                  e.openEnd();
                  e.renderControl(t.getHeaderBar());
                  e.close("div");
                  var i = t.getAggregation("widgets");
                  if (i.length <= 0) {
                    e.renderControl(t.getIllustratedMessage());
                  } else {
                    e.renderControl(t.getGridContainer());
                  }
                  e.close("div");
                },
              },
            }
          );
          h.prototype.init = function () {
            this._aRegistrationIds = [];
            this._oWidgetsChangeDetection = new d("widgets", this);
            this._oWidgetsChangeDetection.attachItemAdded(
              this.invalidate,
              this
            );
            n.prototype.init.apply(this, arguments);
          };
          h.prototype.exit = function () {
            this._deregisterResizeHandles();
            this._oWidgetsChangeDetection.destroy();
            n.prototype.exit.apply(this, arguments);
          };
          h.prototype._deregisterResizeHandles = function () {
            if (this._aRegistrationIds.length > 0) {
              this._aRegistrationIds.forEach(function (e) {
                g.deregister(e);
              });
              this._aRegistrationIds = [];
            }
          };
          h.prototype.insertAggregation = function (e, t, i, r) {
            if (e === "widgets" && t.isA("sap.ui.integration.widgets.Card")) {
              this._aRegistrationIds.push(
                g.register(this, this._resizeCard.bind(this, t))
              );
            }
            n.prototype.insertAggregation.apply(this, arguments);
          };
          h.prototype._resizeCard = function (e, t) {
            var i =
              this.getAggregation("_gridContainer") &&
              this.getAggregation("_gridContainer").getDomRef();
            if (!i) {
              return;
            }
            var r = parseFloat(window.getComputedStyle(i).width);
            if (r) {
              e.setWidth(r + "px");
            }
          };
          h.prototype.getGridContainer = function () {
            var e = this.getAggregation("_gridContainer");
            if (!e) {
              e = this._createGridContainer().attachColumnsChange(
                function (e) {
                  this.fireEvent("gridColumnsChange", e.getParameters());
                }.bind(this)
              );
              this.setAggregation(
                "_gridContainer",
                e.addStyleClass("workPageGridContainer")
              );
            }
            if (
              !this.getEditMode() ||
              !this.getTileMode() ||
              e.getItems().length === 0
            ) {
              e.removeAllDragDropConfig();
            } else if (e.getDragDropConfig().length === 0) {
              e.addDragDropConfig(
                new s({
                  groupName: "CellGridContainer",
                  sourceAggregation: "items",
                })
              ).addDragDropConfig(
                new i({
                  groupName: "CellGridContainer",
                  targetAggregation: "items",
                  dropIndicatorSize: function (e) {
                    var t = 2;
                    if (e.getLayoutData() && e.getLayoutData().getColumns()) {
                      t = e.getLayoutData().getColumns();
                    }
                    return { rows: 1, columns: t };
                  },
                  dropPosition: u.Between,
                  dropLayout: p.Horizontal,
                  drop: this.onDrop.bind(this),
                })
              );
            }
            return e
              .setInlineBlockLayout(true)
              .setSnapToRow(false)
              .setLayout(
                new t({
                  columnSize: this.getGridContainerRowSize(),
                  gap: this.getGridContainerGap(),
                })
              );
          };
          h.prototype._createGridContainer = function () {
            return new e(`${this.getId()}--workPageCellGridContainer`, {
              containerQuery: false,
              minHeight: "0",
              borderReached: this.onBorderReached.bind(this),
            });
          };
          h.prototype.onBorderReached = function (e) {
            this.fireEvent("gridContainerBorderReached", e.getParameters());
          };
          h.prototype.onDrop = function (e) {
            this.fireEvent("moveVisualization", e.getParameters());
          };
          h.prototype.getIllustratedMessage = function () {
            if (!this.getAggregation("_emptyIllustration")) {
              this.setAggregation(
                "_emptyIllustration",
                this._createIllustratedMessage()
              );
            }
            return this.getAggregation("_emptyIllustration");
          };
          h.prototype._createIllustratedMessage = function () {
            return new r(`${this.getId()}-emptyCellMessage`, {
              illustrationType: o.NoColumnsSet,
              illustrationSize: a.Spot,
              title: this.getEmptyIllustrationTitle(),
              description: this.getEmptyIllustrationMessage(),
              visible: "{/editMode}",
            });
          };
          h.prototype.onfocusin = function () {
            if (!this.hasStyleClass("workPageCellFocused")) {
              this.addStyleClass("workPageCellFocused");
            }
          };
          h.prototype.onfocusout = function () {
            if (this.hasStyleClass("workPageCellFocused")) {
              this.removeStyleClass("workPageCellFocused");
            }
          };
          return h;
        }
      );
    },
  "sap/ushell/components/workPageBuilder/controls/WorkPageColumn.js":
    function () {
      // Copyright (c) 2009-2023 SAP SE, All Rights Reserved
      sap.ui.define(
        [
          "sap/m/Button",
          "sap/m/library",
          "sap/ui/core/Control",
          "sap/ushell/components/workPageBuilder/controls/WorkPageButton",
          "sap/ushell/components/workPageBuilder/controls/WorkPageColumnRenderer",
          "sap/ushell/components/workPageBuilder/controls/WorkPageColumnResizer",
          "sap/ushell/ui/launchpad/ExtendedChangeDetection",
        ],
        function (e, t, o, n, i, l, r) {
          "use strict";
          var s = t.ButtonType;
          var d = o.extend(
            "sap.ushell.components.workPageBuilder.controls.WorkPageColumn",
            {
              metadata: {
                library: "sap.ushell",
                properties: {
                  columnWidth: {
                    type: "int",
                    defaultValue: 24,
                    bindable: true,
                  },
                  editMode: {
                    type: "boolean",
                    group: "Misc",
                    defaultValue: false,
                    bindable: true,
                  },
                  ariaLabelPlaceholder: {
                    type: "string",
                    group: "Misc",
                    defaultValue: "",
                    bindable: true,
                  },
                  deleteColumnButtonTooltip: {
                    type: "string",
                    group: "Misc",
                    defaultValue: "",
                    bindable: true,
                  },
                  addColumnButtonTooltip: {
                    type: "string",
                    group: "Misc",
                    defaultValue: "",
                    bindable: true,
                  },
                  addWidgetButtonText: {
                    type: "string",
                    group: "Misc",
                    defaultValue: "",
                    bindable: true,
                  },
                },
                dnd: { draggable: false, droppable: true },
                defaultAggregation: "cells",
                aggregations: {
                  cells: {
                    type: "sap.ushell.components.workPageBuilder.controls.WorkPageCell",
                    multiple: true,
                    singularName: "cell",
                    bindable: true,
                    dnd: true,
                  },
                  _deleteButton: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden",
                  },
                  _addWidgetButton: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden",
                  },
                  _addButtonLeft: {
                    type: "sap.ushell.components.workPageBuilder.controls.WorkPageButton",
                    multiple: false,
                    visibility: "hidden",
                  },
                  _addButtonRight: {
                    type: "sap.ushell.components.workPageBuilder.controls.WorkPageButton",
                    multiple: false,
                    visibility: "hidden",
                  },
                  _resizer: {
                    type: "sap.ushell.components.workPageBuilder.controls.WorkPageColumnResizer",
                    multiple: false,
                    visibility: "hidden",
                  },
                },
                events: {
                  addColumn: { left: { type: "boolean" } },
                  addWidget: {},
                  removeColumn: {},
                  columnResized: {
                    parameters: { posXDiff: { type: "float" } },
                  },
                  columnResizeCompleted: {},
                },
              },
              renderer: i,
            }
          );
          d.prototype.init = function () {
            this._fnHandleResize = this._handleResizerMoved.bind(this);
            this._fnHandleResizeCompleted =
              this._handleResizerReleased.bind(this);
            this._oResizer = new l()
              .setParent(this)
              .attachEvent("resizerMoved", this._fnHandleResize)
              .attachEvent("resizerReleased", this._fnHandleResizeCompleted);
            this._oCellsChangeDetection = new r("cells", this);
            o.prototype.init.apply(this, arguments);
          };
          d.prototype.exit = function () {
            this._oResizer
              .detachEvent("resizerMoved", this._fnHandleResize)
              .detachEvent("resizerReleased", this._fnHandleResizeCompleted);
            this._oCellsChangeDetection.destroy();
            o.prototype.exit.apply(this, arguments);
          };
          d.prototype._createDeleteButton = function () {
            return new e(`${this.getId()}-deleteColumnButton`, {
              icon: "sap-icon://delete",
              tooltip: this.getDeleteColumnButtonTooltip(),
              press: function () {
                this.fireEvent("removeColumn");
              }.bind(this),
            }).addStyleClass("workPageColumnDeleteButton");
          };
          d.prototype.getDeleteButton = function () {
            if (!this.getAggregation("_deleteButton")) {
              this.setAggregation("_deleteButton", this._createDeleteButton());
            }
            return this.getAggregation("_deleteButton");
          };
          d.prototype._createAddButton = function (e) {
            var t =
              e === "left"
                ? "workPageColumnButtonLeft"
                : "workPageColumnButtonRight";
            return new n(`${this.getId()}-addColumnButton-${e}`, {
              icon: "sap-icon://add",
              tooltip: this.getAddColumnButtonTooltip(),
              press: function () {
                this.fireEvent("addColumn", { left: e === "left" });
              }.bind(this),
            }).addStyleClass("workPageDividerButton " + t);
          };
          d.prototype.getAddButton = function (e) {
            if (e === "left") {
              if (!this.getAggregation("_addButtonLeft")) {
                this.setAggregation(
                  "_addButtonLeft",
                  this._createAddButton("left")
                );
              }
              return this.getAggregation("_addButtonLeft");
            }
            if (!this.getAggregation("_addButtonRight")) {
              this.setAggregation(
                "_addButtonRight",
                this._createAddButton("right")
              );
            }
            return this.getAggregation("_addButtonRight");
          };
          d.prototype.getResizer = function () {
            return this._oResizer;
          };
          d.prototype._handleResizerMoved = function (e) {
            var t = e.getParameters();
            this.fireEvent("columnResized", t);
          };
          d.prototype._handleResizerReleased = function () {
            this.fireEvent("columnResizeCompleted");
          };
          d.prototype._createAddWidgetButton = function () {
            return new e(`${this.getId()}-addWidgetButton`, {
              text: this.getAddWidgetButtonText(),
              type: s.Emphasized,
              press: function () {
                this.fireEvent("addWidget");
              }.bind(this),
            }).addStyleClass("workPageAddWidgetButton");
          };
          d.prototype.getAddWidgetButton = function () {
            if (!this.getAggregation("_addWidgetButton")) {
              this.setAggregation(
                "_addWidgetButton",
                this._createAddWidgetButton()
              );
            }
            return this.getAggregation("_addWidgetButton");
          };
          d.prototype.getCappedColumnCount = function () {
            var e = this.getParent();
            return e.getCappedColumnCount();
          };
          d.prototype.getIndex = function () {
            return this.getParent().indexOfAggregation("columns", this);
          };
          d.prototype.getMaxColumns = function () {
            return this.getParent().getMaxColumns();
          };
          return d;
        }
      );
    },
  "sap/ushell/components/workPageBuilder/controls/WorkPageColumnRenderer.js":
    function () {
      // Copyright (c) 2009-2023 SAP SE, All Rights Reserved
      sap.ui.define(
        ["sap/base/strings/formatMessage"],
        function (e) {
          "use strict";
          var t = {
            apiVersion: 2,
            render: function (t, r) {
              if (!r.getVisible()) {
                return;
              }
              var o = r.getIndex();
              var a = r.getMaxColumns();
              var n = r.getCappedColumnCount();
              var l = r.getCells();
              var i = l.length === 0;
              t.openStart("div", r);
              if (r.getAriaLabelPlaceholder()) {
                t.attr(
                  "aria-label",
                  e(r.getAriaLabelPlaceholder(), [o + 1, n])
                );
              }
              if (o === 0) {
                t.class("workPageColumnFirst");
              }
              if (o === n - 1) {
                t.class("workPageColumnLast");
              }
              if (i) {
                t.class("workPageColumnEmpty");
              }
              t.class("workPageColumn");
              t.attr("data-index", o + 1);
              t.attr("data-count", n);
              t.openEnd();
              if (i) {
                t.openStart("div");
                t.class("workPageCell");
                t.class("workPageCellEmpty");
                t.openEnd();
              } else {
                for (var s = 0; s < l.length; s++) {
                  t.renderControl(l[s]);
                }
              }
              if (r.getEditMode()) {
                if (n > 1 && i) {
                  t.renderControl(r.getDeleteButton());
                }
                if (o !== 0) {
                  t.renderControl(r.getResizer());
                }
                if (n < a) {
                  t.renderControl(r.getAddButton("left"));
                }
                if (o === n - 1 && n < a) {
                  t.renderControl(r.getAddButton("right"));
                }
                t.openStart("div");
                t.class("workPageColumnToolbar");
                t.openEnd();
                t.renderControl(r.getAddWidgetButton());
                t.close("div");
              }
              if (i) {
                t.close("div");
              }
              t.close("div");
            },
          };
          return t;
        },
        true
      );
    },
  "sap/ushell/components/workPageBuilder/controls/WorkPageColumnResizer.js":
    function () {
      // Copyright (c) 2009-2023 SAP SE, All Rights Reserved
      sap.ui.define(["sap/ui/core/Control"], function (e) {
        "use strict";
        var o = e.extend(
          "sap.ushell.components.workPageBuilder.controls.WorkPageColumnResizer",
          {
            metadata: {
              library: "sap.ushell",
              events: {
                resizerMoved: { parameters: { posXDiff: { type: "float" } } },
                resizerReleased: {},
              },
            },
            renderer: {
              apiVersion: 2,
              render: function (e, o) {
                e.openStart("div", o);
                e.class("workPageDivider");
                e.attr("tabindex", "0");
                e.openEnd();
                e.openStart("div");
                e.class("workPageDividerInner");
                e.openEnd();
                e.close("div");
                e.close("div");
              },
            },
          }
        );
        o.prototype.init = function () {
          this._fnMouseMove = this.mouseMove.bind(this);
          this._fnMouseUp = this.mouseUp.bind(this);
        };
        o.prototype.exit = function () {
          window.document.removeEventListener("mousemove", this._fnMouseMove);
          window.document.removeEventListener("mouseup", this._fnMouseUp);
        };
        o.prototype.mouseUp = function () {
          window.document.removeEventListener("mouseup", this._fnMouseUp);
          window.document.removeEventListener("mousemove", this._fnMouseMove);
          this.fireEvent("resizerReleased");
        };
        o.prototype.mouseMove = function (e) {
          this.fireEvent("resizerMoved", {
            posXDiff: e.pageX - this.getXOrigin(),
          });
        };
        o.prototype.onmousedown = function () {
          window.document.addEventListener("mousemove", this._fnMouseMove);
          window.document.addEventListener("mouseup", this._fnMouseUp);
        };
        o.prototype.onkeydown = function (e) {
          if ([37, 39].indexOf(e.keyCode) === -1) {
            return;
          }
          var o = this.getParent().getParent();
          var t = o.getSingleColumnWidth();
          if (e.keyCode === 37) {
            t = -t;
          }
          this.fireEvent("resizerMoved", { posXDiff: t });
          this.fireEvent("resizerReleased");
        };
        o.prototype.getXOrigin = function () {
          var e = this.$().get(0).getBoundingClientRect();
          return e.x + e.width / 2;
        };
        return o;
      });
    },
  "sap/ushell/components/workPageBuilder/controls/WorkPageRenderer.js":
    function () {
      // Copyright (c) 2009-2023 SAP SE, All Rights Reserved
      sap.ui.define([], function () {
        "use strict";
        var e = { apiVersion: 2 };
        e.render = function (e, t) {
          e.openStart("div", t);
          if (t.getTitle() && t.getTitle().getText()) {
            e.attr("aria-label", t.getTitle().getText());
          }
          e.class("workPage");
          e.class("sapContrastPlus");
          e.attr("data-wp-breakpoint", t.getBreakpoint());
          if (t.getEditMode()) {
            e.class("workPageEditMode");
          }
          if (
            t.getShowTitle() &&
            t.getTitle() !== null &&
            t.getTitle().getText() !== ""
          ) {
            e.class("workPageHasTitle");
          }
          e.openEnd();
          if (t.getShowTitle()) {
            e.openStart("div");
            e.class("workPageTitle");
            e.openEnd();
            e.renderControl(t.getTitle());
            e.close("div");
          }
          var r = t.getRows();
          if (r.length <= 0 && t.getLoaded()) {
            e.renderControl(t.getIllustratedMessage());
          } else {
            e.openStart("div", t.getId() + "-rows");
            e.openEnd();
            for (var i = 0; i < r.length; i++) {
              e.renderControl(r[i]);
            }
            e.close("div");
          }
          e.close("div");
        };
        return e;
      });
    },
  "sap/ushell/components/workPageBuilder/controls/WorkPageRow.js": function () {
    // Copyright (c) 2009-2023 SAP SE, All Rights Reserved
    sap.ui.define(
      [
        "sap/ui/core/Control",
        "sap/ushell/components/workPageBuilder/controls/WorkPageButton",
        "sap/ushell/ui/launchpad/ExtendedChangeDetection",
        "sap/ushell/components/workPageBuilder/controls/WorkPageRowRenderer",
      ],
      function (t, e, o, n) {
        "use strict";
        var i = t.extend(
          "sap.ushell.components.workPageBuilder.controls.WorkPageRow",
          {
            metadata: {
              library: "sap.ushell",
              properties: {
                editMode: {
                  type: "boolean",
                  group: "Misc",
                  defaultValue: false,
                  bindable: true,
                },
                addRowButtonTooltip: {
                  type: "string",
                  group: "Misc",
                  defaultValue: "",
                  bindable: true,
                },
                maxColumns: {
                  type: "int",
                  group: "Misc",
                  defaultValue: 4,
                  bindable: true,
                },
                columnMinFlex: {
                  type: "int",
                  group: "Misc",
                  defaultValue: 4,
                  bindable: true,
                },
                ariaLabel: {
                  type: "string",
                  group: "Misc",
                  defaultValue: "",
                  bindable: true,
                },
              },
              defaultAggregation: "columns",
              aggregations: {
                columns: {
                  type: "sap.ushell.components.workPageBuilder.controls.WorkPageColumn",
                  multiple: true,
                  singularName: "column",
                },
                headerBar: { type: "sap.m.IBar", multiple: false },
                controlButtons: {
                  type: "sap.m.Button",
                  multiple: true,
                  singularName: "controlButton",
                },
                title: { type: "sap.m.Title", multiple: false },
                messageStrip: { type: "sap.m.MessageStrip", multiple: false },
                _addButtonBottom: {
                  type: "sap.ushell.components.workPageBuilder.controls.WorkPageButton",
                  multiple: false,
                  visibility: "hidden",
                },
                _addButtonTop: {
                  type: "sap.ushell.components.workPageBuilder.controls.WorkPageButton",
                  multiple: false,
                  visibility: "hidden",
                },
              },
              events: {
                addRow: { parameters: { bottom: { type: "boolean" } } },
              },
            },
            renderer: n,
          }
        );
        i.prototype.init = function () {
          this._oColumnsChangeDetection = new o("columns", this);
          t.prototype.init.apply(this, arguments);
        };
        i.prototype.exit = function () {
          this._oColumnsChangeDetection.destroy();
          t.prototype.exit.apply(this, arguments);
        };
        i.prototype.getSingleColumnWidth = function () {
          const t = this.getDomRef();
          if (!t) {
            return 1;
          }
          const e = t.querySelector(".workPageRowInner");
          if (!e) {
            return 1;
          }
          return e.offsetWidth / 24;
        };
        i.prototype.onfocusin = function () {
          if (!this.hasStyleClass("workPageRowFocused")) {
            this.addStyleClass("workPageRowFocused");
          }
        };
        i.prototype.onfocusout = function () {
          if (this.hasStyleClass("workPageRowFocused")) {
            this.removeStyleClass("workPageRowFocused");
          }
        };
        i.prototype._createAddButton = function (t) {
          var o =
            t === "bottom" ? "workPageRowButtonBottom" : "workPageRowButtonTop";
          return new e(`${this.getId()}-addRowButton-${t}`, {
            icon: "sap-icon://add",
            tooltip: this.getAddRowButtonTooltip(),
            press: function () {
              this.fireEvent("addRow", { bottom: t === "bottom" });
            }.bind(this),
          }).addStyleClass("workPageRowButton " + o);
        };
        i.prototype.getAddButton = function (t) {
          if (t === "bottom") {
            if (!this.getAggregation("_addButtonBottom")) {
              this.setAggregation("_addButtonBottom", this._createAddButton(t));
            }
            return this.getAggregation("_addButtonBottom");
          } else if (!this.getAggregation("_addButtonTop")) {
            this.setAggregation("_addButtonTop", this._createAddButton(t));
          }
          return this.getAggregation("_addButtonTop");
        };
        i.prototype.getIndex = function () {
          return this.getParent().indexOfAggregation("rows", this);
        };
        i.prototype.getColumnFlexValues = function () {
          return this.getColumns().map((t) => t.getColumnWidth());
        };
        i.prototype.getGridLayoutString = function () {
          const t = this.getColumnFlexValues();
          return `${t.join("-")}`;
        };
        i.prototype.setGridLayoutString = function (t) {
          const e = this.getDomRef();
          if (!e) {
            return;
          }
          const o = e.querySelector(".workPageRowInner");
          if (!o) {
            return;
          }
          o.dataset.wpGridLayout = `${t.join("-")}`;
        };
        i.prototype.getCappedColumnCount = function () {
          var t = this.getColumns().length;
          var e = this.getMaxColumns();
          if (this.getEditMode()) {
            return t;
          }
          return t > e ? e : t;
        };
        return i;
      }
    );
  },
  "sap/ushell/components/workPageBuilder/controls/WorkPageRowRenderer.js":
    function () {
      // Copyright (c) 2009-2023 SAP SE, All Rights Reserved
      sap.ui.define(function () {
        "use strict";
        var e = {
          apiVersion: 2,
          render: function (e, t) {
            if (!t.getVisible()) {
              return;
            }
            var r = t.getIndex();
            var o = t.getColumns();
            var n = t.getCappedColumnCount();
            e.openStart("div", t);
            e.attr("role", "region");
            var a = t.getTitle();
            e.attr("aria-label", t.getAriaLabel());
            e.class("workPageRow");
            if (r === 0) {
              e.class("workPageRowFirst");
            }
            e.openEnd();
            e.openStart("div");
            e.class("workPageRowLimiter");
            e.openEnd();
            if (t.getEditMode()) {
              var i = t.getControlButtons();
              if (i.length > 0) {
                e.openStart("div");
                e.class("workPageRowControlButtons");
                e.openEnd();
                for (var d = 0; d < i.length; d++) {
                  e.renderControl(i[d]);
                }
                e.close("div");
              }
            }
            if (t.getEditMode()) {
              e.renderControl(t.getHeaderBar());
            } else {
              e.renderControl(a);
            }
            if (t.getMessageStrip()) {
              e.renderControl(t.getMessageStrip());
            }
            e.openStart("div");
            e.class("workPageRowInner");
            e.attr("data-wp-grid-layout", t.getGridLayoutString());
            e.attr("data-wp-col-min-flex", t.getColumnMinFlex());
            e.attr("data-wp-cols", n);
            e.openEnd();
            for (var l = 0; l < n; l++) {
              e.renderControl(o[l]);
            }
            if (t.getEditMode()) {
              e.renderControl(t.getAddButton("top"));
              e.renderControl(t.getAddButton("bottom"));
            }
            e.close("div");
            e.close("div");
            e.close("div");
          },
        };
        return e;
      }, true);
    },
  "sap/ushell/components/workPageBuilder/manifest.json":
    '{"_version":"1.39.0","sap.app":{"id":"sap.ushell.components.workPageBuilder","applicationVersion":{"version":"1.123.1"},"i18n":"../../utils/workpage/resources/resources.properties","ach":"CA-FLP-FE-UI","type":"component","title":""},"sap.ui":{"fullWidth":false,"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"resources/resources.properties"}},"componentName":"sap.ushell.components.workPageBuilder","componentUsages":{"ContentFinderAppSearch":{"settings":{"id":"contentFinderAppSearch"},"name":"sap.ushell.components.contentFinderAppSearch","lazy":true},"ContentFinder":{"settings":{"id":"contentFinder"},"name":"sap.ushell.components.contentFinder","lazy":true}},"rootView":{"viewName":"sap.ushell.components.workPageBuilder.view.WorkPageBuilder","type":"XML","id":"workPageBuilder","async":true},"dependencies":{"minUI5Version":"1.99","libs":{"sap.ui.core":{},"sap.m":{},"sap.f":{}}},"contentDensities":{"compact":true,"cozy":true}}}',
  "sap/ushell/components/workPageBuilder/resources/resources.properties":
    '# Translatable texts for the Fiori Launchpad\n# __ldi.translation.uuid=bc59a778-900a-11ec-b909-0242ac120002\n\n\n#XTIT\nWorkPage.EmptyPage.Title=Empty Page\n#XMSG\nWorkPage.EmptyPage.Message=This page does not contain any sections yet.\n#XBUT\nWorkPage.EmptyPage.Button.Add=Add Section\n\n#XBUT\nWorkPage.EditMode.Save=Save\n#XBUT\nWorkPage.EditMode.Cancel=Cancel\n#XMSG\nWorkPage.Message.WidgetMoved=Widget moved\n\n#WorkPage Row Overflow toolbar\n#XFLD\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Section Title\n#XTXT\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Enter an optional section title\n#XBUT\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Remove Section\n#XTOL\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Delete section\n#XTIT\nWorkPage.Row.DeleteDialog.Title=Delete\n#XMSG\nWorkPage.Row.DeleteDialog.ConfirmText=Do you want to delete this section and all its content?\n#XBUT\nWorkPage.Row.DeleteDialog.Button.Confirm=Delete\n#XBUT\nWorkPage.Row.DeleteDialog.Button.Cancel=Cancel\n#XTOL\nWorkPage.Row.AddRowButtonTooltip=Add section\n#XMSG\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=In runtime, only the first four columns will be visible. Please reduce the number of columns to four.\n#XACT\nWorkPage.Row.AriaLabel=WorkPage Sections\n#XMSG: If the Section Title is empty this text should be read instead of the section title. "{0}" is the position of the section on the page.\nWorkPage.Row.Unnamed.AriaLabel=Unnamed section at position {0}\n#XMSG: "{0}" is the Section Title, this is read when a user navigates to the section and should describe the UI type as well as the title.\nWorkPage.Row.Named.AriaLabel={0} Section\n#WorkPage Column\n#XACT: Accessibility label for the column info\nWorkPage.Column.AriaLabel=Column {0} of {1}\n#XBUT\nWorkPage.Column.AddWidgetButtonText=Add Widget\n#XTOL\nWorkPage.Column.DeleteColumnButtonTooltip=Remove column\n#XTOL\nWorkPage.Column.AddColumnButtonTooltip=Add column\n#XTIT\nWorkPage.Column.EmptyIllustrationTitle=Search for Apps\n#XMSG\nWorkPage.Column.EmptyIllustrationDescription=Add apps to the widget, or remove the widget if you don\'t need it.\n\n#WorkPage Cell\n#XTOL\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Add app\n#XTOL\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Delete widget\n#XTIT\nWorkPage.Cell.EmptyIllustrationTitle=Search for Apps\n#XMSG\nWorkPage.Cell.EmptyIllustrationDescription=Add apps to the widget, or remove the widget if you don\'t need it.\n#XTIT\nWorkPage.Cell.DeleteDialog.Title=Delete\n#XMSG\nWorkPage.Cell.DeleteDialog.ConfirmText=Are you sure you want to delete this widget? All apps inside will also be removed from the page.\n#XBUT\nWorkPage.Cell.DeleteDialog.Button.Confirm=Delete\n#XBUT\nWorkPage.Cell.DeleteDialog.Button.Cancel=Cancel\n\n#WorkPage WidgetContainer\n#XTOL\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Open widget settings\n#XTOL\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Delete widget\n\n#WorkPage Section\n#XBUT\nWorkPage.Section.AddVizInstanceButtonText=Add Tiles\n\n#ContentFinder Add Widgets Dialog\n\n#XTIT\nContentFinder.Categories.Applications.Title=Applications\n#XBUT\nContentFinder.Widgets.Tiles.Title=Tiles\n#XTXT\nContentFinder.Widgets.Tiles.Description=Visual representations of apps.\n#XBUT\nContentFinder.Widgets.Cards.Title=Cards\n#XTXT\nContentFinder.Widgets.Cards.Description=Visual representations of apps, displayed in flexible layouts.\n\n#CardEditor\n#XBUT\nWorkPage.CardEditor.Save=Save\n#XBUT\nWorkPage.CardEditor.Cancel=Cancel\n#XTIT The placeholder is the card title\nWorkPage.CardEditor.Title=Configure "{0}"\n#XTIT If no card title is available, use this one here\nWorkPage.CardEditor.Title.NoCardTitle=Configure\n#XBUT\nWorkPage.Card.ActionDefinition.Configure=Configure\n#XBUT\nWorkPage.Card.ActionDefinition.Reset=Delete Configuration\n\n#CardEditor Context Configuration\n#XFLD\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\n#XFLD\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Current User\n#XFLD\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=Id of the SAP Build Work Zone user\n#XFLD\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone user id\n#YTXT\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=Id of the current user. The value will change based on the logged on user. To show the users name, use Name of the SAP Build Work Zone user.\n#XFLD\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Name of the SAP Build Work Zone user\n#XFLD\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone user name\n#YTXT\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Name of the current user with first, middle and last name. The middle name will be abbreviated. The value will change based on the logged on user.\n#XFLD\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Firstname of the SAP Build Work Zone user\n#XFLD\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone user firstname\n#YTXT\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Firstname of the current user. The value will change based on the logged on user.\n#XFLD\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Lastname of the SAP Build Work Zone user\n#XFLD\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone user lastname\n#YTXT\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Lastname of the current user. The value will change based on the logged on user.\n#XFLD\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Email address of current SAP Build Work Zone user\n#XFLD\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone user email\n#YTXT\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Email address of current SAP Build Work Zone user. The value will change based on the logged on user.\n#XTIT The title of the delete configuration dialog\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Delete Configuration\n#YTXT The content text of the delete configuration dialog\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=This card has individual configurations. Do you want to delete them irrevocably and reset the card to its default settings?\n#XBTN The accept button of the delete configuration dialog\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Delete\n#XBTN The deny button of the delete configuration dialog\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Cancel\n',
  "sap/ushell/components/workPageBuilder/resources/resources_ar.properties":
    '\n\nWorkPage.EmptyPage.Title=\\u0627\\u0644\\u0635\\u0641\\u062D\\u0629 \\u0627\\u0644\\u0641\\u0627\\u0631\\u063A\\u0629\nWorkPage.EmptyPage.Message=\\u0647\\u0630\\u0647 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629 \\u0644\\u0627 \\u062A\\u062D\\u062A\\u0648\\u064A \\u0639\\u0644\\u0649 \\u0623\\u064A \\u0623\\u0642\\u0633\\u0627\\u0645 \\u062D\\u062A\\u0649 \\u0627\\u0644\\u0622\\u0646.\nWorkPage.EmptyPage.Button.Add=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0642\\u0633\\u0645\n\nWorkPage.EditMode.Save=\\u062D\\u0641\\u0638\nWorkPage.EditMode.Cancel=\\u0625\\u0644\\u063A\\u0627\\u0621\nWorkPage.Message.WidgetMoved=\\u062A\\u0645 \\u0646\\u0642\\u0644 \\u0623\\u062F\\u0627\\u0629 \\u0645\\u0635\\u0648\\u0631\\u0629\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0627\\u0644\\u0642\\u0633\\u0645\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u0625\\u062F\\u062E\\u0627\\u0644 \\u0639\\u0646\\u0648\\u0627\\u0646 \\u0642\\u0633\\u0645 \\u0627\\u062E\\u062A\\u064A\\u0627\\u0631\\u064A\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\u0625\\u0632\\u0627\\u0644\\u0629 \\u0642\\u0633\\u0645\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u062D\\u0630\\u0641 \\u0642\\u0633\\u0645\nWorkPage.Row.DeleteDialog.Title=\\u062D\\u0630\\u0641\nWorkPage.Row.DeleteDialog.ConfirmText=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u062D\\u0630\\u0641 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0642\\u0633\\u0645 \\u0648\\u062C\\u0645\\u064A\\u0639 \\u0645\\u062D\\u062A\\u0648\\u064A\\u0627\\u062A\\u0647\\u061F\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u062D\\u0630\\u0641\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u0625\\u0644\\u063A\\u0627\\u0621\nWorkPage.Row.AddRowButtonTooltip=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0642\\u0633\\u0645\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u0641\\u064A \\u0648\\u0642\\u062A \\u0627\\u0644\\u062A\\u0634\\u063A\\u064A\\u0644\\u060C \\u0633\\u062A\\u0643\\u0648\\u0646 \\u0627\\u0644\\u0623\\u0639\\u0645\\u062F\\u0629 \\u0627\\u0644\\u0623\\u0631\\u0628\\u0639\\u0629 \\u0627\\u0644\\u0623\\u0648\\u0644\\u0649 \\u0641\\u0642\\u0637 \\u0645\\u0631\\u0626\\u064A\\u0629. \\u064A\\u064F\\u0631\\u062C\\u0649 \\u062A\\u0642\\u0644\\u064A\\u0644 \\u0639\\u062F\\u062F \\u0627\\u0644\\u0623\\u0639\\u0645\\u062F\\u0629 \\u0625\\u0644\\u0649 \\u0623\\u0631\\u0628\\u0639\\u0629.\nWorkPage.Row.AriaLabel=\\u0623\\u0642\\u0633\\u0627\\u0645 \\u0635\\u0641\\u062D\\u0627\\u062A \\u0627\\u0644\\u0639\\u0645\\u0644\n\nWorkPage.Column.AriaLabel=\\u0639\\u0645\\u0648\\u062F {0} \\u0645\\u0646 {1}\nWorkPage.Column.AddWidgetButtonText=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0623\\u062F\\u0627\\u0629 \\u0645\\u0635\\u0648\\u0631\\u0629\nWorkPage.Column.DeleteColumnButtonTooltip=\\u0625\\u0632\\u0627\\u0644\\u0629 \\u0627\\u0644\\u0639\\u0645\\u0648\\u062F\nWorkPage.Column.AddColumnButtonTooltip=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0639\\u0645\\u0648\\u062F\nWorkPage.Column.EmptyIllustrationTitle=\\u0627\\u0644\\u0628\\u062D\\u062B \\u0639\\u0646 \\u062A\\u0637\\u0628\\u064A\\u0642\\u0627\\u062A\nWorkPage.Column.EmptyIllustrationDescription=\\u0623\\u0636\\u0641 \\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642\\u0627\\u062A \\u0625\\u0644\\u0649 \\u0627\\u0644\\u0623\\u062F\\u0627\\u0629 \\u0627\\u0644\\u0645\\u0635\\u0648\\u0631\\u0629\\u060C \\u0623\\u0648 \\u0642\\u0645 \\u0628\\u0625\\u0632\\u0627\\u0644\\u0629 \\u0627\\u0644\\u0623\\u062F\\u0627\\u0629 \\u0627\\u0644\\u0645\\u0635\\u0648\\u0631\\u0629 \\u0625\\u0630\\u0627 \\u0644\\u0645 \\u062A\\u0643\\u0646 \\u0628\\u062D\\u0627\\u062C\\u0629 \\u0625\\u0644\\u064A\\u0647\\u0627.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u062A\\u0637\\u0628\\u064A\\u0642\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u062D\\u0630\\u0641 \\u0627\\u0644\\u0623\\u062F\\u0627\\u0629 \\u0627\\u0644\\u0645\\u0635\\u0648\\u0631\\u0629\nWorkPage.Cell.EmptyIllustrationTitle=\\u0627\\u0644\\u0628\\u062D\\u062B \\u0639\\u0646 \\u062A\\u0637\\u0628\\u064A\\u0642\\u0627\\u062A\nWorkPage.Cell.EmptyIllustrationDescription=\\u0623\\u0636\\u0641 \\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642\\u0627\\u062A \\u0625\\u0644\\u0649 \\u0627\\u0644\\u0623\\u062F\\u0627\\u0629 \\u0627\\u0644\\u0645\\u0635\\u0648\\u0631\\u0629\\u060C \\u0623\\u0648 \\u0642\\u0645 \\u0628\\u0625\\u0632\\u0627\\u0644\\u0629 \\u0627\\u0644\\u0623\\u062F\\u0627\\u0629 \\u0627\\u0644\\u0645\\u0635\\u0648\\u0631\\u0629 \\u0625\\u0630\\u0627 \\u0644\\u0645 \\u062A\\u0643\\u0646 \\u0628\\u062D\\u0627\\u062C\\u0629 \\u0625\\u0644\\u064A\\u0647\\u0627.\nWorkPage.Cell.DeleteDialog.Title=\\u062D\\u0630\\u0641\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0628\\u0627\\u0644\\u062A\\u0623\\u0643\\u064A\\u062F \\u062D\\u0630\\u0641 \\u0647\\u0630\\u0647 \\u0627\\u0644\\u0623\\u062F\\u0627\\u0629 \\u0627\\u0644\\u0645\\u0635\\u0648\\u0631\\u0629\\u061F \\u0633\\u062A\\u062A\\u0645 \\u0623\\u064A\\u0636\\u064B\\u0627 \\u0625\\u0632\\u0627\\u0644\\u0629 \\u062C\\u0645\\u064A\\u0639 \\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642\\u0627\\u062A \\u0627\\u0644\\u0645\\u0648\\u062C\\u0648\\u062F\\u0629 \\u0641\\u064A\\u0647 \\u0645\\u0646 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629.\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u062D\\u0630\\u0641\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u0625\\u0644\\u063A\\u0627\\u0621\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u0641\\u062A\\u062D \\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A \\u0627\\u0644\\u0623\\u062F\\u0627\\u0629 \\u0627\\u0644\\u0645\\u0635\\u0648\\u0631\\u0629\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u062D\\u0630\\u0641 \\u0627\\u0644\\u0623\\u062F\\u0627\\u0629 \\u0627\\u0644\\u0645\\u0635\\u0648\\u0631\\u0629\n\nWorkPage.Section.AddVizInstanceButtonText=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0644\\u0648\\u062D\\u0627\\u062A\n\n\nContentFinder.Categories.Applications.Title=\\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642\\u0627\\u062A\nContentFinder.Widgets.Tiles.Title=\\u0627\\u0644\\u0625\\u0637\\u0627\\u0631\\u0627\\u062A\nContentFinder.Widgets.Tiles.Description=\\u0627\\u0644\\u062A\\u0645\\u062B\\u064A\\u0644\\u0627\\u062A \\u0627\\u0644\\u0645\\u0631\\u0626\\u064A\\u0629 \\u0644\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642\\u0627\\u062A.\nContentFinder.Widgets.Cards.Title=\\u0627\\u0644\\u0628\\u0637\\u0627\\u0642\\u0627\\u062A\nContentFinder.Widgets.Cards.Description=\\u0627\\u0644\\u062A\\u0645\\u062B\\u064A\\u0644\\u0627\\u062A \\u0627\\u0644\\u0645\\u0631\\u0626\\u064A\\u0629 \\u0644\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642\\u0627\\u062A\\u060C \\u0645\\u0639\\u0631\\u0648\\u0636\\u0629 \\u0641\\u064A \\u0645\\u062E\\u0637\\u0637\\u0627\\u062A \\u0645\\u0631\\u0646\\u0629.\n\nWorkPage.CardEditor.Save=\\u062D\\u0641\\u0638\nWorkPage.CardEditor.Cancel=\\u0625\\u0644\\u063A\\u0627\\u0621\nWorkPage.CardEditor.Title=\\u062A\\u0643\\u0648\\u064A\\u0646 "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=\\u062A\\u0643\\u0648\\u064A\\u0646\nWorkPage.Card.ActionDefinition.Configure=\\u062A\\u0643\\u0648\\u064A\\u0646\nWorkPage.Card.ActionDefinition.Reset=\\u062D\\u0630\\u0641 \\u062A\\u0643\\u0648\\u064A\\u0646\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0644\\u062D\\u0627\\u0644\\u064A\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=\\u0645\\u0639\\u0631\\u0641 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=\\u0645\\u0639\\u0631\\u0641 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=\\u0645\\u0639\\u0631\\u0641 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0644\\u062D\\u0627\\u0644\\u064A. \\u0633\\u062A\\u062A\\u063A\\u064A\\u0631 \\u0627\\u0644\\u0642\\u064A\\u0645\\u0629 \\u0639\\u0644\\u0649 \\u0623\\u0633\\u0627\\u0633 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0644\\u0630\\u064A \\u0642\\u0627\\u0645 \\u0628\\u062A\\u0633\\u062C\\u064A\\u0644 \\u0627\\u0644\\u062F\\u062E\\u0648\\u0644. \\u0644\\u0625\\u0638\\u0647\\u0627\\u0631 \\u0627\\u0633\\u0645 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645\\u060C \\u0627\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0633\\u0645 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=\\u0627\\u0633\\u0645 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=\\u0627\\u0633\\u0645 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0644\\u062D\\u0627\\u0644\\u064A \\u0628\\u0627\\u0644\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0623\\u0648\\u0644 \\u0648\\u0627\\u0644\\u0623\\u0648\\u0633\\u0637 \\u0648\\u0627\\u0644\\u0623\\u062E\\u064A\\u0631. \\u0633\\u064A\\u062A\\u0645 \\u0627\\u062E\\u062A\\u0635\\u0627\\u0631 \\u0627\\u0644\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0623\\u0648\\u0633\\u0637. \\u0633\\u062A\\u062A\\u063A\\u064A\\u0631 \\u0627\\u0644\\u0642\\u064A\\u0645\\u0629 \\u0639\\u0644\\u0649 \\u0623\\u0633\\u0627\\u0633 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0644\\u0630\\u064A \\u0642\\u0627\\u0645 \\u0628\\u062A\\u0633\\u062C\\u064A\\u0644 \\u0627\\u0644\\u062F\\u062E\\u0648\\u0644.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=\\u0627\\u0644\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0623\\u0648\\u0644 \\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=\\u0627\\u0644\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0623\\u0648\\u0644 \\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\u0627\\u0644\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0623\\u0648\\u0644 \\u0644\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0644\\u062D\\u0627\\u0644\\u064A. \\u0633\\u062A\\u062A\\u063A\\u064A\\u0631 \\u0627\\u0644\\u0642\\u064A\\u0645\\u0629 \\u0639\\u0644\\u0649 \\u0623\\u0633\\u0627\\u0633 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0644\\u0630\\u064A \\u0642\\u0627\\u0645 \\u0628\\u062A\\u0633\\u062C\\u064A\\u0644 \\u0627\\u0644\\u062F\\u062E\\u0648\\u0644.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=\\u0627\\u0644\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0623\\u062E\\u064A\\u0631 \\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=\\u0627\\u0644\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0623\\u062E\\u064A\\u0631 \\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\u0627\\u0644\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0623\\u062E\\u064A\\u0631 \\u0644\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0644\\u062D\\u0627\\u0644\\u064A. \\u0633\\u062A\\u062A\\u063A\\u064A\\u0631 \\u0627\\u0644\\u0642\\u064A\\u0645\\u0629 \\u0639\\u0644\\u0649 \\u0623\\u0633\\u0627\\u0633 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0644\\u0630\\u064A \\u0642\\u0627\\u0645 \\u0628\\u062A\\u0633\\u062C\\u064A\\u0644 \\u0627\\u0644\\u062F\\u062E\\u0648\\u0644.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0627\\u0644\\u0628\\u0631\\u064A\\u062F \\u0627\\u0644\\u0625\\u0644\\u0643\\u062A\\u0631\\u0648\\u0646\\u064A \\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0645\\u0646\\u0637\\u0642\\u0629 \\u0639\\u0645\\u0644 SAP Build \\u0627\\u0644\\u062D\\u0627\\u0644\\u064A\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=\\u0627\\u0644\\u0628\\u0631\\u064A\\u062F \\u0627\\u0644\\u0625\\u0644\\u0643\\u062A\\u0631\\u0648\\u0646\\u064A \\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0627\\u0644\\u0628\\u0631\\u064A\\u062F \\u0627\\u0644\\u0625\\u0644\\u0643\\u062A\\u0631\\u0648\\u0646\\u064A \\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 SAP Build Work Zone \\u0627\\u0644\\u062D\\u0627\\u0644\\u064A. \\u0633\\u062A\\u062A\\u063A\\u064A\\u0631 \\u0627\\u0644\\u0642\\u064A\\u0645\\u0629 \\u0639\\u0644\\u0649 \\u0623\\u0633\\u0627\\u0633 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0627\\u0644\\u0630\\u064A \\u0642\\u0627\\u0645 \\u0628\\u062A\\u0633\\u062C\\u064A\\u0644 \\u0627\\u0644\\u062F\\u062E\\u0648\\u0644.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u062D\\u0630\\u0641 \\u062A\\u0643\\u0648\\u064A\\u0646\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u062A\\u062D\\u062A\\u0648\\u064A \\u0647\\u0630\\u0647 \\u0627\\u0644\\u0628\\u0637\\u0627\\u0642\\u0629 \\u0639\\u0644\\u0649 \\u062A\\u0643\\u0648\\u064A\\u0646\\u0627\\u062A \\u0641\\u0631\\u062F\\u064A\\u0629. \\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u062D\\u0630\\u0641\\u0647\\u0627 \\u0646\\u0647\\u0627\\u0626\\u064A\\u064B\\u0627 \\u0648\\u0625\\u0639\\u0627\\u062F\\u0629 \\u062A\\u0639\\u064A\\u064A\\u0646 \\u0627\\u0644\\u0628\\u0637\\u0627\\u0642\\u0629 \\u0639\\u0644\\u0649 \\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A\\u0647\\u0627 \\u0627\\u0644\\u0627\\u0641\\u062A\\u0631\\u0627\\u0636\\u064A\\u0629\\u061F\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u062D\\u0630\\u0641\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u0625\\u0644\\u063A\\u0627\\u0621\n',
  "sap/ushell/components/workPageBuilder/resources/resources_bg.properties":
    "\n\nWorkPage.EmptyPage.Title=\\u041F\\u0440\\u0430\\u0437\\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\nWorkPage.EmptyPage.Message=\\u0422\\u0430\\u0437\\u0438 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430 \\u0432\\u0441\\u0435 \\u043E\\u0449\\u0435 \\u043D\\u0435 \\u0441\\u044A\\u0434\\u044A\\u0440\\u0436\\u0430 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0438.\nWorkPage.EmptyPage.Button.Add=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\n\nWorkPage.EditMode.Save=\\u0417\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\nWorkPage.EditMode.Cancel=\\u041E\\u0442\\u043A\\u0430\\u0437\nWorkPage.Message.WidgetMoved=\\u0423\\u0438\\u0434\\u0436\\u0435\\u0442\\u044A\\u0442 \\u0435 \\u043F\\u0440\\u0435\\u043C\\u0435\\u0441\\u0442\\u0435\\u043D\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435 \\u043D\\u0430 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u0412\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u043D\\u0435\\u0437\\u0430\\u0434\\u044A\\u043B\\u0436\\u0438\\u0442\\u0435\\u043B\\u043D\\u043E \\u0437\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435 \\u043D\\u0430 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0430\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\u041F\\u0440\\u0435\\u043C\\u0430\\u0445\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\nWorkPage.Row.DeleteDialog.Title=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\nWorkPage.Row.DeleteDialog.ConfirmText=\\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0435\\u0442\\u0435 \\u0442\\u043E\\u0437\\u0438 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B \\u0438 \\u0446\\u044F\\u043B\\u043E\\u0442\\u043E \\u043C\\u0443 \\u0441\\u044A\\u0434\\u044A\\u0440\\u0436\\u0430\\u043D\\u0438\\u0435?\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u041E\\u0442\\u043A\\u0430\\u0437\nWorkPage.Row.AddRowButtonTooltip=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u0412\\u044A\\u0432 \\u0432\\u0440\\u0435\\u043C\\u0435\\u0442\\u043E \\u0437\\u0430 \\u0438\\u0437\\u043F\\u044A\\u043B\\u043D\\u0435\\u043D\\u0438\\u0435 \\u0449\\u0435 \\u0441\\u0430 \\u0432\\u0438\\u0434\\u0438\\u043C\\u0438 \\u0441\\u0430\\u043C\\u043E \\u043F\\u044A\\u0440\\u0432\\u0438\\u0442\\u0435 \\u0447\\u0435\\u0442\\u0438\\u0440\\u0438 \\u043A\\u043E\\u043B\\u043E\\u043D\\u0438. \\u041C\\u043E\\u043B\\u044F, \\u043D\\u0430\\u043C\\u0430\\u043B\\u0435\\u0442\\u0435 \\u0431\\u0440\\u043E\\u044F \\u043A\\u043E\\u043B\\u043E\\u043D\\u0438 \\u043D\\u0430 \\u0447\\u0435\\u0442\\u0438\\u0440\\u0438.\nWorkPage.Row.AriaLabel=\\u0420\\u0430\\u0437\\u0434\\u0435\\u043B\\u0438 \\u043D\\u0430 \\u0440\\u0430\\u0431\\u043E\\u0442\\u043D\\u0430\\u0442\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\n\nWorkPage.Column.AriaLabel=\\u041A\\u043E\\u043B\\u043E\\u043D\\u0430 {0} \\u043E\\u0442 {1}\nWorkPage.Column.AddWidgetButtonText=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0443\\u0438\\u0434\\u0436\\u0435\\u0442\nWorkPage.Column.DeleteColumnButtonTooltip=\\u041F\\u0440\\u0435\\u043C\\u0430\\u0445\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043A\\u043E\\u043B\\u043E\\u043D\\u0430\nWorkPage.Column.AddColumnButtonTooltip=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043A\\u043E\\u043B\\u043E\\u043D\\u0430\nWorkPage.Column.EmptyIllustrationTitle=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\nWorkPage.Column.EmptyIllustrationDescription=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F \\u043A\\u044A\\u043C widget \\u0438\\u043B\\u0438 \\u043F\\u0440\\u0435\\u043C\\u0430\\u0445\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 widget, \\u0430\\u043A\\u043E \\u043D\\u0435 \\u0441\\u0435 \\u043D\\u0443\\u0436\\u0434\\u0430\\u0435\\u0442\\u0435 \\u043E\\u0442 \\u043D\\u0435\\u0433\\u043E.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0443\\u0438\\u0434\\u0436\\u0435\\u0442\nWorkPage.Cell.EmptyIllustrationTitle=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\nWorkPage.Cell.EmptyIllustrationDescription=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F \\u043A\\u044A\\u043C widget \\u0438\\u043B\\u0438 \\u043F\\u0440\\u0435\\u043C\\u0430\\u0445\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 widget, \\u0430\\u043A\\u043E \\u043D\\u0435 \\u0441\\u0435 \\u043D\\u0443\\u0436\\u0434\\u0430\\u0435\\u0442\\u0435 \\u043E\\u0442 \\u043D\\u0435\\u0433\\u043E.\nWorkPage.Cell.DeleteDialog.Title=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u041D\\u0430\\u0438\\u0441\\u0442\\u0438\\u043D\\u0430 \\u043B\\u0438 \\u0438\\u0441\\u043A\\u0430\\u0442\\u0435 \\u0434\\u0430 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0435\\u0442\\u0435 \\u0442\\u043E\\u0437\\u0438 \\u0443\\u0438\\u0434\\u0436\\u0435\\u0442? \\u0412\\u0441\\u0438\\u0447\\u043A\\u0438 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F \\u0432 \\u043D\\u0435\\u0433\\u043E \\u0441\\u044A\\u0449\\u043E \\u0449\\u0435 \\u0431\\u044A\\u0434\\u0430\\u0442 \\u043F\\u0440\\u0435\\u043C\\u0430\\u0445\\u043D\\u0430\\u0442\\u0438 \\u043E\\u0442 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\\u0442\\u0430.\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u041E\\u0442\\u043A\\u0430\\u0437\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u041E\\u0442\\u0432\\u0430\\u0440\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\\u0442\\u0435 \\u043D\\u0430 \\u0443\\u0438\\u0434\\u0436\\u0435\\u0442\\u0430\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0443\\u0438\\u0434\\u0436\\u0435\\u0442\n\nWorkPage.Section.AddVizInstanceButtonText=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043B\\u043E\\u0447\\u043A\\u0438\n\n\nContentFinder.Categories.Applications.Title=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\nContentFinder.Widgets.Tiles.Title=\\u041F\\u043B\\u043E\\u0447\\u043A\\u0438\nContentFinder.Widgets.Tiles.Description=\\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u043D\\u043E \\u043F\\u0440\\u0435\\u0434\\u0441\\u0442\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\\u0442\\u0430.\nContentFinder.Widgets.Cards.Title=\\u041A\\u0430\\u0440\\u0442\\u0438\nContentFinder.Widgets.Cards.Description=\\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u043D\\u043E \\u043F\\u0440\\u0435\\u0434\\u0441\\u0442\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\\u0442\\u0430, \\u043F\\u043E\\u043A\\u0430\\u0437\\u0430\\u043D\\u043E \\u0432 \\u0433\\u044A\\u0432\\u043A\\u0430\\u0432\\u0438 \\u0444\\u043E\\u0440\\u043C\\u0430\\u0442\\u0438.\n\nWorkPage.CardEditor.Save=\\u0417\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\nWorkPage.CardEditor.Cancel=\\u041E\\u0442\\u043A\\u0430\\u0437\nWorkPage.CardEditor.Title=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u201E{0}\\u201C\nWorkPage.CardEditor.Title.NoCardTitle=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0438\\u0440\\u0430\\u043D\\u0435\nWorkPage.Card.ActionDefinition.Configure=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0438\\u0440\\u0430\\u043D\\u0435\nWorkPage.Card.ActionDefinition.Reset=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\\u0442\\u0430\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\u0422\\u0435\\u043A\\u0443\\u0449 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=\\u041F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B\\u0441\\u043A\\u0438 \\u0418\\u0414 \\u043D\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=\\u041F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B\\u0441\\u043A\\u0438 \\u0418\\u0414 \\u043D\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=\\u0418\\u0414 \\u043D\\u0430 \\u0442\\u0435\\u043A\\u0443\\u0449 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B. \\u0421\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\\u0442\\u0430 \\u0449\\u0435 \\u0431\\u044A\\u0434\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\\u0430 \\u043D\\u0430 \\u0431\\u0430\\u0437\\u0430 \\u043D\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B\\u044F, \\u043A\\u043E\\u0439\\u0442\\u043E \\u0435 \\u0440\\u0435\\u0433\\u0438\\u0441\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430\\u0442\\u0430. \\u0417\\u0430 \\u0434\\u0430 \\u043F\\u043E\\u043A\\u0430\\u0436\\u0435\\u0442\\u0435 \\u0438\\u043C\\u0435\\u0442\\u043E \\u043C\\u0443, \\u0438\\u0437\\u043F\\u043E\\u043B\\u0437\\u0432\\u0430\\u0439\\u0442\\u0435 \\u0418\\u043C\\u0435 \\u043E\\u0442 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B\\u044F \\u043D\\u0430 SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=\\u0418\\u043C\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B \\u043D\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=\\u041F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B\\u0441\\u043A\\u043E \\u0438\\u043C\\u0435 \\u043D\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\u0418\\u043C\\u0435 \\u043D\\u0430 \\u0442\\u0435\\u043A\\u0443\\u0449\\u0438\\u044F \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B \\u0441 \\u043C\\u0430\\u043B\\u043A\\u043E, \\u0431\\u0430\\u0449\\u0438\\u043D\\u043E \\u0438\\u043C\\u0435 \\u0438 \\u0444\\u0430\\u043C\\u0438\\u043B\\u0438\\u044F. \\u0411\\u0430\\u0449\\u0438\\u043D\\u043E\\u0442\\u043E \\u0438\\u043C\\u0435 \\u0449\\u0435 \\u0431\\u044A\\u0434\\u0435 \\u0441\\u044A\\u043A\\u0440\\u0430\\u0442\\u0435\\u043D\\u043E. \\u0421\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\\u0442\\u0430 \\u0449\\u0435 \\u0441\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u044F \\u043D\\u0430 \\u0431\\u0430\\u0437\\u0430 \\u043D\\u0430 \\u0440\\u0435\\u0433\\u0438\\u0441\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438\\u044F \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430\\u0442\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=\\u041C\\u0430\\u043B\\u043A\\u043E \\u0438\\u043C\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B \\u043D\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=\\u041C\\u0430\\u043B\\u043A\\u043E \\u0438\\u043C\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B \\u043D\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\u041C\\u0430\\u043B\\u043A\\u043E \\u0438\\u043C\\u0435 \\u043D\\u0430 \\u0442\\u0435\\u043A\\u0443\\u0449\\u0438\\u044F \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B. \\u0421\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\\u0442\\u0430 \\u0449\\u0435 \\u0441\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u044F \\u043D\\u0430 \\u0431\\u0430\\u0437\\u0430 \\u043D\\u0430 \\u0440\\u0435\\u0433\\u0438\\u0441\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438\\u044F \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430\\u0442\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=\\u0424\\u0430\\u043C\\u0438\\u043B\\u043D\\u043E \\u0438\\u043C\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B \\u043D\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=\\u0424\\u0430\\u043C\\u0438\\u043B\\u043D\\u043E \\u0438\\u043C\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\u0424\\u0430\\u043C\\u0438\\u043B\\u043D\\u043E \\u0438\\u043C\\u0435 \\u043D\\u0430 \\u0442\\u0435\\u043A\\u0443\\u0449\\u0438\\u044F \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B. \\u0421\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\\u0442\\u0430 \\u0449\\u0435 \\u0441\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u044F \\u043D\\u0430 \\u0431\\u0430\\u0437\\u0430 \\u043D\\u0430 \\u0440\\u0435\\u0433\\u0438\\u0441\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0438\\u044F \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430\\u0442\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\u0418\\u043C\\u0435\\u0439\\u043B \\u0430\\u0434\\u0440\\u0435\\u0441 \\u043D\\u0430 \\u0442\\u0435\\u043A\\u0443\\u0449\\u0438\\u044F \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B \\u043D\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=\\u0418\\u043C\\u0435\\u0439\\u043B \\u043D\\u0430 \\u0442\\u0435\\u043A\\u0443\\u0449\\u0438\\u044F \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B \\u043D\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u0418\\u043C\\u0435\\u0439\\u043B \\u0430\\u0434\\u0440\\u0435\\u0441 \\u043D\\u0430 \\u0442\\u0435\\u043A\\u0443\\u0449\\u0438\\u044F \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B \\u043D\\u0430 SAP Build Work Zone. \\u0421\\u0442\\u043E\\u0439\\u043D\\u043E\\u0441\\u0442\\u0442\\u0430 \\u0449\\u0435 \\u0441\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u044F \\u043D\\u0430 \\u0431\\u0430\\u0437\\u0430 \\u043D\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B\\u044F, \\u043A\\u043E\\u0439\\u0442\\u043E \\u0435 \\u0440\\u0435\\u0433\\u0438\\u0441\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430\\u0442\\u0430.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\\u0442\\u0430\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u0422\\u0430\\u0437\\u0438 \\u043A\\u0430\\u0440\\u0442\\u0430 \\u0435 \\u0441 \\u0438\\u043D\\u0434\\u0438\\u0432\\u0438\\u0434\\u0443\\u0430\\u043B\\u043D\\u0438 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u0438. \\u0418\\u0441\\u043A\\u0430\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u0433\\u0438 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0435\\u0442\\u0435 \\u043D\\u0435\\u043E\\u0431\\u0440\\u0430\\u0442\\u0438\\u043C\\u043E \\u0438 \\u0434\\u0430 \\u0432\\u044A\\u0437\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u0438\\u0442\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438\\u0442\\u0435 \\u043F\\u043E \\u043F\\u043E\\u0434\\u0440\\u0430\\u0437\\u0431\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043A\\u0430\\u0440\\u0442\\u0430\\u0442\\u0430?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u041E\\u0442\\u043A\\u0430\\u0437\n",
  "sap/ushell/components/workPageBuilder/resources/resources_ca.properties":
    "\n\nWorkPage.EmptyPage.Title=P\\u00E0gina buida\nWorkPage.EmptyPage.Message=Aquesta p\\u00E0gina encara no cont\\u00E9 seccions.\nWorkPage.EmptyPage.Button.Add=Afegir secci\\u00F3\n\nWorkPage.EditMode.Save=Desar\nWorkPage.EditMode.Cancel=Cancel\\u00B7lar\nWorkPage.Message.WidgetMoved=Widget despla\\u00E7at\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=T\\u00EDtol de secci\\u00F3\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Indiqueu un t\\u00EDtol de secci\\u00F3 opcional\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Eliminar secci\\u00F3\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Suprimir secci\\u00F3\nWorkPage.Row.DeleteDialog.Title=Suprimir\nWorkPage.Row.DeleteDialog.ConfirmText=Voleu suprimir aquesta secci\\u00F3 i tot el seu contingut?\nWorkPage.Row.DeleteDialog.Button.Confirm=Suprimir\nWorkPage.Row.DeleteDialog.Button.Cancel=Cancel\\u00B7lar\nWorkPage.Row.AddRowButtonTooltip=Afegir secci\\u00F3\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=En el temps d'execuci\\u00F3 nom\\u00E9s es visualitzaran les primeres quatre columnes. Redu\\u00EFu la quantitat de columnes a quatre.\nWorkPage.Row.AriaLabel=Seccions de la p\\u00E0gina de treball\n\nWorkPage.Column.AriaLabel=Columna {0} de {1}\nWorkPage.Column.AddWidgetButtonText=Afegir widget\nWorkPage.Column.DeleteColumnButtonTooltip=Eliminar columna\nWorkPage.Column.AddColumnButtonTooltip=Afegir columna\nWorkPage.Column.EmptyIllustrationTitle=Cerca aplicacions\nWorkPage.Column.EmptyIllustrationDescription=Afegiu aplicacions al widget o suprimiu-lo si no el necessiteu.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Afegeix una aplicaci\\u00F3\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Suprimir widget\nWorkPage.Cell.EmptyIllustrationTitle=Cerca aplicacions\nWorkPage.Cell.EmptyIllustrationDescription=Afegiu aplicacions al widget o suprimiu-lo si no el necessiteu.\nWorkPage.Cell.DeleteDialog.Title=Suprimir\nWorkPage.Cell.DeleteDialog.ConfirmText=Segur que voleu suprimir aquest widget? Tamb\\u00E9 s'eliminaran totes les aplicacions de la p\\u00E0gina.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Suprimir\nWorkPage.Cell.DeleteDialog.Button.Cancel=Cancel\\u00B7lar\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Obrir opcions de widget\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Suprimir widget\n\nWorkPage.Section.AddVizInstanceButtonText=Afegir mosaics\n\n\nContentFinder.Categories.Applications.Title=Aplicacions\nContentFinder.Widgets.Tiles.Title=Mosaics\nContentFinder.Widgets.Tiles.Description=Representaci\\u00F3 visual d\\u2019aplicacions.\nContentFinder.Widgets.Cards.Title=Targetes\nContentFinder.Widgets.Cards.Description=Representacions visuals d\\u2019aplicacions, mostrades en disposicions flexibles.\n\nWorkPage.CardEditor.Save=Desar\nWorkPage.CardEditor.Cancel=Cancel\\u00B7lar\nWorkPage.CardEditor.Title=Configurar \"{0}\"\nWorkPage.CardEditor.Title.NoCardTitle=Configurar\nWorkPage.Card.ActionDefinition.Configure=Configurar\nWorkPage.Card.ActionDefinition.Reset=Suprimir configuraci\\u00F3\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Usuari actual\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID de l'usuari de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID d'usuari de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID de l'usuari actual. El valor canviar\\u00E0 en funci\\u00F3 de l'usuari que hagi iniciat sessi\\u00F3. Per mostrar el nom de l'usuari, utilitzeu Nom de l'usuari de SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Nom de l'usuari de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Nom d'usuari de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Nom de l'usuari actual amb nom, segon i cognoms. El segon nom s'abreujar\\u00E0. El valor canviar\\u00E0 en funci\\u00F3 de l'usuari que hagi iniciat sessi\\u00F3.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Nom de l'usuari de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Nom de l'usuari de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Nom de l'usuari actual. El valor canviar\\u00E0 en funci\\u00F3 de l'usuari que hagi iniciat sessi\\u00F3.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Cognom de l'usuari de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Cognom de l'usuari de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Cognom de l'usuari actual. El valor canviar\\u00E0 en funci\\u00F3 de l'usuari que hagi iniciat sessi\\u00F3.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Adre\\u00E7a de correu electr\\u00F2nic de l'usuari actual de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=Correu electr\\u00F2nic d'usuari de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Adre\\u00E7a de correu electr\\u00F2nic de l'usuari actual de SAP Build Work Zone. El valor canviar\\u00E0 en funci\\u00F3 de l'usuari que hagi iniciat sessi\\u00F3.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Suprimir configuraci\\u00F3\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Aquesta targeta t\\u00E9 configuracions individuals. \\u00BFVoleu suprimir-les de manera permanent i restablir la targeta a la configuraci\\u00F3 est\\u00E0ndard?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Suprimir\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Cancel\\u00B7lar\n",
  "sap/ushell/components/workPageBuilder/resources/resources_cs.properties":
    '\n\nWorkPage.EmptyPage.Title=Pr\\u00E1zdn\\u00E1 str\\u00E1nka\nWorkPage.EmptyPage.Message=Tato str\\u00E1nka dosud neobsahuje \\u017E\\u00E1dn\\u00E9 sekce.\nWorkPage.EmptyPage.Button.Add=P\\u0159idat sekci\n\nWorkPage.EditMode.Save=Ulo\\u017Eit\nWorkPage.EditMode.Cancel=Zru\\u0161it\nWorkPage.Message.WidgetMoved=Pom\\u016Fcka p\\u0159em\\u00EDst\\u011Bna\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Titulek sekce\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Zadat voliteln\\u00FD titulek sekce\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Odebrat sekci\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Odstranit sekci\nWorkPage.Row.DeleteDialog.Title=Odstranit\nWorkPage.Row.DeleteDialog.ConfirmText=Chcete odstranit tuto sekci a cel\\u00FD jej\\u00ED obsah?\nWorkPage.Row.DeleteDialog.Button.Confirm=Odstranit\nWorkPage.Row.DeleteDialog.Button.Cancel=Zru\\u0161it\nWorkPage.Row.AddRowButtonTooltip=P\\u0159idat sekci\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=P\\u0159i b\\u011Bhu budou viditeln\\u00E9 jen prvn\\u00ED \\u010Dty\\u0159i sloupce. Omezte po\\u010Det sloupc\\u016F na \\u010Dty\\u0159i.\nWorkPage.Row.AriaLabel=Sekce pracovn\\u00ED str\\u00E1nky\n\nWorkPage.Column.AriaLabel=Sloupec {0} z {1}\nWorkPage.Column.AddWidgetButtonText=P\\u0159idat pom\\u016Fcku\nWorkPage.Column.DeleteColumnButtonTooltip=Odebrat sloupec\nWorkPage.Column.AddColumnButtonTooltip=P\\u0159idat sloupec\nWorkPage.Column.EmptyIllustrationTitle=Hledat aplikace\nWorkPage.Column.EmptyIllustrationDescription=P\\u0159idejte k pom\\u016Fcce aplikace nebo pokud pom\\u016Fcku nepot\\u0159ebujete, tak ji odstra\\u0148te.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=P\\u0159idat aplikaci\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Odstranit pom\\u016Fcku\nWorkPage.Cell.EmptyIllustrationTitle=Hledat aplikace\nWorkPage.Cell.EmptyIllustrationDescription=P\\u0159idejte k pom\\u016Fcce aplikace nebo pokud pom\\u016Fcku nepot\\u0159ebujete, tak ji odstra\\u0148te.\nWorkPage.Cell.DeleteDialog.Title=Odstranit\nWorkPage.Cell.DeleteDialog.ConfirmText=Opravdu chcete odstranit tuto pom\\u016Fcku? V\\u0161echny aplikace, kter\\u00E9 jsou v n\\u00ED, budou tak\\u00E9 z t\\u00E9to str\\u00E1nky odebr\\u00E1ny.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Odstranit\nWorkPage.Cell.DeleteDialog.Button.Cancel=Zru\\u0161it\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Otev\\u0159\\u00EDt nastaven\\u00ED pom\\u016Fcky\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Odstranit pom\\u016Fcku\n\nWorkPage.Section.AddVizInstanceButtonText=P\\u0159idat dla\\u017Edice\n\n\nContentFinder.Categories.Applications.Title=Aplikace\nContentFinder.Widgets.Tiles.Title=Dla\\u017Edice\nContentFinder.Widgets.Tiles.Description=Vizu\\u00E1ln\\u00ED zn\\u00E1zorn\\u011Bn\\u00ED aplikac\\u00ED.\nContentFinder.Widgets.Cards.Title=Karty\nContentFinder.Widgets.Cards.Description=Vizu\\u00E1ln\\u00ED zn\\u00E1zorn\\u011Bn\\u00ED aplikac\\u00ED zobrazen\\u00E9 ve flexibiln\\u00EDch layoutech.\n\nWorkPage.CardEditor.Save=Ulo\\u017Eit\nWorkPage.CardEditor.Cancel=Zru\\u0161it\nWorkPage.CardEditor.Title=Konfigurovat "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Konfigurovat\nWorkPage.Card.ActionDefinition.Configure=Konfigurovat\nWorkPage.Card.ActionDefinition.Reset=Odstranit konfiguraci\n\nWorkPage.Host.Context.WorkZone.Label=Pracovn\\u00ED z\\u00F3na SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Aktu\\u00E1ln\\u00ED u\\u017Eivatel\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID u\\u017Eivatele pracovn\\u00ED z\\u00F3ny SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID u\\u017Eivatele pracovn\\u00ED z\\u00F3ny SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID aktu\\u00E1ln\\u00EDho u\\u017Eivatele. Hodnota se zm\\u011Bn\\u00ED podle u\\u017Eivatele, kter\\u00FD je p\\u0159ihl\\u00E1\\u0161en. Pro zobrazen\\u00ED u\\u017Eivatelsk\\u00E9ho jm\\u00E9na pou\\u017Eijte Jm\\u00E9no u\\u017Eivatele pracovn\\u00ED z\\u00F3ny SAP Build.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Jm\\u00E9no u\\u017Eivatele pracovn\\u00ED z\\u00F3ny SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Jm\\u00E9no u\\u017Eivatele pracovn\\u00ED z\\u00F3ny SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Jm\\u00E9no aktu\\u00E1ln\\u00EDho u\\u017Eivatele s k\\u0159estn\\u00EDm jm\\u00E9nem, prost\\u0159edn\\u00EDm jm\\u00E9nem a p\\u0159\\u00EDjmen\\u00EDm. Prost\\u0159edn\\u00ED jm\\u00E9no bude zkr\\u00E1ceno. Hodnota se zm\\u011Bn\\u00ED podle u\\u017Eivatele, kter\\u00FD je p\\u0159ihl\\u00E1\\u0161en.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=K\\u0159estn\\u00ED jm\\u00E9no u\\u017Eivatele pracovn\\u00ED z\\u00F3ny SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=K\\u0159estn\\u00ED jm\\u00E9no u\\u017Eivatele pracovn\\u00ED z\\u00F3ny SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=K\\u0159estn\\u00ED jm\\u00E9no aktu\\u00E1ln\\u00EDho u\\u017Eivatele. Hodnota se zm\\u011Bn\\u00ED podle u\\u017Eivatele, kter\\u00FD je p\\u0159ihl\\u00E1\\u0161en.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=P\\u0159\\u00EDjmen\\u00ED u\\u017Eivatele pracovn\\u00ED z\\u00F3ny SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=P\\u0159\\u00EDjmen\\u00ED u\\u017Eivatele pracovn\\u00ED z\\u00F3ny SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=P\\u0159\\u00EDjmen\\u00ED aktu\\u00E1ln\\u00EDho u\\u017Eivatele. Hodnota se zm\\u011Bn\\u00ED podle u\\u017Eivatele, kter\\u00FD je p\\u0159ihl\\u00E1\\u0161en.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=E-mailov\\u00E1 adresa aktu\\u00E1ln\\u00EDho u\\u017Eivatele pracovn\\u00ED z\\u00F3ny SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-mail u\\u017Eivatele pracovn\\u00ED z\\u00F3ny SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=E-mailov\\u00E1 adresa aktu\\u00E1ln\\u00EDho u\\u017Eivatele pracovn\\u00ED z\\u00F3ny SAP Build. Hodnota se zm\\u011Bn\\u00ED podle u\\u017Eivatele, kter\\u00FD je p\\u0159ihl\\u00E1\\u0161en.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Odstranit konfiguraci\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Tato karta m\\u00E1 individu\\u00E1ln\\u00ED konfigurace. Chcete je nevratn\\u011B odstranit a resetovat kartu na jej\\u00ED standardn\\u00ED nastaven\\u00ED?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Odstranit\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Zru\\u0161it\n',
  "sap/ushell/components/workPageBuilder/resources/resources_cy.properties":
    "\n\nWorkPage.EmptyPage.Title=Tudalen Wag\nWorkPage.EmptyPage.Message=Does dim adrannau ar y dudalen hon eto.\nWorkPage.EmptyPage.Button.Add=Ychwanegu Adran\n\nWorkPage.EditMode.Save=Cadw\nWorkPage.EditMode.Cancel=Canslo\nWorkPage.Message.WidgetMoved=Teclyn wedi symud\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Teitl yr Adran\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Rhowch deitl adran dewisol\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Tynnu Adran\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Dileu Adran\nWorkPage.Row.DeleteDialog.Title=Dileu\nWorkPage.Row.DeleteDialog.ConfirmText=Ydych chi am ddileu'r adran hon a'r holl gynnwys ynddi?\nWorkPage.Row.DeleteDialog.Button.Confirm=Dileu\nWorkPage.Row.DeleteDialog.Button.Cancel=Canslo\nWorkPage.Row.AddRowButtonTooltip=Ychwanegu Adran\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Mewn amser rhedeg, dim ond y pedair colofn gyntaf fydd i'w gweld. Ewch ati i leihau nifer y colofnau i bedair.\nWorkPage.Row.AriaLabel=Adrannau Tudalen Waith\n\nWorkPage.Column.AriaLabel=Colofn {0} o {1}\nWorkPage.Column.AddWidgetButtonText=Ychwanegu Teclyn\nWorkPage.Column.DeleteColumnButtonTooltip=Tynnu Colofn\nWorkPage.Column.AddColumnButtonTooltip=Ychwanegu Colofn\nWorkPage.Column.EmptyIllustrationTitle=Chwilio am Apiau\nWorkPage.Column.EmptyIllustrationDescription=Ychwanegwch apiau i'r teclyn, neu tynnwch y teclyn os nad oes ei angen arnoch.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Ychwanegu Ap\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Dileu Teclyn\nWorkPage.Cell.EmptyIllustrationTitle=Chwilio am Apiau\nWorkPage.Cell.EmptyIllustrationDescription=Ychwanegwch apiau i'r teclyn, neu tynnwch y teclyn os nad oes ei angen arnoch.\nWorkPage.Cell.DeleteDialog.Title=Dileu\nWorkPage.Cell.DeleteDialog.ConfirmText=Ydych chi'n si\\u0175r eich bod am ddileu'r teclyn hwn? Bydd pob ap sydd ynddo hefyd yn cael eu tynnu oddi ar y dudalen.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Dileu\nWorkPage.Cell.DeleteDialog.Button.Cancel=Canslo\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Agor gosodiadau teclyn\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Dileu Teclyn\n\nWorkPage.Section.AddVizInstanceButtonText=Ychwanegu Teils\n\n\nContentFinder.Categories.Applications.Title=Rhaglenni\nContentFinder.Widgets.Tiles.Title=Teils\nContentFinder.Widgets.Tiles.Description=Cynrychiolaeth weledol o apiau.\nContentFinder.Widgets.Cards.Title=Cardiau\nContentFinder.Widgets.Cards.Description=Cynrychiolaeth weledol o apiau, a welir mewn cynlluniau hyblyg.\n\nWorkPage.CardEditor.Save=Cadw\nWorkPage.CardEditor.Cancel=Canslo\nWorkPage.CardEditor.Title=Ffurfweddu ''''{0}''''\nWorkPage.CardEditor.Title.NoCardTitle=Ffurfweddu\nWorkPage.Card.ActionDefinition.Configure=Ffurfweddu\nWorkPage.Card.ActionDefinition.Reset=Dileu Ffurfweddiad\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Defnyddiwr Cyfredol\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID defnyddiwr SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID Defnyddiwr SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID y defnyddiwr cyfredol. Bydd y gwerth yn newid ar sail y defnyddiwr sydd wedi mewngofnodi. I ddangos enw'r defnyddiwr, defnyddiwch Enw Defnyddiwr SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Enw Defnyddiwr SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Enw Defnyddiwr SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Enw'r defnyddiwr cyfredol gan roi enw cyntaf, canol ac olaf. Caiff yr enw canol ei dalfyrru. Bydd y gwerth yn newid ar sail y defnyddiwr sydd wedi mewngofnodi.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Enw Cyntaf Defnyddiwr SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Enw Cyntaf Defnyddiwr SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Enw cyntaf y defnyddiwr cyfredol. Bydd y gwerth yn newid ar sail y defnyddiwr sydd wedi mewngofnodi.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Enw Olaf Defnyddiwr SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Enw Olaf Defnyddiwr SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Enw olaf y defnyddiwr cyfredol. Bydd y gwerth yn newid ar sail y defnyddiwr sydd wedi mewngofnodi.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Cyfeiriad E-bost Defnyddiwr Cyfredol SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=Cyfeiriad E-bost Defnyddiwr SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Cyfeiriad e-bost defnyddiwr cyfredol SAP Build Work Zone. Bydd y gwerth yn newid ar sail y defnyddiwr sydd wedi mewngofnodi.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Dileu Ffurfweddiad\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Mae gan y cerdyn hwn ffurfweddiadau unigol. Ydych chi eisiau eu dileu am byth ac ailosod y cerdyn i\\u2019w osodiadau diofyn?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Dileu\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Canslo\n",
  "sap/ushell/components/workPageBuilder/resources/resources_da.properties":
    '\n\nWorkPage.EmptyPage.Title=Tom side\nWorkPage.EmptyPage.Message=Denne side indeholder ikke nogen afsnit endnu.\nWorkPage.EmptyPage.Button.Add=Tilf\\u00F8j afsnit\n\nWorkPage.EditMode.Save=Gem\nWorkPage.EditMode.Cancel=Afbryd\nWorkPage.Message.WidgetMoved=Widget flyttet\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Afsnitstitel\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Indtast en valgfri afsnitstitel\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Fjern afsnit\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Slet afsnit\nWorkPage.Row.DeleteDialog.Title=Slet\nWorkPage.Row.DeleteDialog.ConfirmText=Vil du slette dette afsnit og alt dets indhold?\nWorkPage.Row.DeleteDialog.Button.Confirm=Slet\nWorkPage.Row.DeleteDialog.Button.Cancel=Annuller\nWorkPage.Row.AddRowButtonTooltip=Tilf\\u00F8j afsnit\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=I k\\u00F8rselstiden vil kun de f\\u00F8rste fire kolonner v\\u00E6re synlige. Reducer antallet af kolonner til fire.\nWorkPage.Row.AriaLabel=Arbejdssideafsnit\n\nWorkPage.Column.AriaLabel=Kolonne {0} af {1}\nWorkPage.Column.AddWidgetButtonText=Tilf\\u00F8j widget\nWorkPage.Column.DeleteColumnButtonTooltip=Fjern kolonne\nWorkPage.Column.AddColumnButtonTooltip=Tilf\\u00F8j kolonne\nWorkPage.Column.EmptyIllustrationTitle=S\\u00F8g efter apps\nWorkPage.Column.EmptyIllustrationDescription=Tilf\\u00F8j apps til widget, eller fjern widget, hvis du ikke har brug for den.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Tilf\\u00F8j app\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Slet widget\nWorkPage.Cell.EmptyIllustrationTitle=S\\u00F8g efter apps\nWorkPage.Cell.EmptyIllustrationDescription=Tilf\\u00F8j apps til widget, eller fjern widget, hvis du ikke har brug for den.\nWorkPage.Cell.DeleteDialog.Title=Slet\nWorkPage.Cell.DeleteDialog.ConfirmText=Er du sikker p\\u00E5, at du vil slette denne widget? Alle apps i den fjernes ogs\\u00E5 fra siden.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Slet\nWorkPage.Cell.DeleteDialog.Button.Cancel=Afbryd\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u00C5bn widgetindstillinger\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Slet widget\n\nWorkPage.Section.AddVizInstanceButtonText=Tilf\\u00F8j fliser\n\n\nContentFinder.Categories.Applications.Title=Applikationer\nContentFinder.Widgets.Tiles.Title=Fliser\nContentFinder.Widgets.Tiles.Description=Visuelle repr\\u00E6sentationer af apps.\nContentFinder.Widgets.Cards.Title=Kort\nContentFinder.Widgets.Cards.Description=Visuelle repr\\u00E6sentationer af apps, vist i fleksible layouts.\n\nWorkPage.CardEditor.Save=Gem\nWorkPage.CardEditor.Cancel=Afbryd\nWorkPage.CardEditor.Title=Konfigurer "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Konfigurer\nWorkPage.Card.ActionDefinition.Configure=Konfigurer\nWorkPage.Card.ActionDefinition.Reset=Slet konfiguration\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Aktuel bruger\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID for SAP Build Work Zone-brugeren\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone-bruger-ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID for den aktuelle bruger. V\\u00E6rdien \\u00E6ndrer sig baseret p\\u00E5 den bruger, der er logget p\\u00E5. Brug navnet p\\u00E5 SAP Build Work Zone-brugeren til at vise brugerens navn.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Navn p\\u00E5 SAP Build Work Zone-brugeren\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone-brugernavn\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Navn p\\u00E5 den aktuelle bruger med for-, mellem- og efternavn. Mellemnavnet forkortes. V\\u00E6rdien \\u00E6ndrer sig baseret p\\u00E5 den bruger, der er logget p\\u00E5.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Fornavn p\\u00E5 SAP Build Work Zone-brugeren\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Fornavn p\\u00E5 SAP Build Work Zone-bruger\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Fornavn p\\u00E5 den aktuelle bruger. V\\u00E6rdien \\u00E6ndrer sig baseret p\\u00E5 den bruger, der er logget p\\u00E5.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Efternavn p\\u00E5 SAP Build Work Zone-brugeren\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Efternavn p\\u00E5 SAP Build Work Zone-bruger\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Efternavn p\\u00E5 den aktuelle bruger. V\\u00E6rdien \\u00E6ndrer sig baseret p\\u00E5 den bruger, der er logget p\\u00E5.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=E-mail-adresse p\\u00E5 aktuel SAP Build Work Zone-bruger\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-mail for SAP Build Work Zone-bruger\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=E-mail-adresse p\\u00E5 den aktuelle SAP Build Work Zone-bruger. V\\u00E6rdien \\u00E6ndrer sig baseret p\\u00E5 den bruger, der er logget p\\u00E5.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Slet konfiguration\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Dette kort har individuelle konfigurationer. Vil du slette dem uigenkaldeligt og nulstille kortet til dets standardindstillinger?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Slet\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Afbryd\n',
  "sap/ushell/components/workPageBuilder/resources/resources_de.properties":
    '\n\nWorkPage.EmptyPage.Title=Leere Seite\nWorkPage.EmptyPage.Message=Diese Seite enth\\u00E4lt noch keine Abschnitte.\nWorkPage.EmptyPage.Button.Add=Abschnitt hinzuf\\u00FCgen\n\nWorkPage.EditMode.Save=Sichern\nWorkPage.EditMode.Cancel=Abbrechen\nWorkPage.Message.WidgetMoved=Widget verschoben\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Abschnittstitel\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Geben Sie einen optionalen Abschnittstitel ein\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Abschnitt entfernen\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Abschnitt l\\u00F6schen\nWorkPage.Row.DeleteDialog.Title=L\\u00F6schen\nWorkPage.Row.DeleteDialog.ConfirmText=M\\u00F6chten Sie diesen Abschnitt mitsamt Inhalt l\\u00F6schen?\nWorkPage.Row.DeleteDialog.Button.Confirm=L\\u00F6schen\nWorkPage.Row.DeleteDialog.Button.Cancel=Abbrechen\nWorkPage.Row.AddRowButtonTooltip=Abschnitt hinzuf\\u00FCgen\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Zur Laufzeit sind nur die ersten vier Spalten sichtbar. Reduzieren Sie die Anzahl der Spalten auf vier.\nWorkPage.Row.AriaLabel=Arbeitsseitenabschnitte\n\nWorkPage.Column.AriaLabel=Spalte {0} von {1}\nWorkPage.Column.AddWidgetButtonText=Widget hinzuf\\u00FCgen\nWorkPage.Column.DeleteColumnButtonTooltip=Spalte entfernen\nWorkPage.Column.AddColumnButtonTooltip=Spalte hinzuf\\u00FCgen\nWorkPage.Column.EmptyIllustrationTitle=Nach Apps suchen\nWorkPage.Column.EmptyIllustrationDescription=F\\u00FCgen Sie dem Widget Apps hinzu oder entfernen Sie das Widget, wenn Sie es nicht ben\\u00F6tigen.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=App hinzuf\\u00FCgen\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Widget l\\u00F6schen\nWorkPage.Cell.EmptyIllustrationTitle=Nach Apps suchen\nWorkPage.Cell.EmptyIllustrationDescription=F\\u00FCgen Sie dem Widget Apps hinzu oder entfernen Sie das Widget, wenn Sie es nicht ben\\u00F6tigen.\nWorkPage.Cell.DeleteDialog.Title=L\\u00F6schen\nWorkPage.Cell.DeleteDialog.ConfirmText=M\\u00F6chten Sie dieses Widget wirklich l\\u00F6schen? Alle darin enthaltenen Apps werden ebenfalls von der Seite entfernt.\nWorkPage.Cell.DeleteDialog.Button.Confirm=L\\u00F6schen\nWorkPage.Cell.DeleteDialog.Button.Cancel=Abbrechen\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Widget-Einstellungen \\u00F6ffnen\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Widget l\\u00F6schen\n\nWorkPage.Section.AddVizInstanceButtonText=Kacheln hinzuf\\u00FCgen\n\n\nContentFinder.Categories.Applications.Title=Anwendungen\nContentFinder.Widgets.Tiles.Title=Kacheln\nContentFinder.Widgets.Tiles.Description=Visuelle Darstellungen von Apps\nContentFinder.Widgets.Cards.Title=Karten\nContentFinder.Widgets.Cards.Description=Visuelle Darstellungen von Apps, angezeigt in flexiblen Layouts\n\nWorkPage.CardEditor.Save=Sichern\nWorkPage.CardEditor.Cancel=Abbrechen\nWorkPage.CardEditor.Title="{0}" konfigurieren\nWorkPage.CardEditor.Title.NoCardTitle=Konfigurieren\nWorkPage.Card.ActionDefinition.Configure=Konfigurieren\nWorkPage.Card.ActionDefinition.Reset=Konfiguration l\\u00F6schen\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Aktueller Benutzer\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID des SAP-Build-Work-Zone-Benutzers\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP-Build-Work-Zone-Benutzer-ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID des aktuellen Benutzers. Der Wert \\u00E4ndert sich basierend auf dem angemeldeten Benutzer. Um den Namen des Benutzers einzublenden, verwenden Sie Name des SAP-Build-Work-Zone-Benutzers.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Name des SAP-Build-Work-Zone-Benutzers\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP-Build-Work-Zone-Benutzername\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Name des aktuellen Benutzers mit Vornamen, zweitem Vornamen und Nachnamen. Der zweite Vorname wird abgek\\u00FCrzt. Der Wert \\u00E4ndert sich basierend auf dem angemeldeten Benutzer.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Vorname des SAP-Build-Work-Zone-Benutzers\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP-Build-Work-Zone-Benutzervorname\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Vorname des aktuellen Benutzers. Der Wert \\u00E4ndert sich basierend auf dem angemeldeten Benutzer.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Nachname des SAP-Build-Work-Zone-Benutzers\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP-Build-Work-Zone-Benutzernachname\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Nachname des aktuellen Benutzers. Der Wert \\u00E4ndert sich basierend auf dem angemeldeten Benutzer.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=E-Mail-Adresse des aktuellen SAP-Build-Work-Zone-Benutzers\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP-Build-Work-Zone-Benutzer-E-Mail\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=E-Mail-Adresse des aktuellen SAP-Build-Work-Zone-Benutzers. Der Wert \\u00E4ndert sich basierend auf dem angemeldeten Benutzer.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Konfiguration l\\u00F6schen\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Diese Karte hat individuelle Konfigurationen. M\\u00F6chten Sie diese dauerhaft l\\u00F6schen und die Karte auf ihre Standardeinstellungen zur\\u00FCcksetzen?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=L\\u00F6schen\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Abbrechen\n',
  "sap/ushell/components/workPageBuilder/resources/resources_el.properties":
    '\n\nWorkPage.EmptyPage.Title=\\u039A\\u03B5\\u03BD\\u03AE \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\nWorkPage.EmptyPage.Message=\\u0391\\u03C5\\u03C4\\u03AE \\u03B7 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1 \\u03B4\\u03B5\\u03BD \\u03C0\\u03B5\\u03C1\\u03B9\\u03AD\\u03C7\\u03B5\\u03B9 \\u03BA\\u03B1\\u03BC\\u03AF\\u03B1 \\u03B5\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1 \\u03B1\\u03BA\\u03CC\\u03BC\\u03B7.\nWorkPage.EmptyPage.Button.Add=\\u03A0\\u03C1\\u03BF\\u03C3\\u03B8\\u03AE\\u03BA\\u03B7 \\u0395\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1\\u03C2\n\nWorkPage.EditMode.Save=\\u0391\\u03C0\\u03BF\\u03B8\\u03AE\\u03BA\\u03B5\\u03C5\\u03C3\\u03B7\nWorkPage.EditMode.Cancel=\\u0391\\u03BA\\u03CD\\u03C1\\u03C9\\u03C3\\u03B7\nWorkPage.Message.WidgetMoved=Widget \\u03BC\\u03B5\\u03C4\\u03B1\\u03BA\\u03B9\\u03BD\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\u03A4\\u03AF\\u03C4\\u03BB\\u03BF\\u03C2 \\u0395\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1\\u03C2\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u0395\\u03B9\\u03C3\\u03AC\\u03B3\\u03B5\\u03C4\\u03B5 \\u03C0\\u03C1\\u03BF\\u03B1\\u03B9\\u03C1\\u03B5\\u03C4\\u03B9\\u03BA\\u03CC \\u03C4\\u03AF\\u03C4\\u03BB\\u03BF \\u03B5\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1\\u03C2\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\u0391\\u03C6\\u03B1\\u03AF\\u03C1\\u03B5\\u03C3\\u03B7 \\u0395\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1\\u03C2\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE \\u0395\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1\\u03C2\nWorkPage.Row.DeleteDialog.Title=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\nWorkPage.Row.DeleteDialog.ConfirmText=\\u0398\\u03AD\\u03BB\\u03B5\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03B4\\u03B9\\u03B1\\u03B3\\u03C1\\u03AC\\u03C8\\u03B5\\u03C4\\u03B5 \\u03B1\\u03C5\\u03C4\\u03AE\\u03BD \\u03C4\\u03B7\\u03BD \\u03B5\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1 \\u03BA\\u03B1\\u03B9 \\u03CC\\u03BB\\u03B1 \\u03C4\\u03B7\\u03C2 \\u03C4\\u03B1 \\u03C0\\u03B5\\u03C1\\u03B9\\u03B5\\u03C7\\u03CC\\u03BC\\u03B5\\u03BD\\u03B1;\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u0391\\u03BA\\u03CD\\u03C1\\u03C9\\u03C3\\u03B7\nWorkPage.Row.AddRowButtonTooltip=\\u03A0\\u03C1\\u03BF\\u03C3\\u03B8\\u03AE\\u03BA\\u03B7 \\u0395\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1\\u03C2\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u03A3\\u03B5 \\u03C7\\u03C1\\u03CC\\u03BD\\u03BF \\u03B5\\u03BA\\u03C4\\u03AD\\u03BB\\u03B5\\u03C3\\u03B7\\u03C2, \\u03BC\\u03CC\\u03BD\\u03BF \\u03BF\\u03B9 \\u03C4\\u03AD\\u03C3\\u03C3\\u03B5\\u03C1\\u03B9\\u03C2 \\u03C0\\u03C1\\u03CE\\u03C4\\u03B5\\u03C2 \\u03C3\\u03C4\\u03AE\\u03BB\\u03B5\\u03C2 \\u03B8\\u03B1 \\u03B5\\u03BC\\u03C6\\u03B1\\u03BD\\u03AF\\u03B6\\u03BF\\u03BD\\u03C4\\u03B1\\u03B9. \\u039C\\u03B5\\u03B9\\u03CE\\u03C3\\u03C4\\u03B5 \\u03C4\\u03BF\\u03BD \\u03B1\\u03C1\\u03B9\\u03B8\\u03BC\\u03CC \\u03C3\\u03C4\\u03B7\\u03BB\\u03CE\\u03BD \\u03C3\\u03B5 \\u03C4\\u03AD\\u03C3\\u03C3\\u03B5\\u03C1\\u03B9\\u03C2.\nWorkPage.Row.AriaLabel=\\u0395\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B5\\u03C2 \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2 \\u0395\\u03C1\\u03B3\\u03B1\\u03C3\\u03AF\\u03B1\\u03C2\n\nWorkPage.Column.AriaLabel=\\u03A3\\u03C4\\u03AE\\u03BB\\u03B7 {0} \\u03B1\\u03C0\\u03CC {1}\nWorkPage.Column.AddWidgetButtonText=\\u03A0\\u03C1\\u03BF\\u03C3\\u03B8\\u03AE\\u03BA\\u03B7 Widget\nWorkPage.Column.DeleteColumnButtonTooltip=\\u0391\\u03C6\\u03B1\\u03AF\\u03C1\\u03B5\\u03C3\\u03B7 \\u03A3\\u03C4\\u03AE\\u03BB\\u03B7\\u03C2\nWorkPage.Column.AddColumnButtonTooltip=\\u03A0\\u03C1\\u03BF\\u03C3\\u03B8\\u03AE\\u03BA\\u03B7 \\u03A3\\u03C4\\u03AE\\u03BB\\u03B7\\u03C2\nWorkPage.Column.EmptyIllustrationTitle=\\u0391\\u03BD\\u03B1\\u03B6\\u03AE\\u03C4\\u03B7\\u03C3\\u03B7 \\u0395\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03CE\\u03BD\nWorkPage.Column.EmptyIllustrationDescription=\\u03A0\\u03C1\\u03BF\\u03C3\\u03B8\\u03AD\\u03C3\\u03C4\\u03B5 \\u03B5\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AD\\u03C2 \\u03C3\\u03C4\\u03BF widget \\u03AE \\u03BA\\u03B1\\u03C4\\u03B1\\u03C1\\u03B3\\u03AE\\u03C3\\u03C4\\u03B5 \\u03C4\\u03BF widget \\u03B1\\u03BD \\u03B4\\u03B5\\u03BD \\u03C4\\u03BF \\u03C7\\u03C1\\u03B5\\u03B9\\u03AC\\u03B6\\u03B5\\u03C3\\u03C4\\u03B5.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\u03A0\\u03C1\\u03BF\\u03C3\\u03B8\\u03AE\\u03BA\\u03B7 \\u0395\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AE\\u03C2\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE widget\nWorkPage.Cell.EmptyIllustrationTitle=\\u0391\\u03BD\\u03B1\\u03B6\\u03AE\\u03C4\\u03B7\\u03C3\\u03B7 \\u0395\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03CE\\u03BD\nWorkPage.Cell.EmptyIllustrationDescription=\\u03A0\\u03C1\\u03BF\\u03C3\\u03B8\\u03AD\\u03C3\\u03C4\\u03B5 \\u03B5\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AD\\u03C2 \\u03C3\\u03C4\\u03BF widget \\u03AE \\u03BA\\u03B1\\u03C4\\u03B1\\u03C1\\u03B3\\u03AE\\u03C3\\u03C4\\u03B5 \\u03C4\\u03BF widget \\u03B1\\u03BD \\u03B4\\u03B5\\u03BD \\u03C4\\u03BF \\u03C7\\u03C1\\u03B5\\u03B9\\u03AC\\u03B6\\u03B5\\u03C3\\u03C4\\u03B5.\nWorkPage.Cell.DeleteDialog.Title=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u0398\\u03B1 \\u03B4\\u03B9\\u03B1\\u03B3\\u03C1\\u03AC\\u03C8\\u03B5\\u03C4\\u03B5 \\u03C4\\u03BF widget; \\u038C\\u03BB\\u03B5\\u03C2 \\u03BF\\u03B9 \\u03B5\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AD\\u03C2 \\u03C3\\u03B5 \\u03B1\\u03C5\\u03C4\\u03CC \\u03B8\\u03B1 \\u03B4\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03BF\\u03CD\\u03BD \\u03BF\\u03BC\\u03BF\\u03AF\\u03C9\\u03C2 \\u03B1\\u03C0\\u03CC \\u03C4\\u03B7 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1.\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u0391\\u03BA\\u03CD\\u03C1\\u03C9\\u03C3\\u03B7\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u0386\\u03BD\\u03BF\\u03B9\\u03B3\\u03BC\\u03B1 \\u03C1\\u03C5\\u03B8\\u03BC\\u03AF\\u03C3\\u03B5\\u03C9\\u03BD widget\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE widget\n\nWorkPage.Section.AddVizInstanceButtonText=\\u03A0\\u03C1\\u03BF\\u03C3\\u03B8\\u03AE\\u03BA\\u03B7 \\u03A0\\u03BB\\u03B1\\u03BA\\u03B9\\u03B4\\u03AF\\u03C9\\u03BD\n\n\nContentFinder.Categories.Applications.Title=\\u0395\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AD\\u03C2\nContentFinder.Widgets.Tiles.Title=\\u03A0\\u03BB\\u03B1\\u03BA\\u03AF\\u03B4\\u03B9\\u03B1\nContentFinder.Widgets.Tiles.Description=\\u039F\\u03C0\\u03C4\\u03B9\\u03BA\\u03AD\\u03C2 \\u03B1\\u03C0\\u03B5\\u03B9\\u03BA\\u03BF\\u03BD\\u03AF\\u03C3\\u03B5\\u03B9\\u03C2 \\u03B5\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03CE\\u03BD.\nContentFinder.Widgets.Cards.Title=\\u039A\\u03AC\\u03C1\\u03C4\\u03B5\\u03C2\nContentFinder.Widgets.Cards.Description=\\u039F\\u03C0\\u03C4\\u03B9\\u03BA\\u03AD\\u03C2 \\u03B1\\u03C0\\u03B5\\u03B9\\u03BA\\u03BF\\u03BD\\u03AF\\u03C3\\u03B5\\u03B9\\u03C2 \\u03B5\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03CE\\u03BD, \\u03C0\\u03BF\\u03C5 \\u03B5\\u03BC\\u03C6\\u03B1\\u03BD\\u03AF\\u03B6\\u03BF\\u03BD\\u03C4\\u03B1\\u03B9 \\u03C3\\u03B5 \\u03B5\\u03C5\\u03AD\\u03BB\\u03B9\\u03BA\\u03C4\\u03B5\\u03C2 \\u03B4\\u03B9\\u03B1\\u03C3\\u03C4\\u03AC\\u03C3\\u03B5\\u03B9\\u03C2.\n\nWorkPage.CardEditor.Save=\\u0391\\u03C0\\u03BF\\u03B8\\u03AE\\u03BA\\u03B5\\u03C5\\u03C3\\u03B7\nWorkPage.CardEditor.Cancel=\\u0391\\u03BA\\u03CD\\u03C1\\u03C9\\u03C3\\u03B7\nWorkPage.CardEditor.Title=\\u0394\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7 "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=\\u0394\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7\nWorkPage.Card.ActionDefinition.Configure=\\u0394\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7\nWorkPage.Card.ActionDefinition.Reset=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE \\u0394\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7\\u03C2\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\u03A4\\u03C1\\u03AD\\u03C7\\u03C9\\u03BD \\u03A7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7\\u03C2\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID \\u03A7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID \\u03C4\\u03C1\\u03AD\\u03C7\\u03BF\\u03BD\\u03C4\\u03BF\\u03C2 \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7. \\u0397 \\u03C4\\u03B9\\u03BC\\u03AE \\u03B8\\u03B1 \\u03B1\\u03BB\\u03BB\\u03AC\\u03BE\\u03B5\\u03B9 \\u03B2\\u03AC\\u03C3\\u03B5\\u03B9 \\u03C4\\u03BF\\u03C5 \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 \\u03C0\\u03BF\\u03C5 \\u03C3\\u03C5\\u03BD\\u03B4\\u03AD\\u03B5\\u03C4\\u03B1\\u03B9. \\u0393\\u03B9\\u03B1 \\u03BD\\u03B1 \\u03B5\\u03BC\\u03C6\\u03B1\\u03BD\\u03AF\\u03C3\\u03B5\\u03C4\\u03B5 \\u03C4\\u03BF \\u03CC\\u03BD\\u03BF\\u03BC\\u03B1 \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7, \\u03C7\\u03C1\\u03B7\\u03C3\\u03B9\\u03BC\\u03BF\\u03C0\\u03BF\\u03B9\\u03AE\\u03C3\\u03C4\\u03B5 \\u03C4\\u03BF \\u038C\\u03BD\\u03BF\\u03BC\\u03B1 \\u03C4\\u03BF\\u03C5 \\u03A7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=\\u038C\\u03BD\\u03BF\\u03BC\\u03B1 \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=\\u038C\\u03BD\\u03BF\\u03BC\\u03B1 \\u03A7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\u038C\\u03BD\\u03BF\\u03BC\\u03B1 \\u03C4\\u03C1\\u03AD\\u03C7\\u03BF\\u03BD\\u03C4\\u03BF\\u03C2 \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 \\u03BC\\u03B5 \\u03CC\\u03BD\\u03BF\\u03BC\\u03B1, \\u03BC\\u03B5\\u03C3\\u03B1\\u03AF\\u03BF \\u03CC\\u03BD\\u03BF\\u03BC\\u03B1 \\u03BA\\u03B1\\u03B9 \\u03B5\\u03C0\\u03AF\\u03B8\\u03B5\\u03C4\\u03BF. \\u03A4\\u03BF \\u03BC\\u03B5\\u03C3\\u03B1\\u03AF\\u03BF \\u03CC\\u03BD\\u03BF\\u03BC\\u03B1 \\u03B8\\u03B1 \\u03C3\\u03C5\\u03BD\\u03C4\\u03BF\\u03BC\\u03B5\\u03C5\\u03C4\\u03B5\\u03AF. \\u0397 \\u03C4\\u03B9\\u03BC\\u03AE \\u03B8\\u03B1 \\u03B1\\u03BB\\u03BB\\u03AC\\u03BE\\u03B5\\u03B9 \\u03B2\\u03AC\\u03C3\\u03B5\\u03B9 \\u03C4\\u03BF\\u03C5 \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 \\u03C0\\u03BF\\u03C5 \\u03C3\\u03C5\\u03BD\\u03B4\\u03AD\\u03B5\\u03C4\\u03B1\\u03B9.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=\\u038C\\u03BD\\u03BF\\u03BC\\u03B1 \\u03C4\\u03BF\\u03C5 \\u03A7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=\\u038C\\u03BD\\u03BF\\u03BC\\u03B1 \\u03A7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\u038C\\u03BD\\u03BF\\u03BC\\u03B1 \\u03C4\\u03C1\\u03AD\\u03C7\\u03BF\\u03BD\\u03C4\\u03BF\\u03C2 \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7. \\u0397 \\u03C4\\u03B9\\u03BC\\u03AE \\u03B8\\u03B1 \\u03B1\\u03BB\\u03BB\\u03AC\\u03BE\\u03B5\\u03B9 \\u03B2\\u03AC\\u03C3\\u03B5\\u03B9 \\u03C4\\u03BF\\u03C5 \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 \\u03C0\\u03BF\\u03C5 \\u03C3\\u03C5\\u03BD\\u03B4\\u03AD\\u03B5\\u03C4\\u03B1\\u03B9.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=\\u0395\\u03C0\\u03AF\\u03B8\\u03B5\\u03C4\\u03BF \\u03C4\\u03BF\\u03C5 \\u03A7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=\\u0395\\u03C0\\u03AF\\u03B8\\u03B5\\u03C4\\u03BF \\u03A7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\u0395\\u03C0\\u03AF\\u03B8\\u03B5\\u03C4\\u03BF \\u03C4\\u03C1\\u03AD\\u03C7\\u03BF\\u03BD\\u03C4\\u03BF\\u03C2 \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7. \\u0397 \\u03C4\\u03B9\\u03BC\\u03AE \\u03B8\\u03B1 \\u03B1\\u03BB\\u03BB\\u03AC\\u03BE\\u03B5\\u03B9 \\u03B2\\u03AC\\u03C3\\u03B5\\u03B9 \\u03C4\\u03BF\\u03C5 \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 \\u03C0\\u03BF\\u03C5 \\u03C3\\u03C5\\u03BD\\u03B4\\u03AD\\u03B5\\u03C4\\u03B1\\u03B9.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\u0394/\\u03BD\\u03C3\\u03B7 Email \\u03C4\\u03BF\\u03C5 \\u03A4\\u03C1\\u03AD\\u03C7\\u03BF\\u03BD\\u03C4\\u03BF\\u03C2 \\u03A7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=Email \\u03A7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u0394/\\u03BD\\u03C3\\u03B7 Email \\u03C4\\u03BF\\u03C5 \\u03C4\\u03C1\\u03AD\\u03C7\\u03BF\\u03BD\\u03C4\\u03BF\\u03C2 \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 SAP Build Work Zone. \\u0397 \\u03C4\\u03B9\\u03BC\\u03AE \\u03B8\\u03B1 \\u03B1\\u03BB\\u03BB\\u03AC\\u03BE\\u03B5\\u03B9 \\u03B2\\u03AC\\u03C3\\u03B5\\u03B9 \\u03C4\\u03BF\\u03C5 \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 \\u03C0\\u03BF\\u03C5 \\u03C3\\u03C5\\u03BD\\u03B4\\u03AD\\u03B5\\u03C4\\u03B1\\u03B9.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE \\u0394\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7\\u03C2\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u0391\\u03C5\\u03C4\\u03AE \\u03B7 \\u03BA\\u03AC\\u03C1\\u03C4\\u03B1 \\u03AD\\u03C7\\u03B5\\u03B9 \\u03BC\\u03B5\\u03BC\\u03BF\\u03BD\\u03C9\\u03BC\\u03AD\\u03BD\\u03B5\\u03C2 \\u03B4\\u03B9\\u03B1\\u03BC\\u03BF\\u03C1\\u03C6\\u03CE\\u03C3\\u03B5\\u03B9\\u03C2. \\u0398\\u03AD\\u03BB\\u03B5\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03C4\\u03B9\\u03C2 \\u03B4\\u03B9\\u03B1\\u03B3\\u03C1\\u03AC\\u03C8\\u03B5\\u03C4\\u03B5 \\u03BF\\u03C1\\u03B9\\u03C3\\u03C4\\u03B9\\u03BA\\u03AC \\u03BA\\u03B1\\u03B9 \\u03BD\\u03B1 \\u03B5\\u03C0\\u03B1\\u03BD\\u03B1\\u03BA\\u03B1\\u03B8\\u03BF\\u03C1\\u03AF\\u03C3\\u03B5\\u03C4\\u03B5 \\u03C4\\u03B7\\u03BD \\u03BA\\u03AC\\u03C1\\u03C4\\u03B1 \\u03C3\\u03C4\\u03B9\\u03C2 \\u03C0\\u03C1\\u03BF\\u03C4\\u03B5\\u03B9\\u03BD\\u03CC\\u03BC\\u03B5\\u03BD\\u03B5\\u03C2 \\u03C1\\u03C5\\u03B8\\u03BC\\u03AF\\u03C3\\u03B5\\u03B9\\u03C2;\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u0391\\u03BA\\u03CD\\u03C1\\u03C9\\u03C3\\u03B7\n',
  "sap/ushell/components/workPageBuilder/resources/resources_en.properties":
    "\n\nWorkPage.EmptyPage.Title=Empty Page\nWorkPage.EmptyPage.Message=This page does not contain any sections yet.\nWorkPage.EmptyPage.Button.Add=Add Section\n\nWorkPage.EditMode.Save=Save\nWorkPage.EditMode.Cancel=Cancel\nWorkPage.Message.WidgetMoved=Widget moved\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Section Title\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Enter an optional section title\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Remove Section\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Delete Section\nWorkPage.Row.DeleteDialog.Title=Delete\nWorkPage.Row.DeleteDialog.ConfirmText=Do you want to delete this section and all its content?\nWorkPage.Row.DeleteDialog.Button.Confirm=Delete\nWorkPage.Row.DeleteDialog.Button.Cancel=Cancel\nWorkPage.Row.AddRowButtonTooltip=Add Section\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=In runtime, only the first four columns will be visible. Please reduce the number of columns to four.\nWorkPage.Row.AriaLabel=Work Page Sections\n\nWorkPage.Column.AriaLabel=Column {0} of {1}\nWorkPage.Column.AddWidgetButtonText=Add Widget\nWorkPage.Column.DeleteColumnButtonTooltip=Remove Column\nWorkPage.Column.AddColumnButtonTooltip=Add Column\nWorkPage.Column.EmptyIllustrationTitle=Search for Apps\nWorkPage.Column.EmptyIllustrationDescription=Add apps to the widget, or remove the widget if you don't need it.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Add App\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Delete Widget\nWorkPage.Cell.EmptyIllustrationTitle=Search for Apps\nWorkPage.Cell.EmptyIllustrationDescription=Add apps to the widget, or remove the widget if you don't need it.\nWorkPage.Cell.DeleteDialog.Title=Delete\nWorkPage.Cell.DeleteDialog.ConfirmText=Are you sure you want to delete this widget? All apps in it will also be removed from the page.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Delete\nWorkPage.Cell.DeleteDialog.Button.Cancel=Cancel\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Open widget settings\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Delete Widget\n\nWorkPage.Section.AddVizInstanceButtonText=Add Tiles\n\n\nContentFinder.Categories.Applications.Title=Applications\nContentFinder.Widgets.Tiles.Title=Tiles\nContentFinder.Widgets.Tiles.Description=Visual representations of apps.\nContentFinder.Widgets.Cards.Title=Cards\nContentFinder.Widgets.Cards.Description=Visual representations of apps, displayed in flexible layouts.\n\nWorkPage.CardEditor.Save=Save\nWorkPage.CardEditor.Cancel=Cancel\nWorkPage.CardEditor.Title=Configure \"{0}\"\nWorkPage.CardEditor.Title.NoCardTitle=Configure\nWorkPage.Card.ActionDefinition.Configure=Configure\nWorkPage.Card.ActionDefinition.Reset=Delete Configuration\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Current User\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID of the SAP Build Work Zone user\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone User ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID of the current user. The value will change based on the user who is logged on. To show the user\\u2019s name, use Name of the SAP Build Work Zone User.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Name of the SAP Build Work Zone User\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone User Name\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Name of the current user with first, middle and last name. The middle name will be abbreviated. The value will change based on the user who is logged on.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=First Name of the SAP Build Work Zone User\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone User First Name\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=First name of the current user. The value will change based on the user who is logged on.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Last Name of the SAP Build Work Zone User\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone User Last Name\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Last name of the current user. The value will change based on the user who is logged on.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Email Address of Current SAP Build Work Zone User\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone User Email\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Email address of the current SAP Build Work Zone user. The value will change based on the user who is logged on.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Delete Configuration\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=This card has individual configurations. Do you want to delete them irrevocably and reset the card to its default settings?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Delete\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Cancel\n",
  "sap/ushell/components/workPageBuilder/resources/resources_en_GB.properties":
    "\n\nWorkPage.EmptyPage.Title=Empty Page\nWorkPage.EmptyPage.Message=This page does not contain any sections yet.\nWorkPage.EmptyPage.Button.Add=Add Section\n\nWorkPage.EditMode.Save=Save\nWorkPage.EditMode.Cancel=Cancel\nWorkPage.Message.WidgetMoved=Widget moved\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Section Title\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Enter an optional section title\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Remove Section\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Delete Section\nWorkPage.Row.DeleteDialog.Title=Delete\nWorkPage.Row.DeleteDialog.ConfirmText=Do you want to delete this section and all its content?\nWorkPage.Row.DeleteDialog.Button.Confirm=Delete\nWorkPage.Row.DeleteDialog.Button.Cancel=Cancel\nWorkPage.Row.AddRowButtonTooltip=Add Section\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=In runtime, only the first four columns will be visible. Please reduce the number of columns to four.\nWorkPage.Row.AriaLabel=Work Page Sections\n\nWorkPage.Column.AriaLabel=Column {0} of {1}\nWorkPage.Column.AddWidgetButtonText=Add Widget\nWorkPage.Column.DeleteColumnButtonTooltip=Remove Column\nWorkPage.Column.AddColumnButtonTooltip=Add Column\nWorkPage.Column.EmptyIllustrationTitle=Search for Apps\nWorkPage.Column.EmptyIllustrationDescription=Add apps to the widget, or remove the widget if you don't need it.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Add App\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Delete Widget\nWorkPage.Cell.EmptyIllustrationTitle=Search for Apps\nWorkPage.Cell.EmptyIllustrationDescription=Add apps to the widget, or remove the widget if you don't need it.\nWorkPage.Cell.DeleteDialog.Title=Delete\nWorkPage.Cell.DeleteDialog.ConfirmText=Are you sure you want to delete this widget? All apps in it will also be removed from the page.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Delete\nWorkPage.Cell.DeleteDialog.Button.Cancel=Cancel\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Open widget settings\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Delete Widget\n\nWorkPage.Section.AddVizInstanceButtonText=Add Tiles\n\n\nContentFinder.Categories.Applications.Title=Applications\nContentFinder.Widgets.Tiles.Title=Tiles\nContentFinder.Widgets.Tiles.Description=Visual representations of apps.\nContentFinder.Widgets.Cards.Title=Cards\nContentFinder.Widgets.Cards.Description=Visual representations of apps, displayed in flexible layouts.\n\nWorkPage.CardEditor.Save=Save\nWorkPage.CardEditor.Cancel=Cancel\nWorkPage.CardEditor.Title=Configure \"{0}\"\nWorkPage.CardEditor.Title.NoCardTitle=Configure\nWorkPage.Card.ActionDefinition.Configure=Configure\nWorkPage.Card.ActionDefinition.Reset=Delete Configuration\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Current User\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID of the SAP Build Work Zone user\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone User ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID of the current user. The value will change based on the user who is logged on. To show the user\\u2019s name, use Name of the SAP Build Work Zone User.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Name of the SAP Build Work Zone User\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone User Name\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Name of the current user with first, middle and last name. The middle name will be abbreviated. The value will change based on the user who is logged on.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=First Name of the SAP Build Work Zone User\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone User First Name\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=First name of the current user. The value will change based on the user who is logged on.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Last Name of the SAP Build Work Zone User\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone User Last Name\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Last name of the current user. The value will change based on the user who is logged on.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Email Address of Current SAP Build Work Zone User\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone User Email\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Email address of the current SAP Build Work Zone user. The value will change based on the user who is logged on.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Delete Configuration\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=This card has individual configurations. Do you want to delete them irrevocably and reset the card to its default settings?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Delete\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Cancel\n",
  "sap/ushell/components/workPageBuilder/resources/resources_en_US_sappsd.properties":
    "\n\nWorkPage.EmptyPage.Title=[[[\\u0114\\u0271\\u03C1\\u0163\\u0177 \\u01A4\\u0105\\u011F\\u0113\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.EmptyPage.Message=[[[\\u0162\\u0125\\u012F\\u015F \\u03C1\\u0105\\u011F\\u0113 \\u018C\\u014F\\u0113\\u015F \\u014B\\u014F\\u0163 \\u010B\\u014F\\u014B\\u0163\\u0105\\u012F\\u014B \\u0105\\u014B\\u0177 \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F \\u0177\\u0113\\u0163.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.EmptyPage.Button.Add=[[[\\u0100\\u018C\\u018C \\u015C\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\nWorkPage.EditMode.Save=[[[\\u015C\\u0105\\u028B\\u0113]]]\nWorkPage.EditMode.Cancel=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Message.WidgetMoved=[[[\\u0174\\u012F\\u018C\\u011F\\u0113\\u0163 \\u0271\\u014F\\u028B\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=[[[\\u015C\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u0162\\u012F\\u0163\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Row.OverflowToolbar.RowTitleOptional=[[[\\u0114\\u014B\\u0163\\u0113\\u0157 \\u0105\\u014B \\u014F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u0105\\u013A \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u0163\\u012F\\u0163\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=[[[\\u0158\\u0113\\u0271\\u014F\\u028B\\u0113 \\u015C\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Row.DeleteDialog.Title=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Row.DeleteDialog.ConfirmText=[[[\\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u012F\\u015F \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u0105\\u014B\\u018C \\u0105\\u013A\\u013A \\u012F\\u0163\\u015F \\u010B\\u014F\\u014B\\u0163\\u0113\\u014B\\u0163?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Row.DeleteDialog.Button.Confirm=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Row.DeleteDialog.Button.Cancel=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Row.AddRowButtonTooltip=[[[\\u0100\\u018C\\u018C \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=[[[\\u012C\\u014B \\u0157\\u0171\\u014B\\u0163\\u012F\\u0271\\u0113, \\u014F\\u014B\\u013A\\u0177 \\u0163\\u0125\\u0113 \\u0192\\u012F\\u0157\\u015F\\u0163 \\u0192\\u014F\\u0171\\u0157 \\u010B\\u014F\\u013A\\u0171\\u0271\\u014B\\u015F \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u028B\\u012F\\u015F\\u012F\\u0183\\u013A\\u0113. \\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u0157\\u0113\\u018C\\u0171\\u010B\\u0113 \\u0163\\u0125\\u0113 \\u014B\\u0171\\u0271\\u0183\\u0113\\u0157 \\u014F\\u0192 \\u010B\\u014F\\u013A\\u0171\\u0271\\u014B\\u015F \\u0163\\u014F \\u0192\\u014F\\u0171\\u0157.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Row.AriaLabel=[[[\\u0174\\u014F\\u0157\\u0137\\u01A4\\u0105\\u011F\\u0113 \\u015C\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\nWorkPage.Column.AriaLabel=[[[\\u0108\\u014F\\u013A\\u0171\\u0271\\u014B {0} \\u014F\\u0192 {1}]]]\nWorkPage.Column.AddWidgetButtonText=[[[\\u0100\\u018C\\u018C \\u0174\\u012F\\u018C\\u011F\\u0113\\u0163\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Column.DeleteColumnButtonTooltip=[[[\\u0158\\u0113\\u0271\\u014F\\u028B\\u0113 \\u010B\\u014F\\u013A\\u0171\\u0271\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Column.AddColumnButtonTooltip=[[[\\u0100\\u018C\\u018C \\u010B\\u014F\\u013A\\u0171\\u0271\\u014B\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Column.EmptyIllustrationTitle=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u0192\\u014F\\u0157 \\u0100\\u03C1\\u03C1\\u015F\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Column.EmptyIllustrationDescription=[[[\\u0100\\u018C\\u018C \\u0105\\u03C1\\u03C1\\u015F \\u0163\\u014F \\u0163\\u0125\\u0113 \\u0175\\u012F\\u018C\\u011F\\u0113\\u0163, \\u014F\\u0157 \\u0157\\u0113\\u0271\\u014F\\u028B\\u0113 \\u0163\\u0125\\u0113 \\u0175\\u012F\\u018C\\u011F\\u0113\\u0163 \\u012F\\u0192 \\u0177\\u014F\\u0171 \\u018C\\u014F\\u014B'\\u0163 \\u014B\\u0113\\u0113\\u018C \\u012F\\u0163.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=[[[\\u0100\\u018C\\u018C \\u0105\\u03C1\\u03C1\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0175\\u012F\\u018C\\u011F\\u0113\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Cell.EmptyIllustrationTitle=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u0192\\u014F\\u0157 \\u0100\\u03C1\\u03C1\\u015F\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Cell.EmptyIllustrationDescription=[[[\\u0100\\u018C\\u018C \\u0105\\u03C1\\u03C1\\u015F \\u0163\\u014F \\u0163\\u0125\\u0113 \\u0175\\u012F\\u018C\\u011F\\u0113\\u0163, \\u014F\\u0157 \\u0157\\u0113\\u0271\\u014F\\u028B\\u0113 \\u0163\\u0125\\u0113 \\u0175\\u012F\\u018C\\u011F\\u0113\\u0163 \\u012F\\u0192 \\u0177\\u014F\\u0171 \\u018C\\u014F\\u014B'\\u0163 \\u014B\\u0113\\u0113\\u018C \\u012F\\u0163.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Cell.DeleteDialog.Title=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Cell.DeleteDialog.ConfirmText=[[[\\u0100\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u015F\\u0171\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u012F\\u015F \\u0175\\u012F\\u018C\\u011F\\u0113\\u0163? \\u0100\\u013A\\u013A \\u0105\\u03C1\\u03C1\\u015F \\u012F\\u014B\\u015F\\u012F\\u018C\\u0113 \\u0175\\u012F\\u013A\\u013A \\u0105\\u013A\\u015F\\u014F \\u0183\\u0113 \\u0157\\u0113\\u0271\\u014F\\u028B\\u0113\\u018C \\u0192\\u0157\\u014F\\u0271 \\u0163\\u0125\\u0113 \\u03C1\\u0105\\u011F\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Cell.DeleteDialog.Button.Confirm=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Cell.DeleteDialog.Button.Cancel=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=[[[\\u014E\\u03C1\\u0113\\u014B \\u0175\\u012F\\u018C\\u011F\\u0113\\u0163 \\u015F\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0175\\u012F\\u018C\\u011F\\u0113\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\nWorkPage.Section.AddVizInstanceButtonText=[[[\\u0100\\u018C\\u018C \\u0162\\u012F\\u013A\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n\nContentFinder.Categories.Applications.Title=[[[\\u0100\\u03C1\\u03C1\\u013A\\u012F\\u010B\\u0105\\u0163\\u012F\\u014F\\u014B\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nContentFinder.Widgets.Tiles.Title=[[[\\u0162\\u012F\\u013A\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nContentFinder.Widgets.Tiles.Description=[[[\\u01B2\\u012F\\u015F\\u0171\\u0105\\u013A \\u0157\\u0113\\u03C1\\u0157\\u0113\\u015F\\u0113\\u014B\\u0163\\u0105\\u0163\\u012F\\u014F\\u014B\\u015F \\u014F\\u0192 \\u0105\\u03C1\\u03C1\\u015F.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nContentFinder.Widgets.Cards.Title=[[[\\u0108\\u0105\\u0157\\u018C\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nContentFinder.Widgets.Cards.Description=[[[\\u01B2\\u012F\\u015F\\u0171\\u0105\\u013A \\u0157\\u0113\\u03C1\\u0157\\u0113\\u015F\\u0113\\u014B\\u0163\\u0105\\u0163\\u012F\\u014F\\u014B\\u015F \\u014F\\u0192 \\u0105\\u03C1\\u03C1\\u015F, \\u018C\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177\\u0113\\u018C \\u012F\\u014B \\u0192\\u013A\\u0113\\u03C7\\u012F\\u0183\\u013A\\u0113 \\u013A\\u0105\\u0177\\u014F\\u0171\\u0163\\u015F.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\nWorkPage.CardEditor.Save=[[[\\u015C\\u0105\\u028B\\u0113]]]\nWorkPage.CardEditor.Cancel=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.CardEditor.Title=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0113 \"{0}\"]]]\nWorkPage.CardEditor.Title.NoCardTitle=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Card.ActionDefinition.Configure=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Card.ActionDefinition.Reset=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0108\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n\nWorkPage.Host.Context.WorkZone.Label=[[[\\u015C\\u0100\\u01A4 \\u0181\\u0171\\u012F\\u013A\\u018C \\u0174\\u014F\\u0157\\u0137 \\u017B\\u014F\\u014B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=[[[\\u0108\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163 \\u016E\\u015F\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=[[[\\u012C\\u018C \\u014F\\u0192 \\u0163\\u0125\\u0113 \\u015C\\u0100\\u01A4 \\u0181\\u0171\\u012F\\u013A\\u018C \\u0174\\u014F\\u0157\\u0137 \\u017B\\u014F\\u014B\\u0113 \\u0171\\u015F\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=[[[\\u015C\\u0100\\u01A4 \\u0181\\u0171\\u012F\\u013A\\u018C \\u0174\\u014F\\u0157\\u0137 \\u017B\\u014F\\u014B\\u0113 \\u0171\\u015F\\u0113\\u0157 \\u012F\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=[[[\\u012C\\u018C \\u014F\\u0192 \\u0163\\u0125\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163 \\u0171\\u015F\\u0113\\u0157. \\u0162\\u0125\\u0113 \\u028B\\u0105\\u013A\\u0171\\u0113 \\u0175\\u012F\\u013A\\u013A \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113 \\u0183\\u0105\\u015F\\u0113\\u018C \\u014F\\u014B \\u0163\\u0125\\u0113 \\u013A\\u014F\\u011F\\u011F\\u0113\\u018C \\u014F\\u014B \\u0171\\u015F\\u0113\\u0157. \\u0162\\u014F \\u015F\\u0125\\u014F\\u0175 \\u0163\\u0125\\u0113 \\u0171\\u015F\\u0113\\u0157\\u015F \\u014B\\u0105\\u0271\\u0113, \\u0171\\u015F\\u0113 \\u0143\\u0105\\u0271\\u0113 \\u014F\\u0192 \\u0163\\u0125\\u0113 \\u015C\\u0100\\u01A4 \\u0181\\u0171\\u012F\\u013A\\u018C \\u0174\\u014F\\u0157\\u0137 \\u017B\\u014F\\u014B\\u0113 \\u0171\\u015F\\u0113\\u0157.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=[[[\\u0143\\u0105\\u0271\\u0113 \\u014F\\u0192 \\u0163\\u0125\\u0113 \\u015C\\u0100\\u01A4 \\u0181\\u0171\\u012F\\u013A\\u018C \\u0174\\u014F\\u0157\\u0137 \\u017B\\u014F\\u014B\\u0113 \\u0171\\u015F\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=[[[\\u015C\\u0100\\u01A4 \\u0181\\u0171\\u012F\\u013A\\u018C \\u0174\\u014F\\u0157\\u0137 \\u017B\\u014F\\u014B\\u0113 \\u0171\\u015F\\u0113\\u0157 \\u014B\\u0105\\u0271\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=[[[\\u0143\\u0105\\u0271\\u0113 \\u014F\\u0192 \\u0163\\u0125\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163 \\u0171\\u015F\\u0113\\u0157 \\u0175\\u012F\\u0163\\u0125 \\u0192\\u012F\\u0157\\u015F\\u0163, \\u0271\\u012F\\u018C\\u018C\\u013A\\u0113 \\u0105\\u014B\\u018C \\u013A\\u0105\\u015F\\u0163 \\u014B\\u0105\\u0271\\u0113. \\u0162\\u0125\\u0113 \\u0271\\u012F\\u018C\\u018C\\u013A\\u0113 \\u014B\\u0105\\u0271\\u0113 \\u0175\\u012F\\u013A\\u013A \\u0183\\u0113 \\u0105\\u0183\\u0183\\u0157\\u0113\\u028B\\u012F\\u0105\\u0163\\u0113\\u018C. \\u0162\\u0125\\u0113 \\u028B\\u0105\\u013A\\u0171\\u0113 \\u0175\\u012F\\u013A\\u013A \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113 \\u0183\\u0105\\u015F\\u0113\\u018C \\u014F\\u014B \\u0163\\u0125\\u0113 \\u013A\\u014F\\u011F\\u011F\\u0113\\u018C \\u014F\\u014B \\u0171\\u015F\\u0113\\u0157.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=[[[\\u0191\\u012F\\u0157\\u015F\\u0163\\u014B\\u0105\\u0271\\u0113 \\u014F\\u0192 \\u0163\\u0125\\u0113 \\u015C\\u0100\\u01A4 \\u0181\\u0171\\u012F\\u013A\\u018C \\u0174\\u014F\\u0157\\u0137 \\u017B\\u014F\\u014B\\u0113 \\u0171\\u015F\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=[[[\\u015C\\u0100\\u01A4 \\u0181\\u0171\\u012F\\u013A\\u018C \\u0174\\u014F\\u0157\\u0137 \\u017B\\u014F\\u014B\\u0113 \\u0171\\u015F\\u0113\\u0157 \\u0192\\u012F\\u0157\\u015F\\u0163\\u014B\\u0105\\u0271\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=[[[\\u0191\\u012F\\u0157\\u015F\\u0163\\u014B\\u0105\\u0271\\u0113 \\u014F\\u0192 \\u0163\\u0125\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163 \\u0171\\u015F\\u0113\\u0157. \\u0162\\u0125\\u0113 \\u028B\\u0105\\u013A\\u0171\\u0113 \\u0175\\u012F\\u013A\\u013A \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113 \\u0183\\u0105\\u015F\\u0113\\u018C \\u014F\\u014B \\u0163\\u0125\\u0113 \\u013A\\u014F\\u011F\\u011F\\u0113\\u018C \\u014F\\u014B \\u0171\\u015F\\u0113\\u0157.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=[[[\\u013B\\u0105\\u015F\\u0163\\u014B\\u0105\\u0271\\u0113 \\u014F\\u0192 \\u0163\\u0125\\u0113 \\u015C\\u0100\\u01A4 \\u0181\\u0171\\u012F\\u013A\\u018C \\u0174\\u014F\\u0157\\u0137 \\u017B\\u014F\\u014B\\u0113 \\u0171\\u015F\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=[[[\\u015C\\u0100\\u01A4 \\u0181\\u0171\\u012F\\u013A\\u018C \\u0174\\u014F\\u0157\\u0137 \\u017B\\u014F\\u014B\\u0113 \\u0171\\u015F\\u0113\\u0157 \\u013A\\u0105\\u015F\\u0163\\u014B\\u0105\\u0271\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=[[[\\u013B\\u0105\\u015F\\u0163\\u014B\\u0105\\u0271\\u0113 \\u014F\\u0192 \\u0163\\u0125\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163 \\u0171\\u015F\\u0113\\u0157. \\u0162\\u0125\\u0113 \\u028B\\u0105\\u013A\\u0171\\u0113 \\u0175\\u012F\\u013A\\u013A \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113 \\u0183\\u0105\\u015F\\u0113\\u018C \\u014F\\u014B \\u0163\\u0125\\u0113 \\u013A\\u014F\\u011F\\u011F\\u0113\\u018C \\u014F\\u014B \\u0171\\u015F\\u0113\\u0157.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=[[[\\u0114\\u0271\\u0105\\u012F\\u013A \\u0105\\u018C\\u018C\\u0157\\u0113\\u015F\\u015F \\u014F\\u0192 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163 \\u015C\\u0100\\u01A4 \\u0181\\u0171\\u012F\\u013A\\u018C \\u0174\\u014F\\u0157\\u0137 \\u017B\\u014F\\u014B\\u0113 \\u0171\\u015F\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=[[[\\u015C\\u0100\\u01A4 \\u0181\\u0171\\u012F\\u013A\\u018C \\u0174\\u014F\\u0157\\u0137 \\u017B\\u014F\\u014B\\u0113 \\u0171\\u015F\\u0113\\u0157 \\u0113\\u0271\\u0105\\u012F\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=[[[\\u0114\\u0271\\u0105\\u012F\\u013A \\u0105\\u018C\\u018C\\u0157\\u0113\\u015F\\u015F \\u014F\\u0192 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163 \\u015C\\u0100\\u01A4 \\u0181\\u0171\\u012F\\u013A\\u018C \\u0174\\u014F\\u0157\\u0137 \\u017B\\u014F\\u014B\\u0113 \\u0171\\u015F\\u0113\\u0157. \\u0162\\u0125\\u0113 \\u028B\\u0105\\u013A\\u0171\\u0113 \\u0175\\u012F\\u013A\\u013A \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113 \\u0183\\u0105\\u015F\\u0113\\u018C \\u014F\\u014B \\u0163\\u0125\\u0113 \\u013A\\u014F\\u011F\\u011F\\u0113\\u018C \\u014F\\u014B \\u0171\\u015F\\u0113\\u0157.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0108\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=[[[\\u0162\\u0125\\u012F\\u015F \\u010B\\u0105\\u0157\\u018C \\u0125\\u0105\\u015F \\u012F\\u014B\\u018C\\u012F\\u028B\\u012F\\u018C\\u0171\\u0105\\u013A \\u010B\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B\\u015F. \\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u0113\\u0271 \\u012F\\u0157\\u0157\\u0113\\u028B\\u014F\\u010B\\u0105\\u0183\\u013A\\u0177 \\u0105\\u014B\\u018C \\u0157\\u0113\\u015F\\u0113\\u0163 \\u0163\\u0125\\u0113 \\u010B\\u0105\\u0157\\u018C \\u0163\\u014F \\u012F\\u0163\\u015F \\u018C\\u0113\\u0192\\u0105\\u0171\\u013A\\u0163 \\u015F\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n",
  "sap/ushell/components/workPageBuilder/resources/resources_en_US_saprigi.properties":
    '\n\nWorkPage.EmptyPage.Title=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200D\\u200D\\u200C\\u200C\\u200D\\u200D\\u200C\\u200C\\u200C\\u200C\\u200D\\u200C\\u200C\\u200C\\u200D\\u200B\\u200C\\u200C\\u200B\\u200B\\u200C\\u200C\\u200C\\u200C\\u200D\\u200C\\u200D\\u200D\\u200C\\u200C\\u200B\\u200D\\u200D\\u200B\\u200D\\u200C\\u200B\\u200B\\u200C\\u206AEmpty Page\\u206A\\u206A\nWorkPage.EmptyPage.Message=\\u206A\\u206A\\u206A\\u200D\\u200D\\u200D\\u200D\\u200D\\u200C\\u200D\\u200D\\u200B\\u200D\\u200C\\u200C\\u200C\\u200D\\u200C\\u200B\\u200C\\u200C\\u200C\\u200C\\u200D\\u200B\\u200B\\u200D\\u200B\\u200D\\u200B\\u200C\\u200D\\u200D\\u200C\\u200D\\u200D\\u200D\\u200B\\u200C\\u200D\\u200C\\u200D\\u200B\\u206AThis page does not contain any sections yet.\\u206A\\u206A\nWorkPage.EmptyPage.Button.Add=\\u206A\\u206A\\u206A\\u200D\\u200D\\u200D\\u200D\\u200D\\u200D\\u200B\\u200D\\u200C\\u200B\\u200B\\u200C\\u200D\\u200B\\u200B\\u200B\\u200C\\u200D\\u200C\\u200D\\u200B\\u200D\\u200D\\u200D\\u200D\\u200D\\u200B\\u200B\\u200B\\u200B\\u200B\\u200C\\u200B\\u200D\\u200D\\u200C\\u200B\\u200C\\u200B\\u200D\\u206AAdd Section\\u206A\\u206A\n\nWorkPage.EditMode.Save=\\u206A\\u206A\\u206A\\u200D\\u200C\\u200C\\u200D\\u200C\\u200D\\u200B\\u200D\\u200C\\u200B\\u200B\\u200C\\u200C\\u200D\\u200D\\u200D\\u200D\\u200B\\u200C\\u200B\\u200C\\u200D\\u200D\\u200B\\u200D\\u200B\\u200B\\u200B\\u200B\\u200D\\u200D\\u200D\\u200C\\u200D\\u200B\\u200D\\u200D\\u200B\\u200C\\u200B\\u206ASave\\u206A\\u206A\nWorkPage.EditMode.Cancel=\\u206A\\u206A\\u206A\\u200C\\u200D\\u200C\\u200C\\u200C\\u200C\\u200C\\u200B\\u200C\\u200D\\u200D\\u200D\\u200B\\u200D\\u200C\\u200D\\u200C\\u200B\\u200C\\u200C\\u200D\\u200B\\u200C\\u200B\\u200C\\u200D\\u200D\\u200D\\u200B\\u200C\\u200D\\u200D\\u200D\\u200B\\u200C\\u206ACancel\\u206A\\u206A\nWorkPage.Message.WidgetMoved=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200D\\u200D\\u200B\\u200D\\u200C\\u200C\\u200D\\u200D\\u200C\\u200C\\u200D\\u200D\\u200C\\u200B\\u200C\\u200C\\u200B\\u200B\\u200B\\u200C\\u200D\\u200C\\u200B\\u200C\\u200B\\u200D\\u200B\\u200D\\u200D\\u200B\\u200B\\u200C\\u200D\\u200D\\u200B\\u200B\\u200C\\u206AWidget moved\\u206A\\u206A\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\u206A\\u206A\\u206A\\u200D\\u200C\\u200C\\u200D\\u200C\\u200B\\u200D\\u200D\\u200D\\u200C\\u200C\\u200B\\u200B\\u200B\\u200B\\u200D\\u200D\\u200C\\u200C\\u200D\\u200D\\u200B\\u200C\\u200D\\u200D\\u200D\\u200C\\u200C\\u200D\\u200B\\u200B\\u200D\\u200D\\u200B\\u200C\\u200B\\u200B\\u200B\\u200D\\u206ASection Title\\u206A\\u206A\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200B\\u200C\\u200D\\u200B\\u200B\\u200D\\u200B\\u200D\\u200D\\u200C\\u200D\\u200B\\u200C\\u200C\\u200D\\u200D\\u200C\\u200D\\u200C\\u200B\\u200C\\u200C\\u200D\\u200C\\u200B\\u200C\\u200B\\u200D\\u200B\\u200B\\u200C\\u200C\\u200B\\u200C\\u200C\\u200B\\u200D\\u200B\\u200C\\u206AEnter an optional section title\\u206A\\u206A\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200C\\u200B\\u200D\\u200D\\u200C\\u200D\\u200C\\u200C\\u200D\\u200D\\u200B\\u200D\\u200B\\u200D\\u200D\\u200D\\u200C\\u200C\\u200C\\u200B\\u200C\\u200B\\u200D\\u200D\\u200C\\u200D\\u200C\\u200B\\u200C\\u200C\\u200C\\u200D\\u200C\\u200B\\u200B\\u200D\\u206ARemove Section\\u206A\\u206A\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200B\\u200D\\u200D\\u200B\\u200D\\u200C\\u200C\\u200C\\u200B\\u200C\\u200C\\u200D\\u200C\\u200D\\u200B\\u200C\\u200C\\u200D\\u200C\\u200C\\u200D\\u200D\\u200B\\u200B\\u200B\\u200C\\u200B\\u200D\\u200B\\u200C\\u200B\\u200B\\u200C\\u200B\\u200D\\u200C\\u200C\\u200B\\u200B\\u206ADelete section\\u206A\\u206A\nWorkPage.Row.DeleteDialog.Title=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200D\\u200B\\u200C\\u200C\\u200D\\u200D\\u200C\\u200C\\u200D\\u200D\\u200D\\u200D\\u200C\\u200B\\u200D\\u200D\\u200B\\u200D\\u200B\\u200C\\u200C\\u200D\\u200C\\u200D\\u200C\\u200D\\u200C\\u200C\\u200D\\u200D\\u200D\\u200B\\u200C\\u200B\\u200C\\u200B\\u200B\\u200C\\u206ADelete\\u206A\\u206A\nWorkPage.Row.DeleteDialog.ConfirmText=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200C\\u200C\\u200C\\u200D\\u200C\\u200C\\u200D\\u200D\\u200D\\u200C\\u200D\\u200B\\u200D\\u200C\\u200D\\u200B\\u200B\\u200C\\u200B\\u200D\\u200D\\u200C\\u200C\\u200D\\u200C\\u200B\\u200C\\u200D\\u200B\\u200B\\u200D\\u200D\\u200D\\u200C\\u200C\\u200C\\u200B\\u200D\\u200D\\u206ADo you want to delete this section and all its content?\\u206A\\u206A\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200D\\u200C\\u200B\\u200B\\u200B\\u200B\\u200C\\u200B\\u200D\\u200D\\u200C\\u200C\\u200B\\u200B\\u200D\\u200D\\u200C\\u200D\\u200C\\u200C\\u200B\\u200C\\u200C\\u200C\\u200C\\u200B\\u200C\\u200B\\u200D\\u200C\\u200B\\u200B\\u200B\\u200C\\u200D\\u200B\\u200C\\u200C\\u200D\\u206ADelete\\u206A\\u206A\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200D\\u200C\\u200C\\u200C\\u200D\\u200C\\u200B\\u200B\\u200C\\u200C\\u200B\\u200D\\u200C\\u200B\\u200D\\u200D\\u200D\\u200B\\u200B\\u200B\\u200B\\u200C\\u200D\\u200C\\u200B\\u200D\\u200D\\u200C\\u200D\\u200C\\u200B\\u200B\\u200D\\u200D\\u200C\\u200D\\u200D\\u200D\\u200C\\u206ACancel\\u206A\\u206A\nWorkPage.Row.AddRowButtonTooltip=\\u206A\\u206A\\u206A\\u200D\\u200B\\u200B\\u200D\\u200D\\u200C\\u200B\\u200B\\u200C\\u200D\\u200B\\u200C\\u200B\\u200C\\u200D\\u200D\\u200C\\u200B\\u200D\\u200B\\u200C\\u200C\\u200C\\u200B\\u200D\\u200B\\u200C\\u200D\\u200D\\u200C\\u200C\\u200C\\u200B\\u200B\\u200D\\u200C\\u200D\\u200B\\u200D\\u200C\\u206AAdd section\\u206A\\u206A\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200B\\u200C\\u200B\\u200C\\u200C\\u200D\\u200D\\u200D\\u200B\\u200B\\u200D\\u200C\\u200C\\u200D\\u200C\\u200D\\u200C\\u200B\\u200D\\u200B\\u200B\\u200D\\u200C\\u200C\\u200D\\u200D\\u200D\\u200C\\u200B\\u200B\\u200B\\u200C\\u200D\\u200C\\u200B\\u200D\\u200B\\u200D\\u200C\\u206AIn runtime, only the first four columns will be visible. Please reduce the number of columns to four.\\u206A\\u206A\nWorkPage.Row.AriaLabel=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200B\\u200B\\u200B\\u200D\\u200C\\u200C\\u200D\\u200B\\u200B\\u200B\\u200D\\u200D\\u200C\\u200B\\u200C\\u200C\\u200B\\u200B\\u200C\\u200C\\u200B\\u200D\\u200D\\u200B\\u200C\\u200D\\u200B\\u200B\\u200C\\u200C\\u200B\\u200D\\u200D\\u200D\\u200B\\u200B\\u200C\\u200D\\u206AWorkPage Sections\\u206A\\u206A\n\nWorkPage.Column.AriaLabel=\\u206A\\u206A\\u206A\\u200D\\u200B\\u200D\\u200D\\u200B\\u200B\\u200D\\u200B\\u200C\\u200B\\u200D\\u200B\\u200B\\u200D\\u200D\\u200D\\u200C\\u200B\\u200B\\u200B\\u200B\\u200B\\u200C\\u200B\\u200B\\u200B\\u200D\\u200C\\u200D\\u200D\\u200C\\u200B\\u200B\\u200B\\u200B\\u200B\\u200D\\u200B\\u200B\\u200D\\u206AColumn \\u200B\\u200B\\u200B{0}\\u200C\\u200C\\u200C of \\u200B\\u200B\\u200B{1}\\u200C\\u200C\\u200C\\u206A\\u206A\nWorkPage.Column.AddWidgetButtonText=\\u206A\\u206A\\u206A\\u200D\\u200C\\u200D\\u200D\\u200D\\u200B\\u200C\\u200B\\u200B\\u200C\\u200D\\u200B\\u200C\\u200D\\u200C\\u200C\\u200D\\u200C\\u200C\\u200B\\u200C\\u200C\\u200C\\u200D\\u200D\\u200B\\u200B\\u200D\\u200C\\u200C\\u200B\\u200D\\u200B\\u200C\\u200D\\u200D\\u200B\\u200C\\u200D\\u200D\\u206AAdd Widget\\u206A\\u206A\nWorkPage.Column.DeleteColumnButtonTooltip=\\u206A\\u206A\\u206A\\u200D\\u200D\\u200C\\u200B\\u200C\\u200C\\u200B\\u200B\\u200D\\u200B\\u200B\\u200B\\u200C\\u200D\\u200C\\u200D\\u200B\\u200D\\u200D\\u200B\\u200C\\u200B\\u200B\\u200B\\u200D\\u200B\\u200C\\u200C\\u200C\\u200B\\u200C\\u200C\\u200B\\u200B\\u200C\\u200C\\u200D\\u200D\\u200C\\u206ARemove column\\u206A\\u206A\nWorkPage.Column.AddColumnButtonTooltip=\\u206A\\u206A\\u206A\\u200D\\u200B\\u200C\\u200B\\u200D\\u200C\\u200C\\u200B\\u200B\\u200B\\u200B\\u200D\\u200B\\u200C\\u200D\\u200D\\u200B\\u200D\\u200B\\u200D\\u200D\\u200C\\u200C\\u200B\\u200C\\u200B\\u200D\\u200C\\u200C\\u200D\\u200D\\u200C\\u200D\\u200C\\u200C\\u200C\\u200B\\u200D\\u200D\\u200D\\u206AAdd column\\u206A\\u206A\nWorkPage.Column.EmptyIllustrationTitle=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200C\\u200D\\u200D\\u200B\\u200D\\u200B\\u200C\\u200D\\u200B\\u200D\\u200D\\u200B\\u200B\\u200B\\u200C\\u200B\\u200B\\u200C\\u200C\\u200C\\u200C\\u200C\\u200D\\u200C\\u200D\\u200D\\u200C\\u200C\\u200D\\u200C\\u200C\\u200D\\u200B\\u200D\\u200B\\u200B\\u200D\\u200D\\u200B\\u206ASearch for Apps\\u206A\\u206A\nWorkPage.Column.EmptyIllustrationDescription=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200C\\u200C\\u200C\\u200B\\u200B\\u200D\\u200B\\u200D\\u200B\\u200D\\u200D\\u200D\\u200D\\u200D\\u200C\\u200C\\u200B\\u200B\\u200D\\u200D\\u200B\\u200D\\u200B\\u200D\\u200C\\u200B\\u200C\\u200B\\u200C\\u200D\\u200B\\u200D\\u200B\\u200C\\u200B\\u200D\\u200C\\u200C\\u206AAdd apps to the widget, or remove the widget if you dont need it.\\u206A\\u206A\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\u206A\\u206A\\u206A\\u200C\\u200D\\u200C\\u200D\\u200C\\u200C\\u200D\\u200D\\u200B\\u200C\\u200D\\u200B\\u200D\\u200B\\u200C\\u200C\\u200C\\u200D\\u200C\\u200D\\u200C\\u200C\\u200B\\u200C\\u200C\\u200B\\u200B\\u200C\\u200C\\u200B\\u200D\\u200B\\u200D\\u200C\\u200D\\u200D\\u200D\\u200D\\u200C\\u200C\\u206AAdd app\\u206A\\u206A\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200B\\u200B\\u200D\\u200C\\u200C\\u200C\\u200B\\u200B\\u200B\\u200B\\u200B\\u200D\\u200C\\u200D\\u200B\\u200D\\u200C\\u200D\\u200B\\u200D\\u200B\\u200D\\u200B\\u200C\\u200C\\u200D\\u200D\\u200B\\u200C\\u200B\\u200D\\u200D\\u200C\\u200B\\u200B\\u200C\\u200C\\u200C\\u200B\\u206ADelete widget\\u206A\\u206A\nWorkPage.Cell.EmptyIllustrationTitle=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200B\\u200B\\u200B\\u200B\\u200D\\u200D\\u200D\\u200C\\u200C\\u200B\\u200D\\u200D\\u200C\\u200C\\u200C\\u200C\\u200B\\u200B\\u200D\\u200D\\u200B\\u200D\\u200B\\u200B\\u200D\\u200D\\u200D\\u200C\\u200B\\u200C\\u200D\\u200D\\u200B\\u200D\\u200B\\u200C\\u200D\\u200D\\u200C\\u206ASearch for Apps\\u206A\\u206A\nWorkPage.Cell.EmptyIllustrationDescription=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200D\\u200C\\u200C\\u200D\\u200C\\u200B\\u200D\\u200B\\u200C\\u200C\\u200D\\u200B\\u200B\\u200D\\u200C\\u200C\\u200B\\u200C\\u200B\\u200D\\u200C\\u200C\\u200B\\u200D\\u200D\\u200C\\u200C\\u200C\\u200C\\u200D\\u200B\\u200D\\u200B\\u200B\\u200C\\u200B\\u200D\\u200B\\u206AAdd apps to the widget, or remove the widget if you dont need it.\\u206A\\u206A\nWorkPage.Cell.DeleteDialog.Title=\\u206A\\u206A\\u206A\\u200C\\u200D\\u200D\\u200D\\u200B\\u200D\\u200D\\u200B\\u200C\\u200C\\u200C\\u200D\\u200C\\u200D\\u200B\\u200C\\u200C\\u200B\\u200C\\u200C\\u200D\\u200C\\u200D\\u200D\\u200D\\u200D\\u200C\\u200D\\u200D\\u200C\\u200D\\u200D\\u200D\\u200C\\u200D\\u200B\\u200B\\u200B\\u200C\\u200D\\u206ADelete\\u206A\\u206A\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200D\\u200B\\u200D\\u200C\\u200D\\u200B\\u200B\\u200C\\u200D\\u200D\\u200C\\u200C\\u200C\\u200B\\u200C\\u200B\\u200C\\u200D\\u200B\\u200C\\u200D\\u200B\\u200B\\u200C\\u200B\\u200C\\u200D\\u200B\\u200C\\u200D\\u200B\\u200B\\u200B\\u200C\\u200D\\u200C\\u200D\\u206AAre you sure you want to delete this widget? All apps inside will also be removed from the page.\\u206A\\u206A\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u206A\\u206A\\u206A\\u200C\\u200D\\u200C\\u200B\\u200B\\u200D\\u200C\\u200D\\u200D\\u200B\\u200D\\u200D\\u200B\\u200C\\u200D\\u200B\\u200C\\u200B\\u200D\\u200C\\u200B\\u200B\\u200D\\u200C\\u200C\\u200B\\u200C\\u200C\\u200D\\u200C\\u200C\\u200C\\u200B\\u200B\\u200D\\u200D\\u200B\\u200D\\u206ADelete\\u206A\\u206A\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200B\\u200C\\u200D\\u200B\\u200B\\u200D\\u200B\\u200D\\u200B\\u200C\\u200C\\u200D\\u200B\\u200D\\u200B\\u200B\\u200C\\u200C\\u200D\\u200B\\u200D\\u200D\\u200B\\u200C\\u200D\\u200C\\u200C\\u200C\\u200D\\u200D\\u200B\\u200B\\u200D\\u200C\\u200D\\u200D\\u200D\\u200C\\u206ACancel\\u206A\\u206A\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200D\\u200B\\u200B\\u200D\\u200B\\u200C\\u200C\\u200B\\u200B\\u200C\\u200B\\u200B\\u200D\\u200C\\u200B\\u200B\\u200D\\u200D\\u200C\\u200D\\u200B\\u200D\\u200C\\u200C\\u200C\\u200C\\u200C\\u200C\\u200B\\u200C\\u200C\\u200C\\u200B\\u200D\\u200C\\u200D\\u200B\\u200B\\u206AOpen widget settings\\u206A\\u206A\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200D\\u200C\\u200B\\u200C\\u200B\\u200B\\u200D\\u200B\\u200D\\u200C\\u200D\\u200C\\u200B\\u200B\\u200D\\u200D\\u200B\\u200C\\u200B\\u200B\\u200D\\u200B\\u200D\\u200B\\u200D\\u200B\\u200C\\u200D\\u200B\\u200B\\u200C\\u200D\\u200D\\u200C\\u200C\\u200B\\u200D\\u200C\\u200B\\u206ADelete widget\\u206A\\u206A\n\nWorkPage.Section.AddVizInstanceButtonText=\\u206A\\u206A\\u206A\\u200D\\u200C\\u200D\\u200C\\u200B\\u200D\\u200B\\u200D\\u200D\\u200B\\u200B\\u200C\\u200C\\u200C\\u200B\\u200C\\u200C\\u200D\\u200B\\u200D\\u200B\\u200D\\u200B\\u200D\\u200C\\u200C\\u200B\\u200D\\u200C\\u200B\\u200B\\u200B\\u200C\\u200B\\u200B\\u200D\\u200B\\u200B\\u200C\\u200C\\u206AAdd Tiles\\u206A\\u206A\n\n\nContentFinder.Categories.Applications.Title=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200C\\u200C\\u200B\\u200B\\u200C\\u200B\\u200D\\u200C\\u200D\\u200D\\u200C\\u200D\\u200B\\u200C\\u200D\\u200B\\u200C\\u200D\\u200D\\u200B\\u200D\\u200B\\u200C\\u200B\\u200C\\u200B\\u200B\\u200D\\u200B\\u200B\\u200B\\u200B\\u200D\\u200B\\u200B\\u200D\\u200C\\u200B\\u200B\\u206AApplications\\u206A\\u206A\nContentFinder.Widgets.Tiles.Title=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200C\\u200B\\u200B\\u200D\\u200B\\u200B\\u200B\\u200D\\u200B\\u200B\\u200D\\u200B\\u200C\\u200D\\u200C\\u200D\\u200B\\u200D\\u200D\\u200D\\u200C\\u200C\\u200B\\u200D\\u200D\\u200D\\u200B\\u200B\\u200D\\u200B\\u200D\\u200B\\u200B\\u200B\\u200C\\u200B\\u200B\\u206ATiles\\u206A\\u206A\nContentFinder.Widgets.Tiles.Description=\\u206A\\u206A\\u206A\\u200C\\u200D\\u200B\\u200C\\u200C\\u200D\\u200D\\u200B\\u200B\\u200D\\u200B\\u200D\\u200C\\u200D\\u200C\\u200B\\u200B\\u200B\\u200C\\u200B\\u200B\\u200D\\u200C\\u200D\\u200D\\u200B\\u200B\\u200B\\u200B\\u200D\\u200B\\u200B\\u200D\\u200B\\u200B\\u200B\\u200C\\u200C\\u200D\\u200C\\u206AVisual representations of apps.\\u206A\\u206A\nContentFinder.Widgets.Cards.Title=\\u206A\\u206A\\u206A\\u200D\\u200C\\u200D\\u200B\\u200D\\u200C\\u200B\\u200C\\u200C\\u200D\\u200D\\u200D\\u200C\\u200C\\u200D\\u200C\\u200C\\u200D\\u200D\\u200C\\u200D\\u200D\\u200C\\u200D\\u200C\\u200B\\u200D\\u200C\\u200B\\u200D\\u200C\\u200D\\u200D\\u200B\\u200B\\u200B\\u200B\\u200D\\u200D\\u200D\\u206ACards\\u206A\\u206A\nContentFinder.Widgets.Cards.Description=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200B\\u200C\\u200B\\u200C\\u200B\\u200C\\u200D\\u200C\\u200D\\u200C\\u200B\\u200D\\u200C\\u200D\\u200B\\u200C\\u200C\\u200D\\u200C\\u200B\\u200D\\u200B\\u200C\\u200D\\u200D\\u200B\\u200C\\u200D\\u200B\\u200D\\u200C\\u200C\\u200B\\u200B\\u200B\\u200B\\u200C\\u200C\\u200B\\u206AVisual representations of apps, displayed in flexible layouts.\\u206A\\u206A\n\nWorkPage.CardEditor.Save=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200C\\u200C\\u200D\\u200C\\u200C\\u200C\\u200B\\u200D\\u200B\\u200D\\u200C\\u200C\\u200C\\u200D\\u200B\\u200C\\u200B\\u200B\\u200B\\u200C\\u200B\\u200C\\u200B\\u200C\\u200C\\u200D\\u200D\\u200B\\u200C\\u200C\\u200B\\u200B\\u200B\\u200D\\u200C\\u200D\\u200B\\u200C\\u200D\\u206ASave\\u206A\\u206A\nWorkPage.CardEditor.Cancel=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200D\\u200B\\u200C\\u200B\\u200B\\u200B\\u200B\\u200C\\u200B\\u200B\\u200B\\u200B\\u200C\\u200D\\u200D\\u200B\\u200B\\u200B\\u200D\\u200D\\u200D\\u200D\\u200D\\u200B\\u200D\\u200C\\u200B\\u200C\\u200D\\u200C\\u200D\\u200B\\u200B\\u200B\\u200C\\u200B\\u200C\\u200C\\u206ACancel\\u206A\\u206A\nWorkPage.CardEditor.Title=\\u206A\\u206A\\u206A\\u200D\\u200C\\u200B\\u200C\\u200D\\u200B\\u200C\\u200C\\u200B\\u200B\\u200D\\u200C\\u200C\\u200B\\u200B\\u200B\\u200C\\u200D\\u200B\\u200C\\u200C\\u200C\\u200D\\u200D\\u200C\\u200B\\u200C\\u200B\\u200D\\u200D\\u200B\\u200C\\u200C\\u200C\\u200C\\u200D\\u200B\\u200D\\u200B\\u206AConfigure "\\u200B\\u200B\\u200B{0}\\u200C\\u200C\\u200C"\\u206A\\u206A\nWorkPage.CardEditor.Title.NoCardTitle=\\u206A\\u206A\\u206A\\u200D\\u200C\\u200D\\u200B\\u200B\\u200C\\u200D\\u200C\\u200D\\u200D\\u200D\\u200B\\u200B\\u200B\\u200C\\u200B\\u200B\\u200C\\u200C\\u200B\\u200B\\u200B\\u200D\\u200C\\u200D\\u200D\\u200C\\u200C\\u200B\\u200B\\u200B\\u200C\\u200C\\u200C\\u200B\\u200B\\u206AConfigure\\u206A\\u206A\nWorkPage.Card.ActionDefinition.Configure=\\u206A\\u206A\\u206A\\u200C\\u200D\\u200B\\u200C\\u200C\\u200B\\u200B\\u200C\\u200D\\u200B\\u200B\\u200B\\u200C\\u200B\\u200B\\u200C\\u200D\\u200B\\u200C\\u200B\\u200C\\u200D\\u200B\\u200D\\u200D\\u200D\\u200B\\u200B\\u200D\\u200D\\u200C\\u200B\\u200B\\u200B\\u200C\\u200B\\u200C\\u200B\\u200C\\u200D\\u206AConfigure\\u206A\\u206A\nWorkPage.Card.ActionDefinition.Reset=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200B\\u200B\\u200B\\u200D\\u200D\\u200B\\u200D\\u200B\\u200C\\u200C\\u200D\\u200D\\u200D\\u200D\\u200C\\u200B\\u200C\\u200C\\u200C\\u200C\\u200D\\u200C\\u200C\\u200C\\u200D\\u200C\\u200D\\u200B\\u200B\\u200C\\u200B\\u200D\\u200C\\u200D\\u200C\\u200D\\u200D\\u200D\\u200D\\u206ADelete Configuration\\u206A\\u206A\n\nWorkPage.Host.Context.WorkZone.Label=\\u206A\\u206A\\u206A\\u200C\\u200D\\u200C\\u200C\\u200D\\u200D\\u200C\\u200D\\u200D\\u200B\\u200C\\u200D\\u200C\\u200B\\u200D\\u200B\\u200C\\u200D\\u200D\\u200C\\u200B\\u200B\\u200C\\u200D\\u200C\\u200D\\u200C\\u200B\\u200B\\u200D\\u200D\\u200D\\u200C\\u200D\\u200B\\u200D\\u200B\\u200D\\u200B\\u200D\\u206ASAP Build Work Zone\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200B\\u200C\\u200B\\u200B\\u200B\\u200D\\u200D\\u200B\\u200D\\u200B\\u200D\\u200C\\u200B\\u200C\\u200C\\u200D\\u200C\\u200B\\u200D\\u200C\\u200D\\u200C\\u200B\\u200C\\u200D\\u200B\\u200B\\u200B\\u200B\\u200C\\u200C\\u200D\\u200B\\u200C\\u200D\\u200D\\u200B\\u200C\\u200B\\u206ACurrent User\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200C\\u200C\\u200D\\u200D\\u200D\\u200C\\u200D\\u200C\\u200C\\u200D\\u200B\\u200D\\u200B\\u200B\\u200D\\u200C\\u200D\\u200B\\u200D\\u200C\\u200C\\u200B\\u200D\\u200D\\u200D\\u200D\\u200C\\u200C\\u200B\\u200D\\u200D\\u200B\\u200C\\u200C\\u200D\\u200C\\u200C\\u206AId of the SAP Build Work Zone user\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200B\\u200C\\u200C\\u200C\\u200C\\u200C\\u200D\\u200C\\u200B\\u200C\\u200B\\u200C\\u200C\\u200B\\u200D\\u200C\\u200B\\u200C\\u200B\\u200C\\u200B\\u200B\\u200B\\u200D\\u200D\\u200B\\u200B\\u200D\\u200C\\u200C\\u200C\\u200C\\u200D\\u200D\\u200B\\u200C\\u200B\\u200C\\u200D\\u206ASAP Build Work Zone user id\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=\\u206A\\u206A\\u206A\\u200D\\u200C\\u200B\\u200D\\u200B\\u200D\\u200C\\u200C\\u200C\\u200C\\u200B\\u200D\\u200B\\u200D\\u200B\\u200D\\u200D\\u200D\\u200D\\u200D\\u200C\\u200D\\u200B\\u200D\\u200B\\u200D\\u200C\\u200D\\u200B\\u200C\\u200B\\u200C\\u200D\\u200B\\u200B\\u200C\\u200C\\u200D\\u200C\\u200D\\u206AId of the current user. The value will change based on the logged on user. To show the users name, use Name of the SAP Build Work Zone user.\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200C\\u200B\\u200D\\u200D\\u200D\\u200C\\u200D\\u200B\\u200B\\u200B\\u200D\\u200B\\u200B\\u200D\\u200D\\u200D\\u200B\\u200D\\u200B\\u200B\\u200D\\u200D\\u200B\\u200D\\u200D\\u200C\\u200B\\u200B\\u200D\\u200C\\u200D\\u200D\\u200B\\u200C\\u200D\\u200C\\u200D\\u200C\\u200C\\u206AName of the SAP Build Work Zone user\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200B\\u200D\\u200D\\u200B\\u200D\\u200C\\u200C\\u200C\\u200C\\u200B\\u200B\\u200B\\u200B\\u200C\\u200B\\u200C\\u200C\\u200D\\u200D\\u200C\\u200D\\u200C\\u200B\\u200C\\u200D\\u200D\\u200D\\u200B\\u200C\\u200C\\u200B\\u200C\\u200D\\u200B\\u200B\\u200B\\u200C\\u200C\\u206ASAP Build Work Zone user name\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\u206A\\u206A\\u206A\\u200D\\u200C\\u200C\\u200B\\u200D\\u200B\\u200B\\u200B\\u200D\\u200C\\u200C\\u200C\\u200C\\u200D\\u200B\\u200C\\u200B\\u200B\\u200D\\u200B\\u200D\\u200C\\u200B\\u200D\\u200B\\u200B\\u200D\\u200B\\u200D\\u200D\\u200C\\u200B\\u200B\\u200D\\u200D\\u200B\\u200C\\u200B\\u200D\\u200C\\u206AName of the current user with first, middle and last name. The middle name will be abbreviated. The value will change based on the logged on user.\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200C\\u200B\\u200D\\u200D\\u200C\\u200B\\u200C\\u200D\\u200D\\u200D\\u200B\\u200D\\u200D\\u200C\\u200D\\u200C\\u200B\\u200D\\u200B\\u200C\\u200C\\u200B\\u200B\\u200D\\u200D\\u200C\\u200D\\u200C\\u200B\\u200C\\u200C\\u200C\\u200D\\u200D\\u200B\\u200B\\u200C\\u200B\\u206AFirstname of the SAP Build Work Zone user\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=\\u206A\\u206A\\u206A\\u200C\\u200B\\u200D\\u200C\\u200C\\u200B\\u200C\\u200B\\u200B\\u200B\\u200D\\u200C\\u200C\\u200D\\u200C\\u200C\\u200C\\u200D\\u200D\\u200D\\u200C\\u200C\\u200B\\u200D\\u200C\\u200D\\u200D\\u200D\\u200D\\u200C\\u200C\\u200D\\u200D\\u200D\\u200C\\u200C\\u200B\\u200B\\u200B\\u200B\\u200D\\u206ASAP Build Work Zone user firstname\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200B\\u200B\\u200C\\u200D\\u200C\\u200B\\u200D\\u200C\\u200D\\u200C\\u200C\\u200C\\u200D\\u200B\\u200B\\u200D\\u200C\\u200B\\u200B\\u200B\\u200D\\u200B\\u200C\\u200C\\u200C\\u200B\\u200C\\u200D\\u200C\\u200C\\u200D\\u200C\\u200C\\u200C\\u200B\\u200D\\u200D\\u200B\\u200B\\u206AFirstname of the current user. The value will change based on the logged on user.\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=\\u206A\\u206A\\u206A\\u200D\\u200D\\u200C\\u200D\\u200D\\u200D\\u200B\\u200C\\u200D\\u200B\\u200B\\u200D\\u200B\\u200D\\u200D\\u200D\\u200B\\u200C\\u200C\\u200D\\u200B\\u200B\\u200D\\u200D\\u200B\\u200B\\u200C\\u200B\\u200C\\u200B\\u200D\\u200B\\u200D\\u200D\\u200C\\u200D\\u200D\\u200C\\u206ALastname of the SAP Build Work Zone user\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=\\u206A\\u206A\\u206A\\u200D\\u200D\\u200B\\u200B\\u200C\\u200C\\u200D\\u200C\\u200C\\u200D\\u200B\\u200D\\u200B\\u200B\\u200B\\u200B\\u200B\\u200C\\u200C\\u200D\\u200B\\u200D\\u200B\\u200B\\u200D\\u200C\\u200D\\u200B\\u200D\\u200D\\u200D\\u200C\\u200D\\u200D\\u200D\\u200B\\u200D\\u200C\\u200C\\u206ASAP Build Work Zone user lastname\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\u206A\\u206A\\u206A\\u200C\\u200D\\u200C\\u200C\\u200C\\u200D\\u200C\\u200B\\u200D\\u200D\\u200D\\u200D\\u200D\\u200D\\u200C\\u200D\\u200D\\u200B\\u200C\\u200D\\u200C\\u200C\\u200B\\u200D\\u200D\\u200B\\u200B\\u200B\\u200C\\u200D\\u200B\\u200D\\u200D\\u200C\\u200C\\u200C\\u200C\\u200C\\u200B\\u206ALastname of the current user. The value will change based on the logged on user.\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200C\\u200B\\u200B\\u200D\\u200D\\u200B\\u200B\\u200C\\u200C\\u200B\\u200B\\u200B\\u200C\\u200D\\u200C\\u200D\\u200C\\u200C\\u200C\\u200D\\u200D\\u200B\\u200D\\u200C\\u200C\\u200D\\u200D\\u200B\\u200C\\u200B\\u200D\\u200B\\u200B\\u200B\\u200B\\u200D\\u200C\\u200D\\u200D\\u206AEmail address of current SAP Build Work Zone user\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=\\u206A\\u206A\\u206A\\u200D\\u200B\\u200D\\u200D\\u200C\\u200B\\u200D\\u200D\\u200C\\u200D\\u200B\\u200D\\u200C\\u200D\\u200B\\u200C\\u200B\\u200C\\u200D\\u200C\\u200B\\u200B\\u200D\\u200B\\u200C\\u200D\\u200C\\u200B\\u200D\\u200B\\u200B\\u200B\\u200D\\u200D\\u200B\\u200D\\u200B\\u200B\\u200B\\u200D\\u206ASAP Build Work Zone user email\\u206A\\u206A\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u206A\\u206A\\u206A\\u200C\\u200D\\u200B\\u200B\\u200B\\u200C\\u200B\\u200B\\u200B\\u200D\\u200D\\u200C\\u200D\\u200B\\u200C\\u200C\\u200B\\u200D\\u200D\\u200B\\u200C\\u200B\\u200B\\u200C\\u200D\\u200B\\u200C\\u200D\\u200B\\u200D\\u200D\\u200C\\u200C\\u200C\\u200B\\u200C\\u200D\\u200C\\u200C\\u200B\\u206AEmail address of current SAP Build Work Zone user. The value will change based on the logged on user.\\u206A\\u206A\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u206A\\u206A\\u206A\\u200D\\u200C\\u200D\\u200D\\u200C\\u200C\\u200B\\u200D\\u200B\\u200B\\u200C\\u200C\\u200C\\u200C\\u200B\\u200C\\u200C\\u200C\\u200D\\u200C\\u200B\\u200D\\u200B\\u200B\\u200C\\u200D\\u200D\\u200C\\u200C\\u200D\\u200C\\u200C\\u200B\\u200D\\u200D\\u200D\\u200C\\u200C\\u200C\\u200D\\u206ADelete Configuration\\u206A\\u206A\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u206A\\u206A\\u206A\\u200C\\u200C\\u200D\\u200D\\u200C\\u200B\\u200C\\u200C\\u200C\\u200B\\u200C\\u200B\\u200B\\u200D\\u200B\\u200B\\u200B\\u200D\\u200B\\u200B\\u200C\\u200C\\u200C\\u200B\\u200C\\u200C\\u200D\\u200D\\u200C\\u200B\\u200C\\u200C\\u200B\\u200C\\u200D\\u200C\\u200D\\u200D\\u200B\\u206AThis card has individual configurations. Do you want to delete them irrevocably and reset the card to its default settings?\\u206A\\u206A\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u206A\\u206A\\u206A\\u200D\\u200B\\u200D\\u200B\\u200B\\u200D\\u200C\\u200D\\u200D\\u200D\\u200D\\u200C\\u200D\\u200D\\u200D\\u200B\\u200B\\u200B\\u200D\\u200C\\u200B\\u200C\\u200C\\u200B\\u200D\\u200B\\u200B\\u200C\\u200C\\u200D\\u200B\\u200C\\u200B\\u200C\\u200C\\u200B\\u200B\\u200B\\u200C\\u200C\\u206ADelete\\u206A\\u206A\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u206A\\u206A\\u206A\\u200C\\u200D\\u200D\\u200D\\u200D\\u200D\\u200D\\u200B\\u200D\\u200C\\u200C\\u200D\\u200B\\u200B\\u200D\\u200D\\u200C\\u200C\\u200C\\u200B\\u200B\\u200C\\u200C\\u200B\\u200B\\u200D\\u200C\\u200D\\u200C\\u200B\\u200B\\u200B\\u200D\\u200D\\u200C\\u200B\\u200B\\u200D\\u200D\\u200B\\u206ACancel\\u206A\\u206A\n',
  "sap/ushell/components/workPageBuilder/resources/resources_en_US_saptrc.properties":
    "\n\nWorkPage.EmptyPage.Title=9yFvyCG+y7N+MGRwrbZVSg_Empty Page\nWorkPage.EmptyPage.Message=M7gmGV2XJ/Y7zm5kE+tRHQ_This page does not contain any sections yet.\nWorkPage.EmptyPage.Button.Add=dz+unShHJBMoAqnOH40CyA_Add Section\n\nWorkPage.EditMode.Save=IQvHayU0mAPQ0KRJK4f1JA_Save\nWorkPage.EditMode.Cancel=Kt6+MVfOuNssj2bODKtlAA_Cancel\nWorkPage.Message.WidgetMoved=kRKiFxUpymabjnSAKCpS7g_Widget moved\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=vRt1j4Ep7l/e9h7jRdUwtQ_Section Title\nWorkPage.Row.OverflowToolbar.RowTitleOptional=ythTOVS3YkmNRG2t4S9qnw_Enter an optional section title\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=NPX1cg4EDVxVx1itN+RqjQ_Remove Section\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=FZZjaKEx12FyDm8OwvGVEA_Delete section\nWorkPage.Row.DeleteDialog.Title=3H6y6KRjryUCLE87fvtLEA_Delete\nWorkPage.Row.DeleteDialog.ConfirmText=ojgTi7IJSv6JbSRxmccMLw_Do you want to delete this section and all its content?\nWorkPage.Row.DeleteDialog.Button.Confirm=2AIhh0qoSaZQLE/ymp8JkQ_Delete\nWorkPage.Row.DeleteDialog.Button.Cancel=6mnRU9KyiTo+EUQIWFncaw_Cancel\nWorkPage.Row.AddRowButtonTooltip=CY6HhAqNYGJcEY2kduldiA_Add section\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=8REFfkcPv5o8GnQyUeJM3w_In runtime, only the first four columns will be visible. Please reduce the number of columns to four.\nWorkPage.Row.AriaLabel=XKE2RGj+vOjnXR5OJaBw6g_WorkPage Sections\n\nWorkPage.Column.AriaLabel=dibTNtmS0fjqkLYavkIFmg_Column {0} of {1}\nWorkPage.Column.AddWidgetButtonText=0FzohKlCvhoB7t5pZ7X2+Q_Add Widget\nWorkPage.Column.DeleteColumnButtonTooltip=jDW7wNdsw3+s7uKnoXtSsg_Remove column\nWorkPage.Column.AddColumnButtonTooltip=rBzOelxuOB585GUO8c5/+g_Add column\nWorkPage.Column.EmptyIllustrationTitle=eZE7Ey54qhXqX42LeUX8cw_Search for Apps\nWorkPage.Column.EmptyIllustrationDescription=MnGumFRXE2ru8j8pGAtG6A_Add apps to the widget, or remove the widget if you don't need it.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=agOgzvBGQACt80UHq6AnOQ_Add app\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=oG5ssvobyrMGJxVlnWi6PA_Delete widget\nWorkPage.Cell.EmptyIllustrationTitle=Nu8Dk6iSSdHylGL5Co2elA_Search for Apps\nWorkPage.Cell.EmptyIllustrationDescription=blLyGd0T7kx+63+6Pz0F2A_Add apps to the widget, or remove the widget if you don't need it.\nWorkPage.Cell.DeleteDialog.Title=jvGQfgatz7YaBWHF5CRFUA_Delete\nWorkPage.Cell.DeleteDialog.ConfirmText=/p+gby5ILyyfkqs3cC6sdA_Are you sure you want to delete this widget? All apps inside will also be removed from the page.\nWorkPage.Cell.DeleteDialog.Button.Confirm=k2YKlX2k2K9FaRSeCvrhWw_Delete\nWorkPage.Cell.DeleteDialog.Button.Cancel=EM/ntXPG32yzgQNdyKgaww_Cancel\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=rZTYGkgK5hwsAp6RTVjMhg_Open widget settings\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=zw112vzQAPakHLHf5NjLUQ_Delete widget\n\nWorkPage.Section.AddVizInstanceButtonText=AZDTwTnV7MtOT6y/uv05Fg_Add Tiles\n\n\nContentFinder.Categories.Applications.Title=7BoeFFUzvhbK3u/RJ5bhmw_Applications\nContentFinder.Widgets.Tiles.Title=Nt5dLjd5TaJEGu1+MT7AyQ_Tiles\nContentFinder.Widgets.Tiles.Description=SFNlXJf/EaeUkp7J2Brmdw_Visual representations of apps.\nContentFinder.Widgets.Cards.Title=OkJePRelr4vzIQi8yaY5yg_Cards\nContentFinder.Widgets.Cards.Description=F86u1Ta0ouTI9MqUyMnhQg_Visual representations of apps, displayed in flexible layouts.\n\nWorkPage.CardEditor.Save=HMFdkUpl+BOf9MSCaF5/gA_Save\nWorkPage.CardEditor.Cancel=cArLRtH/YmUg1Ze3ssa0iw_Cancel\nWorkPage.CardEditor.Title=kZETEcpFLTeZvV0iiqM6uQ_Configure \"{0}\"\nWorkPage.CardEditor.Title.NoCardTitle=diy36I5e4kfpTZWuSWS5tA_Configure\nWorkPage.Card.ActionDefinition.Configure=SUxBaRoY7TEIioiXhGO8+A_Configure\nWorkPage.Card.ActionDefinition.Reset=khGs7TJjHRt1AKZCCv9bOA_Delete Configuration\n\nWorkPage.Host.Context.WorkZone.Label=sxRQCRWRQ1jH+k7bnmybpQ_SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=PaB7T11DwbsbTgGyOzCjAw_Current User\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=4vQaiLJ3AWqUtAWvy/Te2A_Id of the SAP Build Work Zone user\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=z9WtfupnktLzuBIoFYxKag_SAP Build Work Zone user id\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=x6IvLy4IHxqIHS4W0Len4A_Id of the current user. The value will change based on the logged on user. To show the users name, use Name of the SAP Build Work Zone user.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=RqReD4S70D+S4JPxf1F/hw_Name of the SAP Build Work Zone user\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=K3okl+1mDM+e7Dvy3Hmhlg_SAP Build Work Zone user name\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=L1F7V9t8MhJEGl6t7ZlpHA_Name of the current user with first, middle and last name. The middle name will be abbreviated. The value will change based on the logged on user.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=+/1yBtnfGqfGZO3+XRAAHg_Firstname of the SAP Build Work Zone user\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=PyZToYo/48N3soWmcDbDqQ_SAP Build Work Zone user firstname\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=o2c4LZAv2Q5Qd1xNOf84/A_Firstname of the current user. The value will change based on the logged on user.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=xa34U9/31JDQWnz0Ps6Qtg_Lastname of the SAP Build Work Zone user\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=cXKmIY6kYln0rNzRe2+AFw_SAP Build Work Zone user lastname\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=LUH47M1zInimggRpj9T55w_Lastname of the current user. The value will change based on the logged on user.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=AYUZQalC/RdUFslbvvfoxw_Email address of current SAP Build Work Zone user\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=ZRbI3HksKe9fjmDCUUaFwQ_SAP Build Work Zone user email\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=VL5Up8WAF6j6Bdjkvl9QlQ_Email address of current SAP Build Work Zone user. The value will change based on the logged on user.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=51KGtSd03r7kUx1ahwvFoA_Delete Configuration\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=WO0mj1qbhMigTJARbyR+Sw_This card has individual configurations. Do you want to delete them irrevocably and reset the card to its default settings?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=9OjnhEPtganBsy4EGqfuSw_Delete\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=HrDx19wcHYuA/DqKj88FUw_Cancel\n",
  "sap/ushell/components/workPageBuilder/resources/resources_es.properties":
    '\n\nWorkPage.EmptyPage.Title=P\\u00E1gina vac\\u00EDa\nWorkPage.EmptyPage.Message=Esta p\\u00E1gina a\\u00FAn no contiene ninguna secci\\u00F3n.\nWorkPage.EmptyPage.Button.Add=A\\u00F1adir secci\\u00F3n\n\nWorkPage.EditMode.Save=Guardar\nWorkPage.EditMode.Cancel=Cancelar\nWorkPage.Message.WidgetMoved=Widget movido\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=T\\u00EDtulo de la secci\\u00F3n\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Introducir un t\\u00EDtulo de secci\\u00F3n opcional\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Eliminar secci\\u00F3n\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Borrar secci\\u00F3n\nWorkPage.Row.DeleteDialog.Title=Borrar\nWorkPage.Row.DeleteDialog.ConfirmText=\\u00BFDesea borrar esta secci\\u00F3n y todo el contenido?\nWorkPage.Row.DeleteDialog.Button.Confirm=Borrar\nWorkPage.Row.DeleteDialog.Button.Cancel=Cancelar\nWorkPage.Row.AddRowButtonTooltip=A\\u00F1adir secci\\u00F3n\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=En el tiempo de ejecuci\\u00F3n, solo ser\\u00E1n visibles las cuatro primeras columnas. Reduzca el n\\u00FAmero de columnas a cuatro.\nWorkPage.Row.AriaLabel=Secciones de p\\u00E1gina de trabajo\n\nWorkPage.Column.AriaLabel=Columna {0} de {1}\nWorkPage.Column.AddWidgetButtonText=A\\u00F1adir widget\nWorkPage.Column.DeleteColumnButtonTooltip=Eliminar columna\nWorkPage.Column.AddColumnButtonTooltip=A\\u00F1adir columna\nWorkPage.Column.EmptyIllustrationTitle=Buscar aplicaciones\nWorkPage.Column.EmptyIllustrationDescription=A\\u00F1adir aplicaciones al widget o eliminar el widget si no lo necesita.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=A\\u00F1adir aplicaci\\u00F3n\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Borrar widget\nWorkPage.Cell.EmptyIllustrationTitle=Buscar aplicaciones\nWorkPage.Cell.EmptyIllustrationDescription=A\\u00F1adir aplicaciones al widget o eliminar el widget si no lo necesita.\nWorkPage.Cell.DeleteDialog.Title=Borrar\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u00BFEst\\u00E1 seguro de que desea borrar este widget? Tambi\\u00E9n se eliminar\\u00E1n todas las aplicaciones de la p\\u00E1gina.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Borrar\nWorkPage.Cell.DeleteDialog.Button.Cancel=Cancelar\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Abrir opciones de widget\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Borrar widget\n\nWorkPage.Section.AddVizInstanceButtonText=A\\u00F1adir mosaicos\n\n\nContentFinder.Categories.Applications.Title=Aplicaciones\nContentFinder.Widgets.Tiles.Title=Mosaicos\nContentFinder.Widgets.Tiles.Description=Representaciones visuales de aplicaciones.\nContentFinder.Widgets.Cards.Title=Tarjetas\nContentFinder.Widgets.Cards.Description=Representaciones visuales de aplicaciones mostradas en disposiciones flexibles.\n\nWorkPage.CardEditor.Save=Guardar\nWorkPage.CardEditor.Cancel=Cancelar\nWorkPage.CardEditor.Title=Configurar "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Configurar\nWorkPage.Card.ActionDefinition.Configure=Configurar\nWorkPage.Card.ActionDefinition.Reset=Borrar configuraci\\u00F3n\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Usuario actual\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID del usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID de usuario actual. El valor se modificar\\u00E1 seg\\u00FAn el usuario que haya iniciado sesi\\u00F3n. Para mostrar el nombre de usuario, use nombre del usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Nombre del usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Nombre de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Nombre del usuario actual con nombre, segundo nombre y apellido. El segundo nombre se abreviar\\u00E1. El valor se modificar\\u00E1 seg\\u00FAn el usuario que haya iniciado sesi\\u00F3n.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Nombre del usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Nombre de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Nombre del usuario actual. El valor se modificar\\u00E1 seg\\u00FAn el usuario que haya iniciado sesi\\u00F3n.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Apellido del usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Apellido de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Apellido del usuario actual. El valor se modificar\\u00E1 seg\\u00FAn el usuario que haya iniciado sesi\\u00F3n.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Direcci\\u00F3n de correo electr\\u00F3nico del usuario actual SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=Correo electr\\u00F3nico de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Correo electr\\u00F3nico del usuario actual. El valor se modificar\\u00E1 seg\\u00FAn el usuario que haya iniciado sesi\\u00F3n.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Borrar configuraci\\u00F3n\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Esta tarjeta tiene configuraciones individuales. \\u00BFDesea borrarlas de forma irrevocable y restablecer la tarjeta a su configuraci\\u00F3n predeterminada?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Borrar\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Cancelar\n',
  "sap/ushell/components/workPageBuilder/resources/resources_es_MX.properties":
    '\n\nWorkPage.EmptyPage.Title=P\\u00E1gina vac\\u00EDa\nWorkPage.EmptyPage.Message=Esta p\\u00E1gina a\\u00FAn no contiene ninguna secci\\u00F3n.\nWorkPage.EmptyPage.Button.Add=Agregar secci\\u00F3n\n\nWorkPage.EditMode.Save=Guardar\nWorkPage.EditMode.Cancel=Cancelar\nWorkPage.Message.WidgetMoved=Se movi\\u00F3 el widget\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=T\\u00EDtulo de secci\\u00F3n\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Ingrese un t\\u00EDtulo de secci\\u00F3n opcional\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Eliminar secci\\u00F3n\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Eliminar secci\\u00F3n\nWorkPage.Row.DeleteDialog.Title=Eliminar\nWorkPage.Row.DeleteDialog.ConfirmText=\\u00BFDesea eliminar esta secci\\u00F3n y todo su contenido?\nWorkPage.Row.DeleteDialog.Button.Confirm=Eliminar\nWorkPage.Row.DeleteDialog.Button.Cancel=Cancelar\nWorkPage.Row.AddRowButtonTooltip=Agregar secci\\u00F3n\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=En el tiempo de ejecuci\\u00F3n, solo las primeras cuatro columnas estar\\u00E1n visibles. Reduzca el n\\u00FAmero de columnas a cuatro.\nWorkPage.Row.AriaLabel=Secciones p\\u00E1gina de trabajo\n\nWorkPage.Column.AriaLabel=Columna {0} de {1}\nWorkPage.Column.AddWidgetButtonText=Agregar widget\nWorkPage.Column.DeleteColumnButtonTooltip=Eliminar columna\nWorkPage.Column.AddColumnButtonTooltip=Agregar columna\nWorkPage.Column.EmptyIllustrationTitle=Buscar aplicaciones\nWorkPage.Column.EmptyIllustrationDescription=Agregar aplicaciones al widget o quitar el widget si no lo necesita.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Agergar aplicaci\\u00F3n\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Eliminar widget\nWorkPage.Cell.EmptyIllustrationTitle=Buscar aplicaciones\nWorkPage.Cell.EmptyIllustrationDescription=Agregar aplicaciones al widget o quitar el widget si no lo necesita.\nWorkPage.Cell.DeleteDialog.Title=Eliminar\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u00BFSeguro que quiere eliminar este widget? Tambi\\u00E9n se quitar\\u00E1n de esta p\\u00E1gina todas las aplicaciones que incluya.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Eliminar\nWorkPage.Cell.DeleteDialog.Button.Cancel=Cancelar\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Abrir configuraci\\u00F3n de widget\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Eliminar widget\n\nWorkPage.Section.AddVizInstanceButtonText=Agregar mosaicos\n\n\nContentFinder.Categories.Applications.Title=Aplicaciones\nContentFinder.Widgets.Tiles.Title=Mosaicos\nContentFinder.Widgets.Tiles.Description=Representaciones visuales de las aplicaciones.\nContentFinder.Widgets.Cards.Title=Tarjetas\nContentFinder.Widgets.Cards.Description=Representaciones visuales de las aplicaciones, que se muestran en dise\\u00F1os flexibles.\n\nWorkPage.CardEditor.Save=Guardar\nWorkPage.CardEditor.Cancel=Cancelar\nWorkPage.CardEditor.Title=Configurar "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Configurar\nWorkPage.Card.ActionDefinition.Configure=Configurar\nWorkPage.Card.ActionDefinition.Reset=Eliminar configuraci\\u00F3n\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Usuario actual\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID de usuario actual. El valor cambiar\\u00E1 seg\\u00FAn el usuario que haya iniciado sesi\\u00F3n. Para mostrar el nombre de usuario, utilice nombre de usuario SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Nombre de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Nombre de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Nombre de usuario actual con nombre, segundo nombre y apellido. El segundo nombre se abreviar\\u00E1. El valor cambiar\\u00E1 seg\\u00FAn el usuario que haya iniciado sesi\\u00F3n.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Nombre de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Nombre de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Nombre de usuario actual. El valor cambiar\\u00E1 seg\\u00FAn el usuario que haya iniciado sesi\\u00F3n.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Apellido de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Apellido de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Apellido de usuario actual. El valor cambiar\\u00E1 seg\\u00FAn el usuario que haya iniciado sesi\\u00F3n.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Direcci\\u00F3n de correo electr\\u00F3nico del usuario actual SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=Correo electr\\u00F3nico de usuario SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Correo electr\\u00F3nico de usuario actual SAP Build Work Zone. El valor cambiar\\u00E1 seg\\u00FAn el usuario que haya iniciado sesi\\u00F3n.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Eliminar configuraci\\u00F3n\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Esta tarjeta tiene configuraciones individuales. \\u00BFDesea eliminarlas de forma irrevocable y restablecer la tarjeta a su configuraci\\u00F3n predeterminada?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Eliminar\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Cancelar\n',
  "sap/ushell/components/workPageBuilder/resources/resources_et.properties":
    "\n\nWorkPage.EmptyPage.Title=T\\u00FChi leht\nWorkPage.EmptyPage.Message=Sellel lehel pole veel \\u00FChtki jaotist.\nWorkPage.EmptyPage.Button.Add=Lisa jaotis\n\nWorkPage.EditMode.Save=Salvesta\nWorkPage.EditMode.Cancel=T\\u00FChista\nWorkPage.Message.WidgetMoved=Vidin on teisaldatud\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Jaotise pealkiri\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Sisesta valikuline jaotise pealkiri\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Eemalda jaotis\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Kustuta jaotis\nWorkPage.Row.DeleteDialog.Title=Kustuta\nWorkPage.Row.DeleteDialog.ConfirmText=Kas soovite kustutada selle jaotise ja kogu selle sisu?\nWorkPage.Row.DeleteDialog.Button.Confirm=Kustuta\nWorkPage.Row.DeleteDialog.Button.Cancel=T\\u00FChista\nWorkPage.Row.AddRowButtonTooltip=Lisa jaotis\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=K\\u00E4itusajal on n\\u00E4htavad ainult neli esimest veergu. V\\u00E4hendage veergude arvu neljale.\nWorkPage.Row.AriaLabel=T\\u00F6\\u00F6lehe jaotised\n\nWorkPage.Column.AriaLabel=Veerg {0}/{1}\nWorkPage.Column.AddWidgetButtonText=Lisa vidin\nWorkPage.Column.DeleteColumnButtonTooltip=Eemalda veerg\nWorkPage.Column.AddColumnButtonTooltip=Lisa veerg\nWorkPage.Column.EmptyIllustrationTitle=Otsi rakendusi\nWorkPage.Column.EmptyIllustrationDescription=Lisage vidinasse rakendusi. Kui te ei vaja vidinat, saate selle eemaldada.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Lisa rakendus\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Kustuta vidin\nWorkPage.Cell.EmptyIllustrationTitle=Otsi rakendusi\nWorkPage.Cell.EmptyIllustrationDescription=Lisage vidinasse rakendusi. Kui te ei vaja vidinat, saate selle eemaldada.\nWorkPage.Cell.DeleteDialog.Title=Kustuta\nWorkPage.Cell.DeleteDialog.ConfirmText=Kas soovite selle vidina kindlasti kustutada? Lehek\\u00FCljelt eemaldatakse ka k\\u00F5ik selles olevad rakendused.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Kustuta\nWorkPage.Cell.DeleteDialog.Button.Cancel=T\\u00FChista\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Ava vidina s\\u00E4tted\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Kustuta vidin\n\nWorkPage.Section.AddVizInstanceButtonText=Lisa paanid\n\n\nContentFinder.Categories.Applications.Title=Rakendused\nContentFinder.Widgets.Tiles.Title=Paanid\nContentFinder.Widgets.Tiles.Description=Rakenduste visuaalsed esitused.\nContentFinder.Widgets.Cards.Title=Kaardid\nContentFinder.Widgets.Cards.Description=Rakenduste visuaalsed esitused, mis on kuvatud paindliku paigutusega.\n\nWorkPage.CardEditor.Save=Salvesta\nWorkPage.CardEditor.Cancel=T\\u00FChista\nWorkPage.CardEditor.Title=Konfigureeri \\u201E{0}\\u201D\nWorkPage.CardEditor.Title.NoCardTitle=Konfigureeri\nWorkPage.Card.ActionDefinition.Configure=Konfigureeri\nWorkPage.Card.ActionDefinition.Reset=Kustuta konfiguratsioon\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Praegune kasutaja\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=SAP Build Work Zone\\u2019i kasutaja ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone\\u2019i kasutaja ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=Praeguse kasutaja ID. V\\u00E4\\u00E4rtus muutub vastavalt sisselogitud kasutajale. Kasutaja nime kuvamiseks kasutage SAP Build Work Zone\\u2019i kasutaja nime s\\u00E4tet.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=SAP Build Work Zone\\u2019i kasutaja nimi\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone\\u2019i kasutaja nimi\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Praeguse kasutaja nimi (eesnimi, teine nimi ja perekonnanimi). Teine nimi l\\u00FChendatakse. V\\u00E4\\u00E4rtus muutub vastavalt sisselogitud kasutajale.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=SAP Build Work Zone\\u2019i kasutaja eesnimi\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone\\u2019i kasutaja eesnimi\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Praeguse kasutaja eesnimi. V\\u00E4\\u00E4rtus muutub vastavalt sisselogitud kasutajale.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=SAP Build Work Zone\\u2019i kasutaja perekonnanimi\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone\\u2019i kasutaja perekonnanimi\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Praeguse kasutaja perekonnanimi. V\\u00E4\\u00E4rtus muutub vastavalt sisselogitud kasutajale.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Praeguse SAP Build Work Zone\\u2019i kasutaja meiliaadress\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone\\u2019i kasutaja meiliaadress\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Praeguse SAP Build Work Zone\\u2019i kasutaja meiliaadress. V\\u00E4\\u00E4rtus muutub vastavalt sisselogitud kasutajale.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Kustuta konfiguratsioon\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Sellel kaardil on isiklikud konfiguratsioonid. Kas soovite need tagasiv\\u00F5etamatult kustutada ja l\\u00E4htestada kaardi vaikes\\u00E4teteni?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Kustuta\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=T\\u00FChista\n",
  "sap/ushell/components/workPageBuilder/resources/resources_fi.properties":
    '\n\nWorkPage.EmptyPage.Title=Tyhj\\u00E4 sivu\nWorkPage.EmptyPage.Message=T\\u00E4ll\\u00E4 sivulla ei viel\\u00E4 ole osioita.\nWorkPage.EmptyPage.Button.Add=Lis\\u00E4\\u00E4 osio\n\nWorkPage.EditMode.Save=Tallenna\nWorkPage.EditMode.Cancel=Peruuta\nWorkPage.Message.WidgetMoved=Widgetti siirretty\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Osion otsikko\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Sy\\u00F6t\\u00E4 valinnainen osion otsikko\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Poista osio\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Poista osio\nWorkPage.Row.DeleteDialog.Title=Poista\nWorkPage.Row.DeleteDialog.ConfirmText=Haluatko poistaa t\\u00E4m\\u00E4n osion ja sen kaiken sis\\u00E4ll\\u00F6n?\nWorkPage.Row.DeleteDialog.Button.Confirm=Poista\nWorkPage.Row.DeleteDialog.Button.Cancel=Peruuta\nWorkPage.Row.AddRowButtonTooltip=Lis\\u00E4\\u00E4 osio\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Vain nelj\\u00E4 ensimm\\u00E4ist\\u00E4 saraketta n\\u00E4ytet\\u00E4\\u00E4n ajoaikana. V\\u00E4henn\\u00E4 sarakkeiden m\\u00E4\\u00E4r\\u00E4 nelj\\u00E4\\u00E4n.\nWorkPage.Row.AriaLabel=Ty\\u00F6sivun osiot\n\nWorkPage.Column.AriaLabel=Sarake {0}/{1}\nWorkPage.Column.AddWidgetButtonText=Lis\\u00E4\\u00E4 widget\nWorkPage.Column.DeleteColumnButtonTooltip=Poista sarake\nWorkPage.Column.AddColumnButtonTooltip=Lis\\u00E4\\u00E4 sarake\nWorkPage.Column.EmptyIllustrationTitle=Hae sovelluksia\nWorkPage.Column.EmptyIllustrationDescription=Lis\\u00E4\\u00E4 sovelluksia widgetiin tai poista widget, jos et tarvitse sit\\u00E4.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Lis\\u00E4\\u00E4 sovellus\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Poista widget\nWorkPage.Cell.EmptyIllustrationTitle=Hae sovelluksia\nWorkPage.Cell.EmptyIllustrationDescription=Lis\\u00E4\\u00E4 sovelluksia widgetiin tai poista widget, jos et tarvitse sit\\u00E4.\nWorkPage.Cell.DeleteDialog.Title=Poista\nWorkPage.Cell.DeleteDialog.ConfirmText=Haluatko varmasti poistaa t\\u00E4m\\u00E4n widgetin? My\\u00F6s kaikki sen sovellukset poistetaan sivulta.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Poista\nWorkPage.Cell.DeleteDialog.Button.Cancel=Peruuta\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Avaa widgetin asetukset\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Poista widget\n\nWorkPage.Section.AddVizInstanceButtonText=Lis\\u00E4\\u00E4 ruudut\n\n\nContentFinder.Categories.Applications.Title=Sovellukset\nContentFinder.Widgets.Tiles.Title=Ruudut\nContentFinder.Widgets.Tiles.Description=Sovellusten visuaaliset esitykset.\nContentFinder.Widgets.Cards.Title=Kortit\nContentFinder.Widgets.Cards.Description=Sovellusten visuaaliset esitykset joustavissa asetteluissa esitettyin\\u00E4.\n\nWorkPage.CardEditor.Save=Tallenna\nWorkPage.CardEditor.Cancel=Peruuta\nWorkPage.CardEditor.Title=Konfiguroi "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Konfiguroi\nWorkPage.Card.ActionDefinition.Configure=Konfiguroi\nWorkPage.Card.ActionDefinition.Reset=Poista konfiguraatio\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Nykyinen k\\u00E4ytt\\u00E4j\\u00E4\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=SAP Build Work Zone -k\\u00E4ytt\\u00E4j\\u00E4n tunnus\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone -k\\u00E4ytt\\u00E4j\\u00E4tunnus\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=Nykyisen k\\u00E4ytt\\u00E4j\\u00E4n tunnus. Arvo muuttuu kirjautuneen k\\u00E4ytt\\u00E4j\\u00E4n mukaan. Jos haluat n\\u00E4ytt\\u00E4\\u00E4 k\\u00E4ytt\\u00E4j\\u00E4n nimen, k\\u00E4yt\\u00E4 SAP Build Work Zone -k\\u00E4ytt\\u00E4j\\u00E4n nime\\u00E4.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=SAP Build Work Zone -k\\u00E4ytt\\u00E4j\\u00E4n nimi\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone -k\\u00E4ytt\\u00E4j\\u00E4nimi\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Nykyisen k\\u00E4ytt\\u00E4j\\u00E4n nimi etunimen, toisen nimen ja sukunimen kanssa. Toinen nimi lyhennet\\u00E4\\u00E4n. Arvo muuttuu kirjautuneen k\\u00E4ytt\\u00E4j\\u00E4n mukaan.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=SAP Build Work Zone -k\\u00E4ytt\\u00E4j\\u00E4n etunimi\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone -k\\u00E4ytt\\u00E4j\\u00E4n etunimi\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Nykyisen k\\u00E4ytt\\u00E4j\\u00E4n etunimi. Arvo muuttuu kirjautuneen k\\u00E4ytt\\u00E4j\\u00E4n mukaan.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=SAP Build Work Zone -k\\u00E4ytt\\u00E4j\\u00E4n sukunimi\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone -k\\u00E4ytt\\u00E4j\\u00E4n sukunimi\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Nykyisen k\\u00E4ytt\\u00E4j\\u00E4n sukunimi. Arvo muuttuu kirjautuneen k\\u00E4ytt\\u00E4j\\u00E4n mukaan.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Nykyisen SAP Build Work Zone -k\\u00E4ytt\\u00E4j\\u00E4n s\\u00E4hk\\u00F6postiosoite\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone -k\\u00E4ytt\\u00E4j\\u00E4n s\\u00E4hk\\u00F6posti\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Nykyisen SAP Build Work Zone -k\\u00E4ytt\\u00E4j\\u00E4n s\\u00E4hk\\u00F6postiosoite. Arvo muuttuu kirjautuneen k\\u00E4ytt\\u00E4j\\u00E4n mukaan.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Poista konfiguraatio\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=T\\u00E4ll\\u00E4 kortilla on yksil\\u00F6llisi\\u00E4 konfiguraatioita. Haluatko poistaa ne pysyv\\u00E4sti ja palauttaa kortin vakioasetukset?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Poista\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Peruuta\n',
  "sap/ushell/components/workPageBuilder/resources/resources_fr.properties":
    "\n\nWorkPage.EmptyPage.Title=Page vide\nWorkPage.EmptyPage.Message=Cette page ne contient pas encore de sections.\nWorkPage.EmptyPage.Button.Add=Ajouter une section\n\nWorkPage.EditMode.Save=Sauvegarder\nWorkPage.EditMode.Cancel=Interrompre\nWorkPage.Message.WidgetMoved=Widget d\\u00E9plac\\u00E9\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Titre de la section\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Saisir un titre de section facultatif\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Supprimer la section\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Supprimer section\nWorkPage.Row.DeleteDialog.Title=Supprimer\nWorkPage.Row.DeleteDialog.ConfirmText=Voulez-vous supprimer cette section et l'ensemble de son contenu\\u00A0?\nWorkPage.Row.DeleteDialog.Button.Confirm=Supprimer\nWorkPage.Row.DeleteDialog.Button.Cancel=Annuler\nWorkPage.Row.AddRowButtonTooltip=Ajouter une section\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Lors de l'ex\\u00E9cution, seules les quatre premi\\u00E8res colonnes seront visibles. R\\u00E9duisez le nombre de colonnes \\u00E0 quatre.\nWorkPage.Row.AriaLabel=Sections de page de travail\n\nWorkPage.Column.AriaLabel=Colonne {0}/{1}\nWorkPage.Column.AddWidgetButtonText=Ajouter widget\nWorkPage.Column.DeleteColumnButtonTooltip=Supprimer la colonne\nWorkPage.Column.AddColumnButtonTooltip=Ajouter une colonne\nWorkPage.Column.EmptyIllustrationTitle=Rechercher des applications\nWorkPage.Column.EmptyIllustrationDescription=Ajoutez des applications au widget ou supprimez le widget s'il n'est pas n\\u00E9cessaire.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Ajouter une application\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Supprimer le widget\nWorkPage.Cell.EmptyIllustrationTitle=Rechercher des applications\nWorkPage.Cell.EmptyIllustrationDescription=Ajoutez des applications au widget ou supprimez le widget s'il n'est pas n\\u00E9cessaire.\nWorkPage.Cell.DeleteDialog.Title=Supprimer\nWorkPage.Cell.DeleteDialog.ConfirmText=Voulez-vous vraiment supprimer ce widget\\u00A0? Toutes les applications qu'il contient seront \\u00E9galement supprim\\u00E9es de la page.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Supprimer\nWorkPage.Cell.DeleteDialog.Button.Cancel=Annuler\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Ouvrir les options de widget\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Supprimer widget\n\nWorkPage.Section.AddVizInstanceButtonText=Ajouter vignettes\n\n\nContentFinder.Categories.Applications.Title=Applications\nContentFinder.Widgets.Tiles.Title=Vignettes\nContentFinder.Widgets.Tiles.Description=Repr\\u00E9sentations visuelles des applications\nContentFinder.Widgets.Cards.Title=Fiches\nContentFinder.Widgets.Cards.Description=Repr\\u00E9sentations visuelles des applications affich\\u00E9es dans des mises en forme flexibles\n\nWorkPage.CardEditor.Save=Sauvegarder\nWorkPage.CardEditor.Cancel=Annuler\nWorkPage.CardEditor.Title=Configurer \"{0}\"\nWorkPage.CardEditor.Title.NoCardTitle=Configurer\nWorkPage.Card.ActionDefinition.Configure=Configurer\nWorkPage.Card.ActionDefinition.Reset=Supprimer configuration\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Utilisateur actuel\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID de l'utilisateur SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID de l'utilisateur SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=Il s'agit de l'ID de l'utilisateur actuel. La valeur change selon l'utilisateur connect\\u00E9. Pour afficher le nom de l'utilisateur, utilisez Nom de l'utilisateur SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Nom de l'utilisateur SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Nom de l'utilisateur SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Il s'agit du nom de l'utilisateur actuel avec le pr\\u00E9nom, le deuxi\\u00E8me pr\\u00E9nom et le nom de famille. Le deuxi\\u00E8me pr\\u00E9nom est abr\\u00E9g\\u00E9. La valeur change selon l'utilisateur connect\\u00E9.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Pr\\u00E9nom de l'utilisateur SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Pr\\u00E9nom de l'utilisateur SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Il s'agit du pr\\u00E9nom de l'utilisateur actuel. La valeur change selon l'utilisateur connect\\u00E9.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Nom de famille de l'utilisateur SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Nom de famille de l'utilisateur SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Il s'agit du nom de famille de l'utilisateur actuel. La valeur change selon l'utilisateur connect\\u00E9.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Adresse e-mail de l'utilisateur SAP Build Work Zone actuel\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-mail de l'utilisateur SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Il s'agit de l'adresse e-mail de l'utilisateur SAP Build Work Zone actuel. La valeur change selon l'utilisateur connect\\u00E9.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Supprimer configuration\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Cette fiche a des configurations individuelles. Voulez-vous les supprimer d\\u00E9finitivement et r\\u00E9initialiser la fiche \\u00E0 ses options par d\\u00E9faut\\u00A0?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Supprimer\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Annuler\n",
  "sap/ushell/components/workPageBuilder/resources/resources_fr_CA.properties":
    "\n\nWorkPage.EmptyPage.Title=Page vide\nWorkPage.EmptyPage.Message=Cette page ne contient pas encore de sections.\nWorkPage.EmptyPage.Button.Add=Ajouter une section\n\nWorkPage.EditMode.Save=Enregistrer\nWorkPage.EditMode.Cancel=Annuler\nWorkPage.Message.WidgetMoved=Widget d\\u00E9plac\\u00E9\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Titre de la section\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Saisir un titre de section facultatif\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Supprimer la section\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Supprimer la section\nWorkPage.Row.DeleteDialog.Title=Supprimer\nWorkPage.Row.DeleteDialog.ConfirmText=Voulez-vous supprimer cette section et l'ensemble de son contenu?\nWorkPage.Row.DeleteDialog.Button.Confirm=Supprimer\nWorkPage.Row.DeleteDialog.Button.Cancel=Annuler\nWorkPage.Row.AddRowButtonTooltip=Ajouter une section\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Lors de l'ex\\u00E9cution, seules les quatre premi\\u00E8res colonnes seront visibles. R\\u00E9duisez le nombre de colonnes \\u00E0 quatre.\nWorkPage.Row.AriaLabel=Sections de page de travail\n\nWorkPage.Column.AriaLabel=Colonne {0} sur {1}\nWorkPage.Column.AddWidgetButtonText=Ajouter un widget\nWorkPage.Column.DeleteColumnButtonTooltip=Supprimer la colonne\nWorkPage.Column.AddColumnButtonTooltip=Ajouter une colonne\nWorkPage.Column.EmptyIllustrationTitle=Rechercher des applications\nWorkPage.Column.EmptyIllustrationDescription=Ajoutez des applications au widget ou supprimez le widget s'il n'est pas n\\u00E9cessaire.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Ajouter une application\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Supprimer le widget\nWorkPage.Cell.EmptyIllustrationTitle=Rechercher des applications\nWorkPage.Cell.EmptyIllustrationDescription=Ajoutez des applications au widget ou supprimez le widget s'il n'est pas n\\u00E9cessaire.\nWorkPage.Cell.DeleteDialog.Title=Supprimer\nWorkPage.Cell.DeleteDialog.ConfirmText=Voulez-vous vraiment supprimer ce widget? Toutes les applications qu'il contient seront \\u00E9galement supprim\\u00E9es de la page.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Supprimer\nWorkPage.Cell.DeleteDialog.Button.Cancel=Annuler\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Ouvrir les param\\u00E8tres de widget\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Supprimer le widget\n\nWorkPage.Section.AddVizInstanceButtonText=Ajouter des vignettes\n\n\nContentFinder.Categories.Applications.Title=Applications\nContentFinder.Widgets.Tiles.Title=Vignettes\nContentFinder.Widgets.Tiles.Description=Repr\\u00E9sentations visuelles des applications\nContentFinder.Widgets.Cards.Title=Fiches\nContentFinder.Widgets.Cards.Description=Repr\\u00E9sentations visuelles des applications affich\\u00E9es dans des mises en forme flexibles\n\nWorkPage.CardEditor.Save=Enregistrer\nWorkPage.CardEditor.Cancel=Annuler\nWorkPage.CardEditor.Title=Configurer \"{0}\"\nWorkPage.CardEditor.Title.NoCardTitle=Configurer\nWorkPage.Card.ActionDefinition.Configure=Configurer\nWorkPage.Card.ActionDefinition.Reset=Supprimer la configuration\n\nWorkPage.Host.Context.WorkZone.Label=SAP\\u00A0Build\\u00A0Work\\u00A0Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Utilisateur actuel\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID de l'utilisateur SAP\\u00A0Build\\u00A0Work\\u00A0Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID de l'utilisateur SAP\\u00A0Build\\u00A0Work\\u00A0Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=Il s'agit de l'ID de l'utilisateur actuel. La valeur change selon l'utilisateur connect\\u00E9. Pour afficher le nom de l'utilisateur, utilisez Nom de l'utilisateur SAP\\u00A0Build\\u00A0Work\\u00A0Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Nom de l'utilisateur SAP\\u00A0Build\\u00A0Work\\u00A0Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Nom de l'utilisateur SAP\\u00A0Build\\u00A0Work\\u00A0Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Il s'agit du nom de l'utilisateur actuel avec le pr\\u00E9nom, le deuxi\\u00E8me pr\\u00E9nom et le nom de famille. Le deuxi\\u00E8me pr\\u00E9nom est abr\\u00E9g\\u00E9. La valeur change selon l'utilisateur connect\\u00E9.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Pr\\u00E9nom de l'utilisateur SAP\\u00A0Build\\u00A0Work\\u00A0Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Pr\\u00E9nom de l'utilisateur SAP\\u00A0Build\\u00A0Work\\u00A0Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Il s'agit du pr\\u00E9nom de l'utilisateur actuel. La valeur change selon l'utilisateur connect\\u00E9.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Nom de famille de l'utilisateur SAP\\u00A0Build\\u00A0Work\\u00A0Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Nom de famille de l'utilisateur SAP\\u00A0Build\\u00A0Work\\u00A0Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Il s'agit du nom de famille de l'utilisateur actuel. La valeur change selon l'utilisateur connect\\u00E9.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Adresse courriel de l'utilisateur SAP\\u00A0Build\\u00A0Work\\u00A0Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=Courriel de l'utilisateur SAP\\u00A0Build\\u00A0Work\\u00A0Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Il s'agit de l'adresse courriel de l'utilisateur SAP\\u00A0Build\\u00A0Work\\u00A0Zone actuel. La valeur change selon l'utilisateur connect\\u00E9.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Suppression de la configuration\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Cette fiche a des configurations individuelles. Voulez-vous les supprimer d\\u00E9finitivement et r\\u00E9initialiser la fiche \\u00E0 ses param\\u00E8tres par d\\u00E9faut?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Supprimer\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Annuler\n",
  "sap/ushell/components/workPageBuilder/resources/resources_hi.properties":
    '\n\nWorkPage.EmptyPage.Title=\\u0916\\u093E\\u0932\\u0940 \\u092A\\u0943\\u0937\\u094D\\u0920\nWorkPage.EmptyPage.Message=\\u0907\\u0938 \\u092A\\u0943\\u0937\\u094D\\u0920 \\u092E\\u0947\\u0902 \\u0905\\u092D\\u0940 \\u0924\\u0915 \\u0915\\u094B\\u0908 \\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u0936\\u093E\\u092E\\u093F\\u0932 \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948.\nWorkPage.EmptyPage.Button.Add=\\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u091C\\u094B\\u0921\\u093C\\u0947\\u0902\n\nWorkPage.EditMode.Save=\\u0938\\u0939\\u0947\\u091C\\u0947\\u0902\nWorkPage.EditMode.Cancel=\\u0930\\u0926\\u094D\\u0926 \\u0915\\u0930\\u0947\\u0902\nWorkPage.Message.WidgetMoved=\\u0935\\u093F\\u091C\\u0947\\u091F \\u0938\\u094D\\u0925\\u093E\\u0928\\u093E\\u0902\\u0924\\u0930\\u093F\\u0924 \\u0915\\u093F\\u092F\\u093E\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\u0938\\u0947\\u0915\\u094D\\u0936\\u0928 \\u0936\\u0940\\u0930\\u094D\\u0937\\u0915\\:\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u0915\\u094B\\u0908 \\u0935\\u0948\\u0915\\u0932\\u094D\\u092A\\u093F\\u0915 \\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u0936\\u0940\\u0930\\u094D\\u0937\\u0915 \\u0926\\u0930\\u094D\\u091C \\u0915\\u0930\\u0947\\u0902\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u0928\\u093F\\u0915\\u093E\\u0932\\u0947\\u0902\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u0939\\u091F\\u093E\\u090F\\u0902\nWorkPage.Row.DeleteDialog.Title=\\u0939\\u091F\\u093E\\u090F\\u0902\nWorkPage.Row.DeleteDialog.ConfirmText=\\u0915\\u094D\\u092F\\u093E \\u0906\\u092A \\u092F\\u0939 \\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u0914\\u0930 \\u0909\\u0938\\u0915\\u0940 \\u0938\\u092D\\u0940 \\u092A\\u094D\\u0930\\u0915\\u093E\\u0930 \\u0915\\u0940 \\u0938\\u093E\\u092E\\u0917\\u094D\\u0930\\u0940 \\u0939\\u091F\\u093E\\u0928\\u093E \\u091A\\u093E\\u0939\\u0924\\u0947 \\u0939\\u0948\\u0902?\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u0939\\u091F\\u093E\\u090F\\u0902\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u0930\\u0926\\u094D\\u0926 \\u0915\\u0930\\u0947\\u0902\nWorkPage.Row.AddRowButtonTooltip=\\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u091C\\u094B\\u0921\\u093C\\u0947\\u0902\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u0930\\u0928\\u091F\\u093E\\u0907\\u092E \\u092E\\u0947\\u0902, \\u0915\\u0947\\u0935\\u0932 \\u092A\\u0939\\u0932\\u0947 \\u091A\\u093E\\u0930 \\u0938\\u094D\\u0924\\u0902\\u092D \\u0939\\u0940 \\u0926\\u0943\\u0936\\u094D\\u092F\\u092E\\u093E\\u0928 \\u0939\\u094B\\u0902\\u0917\\u0947. \\u0915\\u0943\\u092A\\u092F\\u093E \\u0938\\u094D\\u0924\\u0902\\u092D\\u094B\\u0902 \\u0915\\u0940 \\u0938\\u0902\\u0916\\u094D\\u092F\\u093E \\u0918\\u091F\\u093E\\u0915\\u0930 \\u091A\\u093E\\u0930 \\u0915\\u0930\\u0947\\u0902.\nWorkPage.Row.AriaLabel=\\u0915\\u093E\\u0930\\u094D\\u092F \\u092A\\u0943\\u0937\\u094D\\u0920 \\u0905\\u0928\\u0941\\u092D\\u093E\\u0917\n\nWorkPage.Column.AriaLabel=\\u0938\\u094D\\u0924\\u0902\\u092D {0} \\u0915\\u093E {1}\nWorkPage.Column.AddWidgetButtonText=\\u0935\\u093F\\u091C\\u0947\\u091F \\u091C\\u094B\\u0921\\u093C\\u0947\\u0902\nWorkPage.Column.DeleteColumnButtonTooltip=\\u0938\\u094D\\u0924\\u0902\\u092D \\u0928\\u093F\\u0915\\u093E\\u0932\\u0947\\u0902\nWorkPage.Column.AddColumnButtonTooltip=\\u0938\\u094D\\u0924\\u0902\\u092D \\u091C\\u094B\\u0921\\u093C\\u0947\\u0902\nWorkPage.Column.EmptyIllustrationTitle=\\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0916\\u094B\\u091C\\u0947\\u0902\nWorkPage.Column.EmptyIllustrationDescription=\\u0935\\u093F\\u091C\\u0947\\u091F \\u092E\\u0947\\u0902 \\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 \\u091C\\u094B\\u0921\\u093C\\u0947\\u0902 \\u092F\\u093E \\u092F\\u0926\\u093F \\u0906\\u092A\\u0915\\u094B \\u0907\\u0938\\u0915\\u0940 \\u0906\\u0935\\u0936\\u094D\\u092F\\u0915\\u0924\\u093E \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948 \\u0924\\u094B \\u0935\\u093F\\u091C\\u0947\\u091F \\u0915\\u094B \\u0928\\u093F\\u0915\\u093E\\u0932 \\u0926\\u0947\\u0902.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 \\u091C\\u094B\\u0921\\u093C\\u0947\\u0902\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u0935\\u093F\\u091C\\u0947\\u091F \\u0939\\u091F\\u093E\\u090F\\u0902\nWorkPage.Cell.EmptyIllustrationTitle=\\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0916\\u094B\\u091C\\u0947\\u0902\nWorkPage.Cell.EmptyIllustrationDescription=\\u0935\\u093F\\u091C\\u0947\\u091F \\u092E\\u0947\\u0902 \\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 \\u091C\\u094B\\u0921\\u093C\\u0947\\u0902 \\u092F\\u093E \\u092F\\u0926\\u093F \\u0906\\u092A\\u0915\\u094B \\u0907\\u0938\\u0915\\u0940 \\u0906\\u0935\\u0936\\u094D\\u092F\\u0915\\u0924\\u093E \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948 \\u0924\\u094B \\u0935\\u093F\\u091C\\u0947\\u091F \\u0915\\u094B \\u0928\\u093F\\u0915\\u093E\\u0932 \\u0926\\u0947\\u0902.\nWorkPage.Cell.DeleteDialog.Title=\\u0939\\u091F\\u093E\\u090F\\u0902\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u0915\\u094D\\u092F\\u093E \\u0906\\u092A \\u0935\\u093E\\u0938\\u094D\\u0924\\u0935 \\u092E\\u0947\\u0902 \\u0907\\u0938 \\u0935\\u093F\\u091C\\u0947\\u091F \\u0915\\u094B \\u0939\\u091F\\u093E\\u0928\\u093E \\u091A\\u093E\\u0939\\u0924\\u0947 \\u0939\\u0948\\u0902? \\u0907\\u0938\\u092E\\u0947\\u0902 \\u092E\\u094C\\u091C\\u0942\\u0926 \\u0938\\u092D\\u0940 \\u090F\\u092A\\u094D\\u0932\\u0940\\u0915\\u0947\\u0936\\u0928 \\u092D\\u0940 \\u092A\\u0943\\u0937\\u094D\\u0920 \\u0938\\u0947 \\u0928\\u093F\\u0915\\u093E\\u0932\\u0947 \\u091C\\u093E\\u090F\\u0902\\u0917\\u0947.\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u0939\\u091F\\u093E\\u090F\\u0902\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u0930\\u0926\\u094D\\u0926 \\u0915\\u0930\\u0947\\u0902\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u0935\\u093F\\u091C\\u0947\\u091F \\u0938\\u0947\\u091F\\u093F\\u0902\\u0917 \\u0916\\u094B\\u0932\\u0947\\u0902\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u0935\\u093F\\u091C\\u0947\\u091F \\u0939\\u091F\\u093E\\u090F\\u0902\n\nWorkPage.Section.AddVizInstanceButtonText=\\u091F\\u093E\\u0907\\u0932 \\u091C\\u094B\\u095C\\u0947\\u0902\n\n\nContentFinder.Categories.Applications.Title=\\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928\nContentFinder.Widgets.Tiles.Title=\\u091F\\u093E\\u0907\\u0932\nContentFinder.Widgets.Tiles.Description=\\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 \\u0915\\u0947 \\u0926\\u0943\\u0936\\u094D\\u092F \\u092A\\u094D\\u0930\\u0924\\u093F\\u0928\\u093F\\u0927\\u093F\\u0924\\u094D\\u0935.\nContentFinder.Widgets.Cards.Title=\\u0915\\u093E\\u0930\\u094D\\u0921\nContentFinder.Widgets.Cards.Description=\\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 \\u0915\\u0947 \\u0926\\u0943\\u0936\\u094D\\u092F \\u092A\\u094D\\u0930\\u0924\\u093F\\u0928\\u093F\\u0927\\u093F\\u0924\\u094D\\u0935, \\u0932\\u091A\\u0940\\u0932\\u093E \\u0932\\u0947\\u0906\\u0909\\u091F \\u092E\\u0947\\u0902 \\u092A\\u094D\\u0930\\u0926\\u0930\\u094D\\u0936\\u093F\\u0924 \\u0915\\u093F\\u092F\\u093E \\u0917\\u092F\\u093E.\n\nWorkPage.CardEditor.Save=\\u0938\\u0939\\u0947\\u091C\\u0947\\u0902\nWorkPage.CardEditor.Cancel=\\u0930\\u0926\\u094D\\u0926 \\u0915\\u0930\\u0947\\u0902\nWorkPage.CardEditor.Title="{0}" \\u0915\\u0949\\u0928\\u094D\\u092B\\u093C\\u093F\\u0917\\u0930 \\u0915\\u0930\\u0947\\u0902\nWorkPage.CardEditor.Title.NoCardTitle=\\u0915\\u0949\\u0928\\u094D\\u092B\\u093C\\u093F\\u0917\\u0930 \\u0915\\u0930\\u0947\\u0902\nWorkPage.Card.ActionDefinition.Configure=\\u0915\\u0949\\u0928\\u094D\\u092B\\u093C\\u093F\\u0917\\u0930 \\u0915\\u0930\\u0947\\u0902\nWorkPage.Card.ActionDefinition.Reset=\\u0915\\u0949\\u0928\\u094D\\u095E\\u093F\\u0917\\u0930\\u0947\\u0936\\u0928 \\u0939\\u091F\\u093E\\u090F\\u0902\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\u0935\\u0930\\u094D\\u0924\\u092E\\u093E\\u0928 \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=SAP Build Work Zone \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u0940 ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=\\u0935\\u0930\\u094D\\u0924\\u092E\\u093E\\u0928 \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u0940 ID. \\u0932\\u0949\\u0917 \\u0911\\u0928 \\u0915\\u0930\\u0928\\u0947 \\u0935\\u093E\\u0932\\u0947 \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u0947 \\u0906\\u0927\\u093E\\u0930 \\u092A\\u0930 \\u092E\\u0942\\u0932\\u094D\\u092F \\u092E\\u0947\\u0902 \\u092A\\u0930\\u093F\\u0935\\u0930\\u094D\\u0924\\u0928 \\u0915\\u093F\\u092F\\u093E \\u091C\\u093E\\u090F\\u0917\\u093E. \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u093E \\u0928\\u093E\\u092E \\u0926\\u093F\\u0916\\u093E\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093F\\u090F, SAP Build Work Zone \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u093E \\u0928\\u093E\\u092E \\u0909\\u092A\\u092F\\u094B\\u0917 \\u0915\\u0930\\u0947\\u0902.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=SAP Build Work Zone \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u093E \\u0928\\u093E\\u092E\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0928\\u093E\\u092E\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\u092A\\u094D\\u0930\\u0925\\u092E, \\u092E\\u0927\\u094D\\u092F \\u0914\\u0930 \\u0905\\u0902\\u0924\\u093F\\u092E \\u0928\\u093E\\u092E \\u0915\\u0947 \\u0938\\u093E\\u0925 \\u0935\\u0930\\u094D\\u0924\\u092E\\u093E\\u0928 \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u093E \\u0928\\u093E\\u092E. \\u092E\\u0927\\u094D\\u092F \\u0928\\u093E\\u092E \\u0938\\u0902\\u0915\\u094D\\u0937\\u093F\\u092A\\u094D\\u0924 \\u0915\\u093F\\u092F\\u093E \\u091C\\u093E\\u090F\\u0917\\u093E. \\u0932\\u0949\\u0917 \\u0911\\u0928 \\u0915\\u0930\\u0928\\u0947 \\u0935\\u093E\\u0932\\u0947 \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u0947 \\u0906\\u0927\\u093E\\u0930 \\u092A\\u0930 \\u092E\\u0942\\u0932\\u094D\\u092F \\u092E\\u0947\\u0902 \\u092A\\u0930\\u093F\\u0935\\u0930\\u094D\\u0924\\u0928 \\u0915\\u093F\\u092F\\u093E \\u091C\\u093E\\u090F\\u0917\\u093E.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=SAP Build Work Zone \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u093E \\u092A\\u094D\\u0930\\u0925\\u092E \\u0928\\u093E\\u092E\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u092A\\u094D\\u0930\\u0925\\u092E \\u0928\\u093E\\u092E\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\u0935\\u0930\\u094D\\u0924\\u092E\\u093E\\u0928 \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u093E \\u092A\\u094D\\u0930\\u0925\\u092E \\u0928\\u093E\\u092E. \\u0932\\u0949\\u0917 \\u0911\\u0928 \\u0915\\u0930\\u0928\\u0947 \\u0935\\u093E\\u0932\\u0947 \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u0947 \\u0906\\u0927\\u093E\\u0930 \\u092A\\u0930 \\u092E\\u0942\\u0932\\u094D\\u092F \\u092E\\u0947\\u0902 \\u092A\\u0930\\u093F\\u0935\\u0930\\u094D\\u0924\\u0928 \\u0915\\u093F\\u092F\\u093E \\u091C\\u093E\\u090F\\u0917\\u093E.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=SAP Build Work Zone \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u093E \\u0905\\u0902\\u0924\\u093F\\u092E \\u0928\\u093E\\u092E\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0905\\u0902\\u0924\\u093F\\u092E \\u0928\\u093E\\u092E\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\u0935\\u0930\\u094D\\u0924\\u092E\\u093E\\u0928 \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u093E \\u0905\\u0902\\u0924\\u093F\\u092E \\u0928\\u093E\\u092E. \\u0932\\u0949\\u0917 \\u0911\\u0928 \\u0915\\u0930\\u0928\\u0947 \\u0935\\u093E\\u0932\\u0947 \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u0947 \\u0906\\u0927\\u093E\\u0930 \\u092A\\u0930 \\u092E\\u0942\\u0932\\u094D\\u092F \\u092E\\u0947\\u0902 \\u092A\\u0930\\u093F\\u0935\\u0930\\u094D\\u0924\\u0928 \\u0915\\u093F\\u092F\\u093E \\u091C\\u093E\\u090F\\u0917\\u093E.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\u0935\\u0930\\u094D\\u0924\\u092E\\u093E\\u0928 SAP Build Work Zone \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u093E \\u0908\\u092E\\u0947\\u0932 \\u092A\\u0924\\u093E\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0908\\u092E\\u0947\\u0932\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u0935\\u0930\\u094D\\u0924\\u092E\\u093E\\u0928 SAP Build Work Zone \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u093E \\u0908\\u092E\\u0947\\u0932 \\u092A\\u0924\\u093E. \\u0932\\u0949\\u0917 \\u0911\\u0928 \\u0915\\u0930\\u0928\\u0947 \\u0935\\u093E\\u0932\\u0947 \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u0947 \\u0906\\u0927\\u093E\\u0930 \\u092A\\u0930 \\u092E\\u0942\\u0932\\u094D\\u092F \\u092E\\u0947\\u0902 \\u092A\\u0930\\u093F\\u0935\\u0930\\u094D\\u0924\\u0928 \\u0915\\u093F\\u092F\\u093E \\u091C\\u093E\\u090F\\u0917\\u093E.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u0915\\u0949\\u0928\\u094D\\u095E\\u093F\\u0917\\u0930\\u0947\\u0936\\u0928 \\u0939\\u091F\\u093E\\u090F\\u0902\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u0907\\u0938 \\u0915\\u093E\\u0930\\u094D\\u0921 \\u092E\\u0947\\u0902 \\u0935\\u094D\\u092F\\u0915\\u094D\\u0924\\u093F\\u0917\\u0924 \\u0915\\u0949\\u0928\\u094D\\u092B\\u093C\\u093F\\u0917\\u0930\\u0947\\u0936\\u0928 \\u0939\\u0948\\u0902. \\u0915\\u094D\\u092F\\u093E \\u0906\\u092A \\u0909\\u0928\\u094D\\u0939\\u0947\\u0902 \\u0905\\u0916\\u0902\\u0921\\u0928\\u0940\\u092F \\u0930\\u0942\\u092A \\u0938\\u0947 \\u0939\\u091F\\u093E\\u0928\\u093E \\u091A\\u093E\\u0939\\u0924\\u0947 \\u0939\\u0948\\u0902 \\u0914\\u0930 \\u0915\\u093E\\u0930\\u094D\\u0921 \\u0915\\u094B \\u0909\\u0938\\u0915\\u0940 \\u0921\\u093F\\u092B\\u093C\\u0949\\u0932\\u094D\\u091F \\u0938\\u0947\\u091F\\u093F\\u0902\\u0917 \\u092A\\u0930 \\u0930\\u0940\\u0938\\u0947\\u091F \\u0915\\u0930\\u0928\\u093E \\u091A\\u093E\\u0939\\u0924\\u0947 \\u0939\\u0948\\u0902?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u0939\\u091F\\u093E\\u090F\\u0902\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u0930\\u0926\\u094D\\u0926 \\u0915\\u0930\\u0947\\u0902\n',
  "sap/ushell/components/workPageBuilder/resources/resources_hr.properties":
    '\n\nWorkPage.EmptyPage.Title=Prazna stranica\nWorkPage.EmptyPage.Message=Ova stranica jo\\u0161 uvijek ne sadr\\u017Eava odjeljke.\nWorkPage.EmptyPage.Button.Add=Dodaj odjeljak\n\nWorkPage.EditMode.Save=Snimi\nWorkPage.EditMode.Cancel=Otka\\u017Ei\nWorkPage.Message.WidgetMoved=Miniaplikacija premje\\u0161tena\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Naslov odjeljka\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Unesite opcionalni naslov odjeljka\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Ukloni odjeljak\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Izbri\\u0161i odjeljak\nWorkPage.Row.DeleteDialog.Title=Izbri\\u0161i\nWorkPage.Row.DeleteDialog.ConfirmText=\\u017Delite li izbrisati ovaj odjeljak i sav njegov sadr\\u017Eaj?\nWorkPage.Row.DeleteDialog.Button.Confirm=Izbri\\u0161i\nWorkPage.Row.DeleteDialog.Button.Cancel=Otka\\u017Ei\nWorkPage.Row.AddRowButtonTooltip=Dodaj odjeljak\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=U vremenu izvo\\u0111enja bit \\u0107e vidljiva samo prva \\u010Detiri stupca. Smanjite broj stupaca na \\u010Detiri.\nWorkPage.Row.AriaLabel=Odjeljci radne stranice\n\nWorkPage.Column.AriaLabel=Stupac {0} od {1}\nWorkPage.Column.AddWidgetButtonText=Dodaj miniaplikaciju\nWorkPage.Column.DeleteColumnButtonTooltip=Ukloni stupac\nWorkPage.Column.AddColumnButtonTooltip=Dodaj stupac\nWorkPage.Column.EmptyIllustrationTitle=Tra\\u017Ei aplikacije\nWorkPage.Column.EmptyIllustrationDescription=Dodaj aplikacije miniaplikaciji ili uklonite miniaplikaciju ako vam nije potrebna.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Dodaj aplikaciju\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Izbri\\u0161i miniaplikaciju\nWorkPage.Cell.EmptyIllustrationTitle=Tra\\u017Ei aplikacije\nWorkPage.Cell.EmptyIllustrationDescription=Dodaj aplikacije miniaplikaciji ili uklonite miniaplikaciju ako vam nije potrebna.\nWorkPage.Cell.DeleteDialog.Title=Izbri\\u0161i\nWorkPage.Cell.DeleteDialog.ConfirmText=Jeste li sigurni da \\u017Eelite izbrisati ovu miniaplikaciju? Sve aplikacije u njoj tako\\u0111er \\u0107e biti uklonjene sa stranice.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Izbri\\u0161i\nWorkPage.Cell.DeleteDialog.Button.Cancel=Otka\\u017Ei\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Otvori postave miniaplikacije\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Izbri\\u0161i miniaplikaciju\n\nWorkPage.Section.AddVizInstanceButtonText=Dodaj podekrane\n\n\nContentFinder.Categories.Applications.Title=Aplikacije\nContentFinder.Widgets.Tiles.Title=Podekrani\nContentFinder.Widgets.Tiles.Description=Vizualni prikaz aplikacija.\nContentFinder.Widgets.Cards.Title=Kartice\nContentFinder.Widgets.Cards.Description=Vizualni prikazi aplikacija prikazani u fleksibilnim layoutima.\n\nWorkPage.CardEditor.Save=Snimi\nWorkPage.CardEditor.Cancel=Otka\\u017Ei\nWorkPage.CardEditor.Title=Konfiguriranje {0}"\nWorkPage.CardEditor.Title.NoCardTitle=Konfiguriranje\nWorkPage.Card.ActionDefinition.Configure=Konfiguriraj\nWorkPage.Card.ActionDefinition.Reset=Izbri\\u0161i konfiguraciju\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Trenuta\\u010Dni korisnik\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID korisnika za SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID korisnika za SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID trenuta\\u010Dnog korisnika. Vrijednost \\u0107e se promijeniti zavisno o prijavljenom korisniku. Kako biste prikazali ime korisnika, upotrijebite ime korisnika za SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Ime korisnika za SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Ime korisnika za SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Ime trenuta\\u010Dnog korisnika s imenom, srednjim imenom i prezimenom. Srednje ime bit \\u0107e skra\\u0107eno. Vrijednost \\u0107e se promijeniti zavisno o prijavljenom korisniku.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Ime korisnika za SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Ime korisnika za SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Ime trenuta\\u010Dnog korisnika. Vrijednost \\u0107e se promijeniti zavisno o prijavljenom korisniku.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Prezime korisnika za SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Prezime korisnika za SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Prezime trenuta\\u010Dnog korisnika. Vrijednost \\u0107e se promijeniti zavisno o prijavljenom korisniku.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=E-adresa trenuta\\u010Dnog korisnika za SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-adresa korisnika za SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=E-adresa trenuta\\u010Dnog korisnika za SAP Build Work Zone. Vrijednost \\u0107e se promijeniti zavisno o prijavljenom korisniku.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Izbri\\u0161i konfiguraciju\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Ova kartica ima pojedina\\u010Dne konfiguracije. \\u017Delite li ih neopozivo izbrisati i ponovo postaviti karticu na njezine preddefinirane postave?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Izbri\\u0161i\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Otka\\u017Ei\n',
  "sap/ushell/components/workPageBuilder/resources/resources_hu.properties":
    "\n\nWorkPage.EmptyPage.Title=\\u00DCres oldal\nWorkPage.EmptyPage.Message=Ezen az oldalon m\\u00E9g nincsenek szakaszok.\nWorkPage.EmptyPage.Button.Add=Szakasz hozz\\u00E1ad\\u00E1sa\n\nWorkPage.EditMode.Save=Ment\\u00E9s\nWorkPage.EditMode.Cancel=M\\u00E9gse\nWorkPage.Message.WidgetMoved=Widget \\u00E1thelyezve\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Szakasz c\\u00EDme\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Adja meg a szakasz c\\u00EDm\\u00E9t (nem k\\u00F6telez\\u0151)\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Szakasz elt\\u00E1vol\\u00EDt\\u00E1sa\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Szakasz t\\u00F6rl\\u00E9se\nWorkPage.Row.DeleteDialog.Title=T\\u00F6rl\\u00E9s\nWorkPage.Row.DeleteDialog.ConfirmText=Biztosan t\\u00F6rli ezt a szakaszt \\u00E9s annak teljes tartalm\\u00E1t?\nWorkPage.Row.DeleteDialog.Button.Confirm=T\\u00F6rl\\u00E9s\nWorkPage.Row.DeleteDialog.Button.Cancel=M\\u00E9gse\nWorkPage.Row.AddRowButtonTooltip=Szakasz hozz\\u00E1ad\\u00E1sa\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Fut\\u00E1sid\\u0151ben csak az els\\u0151 n\\u00E9gy oszlop lesz l\\u00E1that\\u00F3. Cs\\u00F6kkentse n\\u00E9gyre az oszlopok sz\\u00E1m\\u00E1t.\nWorkPage.Row.AriaLabel=Munkaoldal szakaszai\n\nWorkPage.Column.AriaLabel={0} / {1} oszlop\nWorkPage.Column.AddWidgetButtonText=Widget hozz\\u00E1ad\\u00E1sa\nWorkPage.Column.DeleteColumnButtonTooltip=Oszlop elt\\u00E1vol\\u00EDt\\u00E1sa\nWorkPage.Column.AddColumnButtonTooltip=Oszlop hozz\\u00E1ad\\u00E1sa\nWorkPage.Column.EmptyIllustrationTitle=Alkalmaz\\u00E1sok keres\\u00E9se\nWorkPage.Column.EmptyIllustrationDescription=Adjon hozz\\u00E1 alkalmaz\\u00E1sokat a widgethez, vagy t\\u00E1vol\\u00EDtsa el a widgetet, ha m\\u00E1r nincs r\\u00E1 sz\\u00FCks\\u00E9ge.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Alkalmaz\\u00E1s hozz\\u00E1ad\\u00E1sa\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Widget t\\u00F6rl\\u00E9se\nWorkPage.Cell.EmptyIllustrationTitle=Alkalmaz\\u00E1sok keres\\u00E9se\nWorkPage.Cell.EmptyIllustrationDescription=Adjon hozz\\u00E1 alkalmaz\\u00E1sokat a widgethez, vagy t\\u00E1vol\\u00EDtsa el a widgetet, ha m\\u00E1r nincs r\\u00E1 sz\\u00FCks\\u00E9ge.\nWorkPage.Cell.DeleteDialog.Title=T\\u00F6rl\\u00E9s\nWorkPage.Cell.DeleteDialog.ConfirmText=Biztosan t\\u00F6rli ezt a widgetet? Minden benne l\\u00E9v\\u0151 alkalmaz\\u00E1s is el lesz t\\u00E1vol\\u00EDtva err\\u0151l az oldalr\\u00F3l.\nWorkPage.Cell.DeleteDialog.Button.Confirm=T\\u00F6rl\\u00E9s\nWorkPage.Cell.DeleteDialog.Button.Cancel=M\\u00E9gse\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Widgetbe\\u00E1ll\\u00EDt\\u00E1sok megnyit\\u00E1sa\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Widget t\\u00F6rl\\u00E9se\n\nWorkPage.Section.AddVizInstanceButtonText=Csemp\\u00E9k hozz\\u00E1ad\\u00E1sa\n\n\nContentFinder.Categories.Applications.Title=Alkalmaz\\u00E1sok\nContentFinder.Widgets.Tiles.Title=Csemp\\u00E9k\nContentFinder.Widgets.Tiles.Description=Alkalmaz\\u00E1sok vizu\\u00E1lis megjelen\\u00EDt\\u00E9se.\nContentFinder.Widgets.Cards.Title=K\\u00E1rty\\u00E1k\nContentFinder.Widgets.Cards.Description=Alkalmaz\\u00E1sok vizu\\u00E1lis megjelen\\u00EDt\\u00E9se, rugalmas elrendez\\u00E9ssel.\n\nWorkPage.CardEditor.Save=Ment\\u00E9s\nWorkPage.CardEditor.Cancel=M\\u00E9gse\nWorkPage.CardEditor.Title={0} konfigur\\u00E1l\\u00E1sa\nWorkPage.CardEditor.Title.NoCardTitle=Konfigur\\u00E1l\\u00E1s\nWorkPage.Card.ActionDefinition.Configure=Konfigur\\u00E1l\\u00E1s\nWorkPage.Card.ActionDefinition.Reset=Konfigur\\u00E1ci\\u00F3 t\\u00F6rl\\u00E9se\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Jelenlegi felhaszn\\u00E1l\\u00F3\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=SAP Build Work Zone-felhaszn\\u00E1l\\u00F3 azonos\\u00EDt\\u00F3ja\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone-felhaszn\\u00E1l\\u00F3 azonos\\u00EDt\\u00F3ja\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=A jelenlegi felhaszn\\u00E1l\\u00F3 azonos\\u00EDt\\u00F3ja. Az \\u00E9rt\\u00E9k az \\u00E9ppen bejelentkezett felhaszn\\u00E1l\\u00F3t\\u00F3l f\\u00FCgg\\u0151en v\\u00E1ltozik. A felhaszn\\u00E1l\\u00F3 nev\\u00E9nek megjelen\\u00EDt\\u00E9s\\u00E9hez haszn\\u00E1lja az SAP Build Work Zone-felhaszn\\u00E1l\\u00F3 neve lehet\\u0151s\\u00E9get.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=SAP Build Work Zone-felhaszn\\u00E1l\\u00F3 neve\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone-felhaszn\\u00E1l\\u00F3 neve\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=A jelenlegi felhaszn\\u00E1l\\u00F3 vezet\\u00E9k-, k\\u00F6z\\u00E9ps\\u0151 \\u00E9s ut\\u00F3neve. A k\\u00F6z\\u00E9ps\\u0151 n\\u00E9v r\\u00F6vid\\u00EDtve jelenik meg. Az \\u00E9rt\\u00E9k az \\u00E9ppen bejelentkezett felhaszn\\u00E1l\\u00F3t\\u00F3l f\\u00FCgg\\u0151en v\\u00E1ltozik.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=SAP Build Work Zone-felhaszn\\u00E1l\\u00F3 ut\\u00F3neve\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone-felhaszn\\u00E1l\\u00F3 ut\\u00F3neve\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=A jelenlegi felhaszn\\u00E1l\\u00F3 ut\\u00F3neve. Az \\u00E9rt\\u00E9k az \\u00E9ppen bejelentkezett felhaszn\\u00E1l\\u00F3t\\u00F3l f\\u00FCgg\\u0151en v\\u00E1ltozik.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=SAP Build Work Zone-felhaszn\\u00E1l\\u00F3 vezet\\u00E9kneve\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone-felhaszn\\u00E1l\\u00F3 vezet\\u00E9kneve\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=A jelenlegi felhaszn\\u00E1l\\u00F3 vezet\\u00E9kneve. Az \\u00E9rt\\u00E9k az \\u00E9ppen bejelentkezett felhaszn\\u00E1l\\u00F3t\\u00F3l f\\u00FCgg\\u0151en v\\u00E1ltozik.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=A jelenlegi SAP Build Work Zone-felhaszn\\u00E1l\\u00F3 e-mail-c\\u00EDme\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone-felhaszn\\u00E1l\\u00F3 e-mail-c\\u00EDme\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=A jelenlegi SAP Build Work Zone-felhaszn\\u00E1l\\u00F3 e-mail-c\\u00EDme. Az \\u00E9rt\\u00E9k az \\u00E9ppen bejelentkezett felhaszn\\u00E1l\\u00F3t\\u00F3l f\\u00FCgg\\u0151en v\\u00E1ltozik.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Konfigur\\u00E1ci\\u00F3 t\\u00F6rl\\u00E9se\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Ennek a k\\u00E1rty\\u00E1nak egyedi konfigur\\u00E1ci\\u00F3i vannak. V\\u00E9gleg t\\u00F6rli ezeket, \\u00E9s vissza\\u00E1ll\\u00EDtja a k\\u00E1rtya alap\\u00E9rtelmezett be\\u00E1ll\\u00EDt\\u00E1sait?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=T\\u00F6rl\\u00E9s\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=M\\u00E9gse\n",
  "sap/ushell/components/workPageBuilder/resources/resources_id.properties":
    '\n\nWorkPage.EmptyPage.Title=Halaman Kosong\nWorkPage.EmptyPage.Message=Halaman ini belum berisi bagian apa pun.\nWorkPage.EmptyPage.Button.Add=Tambahkan Bagian\n\nWorkPage.EditMode.Save=Simpan\nWorkPage.EditMode.Cancel=Batalkan\nWorkPage.Message.WidgetMoved=Widget dipindahkan\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Judul Bagian\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Masukkan judul bagian opsional\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Hapus Bagian\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Hapus Permanen Bagian\nWorkPage.Row.DeleteDialog.Title=Hapus Permanen\nWorkPage.Row.DeleteDialog.ConfirmText=Apakah Anda ingin menghapus permanen bagian ini dan semua kontennya?\nWorkPage.Row.DeleteDialog.Button.Confirm=Hapus Permanen\nWorkPage.Row.DeleteDialog.Button.Cancel=Batalkan\nWorkPage.Row.AddRowButtonTooltip=Tambahkan Bagian\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Saat runtime, hanya empat kolom pertama yang dapat dilihat. Silakan kurangi jumlah kolom menjadi empat.\nWorkPage.Row.AriaLabel=Bagian Halaman Kerja\n\nWorkPage.Column.AriaLabel=Kolom {0} dari {1}\nWorkPage.Column.AddWidgetButtonText=Tambahkan Widget\nWorkPage.Column.DeleteColumnButtonTooltip=Hapus Kolom\nWorkPage.Column.AddColumnButtonTooltip=Tambahkan Kolom\nWorkPage.Column.EmptyIllustrationTitle=Cari Aplikasi\nWorkPage.Column.EmptyIllustrationDescription=Tambahkan aplikasi ke widget atau hapus widget jika tidak diperlukan.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Tambah Aplikasi\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Hapus Permanen Widget\nWorkPage.Cell.EmptyIllustrationTitle=Cari Aplikasi\nWorkPage.Cell.EmptyIllustrationDescription=Tambahkan aplikasi ke widget atau hapus widget jika tidak diperlukan.\nWorkPage.Cell.DeleteDialog.Title=Hapus Permanen\nWorkPage.Cell.DeleteDialog.ConfirmText=Apakah Anda yakin ingin menghapus permanen widget ini? Semua aplikasi di dalamnya juga akan dihapus dari halaman.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Hapus Permanen\nWorkPage.Cell.DeleteDialog.Button.Cancel=Batalkan\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Buka pengaturan widget\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Hapus Permanen Widget\n\nWorkPage.Section.AddVizInstanceButtonText=Tambahkan Ubin\n\n\nContentFinder.Categories.Applications.Title=Aplikasi\nContentFinder.Widgets.Tiles.Title=Ubin\nContentFinder.Widgets.Tiles.Description=Representasi visual aplikasi.\nContentFinder.Widgets.Cards.Title=Kartu\nContentFinder.Widgets.Cards.Description=Representasi visual aplikasi, yang ditampilkan dalam tata letak yang fleksibel.\n\nWorkPage.CardEditor.Save=Simpan\nWorkPage.CardEditor.Cancel=Batalkan\nWorkPage.CardEditor.Title=Konfigurasikan "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Konfigurasikan\nWorkPage.Card.ActionDefinition.Configure=Konfigurasikan\nWorkPage.Card.ActionDefinition.Reset=Hapus Permanen Konfigurasi\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Pengguna Saat Ini\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID pengguna saat ini. Nilai akan berubah berdasarkan pengguna yang masuk. Untuk menampilkan nama pengguna, gunakan Nama Pengguna SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Nama Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Nama Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Nama pengguna saat ini dengan nama depan, tengah, dan nama belakang. Nama tengah akan disingkat. Nilai akan berubah berdasarkan pengguna yang masuk.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Nama Depan Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Nama Depan Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Nama depan pengguna saat ini. Nilai akan berubah berdasarkan pengguna yang masuk.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Nama Belakang Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Nama Belakang Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Nama belakang pengguna saat ini. Nilai akan berubah berdasarkan pengguna yang masuk.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Alamat Email Pengguna SAP Build Work Zone Saat Ini\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=Email Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Alamat email pengguna SAP Build Work Zone saat ini. Nilai akan berubah berdasarkan pengguna yang masuk.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Hapus Permanen Konfigurasi\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Kartu ini memiliki konfigurasi individu. Apakah Anda ingin menghapusnya secara permanen dan mengatur ulang kartu ke pengaturan default?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Hapus Permanen\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Batalkan\n',
  "sap/ushell/components/workPageBuilder/resources/resources_it.properties":
    "\n\nWorkPage.EmptyPage.Title=Pagina vuota\nWorkPage.EmptyPage.Message=Questa pagina non contiene ancora sezioni.\nWorkPage.EmptyPage.Button.Add=Aggiungi sezione\n\nWorkPage.EditMode.Save=Salva\nWorkPage.EditMode.Cancel=Annulla\nWorkPage.Message.WidgetMoved=Widget spostato\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Titolo sezione\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Inserisci un titolo di sezione facoltativo\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Rimuovi sezione\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Elimina sezione\nWorkPage.Row.DeleteDialog.Title=Elimina\nWorkPage.Row.DeleteDialog.ConfirmText=Eliminare questa sezione e l\\u2019intero contenuto?\nWorkPage.Row.DeleteDialog.Button.Confirm=Elimina\nWorkPage.Row.DeleteDialog.Button.Cancel=Annulla\nWorkPage.Row.AddRowButtonTooltip=Aggiungi sezione\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Nel run-time, saranno visibili solo le prime quattro colonne. Ridurre il numero di colonne a quattro.\nWorkPage.Row.AriaLabel=Sezioni pagina lavoro\n\nWorkPage.Column.AriaLabel=Colonna {0} di {1}\nWorkPage.Column.AddWidgetButtonText=Aggiungi widget\nWorkPage.Column.DeleteColumnButtonTooltip=Rimuovi colonna\nWorkPage.Column.AddColumnButtonTooltip=Aggiungi colonna\nWorkPage.Column.EmptyIllustrationTitle=Cerca app\nWorkPage.Column.EmptyIllustrationDescription=Aggiungere app al widget o rimuovere il widget se non \\u00E8 necessario.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Aggiungi app\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Elimina widget\nWorkPage.Cell.EmptyIllustrationTitle=Cerca app\nWorkPage.Cell.EmptyIllustrationDescription=Aggiungere app al widget o rimuovere il widget se non \\u00E8 necessario.\nWorkPage.Cell.DeleteDialog.Title=Elimina\nWorkPage.Cell.DeleteDialog.ConfirmText=Confermare l\\u2019eliminazione di questo widget? Anche tutte le app in esso contenute verranno rimosse dalla pagina.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Elimina\nWorkPage.Cell.DeleteDialog.Button.Cancel=Annulla\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Apri impostazioni widget\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Elimina widget\n\nWorkPage.Section.AddVizInstanceButtonText=Aggiungi tiles\n\n\nContentFinder.Categories.Applications.Title=Applicazioni\nContentFinder.Widgets.Tiles.Title=Tiles\nContentFinder.Widgets.Tiles.Description=Rappresentazione visiva delle app.\nContentFinder.Widgets.Cards.Title=Schede\nContentFinder.Widgets.Cards.Description=Rappresentazione visiva delle app, visualizzata in layout flessibili.\n\nWorkPage.CardEditor.Save=Salva\nWorkPage.CardEditor.Cancel=Annulla\nWorkPage.CardEditor.Title=Configura \"{0}\"\nWorkPage.CardEditor.Title.NoCardTitle=Configura\nWorkPage.Card.ActionDefinition.Configure=Configura\nWorkPage.Card.ActionDefinition.Reset=Elimina configurazione\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Utente attuale\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID dell'utente SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID utente SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID dell'utente attuale. Il valore cambia in base all'utente connesso. Per visualizzare il nome dell'utente, utilizzare Nome dell'utente SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Nome dell'utente SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Nome utente SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Nome dell'utente attuale con nome, secondo nome e cognome. Il secondo nome \\u00E8 abbreviato. Il valore cambia in base all'utente connesso.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Nome dell'utente SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Nome utente SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Nome dell'utente attuale. Il valore cambia in base all'utente connesso.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Cognome dell'utente SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Cognome utente SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Cognome dell'utente attuale. Il valore cambia in base all'utente connesso.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Indirizzo e-mail dell'utente SAP Build Work Zone attuale\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=Indirizzo e-mail utente SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Indirizzo e-mail dell'utente SAP Build Work Zone attuale. Il valore cambia in base all'utente connesso.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Elimina configurazione\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=La scheda ha configurazioni individuali. Eliminarli definitivamente e resettare la scheda alle impostazioni predefinite?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Elimina\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Annulla\n",
  "sap/ushell/components/workPageBuilder/resources/resources_iw.properties":
    '\n\nWorkPage.EmptyPage.Title=\\u05D3\\u05E3 \\u05E8\\u05D9\\u05E7\nWorkPage.EmptyPage.Message=\\u05D4\\u05D3\\u05E3 \\u05D4\\u05D6\\u05D4 \\u05DC\\u05D0 \\u05DE\\u05DB\\u05D9\\u05DC \\u05DE\\u05E7\\u05D8\\u05E2\\u05D9\\u05DD \\u05E2\\u05D3\\u05D9\\u05D9\\u05DF.\nWorkPage.EmptyPage.Button.Add=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05DE\\u05E7\\u05D8\\u05E2\n\nWorkPage.EditMode.Save=\\u05E9\\u05DE\\u05D5\\u05E8\nWorkPage.EditMode.Cancel=\\u05D1\\u05D8\\u05DC\nWorkPage.Message.WidgetMoved=\\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D5\\u05DF Widget \\u05D4\\u05D5\\u05E2\\u05D1\\u05E8\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA \\u05DE\\u05E7\\u05D8\\u05E2\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u05D4\\u05D6\\u05DF \\u05DB\\u05D5\\u05EA\\u05E8\\u05EA \\u05D0\\u05D5\\u05E4\\u05E6\\u05D9\\u05D5\\u05E0\\u05D0\\u05DC\\u05D9\\u05EA \\u05E9\\u05DC \\u05DE\\u05E7\\u05D8\\u05E2\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\u05D4\\u05E1\\u05E8 \\u05DE\\u05E7\\u05D8\\u05E2\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u05DE\\u05D7\\u05E7 \\u05DE\\u05E7\\u05D8\\u05E2\nWorkPage.Row.DeleteDialog.Title=\\u05DE\\u05D7\\u05E7\nWorkPage.Row.DeleteDialog.ConfirmText=\\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05DE\\u05D7\\u05D5\\u05E7 \\u05D0\\u05EA \\u05D4\\u05DE\\u05E7\\u05D8\\u05E2 \\u05D5\\u05D0\\u05EA \\u05DB\\u05DC \\u05D4\\u05EA\\u05D5\\u05DB\\u05DF \\u05E9\\u05DC\\u05D5?\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u05DE\\u05D7\\u05E7\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u05D1\\u05D8\\u05DC\nWorkPage.Row.AddRowButtonTooltip=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05DE\\u05E7\\u05D8\\u05E2\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u05D1\\u05D6\\u05DE\\u05DF \\u05E8\\u05D9\\u05E6\\u05D4 \\u05E8\\u05E7 \\u05D0\\u05E8\\u05D1\\u05E2 \\u05D4\\u05E2\\u05DE\\u05D5\\u05D3\\u05D5\\u05EA \\u05D4\\u05E8\\u05D0\\u05E9\\u05D5\\u05E0\\u05D5\\u05EA \\u05D9\\u05D4\\u05D9\\u05D5 \\u05D2\\u05DC\\u05D5\\u05D9\\u05D5\\u05EA. \\u05D4\\u05E4\\u05D7\\u05EA \\u05D0\\u05EA \\u05DE\\u05E1\\u05E4\\u05E8 \\u05D4\\u05E2\\u05DE\\u05D5\\u05D3\\u05D5\\u05EA \\u05DC\\u05D0\\u05E8\\u05D1\\u05E2.\nWorkPage.Row.AriaLabel=\\u05DE\\u05E7\\u05D8\\u05E2\\u05D9 \\u05D3\\u05E3 \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\n\nWorkPage.Column.AriaLabel=\\u05E2\\u05DE\\u05D5\\u05D3\\u05D4 {0} \\u05DE\\u05EA\\u05D5\\u05DA {1}\nWorkPage.Column.AddWidgetButtonText=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D5\\u05DF Widget\nWorkPage.Column.DeleteColumnButtonTooltip=\\u05D4\\u05E1\\u05E8 \\u05E2\\u05DE\\u05D5\\u05D3\\u05D4\nWorkPage.Column.AddColumnButtonTooltip=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05E2\\u05DE\\u05D5\\u05D3\\u05D4\nWorkPage.Column.EmptyIllustrationTitle=\\u05D7\\u05E4\\u05E9 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D9\\u05DD\nWorkPage.Column.EmptyIllustrationDescription=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D9\\u05DD \\u05DC\\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D5\\u05DF Widget, \\u05D0\\u05D5 \\u05D4\\u05E1\\u05E8 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D5\\u05DF Widget \\u05D0\\u05DD \\u05D0\\u05D9\\u05DF \\u05DC\\u05DA \\u05E6\\u05D5\\u05E8\\u05DA \\u05D1\\u05D5.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DD\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u05DE\\u05D7\\u05E7 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D5\\u05DF Widget\nWorkPage.Cell.EmptyIllustrationTitle=\\u05D7\\u05E4\\u05E9 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D9\\u05DD\nWorkPage.Cell.EmptyIllustrationDescription=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D9\\u05DD \\u05DC\\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D5\\u05DF Widget, \\u05D0\\u05D5 \\u05D4\\u05E1\\u05E8 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D5\\u05DF Widget \\u05D0\\u05DD \\u05D0\\u05D9\\u05DF \\u05DC\\u05DA \\u05E6\\u05D5\\u05E8\\u05DA \\u05D1\\u05D5.\nWorkPage.Cell.DeleteDialog.Title=\\u05DE\\u05D7\\u05E7\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u05D4\\u05D0\\u05DD \\u05D0\\u05EA\\u05D4 \\u05D1\\u05D8\\u05D5\\u05D7 \\u05E9\\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05DE\\u05D7\\u05D5\\u05E7 \\u05D0\\u05EA \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D5\\u05DF \\u05D4-Widget? \\u05DB\\u05DC \\u05D4\\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D9\\u05DD \\u05E9\\u05D1\\u05D5 \\u05D9\\u05D5\\u05E1\\u05E8\\u05D5 \\u05DE\\u05D4\\u05D3\\u05E3 \\u05D2\\u05DD \\u05DB\\u05DF.\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u05DE\\u05D7\\u05E7\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u05D1\\u05D8\\u05DC\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u05E4\\u05EA\\u05D7 \\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D5\\u05DF Widget\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u05DE\\u05D7\\u05E7 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D5\\u05DF Widget\n\nWorkPage.Section.AddVizInstanceButtonText=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05D0\\u05E8\\u05D9\\u05D7\\u05D9\\u05DD\n\n\nContentFinder.Categories.Applications.Title=\\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D9\\u05DD\nContentFinder.Widgets.Tiles.Title=\\u05D0\\u05E8\\u05D9\\u05D7\\u05D9\\u05DD\nContentFinder.Widgets.Tiles.Description=\\u05D9\\u05D9\\u05E6\\u05D5\\u05D2\\u05D9\\u05DD \\u05D7\\u05D6\\u05D5\\u05EA\\u05D9\\u05D9\\u05DD \\u05E9\\u05DC \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D9\\u05DD.\nContentFinder.Widgets.Cards.Title=\\u05DB\\u05E8\\u05D8\\u05D9\\u05E1\\u05D9\\u05DD\nContentFinder.Widgets.Cards.Description=\\u05D9\\u05D9\\u05E6\\u05D5\\u05D2\\u05D9\\u05DD \\u05D7\\u05D6\\u05D5\\u05EA\\u05D9\\u05D9\\u05DD \\u05E9\\u05DC \\u05D9\\u05D9\\u05E9\\u05D5\\u05DE\\u05D9\\u05DD, \\u05D4\\u05DE\\u05D5\\u05E6\\u05D2\\u05D9\\u05DD \\u05D1\\u05E4\\u05E8\\u05D9\\u05E1\\u05D5\\u05EA \\u05D2\\u05DE\\u05D9\\u05E9\\u05D5\\u05EA.\n\nWorkPage.CardEditor.Save=\\u05E9\\u05DE\\u05D5\\u05E8\nWorkPage.CardEditor.Cancel=\\u05D1\\u05D8\\u05DC\nWorkPage.CardEditor.Title=\\u05E7\\u05D1\\u05E2 \\u05EA\\u05E6\\u05D5\\u05E8\\u05D4 \\u05E9\\u05DC "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=\\u05E7\\u05D1\\u05E2 \\u05EA\\u05E6\\u05D5\\u05E8\\u05D4\nWorkPage.Card.ActionDefinition.Configure=\\u05E7\\u05D1\\u05E2 \\u05EA\\u05E6\\u05D5\\u05E8\\u05D4\nWorkPage.Card.ActionDefinition.Reset=\\u05DE\\u05D7\\u05E7 \\u05EA\\u05E6\\u05D5\\u05E8\\u05D4\n\nWorkPage.Host.Context.WorkZone.Label=\\u05D0\\u05D6\\u05D5\\u05E8 \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05DC SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05E0\\u05D5\\u05DB\\u05D7\\u05D9\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05D0\\u05D6\\u05D5\\u05E8 \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05DC SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05D0\\u05D6\\u05D5\\u05E8 \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05DC SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05E9\\u05DC \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D4\\u05E0\\u05D5\\u05DB\\u05D7\\u05D9. \\u05D4\\u05E2\\u05E8\\u05DA \\u05D9\\u05E9\\u05EA\\u05E0\\u05D4 \\u05E2\\u05DC \\u05E1\\u05DE\\u05DA \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D4\\u05DE\\u05D7\\u05D5\\u05D1\\u05E8. \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05E6\\u05D9\\u05D2 \\u05D0\\u05EA \\u05E9\\u05DD \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9, \\u05D4\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\'\\u05E9\\u05DD\' \\u05E9\\u05DC \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05D0\\u05D6\\u05D5\\u05E8 \\u05D4\\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05DC SAP Build.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=\\u05E9\\u05DD \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05D0\\u05D6\\u05D5\\u05E8 \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05DC SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=\\u05E9\\u05DD \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05D0\\u05D6\\u05D5\\u05E8 \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05DC SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\u05E9\\u05DD \\u05E9\\u05DC \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D4\\u05E0\\u05D5\\u05DB\\u05D7\\u05D9 \\u05E2\\u05DD \\u05E9\\u05DD \\u05E4\\u05E8\\u05D8\\u05D9, \\u05E9\\u05DD \\u05D0\\u05DE\\u05E6\\u05E2\\u05D9 \\u05D5\\u05E9\\u05DD \\u05DE\\u05E9\\u05E4\\u05D7\\u05D4. \\u05D4\\u05E9\\u05DD \\u05D4\\u05D0\\u05DE\\u05E6\\u05E2\\u05D9 \\u05D9\\u05E7\\u05D5\\u05E6\\u05E8. \\u05D4\\u05E2\\u05E8\\u05DA \\u05D9\\u05E9\\u05EA\\u05E0\\u05D4 \\u05E2\\u05DC \\u05E1\\u05DE\\u05DA \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D4\\u05DE\\u05D7\\u05D5\\u05D1\\u05E8.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=\\u05D4\\u05E9\\u05DD \\u05D4\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05DC \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05D0\\u05D6\\u05D5\\u05E8 \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05DC SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=\\u05E9\\u05DD \\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05DC \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05D0\\u05D6\\u05D5\\u05E8 \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05DC SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\u05D4\\u05E9\\u05DD \\u05D4\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05DC \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D4\\u05E0\\u05D5\\u05DB\\u05D7\\u05D9. \\u05D4\\u05E2\\u05E8\\u05DA \\u05D9\\u05E9\\u05EA\\u05E0\\u05D4 \\u05E2\\u05DC \\u05E1\\u05DE\\u05DA \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D4\\u05DE\\u05D7\\u05D5\\u05D1\\u05E8.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=\\u05E9\\u05DD \\u05D4\\u05DE\\u05E9\\u05E4\\u05D7\\u05D4 \\u05E9\\u05DC \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05D0\\u05D6\\u05D5\\u05E8 \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05DC SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=\\u05E9\\u05DD \\u05DE\\u05E9\\u05E4\\u05D7\\u05D4 \\u05E9\\u05DC \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05D0\\u05D6\\u05D5\\u05E8 \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05DC SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\u05E9\\u05DD \\u05D4\\u05DE\\u05E9\\u05E4\\u05D7\\u05D4 \\u05E9\\u05DC \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D4\\u05E0\\u05D5\\u05DB\\u05D7\\u05D9. \\u05D4\\u05E2\\u05E8\\u05DA \\u05D9\\u05E9\\u05EA\\u05E0\\u05D4 \\u05E2\\u05DC \\u05E1\\u05DE\\u05DA \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D4\\u05DE\\u05D7\\u05D5\\u05D1\\u05E8.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\u05DB\\u05EA\\u05D5\\u05D1\\u05EA \\u05D3\\u05D5\\u05D0"\\u05DC \\u05E9\\u05DC \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D4\\u05E0\\u05D5\\u05DB\\u05D7\\u05D9 \\u05D1\\u05D0\\u05D6\\u05D5\\u05E8 \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05DC SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=\\u05DB\\u05EA\\u05D5\\u05D1\\u05EA \\u05D3\\u05D5\\u05D0"\\u05DC \\u05E9\\u05DC \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D1\\u05D0\\u05D6\\u05D5\\u05E8 \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05DC SAP Build\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u05DB\\u05EA\\u05D5\\u05D1\\u05EA \\u05D4\\u05D3\\u05D5\\u05D0"\\u05DC \\u05E9\\u05DC \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D4\\u05E0\\u05D5\\u05DB\\u05D7\\u05D9 \\u05D1\\u05D0\\u05D6\\u05D5\\u05E8 \\u05D4\\u05E2\\u05D1\\u05D5\\u05D3\\u05D4 \\u05E9\\u05DC SAP Build. \\u05D4\\u05E2\\u05E8\\u05DA \\u05D9\\u05E9\\u05EA\\u05E0\\u05D4 \\u05E2\\u05DC \\u05E1\\u05DE\\u05DA \\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D4\\u05DE\\u05D7\\u05D5\\u05D1\\u05E8.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u05DE\\u05D7\\u05E7 \\u05EA\\u05E6\\u05D5\\u05E8\\u05D4\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u05DB\\u05E8\\u05D8\\u05D9\\u05E1 \\u05D6\\u05D4 \\u05DB\\u05D5\\u05DC\\u05DC \\u05EA\\u05E6\\u05D5\\u05E8\\u05D5\\u05EA \\u05D9\\u05D7\\u05D9\\u05D3\\u05D5\\u05EA. \\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05DE\\u05D7\\u05D5\\u05E7 \\u05D0\\u05D5\\u05EA\\u05DF \\u05D1\\u05D0\\u05D5\\u05E4\\u05DF \\u05E1\\u05D5\\u05E4\\u05D9 \\u05D5\\u05DC\\u05D0\\u05E4\\u05E1 \\u05D0\\u05EA \\u05D4\\u05DB\\u05E8\\u05D8\\u05D9\\u05E1 \\u05DC\\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA \\u05D1\\u05E8\\u05D9\\u05E8\\u05EA \\u05D4\\u05DE\\u05D7\\u05D3\\u05DC \\u05E9\\u05DC\\u05D5?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u05DE\\u05D7\\u05E7\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u05D1\\u05D8\\u05DC\n',
  "sap/ushell/components/workPageBuilder/resources/resources_ja.properties":
    '\n\nWorkPage.EmptyPage.Title=\\u7A7A\\u767D\\u30DA\\u30FC\\u30B8\nWorkPage.EmptyPage.Message=\\u3053\\u306E\\u30DA\\u30FC\\u30B8\\u306B\\u306F\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u304C\\u307E\\u3060\\u542B\\u307E\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\\u3002\nWorkPage.EmptyPage.Button.Add=\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u3092\\u8FFD\\u52A0\n\nWorkPage.EditMode.Save=\\u4FDD\\u5B58\nWorkPage.EditMode.Cancel=\\u30AD\\u30E3\\u30F3\\u30BB\\u30EB\nWorkPage.Message.WidgetMoved=\\u30A6\\u30A3\\u30B8\\u30A7\\u30C3\\u30C8\\u3092\\u79FB\\u52D5\\u3057\\u307E\\u3057\\u305F\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u30BF\\u30A4\\u30C8\\u30EB\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u30AA\\u30D7\\u30B7\\u30E7\\u30F3\\u306E\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u30BF\\u30A4\\u30C8\\u30EB\\u3092\\u5165\\u529B\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u3092\\u524A\\u9664\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u524A\\u9664\nWorkPage.Row.DeleteDialog.Title=\\u524A\\u9664\nWorkPage.Row.DeleteDialog.ConfirmText=\\u3053\\u306E\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u304A\\u3088\\u3073\\u305D\\u306E\\u3059\\u3079\\u3066\\u306E\\u5185\\u5BB9\\u3092\\u524A\\u9664\\u3057\\u307E\\u3059\\u304B?\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u524A\\u9664\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u30AD\\u30E3\\u30F3\\u30BB\\u30EB\nWorkPage.Row.AddRowButtonTooltip=\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u3092\\u8FFD\\u52A0\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u5B9F\\u884C\\u6642\\u306F\\u3001\\u5148\\u982D\\u306E 4 \\u3064\\u5217\\u306E\\u307F\\u304C\\u8868\\u793A\\u3055\\u308C\\u307E\\u3059\\u3002\\u5217\\u306E\\u6570\\u3092 4 \\u3064\\u307E\\u3067\\u6E1B\\u3089\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\nWorkPage.Row.AriaLabel=\\u30EF\\u30FC\\u30AF\\u30DA\\u30FC\\u30B8\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\n\nWorkPage.Column.AriaLabel=\\u5217 {0} / {1}\nWorkPage.Column.AddWidgetButtonText=\\u30A6\\u30A3\\u30B8\\u30A7\\u30C3\\u30C8\\u3092\\u8FFD\\u52A0\nWorkPage.Column.DeleteColumnButtonTooltip=\\u5217\\u306E\\u524A\\u9664\nWorkPage.Column.AddColumnButtonTooltip=\\u5217\\u306E\\u8FFD\\u52A0\nWorkPage.Column.EmptyIllustrationTitle=\\u30A2\\u30D7\\u30EA\\u306E\\u691C\\u7D22\nWorkPage.Column.EmptyIllustrationDescription=\\u30A2\\u30D7\\u30EA\\u3092\\u30A6\\u30A3\\u30B8\\u30A7\\u30C3\\u30C8\\u306B\\u8FFD\\u52A0\\u3057\\u307E\\u3059\\u3002\\u30A6\\u30A3\\u30B8\\u30A7\\u30C3\\u30C8\\u304C\\u4E0D\\u8981\\u3067\\u3042\\u308B\\u5834\\u5408\\u306F\\u3001\\u305D\\u306E\\u30A6\\u30A3\\u30B8\\u30A7\\u30C3\\u30C8\\u3092\\u524A\\u9664\\u3057\\u307E\\u3059\\u3002\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\u30A2\\u30D7\\u30EA\\u306E\\u8FFD\\u52A0\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u30A6\\u30A3\\u30B8\\u30A7\\u30C3\\u30C8\\u524A\\u9664\nWorkPage.Cell.EmptyIllustrationTitle=\\u30A2\\u30D7\\u30EA\\u306E\\u691C\\u7D22\nWorkPage.Cell.EmptyIllustrationDescription=\\u30A2\\u30D7\\u30EA\\u3092\\u30A6\\u30A3\\u30B8\\u30A7\\u30C3\\u30C8\\u306B\\u8FFD\\u52A0\\u3057\\u307E\\u3059\\u3002\\u30A6\\u30A3\\u30B8\\u30A7\\u30C3\\u30C8\\u304C\\u4E0D\\u8981\\u3067\\u3042\\u308B\\u5834\\u5408\\u306F\\u3001\\u305D\\u306E\\u30A6\\u30A3\\u30B8\\u30A7\\u30C3\\u30C8\\u3092\\u524A\\u9664\\u3057\\u307E\\u3059\\u3002\nWorkPage.Cell.DeleteDialog.Title=\\u524A\\u9664\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u3053\\u306E\\u30A6\\u30A3\\u30B8\\u30A7\\u30C3\\u30C8\\u3092\\u524A\\u9664\\u3057\\u3066\\u3082\\u3088\\u308D\\u3057\\u3044\\u3067\\u3059\\u304B? \\u305D\\u306E\\u3059\\u3079\\u3066\\u306E\\u30A2\\u30D7\\u30EA\\u3082\\u30DA\\u30FC\\u30B8\\u304B\\u3089\\u524A\\u9664\\u3055\\u308C\\u307E\\u3059\\u3002\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u524A\\u9664\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u30AD\\u30E3\\u30F3\\u30BB\\u30EB\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u30A6\\u30A3\\u30B8\\u30A7\\u30C3\\u30C8\\u8A2D\\u5B9A\\u3092\\u958B\\u304F\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u30A6\\u30A3\\u30B8\\u30A7\\u30C3\\u30C8\\u524A\\u9664\n\nWorkPage.Section.AddVizInstanceButtonText=\\u30BF\\u30A4\\u30EB\\u3092\\u8FFD\\u52A0\n\n\nContentFinder.Categories.Applications.Title=\\u30A2\\u30D7\\u30EA\\u30B1\\u30FC\\u30B7\\u30E7\\u30F3\nContentFinder.Widgets.Tiles.Title=\\u30BF\\u30A4\\u30EB\nContentFinder.Widgets.Tiles.Description=\\u30A2\\u30D7\\u30EA\\u306E\\u8996\\u899A\\u7684\\u8868\\u73FE\nContentFinder.Widgets.Cards.Title=\\u30AB\\u30FC\\u30C9\nContentFinder.Widgets.Cards.Description=\\u30D5\\u30EC\\u30AD\\u30B7\\u30D6\\u30EB\\u306A\\u30EC\\u30A4\\u30A2\\u30A6\\u30C8\\u3067\\u8868\\u793A\\u3055\\u308C\\u308B\\u3001\\u30A2\\u30D7\\u30EA\\u306E\\u8996\\u899A\\u7684\\u8868\\u73FE\\u3067\\u3059\\u3002\n\nWorkPage.CardEditor.Save=\\u4FDD\\u5B58\nWorkPage.CardEditor.Cancel=\\u30AD\\u30E3\\u30F3\\u30BB\\u30EB\nWorkPage.CardEditor.Title="{0}" \\u306E\\u8A2D\\u5B9A\nWorkPage.CardEditor.Title.NoCardTitle=\\u8A2D\\u5B9A\nWorkPage.Card.ActionDefinition.Configure=\\u8A2D\\u5B9A\nWorkPage.Card.ActionDefinition.Reset=\\u8A2D\\u5B9A\\u3092\\u524A\\u9664\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\u73FE\\u5728\\u306E\\u30E6\\u30FC\\u30B6\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=SAP Build Work Zone \\u30E6\\u30FC\\u30B6\\u306E ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone \\u30E6\\u30FC\\u30B6 ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=\\u73FE\\u5728\\u306E\\u30E6\\u30FC\\u30B6\\u306E ID\\u3002\\u5024\\u306F\\u30ED\\u30B0\\u30AA\\u30F3\\u3057\\u3066\\u3044\\u308B\\u30E6\\u30FC\\u30B6\\u306B\\u5FDC\\u3058\\u3066\\u5909\\u308F\\u308A\\u307E\\u3059\\u3002\\u30E6\\u30FC\\u30B6\\u306E\\u540D\\u524D\\u3092\\u8868\\u793A\\u3059\\u308B\\u306B\\u306F\\u3001"SAP Build Work Zone \\u30E6\\u30FC\\u30B6\\u306E\\u540D\\u524D" \\u3092\\u4F7F\\u7528\\u3057\\u307E\\u3059\\u3002\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=SAP Build Work Zone \\u30E6\\u30FC\\u30B6\\u306E\\u540D\\u524D\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone \\u30E6\\u30FC\\u30B6\\u540D\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\u73FE\\u5728\\u306E\\u30E6\\u30FC\\u30B6\\u306E\\u540D\\u524D (\\u540D\\u3001\\u30DF\\u30C9\\u30EB\\u30CD\\u30FC\\u30E0\\u3001\\u304A\\u3088\\u3073\\u59D3)\\u3002\\u30DF\\u30C9\\u30EB\\u30CD\\u30FC\\u30E0\\u306F\\u7565\\u79F0\\u3067\\u793A\\u3055\\u308C\\u307E\\u3059\\u3002\\u5024\\u306F\\u30ED\\u30B0\\u30AA\\u30F3\\u3057\\u3066\\u3044\\u308B\\u30E6\\u30FC\\u30B6\\u306B\\u5FDC\\u3058\\u3066\\u5909\\u308F\\u308A\\u307E\\u3059\\u3002\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=SAP Build Work Zone \\u30E6\\u30FC\\u30B6\\u306E\\u540D\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone \\u30E6\\u30FC\\u30B6\\u306E\\u540D\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\u73FE\\u5728\\u306E\\u30E6\\u30FC\\u30B6\\u306E\\u540D\\u3002\\u5024\\u306F\\u30ED\\u30B0\\u30AA\\u30F3\\u3057\\u3066\\u3044\\u308B\\u30E6\\u30FC\\u30B6\\u306B\\u5FDC\\u3058\\u3066\\u5909\\u308F\\u308A\\u307E\\u3059\\u3002\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=SAP Build Work Zone \\u30E6\\u30FC\\u30B6\\u306E\\u59D3\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone \\u30E6\\u30FC\\u30B6\\u306E\\u59D3\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\u73FE\\u5728\\u306E\\u30E6\\u30FC\\u30B6\\u306E\\u59D3\\u3002\\u5024\\u306F\\u30ED\\u30B0\\u30AA\\u30F3\\u3057\\u3066\\u3044\\u308B\\u30E6\\u30FC\\u30B6\\u306B\\u5FDC\\u3058\\u3066\\u5909\\u308F\\u308A\\u307E\\u3059\\u3002\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\u73FE\\u5728\\u306E SAP Build Work Zone \\u30E6\\u30FC\\u30B6\\u306E\\u96FB\\u5B50\\u30E1\\u30FC\\u30EB\\u30A2\\u30C9\\u30EC\\u30B9\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone \\u30E6\\u30FC\\u30B6\\u306E\\u96FB\\u5B50\\u30E1\\u30FC\\u30EB\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u73FE\\u5728\\u306E SAP Build Work Zone \\u30E6\\u30FC\\u30B6\\u306E\\u96FB\\u5B50\\u30E1\\u30FC\\u30EB\\u30A2\\u30C9\\u30EC\\u30B9\\u3002\\u5024\\u306F\\u30ED\\u30B0\\u30AA\\u30F3\\u3057\\u3066\\u3044\\u308B\\u30E6\\u30FC\\u30B6\\u306B\\u5FDC\\u3058\\u3066\\u5909\\u308F\\u308A\\u307E\\u3059\\u3002\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u8A2D\\u5B9A\\u3092\\u524A\\u9664\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306B\\u306F\\u500B\\u5225\\u306E\\u8A2D\\u5B9A\\u304C\\u3042\\u308A\\u307E\\u3059\\u3002\\u3053\\u308C\\u3089\\u306E\\u8A2D\\u5B9A\\u3092\\u5143\\u306B\\u623B\\u305B\\u306A\\u3044\\u3088\\u3046\\u306B\\u524A\\u9664\\u3057\\u3001\\u30AB\\u30FC\\u30C9\\u306E\\u30C7\\u30D5\\u30A9\\u30EB\\u30C8\\u8A2D\\u5B9A\\u306B\\u30EA\\u30BB\\u30C3\\u30C8\\u3057\\u307E\\u3059\\u304B?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u524A\\u9664\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u30AD\\u30E3\\u30F3\\u30BB\\u30EB\n',
  "sap/ushell/components/workPageBuilder/resources/resources_kk.properties":
    '\n\nWorkPage.EmptyPage.Title=\\u0411\\u043E\\u0441 \\u0431\\u0435\\u0442\nWorkPage.EmptyPage.Message=\\u0411\\u04B1\\u043B \\u0431\\u0435\\u0442\\u0442\\u0435 \\u04D9\\u043B\\u0456 \\u0435\\u0448\\u049B\\u0430\\u043D\\u0434\\u0430\\u0439 \\u0431\\u04E9\\u043B\\u0456\\u043C\\u0434\\u0435\\u0440 \\u0436\\u043E\\u049B.\nWorkPage.EmptyPage.Button.Add=\\u0411\\u04E9\\u043B\\u0456\\u043C \\u049B\\u043E\\u0441\\u0443\n\nWorkPage.EditMode.Save=\\u0421\\u0430\\u049B\\u0442\\u0430\\u0443\nWorkPage.EditMode.Cancel=\\u0411\\u043E\\u043B\\u0434\\u044B\\u0440\\u043C\\u0430\\u0443\nWorkPage.Message.WidgetMoved=\\u0416\\u044B\\u043B\\u0436\\u044B\\u0442\\u044B\\u043B\\u0493\\u0430\\u043D \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\u0411\\u04E9\\u043B\\u0456\\u043C \\u0442\\u0430\\u049B\\u044B\\u0440\\u044B\\u0431\\u044B\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u049A\\u043E\\u0441\\u044B\\u043C\\u0448\\u0430 \\u0431\\u04E9\\u043B\\u0456\\u043C \\u0442\\u0430\\u049B\\u044B\\u0440\\u044B\\u0431\\u044B\\u043D \\u0435\\u043D\\u0433\\u0456\\u0437\\u0443\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\u0411\\u04E9\\u043B\\u0456\\u043C\\u0434\\u0456 \\u0436\\u043E\\u044E\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u0411\\u04E9\\u043B\\u0456\\u043C\\u0434\\u0456 \\u0436\\u043E\\u044E\nWorkPage.Row.DeleteDialog.Title=\\u0416\\u043E\\u044E\nWorkPage.Row.DeleteDialog.ConfirmText=\\u0411\\u04B1\\u043B \\u0431\\u04E9\\u043B\\u0456\\u043C \\u043C\\u0435\\u043D \\u043E\\u043D\\u044B\\u04A3 \\u0431\\u0430\\u0440\\u043B\\u044B\\u049B \\u043A\\u043E\\u043D\\u0442\\u0435\\u043D\\u0442\\u0456\\u043D \\u0436\\u043E\\u044E \\u049B\\u0430\\u0436\\u0435\\u0442 \\u043F\\u0435?\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u0416\\u043E\\u044E\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u0411\\u043E\\u043B\\u0434\\u044B\\u0440\\u043C\\u0430\\u0443\nWorkPage.Row.AddRowButtonTooltip=\\u0411\\u04E9\\u043B\\u0456\\u043C \\u049B\\u043E\\u0441\\u0443\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u041E\\u0440\\u044B\\u043D\\u0434\\u0430\\u0443 \\u0443\\u0430\\u049B\\u044B\\u0442\\u044B\\u043D\\u0434\\u0430 \\u0431\\u0456\\u0440\\u0456\\u043D\\u0448\\u0456 \\u0442\\u04E9\\u0440\\u0442 \\u0431\\u0430\\u0493\\u0430\\u043D \\u0493\\u0430\\u043D\\u0430 \\u043A\\u04E9\\u0440\\u0456\\u043D\\u0435\\u0434\\u0456. \\u0411\\u0430\\u0493\\u0430\\u043D\\u0434\\u0430\\u0440 \\u0441\\u0430\\u043D\\u044B\\u043D \\u0442\\u04E9\\u0440\\u0442\\u043A\\u0435 \\u0434\\u0435\\u0439\\u0456\\u043D \\u0430\\u0437\\u0430\\u0439\\u0442\\u044B\\u04A3\\u044B\\u0437.\nWorkPage.Row.AriaLabel=\\u0416\\u04B1\\u043C\\u044B\\u0441 \\u0431\\u0435\\u0442\\u0456\\u043D\\u0456\\u04A3 \\u0431\\u04E9\\u043B\\u0456\\u043C\\u0434\\u0435\\u0440\\u0456\n\nWorkPage.Column.AriaLabel=\\u0411\\u0430\\u0493\\u0430\\u043D\\: {0} / {1}\nWorkPage.Column.AddWidgetButtonText=\\u0412\\u0438\\u0434\\u0436\\u0435\\u0442 \\u049B\\u043E\\u0441\\u0443\nWorkPage.Column.DeleteColumnButtonTooltip=\\u0411\\u0430\\u0493\\u0430\\u043D\\u0434\\u044B \\u0436\\u043E\\u044E\nWorkPage.Column.AddColumnButtonTooltip=\\u0411\\u0430\\u0493\\u0430\\u043D \\u049B\\u043E\\u0441\\u0443\nWorkPage.Column.EmptyIllustrationTitle=\\u049A\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430\\u043B\\u0430\\u0440\\u0434\\u044B \\u0456\\u0437\\u0434\\u0435\\u0443\nWorkPage.Column.EmptyIllustrationDescription=\\u049A\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430\\u043B\\u0430\\u0440\\u0434\\u044B \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442\\u043A\\u0435 \\u049B\\u043E\\u0441\\u0443 \\u043D\\u0435\\u043C\\u0435\\u0441\\u0435 \\u049B\\u0430\\u0436\\u0435\\u0442\\u0441\\u0456\\u0437 \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442\\u0442\\u0456 \\u0436\\u043E\\u044E.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\u049A\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430 \\u049B\\u043E\\u0441\\u0443\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u0412\\u0438\\u0434\\u0436\\u0435\\u0442\\u0442\\u0456 \\u0436\\u043E\\u044E\nWorkPage.Cell.EmptyIllustrationTitle=\\u049A\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430\\u043B\\u0430\\u0440\\u0434\\u044B \\u0456\\u0437\\u0434\\u0435\\u0443\nWorkPage.Cell.EmptyIllustrationDescription=\\u049A\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430\\u043B\\u0430\\u0440\\u0434\\u044B \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442\\u043A\\u0435 \\u049B\\u043E\\u0441\\u0443 \\u043D\\u0435\\u043C\\u0435\\u0441\\u0435 \\u049B\\u0430\\u0436\\u0435\\u0442\\u0441\\u0456\\u0437 \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442\\u0442\\u0456 \\u0436\\u043E\\u044E.\nWorkPage.Cell.DeleteDialog.Title=\\u0416\\u043E\\u044E\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u0411\\u04B1\\u043B \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442\\u0442\\u0456 \\u0436\\u043E\\u044E \\u049B\\u0430\\u0436\\u0435\\u0442\\u0442\\u0456\\u0433\\u0456\\u043D\\u0435 \\u0441\\u0435\\u043D\\u0456\\u043C\\u0434\\u0456\\u0441\\u0456\\u0437 \\u0431\\u0435? \\u041E\\u043D\\u044B\\u04A3 \\u0456\\u0448\\u0456\\u043D\\u0434\\u0435\\u0433\\u0456 \\u0431\\u0430\\u0440\\u043B\\u044B\\u049B \\u049B\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430\\u043B\\u0430\\u0440 \\u0434\\u0430 \\u0431\\u0435\\u0442\\u0442\\u0435\\u043D \\u0436\\u043E\\u0439\\u044B\\u043B\\u0430\\u0434\\u044B.\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u0416\\u043E\\u044E\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u0411\\u043E\\u043B\\u0434\\u044B\\u0440\\u043C\\u0430\\u0443\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u0412\\u0438\\u0434\\u0436\\u0435\\u0442 \\u043F\\u0430\\u0440\\u0430\\u043C\\u0435\\u0442\\u0440\\u043B\\u0435\\u0440\\u0456\\u043D \\u0430\\u0448\\u0443\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u0412\\u0438\\u0434\\u0436\\u0435\\u0442\\u0442\\u0456 \\u0436\\u043E\\u044E\n\nWorkPage.Section.AddVizInstanceButtonText=\\u041F\\u043B\\u0438\\u0442\\u043A\\u0430\\u043B\\u0430\\u0440 \\u049B\\u043E\\u0441\\u0443\n\n\nContentFinder.Categories.Applications.Title=\\u049A\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430\\u043B\\u0430\\u0440\nContentFinder.Widgets.Tiles.Title=\\u041F\\u043B\\u0438\\u0442\\u043A\\u0430\\u043B\\u0430\\u0440\nContentFinder.Widgets.Tiles.Description=\\u049A\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430\\u043B\\u0430\\u0440\\u0434\\u044B\\u04A3 \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u043B\\u0456\\u043C\\u0456.\nContentFinder.Widgets.Cards.Title=\\u041A\\u0430\\u0440\\u0442\\u0430\\u043B\\u0430\\u0440\nContentFinder.Widgets.Cards.Description=\\u0418\\u043A\\u0435\\u043C\\u0434\\u0456 \\u043F\\u0456\\u0448\\u0456\\u043C\\u0434\\u0435 \\u0431\\u0435\\u0440\\u0456\\u043B\\u0433\\u0435\\u043D \\u049B\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430\\u043B\\u0430\\u0440 \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u043B\\u043C\\u0456.\n\nWorkPage.CardEditor.Save=\\u0421\\u0430\\u049B\\u0442\\u0430\\u0443\nWorkPage.CardEditor.Cancel=\\u0411\\u043E\\u043B\\u0434\\u044B\\u0440\\u043C\\u0430\\u0443\nWorkPage.CardEditor.Title="{0}" \\u0442\\u0435\\u04A3\\u0448\\u0435\\u0443\nWorkPage.CardEditor.Title.NoCardTitle=\\u0422\\u0435\\u04A3\\u0448\\u0435\\u0443\nWorkPage.Card.ActionDefinition.Configure=\\u0422\\u0435\\u04A3\\u0448\\u0435\\u0443\nWorkPage.Card.ActionDefinition.Reset=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\\u043D\\u044B \\u0436\\u043E\\u044E\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\u0410\\u0493\\u044B\\u043C\\u0434\\u0430\\u0493\\u044B \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=SAP Build Work Zone \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0441\\u044B\\u043D\\u044B\\u04A3 \\u0438\\u0434.\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B \\u0438\\u0434.\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=\\u0410\\u0493\\u044B\\u043C\\u0434\\u0430\\u0493\\u044B \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u043D\\u044B\\u04A3 \\u0438\\u0434. \\u041C\\u04D9\\u043D \\u0436\\u04AF\\u0439\\u0435\\u0433\\u0435 \\u043A\\u0456\\u0440\\u0433\\u0435\\u043D \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0493\\u0430 \\u0431\\u0430\\u0439\\u043B\\u0430\\u043D\\u044B\\u0441\\u0442\\u044B \\u04E9\\u0437\\u0433\\u0435\\u0440\\u0435\\u0434\\u0456. \\u041F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B \\u0430\\u0442\\u044B\\u043D \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0443 \\u04AF\\u0448\\u0456\\u043D SAP Build Work Zone \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0441\\u044B\\u043D\\u044B\\u04A3 \\u0430\\u0442\\u044B\\u043D \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u044B\\u04A3\\u044B\\u0437.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=SAP Build Work Zone \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0441\\u044B\\u043D\\u044B\\u04A3 \\u0430\\u0442\\u044B\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B \\u0430\\u0442\\u044B\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\u0410\\u0493\\u044B\\u043C\\u0434\\u0430\\u0493\\u044B \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u043D\\u044B\\u04A3 \\u0430\\u0442\\u044B, \\u0441\\u043E\\u043D\\u044B\\u04A3 \\u0456\\u0448\\u0456\\u043D\\u0434\\u0435 \\u0430\\u0442\\u044B, \\u04D9\\u043A\\u0435\\u0441\\u0456\\u043D\\u0456\\u04A3 \\u0430\\u0442\\u044B \\u043C\\u0435\\u043D \\u0442\\u0435\\u0433\\u0456. \\u04D8\\u043A\\u0435\\u0441\\u0456\\u043D\\u0456\\u04A3 \\u0430\\u0442\\u044B \\u049B\\u044B\\u0441\\u049B\\u0430\\u0440\\u0442\\u044B\\u043B\\u0430\\u0434\\u044B. \\u041C\\u04D9\\u043D \\u0436\\u04AF\\u0439\\u0435\\u0433\\u0435 \\u043A\\u0456\\u0440\\u0433\\u0435\\u043D \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0493\\u0430 \\u0431\\u0430\\u0439\\u043B\\u0430\\u043D\\u044B\\u0441\\u0442\\u044B \\u04E9\\u0437\\u0433\\u0435\\u0440\\u0435\\u0434\\u0456.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=SAP Build Work Zone \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0441\\u044B\\u043D\\u044B\\u04A3 \\u0430\\u0442\\u044B\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0441\\u044B\\u043D\\u044B\\u04A3 \\u0430\\u0442\\u044B\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\u0410\\u0493\\u044B\\u043C\\u0434\\u0430\\u0493\\u044B \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u043D\\u044B\\u04A3 \\u0430\\u0442\\u044B. \\u041C\\u04D9\\u043D \\u0436\\u04AF\\u0439\\u0435\\u0433\\u0435 \\u043A\\u0456\\u0440\\u0433\\u0435\\u043D \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0493\\u0430 \\u0431\\u0430\\u0439\\u043B\\u0430\\u043D\\u044B\\u0441\\u0442\\u044B \\u04E9\\u0437\\u0433\\u0435\\u0440\\u0435\\u0434\\u0456.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=SAP Build Work Zone \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0441\\u044B\\u043D\\u044B\\u04A3 \\u0442\\u0435\\u0433\\u0456\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0441\\u044B\\u043D\\u044B\\u04A3 \\u0442\\u0435\\u0433\\u0456\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\u0410\\u0493\\u044B\\u043C\\u0434\\u0430\\u0493\\u044B \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u043D\\u044B\\u04A3 \\u0442\\u0435\\u0433\\u0456. \\u041C\\u04D9\\u043D \\u0436\\u04AF\\u0439\\u0435\\u0433\\u0435 \\u043A\\u0456\\u0440\\u0433\\u0435\\u043D \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0493\\u0430 \\u0431\\u0430\\u0439\\u043B\\u0430\\u043D\\u044B\\u0441\\u0442\\u044B \\u04E9\\u0437\\u0433\\u0435\\u0440\\u0435\\u0434\\u0456.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=SAP Build Work Zone \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0441\\u044B\\u043D\\u044B\\u04A3 \\u044D\\u043B. \\u043F\\u043E\\u0448\\u0442\\u0430 \\u043C\\u0435\\u043A\\u0435\\u043D\\u0436\\u0430\\u0439\\u044B\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0441\\u044B\\u043D\\u044B\\u04A3 \\u044D\\u043B. \\u043F\\u043E\\u0448\\u0442\\u0430 \\u043C\\u0435\\u043A\\u0435\\u043D\\u0436\\u0430\\u0439\\u044B\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u0410\\u0493\\u044B\\u043C\\u0434\\u0430\\u0493\\u044B SAP Build Work Zone \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0441\\u044B\\u043D\\u044B\\u04A3 \\u044D\\u043B. \\u043F\\u043E\\u0448\\u0442\\u0430 \\u043C\\u0435\\u043A\\u0435\\u043D\\u0436\\u0430\\u0439\\u044B. \\u041C\\u04D9\\u043D \\u0436\\u04AF\\u0439\\u0435\\u0433\\u0435 \\u043A\\u0456\\u0440\\u0433\\u0435\\u043D \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0493\\u0430 \\u0431\\u0430\\u0439\\u043B\\u0430\\u043D\\u044B\\u0441\\u0442\\u044B \\u04E9\\u0437\\u0433\\u0435\\u0440\\u0435\\u0434\\u0456.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u041A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\\u043D\\u044B \\u0436\\u043E\\u044E\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u0411\\u04B1\\u043B \\u043A\\u0430\\u0440\\u0442\\u0430\\u043D\\u044B\\u04A3 \\u0431\\u04E9\\u043B\\u0435\\u043A \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\\u043B\\u0430\\u0440\\u044B \\u0431\\u0430\\u0440. \\u041E\\u043B\\u0430\\u0440\\u0434\\u044B \\u0431\\u0456\\u0440\\u0436\\u043E\\u043B\\u0430\\u0442\\u0430 \\u0436\\u043E\\u044E \\u0436\\u04D9\\u043D\\u0435 \\u043A\\u0430\\u0440\\u0442\\u0430\\u043D\\u044B \\u04E9\\u0437\\u0456\\u043D\\u0456\\u04A3 \\u04D9\\u0434\\u0435\\u043F\\u043A\\u0456 \\u043F\\u0430\\u0440\\u0430\\u043C\\u0435\\u0442\\u0440\\u043B\\u0435\\u0440\\u0456\\u043D\\u0435 \\u049B\\u0430\\u0439\\u0442\\u0430\\u0440\\u0443 \\u049B\\u0430\\u0436\\u0435\\u0442 \\u043F\\u0435?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u0416\\u043E\\u044E\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u0411\\u043E\\u043B\\u0434\\u044B\\u0440\\u043C\\u0430\\u0443\n',
  "sap/ushell/components/workPageBuilder/resources/resources_ko.properties":
    '\n\nWorkPage.EmptyPage.Title=\\uBE48 \\uD398\\uC774\\uC9C0\nWorkPage.EmptyPage.Message=\\uC774 \\uD398\\uC774\\uC9C0\\uC5D0\\uB294 \\uC544\\uC9C1 \\uC139\\uC158\\uC774 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\nWorkPage.EmptyPage.Button.Add=\\uC139\\uC158 \\uCD94\\uAC00\n\nWorkPage.EditMode.Save=\\uC800\\uC7A5\nWorkPage.EditMode.Cancel=\\uCDE8\\uC18C\nWorkPage.Message.WidgetMoved=\\uC704\\uC82F\\uC744 \\uC774\\uB3D9\\uD588\\uC2B5\\uB2C8\\uB2E4.\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\uC139\\uC158 \\uC81C\\uBAA9\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\uC120\\uD0DD\\uC801 \\uC139\\uC158 \\uC81C\\uBAA9 \\uC785\\uB825\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\uC139\\uC158 \\uC81C\\uAC70\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\uC139\\uC158 \\uC0AD\\uC81C\nWorkPage.Row.DeleteDialog.Title=\\uC0AD\\uC81C\nWorkPage.Row.DeleteDialog.ConfirmText=\\uC774 \\uC139\\uC158\\uACFC \\uBAA8\\uB4E0 \\uB0B4\\uC6A9\\uC744 \\uC0AD\\uC81C\\uD558\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C?\nWorkPage.Row.DeleteDialog.Button.Confirm=\\uC0AD\\uC81C\nWorkPage.Row.DeleteDialog.Button.Cancel=\\uCDE8\\uC18C\nWorkPage.Row.AddRowButtonTooltip=\\uC139\\uC158 \\uCD94\\uAC00\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\uB7F0\\uD0C0\\uC784 \\uC2DC\\uC5D0\\uB294 \\uCC98\\uC74C 4\\uAC1C\\uC758 \\uC5F4\\uB9CC \\uD45C\\uC2DC\\uB429\\uB2C8\\uB2E4. \\uC5F4 \\uC218\\uB97C 4\\uAC1C\\uB85C \\uC904\\uC774\\uC2DC\\uAE30 \\uBC14\\uB78D\\uB2C8\\uB2E4.\nWorkPage.Row.AriaLabel=\\uC791\\uC5C5 \\uD398\\uC774\\uC9C0 \\uC139\\uC158\n\nWorkPage.Column.AriaLabel={1}\\uC758 \\uC5F4 {0}\nWorkPage.Column.AddWidgetButtonText=\\uC704\\uC82F \\uCD94\\uAC00\nWorkPage.Column.DeleteColumnButtonTooltip=\\uC5F4 \\uC81C\\uAC70\nWorkPage.Column.AddColumnButtonTooltip=\\uC5F4 \\uCD94\\uAC00\nWorkPage.Column.EmptyIllustrationTitle=\\uC571 \\uAC80\\uC0C9\nWorkPage.Column.EmptyIllustrationDescription=\\uC704\\uC82F\\uC5D0 \\uC571\\uC744 \\uCD94\\uAC00\\uD558\\uAC70\\uB098 \\uD544\\uC694 \\uC5C6\\uB294 \\uC704\\uC82F\\uC744 \\uC81C\\uAC70\\uD569\\uB2C8\\uB2E4.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\uC571 \\uCD94\\uAC00\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\uC704\\uC82F \\uC0AD\\uC81C\nWorkPage.Cell.EmptyIllustrationTitle=\\uC571 \\uAC80\\uC0C9\nWorkPage.Cell.EmptyIllustrationDescription=\\uC704\\uC82F\\uC5D0 \\uC571\\uC744 \\uCD94\\uAC00\\uD558\\uAC70\\uB098 \\uD544\\uC694 \\uC5C6\\uB294 \\uC704\\uC82F\\uC744 \\uC81C\\uAC70\\uD569\\uB2C8\\uB2E4.\nWorkPage.Cell.DeleteDialog.Title=\\uC0AD\\uC81C\nWorkPage.Cell.DeleteDialog.ConfirmText=\\uC774 \\uC704\\uC82F\\uC744 \\uC0AD\\uC81C\\uD558\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C? \\uC548\\uC5D0 \\uD3EC\\uD568\\uB41C \\uBAA8\\uB4E0 \\uC571\\uB3C4 \\uD398\\uC774\\uC9C0\\uC5D0\\uC11C \\uC81C\\uAC70\\uB429\\uB2C8\\uB2E4.\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\uC0AD\\uC81C\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\uCDE8\\uC18C\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\uC704\\uC82F \\uC124\\uC815 \\uC5F4\\uAE30\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\uC704\\uC82F \\uC0AD\\uC81C\n\nWorkPage.Section.AddVizInstanceButtonText=\\uD0C0\\uC77C \\uCD94\\uAC00\n\n\nContentFinder.Categories.Applications.Title=\\uC5B4\\uD50C\\uB9AC\\uCF00\\uC774\\uC158\nContentFinder.Widgets.Tiles.Title=\\uD0C0\\uC77C\nContentFinder.Widgets.Tiles.Description=\\uC571\\uC758 \\uC2DC\\uAC01\\uC801 \\uD45C\\uD604\nContentFinder.Widgets.Cards.Title=\\uCE74\\uB4DC\nContentFinder.Widgets.Cards.Description=\\uAC00\\uBCC0 \\uB808\\uC774\\uC544\\uC6C3\\uC5D0 \\uD45C\\uC2DC\\uB41C \\uC571\\uC758 \\uC2DC\\uAC01\\uC801 \\uD45C\\uD604\n\nWorkPage.CardEditor.Save=\\uC800\\uC7A5\nWorkPage.CardEditor.Cancel=\\uCDE8\\uC18C\nWorkPage.CardEditor.Title="{0}\\u201D \\uAD6C\\uC131\nWorkPage.CardEditor.Title.NoCardTitle=\\uAD6C\\uC131\nWorkPage.Card.ActionDefinition.Configure=\\uAD6C\\uC131\nWorkPage.Card.ActionDefinition.Reset=\\uAD6C\\uC131 \\uC0AD\\uC81C\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\uD604\\uC7AC \\uC0AC\\uC6A9\\uC790\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=SAP Build Work Zone \\uC0AC\\uC6A9\\uC790\\uC758 ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone \\uC0AC\\uC6A9\\uC790 ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=\\uD604\\uC7AC \\uC0AC\\uC6A9\\uC790\\uC758 ID\\uC785\\uB2C8\\uB2E4. \\uB85C\\uADF8\\uC628\\uD55C \\uC0AC\\uC6A9\\uC790\\uC5D0 \\uB530\\uB77C \\uAC12\\uC774 \\uBCC0\\uACBD\\uB429\\uB2C8\\uB2E4. \\uC0AC\\uC6A9\\uC790 \\uC774\\uB984\\uC744 \\uD45C\\uC2DC\\uD558\\uB824\\uBA74 SAP Build Work Zone \\uC0AC\\uC6A9\\uC790\\uC758 \\uC774\\uB984\\uC744 \\uC0AC\\uC6A9\\uD558\\uC2ED\\uC2DC\\uC624.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=SAP Build Work Zone \\uC0AC\\uC6A9\\uC790\\uC758 \\uC774\\uB984\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone \\uC0AC\\uC6A9\\uC790 \\uC774\\uB984\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\uD604\\uC7AC \\uC0AC\\uC6A9\\uC790\\uC758 \\uC774\\uB984(\\uC131, \\uC774\\uB984, \\uC911\\uAC04 \\uC774\\uB984 \\uD3EC\\uD568)\\uC785\\uB2C8\\uB2E4. \\uC911\\uAC04 \\uC774\\uB984\\uC740 \\uC57D\\uC5B4\\uB85C \\uD45C\\uC2DC\\uB429\\uB2C8\\uB2E4. \\uB85C\\uADF8\\uC628\\uD55C \\uC0AC\\uC6A9\\uC790\\uC5D0 \\uB530\\uB77C \\uAC12\\uC774 \\uBCC0\\uACBD\\uB429\\uB2C8\\uB2E4.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=SAP Build Work Zone \\uC0AC\\uC6A9\\uC790\\uC758 \\uC774\\uB984\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone \\uC0AC\\uC6A9\\uC790 \\uC774\\uB984\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\uD604\\uC7AC \\uC0AC\\uC6A9\\uC790\\uC758 \\uC774\\uB984\\uC785\\uB2C8\\uB2E4. \\uB85C\\uADF8\\uC628\\uD55C \\uC0AC\\uC6A9\\uC790\\uC5D0 \\uB530\\uB77C \\uAC12\\uC774 \\uBCC0\\uACBD\\uB429\\uB2C8\\uB2E4.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=SAP Build Work Zone \\uC0AC\\uC6A9\\uC790\\uC758 \\uC131\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone \\uC0AC\\uC6A9\\uC790 \\uC131\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\uD604\\uC7AC \\uC0AC\\uC6A9\\uC790\\uC758 \\uC131\\uC785\\uB2C8\\uB2E4. \\uB85C\\uADF8\\uC628\\uD55C \\uC0AC\\uC6A9\\uC790\\uC5D0 \\uB530\\uB77C \\uAC12\\uC774 \\uBCC0\\uACBD\\uB429\\uB2C8\\uB2E4.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\uD604\\uC7AC SAP Build Work Zone \\uC0AC\\uC6A9\\uC790\\uC758 \\uC804\\uC790\\uBA54\\uC77C \\uC8FC\\uC18C\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone \\uC0AC\\uC6A9\\uC790 \\uC804\\uC790\\uBA54\\uC77C\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\uD604\\uC7AC SAP Build Work Zone \\uC0AC\\uC6A9\\uC790\\uC758 \\uC804\\uC790\\uBA54\\uC77C \\uC8FC\\uC18C\\uC785\\uB2C8\\uB2E4. \\uB85C\\uADF8\\uC628\\uD55C \\uC0AC\\uC6A9\\uC790\\uC5D0 \\uB530\\uB77C \\uAC12\\uC774 \\uBCC0\\uACBD\\uB429\\uB2C8\\uB2E4.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\uAD6C\\uC131 \\uC0AD\\uC81C\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\uC774 \\uCE74\\uB4DC\\uC5D0 \\uAC1C\\uBCC4\\uC801\\uC778 \\uAD6C\\uC131\\uC774 \\uC788\\uC2B5\\uB2C8\\uB2E4. \\uC774 \\uAD6C\\uC131\\uC744 \\uC601\\uAD6C\\uC801\\uC73C\\uB85C \\uC0AD\\uC81C\\uD558\\uACE0 \\uCE74\\uB4DC\\uB97C \\uAE30\\uBCF8 \\uC124\\uC815\\uC73C\\uB85C \\uC7AC\\uC124\\uC815\\uD558\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\uC0AD\\uC81C\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\uCDE8\\uC18C\n',
  "sap/ushell/components/workPageBuilder/resources/resources_lt.properties":
    "\n\nWorkPage.EmptyPage.Title=Tu\\u0161\\u010Dias puslapis\nWorkPage.EmptyPage.Message=\\u0160iame puslapyje dar n\\u0117ra skyri\\u0173.\nWorkPage.EmptyPage.Button.Add=Prid\\u0117ti skyri\\u0173\n\nWorkPage.EditMode.Save=\\u012Era\\u0161yti\nWorkPage.EditMode.Cancel=At\\u0161aukti\nWorkPage.Message.WidgetMoved=Valdiklis perkeltas\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Skyriaus pavadinimas\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u012Eveskite pasirenkam\\u0105 skyriaus pavadinim\\u0105\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Pa\\u0161alinti skyri\\u0173\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Naikinti skyri\\u0173\nWorkPage.Row.DeleteDialog.Title=Naikinti\nWorkPage.Row.DeleteDialog.ConfirmText=Ar norite panaikinti \\u0161\\u012F skyri\\u0173 ir vis\\u0105 jo turin\\u012F?\nWorkPage.Row.DeleteDialog.Button.Confirm=Naikinti\nWorkPage.Row.DeleteDialog.Button.Cancel=At\\u0161aukti\nWorkPage.Row.AddRowButtonTooltip=Prid\\u0117ti skyri\\u0173\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Vykdymo laiku bus matomi tik pirmi keturi stulpeliai. Suma\\u017Einkite stulpeli\\u0173 skai\\u010Di\\u0173 iki keturi\\u0173.\nWorkPage.Row.AriaLabel=Darbo puslapio skyriai\n\nWorkPage.Column.AriaLabel={0} stulp. i\\u0161 {1}\nWorkPage.Column.AddWidgetButtonText=Prid\\u0117ti grafin\\u0117s s\\u0105sajos element\\u0105\nWorkPage.Column.DeleteColumnButtonTooltip=Pa\\u0161alinti stulpel\\u012F\nWorkPage.Column.AddColumnButtonTooltip=Prid\\u0117ti stulpel\\u012F\nWorkPage.Column.EmptyIllustrationTitle=Taikom\\u0173j\\u0173 program\\u0173 paie\\u0161ka\nWorkPage.Column.EmptyIllustrationDescription=Prid\\u0117kite taikom\\u0105sias programas prie grafin\\u0117s s\\u0105sajos elemento arba pa\\u0161alinkite grafin\\u0117s s\\u0105sajos element\\u0105, jei jo nebereikia.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Prid\\u0117ti taikom\\u0173j\\u0173 program\\u0173\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Naikinti grafin\\u0117s s\\u0105sajos element\\u0105\nWorkPage.Cell.EmptyIllustrationTitle=Taikom\\u0173j\\u0173 program\\u0173 paie\\u0161ka\nWorkPage.Cell.EmptyIllustrationDescription=Prid\\u0117kite taikom\\u0105sias programas prie grafin\\u0117s s\\u0105sajos elemento arba pa\\u0161alinkite grafin\\u0117s s\\u0105sajos element\\u0105, jei jo nebereikia.\nWorkPage.Cell.DeleteDialog.Title=Naikinti\nWorkPage.Cell.DeleteDialog.ConfirmText=Ar tikrai norite panaikinti \\u0161\\u012F grafin\\u0117s s\\u0105sajos element\\u0105? Visos jame esan\\u010Dios taikomosios programos taip pat bus pa\\u0161alintos i\\u0161 puslapio.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Naikinti\nWorkPage.Cell.DeleteDialog.Button.Cancel=At\\u0161aukti\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Atidaryti grafin\\u0117s s\\u0105sajos elemento parametrus\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Naikinti valdikl\\u012F\n\nWorkPage.Section.AddVizInstanceButtonText=Prid\\u0117ti poekrani\\u0173\n\n\nContentFinder.Categories.Applications.Title=Programos\nContentFinder.Widgets.Tiles.Title=Poekraniai\nContentFinder.Widgets.Tiles.Description=Vizualiniai program\\u0173 pateikimai.\nContentFinder.Widgets.Cards.Title=Kortel\\u0117s\nContentFinder.Widgets.Cards.Description=Vizualiniai program\\u0173 pateikimai, rodomi lanks\\u010Diuose i\\u0161d\\u0117stymuose.\n\nWorkPage.CardEditor.Save=\\u012Era\\u0161yti\nWorkPage.CardEditor.Cancel=At\\u0161aukti\nWorkPage.CardEditor.Title=Konfig\\u016Bruoti \\u201E{0}\\u201C\nWorkPage.CardEditor.Title.NoCardTitle=Konfig\\u016Bruoti\nWorkPage.Card.ActionDefinition.Configure=Konfig\\u016Bruoti\nWorkPage.Card.ActionDefinition.Reset=Naikinti konfig\\u016Bracij\\u0105\n\nWorkPage.Host.Context.WorkZone.Label=\\u201ESAP Build\\u201C darbo zona\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Dabartinis vartotojas\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=\\u201ESAP Build\\u201C darbo zonos vartotojo ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=\\u201ESAP Build\\u201C darbo zonos vartotojo ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=Dabartinio vartotojo ID. Reik\\u0161m\\u0117 pasikeis priklausomai nuo prisijungusio vartotojo. Nor\\u0117dami rodyti vartotojo vard\\u0105, naudokite \\u201ESAP Build\\u201C darbo zonos vartotojo vard\\u0105.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=\\u201ESAP Build\\u201C darbo zonos vartotojo vardas\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=\\u201ESAP Build\\u201C darbo zonos vartotojo vardas\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Dabartinio vartotojo vardas, antrasis vardas ir pavard\\u0117. Antrasis vardas bus sutrumpintas. Reik\\u0161m\\u0117 pasikeis priklausomai nuo prisijungusio vartotojo.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=\\u201ESAP Build\\u201C darbo zonos vartotojo vardas\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=\\u201ESAP Build\\u201C darbo zonos vartotojo vardas\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Dabartinio vartotojo vardas\\: reik\\u0161m\\u0117 pasikeis priklausomai nuo prisijungusio vartotojo.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=\\u201ESAP Build\\u201C darbo zonos vartotojo pavard\\u0117\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=\\u201ESAP Build\\u201C darbo zonos vartotojo pavard\\u0117\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Dabartinio vartotojo pavard\\u0117\\: reik\\u0161m\\u0117 pasikeis priklausomai nuo prisijungusio vartotojo.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Dabartinio \\u201ESAP Build\\u201C darbo zonos vartotojo el. pa\\u0161to adresas\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=\\u201ESAP Build\\u201C darbo zonos vartotojo el. pa\\u0161to adresas\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Dabartinio \\u201ESAP Build\\u201C darbo zonos vartotojo el. pa\\u0161to adresas. Reik\\u0161m\\u0117 pasikeis priklausomai nuo prisijungusio vartotojo.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Naikinti konfig\\u016Bracij\\u0105\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u0160iai kortelei yra atskiros konfig\\u016Bracijos. Ar norite jas negr\\u012F\\u017Etamai panaikinti ir atkurti kortel\\u0117s numatytuosius parametrus?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Naikinti\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=At\\u0161aukti\n",
  "sap/ushell/components/workPageBuilder/resources/resources_lv.properties":
    "\n\nWorkPage.EmptyPage.Title=Tuk\\u0161a lapa\nWorkPage.EmptyPage.Message=\\u0160aj\\u0101 lapa v\\u0113l nav nevienas sada\\u013Cas.\nWorkPage.EmptyPage.Button.Add=Pievienot sada\\u013Cu\n\nWorkPage.EditMode.Save=Saglab\\u0101t\nWorkPage.EditMode.Cancel=Atcelt\nWorkPage.Message.WidgetMoved=Logr\\u012Bks ir p\\u0101rvietots\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Sada\\u013Cas virsraksts\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Ievadiet neoblig\\u0101tu sada\\u013Cas virsrakstu\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=No\\u0146emt sada\\u013Cu\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Dz\\u0113st sada\\u013Cu\nWorkPage.Row.DeleteDialog.Title=Dz\\u0113st\nWorkPage.Row.DeleteDialog.ConfirmText=Vai v\\u0113laties izdz\\u0113st \\u0161o sada\\u013Cu un visu t\\u0101s saturu?\nWorkPage.Row.DeleteDialog.Button.Confirm=Dz\\u0113st\nWorkPage.Row.DeleteDialog.Button.Cancel=Atcelt\nWorkPage.Row.AddRowButtonTooltip=Pievienot sada\\u013Cu\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Izpildlaik\\u0101 b\\u016Bs redzamas tikai pirm\\u0101s \\u010Detras kolonnas. L\\u016Bdzu, samaziniet kolonnu skaitu l\\u012Bdz \\u010Detr\\u0101m.\nWorkPage.Row.AriaLabel=Darba lapas sada\\u013Cas\n\nWorkPage.Column.AriaLabel={0} kolonna no {1}\nWorkPage.Column.AddWidgetButtonText=Pievienot logr\\u012Bku\nWorkPage.Column.DeleteColumnButtonTooltip=No\\u0146emt kolonnu\nWorkPage.Column.AddColumnButtonTooltip=Pievienot kolonnu\nWorkPage.Column.EmptyIllustrationTitle=Lietojumprogrammu mekl\\u0113\\u0161ana\nWorkPage.Column.EmptyIllustrationDescription=Pievienojiet logr\\u012Bkam lietojumprogrammas vai no\\u0146emiet logr\\u012Bku, ja jums tas vairs nav nepiecie\\u0161ams.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Lietojumprogrammas pievieno\\u0161ana\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Logr\\u012Bka dz\\u0113\\u0161ana\nWorkPage.Cell.EmptyIllustrationTitle=Lietojumprogrammu mekl\\u0113\\u0161ana\nWorkPage.Cell.EmptyIllustrationDescription=Pievienojiet logr\\u012Bkam lietojumprogrammas vai no\\u0146emiet logr\\u012Bku, ja jums tas vairs nav nepiecie\\u0161ams.\nWorkPage.Cell.DeleteDialog.Title=Dz\\u0113st\nWorkPage.Cell.DeleteDialog.ConfirmText=Vai tie\\u0161\\u0101m v\\u0113laties izdz\\u0113st \\u0161o logr\\u012Bku? Visas taj\\u0101 eso\\u0161\\u0101s lietotnes ar\\u012B tiks no\\u0146emtas \\u0161aj\\u0101 lap\\u0101.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Dz\\u0113st\nWorkPage.Cell.DeleteDialog.Button.Cancel=Atcelt\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Atv\\u0113rt logr\\u012Bka iestat\\u012Bjumus\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Dz\\u0113st logr\\u012Bku\n\nWorkPage.Section.AddVizInstanceButtonText=Pievienot fl\\u012Bz\\u012Btes\n\n\nContentFinder.Categories.Applications.Title=Lietojumprogrammas\nContentFinder.Widgets.Tiles.Title=Fl\\u012Bz\\u012Btes\nContentFinder.Widgets.Tiles.Description=Lietot\\u0146u vizu\\u0101ls att\\u0113lojums.\nContentFinder.Widgets.Cards.Title=Kart\\u012Btes\nContentFinder.Widgets.Cards.Description=Lietot\\u0146u vizu\\u0101ls att\\u0113lojums, r\\u0101d\\u012Bts elast\\u012Bgos izk\\u0101rtojumos.\n\nWorkPage.CardEditor.Save=Saglab\\u0101t\nWorkPage.CardEditor.Cancel=Atcelt\nWorkPage.CardEditor.Title=Konfigur\\u0113t \\u201C{0}\\u201D\nWorkPage.CardEditor.Title.NoCardTitle=Konfigur\\u0113t\nWorkPage.Card.ActionDefinition.Configure=Konfigur\\u0113t\nWorkPage.Card.ActionDefinition.Reset=Dz\\u0113st konfigur\\u0101ciju\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Pa\\u0161reiz\\u0113jais lietot\\u0101js\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=SAP Build Work Zone lietot\\u0101ja ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone lietot\\u0101ja ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=Pa\\u0161reiz\\u0113j\\u0101 lietot\\u0101ja ID. V\\u0113rt\\u012Bba main\\u012Bsies, \\u0146emot v\\u0113r\\u0101 lietot\\u0101ju, kur\\u0161 ir pieteicies. Lai r\\u0101d\\u012Btu lietot\\u0101ja v\\u0101rdu, izmantojiet SAP Build Work Zone lietot\\u0101ja v\\u0101rdu.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=SAP Build Work Zone lietot\\u0101ja v\\u0101rds\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone lietot\\u0101ja v\\u0101rds\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=V\\u0101rds pa\\u0161reiz\\u0113jam lietot\\u0101jam\\: pirmais un otrais v\\u0101rds un uzv\\u0101rds. Otrais v\\u0101rds tiks sa\\u012Bsin\\u0101ts. V\\u0113rt\\u012Bba main\\u012Bsies, \\u0146emot v\\u0113r\\u0101 lietot\\u0101ju, kur\\u0161 ir pieteicies.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=SAP Build Work Zone lietot\\u0101ja pirmais v\\u0101rds\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone lietot\\u0101ja pirmais v\\u0101rds\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Pa\\u0161reiz\\u0113j\\u0101 lietot\\u0101ja pirmais v\\u0101rds. V\\u0113rt\\u012Bba main\\u012Bsies, \\u0146emot v\\u0113r\\u0101 lietot\\u0101ju, kur\\u0161 ir pieteicies.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=SAP Build Work Zone lietot\\u0101ja uzv\\u0101rds\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone lietot\\u0101ja uzv\\u0101rds\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Pa\\u0161reiz\\u0113j\\u0101 lietot\\u0101ja uzv\\u0101rds. V\\u0113rt\\u012Bba main\\u012Bsies, \\u0146emot v\\u0113r\\u0101 lietot\\u0101ju, kur\\u0161 ir pieteicies.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Pa\\u0161reiz\\u0113j\\u0101 SAP Build Work Zone lietot\\u0101ja e-pasta adrese\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone lietot\\u0101ja e-pasts\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Pa\\u0161reiz\\u0113j\\u0101 SAP Build Work Zone lietot\\u0101ja e-pasta adrese. V\\u0113rt\\u012Bba main\\u012Bsies, \\u0146emot v\\u0113r\\u0101 lietot\\u0101ju, kur\\u0161 ir pieteicies.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Dz\\u0113st konfigur\\u0101ciju\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u0160ai kartei ir individu\\u0101las konfigur\\u0101cijas. Vai v\\u0113laties t\\u0101s neatgriezeniski izdz\\u0113st un atiestat\\u012Bt karti uz t\\u0101s noklus\\u0113juma iestat\\u012Bjumiem?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Dz\\u0113st\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Atcelt\n",
  "sap/ushell/components/workPageBuilder/resources/resources_ms.properties":
    '\n\nWorkPage.EmptyPage.Title=Halaman Kosong\nWorkPage.EmptyPage.Message=Halaman ini tidak mempunyai apa-apa bahagian.\nWorkPage.EmptyPage.Button.Add=Tambah Bahagian\n\nWorkPage.EditMode.Save=Simpan\nWorkPage.EditMode.Cancel=Batalkan\nWorkPage.Message.WidgetMoved=Widget telah dialihkan\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Tajuk Bahagian\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Masukkan tajuk bahagian pilihan\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Buang Bahagian\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Padam Bahagian\nWorkPage.Row.DeleteDialog.Title=Padam\nWorkPage.Row.DeleteDialog.ConfirmText=Adakah anda mahu padam bahagian ini dan semua kandungannya?\nWorkPage.Row.DeleteDialog.Button.Confirm=Padam\nWorkPage.Row.DeleteDialog.Button.Cancel=Batal\nWorkPage.Row.AddRowButtonTooltip=Tambah Bahagian\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Dalam masa jalanan, hanya empat lajur pertama boleh dilihat. Sila kurangkan bilangan lajur kepada empat.\nWorkPage.Row.AriaLabel=Bahagian Halaman Kerja\n\nWorkPage.Column.AriaLabel=Lajur {0} bagi {1}\nWorkPage.Column.AddWidgetButtonText=Tambah Widget\nWorkPage.Column.DeleteColumnButtonTooltip=Keluarkan Lajur\nWorkPage.Column.AddColumnButtonTooltip=Tambah Lajur\nWorkPage.Column.EmptyIllustrationTitle=Cari Aplikasi\nWorkPage.Column.EmptyIllustrationDescription=Tambahkan aplikasi kepada widget, atau keluarkan widget jika anda tidak memerlukannya.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Tambah Aplikasi\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Padam Widget\nWorkPage.Cell.EmptyIllustrationTitle=Cari Aplikasi\nWorkPage.Cell.EmptyIllustrationDescription=Tambahkan aplikasi kepada widget, atau keluarkan widget jika anda tidak memerlukannya.\nWorkPage.Cell.DeleteDialog.Title=Padam\nWorkPage.Cell.DeleteDialog.ConfirmText=Adakah anda pasti anda ingin memadam widget ini? Semua aplikasi dalamnya akan dikeluarkan daripada halaman tersebut.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Padam\nWorkPage.Cell.DeleteDialog.Button.Cancel=Batal\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Buka tetapan widget\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Padam Widget\n\nWorkPage.Section.AddVizInstanceButtonText=Tambah Jubin\n\n\nContentFinder.Categories.Applications.Title=Aplikasi\nContentFinder.Widgets.Tiles.Title=Jubin\nContentFinder.Widgets.Tiles.Description=Perwakilan aplikasi visual.\nContentFinder.Widgets.Cards.Title=Kad\nContentFinder.Widgets.Cards.Description=Perwakilan aplikasi visual dipaparkan dalam tataletak fleksibel.\n\nWorkPage.CardEditor.Save=Simpan\nWorkPage.CardEditor.Cancel=Batalkan\nWorkPage.CardEditor.Title=Konfigurasikan "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Konfigurasikan\nWorkPage.Card.ActionDefinition.Configure=Konfigurasikan\nWorkPage.Card.ActionDefinition.Reset=Padam Konfigurasi\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Pengguna Semasa\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID pengguna semasa. Nilai akan berubah berdasarkan pengguna yang log masuk. Untuk menunjukkan nama pengguna, gunakan Nama Pengguna SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Nama Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Nama Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Nama pengguna semasa dengan nama pertama, nama tengah dan nama keluarga. Nama tengah akan disingkatkan. Nilai akan berubah berdasarkan pengguna yang log masuk.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Nama Pertama Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Nama Pertama Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Nama pertama pengguna semasa. Nilai akan berubah berdasarkan pengguna yang log masuk.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Nama Keluarga Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Nama Keluarga Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Nama keluarga pengguna semasa. Nilai akan berubah berdasarkan pengguna yang log masuk.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Alamat E-mel Pengguna SAP Build Work Zone Semasa\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-mel Pengguna SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Alamat e-mel pengguna SAP Build Work Zone semasa. Nilai akan berubah berdasarkan pengguna yang log masuk.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Padam Konfigurasi\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Kad ini mempunyai konfigurasi individu. Adakah anda ingin padamkannya secara tidak boleh diubah dan tetapkan semula kad kepada tetapan lalainya?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Padam\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Batalkan\n',
  "sap/ushell/components/workPageBuilder/resources/resources_nl.properties":
    '\n\nWorkPage.EmptyPage.Title=Lege pagina\nWorkPage.EmptyPage.Message=Deze pagina bevat nog geen secties.\nWorkPage.EmptyPage.Button.Add=Sectie toevoegen\n\nWorkPage.EditMode.Save=Opslaan\nWorkPage.EditMode.Cancel=Annuleren\nWorkPage.Message.WidgetMoved=Widget verplaatst\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Sectietitel\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Voer een optionele sectietitel in\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Sectie verwijderen\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Sectie verwijderen\nWorkPage.Row.DeleteDialog.Title=Verwijderen\nWorkPage.Row.DeleteDialog.ConfirmText=Deze sectie en alle inhoud ervan verwijderen?\nWorkPage.Row.DeleteDialog.Button.Confirm=Verwijderen\nWorkPage.Row.DeleteDialog.Button.Cancel=Annuleren\nWorkPage.Row.AddRowButtonTooltip=Sectie toevoegen\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=In runtime, zijn alleen de eerste vier kolommen zichtbaar. Verminder het aantal kolommen tot vier.\nWorkPage.Row.AriaLabel=Secties werkpagina\n\nWorkPage.Column.AriaLabel=Kolom {0} van {1}\nWorkPage.Column.AddWidgetButtonText=Widget toevoegen\nWorkPage.Column.DeleteColumnButtonTooltip=Kolom verwijderen\nWorkPage.Column.AddColumnButtonTooltip=Kolom toevoegen\nWorkPage.Column.EmptyIllustrationTitle=Zoeken naar apps\nWorkPage.Column.EmptyIllustrationDescription=Voeg apps aan widget toe, of verwijder de widget als u deze niet nodig hebt.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=App toevoegen\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Widget verwijderen\nWorkPage.Cell.EmptyIllustrationTitle=Zoeken naar apps\nWorkPage.Cell.EmptyIllustrationDescription=Voeg apps aan widget toe, of verwijder de widget als u deze niet nodig hebt.\nWorkPage.Cell.DeleteDialog.Title=Verwijderen\nWorkPage.Cell.DeleteDialog.ConfirmText=Weet u zeker dat u deze widget wilt verwijderen? Alle apps worden eveneens van de pagina verwijderd.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Verwijderen\nWorkPage.Cell.DeleteDialog.Button.Cancel=Annuleren\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Widgetinstellingen openen\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Widget verwijderen\n\nWorkPage.Section.AddVizInstanceButtonText=Tegels toevoegen\n\n\nContentFinder.Categories.Applications.Title=Applicaties\nContentFinder.Widgets.Tiles.Title=Tegels\nContentFinder.Widgets.Tiles.Description=Visuele weergaven van apps.\nContentFinder.Widgets.Cards.Title=Kaarten\nContentFinder.Widgets.Cards.Description=Visuele weergaven van apps, weergegeven in flexibele lay-outs.\n\nWorkPage.CardEditor.Save=Opslaan\nWorkPage.CardEditor.Cancel=Annuleren\nWorkPage.CardEditor.Title="{0}" configureren\nWorkPage.CardEditor.Title.NoCardTitle=Configureren\nWorkPage.Card.ActionDefinition.Configure=Configureren\nWorkPage.Card.ActionDefinition.Reset=Configuratie verwijderen\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Huidige gebruiker\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID van SAP Build Work Zone-gebruiker\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID van gebruiker van SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID van de huidige gebruiker. De waarde verandert afhankelijk van de gebruiker die is aangemeld. Gebruik de naam van de SAP Build Work Zone-gebruiker om de naam van de gebruiker weer te geven.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Naam van SAP Build Work Zone-gebruiker\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Naam van gebruiker van SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Naam van de huidige gebruiker met voornaam, tweede voornaam en achternaam. De tweede voornaam wordt afgekort. De waarde verandert afhankelijk van de gebruiker die is aangemeld.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Voornaam van SAP Build Work Zone-gebruiker\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Voornaam gebruiker van SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Voornaam van de huidige gebruiker. De waarde verandert afhankelijk van de gebruiker die is aangemeld.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Achternaam van SAP Build Work Zone-gebruiker\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Achternaam gebruiker van SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Achternaam van de huidige gebruiker. De waarde verandert afhankelijk van de gebruiker die is aangemeld.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=E-mailadres van huidige gebruiker van SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-mailadres van gebruiker van SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=E-mailadres van huidige gebruiker van SAP Build Work Zone. De waarde verandert afhankelijk van de gebruiker die is aangemeld.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Configuratie verwijderen\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Deze kaart bevat afzonderlijke configuraties. Wilt u deze onomkeerbaar verwijderen en de kaart opnieuw instellen op de standaardinstellingen?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Verwijderen\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Annuleren\n',
  "sap/ushell/components/workPageBuilder/resources/resources_no.properties":
    '\n\nWorkPage.EmptyPage.Title=Tom side\nWorkPage.EmptyPage.Message=Denne siden inneholder ingen avsnitt enn\\u00E5.\nWorkPage.EmptyPage.Button.Add=Legg til avsnitt\n\nWorkPage.EditMode.Save=Lagre\nWorkPage.EditMode.Cancel=Avbryt\nWorkPage.Message.WidgetMoved=Widget flyttet\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Tittel p\\u00E5 avsnitt\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Oppgi en valgfri avsnittstittel\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Fjern avsnitt\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Slett avsnitt\nWorkPage.Row.DeleteDialog.Title=Slett\nWorkPage.Row.DeleteDialog.ConfirmText=Vil du slette dette avsnittet og alt innhold?\nWorkPage.Row.DeleteDialog.Button.Confirm=Slett\nWorkPage.Row.DeleteDialog.Button.Cancel=Avbryt\nWorkPage.Row.AddRowButtonTooltip=Legg til avsnitt\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Bare de fire f\\u00F8rste kolonnene vil v\\u00E6re synlige i kj\\u00F8ringstiden. Reduser antall kolonner til fire.\nWorkPage.Row.AriaLabel=Arbeidssideavsnitt\n\nWorkPage.Column.AriaLabel=Kolonne {0} av {1}\nWorkPage.Column.AddWidgetButtonText=Legg til widget\nWorkPage.Column.DeleteColumnButtonTooltip=Fjern kolonne\nWorkPage.Column.AddColumnButtonTooltip=Legg til kolonne\nWorkPage.Column.EmptyIllustrationTitle=S\\u00F8k etter apper\nWorkPage.Column.EmptyIllustrationDescription=Legg til apper i widgeten, eller fjern widgeten hvis du ikke trenger den.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Legg til app\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Slett widget\nWorkPage.Cell.EmptyIllustrationTitle=S\\u00F8k etter apper\nWorkPage.Cell.EmptyIllustrationDescription=Legg til apper i widgeten, eller fjern widgeten hvis du ikke trenger den.\nWorkPage.Cell.DeleteDialog.Title=Slett\nWorkPage.Cell.DeleteDialog.ConfirmText=Er du sikker p\\u00E5 at du vil slette denne widgeten? Alle apper i den blir ogs\\u00E5 slettet fra siden.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Slett\nWorkPage.Cell.DeleteDialog.Button.Cancel=Avbryt\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u00C5pne widgetinnstillinger\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Slett widget\n\nWorkPage.Section.AddVizInstanceButtonText=Legg til ruter\n\n\nContentFinder.Categories.Applications.Title=Applikasjoner\nContentFinder.Widgets.Tiles.Title=Ruter\nContentFinder.Widgets.Tiles.Description=Visuell presentasjon av apper.\nContentFinder.Widgets.Cards.Title=Kort\nContentFinder.Widgets.Cards.Description=Visuell presentasjon av apper, vist i fleksible oppsett.\n\nWorkPage.CardEditor.Save=Lagre\nWorkPage.CardEditor.Cancel=Avbryt\nWorkPage.CardEditor.Title=Konfigurer "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Konfigurer\nWorkPage.Card.ActionDefinition.Configure=Konfigurer\nWorkPage.Card.ActionDefinition.Reset=Slett konfigurasjon\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Aktuell bruker\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID for SAP Build Work Zone-brukeren\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone-bruker-ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID for den aktuelle brukeren. Verdien endres avhengig av hvilken bruker som er p\\u00E5logget. For \\u00E5 vise brukerens navn kan du bruke "Navn p\\u00E5 SAP Build Work Zone-bruker"\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Navn p\\u00E5 SAP Build Work Zone-bruker\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone-brukernavn\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Navnet p\\u00E5 den aktuelle brukeren med fornavn, mellomnavn og etternavn. Mellomnavnet blir forkortet. Verdien endres avhengig av hvilken bruker som er p\\u00E5logget.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Fornavnet til SAP Build Work Zone-brukeren\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone-brukerens fornavn\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Fornavnet til den aktuelle brukeren. Verdien endres avhengig av hvilken bruker som er p\\u00E5logget.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Etternavnet til SAP Build Work Zone-brukeren\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone-brukerens etternavn\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Etteravnet til den aktuelle brukeren. Verdien endres avhengig av hvilken bruker som er p\\u00E5logget.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=E-postadressen til aktuell SAP Build Work Zone-bruker\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-postadresse til SAP Build Work Zone-bruker\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=E-postadressen til den aktuelle SAP Build Work Zone-brukeren. Verdien endres avhengig av hvilken bruker som er p\\u00E5logget.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Slett konfigurasjon\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Dette kortet har individuelle konfigurasjoner. Vil du slette dem ugjenkallelig og tilbakestille kortet til standardinnstillingene?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Slett\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Avbryt\n',
  "sap/ushell/components/workPageBuilder/resources/resources_pl.properties":
    '\n\nWorkPage.EmptyPage.Title=Pusta strona\nWorkPage.EmptyPage.Message=Ta strona nie zawiera jeszcze \\u017Cadnych sekcji.\nWorkPage.EmptyPage.Button.Add=Dodaj sekcj\\u0119\n\nWorkPage.EditMode.Save=Zapisz\nWorkPage.EditMode.Cancel=Anuluj\nWorkPage.Message.WidgetMoved=Przeniesiono wid\\u017Cet\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Tytu\\u0142 sekcji\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Wprowad\\u017A opcjonalny tytu\\u0142 sekcji\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Usu\\u0144 sekcj\\u0119\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Usu\\u0144 sekcj\\u0119\nWorkPage.Row.DeleteDialog.Title=Usuwanie\nWorkPage.Row.DeleteDialog.ConfirmText=Czy chcesz usun\\u0105\\u0107 t\\u0119 sekcj\\u0119 i jej ca\\u0142\\u0105 zawarto\\u015B\\u0107?\nWorkPage.Row.DeleteDialog.Button.Confirm=Usu\\u0144\nWorkPage.Row.DeleteDialog.Button.Cancel=Anuluj\nWorkPage.Row.AddRowButtonTooltip=Dodaj sekcj\\u0119\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=W czasie wykonania widoczne b\\u0119d\\u0105 tylko pierwsze cztery kolumny. Zredukuj liczb\\u0119 kolumn do czterech.\nWorkPage.Row.AriaLabel=Sekcje strony roboczej\n\nWorkPage.Column.AriaLabel=Kolumna {0} z {1}\nWorkPage.Column.AddWidgetButtonText=Dodaj wid\\u017Cet\nWorkPage.Column.DeleteColumnButtonTooltip=Usu\\u0144 kolumn\\u0119\nWorkPage.Column.AddColumnButtonTooltip=Dodaj kolumn\\u0119\nWorkPage.Column.EmptyIllustrationTitle=Wyszukiwanie aplikacji\nWorkPage.Column.EmptyIllustrationDescription=Dodaj aplikacje do wid\\u017Cetu lub usu\\u0144 wid\\u017Cet, je\\u015Bli go nie potrzebujesz.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Dodaj aplikacj\\u0119\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Usu\\u0144 wid\\u017Cet\nWorkPage.Cell.EmptyIllustrationTitle=Wyszukiwanie aplikacji\nWorkPage.Cell.EmptyIllustrationDescription=Dodaj aplikacje do wid\\u017Cetu lub usu\\u0144 wid\\u017Cet, je\\u015Bli go nie potrzebujesz.\nWorkPage.Cell.DeleteDialog.Title=Usuwanie\nWorkPage.Cell.DeleteDialog.ConfirmText=Czy na pewno chcesz usun\\u0105\\u0107 ten wid\\u017Cet? Wszystkie zawarte w nim aplikacje zostan\\u0105 r\\u00F3wnie\\u017C usuni\\u0119te ze strony.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Usu\\u0144\nWorkPage.Cell.DeleteDialog.Button.Cancel=Anuluj\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Otw\\u00F3rz ustawienia wid\\u017Cetu\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Usu\\u0144 wid\\u017Cet\n\nWorkPage.Section.AddVizInstanceButtonText=Dodaj kafelki\n\n\nContentFinder.Categories.Applications.Title=Aplikacje\nContentFinder.Widgets.Tiles.Title=Kafelki\nContentFinder.Widgets.Tiles.Description=Wizualne reprezentacje aplikacji.\nContentFinder.Widgets.Cards.Title=Karty\nContentFinder.Widgets.Cards.Description=Wizualne reprezentacje aplikacji, wy\\u015Bwietlane w elastycznych uk\\u0142adach.\n\nWorkPage.CardEditor.Save=Zapisz\nWorkPage.CardEditor.Cancel=Anuluj\nWorkPage.CardEditor.Title=Konfiguruj "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Konfiguruj\nWorkPage.Card.ActionDefinition.Configure=Konfiguruj\nWorkPage.Card.ActionDefinition.Reset=Usu\\u0144 konfiguracj\\u0119\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Bie\\u017C\\u0105cy u\\u017Cytkownik\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID u\\u017Cytkownika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID u\\u017Cytkownika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID bie\\u017C\\u0105cego u\\u017Cytkownika. Warto\\u015B\\u0107 b\\u0119dzie si\\u0119 zmienia\\u0107 w zale\\u017Cno\\u015Bci od zalogowanego u\\u017Cytkownika. Aby wy\\u015Bwietli\\u0107 nazw\\u0119 u\\u017Cytkownika, u\\u017Cyj opcji Nazwa u\\u017Cytkownika SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Nazwa u\\u017Cytkownika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Nazwa u\\u017Cytkownika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Imi\\u0119, drugie imi\\u0119 i nazwisko bie\\u017C\\u0105cego u\\u017Cytkownika. Drugie imi\\u0119 zostanie skr\\u00F3cone. Warto\\u015B\\u0107 b\\u0119dzie zmienia\\u0107 si\\u0119 w zale\\u017Cno\\u015Bci od zalogowanego u\\u017Cytkownika.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Imi\\u0119 u\\u017Cytkownika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Imi\\u0119 u\\u017Cytkownika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Imi\\u0119 bie\\u017C\\u0105cego u\\u017Cytkownika. Warto\\u015B\\u0107 b\\u0119dzie zmienia\\u0107 si\\u0119 w zale\\u017Cno\\u015Bci od zalogowanego u\\u017Cytkownika.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Nazwisko u\\u017Cytkownika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Nazwisko u\\u017Cytkownika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Nazwisko bie\\u017C\\u0105cego u\\u017Cytkownika. Warto\\u015B\\u0107 b\\u0119dzie zmienia\\u0107 si\\u0119 w zale\\u017Cno\\u015Bci od zalogowanego u\\u017Cytkownika.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Adres e-mail bie\\u017C\\u0105cego u\\u017Cytkownika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-mail u\\u017Cytkownika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Adres e-mail bie\\u017C\\u0105cego u\\u017Cytkownika SAP Build Work Zone. Warto\\u015B\\u0107 b\\u0119dzie zmienia\\u0107 si\\u0119 w zale\\u017Cno\\u015Bci od zalogowanego u\\u017Cytkownika.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Usu\\u0144 konfiguracj\\u0119\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Ta karta zawiera indywidualne konfiguracje. Czy chcesz usun\\u0105\\u0107 je w spos\\u00F3b nieodwracalny i przywr\\u00F3ci\\u0107 ustawienia domy\\u015Blne karty?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Usu\\u0144\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Anuluj\n',
  "sap/ushell/components/workPageBuilder/resources/resources_pt.properties":
    '\n\nWorkPage.EmptyPage.Title=P\\u00E1gina vazia\nWorkPage.EmptyPage.Message=Esta p\\u00E1gina ainda n\\u00E3o cont\\u00E9m se\\u00E7\\u00F5es.\nWorkPage.EmptyPage.Button.Add=Adicionar se\\u00E7\\u00E3o\n\nWorkPage.EditMode.Save=Gravar\nWorkPage.EditMode.Cancel=Cancelar\nWorkPage.Message.WidgetMoved=Widget deslocado\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=T\\u00EDtulo da se\\u00E7\\u00E3o\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Inserir um t\\u00EDtulo de se\\u00E7\\u00E3o opcional\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Remover se\\u00E7\\u00E3o\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Eliminar se\\u00E7\\u00E3o\nWorkPage.Row.DeleteDialog.Title=Eliminar\nWorkPage.Row.DeleteDialog.ConfirmText=Eliminar esta se\\u00E7\\u00E3o e todo o respectivo conte\\u00FAdo?\nWorkPage.Row.DeleteDialog.Button.Confirm=Eliminar\nWorkPage.Row.DeleteDialog.Button.Cancel=Cancelar\nWorkPage.Row.AddRowButtonTooltip=Adicionar se\\u00E7\\u00E3o\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=No momento da execu\\u00E7\\u00E3o, s\\u00F3 ser\\u00E3o vis\\u00EDveis as primeiras quatro colunas. Reduza o n\\u00FAmero de colunas para quatro.\nWorkPage.Row.AriaLabel=Se\\u00E7\\u00F5es de p\\u00E1gina de trabalho\n\nWorkPage.Column.AriaLabel=Coluna {0} de {1}\nWorkPage.Column.AddWidgetButtonText=Adicionar widget\nWorkPage.Column.DeleteColumnButtonTooltip=Remover coluna\nWorkPage.Column.AddColumnButtonTooltip=Adicionar coluna\nWorkPage.Column.EmptyIllustrationTitle=Procurar apps\nWorkPage.Column.EmptyIllustrationDescription=Adicionar apps ao widget ou remover o widget se n\\u00E3o for necess\\u00E1rio\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Adicionar app\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Eliminar widget\nWorkPage.Cell.EmptyIllustrationTitle=Procurar apps\nWorkPage.Cell.EmptyIllustrationDescription=Adicionar apps ao widget ou remover o widget se n\\u00E3o for necess\\u00E1rio\nWorkPage.Cell.DeleteDialog.Title=Eliminar\nWorkPage.Cell.DeleteDialog.ConfirmText=Voc\\u00EA quer mesmo eliminar este widget? Todos os apps nele tamb\\u00E9m ser\\u00E3o removidos da p\\u00E1gina.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Eliminar\nWorkPage.Cell.DeleteDialog.Button.Cancel=Cancelar\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Abrir configura\\u00E7\\u00F5es de widget\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Eliminar widget\n\nWorkPage.Section.AddVizInstanceButtonText=Adicionar blocos\n\n\nContentFinder.Categories.Applications.Title=Aplica\\u00E7\\u00F5es\nContentFinder.Widgets.Tiles.Title=Blocos\nContentFinder.Widgets.Tiles.Description=Representa\\u00E7\\u00F5es visuais de apps\nContentFinder.Widgets.Cards.Title=Cart\\u00F5es\nContentFinder.Widgets.Cards.Description=Representa\\u00E7\\u00F5es visuais de apps, exibidas em layouts flex\\u00EDveis.\n\nWorkPage.CardEditor.Save=Gravar\nWorkPage.CardEditor.Cancel=Cancelar\nWorkPage.CardEditor.Title=Configurar "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Configurar\nWorkPage.Card.ActionDefinition.Configure=Configurar\nWorkPage.Card.ActionDefinition.Reset=Eliminar configura\\u00E7\\u00E3o\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Usu\\u00E1rio conectado\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID do usu\\u00E1rio conectado. O valor ser\\u00E1 modificado com base no usu\\u00E1rio que efetuou o logon. Para exibir o nome do usu\\u00E1rio, utilize o nome do usu\\u00E1rio de SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Nome do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Nome do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Nome do usu\\u00E1rio conectado com o primeiro, segundo nome e sobrenome. O segundo nome ser\\u00E1 abreviado. O valor ser\\u00E1 modificado com base no usu\\u00E1rio que efetuou o logon.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Primeiro nome do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Primeiro nome do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Primeiro nome do usu\\u00E1rio conectado. O valor ser\\u00E1 modificado com base no usu\\u00E1rio que efetuou o logon.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Sobrenome do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Sobrenome do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Sobrenome do usu\\u00E1rio conectado. O valor ser\\u00E1 modificado com base no usu\\u00E1rio que efetuou o logon.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Endere\\u00E7o de e-mail do usu\\u00E1rio conectado de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-mail do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Endere\\u00E7o de e-mail do usu\\u00E1rio conectado de SAP Build Work Zone. O valor ser\\u00E1 modificado com base no usu\\u00E1rio que efetuou o logon.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Eliminar configura\\u00E7\\u00E3o\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Este cart\\u00E3o tem configura\\u00E7\\u00F5es individuais. Voc\\u00EA quer excluir as mesmas de modo irrevog\\u00E1vel e reinicializar o cart\\u00E3o para as configura\\u00E7\\u00F5es padr\\u00E3o?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Excluir\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Cancelar\n',
  "sap/ushell/components/workPageBuilder/resources/resources_pt_PT.properties":
    '\n\nWorkPage.EmptyPage.Title=P\\u00E1gina vazia\nWorkPage.EmptyPage.Message=Esta p\\u00E1gina ainda n\\u00E3o cont\\u00E9m qualquer sec\\u00E7\\u00E3o.\nWorkPage.EmptyPage.Button.Add=Adicionar sec\\u00E7\\u00E3o\n\nWorkPage.EditMode.Save=Guardar\nWorkPage.EditMode.Cancel=Cancelar\nWorkPage.Message.WidgetMoved=Widget movido\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=T\\u00EDtulo da sec\\u00E7\\u00E3o\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Inserir um t\\u00EDtulo de se\\u00E7\\u00E3o opcional\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Remover sec\\u00E7\\u00E3o\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Eliminar sec\\u00E7\\u00E3o\nWorkPage.Row.DeleteDialog.Title=Eliminar\nWorkPage.Row.DeleteDialog.ConfirmText=Pretende eliminar esta sec\\u00E7\\u00E3o e todo o seu conte\\u00FAdo?\nWorkPage.Row.DeleteDialog.Button.Confirm=Eliminar\nWorkPage.Row.DeleteDialog.Button.Cancel=Cancelar\nWorkPage.Row.AddRowButtonTooltip=Adicionar sec\\u00E7\\u00E3o\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=No momento da execu\\u00E7\\u00E3o, s\\u00F3 ser\\u00E3o vis\\u00EDveis as primeiras quatro colunas. Reduza o n\\u00FAmero de colunas a quatro.\nWorkPage.Row.AriaLabel=Se\\u00E7\\u00F5es de p\\u00E1gina de trabalho\n\nWorkPage.Column.AriaLabel=Coluna {0} de {1}\nWorkPage.Column.AddWidgetButtonText=Adicionar widget\nWorkPage.Column.DeleteColumnButtonTooltip=Remover coluna\nWorkPage.Column.AddColumnButtonTooltip=Adicionar coluna\nWorkPage.Column.EmptyIllustrationTitle=Procurar aplica\\u00E7\\u00F5es\nWorkPage.Column.EmptyIllustrationDescription=Adicionar aplica\\u00E7\\u00F5es ao widget ou remover o widget se voc\\u00EA n\\u00E3o o precisar.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Adicionar aplica\\u00E7\\u00F5es\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Eliminar widget\nWorkPage.Cell.EmptyIllustrationTitle=Procurar aplica\\u00E7\\u00F5es\nWorkPage.Cell.EmptyIllustrationDescription=Adicionar aplica\\u00E7\\u00F5es ao widget ou remover o widget se voc\\u00EA n\\u00E3o o precisar.\nWorkPage.Cell.DeleteDialog.Title=Eliminar\nWorkPage.Cell.DeleteDialog.ConfirmText=Quer eliminar este widget? Todas as aplica\\u00E7\\u00F5es nele tamb\\u00E9m ser\\u00E3o removidas da p\\u00E1gina.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Eliminar\nWorkPage.Cell.DeleteDialog.Button.Cancel=Cancelar\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Abrir defini\\u00E7\\u00F5es de widget\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Eliminar widget\n\nWorkPage.Section.AddVizInstanceButtonText=Adicionar mosaicos\n\n\nContentFinder.Categories.Applications.Title=Aplica\\u00E7\\u00F5es\nContentFinder.Widgets.Tiles.Title=Mosaicos\nContentFinder.Widgets.Tiles.Description=Representa\\u00E7\\u00F5es visuais de aplica\\u00E7\\u00F5es.\nContentFinder.Widgets.Cards.Title=Cart\\u00F5es\nContentFinder.Widgets.Cards.Description=Representa\\u00E7\\u00F5es visuais de aplica\\u00E7\\u00F5es exibidas em layouts flex\\u00EDveis.\n\nWorkPage.CardEditor.Save=Guardar\nWorkPage.CardEditor.Cancel=Cancelar\nWorkPage.CardEditor.Title=Configurar "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Configurar\nWorkPage.Card.ActionDefinition.Configure=Configurar\nWorkPage.Card.ActionDefinition.Reset=Eliminar configura\\u00E7\\u00E3o\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Usu\\u00E1rio atual\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID de usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID do usu\\u00E1rio atual. O valor ser\\u00E1 alterado com base no usu\\u00E1rio com sess\\u00E3o iniciada. Para mostrar o nome do usu\\u00E1rio, utilize o nome do usu\\u00E1rio de SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Nome do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Nome do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Nome do usu\\u00E1rio atual com nome pr\\u00F3prio, segundo nome e apelido. O segundo nome ser\\u00E1 abreviado. O valor ser\\u00E1 alterado com base no usu\\u00E1rio com sess\\u00E3o iniciada.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Nome pr\\u00F3prio do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Nome pr\\u00F3prio do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Nome pr\\u00F3prio do usu\\u00E1rio atual. O valor ser\\u00E1 alterado com base no usu\\u00E1rio com sess\\u00E3o iniciada.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Apelido do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Apelido do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Apelido do usu\\u00E1rio atual. O valor ser\\u00E1 alterado com base no usu\\u00E1rio com sess\\u00E3o iniciada.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Endere\\u00E7o de e-mail do usu\\u00E1rio SAP Build Work Zone User atual\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-mail do usu\\u00E1rio de SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Endere\\u00E7o de e-mail do usu\\u00E1rio SAP Build Work Zone atual. O valor ser\\u00E1 alterado com base no usu\\u00E1rio com sess\\u00E3o iniciada.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Eliminar configura\\u00E7\\u00E3o\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Este cart\\u00E3o tem configura\\u00E7\\u00F5es individuais. Quer elimin\\u00E1-las irrevogavelmente e reinicializar o cart\\u00E3o com as configura\\u00E7\\u00F5es predefinidas?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Eliminar\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Cancelar\n',
  "sap/ushell/components/workPageBuilder/resources/resources_ro.properties":
    '\n\nWorkPage.EmptyPage.Title=Pagin\\u0103 goal\\u0103\nWorkPage.EmptyPage.Message=Aceast\\u0103 pagin\\u0103 nu con\\u021Bine \\u00EEnc\\u0103 nicio sec\\u021Biune.\nWorkPage.EmptyPage.Button.Add=Ad\\u0103ugare sec\\u021Biune\n\nWorkPage.EditMode.Save=Salvare\nWorkPage.EditMode.Cancel=Anulare\nWorkPage.Message.WidgetMoved=Widget mutat\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Titlu sec\\u021Biune\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Introduce\\u021Bi un titlu de sec\\u021Biune op\\u021Bional\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Eliminare sec\\u021Biune\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u0218tergere sec\\u021Biune\nWorkPage.Row.DeleteDialog.Title=\\u0218tergere\nWorkPage.Row.DeleteDialog.ConfirmText=Dori\\u021Bi s\\u0103 \\u0219terge\\u021Bi aceast\\u0103 sec\\u021Biune \\u0219i tot con\\u021Binutul s\\u0103u?\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u0218tergere\nWorkPage.Row.DeleteDialog.Button.Cancel=Anulare\nWorkPage.Row.AddRowButtonTooltip=Ad\\u0103ugare sec\\u021Biune\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u00CEn timpul execu\\u021Biei, doar primele patru coloane vor fi vizibile. Reduce\\u021Bi num\\u0103rul de coloane la patru.\nWorkPage.Row.AriaLabel=Sec\\u021Biuni pagin\\u0103 de lucru\n\nWorkPage.Column.AriaLabel=Coloana {0} din {1}\nWorkPage.Column.AddWidgetButtonText=Ad\\u0103ugare widget\nWorkPage.Column.DeleteColumnButtonTooltip=Eliminare coloan\\u0103\nWorkPage.Column.AddColumnButtonTooltip=Ad\\u0103ugare coloan\\u0103\nWorkPage.Column.EmptyIllustrationTitle=C\\u0103utare aplica\\u021Bii\nWorkPage.Column.EmptyIllustrationDescription=Ad\\u0103uga\\u021Bi aplica\\u021Bii la widget sau elimina\\u021Bi widget dac\\u0103 nu ave\\u021Bi nevoie de el.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Ad\\u0103ugare aplica\\u021Bie\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u0218tergere widget\nWorkPage.Cell.EmptyIllustrationTitle=C\\u0103utare aplica\\u021Bii\nWorkPage.Cell.EmptyIllustrationDescription=Ad\\u0103uga\\u021Bi aplica\\u021Bii la widget sau elimina\\u021Bi widget dac\\u0103 nu ave\\u021Bi nevoie de el.\nWorkPage.Cell.DeleteDialog.Title=\\u0218tergere\nWorkPage.Cell.DeleteDialog.ConfirmText=Sigur dori\\u021Bi s\\u0103 \\u0219terge\\u021Bi acest widget? Toate aplica\\u021Biile din acesta vor fi eliminate de pe pagin\\u0103.\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u0218tergere\nWorkPage.Cell.DeleteDialog.Button.Cancel=Anulare\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Set\\u0103ri widget deschis\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u0218tergere widget\n\nWorkPage.Section.AddVizInstanceButtonText=Ad\\u0103ugare mozaicuri\n\n\nContentFinder.Categories.Applications.Title=Aplica\\u021Bii\nContentFinder.Widgets.Tiles.Title=Mozaicuri\nContentFinder.Widgets.Tiles.Description=Reprezentarea vizual\\u0103 a aplica\\u021Biilor.\nContentFinder.Widgets.Cards.Title=Carduri\nContentFinder.Widgets.Cards.Description=Reprezentarea vizual\\u0103 a aplica\\u021Biilor, afi\\u0219ate \\u00EEn layouturi flexibile.\n\nWorkPage.CardEditor.Save=Salvare\nWorkPage.CardEditor.Cancel=Anulare\nWorkPage.CardEditor.Title=Configurare "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Configurare\nWorkPage.Card.ActionDefinition.Configure=Configurare\nWorkPage.Card.ActionDefinition.Reset=\\u0218tergere configurare\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Utilizator curent\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID utilizator SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID utilizator SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID utilizator curent. Valoarea se va modifica pe baza utilizatorului care este conectat. Pentru a afi\\u0219a numele utilizatorului, utiliza\\u021Bi nume utilizator SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Nume utilizator SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Nume utilizator SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Nume utilizator curent cu prenume, al doilea prenume \\u0219i nume de familie. Al doilea prenume va fi abreviat. Valoarea se va modifica pe baza utilizatorului care este conectat.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Prenume utilizator SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Prenume utilizator SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Prenumele utilizatorului curent. Valoarea se va modifica pe baza utilizatorului care este conectat.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Nume de familie utilizator SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Nume de familie utilizator SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Numele de familie al utilizatorului curent. Valoarea se va modifica pe baza utilizatorului care este conectat.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Adres\\u0103 de e-mail utilizator curent SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-mail utilizator SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Adresa de e-mail a utilizatorului curent SAP Build Work Zone. Valoarea se va modifica pe baza utilizatorului care este conectat.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u0218tergere configurare\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Acest card are configur\\u0103ri individuale. Dori\\u021Bi s\\u0103 le \\u0219terge\\u021Bi definitiv \\u0219i s\\u0103 reseta\\u021Bi cardul la set\\u0103rile sale implicite?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u0218tergere\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Anulare\n',
  "sap/ushell/components/workPageBuilder/resources/resources_ru.properties":
    '\n\nWorkPage.EmptyPage.Title=\\u041F\\u0443\\u0441\\u0442\\u0430\\u044F \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\nWorkPage.EmptyPage.Message=\\u041D\\u0430 \\u044D\\u0442\\u043E\\u0439 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0435 \\u043F\\u043E\\u043A\\u0430 \\u043D\\u0435\\u0442 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u043E\\u0432.\nWorkPage.EmptyPage.Button.Add=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\n\nWorkPage.EditMode.Save=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\nWorkPage.EditMode.Cancel=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0430\nWorkPage.Message.WidgetMoved=\\u0412\\u0438\\u0434\\u0436\\u0435\\u0442 \\u043F\\u0435\\u0440\\u0435\\u043C\\u0435\\u0449\\u0435\\u043D\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0430\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u0412\\u0432\\u0435\\u0434\\u0438\\u0442\\u0435 \\u043E\\u043F\\u0446\\u0438\\u043E\\u043D\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0437\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0430\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\nWorkPage.Row.DeleteDialog.Title=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\nWorkPage.Row.DeleteDialog.ConfirmText=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u044D\\u0442\\u043E\\u0442 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B \\u0438 \\u0432\\u0441\\u0435 \\u0435\\u0433\\u043E \\u0441\\u043E\\u0434\\u0435\\u0440\\u0436\\u0438\\u043C\\u043E\\u0435?\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\nWorkPage.Row.AddRowButtonTooltip=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u0412\\u043E \\u0432\\u0440\\u0435\\u043C\\u044F \\u0432\\u044B\\u043F\\u043E\\u043B\\u043D\\u0435\\u043D\\u0438\\u044F \\u043E\\u0442\\u043E\\u0431\\u0440\\u0430\\u0436\\u0430\\u044E\\u0442\\u0441\\u044F \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u043F\\u0435\\u0440\\u0432\\u044B\\u0435 \\u0447\\u0435\\u0442\\u044B\\u0440\\u0435 \\u0441\\u0442\\u043E\\u043B\\u0431\\u0446\\u0430. \\u0423\\u043C\\u0435\\u043D\\u044C\\u0448\\u0438\\u0442\\u0435 \\u0447\\u0438\\u0441\\u043B\\u043E \\u0441\\u0442\\u043E\\u043B\\u0431\\u0446\\u043E\\u0432 \\u0434\\u043E \\u0447\\u0435\\u0442\\u044B\\u0440\\u0435\\u0445.\nWorkPage.Row.AriaLabel=\\u0420\\u0430\\u0437\\u0434\\u0435\\u043B\\u044B \\u0440\\u0430\\u0431\\u043E\\u0447\\u0435\\u0439 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B\n\nWorkPage.Column.AriaLabel=\\u0421\\u0442\\u043E\\u043B\\u0431\\u0435\\u0446 {0} \\u0438\\u0437 {1}\nWorkPage.Column.AddWidgetButtonText=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442\nWorkPage.Column.DeleteColumnButtonTooltip=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u0441\\u0442\\u043E\\u043B\\u0431\\u0435\\u0446\nWorkPage.Column.AddColumnButtonTooltip=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u0441\\u0442\\u043E\\u043B\\u0431\\u0435\\u0446\nWorkPage.Column.EmptyIllustrationTitle=\\u041F\\u043E\\u0438\\u0441\\u043A \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0439\nWorkPage.Column.EmptyIllustrationDescription=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044C\\u0442\\u0435 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F \\u0432 \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442 \\u0438\\u043B\\u0438 \\u0443\\u0434\\u0430\\u043B\\u0438\\u0442\\u0435 \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442, \\u0435\\u0441\\u043B\\u0438 \\u043E\\u043D \\u0431\\u043E\\u043B\\u044C\\u0448\\u0435 \\u043D\\u0435 \\u043D\\u0443\\u0436\\u0435\\u043D.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442\nWorkPage.Cell.EmptyIllustrationTitle=\\u041F\\u043E\\u0438\\u0441\\u043A \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0439\nWorkPage.Cell.EmptyIllustrationDescription=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044C\\u0442\\u0435 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F \\u0432 \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442 \\u0438\\u043B\\u0438 \\u0443\\u0434\\u0430\\u043B\\u0438\\u0442\\u0435 \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442, \\u0435\\u0441\\u043B\\u0438 \\u043E\\u043D \\u0431\\u043E\\u043B\\u044C\\u0448\\u0435 \\u043D\\u0435 \\u043D\\u0443\\u0436\\u0435\\u043D.\nWorkPage.Cell.DeleteDialog.Title=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u0414\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u043E \\u0443\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u044D\\u0442\\u043E\\u0442 \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442? \\u0412\\u0441\\u0435 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F \\u0432 \\u043D\\u0435\\u043C \\u0431\\u0443\\u0434\\u0443\\u0442 \\u0442\\u0430\\u043A\\u0436\\u0435 \\u0443\\u0434\\u0430\\u043B\\u0435\\u043D\\u044B \\u0441\\u043E \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B.\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u041E\\u0442\\u043A\\u0440\\u044B\\u0442\\u044C \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442\\u0430\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u0432\\u0438\\u0434\\u0436\\u0435\\u0442\n\nWorkPage.Section.AddVizInstanceButtonText=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043F\\u043B\\u0438\\u0442\\u043A\\u0438\n\n\nContentFinder.Categories.Applications.Title=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\nContentFinder.Widgets.Tiles.Title=\\u041F\\u043B\\u0438\\u0442\\u043A\\u0438\nContentFinder.Widgets.Tiles.Description=\\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u044C\\u043D\\u043E\\u0435 \\u043F\\u0440\\u0435\\u0434\\u0441\\u0442\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0439.\nContentFinder.Widgets.Cards.Title=\\u041A\\u0430\\u0440\\u0442\\u044B\nContentFinder.Widgets.Cards.Description=\\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u044C\\u043D\\u043E\\u0435 \\u043F\\u0440\\u0435\\u0434\\u0441\\u0442\\u0430\\u0432\\u043B\\u0435\\u043D\\u0438\\u0435 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0439 \\u0432 \\u0433\\u0438\\u0431\\u043A\\u043E\\u043C \\u0444\\u043E\\u0440\\u043C\\u0430\\u0442\\u0435.\n\nWorkPage.CardEditor.Save=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\nWorkPage.CardEditor.Cancel=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\nWorkPage.CardEditor.Title=\\u0421\\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=\\u0421\\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C\nWorkPage.Card.ActionDefinition.Configure=\\u0421\\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C\nWorkPage.Card.ActionDefinition.Reset=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044E\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\u0422\\u0435\\u043A\\u0443\\u0449\\u0438\\u0439 \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044C\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=\\u0418\\u0434. \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=\\u0418\\u0434. \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=\\u0418\\u0434. \\u0442\\u0435\\u043A\\u0443\\u0449\\u0435\\u0433\\u043E \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F. \\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u043C\\u0435\\u043D\\u044F\\u0435\\u0442\\u0441\\u044F \\u0432 \\u0437\\u0430\\u0432\\u0438\\u0441\\u0438\\u043C\\u043E\\u0441\\u0442\\u0438 \\u043E\\u0442 \\u0432\\u043E\\u0448\\u0435\\u0434\\u0448\\u0435\\u0433\\u043E \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0443 \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F. \\u0414\\u043B\\u044F \\u0438\\u043C\\u0435\\u043D\\u0438 \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F \\u0438\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u0443\\u0439\\u0442\\u0435 \\u0438\\u043C\\u044F \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=\\u0418\\u043C\\u044F \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=\\u0418\\u043C\\u044F \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\u0418\\u043C\\u044F \\u0442\\u0435\\u043A\\u0443\\u0449\\u0435\\u0433\\u043E \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F, \\u0432\\u043A\\u043B\\u044E\\u0447\\u0430\\u044E\\u0449\\u0435\\u0435 \\u0438\\u043C\\u044F, \\u0444\\u0430\\u043C\\u0438\\u043B\\u0438\\u044E \\u0438 \\u0441\\u0440\\u0435\\u0434\\u043D\\u0435\\u0435 \\u0438\\u043C\\u044F. \\u0421\\u0440\\u0435\\u0434\\u043D\\u0435\\u0435 \\u0438\\u043C\\u044F \\u043E\\u0442\\u043E\\u0431\\u0440\\u0430\\u0436\\u0430\\u0435\\u0442\\u0441\\u044F \\u043A\\u0430\\u043A \\u0441\\u043E\\u043A\\u0440\\u0430\\u0449\\u0435\\u043D\\u0438\\u0435. \\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u043C\\u0435\\u043D\\u044F\\u0435\\u0442\\u0441\\u044F \\u0432 \\u0437\\u0430\\u0432\\u0438\\u0441\\u0438\\u043C\\u043E\\u0441\\u0442\\u0438 \\u043E\\u0442 \\u0432\\u043E\\u0448\\u0435\\u0434\\u0448\\u0435\\u0433\\u043E \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0443 \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=\\u0418\\u043C\\u044F \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=\\u0418\\u043C\\u044F \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\u0418\\u043C\\u044F \\u0442\\u0435\\u043A\\u0443\\u0449\\u0435\\u0433\\u043E \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F. \\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u043C\\u0435\\u043D\\u044F\\u0435\\u0442\\u0441\\u044F \\u0432 \\u0437\\u0430\\u0432\\u0438\\u0441\\u0438\\u043C\\u043E\\u0441\\u0442\\u0438 \\u043E\\u0442 \\u0432\\u043E\\u0448\\u0435\\u0434\\u0448\\u0435\\u0433\\u043E \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0443 \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=\\u0424\\u0430\\u043C\\u0438\\u043B\\u0438\\u044F \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=\\u0424\\u0430\\u043C\\u0438\\u043B\\u0438\\u044F \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\u0424\\u0430\\u043C\\u0438\\u043B\\u0438\\u044F \\u0442\\u0435\\u043A\\u0443\\u0449\\u0435\\u0433\\u043E \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F. \\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u043C\\u0435\\u043D\\u044F\\u0435\\u0442\\u0441\\u044F \\u0432 \\u0437\\u0430\\u0432\\u0438\\u0441\\u0438\\u043C\\u043E\\u0441\\u0442\\u0438 \\u043E\\u0442 \\u0432\\u043E\\u0448\\u0435\\u0434\\u0448\\u0435\\u0433\\u043E \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0443 \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\u0410\\u0434\\u0440\\u0435\\u0441 \\u044D\\u043B\\u0435\\u043A\\u0442\\u0440\\u043E\\u043D\\u043D\\u043E\\u0439 \\u043F\\u043E\\u0447\\u0442\\u044B \\u0442\\u0435\\u043A\\u0443\\u0449\\u0435\\u0433\\u043E \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=\\u042D\\u043B\\u0435\\u043A\\u0442\\u0440\\u043E\\u043D\\u043D\\u0430\\u044F \\u043F\\u043E\\u0447\\u0442\\u0430 \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u0410\\u0434\\u0440\\u0435\\u0441 \\u044D\\u043B\\u0435\\u043A\\u0442\\u0440\\u043E\\u043D\\u043D\\u043E\\u0439 \\u043F\\u043E\\u0447\\u0442\\u044B \\u0442\\u0435\\u043A\\u0443\\u0449\\u0435\\u0433\\u043E \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F SAP Build Work Zone. \\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u0438\\u0435 \\u043C\\u0435\\u043D\\u044F\\u0435\\u0442\\u0441\\u044F \\u0432 \\u0437\\u0430\\u0432\\u0438\\u0441\\u0438\\u043C\\u043E\\u0441\\u0442\\u0438 \\u043E\\u0442 \\u0432\\u043E\\u0448\\u0435\\u0434\\u0448\\u0435\\u0433\\u043E \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0443 \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044E\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u042D\\u0442\\u0430 \\u043A\\u0430\\u0440\\u0442\\u0430 \\u0438\\u043C\\u0435\\u0435\\u0442 \\u0438\\u043D\\u0434\\u0438\\u0432\\u0438\\u0434\\u0443\\u0430\\u043B\\u044C\\u043D\\u044B\\u0435 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u0438. \\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u0438\\u0445 \\u0431\\u0435\\u0437 \\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E\\u0441\\u0442\\u0438 \\u0432\\u043E\\u0441\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\\u0438\\u044F \\u0438 \\u0441\\u0431\\u0440\\u043E\\u0441\\u0438\\u0442\\u044C \\u043A\\u0430\\u0440\\u0442\\u0443 \\u043D\\u0430 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u043F\\u043E \\u0443\\u043C\\u043E\\u043B\\u0447\\u0430\\u043D\\u0438\\u044E?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\n',
  "sap/ushell/components/workPageBuilder/resources/resources_sh.properties":
    '\n\nWorkPage.EmptyPage.Title=Prazna stranica\nWorkPage.EmptyPage.Message=Ova stranica jo\\u0161 ne sadr\\u017Ei odeljke.\nWorkPage.EmptyPage.Button.Add=Dodaj odeljak\n\nWorkPage.EditMode.Save=Sa\\u010Duvaj\nWorkPage.EditMode.Cancel=Odustani\nWorkPage.Message.WidgetMoved=Vid\\u017Eet preme\\u0161ten\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Naslov odeljka\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Unesite izborni naslov odeljka\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Ukloni odeljak\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Izbri\\u0161i odeljak\nWorkPage.Row.DeleteDialog.Title=Izbri\\u0161i\nWorkPage.Row.DeleteDialog.ConfirmText=Da li \\u017Eelite da izbri\\u0161ete ovaj odeljak i ceo njegov sadr\\u017Eaj?\nWorkPage.Row.DeleteDialog.Button.Confirm=Izbri\\u0161i\nWorkPage.Row.DeleteDialog.Button.Cancel=Odustani\nWorkPage.Row.AddRowButtonTooltip=Dodaj odeljak\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=U vremenu izvo\\u0111enja samo su prve \\u010Detiri kolone vidljive. Smanjite broj kolona na \\u010Detiri.\nWorkPage.Row.AriaLabel=Odeljci stranice posla\n\nWorkPage.Column.AriaLabel=Kolona {0} od {1}\nWorkPage.Column.AddWidgetButtonText=Dodaj vid\\u017Eet\nWorkPage.Column.DeleteColumnButtonTooltip=Ukloni kolonu\nWorkPage.Column.AddColumnButtonTooltip=Dodaj kolonu\nWorkPage.Column.EmptyIllustrationTitle=Tra\\u017Ei aplikacije\nWorkPage.Column.EmptyIllustrationDescription=Dodajte aplikacije vid\\u017Eetu ili uklonite vid\\u017Eet ako vam nije potreban\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Dodaj aplikacije\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Izbri\\u0161i vid\\u017Eet\nWorkPage.Cell.EmptyIllustrationTitle=Tra\\u017Ei aplikacije\nWorkPage.Cell.EmptyIllustrationDescription=Dodajte aplikacije vid\\u017Eetu ili uklonite vid\\u017Eet ako vam nije potreban\nWorkPage.Cell.DeleteDialog.Title=Izbri\\u0161i\nWorkPage.Cell.DeleteDialog.ConfirmText=Da li sigurno \\u017Eelite da izbri\\u0161ete ovaj vid\\u017Eet? Sve aplikacije koje su u njemu \\u0107e tako\\u0111e biti izbrisane sa stranice.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Izbri\\u0161i\nWorkPage.Cell.DeleteDialog.Button.Cancel=Odustani\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Otvori pode\\u0161avanja vid\\u017Eeta\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Izbri\\u0161i vid\\u017Eet\n\nWorkPage.Section.AddVizInstanceButtonText=Dodaj podekrane\n\n\nContentFinder.Categories.Applications.Title=Aplikacije\nContentFinder.Widgets.Tiles.Title=Podekrani\nContentFinder.Widgets.Tiles.Description=Vizuelni prikaz aplikacija.\nContentFinder.Widgets.Cards.Title=Kartice\nContentFinder.Widgets.Cards.Description=Vizuelni prikaz aplikacija, prikazano u fleksibilnim izgledima.\n\nWorkPage.CardEditor.Save=Sa\\u010Duvaj\nWorkPage.CardEditor.Cancel=Odustani\nWorkPage.CardEditor.Title=Konfiguri\\u0161i "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Konfiguri\\u0161i\nWorkPage.Card.ActionDefinition.Configure=Konfiguri\\u0161i\nWorkPage.Card.ActionDefinition.Reset=Izbri\\u0161i konfiguraciju\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Trenutni korisnik\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID korisnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID korisnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID trenutnog korisnika. Vrednost \\u0107e se promeniti u zavisnosti od toga koji je korisnik prijavljen. Da biste prikazali ime korisnika, korostite Ime korisnika SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Ime korisnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Korisni\\u010Dko ime SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Ime trenutnog korisnika sa imenom, srednjim imenom i prezimenom. Srednje ime \\u0107e biti skra\\u0107eno. Vrednost \\u0107e se promeniti u zavisnosti od toga koji je korisnik prijavljen.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Ime korisnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Ime korisnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Ime trenutnog korisnika. Vrednost \\u0107e se promeniti u zavisnosti od toga koji je korisnik prijavljen.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Prezime korisnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Prezime korisnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Ime trenutnog korisnika. Vrednost \\u0107e se promeniti u zavisnosti od toga koji je korisnik prijavljen.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Adresa e-po\\u0161te trenutnog korisnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-po\\u0161ta korisnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Adresa e-po\\u0161te trenutnog korisnika SAP Build Work Zone. Vrednost \\u0107e se promeniti u zavisnosti od toga koji je korisnik prijavljen.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Izbri\\u0161i konfiguraciju\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Ova kartica ima pojedina\\u010Dne konfiguracije. Da li \\u017Eelite da ih nepovratno izbri\\u0161ete i ponovo postavite karticu na standardna pode\\u0161avanja?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Izbri\\u0161i\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Odustani\n',
  "sap/ushell/components/workPageBuilder/resources/resources_sk.properties":
    '\n\nWorkPage.EmptyPage.Title=Pr\\u00E1zdna str.\nWorkPage.EmptyPage.Message=T\\u00E1to str\\u00E1nka zatia\\u013E neobsahuje \\u017Eiadne sekcie.\nWorkPage.EmptyPage.Button.Add=Prida\\u0165 sekciu\n\nWorkPage.EditMode.Save=Ulo\\u017Ei\\u0165\nWorkPage.EditMode.Cancel=Zru\\u0161i\\u0165\nWorkPage.Message.WidgetMoved=Miniaplik\\u00E1cia presunut\\u00E1\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=N\\u00E1zov sekcie\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Zadajte nepovinn\\u00FD n\\u00E1zov sekcie\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Odstr\\u00E1ni\\u0165 sekciu\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Vymaza\\u0165 sekciu\nWorkPage.Row.DeleteDialog.Title=Odstr\\u00E1ni\\u0165\nWorkPage.Row.DeleteDialog.ConfirmText=Chcete odstr\\u00E1ni\\u0165 t\\u00FAto sekciu a cel\\u00FD jej obsah?\nWorkPage.Row.DeleteDialog.Button.Confirm=Odstr\\u00E1ni\\u0165\nWorkPage.Row.DeleteDialog.Button.Cancel=Zru\\u0161i\\u0165\nWorkPage.Row.AddRowButtonTooltip=Prida\\u0165 sekciu\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=V re\\u017Eime doby chodu bud\\u00FA vidite\\u013En\\u00E9 iba prv\\u00E9 \\u0161tyri st\\u013Apce. Zn\\u00ED\\u017Ete po\\u010Det st\\u013Apcov na \\u0161tyri.\nWorkPage.Row.AriaLabel=Sekcie pracovnej str\\u00E1nky\n\nWorkPage.Column.AriaLabel=St\\u013Apec {0} z {1}\nWorkPage.Column.AddWidgetButtonText=Prida\\u0165 miniaplik\\u00E1ciu\nWorkPage.Column.DeleteColumnButtonTooltip=Odstr\\u00E1ni\\u0165 st\\u013Apec\nWorkPage.Column.AddColumnButtonTooltip=Prida\\u0165 st\\u013Apec\nWorkPage.Column.EmptyIllustrationTitle=Vyh\\u013Ead\\u00E1va\\u0165 aplik\\u00E1cie\nWorkPage.Column.EmptyIllustrationDescription=Pridajte aplik\\u00E1cie do miniaplik\\u00E1cie alebo ju odstr\\u00E1\\u0148te, ak ju nepotrebujete.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Prida\\u0165 aplik\\u00E1ciu\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Odstr\\u00E1ni\\u0165 miniaplik\\u00E1ciu\nWorkPage.Cell.EmptyIllustrationTitle=Vyh\\u013Ead\\u00E1va\\u0165 aplik\\u00E1cie\nWorkPage.Cell.EmptyIllustrationDescription=Pridajte aplik\\u00E1cie do miniaplik\\u00E1cie alebo ju odstr\\u00E1\\u0148te, ak ju nepotrebujete.\nWorkPage.Cell.DeleteDialog.Title=Odstr\\u00E1ni\\u0165\nWorkPage.Cell.DeleteDialog.ConfirmText=Naozaj chcete odstr\\u00E1ni\\u0165 tento widget? V\\u0161etky aplik\\u00E1cie v \\u0148om bud\\u00FA tie\\u017E odstr\\u00E1nen\\u00E9 zo str\\u00E1nky.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Odstr\\u00E1ni\\u0165\nWorkPage.Cell.DeleteDialog.Button.Cancel=Zru\\u0161i\\u0165\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Otvori\\u0165 nastavenia miniaplik\\u00E1cie\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Odstr\\u00E1ni\\u0165 miniaplik\\u00E1ciu\n\nWorkPage.Section.AddVizInstanceButtonText=Prida\\u0165 dla\\u017Edice\n\n\nContentFinder.Categories.Applications.Title=Aplik\\u00E1cie\nContentFinder.Widgets.Tiles.Title=Dla\\u017Edice\nContentFinder.Widgets.Tiles.Description=Vizu\\u00E1lne zn\\u00E1zornenia aplik\\u00E1ci\\u00ED.\nContentFinder.Widgets.Cards.Title=Karty\nContentFinder.Widgets.Cards.Description=Vizu\\u00E1lne zn\\u00E1zornenia aplik\\u00E1ci\\u00ED zobrazen\\u00E9 vo flexibiln\\u00FDch rozlo\\u017Eeniach.\n\nWorkPage.CardEditor.Save=Ulo\\u017Ei\\u0165\nWorkPage.CardEditor.Cancel=Zru\\u0161i\\u0165\nWorkPage.CardEditor.Title=Konfigurova\\u0165 "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Konfigurova\\u0165\nWorkPage.Card.ActionDefinition.Configure=Konfigurova\\u0165\nWorkPage.Card.ActionDefinition.Reset=Odstr\\u00E1ni\\u0165 konfigur\\u00E1ciu\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Aktu\\u00E1lny pou\\u017E\\u00EDvate\\u013E\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID pou\\u017E\\u00EDvate\\u013Ea SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID pou\\u017E\\u00EDvate\\u013Ea SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID aktu\\u00E1lneho pou\\u017E\\u00EDvate\\u013Ea. Hodnota sa zmen\\u00ED v z\\u00E1vislosti od prihl\\u00E1sen\\u00E9ho pou\\u017E\\u00EDvate\\u013Ea. Ak chcete zobrazi\\u0165 meno pou\\u017E\\u00EDvate\\u013Ea, pou\\u017Eite N\\u00E1zov pou\\u017E\\u00EDvate\\u013Ea SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Pou\\u017E\\u00EDvate\\u013E SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Pou\\u017E\\u00EDvate\\u013E SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Meno aktu\\u00E1lneho pou\\u017E\\u00EDvate\\u013Ea s menom, stredn\\u00FDm menom a priezviskom. Stredn\\u00E9 meno bude skr\\u00E1ten\\u00E9. Hodnota sa zmen\\u00ED v z\\u00E1vislosti od prihl\\u00E1sen\\u00E9ho pou\\u017E\\u00EDvate\\u013Ea.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Meno pou\\u017E\\u00EDvate\\u013Ea SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Meno pou\\u017E\\u00EDvate\\u013Ea SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Krstn\\u00E9 meno aktu\\u00E1lneho pou\\u017E\\u00EDvate\\u013Ea. Hodnota sa zmen\\u00ED v z\\u00E1vislosti od prihl\\u00E1sen\\u00E9ho pou\\u017E\\u00EDvate\\u013Ea\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Priezvisko pou\\u017E\\u00EDvate\\u013Ea SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Priezvisko pou\\u017E\\u00EDvate\\u013Ea SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Priezvisko aktu\\u00E1lneho pou\\u017E\\u00EDvate\\u013Ea. Hodnota sa zmen\\u00ED v z\\u00E1vislosti od prihl\\u00E1sen\\u00E9ho pou\\u017E\\u00EDvate\\u013Ea\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=E-mailov\\u00E1 adresa aktu\\u00E1lneho pou\\u017E\\u00EDvate\\u013Ea SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-mail pou\\u017E\\u00EDvate\\u013Ea SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=E-mailov\\u00E1 adresa aktu\\u00E1lneho pou\\u017E\\u00EDvate\\u013Ea SAP Build Work Zone. Hodnota sa zmen\\u00ED v z\\u00E1vislosti od prihl\\u00E1sen\\u00E9ho pou\\u017E\\u00EDvate\\u013Ea.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Odstr\\u00E1ni\\u0165 konfigur\\u00E1ciu\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=T\\u00E1to karta m\\u00E1 individu\\u00E1lne konfigur\\u00E1cie. Chcete ich nen\\u00E1vratne odstr\\u00E1ni\\u0165 a obnovi\\u0165 predvolen\\u00E9 nastavenia karty?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Odstr\\u00E1ni\\u0165\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Zru\\u0161i\\u0165\n',
  "sap/ushell/components/workPageBuilder/resources/resources_sl.properties":
    '\n\nWorkPage.EmptyPage.Title=Prazna stran\nWorkPage.EmptyPage.Message=Ta stran \\u0161e ne vsebuje segmentov.\nWorkPage.EmptyPage.Button.Add=Dodajanje segmenta\n\nWorkPage.EditMode.Save=Shranjevanje\nWorkPage.EditMode.Cancel=Preklic\nWorkPage.Message.WidgetMoved=Pripomo\\u010Dek premaknjen\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Naslov segmenta\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Vnos neobveznega naslova razdelka\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Odstranitev segmenta\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Brisanje segmenta\nWorkPage.Row.DeleteDialog.Title=Izbri\\u0161i\nWorkPage.Row.DeleteDialog.ConfirmText=\\u017Delite izbrisati ta segment in vso njegovo vsebino?\nWorkPage.Row.DeleteDialog.Button.Confirm=Izbri\\u0161i\nWorkPage.Row.DeleteDialog.Button.Cancel=Prekli\\u010Di\nWorkPage.Row.AddRowButtonTooltip=Dodajanje segmenta\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=V \\u010Dasu izvajanja bodo vidni samo prvi \\u0161tirje stolpci. Omejite \\u0161tevilo stolpcev na \\u0161tiri.\nWorkPage.Row.AriaLabel=Segmenti delovne strani\n\nWorkPage.Column.AriaLabel=Stolpec {0} od {1}\nWorkPage.Column.AddWidgetButtonText=Dodajanje okenskega program\\u010Dka\nWorkPage.Column.DeleteColumnButtonTooltip=Odstrani stolpec\nWorkPage.Column.AddColumnButtonTooltip=Dodaj stolpec\nWorkPage.Column.EmptyIllustrationTitle=Iskanje aplikacij\nWorkPage.Column.EmptyIllustrationDescription=Dodajte aplikacije okenskemu program\\u010Dku ali odstranite okenski program\\u010Dek, \\u010De ga ne potrebujete.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Dodaj aplikacijo\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Izbri\\u0161i okenski program\\u010Dek\nWorkPage.Cell.EmptyIllustrationTitle=Iskanje aplikacij\nWorkPage.Cell.EmptyIllustrationDescription=Dodajte aplikacije okenskemu program\\u010Dku ali odstranite okenski program\\u010Dek, \\u010De ga ne potrebujete.\nWorkPage.Cell.DeleteDialog.Title=Izbri\\u0161i\nWorkPage.Cell.DeleteDialog.ConfirmText=Ali ste prepri\\u010Dani, da \\u017Eelite izbrisati ta okenski program\\u010Dek? S strani bodo odstranjene tudi vse aplikacije v njej.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Izbri\\u0161i\nWorkPage.Cell.DeleteDialog.Button.Cancel=Prekli\\u010Di\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Odpri nastavitve okenskega program\\u010Dka\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Izbri\\u0161i okenski program\\u010Dek\n\nWorkPage.Section.AddVizInstanceButtonText=Dodaj plo\\u0161\\u010Dice\n\n\nContentFinder.Categories.Applications.Title=Aplikacije\nContentFinder.Widgets.Tiles.Title=Plo\\u0161\\u010Dice\nContentFinder.Widgets.Tiles.Description=Vizualne predstavitve aplikacij\nContentFinder.Widgets.Cards.Title=Kartice\nContentFinder.Widgets.Cards.Description=Vizualne predstavitve aplikacij, prikazane v prilagodljivih postavitvah.\n\nWorkPage.CardEditor.Save=Shrani\nWorkPage.CardEditor.Cancel=Preklic\nWorkPage.CardEditor.Title=Konfiguracija "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Konfiguracija\nWorkPage.Card.ActionDefinition.Configure=Konfiguracija\nWorkPage.Card.ActionDefinition.Reset=Izbris konfiguracije\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Trenutni uporabnik\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID uporabnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID uporabnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID trenutnega uporabnika\\: Vrednost se bo spremenila glede na prijavljenega uporabnika. Za prikaz imena uporabnika uporabite Ime uporabnika SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Ime uporabnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Ime uporabnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Ime, drugo ime in priimek trenutnega uporabnika. Drugo ime bo okraj\\u0161ano. Vrednost se bo spremenila glede na prijavljenega uporabnika.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=Ime uporabnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=Ime uporabnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Ime trenutnega uporabnika. Vrednost se bo spremenila glede na prijavljenega uporabnika.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Priimek uporabnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Priimek uporabnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Priimek trenutnega uporabnika. Vrednost se bo spremenila glede na prijavljenega uporabnika.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=E-po\\u0161tni naslov trenutnega uporabnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-po\\u0161tni naslov uporabnika SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=E-po\\u0161tni naslov trenutnega uporabnika SAP Build Work Zone. Vrednost se bo spremenila glede na prijavljenega uporabnika.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Izbris konfiguracije\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Ta kartica ima posamezne konfiguracije. Ali jih \\u017Eelite nepreklicno izbrisati in ponastaviti kartico na privzete nastavitve?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Izbri\\u0161i\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Prekli\\u010Di\n',
  "sap/ushell/components/workPageBuilder/resources/resources_sv.properties":
    '\n\nWorkPage.EmptyPage.Title=Tom sida\nWorkPage.EmptyPage.Message=Den h\\u00E4r sidan inneh\\u00E5ller inga avsnitt \\u00E4n.\nWorkPage.EmptyPage.Button.Add=L\\u00E4gg till avsnitt\n\nWorkPage.EditMode.Save=Spara\nWorkPage.EditMode.Cancel=Avbryt\nWorkPage.Message.WidgetMoved=Widget flyttad\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Avsnittsnamn\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Ange ett valfritt avsnittsnamn\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Ta bort avsnitt\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=Radera avsnitt\nWorkPage.Row.DeleteDialog.Title=Radera\nWorkPage.Row.DeleteDialog.ConfirmText=Vill du radera avsnittet och allt inneh\\u00E5ll?\nWorkPage.Row.DeleteDialog.Button.Confirm=Radera\nWorkPage.Row.DeleteDialog.Button.Cancel=Avbryt\nWorkPage.Row.AddRowButtonTooltip=L\\u00E4gg till avsnitt\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Under k\\u00F6rningstid visas endast de fyra f\\u00F6rsta kolumnerna. Minska antalet kolumner till fyra.\nWorkPage.Row.AriaLabel=Arbetssidavsnitt\n\nWorkPage.Column.AriaLabel=Kolumn {0} av {1}\nWorkPage.Column.AddWidgetButtonText=L\\u00E4gg till widget\nWorkPage.Column.DeleteColumnButtonTooltip=Ta bort kolumn\nWorkPage.Column.AddColumnButtonTooltip=L\\u00E4gg till kolumn\nWorkPage.Column.EmptyIllustrationTitle=S\\u00F6k efter appar\nWorkPage.Column.EmptyIllustrationDescription=L\\u00E4gg till appar till widget, eller ta bort widget om du inte beh\\u00F6ver den.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=L\\u00E4gg till app\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Radera widget\nWorkPage.Cell.EmptyIllustrationTitle=S\\u00F6k efter appar\nWorkPage.Cell.EmptyIllustrationDescription=L\\u00E4gg till appar till widget, eller ta bort widget om du inte beh\\u00F6ver den.\nWorkPage.Cell.DeleteDialog.Title=Radera\nWorkPage.Cell.DeleteDialog.ConfirmText=Vill du radera denna widget? Alla appar i den kommer ocks\\u00E5 att tas bort fr\\u00E5n sidan.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Radera\nWorkPage.Cell.DeleteDialog.Button.Cancel=Avbryt\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u00D6ppna widgetinst\\u00E4llningar\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Radera widget\n\nWorkPage.Section.AddVizInstanceButtonText=L\\u00E4gg till paneler\n\n\nContentFinder.Categories.Applications.Title=Applikationer\nContentFinder.Widgets.Tiles.Title=Paneler\nContentFinder.Widgets.Tiles.Description=Visuella representationer av appar.\nContentFinder.Widgets.Cards.Title=Kort\nContentFinder.Widgets.Cards.Description=Visuella representationer av appar som visas i flexibla layouter.\n\nWorkPage.CardEditor.Save=Spara\nWorkPage.CardEditor.Cancel=Avbryt\nWorkPage.CardEditor.Title=Konfigurera "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=Konfigurera\nWorkPage.Card.ActionDefinition.Configure=Konfigurera\nWorkPage.Card.ActionDefinition.Reset=Radera konfiguration\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Aktuell anv\\u00E4ndare\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID f\\u00F6r SAP Build Work Zone-anv\\u00E4ndare\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID f\\u00F6r SAP Build Work Zone-anv\\u00E4ndare\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID f\\u00F6r aktuell anv\\u00E4ndare. V\\u00E4rdet \\u00E4ndras beroende p\\u00E5 vilken anv\\u00E4ndare som \\u00E4r inloggad. Visa anv\\u00E4ndarens namn genom att anv\\u00E4nda Namn p\\u00E5 SAP Build Work Zone-anv\\u00E4ndare.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=Namn p\\u00E5 SAP Build Work Zone-anv\\u00E4ndare\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=Namn p\\u00E5 SAP Build Work Zone-anv\\u00E4ndare\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Namn p\\u00E5 aktuell anv\\u00E4ndare med f\\u00F6r-, mellan- och efternamn. Mellannamn kommer att f\\u00F6rkortas. V\\u00E4rdet \\u00E4ndras beroende p\\u00E5 vilken anv\\u00E4ndare som \\u00E4r inloggad.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=F\\u00F6rnamn p\\u00E5 SAP Build Work Zone-anv\\u00E4ndare\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=F\\u00F6rnamn p\\u00E5 SAP Build Work Zone-anv\\u00E4ndare\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=F\\u00F6rnamn p\\u00E5 aktuell anv\\u00E4ndare. V\\u00E4rdet \\u00E4ndras beroende p\\u00E5 vilken anv\\u00E4ndare som \\u00E4r inloggad.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Efternamn p\\u00E5 SAP Build Work Zone-anv\\u00E4ndare\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Efternamn p\\u00E5 SAP Build Work Zone-anv\\u00E4ndare\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Efternamn p\\u00E5 aktuell anv\\u00E4ndare. V\\u00E4rdet \\u00E4ndras beroende p\\u00E5 vilken anv\\u00E4ndare som \\u00E4r inloggad.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=E-postadress f\\u00F6r aktuell SAP Build Work Zone-anv\\u00E4ndare\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=E-postadress f\\u00F6r SAP Build Work Zone-anv\\u00E4ndare\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=E-postadress f\\u00F6r aktuell SAP Build Work Zone-anv\\u00E4ndare. V\\u00E4rdet \\u00E4ndras beroende p\\u00E5 vilken anv\\u00E4ndare som \\u00E4r inloggad.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Radera konfiguration\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Kortet har enskilda konfigurationer. Vill du radera dem o\\u00E5terkalleligt och \\u00E5terst\\u00E4lla kortet till dess standardinst\\u00E4llningar?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Radera\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Avbryt\n',
  "sap/ushell/components/workPageBuilder/resources/resources_th.properties":
    '\n\nWorkPage.EmptyPage.Title=\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E40\\u0E1B\\u0E25\\u0E48\\u0E32\nWorkPage.EmptyPage.Message=\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E19\\u0E35\\u0E49\\u0E22\\u0E31\\u0E07\\u0E44\\u0E21\\u0E48\\u0E21\\u0E35\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\\u0E43\\u0E14\\u0E46\nWorkPage.EmptyPage.Button.Add=\\u0E40\\u0E1E\\u0E34\\u0E48\\u0E21\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\n\nWorkPage.EditMode.Save=\\u0E40\\u0E01\\u0E47\\u0E1A\\u0E1A\\u0E31\\u0E19\\u0E17\\u0E36\\u0E01\nWorkPage.EditMode.Cancel=\\u0E22\\u0E01\\u0E40\\u0E25\\u0E34\\u0E01\nWorkPage.Message.WidgetMoved=\\u0E22\\u0E49\\u0E32\\u0E22 Widget \\u0E41\\u0E25\\u0E49\\u0E27\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u0E1B\\u0E49\\u0E2D\\u0E19\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\\u0E40\\u0E1E\\u0E34\\u0E48\\u0E21\\u0E40\\u0E15\\u0E34\\u0E21\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\u0E22\\u0E49\\u0E32\\u0E22\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\\u0E2D\\u0E2D\\u0E01\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u0E25\\u0E1A\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\nWorkPage.Row.DeleteDialog.Title=\\u0E25\\u0E1A\nWorkPage.Row.DeleteDialog.ConfirmText=\\u0E04\\u0E38\\u0E13\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E25\\u0E1A\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\\u0E19\\u0E35\\u0E49\\u0E41\\u0E25\\u0E30\\u0E40\\u0E19\\u0E37\\u0E49\\u0E2D\\u0E2B\\u0E32\\u0E17\\u0E31\\u0E49\\u0E07\\u0E2B\\u0E21\\u0E14\\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E44\\u0E21\\u0E48?\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u0E25\\u0E1A\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u0E22\\u0E01\\u0E40\\u0E25\\u0E34\\u0E01\nWorkPage.Row.AddRowButtonTooltip=\\u0E40\\u0E1E\\u0E34\\u0E48\\u0E21\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u0E43\\u0E19\\u0E23\\u0E31\\u0E19\\u0E44\\u0E17\\u0E21\\u0E4C\\u0E08\\u0E30\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E21\\u0E2D\\u0E07\\u0E40\\u0E2B\\u0E47\\u0E19\\u0E44\\u0E14\\u0E49\\u0E40\\u0E1E\\u0E35\\u0E22\\u0E07\\u0E2A\\u0E35\\u0E48\\u0E04\\u0E2D\\u0E25\\u0E31\\u0E21\\u0E19\\u0E4C\\u0E41\\u0E23\\u0E01\\u0E40\\u0E17\\u0E48\\u0E32\\u0E19\\u0E31\\u0E49\\u0E19 \\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E25\\u0E14\\u0E08\\u0E33\\u0E19\\u0E27\\u0E19\\u0E40\\u0E1B\\u0E47\\u0E19\\u0E2A\\u0E35\\u0E48\\u0E04\\u0E2D\\u0E25\\u0E31\\u0E21\\u0E19\\u0E4C\nWorkPage.Row.AriaLabel=\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\\u0E02\\u0E2D\\u0E07\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E07\\u0E32\\u0E19\n\nWorkPage.Column.AriaLabel=\\u0E04\\u0E2D\\u0E25\\u0E31\\u0E21\\u0E19\\u0E4C {0} \\u0E08\\u0E32\\u0E01 {1}\nWorkPage.Column.AddWidgetButtonText=\\u0E40\\u0E1E\\u0E34\\u0E48\\u0E21 Widget\nWorkPage.Column.DeleteColumnButtonTooltip=\\u0E22\\u0E49\\u0E32\\u0E22\\u0E04\\u0E2D\\u0E25\\u0E31\\u0E21\\u0E19\\u0E4C\\u0E2D\\u0E2D\\u0E01\nWorkPage.Column.AddColumnButtonTooltip=\\u0E40\\u0E1E\\u0E34\\u0E48\\u0E21\\u0E04\\u0E2D\\u0E25\\u0E31\\u0E21\\u0E19\\u0E4C\nWorkPage.Column.EmptyIllustrationTitle=\\u0E04\\u0E49\\u0E19\\u0E2B\\u0E32\\u0E41\\u0E2D\\u0E1E\nWorkPage.Column.EmptyIllustrationDescription=\\u0E40\\u0E1E\\u0E34\\u0E48\\u0E21\\u0E41\\u0E2D\\u0E1E\\u0E43\\u0E19 Widget \\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E25\\u0E1A Widget \\u0E2B\\u0E32\\u0E01\\u0E04\\u0E38\\u0E13\\u0E44\\u0E21\\u0E48\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\u0E40\\u0E1E\\u0E34\\u0E48\\u0E21\\u0E41\\u0E2D\\u0E1E\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u0E25\\u0E1A Widget\nWorkPage.Cell.EmptyIllustrationTitle=\\u0E04\\u0E49\\u0E19\\u0E2B\\u0E32\\u0E41\\u0E2D\\u0E1E\nWorkPage.Cell.EmptyIllustrationDescription=\\u0E40\\u0E1E\\u0E34\\u0E48\\u0E21\\u0E41\\u0E2D\\u0E1E\\u0E43\\u0E19 Widget \\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E25\\u0E1A Widget \\u0E2B\\u0E32\\u0E01\\u0E04\\u0E38\\u0E13\\u0E44\\u0E21\\u0E48\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\nWorkPage.Cell.DeleteDialog.Title=\\u0E25\\u0E1A\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u0E04\\u0E38\\u0E13\\u0E41\\u0E19\\u0E48\\u0E43\\u0E08\\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E44\\u0E21\\u0E48\\u0E27\\u0E48\\u0E32\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E25\\u0E1A Widget \\u0E19\\u0E35\\u0E49? \\u0E41\\u0E2D\\u0E1E\\u0E17\\u0E31\\u0E49\\u0E07\\u0E2B\\u0E21\\u0E14\\u0E43\\u0E19 Widget \\u0E08\\u0E30\\u0E16\\u0E39\\u0E01\\u0E22\\u0E49\\u0E32\\u0E22\\u0E2D\\u0E2D\\u0E01\\u0E08\\u0E32\\u0E01\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E19\\u0E35\\u0E49\\u0E14\\u0E49\\u0E27\\u0E22\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u0E25\\u0E1A\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u0E22\\u0E01\\u0E40\\u0E25\\u0E34\\u0E01\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u0E40\\u0E1B\\u0E34\\u0E14\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E04\\u0E48\\u0E32 Widget \nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u0E25\\u0E1A Widget\n\nWorkPage.Section.AddVizInstanceButtonText=\\u0E40\\u0E1E\\u0E34\\u0E48\\u0E21 Tile\n\n\nContentFinder.Categories.Applications.Title=\\u0E41\\u0E2D\\u0E1E\\u0E1E\\u0E25\\u0E34\\u0E40\\u0E04\\u0E0A\\u0E31\\u0E19\nContentFinder.Widgets.Tiles.Title=Tile\nContentFinder.Widgets.Tiles.Description=\\u0E01\\u0E32\\u0E23\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E20\\u0E32\\u0E1E\\u0E02\\u0E2D\\u0E07\\u0E41\\u0E2D\\u0E1E\nContentFinder.Widgets.Cards.Title=\\u0E1A\\u0E31\\u0E15\\u0E23\nContentFinder.Widgets.Cards.Description=\\u0E01\\u0E32\\u0E23\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E20\\u0E32\\u0E1E\\u0E02\\u0E2D\\u0E07\\u0E41\\u0E2D\\u0E1E \\u0E41\\u0E2A\\u0E14\\u0E07\\u0E43\\u0E19\\u0E42\\u0E04\\u0E23\\u0E07\\u0E23\\u0E48\\u0E32\\u0E07\\u0E41\\u0E1A\\u0E1A\\u0E22\\u0E37\\u0E14\\u0E2B\\u0E22\\u0E38\\u0E48\\u0E19\n\nWorkPage.CardEditor.Save=\\u0E40\\u0E01\\u0E47\\u0E1A\\u0E1A\\u0E31\\u0E19\\u0E17\\u0E36\\u0E01\nWorkPage.CardEditor.Cancel=\\u0E22\\u0E01\\u0E40\\u0E25\\u0E34\\u0E01\nWorkPage.CardEditor.Title=\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\nWorkPage.Card.ActionDefinition.Configure=\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\nWorkPage.Card.ActionDefinition.Reset=\\u0E25\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49\\u0E1B\\u0E31\\u0E08\\u0E08\\u0E38\\u0E1A\\u0E31\\u0E19\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID \\u0E02\\u0E2D\\u0E07\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID \\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID \\u0E02\\u0E2D\\u0E07\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49\\u0E1B\\u0E31\\u0E08\\u0E08\\u0E38\\u0E1A\\u0E31\\u0E19 \\u0E04\\u0E48\\u0E32\\u0E08\\u0E30\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E15\\u0E32\\u0E21\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49\\u0E17\\u0E35\\u0E48\\u0E40\\u0E02\\u0E49\\u0E32\\u0E2A\\u0E39\\u0E48\\u0E23\\u0E30\\u0E1A\\u0E1A \\u0E40\\u0E21\\u0E37\\u0E48\\u0E2D\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 \\u0E43\\u0E2B\\u0E49\\u0E43\\u0E0A\\u0E49\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E02\\u0E2D\\u0E07\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E02\\u0E2D\\u0E07\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E02\\u0E2D\\u0E07\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49\\u0E1B\\u0E31\\u0E08\\u0E08\\u0E38\\u0E1A\\u0E31\\u0E19\\u0E17\\u0E35\\u0E48\\u0E21\\u0E35\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E01\\u0E25\\u0E32\\u0E07\\u0E41\\u0E25\\u0E30\\u0E19\\u0E32\\u0E21\\u0E2A\\u0E01\\u0E38\\u0E25 \\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E01\\u0E25\\u0E32\\u0E07\\u0E08\\u0E30\\u0E40\\u0E1B\\u0E47\\u0E19\\u0E15\\u0E31\\u0E27\\u0E22\\u0E48\\u0E2D \\u0E04\\u0E48\\u0E32\\u0E08\\u0E30\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E15\\u0E32\\u0E21\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49\\u0E17\\u0E35\\u0E48\\u0E40\\u0E02\\u0E49\\u0E32\\u0E2A\\u0E39\\u0E48\\u0E23\\u0E30\\u0E1A\\u0E1A\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E02\\u0E2D\\u0E07\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E02\\u0E2D\\u0E07\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49\\u0E1B\\u0E31\\u0E08\\u0E08\\u0E38\\u0E1A\\u0E31\\u0E19 \\u0E04\\u0E48\\u0E32\\u0E08\\u0E30\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E15\\u0E32\\u0E21\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49\\u0E17\\u0E35\\u0E48\\u0E40\\u0E02\\u0E49\\u0E32\\u0E2A\\u0E39\\u0E48\\u0E23\\u0E30\\u0E1A\\u0E1A\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=\\u0E19\\u0E32\\u0E21\\u0E2A\\u0E01\\u0E38\\u0E25\\u0E02\\u0E2D\\u0E07\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=\\u0E19\\u0E32\\u0E21\\u0E2A\\u0E01\\u0E38\\u0E25\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\u0E19\\u0E32\\u0E21\\u0E2A\\u0E01\\u0E38\\u0E25\\u0E02\\u0E2D\\u0E07\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49\\u0E1B\\u0E31\\u0E08\\u0E08\\u0E38\\u0E1A\\u0E31\\u0E19 \\u0E04\\u0E48\\u0E32\\u0E08\\u0E30\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E15\\u0E32\\u0E21\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49\\u0E17\\u0E35\\u0E48\\u0E40\\u0E02\\u0E49\\u0E32\\u0E2A\\u0E39\\u0E48\\u0E23\\u0E30\\u0E1A\\u0E1A\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\u0E2D\\u0E35\\u0E40\\u0E21\\u0E25\\u0E4C\\u0E41\\u0E2D\\u0E14\\u0E40\\u0E14\\u0E23\\u0E2A\\u0E02\\u0E2D\\u0E07\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 SAP Build Work Zone \\u0E1B\\u0E31\\u0E08\\u0E08\\u0E38\\u0E1A\\u0E31\\u0E19\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=\\u0E2D\\u0E35\\u0E40\\u0E21\\u0E25\\u0E4C\\u0E02\\u0E2D\\u0E07\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u0E2D\\u0E35\\u0E40\\u0E21\\u0E25\\u0E4C\\u0E41\\u0E2D\\u0E14\\u0E40\\u0E14\\u0E23\\u0E2A\\u0E02\\u0E2D\\u0E07\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 SAP Build Work Zone \\u0E1B\\u0E31\\u0E08\\u0E08\\u0E38\\u0E1A\\u0E31\\u0E19 \\u0E04\\u0E48\\u0E32\\u0E08\\u0E30\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E15\\u0E32\\u0E21\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49\\u0E17\\u0E35\\u0E48\\u0E40\\u0E02\\u0E49\\u0E32\\u0E2A\\u0E39\\u0E48\\u0E23\\u0E30\\u0E1A\\u0E1A\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u0E25\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u0E1A\\u0E31\\u0E15\\u0E23\\u0E19\\u0E35\\u0E49\\u0E21\\u0E35\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\\u0E41\\u0E15\\u0E48\\u0E25\\u0E30\\u0E23\\u0E32\\u0E22\\u0E01\\u0E32\\u0E23 \\u0E04\\u0E38\\u0E13\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E25\\u0E1A\\u0E04\\u0E48\\u0E32\\u0E14\\u0E31\\u0E07\\u0E01\\u0E25\\u0E48\\u0E32\\u0E27\\u0E41\\u0E1A\\u0E1A\\u0E17\\u0E35\\u0E48\\u0E44\\u0E21\\u0E48\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E01\\u0E39\\u0E49\\u0E04\\u0E37\\u0E19\\u0E44\\u0E14\\u0E49\\u0E41\\u0E25\\u0E49\\u0E27\\u0E23\\u0E35\\u0E40\\u0E0B\\u0E47\\u0E15\\u0E1A\\u0E31\\u0E15\\u0E23\\u0E40\\u0E1B\\u0E47\\u0E19\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E04\\u0E48\\u0E32\\u0E15\\u0E31\\u0E49\\u0E07\\u0E15\\u0E49\\u0E19\\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E44\\u0E21\\u0E48?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u0E25\\u0E1A\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u0E22\\u0E01\\u0E40\\u0E25\\u0E34\\u0E01\n',
  "sap/ushell/components/workPageBuilder/resources/resources_tr.properties":
    "\n\nWorkPage.EmptyPage.Title=Bo\\u015F sayfa\nWorkPage.EmptyPage.Message=Bu sayfa hen\\u00FCz b\\u00F6l\\u00FCm i\\u00E7ermiyor.\nWorkPage.EmptyPage.Button.Add=B\\u00F6l\\u00FCm ekle\n\nWorkPage.EditMode.Save=Sakla\nWorkPage.EditMode.Cancel=\\u0130ptal et\nWorkPage.Message.WidgetMoved=Widget ta\\u015F\\u0131nd\\u0131\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=B\\u00F6l\\u00FCm ba\\u015Fl\\u0131\\u011F\\u0131\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u0130ste\\u011Fe ba\\u011Fl\\u0131 se\\u00E7im ba\\u015Fl\\u0131\\u011F\\u0131 gir\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=B\\u00F6l\\u00FCm\\u00FC kald\\u0131r\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=B\\u00F6l\\u00FCm\\u00FC sil\nWorkPage.Row.DeleteDialog.Title=Sil\nWorkPage.Row.DeleteDialog.ConfirmText=Bu b\\u00F6l\\u00FCm\\u00FC ve t\\u00FCm i\\u00E7eri\\u011Fini silmek istiyor musunuz?\nWorkPage.Row.DeleteDialog.Button.Confirm=Sil\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u0130ptal et\nWorkPage.Row.AddRowButtonTooltip=B\\u00F6l\\u00FCm ekle\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u00C7al\\u0131\\u015Ft\\u0131rma s\\u00FCresinde yaln\\u0131zca ilk d\\u00F6rt s\\u00FCtun g\\u00F6r\\u00FCn\\u00FCr olacakt\\u0131r. S\\u00FCtun say\\u0131s\\u0131n\\u0131 d\\u00F6rde d\\u00FC\\u015F\\u00FCr\\u00FCn.\nWorkPage.Row.AriaLabel=\\u0130\\u015F sayfas\\u0131 b\\u00F6l\\u00FCmleri\n\nWorkPage.Column.AriaLabel=S\\u00FCtun {0} / {1}\nWorkPage.Column.AddWidgetButtonText=Widget ekle\nWorkPage.Column.DeleteColumnButtonTooltip=S\\u00FCtunu kald\\u0131r\nWorkPage.Column.AddColumnButtonTooltip=S\\u00FCtun ekle\nWorkPage.Column.EmptyIllustrationTitle=Uygulamalar\\u0131 ara\nWorkPage.Column.EmptyIllustrationDescription=Uygulamalar\\u0131 widget'a ekleyin veya ihtiyac\\u0131n\\u0131z yoksa widget'\\u0131 kald\\u0131r\\u0131n.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Uygulamalar ekle\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Widget'\\u0131 sil\nWorkPage.Cell.EmptyIllustrationTitle=Uygulamalar\\u0131 ara\nWorkPage.Cell.EmptyIllustrationDescription=Uygulamalar\\u0131 widget'a ekleyin veya ihtiyac\\u0131n\\u0131z yoksa widget'\\u0131 kald\\u0131r\\u0131n.\nWorkPage.Cell.DeleteDialog.Title=Sil\nWorkPage.Cell.DeleteDialog.ConfirmText=Bu widget'\\u0131 silmek istedi\\u011Finizden emin misiniz? \\u0130\\u00E7indeki t\\u00FCm uygulamalar da sayfadan kald\\u0131r\\u0131lacak.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Sil\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u0130ptal et\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=Widget ayarlar\\u0131n\\u0131 a\\u00E7\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Widget'\\u0131 sil\n\nWorkPage.Section.AddVizInstanceButtonText=Kutucuklar ekle\n\n\nContentFinder.Categories.Applications.Title=Uygulamalar\nContentFinder.Widgets.Tiles.Title=Kutucuklar\nContentFinder.Widgets.Tiles.Description=Uygulamalar\\u0131n g\\u00F6rsel g\\u00F6sterimleri.\nContentFinder.Widgets.Cards.Title=Kartlar\nContentFinder.Widgets.Cards.Description=Esnek d\\u00FCzenlerde g\\u00F6r\\u00FCnt\\u00FClenen uygulamalar\\u0131n g\\u00F6rsel g\\u00F6r\\u00FCnt\\u00FCleri.\n\nWorkPage.CardEditor.Save=Sakla\nWorkPage.CardEditor.Cancel=\\u0130ptal et\nWorkPage.CardEditor.Title=\"{0}\" konfig\\u00FCrasyonunu yap\nWorkPage.CardEditor.Title.NoCardTitle=Konfig\\u00FCre et\nWorkPage.Card.ActionDefinition.Configure=Konfig\\u00FCre et\nWorkPage.Card.ActionDefinition.Reset=Konfig\\u00FCrasyonu sil\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Ge\\u00E7erli kullan\\u0131c\\u0131\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=SAP Build Work Zone kullan\\u0131c\\u0131s\\u0131n\\u0131n tan\\u0131t\\u0131c\\u0131s\\u0131\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone kullan\\u0131c\\u0131 tan\\u0131t\\u0131c\\u0131s\\u0131\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=Ge\\u00E7erli kullan\\u0131c\\u0131n\\u0131n tan\\u0131t\\u0131c\\u0131s\\u0131. De\\u011Fer, oturum a\\u00E7an kullan\\u0131c\\u0131 temelinde de\\u011Fi\\u015Fir. Kullan\\u0131c\\u0131n\\u0131n ad\\u0131n\\u0131 g\\u00F6stermek i\\u00E7in SAP Build Work Zone kullan\\u0131c\\u0131s\\u0131n\\u0131n ad\\u0131n\\u0131 kullan\\u0131n.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=SAP Build Work Zone kullan\\u0131c\\u0131s\\u0131n\\u0131n ad\\u0131\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone kullan\\u0131c\\u0131 ad\\u0131\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=Ge\\u00E7erli kullan\\u0131c\\u0131n\\u0131n ad\\u0131n\\u0131, ikinci ad\\u0131n\\u0131 ve soyad\\u0131n\\u0131 i\\u00E7eren ad\\u0131. \\u0130kinci ad k\\u0131salt\\u0131l\\u0131r. De\\u011Fer, oturum a\\u00E7an kullan\\u0131c\\u0131 temelinde de\\u011Fi\\u015Fir.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=SAP Build Work Zone kullan\\u0131c\\u0131s\\u0131n\\u0131n ad\\u0131\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone kullan\\u0131c\\u0131s\\u0131n\\u0131n ad\\u0131\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=Ge\\u00E7erli kullan\\u0131c\\u0131n\\u0131n ad\\u0131. De\\u011Fer, oturum a\\u00E7an kullan\\u0131c\\u0131 temelinde de\\u011Fi\\u015Fir.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=SAP Build Work Zone kullan\\u0131c\\u0131s\\u0131n\\u0131n soyad\\u0131\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone kullan\\u0131c\\u0131s\\u0131n\\u0131n soyad\\u0131\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Ge\\u00E7erli kullan\\u0131c\\u0131n\\u0131n soyad\\u0131. De\\u011Fer, oturum a\\u00E7an kullan\\u0131c\\u0131 temelinde de\\u011Fi\\u015Fir.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=Ge\\u00E7erli SAP Build Work Zone kullan\\u0131c\\u0131s\\u0131n\\u0131n e-posta adresi\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone kullan\\u0131c\\u0131s\\u0131 e-postas\\u0131\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=Ge\\u00E7erli SAP Build Work Zone kullan\\u0131c\\u0131s\\u0131n\\u0131n e-posta adresi. De\\u011Fer, oturum a\\u00E7an kullan\\u0131c\\u0131 temelinde de\\u011Fi\\u015Fir.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Konfig\\u00FCrasyonu sil\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Bu kart m\\u00FCnferit konfig\\u00FCrasyonlar i\\u00E7eriyor. Bunlar\\u0131 geri al\\u0131namayacak \\u015Fekilde silmek ve kart\\u0131 varsay\\u0131lan ayarlar\\u0131na s\\u0131f\\u0131rlamak istiyor musunuz?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Sil\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u0130ptal et\n",
  "sap/ushell/components/workPageBuilder/resources/resources_uk.properties":
    "\n\nWorkPage.EmptyPage.Title=\\u041F\\u043E\\u0440\\u043E\\u0436\\u043D\\u044F \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0430\nWorkPage.EmptyPage.Message=\\u0426\\u044F \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0430 \\u0449\\u0435 \\u043D\\u0435 \\u043C\\u0456\\u0441\\u0442\\u0438\\u0442\\u044C \\u0436\\u043E\\u0434\\u043D\\u0438\\u0445 \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\\u0456\\u0432.\nWorkPage.EmptyPage.Button.Add=\\u0414\\u043E\\u0434\\u0430\\u0442\\u0438 \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\n\nWorkPage.EditMode.Save=\\u0417\\u0431\\u0435\\u0440\\u0435\\u0433\\u0442\\u0438\nWorkPage.EditMode.Cancel=\\u0421\\u043A\\u0430\\u0441\\u0443\\u0432\\u0430\\u0442\\u0438\nWorkPage.Message.WidgetMoved=\\u0412\\u0456\\u0434\\u0436\\u0435\\u0442 \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043E\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\\u0443\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u0412\\u0432\\u0435\\u0441\\u0442\\u0438 \\u0437\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A \\u043D\\u0435\\u043E\\u0431\\u043E\\u0432'\\u044F\\u0437\\u043A\\u043E\\u0432\\u043E\\u0433\\u043E \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\\u0443\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\nWorkPage.Row.DeleteDialog.Title=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438\nWorkPage.Row.DeleteDialog.ConfirmText=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0446\\u0435\\u0439 \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B \\u0442\\u0430 \\u0432\\u0435\\u0441\\u044C \\u0439\\u043E\\u0433\\u043E \\u0432\\u043C\\u0456\\u0441\\u0442?\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u0421\\u043A\\u0430\\u0441\\u0443\\u0432\\u0430\\u0442\\u0438\nWorkPage.Row.AddRowButtonTooltip=\\u0414\\u043E\\u0434\\u0430\\u0442\\u0438 \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u041F\\u0456\\u0434 \\u0447\\u0430\\u0441 \\u0432\\u0438\\u043A\\u043E\\u043D\\u0430\\u043D\\u043D\\u044F \\u043B\\u0438\\u0448\\u0435 \\u043F\\u0435\\u0440\\u0448\\u0456 \\u0447\\u043E\\u0442\\u0438\\u0440\\u0438 \\u0441\\u0442\\u043E\\u0432\\u043F\\u0447\\u0438\\u043A\\u0438 \\u0431\\u0443\\u0434\\u0443\\u0442\\u044C \\u0432\\u0438\\u0434\\u0438\\u043C\\u0438\\u043C\\u0438. \\u0421\\u043A\\u043E\\u0440\\u043E\\u0442\\u0456\\u0442\\u044C \\u043A\\u0456\\u043B\\u044C\\u043A\\u0456\\u0441\\u0442\\u044C \\u0441\\u0442\\u043E\\u0432\\u043F\\u0447\\u0438\\u043A\\u0456\\u0432 \\u0434\\u043E \\u0447\\u043E\\u0442\\u0438\\u0440\\u044C\\u043E\\u0445.\nWorkPage.Row.AriaLabel=\\u0420\\u043E\\u0437\\u0434\\u0456\\u043B\\u0438 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438 \\u0440\\u043E\\u0431\\u0456\\u0442\n\nWorkPage.Column.AriaLabel=\\u0421\\u0442\\u043E\\u0432\\u043F\\u0447\\u0438\\u043A {0} \\u0437 {1}\nWorkPage.Column.AddWidgetButtonText=\\u0414\\u043E\\u0434\\u0430\\u0442\\u0438 \\u0432\\u0456\\u0434\\u0436\\u0435\\u0442\nWorkPage.Column.DeleteColumnButtonTooltip=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0441\\u0442\\u043E\\u0432\\u043F\\u0447\\u0438\\u043A\nWorkPage.Column.AddColumnButtonTooltip=\\u0414\\u043E\\u0434\\u0430\\u0442\\u0438 \\u0441\\u0442\\u043E\\u0432\\u043F\\u0447\\u0438\\u043A\nWorkPage.Column.EmptyIllustrationTitle=\\u041F\\u043E\\u0448\\u0443\\u043A \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043A\\u0456\\u0432\nWorkPage.Column.EmptyIllustrationDescription=\\u0414\\u043E\\u0434\\u0430\\u0442\\u0438 \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043E\\u043A \\u0434\\u043E \\u0432\\u0456\\u0434\\u0436\\u0435\\u0442\\u0443 \\u0430\\u0431\\u043E \\u0432\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0432\\u0456\\u0434\\u0436\\u0435\\u0442, \\u044F\\u043A\\u0449\\u043E \\u0432\\u0456\\u043D \\u043D\\u0435 \\u043F\\u043E\\u0442\\u0440\\u0456\\u0431\\u0435\\u043D.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\u0414\\u043E\\u0434\\u0430\\u0442\\u0438 \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043E\\u043A\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0432\\u0456\\u0434\\u0436\\u0435\\u0442\nWorkPage.Cell.EmptyIllustrationTitle=\\u041F\\u043E\\u0448\\u0443\\u043A \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043A\\u0456\\u0432\nWorkPage.Cell.EmptyIllustrationDescription=\\u0414\\u043E\\u0434\\u0430\\u0442\\u0438 \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043E\\u043A \\u0434\\u043E \\u0432\\u0456\\u0434\\u0436\\u0435\\u0442\\u0443 \\u0430\\u0431\\u043E \\u0432\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0432\\u0456\\u0434\\u0436\\u0435\\u0442, \\u044F\\u043A\\u0449\\u043E \\u0432\\u0456\\u043D \\u043D\\u0435 \\u043F\\u043E\\u0442\\u0440\\u0456\\u0431\\u0435\\u043D.\nWorkPage.Cell.DeleteDialog.Title=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u0412\\u0438 \\u0434\\u0456\\u0439\\u0441\\u043D\\u043E \\u0431\\u0430\\u0436\\u0430\\u0454\\u0442\\u0435 \\u0432\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0432\\u0456\\u0434\\u0436\\u0435\\u0442? \\u0412\\u0441\\u0456 \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043A\\u0438 \\u0432 \\u043D\\u044C\\u043E\\u043C\\u0443 \\u0442\\u0430\\u043A\\u043E\\u0436 \\u0431\\u0443\\u0434\\u0443\\u0442\\u044C \\u0432\\u0438\\u0434\\u0430\\u043B\\u0435\\u043D\\u0456 \\u0437\\u0456 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438.\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u0421\\u043A\\u0430\\u0441\\u0443\\u0432\\u0430\\u0442\\u0438\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u0412\\u0456\\u0434\\u043A\\u0440\\u0438\\u0442\\u0438 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0432\\u0456\\u0434\\u0436\\u0435\\u0442\\u0430\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0432\\u0456\\u0434\\u0436\\u0435\\u0442\n\nWorkPage.Section.AddVizInstanceButtonText=\\u0414\\u043E\\u0434\\u0430\\u0442\\u0438 \\u043F\\u043B\\u0438\\u0442\\u043A\\u0438\n\n\nContentFinder.Categories.Applications.Title=\\u0417\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043A\\u0438\nContentFinder.Widgets.Tiles.Title=\\u041F\\u043B\\u0438\\u0442\\u043A\\u0438\nContentFinder.Widgets.Tiles.Description=\\u0412\\u0456\\u0437\\u0443\\u0430\\u043B\\u044C\\u043D\\u0456 \\u043F\\u0440\\u0435\\u0434\\u0441\\u0442\\u0430\\u0432\\u043B\\u0435\\u043D\\u043D\\u044F \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043A\\u0456\\u0432.\nContentFinder.Widgets.Cards.Title=\\u041A\\u0430\\u0440\\u0442\\u043A\\u0438\nContentFinder.Widgets.Cards.Description=\\u0412\\u0456\\u0437\\u0443\\u0430\\u043B\\u044C\\u043D\\u0456 \\u043F\\u0440\\u0435\\u0434\\u0441\\u0442\\u0430\\u0432\\u043B\\u0435\\u043D\\u043D\\u044F \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043A\\u0456\\u0432, \\u0432\\u0456\\u0434\\u043E\\u0431\\u0440\\u0430\\u0436\\u0435\\u043D\\u0456 \\u0443 \\u0433\\u043D\\u0443\\u0447\\u043A\\u0438\\u0445 \\u0444\\u043E\\u0440\\u043C\\u0430\\u0442\\u0430\\u0445.\n\nWorkPage.CardEditor.Save=\\u0417\\u0431\\u0435\\u0440\\u0435\\u0433\\u0442\\u0438\nWorkPage.CardEditor.Cancel=\\u0421\\u043A\\u0430\\u0441\\u0443\\u0432\\u0430\\u0442\\u0438\nWorkPage.CardEditor.Title=\\u041D\\u0430\\u043B\\u0430\\u0448\\u0442\\u0443\\u0432\\u0430\\u0442\\u0438 \"{0}\"\nWorkPage.CardEditor.Title.NoCardTitle=\\u041D\\u0430\\u043B\\u0430\\u0448\\u0442\\u0443\\u0432\\u0430\\u0442\\u0438\nWorkPage.Card.ActionDefinition.Configure=\\u041D\\u0430\\u043B\\u0430\\u0448\\u0442\\u0443\\u0432\\u0430\\u0442\\u0438\nWorkPage.Card.ActionDefinition.Reset=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u043A\\u043E\\u043D\\u0444\\u0456\\u0433\\u0443\\u0440\\u0430\\u0446\\u0456\\u044E\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\u041F\\u043E\\u0442\\u043E\\u0447\\u043D\\u0438\\u0439 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=\\u0406\\u0414 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=\\u0406\\u0414 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=\\u0406\\u0414 \\u043F\\u043E\\u0442\\u043E\\u0447\\u043D\\u043E\\u0433\\u043E \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430. \\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u043D\\u044F \\u0437\\u043C\\u0456\\u043D\\u0438\\u0442\\u044C\\u0441\\u044F \\u043D\\u0430 \\u043E\\u0441\\u043D\\u043E\\u0432\\u0456 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430, \\u044F\\u043A\\u0438\\u0439 \\u0443\\u0432\\u0456\\u0439\\u0448\\u043E\\u0432 \\u0434\\u043E \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0438. \\u0429\\u043E\\u0431 \\u043F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u0438 \\u0456\\u043C'\\u044F \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430, \\u0432\\u0438\\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0430\\u0439\\u0442\\u0435 \\u0456\\u043C'\\u044F \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=\\u0406\\u043C'\\u044F \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=\\u0406\\u043C'\\u044F \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\u0406\\u043C'\\u044F \\u043F\\u043E\\u0442\\u043E\\u0447\\u043D\\u043E\\u0433\\u043E \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 \\u0437 \\u0456\\u043C\\u0435\\u043D\\u0435\\u043C, \\u043F\\u043E \\u0431\\u0430\\u0442\\u044C\\u043A\\u043E\\u0432\\u0456 \\u0442\\u0430 \\u043F\\u0440\\u0456\\u0437\\u0432\\u0438\\u0449\\u0435\\u043C. \\u0406\\u043C'\\u044F \\u043F\\u043E \\u0431\\u0430\\u0442\\u044C\\u043A\\u043E\\u0432\\u0456 \\u0431\\u0443\\u0434\\u0435 \\u0441\\u043A\\u043E\\u0440\\u043E\\u0447\\u0435\\u043D\\u043E. \\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u043D\\u044F \\u0437\\u043C\\u0456\\u043D\\u0438\\u0442\\u044C\\u0441\\u044F \\u043D\\u0430 \\u043E\\u0441\\u043D\\u043E\\u0432\\u0456 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430, \\u044F\\u043A\\u0438\\u0439 \\u0443\\u0432\\u0456\\u0439\\u0448\\u043E\\u0432 \\u0434\\u043E \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0438.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=\\u0406\\u043C'\\u044F \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=\\u0406\\u043C'\\u044F \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\u0406\\u043C'\\u044F \\u043F\\u043E\\u0442\\u043E\\u0447\\u043D\\u043E\\u0433\\u043E \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430. \\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u043D\\u044F \\u0437\\u043C\\u0456\\u043D\\u0438\\u0442\\u044C\\u0441\\u044F \\u043D\\u0430 \\u043E\\u0441\\u043D\\u043E\\u0432\\u0456 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430, \\u044F\\u043A\\u0438\\u0439 \\u0443\\u0432\\u0456\\u0439\\u0448\\u043E\\u0432 \\u0434\\u043E \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0438.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=\\u041F\\u0440\\u0456\\u0437\\u0432\\u0438\\u0449\\u0435 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=\\u041F\\u0440\\u0456\\u0437\\u0432\\u0438\\u0449\\u0435 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\u041F\\u0440\\u0456\\u0437\\u0432\\u0438\\u0449\\u0435 \\u043F\\u043E\\u0442\\u043E\\u0447\\u043D\\u043E\\u0433\\u043E \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430. \\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u043D\\u044F \\u0437\\u043C\\u0456\\u043D\\u0438\\u0442\\u044C\\u0441\\u044F \\u043D\\u0430 \\u043E\\u0441\\u043D\\u043E\\u0432\\u0456 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430, \\u044F\\u043A\\u0438\\u0439 \\u0443\\u0432\\u0456\\u0439\\u0448\\u043E\\u0432 \\u0434\\u043E \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0438.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\u0410\\u0434\\u0440\\u0435\\u0441\\u0430 \\u0435\\u043B\\u0435\\u043A\\u0442\\u0440\\u043E\\u043D\\u043D\\u043E\\u0457 \\u043F\\u043E\\u0448\\u0442\\u0438 \\u043F\\u043E\\u0442\\u043E\\u0447\\u043D\\u043E\\u0433\\u043E \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=\\u0415\\u043B\\u0435\\u043A\\u0442\\u0440\\u043E\\u043D\\u043D\\u0430 \\u043F\\u043E\\u0448\\u0442\\u0430 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u0410\\u0434\\u0440\\u0435\\u0441\\u0430 \\u0435\\u043B\\u0435\\u043A\\u0442\\u0440\\u043E\\u043D\\u043D\\u043E\\u0457 \\u043F\\u043E\\u0448\\u0442\\u0438 \\u043F\\u043E\\u0442\\u043E\\u0447\\u043D\\u043E\\u0433\\u043E \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 SAP Build Work Zone. \\u0417\\u043D\\u0430\\u0447\\u0435\\u043D\\u043D\\u044F \\u0437\\u043C\\u0456\\u043D\\u0438\\u0442\\u044C\\u0441\\u044F \\u043D\\u0430 \\u043E\\u0441\\u043D\\u043E\\u0432\\u0456 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430, \\u044F\\u043A\\u0438\\u0439 \\u0443\\u0432\\u0456\\u0439\\u0448\\u043E\\u0432 \\u0434\\u043E \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0438.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u043A\\u043E\\u043D\\u0444\\u0456\\u0433\\u0443\\u0440\\u0430\\u0446\\u0456\\u044E\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u0426\\u044F \\u043A\\u0430\\u0440\\u0442\\u043A\\u0430 \\u043C\\u0430\\u0454 \\u0456\\u043D\\u0434\\u0438\\u0432\\u0456\\u0434\\u0443\\u0430\\u043B\\u044C\\u043D\\u0456 \\u043A\\u043E\\u043D\\u0444\\u0456\\u0433\\u0443\\u0440\\u0430\\u0446\\u0456\\u0457. \\u0411\\u0430\\u0436\\u0430\\u0454\\u0442\\u0435 \\u0432\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0457\\u0445 \\u043D\\u0435\\u0437\\u0432\\u043E\\u0440\\u043E\\u0442\\u043D\\u043E \\u0456 \\u0441\\u043A\\u0438\\u043D\\u0443\\u0442\\u0438 \\u043A\\u0430\\u0440\\u0442\\u043A\\u0443 \\u0434\\u043E \\u0457\\u0457 \\u0443\\u0441\\u0442\\u0430\\u043B\\u0435\\u043D\\u0438\\u0445 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043E\\u043A?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u0421\\u043A\\u0430\\u0441\\u0443\\u0432\\u0430\\u0442\\u0438\n",
  "sap/ushell/components/workPageBuilder/resources/resources_vi.properties":
    '\n\nWorkPage.EmptyPage.Title=Trang tr\\u00F4\\u0301ng\nWorkPage.EmptyPage.Message=Trang na\\u0300y kh\\u00F4ng ch\\u01B0\\u0301a b\\u00E2\\u0301t ky\\u0300 ph\\u00E2\\u0300n na\\u0300o.\nWorkPage.EmptyPage.Button.Add=Th\\u00EAm ph\\u00E2\\u0300n\n\nWorkPage.EditMode.Save=L\\u01B0u\nWorkPage.EditMode.Cancel=Hu\\u0309y\nWorkPage.Message.WidgetMoved=\\u0110a\\u0303 chuy\\u00EA\\u0309n widget\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=Ti\\u00EAu \\u0111\\u00EA\\u0300 ph\\u00E2\\u0300n\nWorkPage.Row.OverflowToolbar.RowTitleOptional=Nh\\u00E2\\u0323p ti\\u00EAu \\u0111\\u00EA\\u0300 ph\\u00E2\\u0300n tu\\u0300y cho\\u0323n\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=Loa\\u0323i bo\\u0309 ph\\u00E2\\u0300n\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=X\\u00F3a ph\\u1EA7n\nWorkPage.Row.DeleteDialog.Title=Xo\\u0301a\nWorkPage.Row.DeleteDialog.ConfirmText=Ba\\u0323n co\\u0301 mu\\u00F4\\u0301n xo\\u0301a ph\\u00E2\\u0300n na\\u0300y va\\u0300 t\\u00E2\\u0301t ca\\u0309 n\\u00F4\\u0323i dung cu\\u0309a no\\u0301 kh\\u00F4ng?\nWorkPage.Row.DeleteDialog.Button.Confirm=Xo\\u0301a\nWorkPage.Row.DeleteDialog.Button.Cancel=Hu\\u0309y\nWorkPage.Row.AddRowButtonTooltip=Th\\u00EAm ph\\u00E2\\u0300n\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=Trong th\\u1EDDi gian th\\u01B0\\u0323c hi\\u00EA\\u0323n, ch\\u1EC9 b\\u1ED1n c\\u1ED9t \\u0111\\u1EA7u ti\\u00EAn s\\u1EBD hi\\u1EC3n th\\u1ECB. Vui l\\u00F2ng gi\\u1EA3m s\\u1ED1 c\\u1ED9t xu\\u1ED1ng c\\u00F2n b\\u1ED1n.\nWorkPage.Row.AriaLabel=Ph\\u00E2\\u0300n trang la\\u0300m vi\\u00EA\\u0323c\n\nWorkPage.Column.AriaLabel=C\\u00F4\\u0323t {0} cu\\u0309a {1}\nWorkPage.Column.AddWidgetButtonText=Th\\u00EAm widget\nWorkPage.Column.DeleteColumnButtonTooltip=Xo\\u0301a c\\u00F4\\u0323t\nWorkPage.Column.AddColumnButtonTooltip=Th\\u00EAm c\\u00F4\\u0323t\nWorkPage.Column.EmptyIllustrationTitle=Ti\\u0300m ki\\u00EA\\u0301m \\u01B0\\u0301ng du\\u0323ng\nWorkPage.Column.EmptyIllustrationDescription=Th\\u00EAm \\u01B0\\u0301ng du\\u0323ng va\\u0300o widget ho\\u0103\\u0323c g\\u01A1\\u0303 bo\\u0309 widget n\\u00EA\\u0301u ba\\u0323n kh\\u00F4ng c\\u00E2\\u0300n.\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=Th\\u00EAm \\u01B0\\u0301ng du\\u0323ng\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=Xo\\u0301a widget\nWorkPage.Cell.EmptyIllustrationTitle=Ti\\u0300m ki\\u00EA\\u0301m \\u01B0\\u0301ng du\\u0323ng\nWorkPage.Cell.EmptyIllustrationDescription=Th\\u00EAm \\u01B0\\u0301ng du\\u0323ng va\\u0300o widget ho\\u0103\\u0323c g\\u01A1\\u0303 bo\\u0309 widget n\\u00EA\\u0301u ba\\u0323n kh\\u00F4ng c\\u00E2\\u0300n.\nWorkPage.Cell.DeleteDialog.Title=Xo\\u0301a\nWorkPage.Cell.DeleteDialog.ConfirmText=Ba\\u0323n co\\u0301 ch\\u0103\\u0301c la\\u0300 ba\\u0323n mu\\u00F4\\u0301n xo\\u0301a widget na\\u0300y kh\\u00F4ng? T\\u00E2\\u0301t ca\\u0309 \\u01B0\\u0301ng du\\u0323ng trong widget cu\\u0303ng se\\u0303 bi\\u0323 loa\\u0323i bo\\u0309 kho\\u0309i trang.\nWorkPage.Cell.DeleteDialog.Button.Confirm=Xo\\u0301a\nWorkPage.Cell.DeleteDialog.Button.Cancel=Hu\\u0309y\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=M\\u01A1\\u0309 thi\\u00EA\\u0301t l\\u00E2\\u0323p widget\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=Xo\\u0301a widget\n\nWorkPage.Section.AddVizInstanceButtonText=Th\\u00EAm h\\u00ECnh x\\u1EBFp\n\n\nContentFinder.Categories.Applications.Title=\\u01AF\\u0301ng d\\u1EE5ng\nContentFinder.Widgets.Tiles.Title=Hi\\u0300nh x\\u00EA\\u0301p\nContentFinder.Widgets.Tiles.Description=Tr\\u00ECnh b\\u00E0y tr\\u1EF1c quan c\\u1EE7a \\u1EE9ng d\\u1EE5ng\nContentFinder.Widgets.Cards.Title=The\\u0309\nContentFinder.Widgets.Cards.Description=Tr\\u00ECnh b\\u00E0y tr\\u1EF1c quan c\\u1EE7a \\u1EE9ng d\\u1EE5ng, \\u0111\\u01B0\\u1EE3c hi\\u1EC3n th\\u1ECB trong b\\u1ED1 c\\u1EE5c linh ho\\u1EA1t.\n\nWorkPage.CardEditor.Save=L\\u01B0u\nWorkPage.CardEditor.Cancel=Hu\\u0309y\nWorkPage.CardEditor.Title=C\\u00E2\\u0301u hi\\u0300nh "{0}\\u201D\nWorkPage.CardEditor.Title.NoCardTitle=C\\u00E2\\u0301u hi\\u0300nh\nWorkPage.Card.ActionDefinition.Configure=C\\u00E2\\u0301u hi\\u0300nh\nWorkPage.Card.ActionDefinition.Reset=Xo\\u0301a c\\u00E2\\u0301u hi\\u0300nh\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=Ng\\u01B0\\u01A1\\u0300i du\\u0300ng hi\\u00EA\\u0323n ta\\u0323i\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=ID cu\\u0309a ng\\u01B0\\u01A1\\u0300i du\\u0300ng SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=ID ng\\u01B0\\u01A1\\u0300i du\\u0300ng SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=ID c\\u1EE7a ng\\u01B0\\u1EDDi d\\u00F9ng hi\\u1EC7n t\\u1EA1i. Gi\\u00E1 tr\\u1ECB s\\u1EBD thay \\u0111\\u1ED5i d\\u1EF1a tr\\u00EAn ng\\u01B0\\u1EDDi d\\u00F9ng \\u0111\\u00E3 \\u0111\\u0103ng nh\\u1EADp. \\u0110\\u1EC3 hi\\u1EC3n th\\u1ECB t\\u00EAn c\\u1EE7a ng\\u01B0\\u1EDDi d\\u00F9ng, h\\u00E3y s\\u1EED d\\u1EE5ng T\\u00EAn c\\u1EE7a ng\\u01B0\\u1EDDi d\\u00F9ng SAP Build Work Zone.\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=T\\u00EAn cu\\u0309a ng\\u01B0\\u01A1\\u0300i du\\u0300ng SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=T\\u00EAn ng\\u01B0\\u01A1\\u0300i du\\u0300ng SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=T\\u00EAn c\\u1EE7a ng\\u01B0\\u1EDDi d\\u00F9ng hi\\u1EC7n t\\u1EA1i v\\u1EDBi t\\u00EAn go\\u0323i, t\\u00EAn gi\\u01B0\\u0303a va\\u0300 h\\u1ECD. T\\u00EAn \\u0111\\u1EC7m s\\u1EBD \\u0111\\u01B0\\u1EE3c vi\\u1EBFt t\\u1EAFt. Gi\\u00E1 tr\\u1ECB s\\u1EBD thay \\u0111\\u1ED5i d\\u1EF1a tr\\u00EAn ng\\u01B0\\u1EDDi d\\u00F9ng \\u0111\\u00E3 \\u0111\\u0103ng nh\\u1EADp.\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=T\\u00EAn go\\u0323i cu\\u0309a ng\\u01B0\\u01A1\\u0300i du\\u0300ng SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=T\\u00EAn go\\u0323i ng\\u01B0\\u01A1\\u0300i du\\u0300ng SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=T\\u00EAn go\\u0323i cu\\u0309a ng\\u01B0\\u01A1\\u0300i du\\u0300ng hi\\u00EA\\u0323n ta\\u0323i. Gia\\u0301 tri\\u0323 se\\u0303 thay \\u0111\\u00F4\\u0309i d\\u01B0\\u0323a tr\\u00EAn ng\\u01B0\\u01A1\\u0300i du\\u0300ng \\u0111a\\u0303 \\u0111\\u0103ng nh\\u00E2\\u0323p.\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=Ho\\u0323 cu\\u0309a ng\\u01B0\\u01A1\\u0300i du\\u0300ng SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=Ho\\u0323 ng\\u01B0\\u01A1\\u0300i du\\u0300ng SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=Ho\\u0323 cu\\u0309a ng\\u01B0\\u01A1\\u0300i du\\u0300ng hi\\u00EA\\u0323n ta\\u0323i. Gia\\u0301 tri\\u0323 se\\u0303 thay \\u0111\\u00F4\\u0309i d\\u01B0\\u0323a tr\\u00EAn ng\\u01B0\\u01A1\\u0300i du\\u0300ng \\u0111a\\u0303 \\u0111\\u0103ng nh\\u00E2\\u0323p.\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\u0110i\\u0323a chi\\u0309 email cu\\u0309a ng\\u01B0\\u01A1\\u0300i du\\u0300ng SAP Build Work Zone hi\\u00EA\\u0323n ta\\u0323i\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=Email ng\\u01B0\\u01A1\\u0300i du\\u0300ng SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u0110i\\u0323a chi\\u0309 email cu\\u0309a ng\\u01B0\\u01A1\\u0300i du\\u0300ng SAP Build Work Zone hi\\u00EA\\u0323n ta\\u0323i. Gia\\u0301 tri\\u0323 se\\u0303 thay \\u0111\\u00F4\\u0309i d\\u01B0\\u0323a tr\\u00EAn ng\\u01B0\\u01A1\\u0300i du\\u0300ng \\u0111a\\u0303 \\u0111\\u0103ng nh\\u00E2\\u0323p.\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=Xo\\u0301a c\\u00E2\\u0301u hi\\u0300nh\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=Th\\u1EBB n\\u00E0y c\\u00F3 c\\u00E1c c\\u1EA5u h\\u00ECnh ri\\u00EAng l\\u1EBB. B\\u1EA1n c\\u00F3 mu\\u1ED1n x\\u00F3a ch\\u00FAng v\\u0129nh vi\\u1EC5n v\\u00E0 \\u0111\\u1EB7t l\\u1EA1i th\\u1EBB v\\u1EC1 thi\\u00EA\\u0301t l\\u00E2\\u0323p m\\u1EB7c \\u0111\\u1ECBnh kh\\u00F4ng?\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=Xo\\u0301a\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=Hu\\u0309y\n',
  "sap/ushell/components/workPageBuilder/resources/resources_zh_CN.properties":
    '\n\nWorkPage.EmptyPage.Title=\\u7A7A\\u9875\\u9762\nWorkPage.EmptyPage.Message=\\u6B64\\u9875\\u9762\\u8FD8\\u4E0D\\u5305\\u542B\\u4EFB\\u4F55\\u90E8\\u5206\\u3002\nWorkPage.EmptyPage.Button.Add=\\u6DFB\\u52A0\\u90E8\\u5206\n\nWorkPage.EditMode.Save=\\u4FDD\\u5B58\nWorkPage.EditMode.Cancel=\\u53D6\\u6D88\nWorkPage.Message.WidgetMoved=\\u7A97\\u53E3\\u5C0F\\u90E8\\u4EF6\\u5DF2\\u79FB\\u52A8\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\u90E8\\u5206\\u6807\\u9898\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u8F93\\u5165\\u53EF\\u9009\\u7684\\u90E8\\u5206\\u6807\\u9898\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\u79FB\\u9664\\u90E8\\u5206\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u5220\\u9664\\u90E8\\u5206\nWorkPage.Row.DeleteDialog.Title=\\u5220\\u9664\nWorkPage.Row.DeleteDialog.ConfirmText=\\u662F\\u5426\\u8981\\u5220\\u9664\\u6B64\\u90E8\\u5206\\u53CA\\u5176\\u6240\\u6709\\u5185\\u5BB9\\uFF1F\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u5220\\u9664\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u53D6\\u6D88\nWorkPage.Row.AddRowButtonTooltip=\\u6DFB\\u52A0\\u90E8\\u5206\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u5728\\u8FD0\\u884C\\u65F6\\uFF0C\\u53EA\\u6709\\u524D\\u56DB\\u5217\\u5C06\\u4F1A\\u53EF\\u89C1\\u3002\\u8BF7\\u5C06\\u5217\\u6570\\u51CF\\u5C0F\\u4E3A\\u56DB\\u3002\nWorkPage.Row.AriaLabel=\\u5DE5\\u4F5C\\u9875\\u9762\\u90E8\\u5206\n\nWorkPage.Column.AriaLabel=\\u7B2C {0} \\u5217\\uFF0C\\u5171 {1} \\u5217\nWorkPage.Column.AddWidgetButtonText=\\u6DFB\\u52A0\\u7A97\\u53E3\\u5C0F\\u90E8\\u4EF6\nWorkPage.Column.DeleteColumnButtonTooltip=\\u79FB\\u9664\\u5217\nWorkPage.Column.AddColumnButtonTooltip=\\u6DFB\\u52A0\\u5217\nWorkPage.Column.EmptyIllustrationTitle=\\u641C\\u7D22\\u5E94\\u7528\\u7A0B\\u5E8F\nWorkPage.Column.EmptyIllustrationDescription=\\u5411\\u7A97\\u53E3\\u5C0F\\u90E8\\u4EF6\\u6DFB\\u52A0\\u5E94\\u7528\\u7A0B\\u5E8F\\uFF0C\\u6216\\u8005\\u5982\\u679C\\u4E0D\\u9700\\u8981\\u7A97\\u53E3\\u5C0F\\u90E8\\u4EF6\\uFF0C\\u5219\\u5C06\\u5176\\u79FB\\u9664\\u3002\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\u6DFB\\u52A0\\u5E94\\u7528\\u7A0B\\u5E8F\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u5220\\u9664\\u7A97\\u53E3\\u5C0F\\u90E8\\u4EF6\nWorkPage.Cell.EmptyIllustrationTitle=\\u641C\\u7D22\\u5E94\\u7528\\u7A0B\\u5E8F\nWorkPage.Cell.EmptyIllustrationDescription=\\u5411\\u7A97\\u53E3\\u5C0F\\u90E8\\u4EF6\\u6DFB\\u52A0\\u5E94\\u7528\\u7A0B\\u5E8F\\uFF0C\\u6216\\u8005\\u5982\\u679C\\u4E0D\\u9700\\u8981\\u7A97\\u53E3\\u5C0F\\u90E8\\u4EF6\\uFF0C\\u5219\\u5C06\\u5176\\u79FB\\u9664\\u3002\nWorkPage.Cell.DeleteDialog.Title=\\u5220\\u9664\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u662F\\u5426\\u786E\\u5B9A\\u8981\\u5220\\u9664\\u6B64\\u7A97\\u53E3\\u5C0F\\u90E8\\u4EF6\\uFF1F\\u5176\\u4E2D\\u7684\\u6240\\u6709\\u5E94\\u7528\\u7A0B\\u5E8F\\u4E5F\\u90FD\\u4F1A\\u4ECE\\u9875\\u9762\\u4E2D\\u79FB\\u9664\\u3002\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u5220\\u9664\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u53D6\\u6D88\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u6253\\u5F00\\u7A97\\u53E3\\u5C0F\\u90E8\\u4EF6\\u8BBE\\u7F6E\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u5220\\u9664\\u7A97\\u53E3\\u5C0F\\u90E8\\u4EF6\n\nWorkPage.Section.AddVizInstanceButtonText=\\u6DFB\\u52A0\\u78C1\\u8D34\n\n\nContentFinder.Categories.Applications.Title=\\u5E94\\u7528\\u7A0B\\u5E8F\nContentFinder.Widgets.Tiles.Title=\\u78C1\\u8D34\nContentFinder.Widgets.Tiles.Description=\\u5E94\\u7528\\u7A0B\\u5E8F\\u7684\\u53EF\\u89C6\\u8868\\u793A\\u3002\nContentFinder.Widgets.Cards.Title=\\u5361\nContentFinder.Widgets.Cards.Description=\\u5E94\\u7528\\u7A0B\\u5E8F\\u7684\\u53EF\\u89C6\\u8868\\u793A\\uFF0C\\u4EE5\\u7075\\u6D3B\\u5E03\\u5C40\\u663E\\u793A\\u3002\n\nWorkPage.CardEditor.Save=\\u4FDD\\u5B58\nWorkPage.CardEditor.Cancel=\\u53D6\\u6D88\nWorkPage.CardEditor.Title=\\u914D\\u7F6E "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=\\u914D\\u7F6E\nWorkPage.Card.ActionDefinition.Configure=\\u914D\\u7F6E\nWorkPage.Card.ActionDefinition.Reset=\\u5220\\u9664\\u914D\\u7F6E\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\u5F53\\u524D\\u7528\\u6237\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=SAP Build Work Zone \\u7528\\u6237\\u7684\\u6807\\u8BC6\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone \\u7528\\u6237\\u6807\\u8BC6\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=\\u5F53\\u524D\\u7528\\u6237\\u7684\\u6807\\u8BC6\\u3002\\u8BE5\\u503C\\u5C06\\u968F\\u767B\\u5F55\\u7684\\u7528\\u6237\\u800C\\u53D8\\u5316\\u3002\\u8981\\u663E\\u793A\\u7528\\u6237\\u7684\\u59D3\\u540D\\uFF0C\\u8BF7\\u4F7F\\u7528 SAP Build Work Zone \\u7528\\u6237\\u7684\\u59D3\\u540D\\u3002\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=SAP Build Work Zone \\u7528\\u6237\\u7684\\u59D3\\u540D\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone \\u7528\\u6237\\u540D\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\u5F53\\u524D\\u7528\\u6237\\u7684\\u59D3\\u540D\\uFF0C\\u7531\\u540D\\u5B57\\u3001\\u4E2D\\u95F4\\u540D\\u548C\\u59D3\\u6C0F\\u7EC4\\u6210\\u3002\\u4E2D\\u95F4\\u540D\\u5C06\\u4E3A\\u7F29\\u5199\\u5F62\\u5F0F\\u3002\\u8BE5\\u503C\\u5C06\\u968F\\u767B\\u5F55\\u7684\\u7528\\u6237\\u800C\\u53D8\\u5316\\u3002\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=SAP Build Work Zone \\u7528\\u6237\\u7684\\u540D\\u5B57\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone \\u7528\\u6237\\u540D\\u5B57\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\u5F53\\u524D\\u7528\\u6237\\u7684\\u540D\\u5B57\\u3002\\u8BE5\\u503C\\u5C06\\u968F\\u767B\\u5F55\\u7684\\u7528\\u6237\\u800C\\u53D8\\u5316\\u3002\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=SAP Build Work Zone \\u7528\\u6237\\u7684\\u59D3\\u6C0F\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone \\u7528\\u6237\\u59D3\\u6C0F\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\u5F53\\u524D\\u7528\\u6237\\u7684\\u59D3\\u6C0F\\u3002\\u8BE5\\u503C\\u5C06\\u968F\\u767B\\u5F55\\u7684\\u7528\\u6237\\u800C\\u53D8\\u5316\\u3002\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\u5F53\\u524D SAP Build Work Zone \\u7528\\u6237\\u7684\\u7535\\u5B50\\u90AE\\u4EF6\\u5730\\u5740\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone \\u7528\\u6237\\u7535\\u5B50\\u90AE\\u4EF6\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u5F53\\u524D SAP Build Work Zone \\u7528\\u6237\\u7684\\u7535\\u5B50\\u90AE\\u4EF6\\u5730\\u5740\\u3002\\u8BE5\\u503C\\u5C06\\u968F\\u767B\\u5F55\\u7684\\u7528\\u6237\\u800C\\u53D8\\u5316\\u3002\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u5220\\u9664\\u914D\\u7F6E\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u6B64\\u5361\\u6709\\u5355\\u72EC\\u7684\\u914D\\u7F6E\\u3002\\u662F\\u5426\\u8981\\u5C06\\u5176\\u4E0D\\u53EF\\u64A4\\u9500\\u5730\\u5220\\u9664\\u5E76\\u5C06\\u8BE5\\u5361\\u91CD\\u7F6E\\u4E3A\\u5176\\u7F3A\\u7701\\u8BBE\\u7F6E\\uFF1F\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u5220\\u9664\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u53D6\\u6D88\n',
  "sap/ushell/components/workPageBuilder/resources/resources_zh_TW.properties":
    '\n\nWorkPage.EmptyPage.Title=\\u7A7A\\u767D\\u9801\\u9762\nWorkPage.EmptyPage.Message=\\u6B64\\u9801\\u9762\\u5C1A\\u672A\\u5305\\u542B\\u5340\\u6BB5\\u3002\nWorkPage.EmptyPage.Button.Add=\\u65B0\\u589E\\u5340\\u6BB5\n\nWorkPage.EditMode.Save=\\u5132\\u5B58\nWorkPage.EditMode.Cancel=\\u53D6\\u6D88\nWorkPage.Message.WidgetMoved=\\u5DF2\\u79FB\\u52D5 Widget\n\nWorkPage.Row.OverflowToolbar.RowTitleLabel=\\u5340\\u6BB5\\u6A19\\u984C\nWorkPage.Row.OverflowToolbar.RowTitleOptional=\\u8F38\\u5165\\u9078\\u64C7\\u6027\\u5340\\u6BB5\\u6A19\\u984C\nWorkPage.Row.OverflowToolbar.DeleteRowButtonText=\\u79FB\\u9664\\u5340\\u6BB5\nWorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip=\\u522A\\u9664\\u5340\\u6BB5\nWorkPage.Row.DeleteDialog.Title=\\u522A\\u9664\nWorkPage.Row.DeleteDialog.ConfirmText=\\u60A8\\u8981\\u522A\\u9664\\u6B64\\u5340\\u6BB5\\u8207\\u6240\\u6709\\u5176\\u5167\\u5BB9\\u55CE\\uFF1F\nWorkPage.Row.DeleteDialog.Button.Confirm=\\u522A\\u9664\nWorkPage.Row.DeleteDialog.Button.Cancel=\\u53D6\\u6D88\nWorkPage.Row.AddRowButtonTooltip=\\u65B0\\u589E\\u5340\\u6BB5\nWorkPage.Row.MessageStrip.DeprecatedColumnCount=\\u5728\\u57F7\\u884C\\u6642\\u671F\\u50C5\\u53EF\\u770B\\u5230\\u524D\\u56DB\\u6B04\\uFF0C\\u8ACB\\u5C07\\u6B04\\u6578\\u91CF\\u6E1B\\u5C11\\u5230\\u56DB\\u6B04\\u3002\nWorkPage.Row.AriaLabel=\\u5DE5\\u4F5C\\u9801\\u9762\\u5340\\u6BB5\n\nWorkPage.Column.AriaLabel=\\u6B04 {0}/{1}\nWorkPage.Column.AddWidgetButtonText=\\u65B0\\u589E Widget\nWorkPage.Column.DeleteColumnButtonTooltip=\\u79FB\\u9664\\u6B04\nWorkPage.Column.AddColumnButtonTooltip=\\u65B0\\u589E\\u6B04\nWorkPage.Column.EmptyIllustrationTitle=\\u641C\\u5C0B\\u61C9\\u7528\\u7A0B\\u5F0F\nWorkPage.Column.EmptyIllustrationDescription=\\u5C07\\u61C9\\u7528\\u7A0B\\u5F0F\\u52A0\\u5165 Widget\\uFF0C\\u6216\\u662F\\u4E0D\\u9700\\u8981\\u6642\\u522A\\u9664 Widget\\u3002\n\nWorkPage.Cell.HeaderBar.AddTilesTooltip=\\u65B0\\u589E\\u61C9\\u7528\\u7A0B\\u5F0F\nWorkPage.Cell.HeaderBar.DeleteWidgetTooltip=\\u522A\\u9664 Widget\nWorkPage.Cell.EmptyIllustrationTitle=\\u641C\\u5C0B\\u61C9\\u7528\\u7A0B\\u5F0F\nWorkPage.Cell.EmptyIllustrationDescription=\\u5C07\\u61C9\\u7528\\u7A0B\\u5F0F\\u52A0\\u5165 Widget\\uFF0C\\u6216\\u662F\\u4E0D\\u9700\\u8981\\u6642\\u522A\\u9664 Widget\\u3002\nWorkPage.Cell.DeleteDialog.Title=\\u522A\\u9664\nWorkPage.Cell.DeleteDialog.ConfirmText=\\u60A8\\u78BA\\u5B9A\\u8981\\u522A\\u9664\\u6B64 Widget \\u55CE\\uFF1F\\u6B64 Widget \\u4E2D\\u7684\\u6240\\u6709\\u61C9\\u7528\\u7A0B\\u5F0F\\u4E5F\\u5C07\\u6703\\u5F9E\\u9801\\u9762\\u4E2D\\u79FB\\u9664\\u3002\nWorkPage.Cell.DeleteDialog.Button.Confirm=\\u522A\\u9664\nWorkPage.Cell.DeleteDialog.Button.Cancel=\\u53D6\\u6D88\n\nWorkPage.WidgetContainer.OpenWidgetSettingsButtonTooltip=\\u958B\\u555F Widget \\u8A2D\\u5B9A\nWorkPage.WidgetContainer.DeleteWidgetButtonTooltip=\\u522A\\u9664 Widget\n\nWorkPage.Section.AddVizInstanceButtonText=\\u65B0\\u589E\\u529F\\u80FD\\u78DA\n\n\nContentFinder.Categories.Applications.Title=\\u61C9\\u7528\\u7A0B\\u5F0F\nContentFinder.Widgets.Tiles.Title=\\u529F\\u80FD\\u78DA\nContentFinder.Widgets.Tiles.Description=\\u61C9\\u7528\\u7A0B\\u5F0F\\u7684\\u8996\\u89BA\\u8868\\u793A\\u65B9\\u5F0F\\u3002\nContentFinder.Widgets.Cards.Title=\\u5361\\u7247\nContentFinder.Widgets.Cards.Description=\\u61C9\\u7528\\u7A0B\\u5F0F\\u7684\\u8996\\u89BA\\u8868\\u793A\\u65B9\\u5F0F (\\u4F9D\\u5F48\\u6027\\u914D\\u7F6E\\u986F\\u793A)\\u3002\n\nWorkPage.CardEditor.Save=\\u5132\\u5B58\nWorkPage.CardEditor.Cancel=\\u53D6\\u6D88\nWorkPage.CardEditor.Title=\\u7D44\\u614B "{0}"\nWorkPage.CardEditor.Title.NoCardTitle=\\u7D44\\u614B\nWorkPage.Card.ActionDefinition.Configure=\\u7D44\\u614B\nWorkPage.Card.ActionDefinition.Reset=\\u522A\\u9664\\u7D44\\u614B\n\nWorkPage.Host.Context.WorkZone.Label=SAP Build Work Zone\nWorkPage.Host.Context.WorkZone.CurrentUser.Label=\\u76EE\\u524D\\u4F7F\\u7528\\u8005\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Label=SAP Build Work Zone \\u4F7F\\u7528\\u8005 ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Placeholder=SAP Build Work Zone \\u4F7F\\u7528\\u8005 ID\nWorkPage.Host.Context.WorkZone.CurrentUser.Id.Desc=\\u76EE\\u524D\\u4F7F\\u7528\\u8005 Id\\uFF1B\\u6B64\\u503C\\u5C07\\u6703\\u6839\\u64DA\\u767B\\u5165\\u7684\\u4F7F\\u7528\\u8005\\u800C\\u66F4\\u6539\\u3002\\u82E5\\u8981\\u986F\\u793A\\u4F7F\\u7528\\u8005\\u540D\\u7A31\\uFF0C\\u8ACB\\u4F7F\\u7528 SAP Build Work Zone \\u4F7F\\u7528\\u8005\\u540D\\u7A31\\u3002\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Label=SAP Build Work Zone \\u4F7F\\u7528\\u8005\\u540D\\u7A31\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Placeholder=SAP Build Work Zone \\u4F7F\\u7528\\u8005\\u540D\\u7A31\nWorkPage.Host.Context.WorkZone.CurrentUser.Name.Desc=\\u76EE\\u524D\\u4F7F\\u7528\\u8005\\u540D\\u7A31\\uFF0C\\u5305\\u542B\\u540D\\u5B57\\u3001\\u4E2D\\u9593\\u540D\\u548C\\u59D3\\u6C0F\\uFF0C\\u800C\\u4E2D\\u9593\\u540D\\u5C07\\u6703\\u4EE5\\u7E2E\\u5BEB\\u65B9\\u5F0F\\u986F\\u793A\\u3002\\u6B64\\u503C\\u5C07\\u6703\\u6839\\u64DA\\u767B\\u5165\\u7684\\u4F7F\\u7528\\u8005\\u800C\\u66F4\\u6539\\u3002\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Label=SAP Build Work Zone \\u4F7F\\u7528\\u8005\\u540D\\u5B57\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Placeholder=SAP Build Work Zone \\u4F7F\\u7528\\u8005\\u540D\\u5B57\nWorkPage.Host.Context.WorkZone.CurrentUser.FirstName.Desc=\\u76EE\\u524D\\u4F7F\\u7528\\u8005\\u540D\\u5B57\\uFF0C\\u6B64\\u503C\\u5C07\\u6703\\u6839\\u64DA\\u767B\\u5165\\u7684\\u4F7F\\u7528\\u8005\\u800C\\u66F4\\u6539\\u3002\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Label=SAP Build Work Zone \\u4F7F\\u7528\\u8005\\u59D3\\u6C0F\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Placeholder=SAP Build Work Zone \\u4F7F\\u7528\\u8005\\u59D3\\u6C0F\nWorkPage.Host.Context.WorkZone.CurrentUser.LastName.Desc=\\u76EE\\u524D\\u4F7F\\u7528\\u8005\\u59D3\\u6C0F\\uFF0C\\u6B64\\u503C\\u5C07\\u6703\\u6839\\u64DA\\u767B\\u5165\\u7684\\u4F7F\\u7528\\u8005\\u800C\\u66F4\\u6539\\u3002\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Label=\\u76EE\\u524D SAP Build Work Zone \\u4F7F\\u7528\\u8005\\u96FB\\u5B50\\u90F5\\u4EF6\\u5730\\u5740\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Placeholder=SAP Build Work Zone \\u4F7F\\u7528\\u8005\\u96FB\\u5B50\\u90F5\\u4EF6\nWorkPage.Host.Context.WorkZone.CurrentUser.Email.Desc=\\u76EE\\u524D SAP Build Work Zone \\u4F7F\\u7528\\u8005\\u96FB\\u5B50\\u90F5\\u4EF6\\u5730\\u5740\\uFF0C\\u6B64\\u503C\\u5C07\\u6703\\u6839\\u64DA\\u767B\\u5165\\u7684\\u4F7F\\u7528\\u8005\\u800C\\u66F4\\u6539\\u3002\nWorkPage.CardEditor.DeleteConfigurationDialog.Title=\\u522A\\u9664\\u7D44\\u614B\nWorkPage.CardEditor.DeleteConfigurationDialog.Content=\\u6B64\\u5361\\u7247\\u6709\\u500B\\u5225\\u7D44\\u614B\\uFF1B\\u60A8\\u8981\\u4EE5\\u4E0D\\u53EF\\u64A4\\u92B7\\u5730\\u65B9\\u5F0F\\u522A\\u9664\\u9019\\u4E9B\\u7D44\\u614B\\uFF0C\\u4E26\\u5C07\\u5361\\u7247\\u91CD\\u8A2D\\u70BA\\u5176\\u9810\\u8A2D\\u8A2D\\u5B9A\\u55CE\\uFF1F\nWorkPage.CardEditor.DeleteConfigurationDialog.Accept=\\u522A\\u9664\nWorkPage.CardEditor.DeleteConfigurationDialog.Deny=\\u53D6\\u6D88\n',
  "sap/ushell/components/workPageBuilder/view/WorkPageBuilder.view.xml":
    '<mvc:View\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:dnd="sap.ui.core.dnd"\n    xmlns:cep="sap.ushell.components.workPageBuilder.controls"\n    xmlns:core="sap.ui.core"\n    core:require="{\n        coreLibrary: \'sap/ui/core/library\'\n    }"\n    controllerName="sap.ushell.components.workPageBuilder.controller.WorkPageBuilder"\n    id="workPageBuilder"\n    height="100%"><Page\n        id="workpageBuilderPage"\n        showHeader="false"\n        showFooter="{= !!${/editMode} &amp;&amp; !!${/showFooter} }"\n        backgroundDesign="Transparent"\n        floatingFooter="true"><cep:WorkPage\n            id="workPage"\n            afterRendering=".focusFirstItem"\n            breakpoint="{viewSettings>/currentBreakpoint/name}"\n            editMode="{/editMode}"\n            showTitle="{= !!${/showPageTitle} &amp;&amp; !!${descriptor/value/title}}"\n            emptyIllustrationTitle="{i18n>WorkPage.EmptyPage.Title}"\n            emptyIllustrationMessage="{i18n>WorkPage.EmptyPage.Message}"\n            ="{i18n>WorkPage.EmptyPage.Button.Add}"\n            rows="{path: \'rows\', templateShareable: false, key: \'id\'}"\n            loaded="{/loaded}"\n            addFirstRow=".onAddFirstRow"><cep:title><Title\n                    id="workPageTitle"\n                    text="{descriptor/value/title}"\n                    level="{= coreLibrary.TitleLevel.H2 }"\n                    titleStyle="{= coreLibrary.TitleLevel.H3 }" /></cep:title><cep:WorkPageRow\n                id="workPageRow"\n                addRowButtonTooltip="{i18n>WorkPage.Row.AddRowButtonTooltip}"\n                editMode="{/editMode}"\n                maxColumns="{/maxColumns}"\n                columns="{path: \'columns\', templateShareable:false, key: \'id\'}"\n                columnMinFlex="{viewSettings>/currentBreakpoint/columnMinFlex}"\n                ariaLabel="{\n                    parts: [\n                        { path: \'id\' },\n                        { path: \'/data/workPage/rows\' },\n                        { path: \'descriptor/value/title\' }\n                    ],\n                    formatter: \'.formatRowAriaLabel\'\n                }"\n                addRow=".onAddRow"><cep:controlButtons><Button\n                        id="workPageDeleteButton"\n                        class="workPageRowControlButton"\n                        press=".onDeleteRow"\n                        icon="sap-icon://delete"\n                        tooltip="{i18n>WorkPage.Row.OverflowToolbar.DeleteRowButtonTooltip}"\n                        visible="{/editMode}" /></cep:controlButtons><cep:headerBar><OverflowToolbar\n                        id="workPageRowToolbar"\n                        class="workPageRowToolbar"\n                        visible="{= ${/editMode} || !!${descriptor/value/title} }"><Label\n                            id="workPageRowInputTitleLabel"\n                            labelFor="workPageRowInputTitle"\n                            text="{i18n>WorkPage.Row.OverflowToolbar.RowTitleLabel}"\n                            visible="{/editMode}"><layoutData><OverflowToolbarLayoutData group="1" /></layoutData></Label><Input\n                            id="workPageRowInputTitle"\n                            value="{descriptor/value/title}"\n                            editable="true"\n                            placeholder="{i18n>WorkPage.Row.OverflowToolbar.RowTitleOptional}"\n                            change=".onEditTitle"\n                            visible="{/editMode}"><layoutData><OverflowToolbarLayoutData\n                                    group="1"\n                                    shrinkable="true"\n                                    minWidth="12rem" /></layoutData></Input></OverflowToolbar></cep:headerBar><cep:messageStrip><MessageStrip\n                        id="workPageRowMessageStrip"\n                        type="Warning"\n                        showIcon="true"\n                        text="{i18n>WorkPage.Row.MessageStrip.DeprecatedColumnCount}"\n                        class="workPageRowMessageStrip"\n                        visible="{= ${/editMode} &amp;&amp; ${columns}.length > ${/maxColumns}}" /></cep:messageStrip><cep:title><Title\n                        id="workPageRowSectionTitle"\n                        level="{= coreLibrary.TitleLevel.H3 }"\n                        wrapping="true"\n                        class="workPageRowSectionTitle"\n                        text="{descriptor/value/title}"\n                        visible="{= !${/editMode} &amp;&amp; !!${descriptor/value/title} }" /></cep:title><cep:WorkPageColumn\n                    id="workPageColumn"\n                    editMode="{/editMode}"\n                    ariaLabelPlaceholder="{i18n>WorkPage.Column.AriaLabel}"\n                    columnWidth="{descriptor/value/columnWidth}"\n                    deleteColumnButtonTooltip="{i18n>WorkPage.Column.DeleteColumnButtonTooltip}"\n                    addColumnButtonTooltip="{i18n>WorkPage.Column.AddColumnButtonTooltip}"\n                    addWidgetButtonText="{i18n>WorkPage.Column.AddWidgetButtonText}"\n                    columnResized=".onResize"\n                    columnResizeCompleted=".onResizeCompleted"\n                    cells="{path: \'cells\', templateShareable:false, key: \'id\'}"\n                    addColumn=".onAddColumn"\n                    removeColumn=".onDeleteColumn"\n                    addWidget=".openWidgetGallery"><cep:WorkPageCell\n                        id="workPageCell"\n                        editMode="{/editMode}"\n                        widgets="{path: \'widgets\', factory: \'.widgetFactory\', key: \'id\'}"\n                        tileMode="{\n                            parts: [\n                                { path: \'widgets\' }\n                            ], formatter: \'.tileMode\'\n                        }"\n                        moveVisualization=".onGridDrop"\n                        gridColumnsChange=".onGridColumnsChange"\n                        deleteWidgetTooltip="{i18n>WorkPage.WidgetContainer.DeleteWidgetButtonTooltip}"\n                        addApplicationButtonText="{i18n>WorkPage.Section.AddVizInstanceButtonText}"\n                        gridContainerGap="{viewSettings>/currentBreakpoint/gap}"\n                        gridContainerRowSize="{viewSettings>/currentBreakpoint/rowSize}"\n                        emptyIllustrationTitle="{i18n>WorkPage.Cell.EmptyIllustrationTitle}"\n                        emptyIllustrationMessage="{i18n>WorkPage.Cell.EmptyIllustrationDescription}"\n                        gridContainerBorderReached=".onGridContainerBorderReached"><cep:headerBar><OverflowToolbar\n                                id="workPageCellOverflowToolbar"\n                                class="workPageCellOverflowToolbar"\n                                height="4rem"\n                                visible="{= ${/editMode} || !!${descriptor/value/title} }"><ToolbarSpacer /><Button\n                                    id="openAppSearch"\n                                    class="workPageCellControlButtons"\n                                    icon="sap-icon://add"\n                                    press=".openTilesAppSearch"\n                                    tooltip="{i18n>WorkPage.Cell.HeaderBar.AddTilesTooltip}"\n                                    visible="{\n                                        parts: [\n                                            { path: \'widgets\' },\n                                            { path: \'/editMode\' }\n                                        ], formatter: \'.showAppSearchButton\'\n                                    }"\n                                    type="Ghost" /><Button\n                                    id="deleteCell"\n                                    class="workPageCellControlButtons"\n                                    icon="sap-icon://delete"\n                                    press=".onDeleteCell"\n                                    tooltip="{i18n>WorkPage.Cell.HeaderBar.DeleteWidgetTooltip}"\n                                    type="Ghost" /></OverflowToolbar></cep:headerBar></cep:WorkPageCell><cep:dragDropConfig><dnd:DragInfo\n                            enabled="{/editMode}"\n                            sourceAggregation="cells"\n                            groupName="Cell" /><dnd:DropInfo\n                            drop=".onVisualizationDropBetweenCells($event)"\n                            targetAggregation="cells"\n                            groupName="CellGridContainer"\n                            dragEnter=".onWidgetOnCellDragEnter($event, false)"\n                            dropPosition="Between" /><dnd:DropInfo\n                            drop=".onVisualizationDropOnEmptyWidgetContainer($event)"\n                            targetAggregation="cells"\n                            groupName="CellGridContainer"\n                            dragEnter=".onWidgetOnCellDragEnter($event, true)"\n                            dropPosition="On" /><dnd:DropInfo\n                            drop=".onVisualizationDropOnCell($event)"\n                            groupName="CellGridContainer"\n                            targetAggregation="cells"\n                            dropPosition="On" /><dnd:DropInfo\n                            drop=".onVisualizationDropOnCell($event)"\n                            enabled="{= ${cells} ? ${cells}.length === 0 : false}"\n                            groupName="CellGridContainer"\n                            dropPosition="On" /><dnd:DropInfo\n                            enabled="{= ${cells} ? ${cells}.length > 0 : false}"\n                            drop=".onCellDrop($event)"\n                            dropPosition="Between"\n                            groupName="Cell"\n                            dropLayout="Vertical"\n                            targetAggregation="cells" /><dnd:DropInfo\n                            enabled="{= ${cells} ? ${cells}.length === 0 : false}"\n                            drop=".onCellDropOnEmptyColumn($event)"\n                            dropPosition="On"\n                            groupName="Cell" /></cep:dragDropConfig></cep:WorkPageColumn></cep:WorkPageRow></cep:WorkPage><footer><Bar id="workPageFooterBar"><contentRight><Button\n                        id="saveChanges"\n                        text="{i18n>WorkPage.EditMode.Save}"\n                        enabled="{/workPageHasChanges}"\n                        type="Emphasized"\n                        press=".saveEditChanges" /><Button\n                        id="discardChanges"\n                        text="{i18n>WorkPage.EditMode.Cancel}"\n                        press=".cancelEditChanges" /></contentRight></Bar></footer><landmarkInfo><PageAccessibleLandmarkInfo\n                rootRole="Region"\n                rootLabel="{i18n>WorkPage.Row.AriaLabel}"\n                headerRole="None"\n                contentRole="None"\n                footerRole="None" /></landmarkInfo></Page></mvc:View>\n',
  "sap/ushell/components/workPageBuilder/view/WorkPageCellDeleteDialog.fragment.xml":
    '<core:FragmentDefinition\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"><Dialog\n        id="workPageCellDeleteDialog"\n        state="Warning"\n        type="Message"\n        title="{i18n>WorkPage.Cell.DeleteDialog.Title}"><Text\n            id="confirmationText"\n            text="{i18n>WorkPage.Cell.DeleteDialog.ConfirmText}" /><beginButton><Button\n                id="confirm"\n                type="Emphasized"\n                text="{i18n>WorkPage.Cell.DeleteDialog.Button.Confirm}" /></beginButton><endButton><Button\n                id="cancel"\n                text="{i18n>WorkPage.Cell.DeleteDialog.Button.Cancel}"\n                press=".onCellDeleteCancel" /></endButton></Dialog></core:FragmentDefinition>\n',
  "sap/ushell/components/workPageBuilder/view/WorkPageRowDeleteDialog.fragment.xml":
    '<core:FragmentDefinition\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"><Dialog\n        id="workPageRowDeleteDialog"\n        type="Message"\n        state="Warning"\n        title="{i18n>WorkPage.Row.DeleteDialog.Title}"><Text\n            id="confirmationText"\n            text="{i18n>WorkPage.Row.DeleteDialog.ConfirmText}" /><beginButton><Button\n                id="confirm"\n                type="Emphasized"\n                text="{i18n>WorkPage.Row.DeleteDialog.Button.Confirm}" /></beginButton><endButton><Button\n                id="cancel"\n                text="{i18n>WorkPage.Row.DeleteDialog.Button.Cancel}"\n                press=".onRowDeleteCancel" /></endButton></Dialog></core:FragmentDefinition>\n',
});
//# sourceMappingURL=Component-preload.js.map
