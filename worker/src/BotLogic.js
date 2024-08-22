import { InlineKeyboard } from 'grammy';
import apiUser from './apiUser.js';
import apiInbox from './apiInbox.js';
import locales from './botLocales.js';

const LOGIN_TO_SITE_ACTION = 'LOGIN_TO_SITE_ACTION';

export function t(ctx, msg) {
	let lang = ctx.session?.userData?.lang || ctx.from.language_code;

	if (!(lang in locales)) lang = 'en';

	return locales[lang][msg];
}

export async function handleStart(ctx) {
	let welcomeMsg;
	let userData;
	const userId = ctx.msg.from.id;
	const chatId = ctx.chatId;
	const lang = ctx.from.language_code;

	console.log(1111, apiUser);

	ctx.reply(JSON.stringify(apiUser));

	const respGetUser = await requestWrapper(ctx.config.apiBaseUrl, 'users', `/by-tg-id/${userId}`);

	if (respGetUser.status === 404) {
		// create user
		const respCreateUser = await requestWrapper(ctx.config.apiBaseUrl, 'users', '/', 'POST', {
			tgUserId: String(userId),
			tgChatId: String(chatId),
			lang,
			cfg_yaml: ``,
		});

		if (respCreateUser.status === 201) {
			welcomeMsg = t(ctx, 'welcomeRegistered');
			userData = respCreateUser.data;
		} else {
			return ctx.reply(`Can't create user in db. Status ${respCreateUser.status}, error: ${JSON.stringify(respCreateUser.data)}`);
		}
	} else if (respGetUser.status === 200) {
		userData = respGetUser.data;
		welcomeMsg = t(ctx, 'welcomeAgain');
	} else {
		return ctx.reply(`Can't get user from db. Status ${respGetUser.status}, error: ${JSON.stringify(respGetUser.data)}`);
	}

	ctx.session.userData = userData;

	ctx.reply(welcomeMsg, {
		reply_markup: new InlineKeyboard().text(t(ctx, 'loginToSite'), LOGIN_TO_SITE_ACTION).webApp('web', ctx.config.webAppUrl),
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

		return ctx.reply(`Can't recognize the message. Or unsupported type of message`);
	}

	const respSaveItem = await requestWrapper(ctx.config.apiBaseUrl, 'inbox', '/', 'POST', {
		createdByUserId: userData.id,
		name: itemName,
		dataJson: JSON.stringify(itemData),
	});

	if (respSaveItem.status === 201) {
		ctx.reply(t(ctx, 'itemSavedToInbox'));
	} else {
		return ctx.reply(`Can't save item to db. Status ${respSaveItem.status}, error: ${JSON.stringify(respSaveItem.data)}`);
	}
}

export async function loadUserDataToSession(ctx) {
	const userId = ctx.msg.from.id;

	if (ctx.session.userData) return;

	const respGetUser = await requestWrapper(ctx.config.apiBaseUrl, 'users', `/by-tg-id/${userId}`);

	if (respGetUser.status === 200) {
		ctx.session.userData = respGetUser.data;
	} else {
		return ctx.reply(`Can't get user from db. Status ${respGetUser.status}, error: ${JSON.stringify(respGetUser.data)}`);
	}
}

async function requestWrapper(devApiBaseUrl, table, pathTo, method, body) {
	if (devApiBaseUrl) {
		// dev - use remote request
		const res = await fetch(`${devApiBaseUrl}/${table}${pathTo === '/' ? '' : pathTo}`, {
			method,
			body: body && JSON.stringify(body),
		});

		return {
			status: res.status,
			data: await res.json(),
		};
	} else {
		// prod - use local request
		const apis = {
			user: apiUser,
			inbox: apiInbox,
		};
		const api = apis[table];
		const res = await api.request(pathTo, {
			method,
			body: body && JSON.stringify(body),
		});

		return {
			status: res.status,
			data: await res.json(),
		};
	}
}
