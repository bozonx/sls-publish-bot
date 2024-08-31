import _ from 'lodash';
import yaml from 'js-yaml';
import { PageBase } from '../PageRouter.js';
import { t, saveToKv, isAdminUser, defineMenu } from '../helpers.js';
import {
	KV_KEYS,
	CTX_KEYS,
	USER_KEYS,
	USER_SENT_TO_ADMIN_MSG_DELIMITER,
} from '../constants.js';

export class UsersManager extends PageBase {
	async mount() {
		const c = this.router.c;

		if (!isAdminUser(c, c.msg.chat.id)) return this.router.go('home');

		const users = c.ctx[CTX_KEYS.USERS];

		this.text = t(c, 'usersManagerDescr');
		this.menu = defineMenu([
			...users.map((i) => [
				{
					id: `USER-${i[USER_KEYS.ID]}`,
					label: `${i[USER_KEYS.NAME]} | ${i[USER_KEYS.ID]}${i[USER_KEYS.IS_ADMIN] ? ' (admin)' : ''}`,
					payload: i[USER_KEYS.ID],
					cb: this.userRemoveCallback,
				},
			]),
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.router.go('home'),
				},
			],
		]);
	}

	async onMessage() {
		const c = this.router.c;
		const text = c.msg.text;
		let obj;

		if (!text) return c.reply('No text');

		if (text.indexOf(USER_SENT_TO_ADMIN_MSG_DELIMITER) > 0) {
			const [useless, dataJson] = text.split(USER_SENT_TO_ADMIN_MSG_DELIMITER);

			try {
				obj = JSON.parse(dataJson.trim());
			} catch (e) {
				return c.reply(`ERROR: can't parse json`);
			}
		} else {
			// try to parse YAML
			try {
				obj = yaml.load(text.trim());
			} catch (e) {
				return c.reply(`ERROR: Can't parse yaml. ${e}`);
			}
		}

		if (typeof obj[USER_KEYS.ID] !== 'number') {
			return c.reply(`ERROR: wrong data. Id is not number`);
		}

		// const allUsers = await loadFromKv(c, KV_KEYS.USERS);
		const users = c.ctx[CTX_KEYS.USERS];
		const merged = [...users, obj];

		await saveToKv(c, KV_KEYS.USERS, merged);
		await c.reply(`User was saved\n\n${yaml.dump(obj)}`);
		await this.router.reload();
	}

	userRemoveCallback = async (btnId, payload) => {
		const c = this.router.c;
		const users = c.ctx[CTX_KEYS.USERS];
		const prepared = [...users];
		const index = prepared.findIndex(
			(i) => i[USER_KEYS.ID] === Number(payload),
		);

		if (index < 0) return c.reply(`ERROR: Can't find user ${payload}`);

		prepared.splice(index, 1);

		await saveToKv(c, KV_KEYS.USERS, prepared);
		await c.reply(`User was deleted\n\n${yaml.dump(users[index])}`);

		return c.router.reload();
	};
}
