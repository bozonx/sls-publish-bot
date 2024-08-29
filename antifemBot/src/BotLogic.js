import { APP_CONFIG_KEYS } from './constants.js';
import { t } from './helpers.js';
// import { mainMenu } from './screenMainMenu.js';

export async function handleStart(c) {
	const userId = c.msg.from.id;
	const isMainAdmin = userId === Number(c.config.MAIN_ADMIN_TG_USER_ID);
	let welcomeMsg;

	if (
		isMainAdmin ||
		c.config.appCfg[APP_CONFIG_KEYS.ALLOWED_USER_IDS].includes(userId)
	) {
		welcomeMsg = t(c, 'welcomeAgain');
		// go further
	} else {
		const msg = `${t(c, 'youAreNotRegistered')}. userId: ${userId}. userName: ${c.msg.from.first_name || c.msg.from.username}`;

		return c.api.sendMessage(c.chatId, msg);
	}

	c.api.sendMessage(c.chatId, welcomeMsg);
	// await c.reply(welcomeMsg, { reply_markup: c.menu });

	// await mainMenu.init(c);

	await c.pager.go('/');
}

export async function handleButtonCallback(c) {
	// TODO: add site authorization
	console.log(444, c);
	console.log('Unknown button event with payload', c.callbackQuery.data);

	await ctx.answerCallbackQuery({
		text: 'You were curious, indeed!',
	});
}

export async function handleMessage(c) {
	return c.api.sendMessage(c.chatId, `eeee`);
}
