import _ from 'lodash';
import { PageBase } from './PageRouter.js';

export class PubPageBase extends PageBase {
	async reload(newPubPartial) {
		this._updateState(newPubPartial);

		return this.router.reload();
	}

	async go(pathTo, newPubPartial) {
		this._updateState(newPubPartial);

		return this.router.go(pathTo);
	}

	_updateState(newPubPartial) {
		if (!newPubPartial) return;

		this._state = _.defaultsDeep(_.cloneDeep(newPubPartial || {}), this.state);
	}
}
