export default {
	en: {
		welcomeRegistered: `You've just been registered.Welcome`,
		welcomeAgain: 'Welcome again!',
		itemSavedToInbox: 'Item was saved to Inbox',
		loginToSite: 'Login to site',
	},
	ru: {
		welcomeRegistered: 'Вы только что были зарегистрированы. Добро пожаловать!',
		welcomeAgain: 'И снова здравствуйте!',
		itemSavedToInbox: 'Сохранено во входящие',
		loginToSite: 'Войти на сайт',
	},
};

import { InlineKeyboard } from 'grammy';
import apiTgBot from './apiTgBot.js';
import locales from './botLocales.js';

const LOGIN_TO_SITE_ACTION = 'LOGIN_TO_SITE_ACTION';

export function t(ctx, msg) {
	let lang = ctx.session?.userData?.lang || ctx.from.language_code;

	if (!(lang in locales)) lang = 'en';

	return locales[lang][msg] || msg;
}

export async function handleStart(ctx) {
	let welcomeMsg;
	let userData;
	const userId = ctx.msg.from.id;
	const chatId = ctx.chatId;
	const lang = ctx.from.language_code;

	const respGetUser = await requestWrapper(
		ctx.config.apiBaseUrlOrDb,
		`/users/by-tg-id/${userId}?code=${ctx.config.apiCallLocalCode}`,
	);

	if (respGetUser.status === 404) {
		// create user
		const respCreateUser = await requestWrapper(
			ctx.config.apiBaseUrlOrDb,
			`/users?code=${ctx.config.apiCallLocalCode}`,
			'POST',
			{
				tgUserId: String(userId),
				tgChatId: String(chatId),
				lang,
				cfg: '',
			},
		);

		if (respCreateUser.status === 201) {
			welcomeMsg = t(ctx, 'welcomeRegistered');
			userData = respCreateUser.data;
		} else {
			return ctx.api.sendMessage(
				chatId,
				`Can't create user in db. Status ${respCreateUser.status}, error: ${JSON.stringify(respCreateUser.data)}`,
			);
		}
	} else if (respGetUser.status === 200) {
		userData = respGetUser.data;
		welcomeMsg = t(ctx, 'welcomeAgain');
	} else {
		return ctx.api.sendMessage(
			chatId,
			`Can't get user from db. Status ${respGetUser.status}, error: ${JSON.stringify(respGetUser.data)}`,
		);
	}

	ctx.session.userData = userData;

	return ctx.api.sendMessage(chatId, welcomeMsg, {
		reply_markup: new InlineKeyboard()
			// .login('login', 'https://p-libereco.org')
			.url('login', 'https://p-libereco.org')
			.text(t(ctx, 'loginToSite'), LOGIN_TO_SITE_ACTION)
			.webApp('web', ctx.config.webAppUrl),
	});
}

export async function handleButtonCallback(ctx) {
	// TODO: add site authorization
	console.log(444, ctx);
	console.log('Unknown button event with payload', ctx.callbackQuery.data);
	await ctx.answerCallbackQuery({
		text: 'You were curious, indeed!',
	});
}

export async function handleMessage(ctx) {
	let itemName;
	let itemData;

	await loadUserDataToSession(ctx);

	const userData = ctx.session.userData;

	if (!userData) return;

	if (ctx.msg.text) {
		// text message
		itemName = ctx.msg.text.substring(0, 80);
		itemData = { text: ctx.msg.text };
	} else {
		// TODO: add other types
		console.log(111, ctx);

		return ctx.api.sendMessage(
			ctx.chatId,
			`Can't recognize the message. Or unsupported type of message`,
		);
	}

	const respSaveItem = await requestWrapper(
		ctx.config.apiBaseUrlOrDb,
		`/inbox?code=${ctx.config.apiCallLocalCode}`,
		'POST',
		{
			createdByUserId: userData.id,
			name: itemName,
			dataJson: JSON.stringify(itemData),
		},
	);

	if (respSaveItem.status === 201) {
		return ctx.api.sendMessage(ctx.chatId, t(ctx, 'itemSavedToInbox'));
	} else {
		return ctx.api.sendMessage(
			ctx.chatId,
			`Can't save item to db. Status ${respSaveItem.status}, error: ${JSON.stringify(respSaveItem.data)}`,
		);
	}
}

export async function loadUserDataToSession(ctx) {
	const userId = ctx.msg.from.id;

	if (ctx.session.userData) return;

	const respGetUser = await requestWrapper(
		ctx.config.apiBaseUrlOrDb,
		`/users/by-tg-id/${userId}?code=${ctx.config.apiCallLocalCode}`,
	);

	if (respGetUser.status === 200) {
		ctx.session.userData = respGetUser.data;
	} else {
		return ctx.api.sendMessage(
			ctx.chatId,
			`Can't get user from db. Status ${respGetUser.status}, error: ${JSON.stringify(respGetUser.data)}`,
		);
	}
}

async function requestWrapper(apiBaseUrlOrDb, pathTo, method, bodyObj) {
	const body = bodyObj && JSON.stringify(bodyObj);

	if (typeof apiBaseUrlOrDb === 'string') {
		// dev - use remote request
		const res = await fetch(
			`${apiBaseUrlOrDb}/bot${pathTo === '/' ? '' : pathTo}`,
			{
				method,
				body,
			},
		);

		return {
			status: res.status,
			data: await res.json(),
		};
	} else {
		// prod - use local request

		// const apis = {
		// 	users: apiUser,
		// 	inbox: apiInbox,
		// };
		// const api = apis[table];
		const req = new Request(`http://localhost${pathTo}`, { method, body });
		const res = await apiTgBot.fetch(req, { DB: apiBaseUrlOrDb }, {});

		return {
			status: res.status,
			data: await res.json(),
		};
	}
}
