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

		// TODO: запрашивать одновремено
		let appCfg = await loadFromKv(c, KV_KEYS.config);
		let users = await loadFromKv(c, KV_KEYS.users);

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
				},
			];
			// save Owner user on first time app start
			await saveToKv(c, KV_KEYS.users, users);
		}

		c.ctx = {
			...c.ctx,
			[CTX_KEYS.config]: appCfg,
			[CTX_KEYS.users]: users,
		};

		await next();
	};
}

export async function handleStart(c) {
	if (!isRegisteredUser(c, c.msg.from.id))
		return c.reply(makeUnregisteredMsg(c));
	// show home page on start command
	return c.router.go('home');
}
