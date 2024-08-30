import yaml from 'js-yaml';
import { t } from './helpers.js';
import { PageBase } from '../PageRouter.js';
import { CTX_KEYS, KV_KEYS } from './constants.js';
import { isAdminUser } from './helpers.js';

export class PageConfig extends PageBase {
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

		try {
			await c.ctx[CTX_KEYS.KV].put(KV_KEYS.CONFIG, JSON.stringify(obj));
		} catch (e) {
			return c.reply(`ERROR: ${e}`);
		}

		await c.reply(`Success`);

		// TODO: после реплай будет работать???
		await c.pager.go('home');
	}
}
