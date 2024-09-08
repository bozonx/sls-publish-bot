import { makeInviteUserData, makeInitialAdminUser } from './helpers/helpers.js';
import { loadFromKv, loadFromCache, saveToKv } from './io/KVio.js';
import { DbCrud } from './io/DbCrud.js';
import {
	KV_KEYS,
	CTX_KEYS,
	APP_INITIAL_CONFIG,
	USER_SENT_TO_ADMIN_MSG_DELIMITER,
	SESSION_CACHE_NAME,
	DB_TABLE_NAMES,
	USER_KEYS,
} from './constants.js';

export function makeContext(
	MAIN_ADMIN_TG_USER_ID,
	CHAT_OF_ADMINS_ID,
	DESTINATION_CHANNEL_ID,
	PUBLICATION_TIME_ZONE,
	PUBLISHING_MINUS_MINUTES,
	SESSION_STATE_TTL_SEC,
	KV,
	PRISMA_ADAPTER,
	APP_DEBUG,
) {
	return async (c, next) => {
		const userChatIdWithBot = c.msg.chat.id;

		c.ctx = {
			[CTX_KEYS.chatWithBotId]: userChatIdWithBot,
			[CTX_KEYS.KV]: KV,
			[CTX_KEYS.DB_CRUD]: new DbCrud(PRISMA_ADAPTER),
			[CTX_KEYS.CHAT_OF_ADMINS_ID]: CHAT_OF_ADMINS_ID,
			[CTX_KEYS.DESTINATION_CHANNEL_ID]: DESTINATION_CHANNEL_ID,
			[CTX_KEYS.PUBLICATION_TIME_ZONE]: PUBLICATION_TIME_ZONE,
			[CTX_KEYS.PUBLISHING_MINUS_MINUTES]: PUBLISHING_MINUS_MINUTES,
			[CTX_KEYS.SESSION_STATE_TTL_SEC]: SESSION_STATE_TTL_SEC,
			[CTX_KEYS.APP_DEBUG]: APP_DEBUG,
		};

		let appCfg;
		let session;
		let me;

		try {
			[appCfg, session, me] = await Promise.all([
				await loadFromKv(c, KV_KEYS.config),
				await loadFromCache(c, SESSION_CACHE_NAME, userChatIdWithBot),
				await c.ctx[CTX_KEYS.DB_CRUD].getItem(
					DB_TABLE_NAMES.User,
					undefined,
					undefined,
					{
						tgChatId: String(userChatIdWithBot),
					},
				),
			]);
		} catch (e) {
			throw new Error(`Can't load initial data: ${e}`);
		}

		if (!appCfg) {
			appCfg = APP_INITIAL_CONFIG;
			// save initial config to DB on first time app start
			await saveToKv(c, KV_KEYS.config, appCfg);
		}

		// on first initialization write main admin to the DB
		if (!me && c.msg.from.id === Number(MAIN_ADMIN_TG_USER_ID)) {
			const initialAdmin = makeInitialAdminUser(MAIN_ADMIN_TG_USER_ID);

			me = await c.ctx[CTX_KEYS.DB_CRUD].createItem(
				DB_TABLE_NAMES.User,
				initialAdmin,
			);
		}

		c.ctx = {
			...c.ctx,
			[CTX_KEYS.config]: appCfg,
			[CTX_KEYS.session]: session,
			[CTX_KEYS.me]: me && {
				...me,
				[USER_KEYS.cfg]: JSON.parse(me.cfg),
			},
		};

		await next();
	};
}

export async function handleStart(c) {
	// show home page on start command
	if (c.ctx[CTX_KEYS.me]) return c.router.start();
	// else send invite message which user have to send to admin
	const dataStr = JSON.stringify(makeInviteUserData(c));

	return c.reply(
		t(c, 'youAreNotRegistered') +
			`.\n${USER_SENT_TO_ADMIN_MSG_DELIMITER}\n${dataStr}`,
	);
}
