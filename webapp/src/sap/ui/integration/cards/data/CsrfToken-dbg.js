/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([], () => {
	"use strict";

	// Map of all CSRF tokens. Keyed by the unique URL of each request. Shared by all cards.
	const tokensPromises = new Map();

	class CsrfToken {
		#name;
		#config;
		#tokenHandler;
		#key;
		#version = -1;
		value;

		constructor(tokenName, tokenConfig, tokenHandler) {
			this.#name = tokenName;
			this.#config = tokenConfig;
			this.#tokenHandler = tokenHandler;
			this.#key = tokenConfig.data.request.url;
		}

		load() {
			return this.#fetchValue();
		}

		markExpired() {
			if (this.#version === tokensPromises.get(this.#key)?.version) {
				tokensPromises.get(this.#key).expired = true;
			}
		}

		async #fetchValue() {
			/**
			 * @deprecated As of version 1.120.0
			 */
			const hostValue = await this.#tokenHandler.fetchValueByHost(this.#config);

			/**
			 * @deprecated As of version 1.120.0
			 */
			if (hostValue) {
				this.#tokenHandler.onTokenFetched(this.#name, hostValue);
				this.value = hostValue;
				return;
			}

			let globalToken = tokensPromises.get(this.#key);

			if (!globalToken || globalToken?.expired) {
				globalToken = {
					fetchPromise: this.#tokenHandler.fetchValue(this.#config),
					version: (globalToken?.version ?? 0) + 1,
					expired: false
				};

				tokensPromises.set(this.#key, globalToken);
			}

			const value = await globalToken.fetchPromise;
			this.#version = tokensPromises.get(this.#key).version;
			this.#tokenHandler.onTokenFetched(this.#name, value);
			this.value = value;
		}
	}

	return CsrfToken;
});