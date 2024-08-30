import { t } from './helpers.js';
import { PageBase } from '../PageRouter.js';
import { isAdminUser } from './helpers.js';

export class PageHome extends PageBase {
	async mount() {
		const c = this.pager.c;
		const isAdmin = isAdminUser(c.msg.chat.id);

		this.text = t(c, 'homeDescr');

		this.menu = [[[t(c, 'manageTagsBtn'), () => c.pager.go('tag-manager')]]];

		if (isAdmin) {
			this.menu = [
				...this.menu,
				[t(c, 'editConfigBtn'), () => c.pager.go('config')],
				[t(c, 'manageUsersBtn'), () => c.pager.go('users')],
			];
		}
	}

	async message() {
		const c = this.pager.c;
		let state;

		// console.log(2222, c.msg);

		// TODO: captions parse to md with entities
		// TODO: media group

		if (c.msg.video) {
			state = {
				text: c.msg.caption,
				video: c.msg.video,
			};
		} else if (c.msg.photo) {
			state = {
				text: c.msg.caption,
				photo: c.msg.photo,
			};
		} else if (c.msg.text) {
			state = {
				text: c.msg.text,
			};
		} else {
			return c.reply('ERROR: Wrong type of post');
		}

		return c.pager.go('pub-author', state);
	}
}
