import { PageBase } from '../PageRouter.js';
import { t, saveDataToKv, isAdminUser, defineMenu } from '../helpers.js';
import { KV_KEYS, CTX_KEYS, USER_KEYS } from '../constants.js';

export class UsersManager extends PageBase {
	async mount() {
		const c = this.pager.c;

		if (!isAdminUser(c, c.msg.chat.id)) return this.pager.go('home', null);

		this.text = t(c, 'usersManagerDescr');

		const users = c.ctx[CTX_KEYS.USERS];

		this.menu = defineMenu([
			...users.map((i) => [
				{
					id: String(i[USER_KEYS.ID]),
					label: `${i[USER_KEYS.NAME]} | ${i[USER_KEYS.ID]}${i[USER_KEYS.IS_ADMIN] ? ' (admin)' : ''}`,
					cb: this.userRemoveCallback,
				},
			]),
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.pager.go('home', null),
				},
			],
		]);
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

	userRemoveCallback = async (btnId) => {
		const c = this.pager.c;
		const users = c.ctx[CTX_KEYS.USERS];
		// remove selected tag
		const prepared = [...users];

		const index = prepared.findIndex((i) => i[USER_KEYS.ID] === Number(btnId));

		if (index < 0) return c.reply(`ERROR: Can't find user ${btnId}`);

		prepared.splice(index, 1);

		await saveDataToKv(c, KV_KEYS.USERS, prepared);
		await c.pager.reload();
	};
}
