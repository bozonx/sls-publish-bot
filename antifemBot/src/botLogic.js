import {
	KV_KEYS,
	CTX_KEYS,
	USER_KEYS,
	APP_INITIAL_CONFIG,
	USER_SENT_TO_ADMIN_MSG_DELIMITER,
	SESSION_CACHE_NAME,
	INITIAL_MAIN_USER,
} from './constants.js';
import {
	loadFromKv,
	loadFromCache,
	saveToKv,
	makeUserNameFromMsg,
} from './helpers.js';

export function makeContext(
	MAIN_ADMIN_TG_USER_ID,
	CHAT_OF_ADMINS_ID,
	DESTINATION_CHANNEL_ID,
	KV,
	APP_DEBUG,
) {
	return async (c, next) => {
		const userChatIdWithBot = c.msg.chat.id;

		c.ctx = {
			[CTX_KEYS.chatWithBotId]: userChatIdWithBot,
			[CTX_KEYS.KV]: KV,
			[CTX_KEYS.CHAT_OF_ADMINS_ID]: CHAT_OF_ADMINS_ID,
			[CTX_KEYS.DESTINATION_CHANNEL_ID]: DESTINATION_CHANNEL_ID,
			[CTX_KEYS.APP_DEBUG]: APP_DEBUG,
		};

		let appCfg;
		let users;
		let session;

		try {
			[appCfg, users, session] = await Promise.all([
				await loadFromKv(c, KV_KEYS.config),
				await loadFromKv(c, KV_KEYS.users),
				await loadFromCache(c, SESSION_CACHE_NAME, userChatIdWithBot),
			]);
		} catch (e) {
			throw new Error(`Can't load initial data: ${e}`);
		}

		if (!appCfg) {
			appCfg = APP_INITIAL_CONFIG;
			// save initial config to DB on first time app start
			await saveToKv(c, KV_KEYS.config, appCfg);
		}

		if (!users) {
			// if first time start then add main admin user
			users = [
				{
					[USER_KEYS.id]: Number(MAIN_ADMIN_TG_USER_ID),
					...INITIAL_MAIN_USER,
				},
			];
			// save Owner user on first time app start
			await saveToKv(c, KV_KEYS.users, users);
		}

		const me = users.find((i) => i.id === c.msg.chat.id);

		c.ctx = {
			...c.ctx,
			[CTX_KEYS.config]: appCfg,
			[CTX_KEYS.users]: users,
			[CTX_KEYS.session]: session,
			[CTX_KEYS.me]: me,
		};

		await next();
	};
}

export async function handleStart(c) {
	if (!c.ctx[CTX_KEYS.me]) {
		const userName = makeUserNameFromMsg(c.msg.from) || String(c.msg.from.id);
		const dataStr = JSON.stringify({
			[USER_KEYS.id]: c.msg.from.id,
			[USER_KEYS.name]: userName,
			[USER_KEYS.authorName]: userName,
		});

		return c.reply(
			t(c, 'youAreNotRegistered') +
				`.\n${USER_SENT_TO_ADMIN_MSG_DELIMITER}\n${dataStr}`,
		);
	}
	// show home page on start command
	return c.router.start();
}
