import { APP_CONFIG_KEYS } from './constants.js';
import { t } from './helpers.js';

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

	await c.api.sendMessage(c.chatId, welcomeMsg);
	await c.pager.go('home');
}
