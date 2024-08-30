import yaml from 'js-yaml';
import { t } from './helpers.js';
import { PageBase } from '../PageRouter.js';
import { CTX_KEYS, KV_KEYS } from './constants.js';
import { isAdminUser, saveDataToKv } from './helpers.js';

export class ConfigManager extends PageBase {
	async mount() {
		const c = this.pager.c;
		const isAdmin = isAdminUser(c.msg.chat.id);

		if (!isAdmin) return this.pager.go('home');

		this.text = t(c, 'editConfigMenuText');
		this.menu = [[[t(c, 'toHome'), () => this.pager.go('home')]]];

		// TODO: put it into code tag
		return c.reply(yaml.dump(c.ctx[CTX_KEYS.CONFIG]));
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

		await saveDataToKv(this.c, KV_KEYS.CONFIG, obj);
		await c.reply(`Success`);
		// TODO: после реплай будет работать???
		await c.pager.reload();
	}
}
