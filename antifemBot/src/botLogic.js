import { KV_KEYS, CTX_KEYS, USER_KEYS } from './constants.js';
import { t, makeUnregisteredMsg, isRegisteredUser } from './helpers.js';

export async function handleStart(c) {
	const userId = c.msg.from.id;

	if (!isRegisteredUser(c, userId)) {
		return c.api.sendMessage(c.chatId, makeUnregisteredMsg(c));
	}

	await c.api.sendMessage(c.chatId, t(c, 'welcomeAgain'));
	await c.pager.go('home');
}

export async function prepareKvAndConfig(MAIN_ADMIN_TG_USER_ID, KV) {
	let appCfg = await loadDataFromKv(c, KV_KEYS.CONFIG, APP_INITIAL_CONFIG);
	let users = await loadDataFromKv(c, KV_KEYS.USERS);

	if (!appCfg) {
		appCfg = APP_INITIAL_CONFIG;

		await KV.put(KV_KEYS.CONFIG, JSON.stringify(appCfg));
	}

	if (!users) {
		users = [
			{
				[USER_KEYS.ID]: MAIN_ADMIN_TG_USER_ID,
				[USER_KEYS.NAME]: 'Owner',
				[USER_KEYS.IS_ADMIN]: true,
			},
		];

		await KV.put(KV_KEYS.USERS, JSON.stringify(users));
	}

	return {
		[CTX_KEYS.KV]: KV,
		[CTX_KEYS.APP_CFG]: appCfg,
		[CTX_KEYS.USERS]: users,
	};
}
