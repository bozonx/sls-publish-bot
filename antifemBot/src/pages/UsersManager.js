import { PageBase } from '../PageRouter.js';
import { t, saveDataToKv, isAdminUser } from '../helpers.js';
import { KV_KEYS, CTX_KEYS, USER_KEYS } from '../constants.js';

export class UsersManager extends PageBase {
	async mount() {
		const c = this.pager.c;

		if (!isAdminUser(c, c.msg.chat.id)) return this.pager.go('home', null);

		this.text = t(c, 'usersManagerDescr');

		const users = c.ctx[CTX_KEYS.USERS];

		this.menu = [
			...users.map((item, index) => [
				[
					`${item[USER_KEYS.NAME]} | ${item[USER_KEYS.ID]}${item[USER_KEYS.IS_ADMIN] ? ' (admin)' : ''}`,
					this.userRemoveCallback(index),
				],
			]),
			[[t(c, 'toHomeBtn'), () => this.pager.go('home', null)]],
		];
	}

	async message() {
		const c = this.pager.c;

		if (!c.msg.text) return c.reply('No text');

		// TODO: add read from special message
		// TODO: read from YAML

		// const tags = parseTagsFromInput(c.msg.text);
		// const megedTags = [...this.tags, ...tags].sort();
		//
		// await saveDataToKv(this.c, KV_KEYS.TAGS, megedTags);
		// await this.pager.reload();
	}

	// TODO: не передавать индекс
	userRemoveCallback(index) {
		const c = this.pager.c;

		return async () => {
			const users = c.ctx[CTX_KEYS.USERS];
			// remove selected tag
			const prepared = [...users];

			prepared.splice(index, 1);

			await saveDataToKv(c, KV_KEYS.USERS, prepared);
			await c.pager.reload();
		};
	}
}
