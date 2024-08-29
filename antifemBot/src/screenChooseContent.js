import { InlineKeyboard, Keyboard } from 'grammy';
import { t } from './helpers.js';

const PUBLISH_POST_ACTION = 'PUBLISH_POST_ACTION';
const EDIT_CONFIG_ACTION = 'EDIT_CONFIG_ACTION';

export function chooseContentRoute(router) {
	router
		.route('main-menu', async (c) => {
			c.reply('rrrr');

			console.log(111, c);
			// c.session.route = 'other-key';

			/* ... */
		})
		.on('message:text', async (c) => {
			console.log(222, c);
			c.reply('tttt');
		});
}

export async function startChooseContent(c) {
	const isMainAdmin = c.msg.from.id === Number(c.config.MAIN_ADMIN_TG_USER_ID);
	const keyboard = new Keyboard()
		.placeholder('pppp')
		.text(t(c, 'publishPost'), PUBLISH_POST_ACTION);

	if (isMainAdmin) {
		keyboard.row().text(t(c, 'editConfig'), EDIT_CONFIG_ACTION);
	}

	const { message_id } = await c.api.sendMessage(c.chatId, t(c, 'mainMenu'), {
		reply_markup: keyboard,
		// reply_markup: new InlineKeyboard()
		// .login('login', 'https://p-libereco.org')
		// .url('login', 'https://p-libereco.org')
		// .text(t(ctx, 'loginToSite'), LOGIN_TO_SITE_ACTION)
		// .webApp('web', ctx.config.webAppUrl),
	});

	c.session.route = 'main-menu';
}
