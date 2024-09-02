import yaml from 'js-yaml';
import { PageBase } from '../PageRouter.js';
import { KV_KEYS, USER_KEYS } from '../constants.js';
import { t, saveToKv, defineMenu } from '../helpers.js';

export class ConfigManager extends PageBase {
	async renderMenu() {
		const c = this.router.c;

		if (!this.me[USER_KEYS.isAdmin]) return this.router.go('home');

		this.text = t(c, 'editConfigDescr');

		// print current config
		// TODO: put it into code tag
		await c.reply(yaml.dump(this.config));

		return defineMenu([
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		switch (btnId) {
			case 'backBtn':
				return this.router.go('home');
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;
		const rawText = c.msg.text;
		let obj;

		try {
			obj = yaml.load(rawText);
		} catch (e) {
			return c.reply(`ERROR: Can't parse yaml. ${e}`);
		}

		await saveToKv(c, KV_KEYS.config, obj);
		await c.reply(`Success`);

		return this.router.reload();
	}
}
