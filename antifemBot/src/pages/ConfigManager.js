import yaml from 'js-yaml';
import { PageBase } from '../PageRouter.js';
import { CTX_KEYS, KV_KEYS } from '../constants.js';
import { t, isAdminUser, saveDataToKv, defineMenu } from '../helpers.js';

export class ConfigManager extends PageBase {
	async mount() {
		const c = this.pager.c;

		if (!isAdminUser(c, c.msg.chat.id)) return this.pager.go('home', null);

		this.text = t(c, 'editConfigDescr');
		this.menu = defineMenu([
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.pager.go('home', null),
				},
			],
		]);

		// TODO: put it into code tag
		return c.reply(yaml.dump(c.ctx[CTX_KEYS.APP_CFG]));
	}

	async message() {
		const c = this.pager.c;
		const rawText = c.msg.text;
		let obj;

		try {
			obj = yaml.load(rawText);
		} catch (e) {
			return c.reply(`ERROR: ${e}`);
		}

		await saveDataToKv(c, KV_KEYS.CONFIG, obj);
		await c.reply(`Success`);
		// TODO: после реплай будет работать???
		await c.pager.reload();
	}
}
