import yaml from 'js-yaml';
import { PageBase } from '../PageRouter.js';
import {
	t,
	defineMenu,
	parseJsonSafelly,
	isUserAdmin,
} from '../helpers/helpers.js';
import { breakArray } from '../helpers/lib.js';
import {
	USER_KEYS,
	USER_SENT_TO_ADMIN_MSG_DELIMITER,
	DEFAULT_BTN_ITEM_ID,
	HOME_PAGE,
	DB_TABLE_NAMES,
} from '../constants.js';

export class UsersManager extends PageBase {
	async renderMenu() {
		const c = this.router.c;

		if (!isUserAdmin(this.me)) return this.router.go('home');

		const users = await this.db.getAll(DB_TABLE_NAMES.User, {
			[USER_KEYS.id]: true,
			[USER_KEYS.name]: true,
			[USER_KEYS.cfg]: true,
		});

		this.text = t(c, 'usersManagerDescr');

		return defineMenu([
			...breakArray(
				users.map((i) => ({
					id: DEFAULT_BTN_ITEM_ID,
					label: `${i[USER_KEYS.name]} | ${i[USER_KEYS.id]}${isUserAdmin(i) ? ' (admin)' : ''}`,
					payload: i[USER_KEYS.id],
				})),
				2,
			),
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === DEFAULT_BTN_ITEM_ID) {
			return this.userRemoveCallback(payload);
		}

		switch (btnId) {
			case 'toHomeBtn':
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

		if (text.indexOf(USER_SENT_TO_ADMIN_MSG_DELIMITER) > 0) {
			const [, dataJson] = text.split(USER_SENT_TO_ADMIN_MSG_DELIMITER);

			try {
				obj = parseJsonSafelly(dataJson.trim());
			} catch (e) {
				return this.reply(`ERROR: can't parse json`);
			}
		} else {
			// try to parse YAML
			// TODO: add authorName
			try {
				obj = yaml.load(text.trim());
			} catch (e) {
				return this.reply(`ERROR: Can't parse yaml. ${e}`);
			}
		}

		if (typeof obj[USER_KEYS.id] !== 'number') {
			return this.reply(`ERROR: wrong data. Id is not number`);
		}

		await this.db.createItem(DB_TABLE_NAMES.User, obj);
		await this.reply(`User was saved\n\n${yaml.dump(obj)}`);

		return this.router.reload();
	}

	async userRemoveCallback(payload) {
		const c = this.router.c;
		// // TODO: remake
		// const allUsers = await loadFromKv(c, KV_KEYS.users);
		// const prepared = [...allUsers];
		// const index = prepared.findIndex(
		// 	(i) => i[USER_KEYS.id] === Number(payload),
		// );
		//
		// if (index < 0) return this.reply(`ERROR: Can't find user ${payload}`);
		//
		// prepared.splice(index, 1);
		//
		// // TODO: remake
		// await saveToKv(c, KV_KEYS.users, prepared);

		await this.db.deleteItem(DB_TABLE_NAMES.User, Number(payload));
		await this.reply(`User was deleted\n\n${yaml.dump(allUsers[index])}`);

		return c.router.reload();
	}
}
