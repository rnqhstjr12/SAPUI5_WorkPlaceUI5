// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/Log","sap/ui/core/Manifest","sap/base/util/deepClone","sap/base/util/extend","sap/base/util/isEmptyObject","sap/base/util/ObjectPath"],function(s,e,a,t,n,i){"use strict";const l={STATIC_LAUNCHER:"sap.ushell.StaticAppLauncher",DYNAMIC_LAUNCHER:"sap.ushell.DynamicAppLauncher",CARD:"sap.ushell.Card"};class c{static#s=null;#e=null;static async getAll(){if(!c.#s){c.#s=new c}return c.#s._getAll()}async _getAll(){if(!this.#e){this.#e={};const s={};s[l.STATIC_LAUNCHER]="sap/ushell/components/tiles/cdm/applauncher/manifest.json";s[l.DYNAMIC_LAUNCHER]="sap/ushell/components/tiles/cdm/applauncherdynamic/manifest.json";s[l.CARD]="sap/ushell/services/_CommonDataModel/vizTypeDefaults/cardManifest.json";await Promise.all(Object.keys(s).map(async e=>{const a=s[e];const t=await this._loadManifest(a);this.#e[e]=t}))}return this.#e}async _loadManifest(s){const t=sap.ui.require.toUrl(s);const n=await e.load({manifestUrl:t,async:true});return a(n.getRawJson())}}return c});
//# sourceMappingURL=VizTypeDefaults.js.map