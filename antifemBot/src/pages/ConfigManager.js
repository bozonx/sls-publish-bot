import yaml from 'js-yaml';
import { PageBase } from '../PageRouter.js';
import { KV_KEYS } from '../constants.js';
import { t, saveToKv, defineMenu } from '../helpers.js';

export class ConfigManager extends PageBase {
	async mount() {
		const c = this.router.c;

		if (!this.me[USER_KEYS.isAdmin]) return this.router.go('home');

		this.text = t(c, 'editConfigDescr');
		this.menu = defineMenu([
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.router.go('home'),
				},
			],
		]);

		// TODO: put it into code tag
		return c.reply(yaml.dump(this.config));
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
