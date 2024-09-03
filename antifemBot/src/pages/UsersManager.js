import yaml from 'js-yaml';
import { PageBase } from '../PageRouter.js';
import { t, saveToKv, defineMenu, parseJsonSafelly } from '../helpers.js';
import {
	KV_KEYS,
	USER_KEYS,
	USER_SENT_TO_ADMIN_MSG_DELIMITER,
} from '../constants.js';
import { breakArray } from '../lib.js';

export class UsersManager extends PageBase {
	async renderMenu() {
		const c = this.router.c;

		if (!this.me[USER_KEYS.isAdmin]) return this.router.go('home');

		this.text = t(c, 'usersManagerDescr');

		return defineMenu([
			...breakArray(
				this.users.map((i) => ({
					id: 'ITEM',
					label: `${i[USER_KEYS.name]} | ${i[USER_KEYS.id]}${i[USER_KEYS.isAdmin] ? ' (admin)' : ''}`,
					payload: i[USER_KEYS.id],
				})),
				2,
			),
			[
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'ITEM') {
			return this.userRemoveCallback(payload);
		}

		switch (btnId) {
			case 'cancelBtn':
				return this.router.go('home');
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;
		const text = c.msg.text;
		let obj;

		if (!text) return this.reply('No text');

		if (text.indexOf(USER_SENT_TO_ADMIN_MSG_DELIMITER) > 0) {
			const [useless, dataJson] = text.split(USER_SENT_TO_ADMIN_MSG_DELIMITER);

			try {
				obj = parseJsonSafelly(dataJson.trim());
			} catch (e) {
				return this.reply(`ERROR: can't parse json`);
			}
		} else {
			// try to parse YAML
			try {
				obj = yaml.load(text.trim());
			} catch (e) {
				return this.reply(`ERROR: Can't parse yaml. ${e}`);
			}
		}

		if (typeof obj[USER_KEYS.id] !== 'number') {
			return this.reply(`ERROR: wrong data. Id is not number`);
		}

		const allUsers = await loadFromKv(c, KV_KEYS.users);
		const merged = [...allUsers, obj];

		await saveToKv(c, KV_KEYS.users, merged);
		await this.reply(`User was saved\n\n${yaml.dump(obj)}`);

		return this.router.reload();
	}

	async userRemoveCallback(payload) {
		const c = this.router.c;
		const allUsers = await loadFromKv(c, KV_KEYS.users);
		const prepared = [...allUsers];
		const index = prepared.findIndex(
			(i) => i[USER_KEYS.id] === Number(payload),
		);

		if (index < 0) return this.reply(`ERROR: Can't find user ${payload}`);

		prepared.splice(index, 1);

		await saveToKv(c, KV_KEYS.users, prepared);
		await this.reply(`User was deleted\n\n${yaml.dump(allUsers[index])}`);

		return c.router.reload();
	}
}
