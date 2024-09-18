import yaml from 'js-yaml';
import { PageBase } from '../PageRouter.js';
import { t, defineMenu, isUserAdmin } from '../helpers/helpers.js';
import { breakArray } from '../helpers/lib.js';
import {
	USER_KEYS,
	USER_SENT_TO_ADMIN_MSG_DELIMITER,
	DEFAULT_BTN_ITEM_ID,
	HOME_PAGE,
	DB_TABLE_NAMES,
	USER_CFG_KEYS,
} from '../constants.js';

export class UsersManager extends PageBase {
	async renderMenu() {
		const c = this.router.c;

		if (!isUserAdmin(this.me)) return this.go('home');

		const users = await this.db.getAll(DB_TABLE_NAMES.User, {
			[USER_KEYS.id]: true,
			[USER_KEYS.name]: true,
			// it need to check is user admin
			[USER_KEYS.cfg]: true,
		});

		this.text = t(c, 'usersManagerDescr');

		return defineMenu([
			...breakArray(
				users.map((i) => ({
					id: DEFAULT_BTN_ITEM_ID,
					label: i[USER_KEYS.name] + (isUserAdmin(i) ? ' (admin)' : ''),
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
			this.state.editUserId = Number(payload);

			return this.go('user-item');
		}

		switch (btnId) {
			case 'toHomeBtn':
				return this.go(HOME_PAGE);
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;
		const text = c.msg.text;
		let obj;

		if (!text) return this.reply('No text');
		else if (text.indexOf(USER_SENT_TO_ADMIN_MSG_DELIMITER) < 0)
			return this.reply('Wrong message');

		const [, dataStr] = text.split(USER_SENT_TO_ADMIN_MSG_DELIMITER);

		try {
			obj = yaml.load(dataStr);
		} catch (e) {
			return this.reply(`ERROR: can't parse yaml`);
		}

		if (typeof obj[USER_KEYS.tgUserId] !== 'string') {
			return this.reply(`ERROR: wrong data. No tgUserId`);
		}

		const user = {
			...obj,
			cfg: JSON.stringify({
				[USER_CFG_KEYS.authorName]: obj[USER_KEYS.name],
				[USER_CFG_KEYS.permissions]: {
					admin: false,
					editOthersScheduledPub: false,
					deleteOthersScheduledPub: false,
				},
			}),
		};

		await this.db.createItem(DB_TABLE_NAMES.User, user);

		await Promise.all([
			this.reply(`User was created`),
			c.api.sendMessage(user[USER_KEYS.tgChatId], t(c, 'youWasAddedToApp')),
		]);

		return this.reload();
	}
}
