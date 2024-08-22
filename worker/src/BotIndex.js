import { Bot, InlineKeyboard, session } from 'grammy';
import locales from './botLocales.js';

// await bot.api.sendMessage(12345, "Hello!");

function t(ctx, msg) {
	let lang = ctx.session?.userData?.lang || ctx.from.language_code;

	if (!(lang in locales)) lang = 'en';

	return locales[lang][msg];
}

export class BotIndex {
	bot;

	constructor(token, webAppUrl, apiBaseUrl) {
		this.bot = new Bot(token);

		this.bot.use(
			session({
				// Stores data per user.
				getSessionKey: (ctx) => {
					// Give every user their personal session storage
					// (will be shared across groups and in their private chat)
					return ctx.from?.id.toString();
				},
				initial: () => ({ userData: null }),
			}),
		);
		this.bot.use(async (ctx, next) => {
			ctx.config = {
				webAppUrl,
				apiBaseUrl,
			};
			// Run remaining handlers.
			await next();
		});
	}

	async init() {
		this.bot.command('start', async (ctx) => {
			let welcomeMsg;
			let userData;
			const userId = ctx.msg.from.id;
			const chatId = ctx.chatId;
			const lang = ctx.from.language_code;

			const respGetUser = await fetch(`${ctx.config.apiBaseUrl}/users/by-tg-id/${userId}`);

			if (respGetUser.status === 404) {
				// create user
				const respCreateUser = await fetch(`${ctx.config.apiBaseUrl}/users`, {
					method: 'POST',
					body: JSON.stringify({
						tgUserId: String(userId),
						tgChatId: String(chatId),
						lang,
						cfg_yaml: ``,
					}),
				});

				if (respCreateUser.status === 201) {
					welcomeMsg = t(ctx, 'welcomeRegistered');
					userData = await respCreateUser.json();
				} else {
					return ctx.reply(`Can't create user in db: ${await respCreateUser.text()}`);
				}
			} else if (respGetUser.status === 200) {
				userData = await respGetUser.json();
				welcomeMsg = t(ctx, 'welcomeAgain');
			} else {
				return ctx.reply(`Can't get user from db: ${await respGetUser.text()}`);
			}

			ctx.session.userData = userData;

			ctx.reply(welcomeMsg, {
				reply_markup: new InlineKeyboard().text('« 1', 'first').webApp('web', ctx.config.webAppUrl),
			});
		});

		// Wait for click events with specific callback data.
		// this.bot.callbackQuery('click-payload', async (ctx) => {
		// 	console.log(111, ctx);
		// 	await ctx.answerCallbackQuery({
		// 		text: 'You were curious, indeed!',
		// 	});
		// });

		this.bot.on('callback_query:data', async (ctx) => {
			console.log(444, ctx.session.userData);
			console.log('Unknown button event with payload', ctx.callbackQuery.data);
			await ctx.answerCallbackQuery({
				text: 'You were curious, indeed!',
			});
		});

		this.bot.on('message', async (ctx) => {
			let itemName;
			let itemData;

			await this.loadUserDataToSession(ctx);

			if (!ctx.session.userData) return;

			const userData = ctx.session.userData;

			if (ctx.msg.text) {
				// text message
				itemName = ctx.msg.text.substring(0, 80);
				itemData = { text: ctx.msg.text };
			} else {
				// TODO: add other types
				console.log(111, ctx);
			}

			const respSaveItem = await fetch(`${ctx.config.apiBaseUrl}/inbox`, {
				method: 'POST',
				body: JSON.stringify({
					createdByUserId: userData.id,
					name: itemName,
					dataJson: JSON.stringify(itemData),
				}),
			});

			if (respSaveItem.status === 201) {
				ctx.reply(t(ctx, 'itemSavedToInbox'));
			} else {
				return ctx.reply(`Can't save item to db: ${await respSaveItem.text()}`);
			}
		});
	}

	async loadUserDataToSession(ctx) {
		const userId = ctx.msg.from.id;

		if (ctx.session.userData) return;

		const respGetUser = await fetch(`${ctx.config.apiBaseUrl}/users/by-tg-id/${userId}`);

		if (respGetUser.status === 200) {
			ctx.session.userData = await respGetUser.json();
		} else {
			return ctx.reply(`Can't get user from db: ${await respGetUser.text()}`);
		}
	}

	/**
	 * This is only for dev
	 */
	botStart() {
		this.bot.start();
	}
}
