import yaml from 'js-yaml';
import { PageBase } from '../PageRouter.js';
import { KV_KEYS, USER_KEYS } from '../constants.js';
import { t, saveToKv, defineMenu } from '../helpers.js';
import { escapeMdV2 } from '../publishHelpres.js';

export class ConfigManager extends PageBase {
	async renderMenu() {
		const c = this.router.c;

		if (!this.me[USER_KEYS.isAdmin]) return this.router.go('home');

		this.text = t(c, 'editConfigDescr');

		// print current config
		await this.reply('```\n' + escapeMdV2(yaml.dump(this.config)) + '\n```', {
			parse_mode: 'MarkdownV2',
		});

		return defineMenu([
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		switch (btnId) {
			case 'toHomeBtn':
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
			return this.reply(`ERROR: Can't parse yaml. ${e}`);
		}

		await saveToKv(c, KV_KEYS.config, obj);
		await this.reply(`Success`);

		return this.router.reload();
	}
}
