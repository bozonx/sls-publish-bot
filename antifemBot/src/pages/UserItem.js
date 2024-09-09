import yaml from 'js-yaml';
import { PageBase } from '../PageRouter.js';
import { t, defineMenu, isUserAdmin } from '../helpers/helpers.js';
import { escapeMdV2 } from '../helpers/publishHelpres.js';
import { USER_KEYS, HOME_PAGE, DB_TABLE_NAMES } from '../constants.js';

export class UserItem extends PageBase {
	async renderMenu() {
		const c = this.router.c;

		if (!isUserAdmin(this.me)) return this.router.go('home');

		const { createdAt, updatedAt, id, ...user } = await this.db.getItem(
			DB_TABLE_NAMES.User,
			this.state.editUserId,
		);

		user.cfg = JSON.parse(user.cfg);

		this.text =
			escapeMdV2(
				t(c, 'userItemDescr') +
					`\n\nid: ${id}\n` +
					`createdAt: ${new Date(createdAt).toISOString()}\n` +
					`updatedAt: ${new Date(updatedAt).toISOString()}\n`,
			) +
			'```\n' +
			yaml.dump(user) +
			'\n```';
		this.menuTextInMd = true;

		return defineMenu([
			[
				{
					id: 'deleteUserBtn',
					label: t(c, 'deleteUserBtn'),
				},
			],
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId) {
		switch (btnId) {
			case 'deleteUserBtn':
				const res = await this.db.deleteItem(
					DB_TABLE_NAMES.User,
					this.state.editUserId,
				);

				delete this.state.editUserId;

				await this.reply(`User was deleted\n\n${yaml.dump(res)}`);

				return this.router.go('users-manager');
			case 'backBtn':
				delete this.state.editUserId;

				return this.router.go('users-manager');
			case 'toHomeBtn':
				delete this.state.editUserId;

				return this.router.go(HOME_PAGE);
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;
		const text = c.msg.text;
		let obj;

		if (!text) return this.reply('No text');

		// try to parse YAML
		try {
			obj = yaml.load(text);
		} catch (e) {
			return this.reply(`ERROR: Can't parse yaml. ${e}`);
		}

		if (typeof obj[USER_KEYS.tgUserId] !== 'string') {
			return this.reply(`ERROR: wrong data. No tgUserId`);
		}

		await this.db.updateItem(DB_TABLE_NAMES.User, {
			id: this.state.editUserId,
			...obj,
			cfg: JSON.stringify(obj.cfg),
		});
		await this.reply(`User was saved`);

		return this.router.reload();
	}
}
