import { PageBase } from './PageRouter.js';

export class PubPageBase extends PageBase {
	async reload() {
		//
	}

	async go(newPubPartial) {
		const c = this.c;
		let loadedState;

		// TODO: может всегда надо загружать???

		// if (!this.state) {
		// load it from cache
		loadedState = await loadFromCache(c, STATE_CACHE_NAME);

		// TODO: если кэш протух то что?

		this._state = _.cloneDeep(loadedState);
		// }

		if (!this.state) this._state = {};

		if (newPartialState === null) {
			this._state = {};
		} else {
			if (replaceState) {
				this._state = newPartialState || {};
			} else {
				this._state = _.defaultsDeep(
					_.cloneDeep(newPartialState || {}),
					this.state,
				);
			}
		}
	}
}
