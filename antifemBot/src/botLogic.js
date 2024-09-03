import {
	KV_KEYS,
	CTX_KEYS,
	USER_KEYS,
	APP_INITIAL_CONFIG,
	USER_SENT_TO_ADMIN_MSG_DELIMITER,
} from './constants.js';
import { loadFromKv, saveToKv } from './helpers.js';

export function makeContext(
	MAIN_ADMIN_TG_USER_ID,
	CHAT_OF_ADMINS_ID,
	DESTINATION_CHANNEL_ID,
	KV,
) {
	return async (c, next) => {
		c.ctx = {
			// TODO: проверить всегда ли так
			[CTX_KEYS.chatWithBotId]: c.msg.chat.id,
			[CTX_KEYS.KV]: KV,
			[CTX_KEYS.CHAT_OF_ADMINS_ID]: CHAT_OF_ADMINS_ID,
			[CTX_KEYS.DESTINATION_CHANNEL_ID]: DESTINATION_CHANNEL_ID,
		};

		let appCfg;
		let users;

		try {
			[appCfg, users] = await Promise.all([
				await loadFromKv(c, KV_KEYS.config),
				await loadFromKv(c, KV_KEYS.users),
				// TODO: можно ещё и сессию сразу загрузить
			]);
		} catch (e) {
			throw new Error(`Can't load initial data: ${e}`);
		}

		// let appCfg = await loadFromKv(c, KV_KEYS.config);
		// let users = await loadFromKv(c, KV_KEYS.users);

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
					[USER_KEYS.name]: 'Owner',
					[USER_KEYS.isAdmin]: true,
					[USER_KEYS.authorName]: 'Owner Author',
				},
			];
			// save Owner user on first time app start
			await saveToKv(c, KV_KEYS.users, users);
		}

		const me = users.find((i) => i.id === c.msg.chat.id);

		// if (!me) throw new Error(`ERROR: Can't find current user`);

		c.ctx = {
			...c.ctx,
			[CTX_KEYS.config]: appCfg,
			[CTX_KEYS.users]: users,
			[CTX_KEYS.me]: me,
		};

		await next();
	};
}

export async function handleStart(c) {
	if (!c.ctx[CTX_KEYS.me]) {
		const dataStr = JSON.stringify({
			[USER_KEYS.id]: c.msg.from.id,
			// TODO: add last name
			[USER_KEYS.name]: c.msg.from.first_name || c.msg.from.username,
		});

		return c.reply(
			t(c, 'youAreNotRegistered') +
			`.\n${USER_SENT_TO_ADMIN_MSG_DELIMITER}\n${dataStr}`,
		);
	}
	// show home page on start command
	return c.router.start();
}
