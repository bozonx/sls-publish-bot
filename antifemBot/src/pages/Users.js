import yaml from 'js-yaml';
import { t } from './helpers.js';
import { PageBase } from './Pager.js';
import { KV_CONFIG } from './constants.js';

export class PageUsers extends PageBase {
	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		const isMainAdmin =
			c.msg.chat.id === Number(c.config.MAIN_ADMIN_TG_USER_ID);

		if (!isMainAdmin) {
			// TODO: написать сообщение
			c.pager.go('home');
		}

		this.text = t(c, 'editConfigMenuText');

		this.menu = [
			// row
			[
				// button
				[
					t(c, 'toHome'),
					(c) => {
						c.pager.go('home');
					},
				],
			],
		];

		await c.api.sendMessage(c.chatId, yaml.dump(c.config.appCfg));
	}

	async unmount(c) {
		//
	}

	async message(c) {
		const rawText = c.msg.text;
		let obj;

		try {
			obj = yaml.load(rawText);
		} catch (e) {
			return c.reply(`ERROR: ${e}`);
		}

		try {
			await c.config.KV.put(KV_CONFIG, JSON.stringify(obj));
		} catch (e) {
			return c.reply(`ERROR: ${e}`);
		}

		c.reply(`Success`);

		c.pager.go('home');
	}
}
