import {
	KV_KEYS,
	CTX_KEYS,
	USER_KEYS,
	APP_INITIAL_CONFIG,
} from './constants.js';
import {
	t,
	loadFromKv,
	saveToKv,
	makeUnregisteredMsg,
	isRegisteredUser,
} from './helpers.js';

export function makeContext(MAIN_ADMIN_TG_USER_ID, KV) {
	return async (c, next) => {
		c.ctx = { [CTX_KEYS.KV]: KV };

		let appCfg = await loadFromKv(c, KV_KEYS.CONFIG);
		let users = await loadFromKv(c, KV_KEYS.USERS);

		if (!appCfg) {
			appCfg = APP_INITIAL_CONFIG;
			// save initial config to DB on first time app start
			await saveToKv(c, KV_KEYS.CONFIG, appCfg);
		}

		if (!users) {
			users = [
				{
					[USER_KEYS.ID]: Number(MAIN_ADMIN_TG_USER_ID),
					[USER_KEYS.NAME]: 'Owner',
					[USER_KEYS.IS_ADMIN]: true,
				},
			];
			// save Owner user on first time app start
			await saveToKv(c, KV_KEYS.USERS, users);
		}

		c.ctx = {
			...c.ctx,
			[CTX_KEYS.CONFIG]: appCfg,
			[CTX_KEYS.USERS]: users,
		};

		await next();
	};
}

export async function handleStart(c) {
	if (!isRegisteredUser(c, c.msg.from.id))
		return c.reply(makeUnregisteredMsg(c));

	await c.reply(t(c, 'welcomeAgain'));
	// show home page on start command
	return c.router.go('home');
}
