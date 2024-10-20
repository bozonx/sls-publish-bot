import yaml from 'js-yaml';
import {
	t,
	makeInviteUserData,
	makeInitialAdminUser,
} from './helpers/helpers.js';
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
	DESTINATION_CHANNEL_NAME,
	PUBLICATION_TIME_ZONE,
	PUBLISHING_MINUS_MINUTES,
	SESSION_STATE_TTL_DAYS,
	KV,
	PRISMA_ADAPTER,
	APP_DEBUG,
) {
	return async (c, next) => {
		if (!c.msg?.chat) return;

		c.ctx = {
			[CTX_KEYS.KV]: KV,
			[CTX_KEYS.DB_CRUD]: new DbCrud(PRISMA_ADAPTER),
			[CTX_KEYS.MAIN_ADMIN_TG_USER_ID]: MAIN_ADMIN_TG_USER_ID,
			[CTX_KEYS.CHAT_OF_ADMINS_ID]: CHAT_OF_ADMINS_ID,
			[CTX_KEYS.DESTINATION_CHANNEL_ID]: DESTINATION_CHANNEL_ID,
			[CTX_KEYS.DESTINATION_CHANNEL_NAME]: DESTINATION_CHANNEL_NAME,
			[CTX_KEYS.PUBLICATION_TIME_ZONE]: PUBLICATION_TIME_ZONE,
			[CTX_KEYS.PUBLISHING_MINUS_MINUTES]: PUBLISHING_MINUS_MINUTES,
			[CTX_KEYS.SESSION_STATE_TTL_DAYS]: SESSION_STATE_TTL_DAYS,
			[CTX_KEYS.APP_DEBUG]: APP_DEBUG,
		};

		const chatId = c.msg.chat.id;
		let appCfg;
		let session;
		let me;

		try {
			[appCfg, session, me] = await Promise.all([
				loadFromKv(c, KV_KEYS.config),
				loadFromCache(c, SESSION_CACHE_NAME, chatId),
				// load me
				c.ctx[CTX_KEYS.DB_CRUD].getItem(
					DB_TABLE_NAMES.User,
					undefined,
					undefined,
					{
						tgChatId: String(chatId),
					},
				),
			]);
		} catch (e) {
			throw new Error(`Can't load initial data: ${e}`);
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
	// save initial config to DB on first time app start
	if (!c.ctx[CTX_KEYS.config]) {
		c.ctx[CTX_KEYS.config] = APP_INITIAL_CONFIG;

		await saveToKv(c, KV_KEYS.config, c.ctx[CTX_KEYS.config]);
	}
	// show home page on start command
	if (c.ctx[CTX_KEYS.me]) return c.router.start();
	// else on first initialization write main admin to the DB
	else if (c.msg?.from.id === Number(c.ctx[CTX_KEYS.MAIN_ADMIN_TG_USER_ID])) {
		const initialAdmin = makeInitialAdminUser(
			c.ctx[CTX_KEYS.MAIN_ADMIN_TG_USER_ID],
		);

		c.ctx[CTX_KEYS.me] = await c.ctx[CTX_KEYS.DB_CRUD].createItem(
			DB_TABLE_NAMES.User,
			initialAdmin,
		);

		return c.router.start();
	}
	// else send invite message which user have to send to admin
	const dataStr = yaml.dump(makeInviteUserData(c));

	return Promise.all([
		// send message to the main admin
		c.api.sendMessage(
			c.ctx[CTX_KEYS.MAIN_ADMIN_TG_USER_ID],
			`New user pressed start:\n${USER_SENT_TO_ADMIN_MSG_DELIMITER}\n${dataStr}`,
		),
		c.reply(t(c, 'youAreNotRegistered')),
	]);
}
