import {
	KV_KEYS,
	CTX_KEYS,
	USER_KEYS,
	APP_INITIAL_CONFIG,
} from './constants.js';
import {
	t,
	loadDataFromKv,
	makeUnregisteredMsg,
	isRegisteredUser,
} from './helpers.js';

export async function handleStart(c) {
	if (!isRegisteredUser(c, c.msg.from.id)) {
		return c.api.sendMessage(c.chatId, makeUnregisteredMsg(c));
	}

	await c.api.sendMessage(c.chatId, t(c, 'welcomeAgain'));
	// show home page on start command
	await c.pager.go('home');
}

export async function prepareKvAndConfig(c, MAIN_ADMIN_TG_USER_ID) {
	let appCfg = await loadDataFromKv(c, KV_KEYS.CONFIG, APP_INITIAL_CONFIG);
	let users = await loadDataFromKv(c, KV_KEYS.USERS);

	if (!appCfg) {
		appCfg = APP_INITIAL_CONFIG;

		await c.ctx[CTX_KEYS.KV].put(KV_KEYS.CONFIG, JSON.stringify(appCfg));
	}

	if (!users) {
		users = [
			{
				[USER_KEYS.ID]: Number(MAIN_ADMIN_TG_USER_ID),
				[USER_KEYS.NAME]: 'Owner',
				[USER_KEYS.IS_ADMIN]: true,
			},
		];

		await c.ctx[CTX_KEYS.KV].put(KV_KEYS.USERS, JSON.stringify(users));
	}

	return {
		[CTX_KEYS.APP_CFG]: appCfg,
		[CTX_KEYS.USERS]: users,
	};
}
