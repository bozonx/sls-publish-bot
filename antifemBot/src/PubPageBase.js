import { PageBase } from './PageRouter.js';

export class PubPageBase extends PageBase {
	async reload(newPubPartial) {
		this._updatePubState(newPubPartial);

		return this.router.reload();
	}

	async go(pathTo, newPubPartial) {
		this._updatePubState(newPubPartial);

		return this.router.go(pathTo);
	}

	_updatePubState(newPubPartial) {
		if (!newPubPartial) return;

		this.state.pub = {
			...this.state.pub,
			...(newPubPartial || {}),
		};
	}
}
