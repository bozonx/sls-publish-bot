import grammyRouter from '@grammyjs/router';
import { Bot, session } from 'grammy';
import { Menu } from '@grammyjs/menu';
import {
	handleStart,
	handleMessage,
	handleButtonCallback,
} from './BotLogic.js';
import { KV_CONFIG, APP_INITIAL_CONFIG } from './constants.js';
import { MainMenuPage } from './screenMainMenu.js';
import { Pager } from './pageMiddleware.js';

export class BotIndex {
	bot;

	constructor(TG_TOKEN, MAIN_ADMIN_TG_USER_ID, KV) {
		this.bot = new Bot(TG_TOKEN);

		// const menu = new Menu('index').text('^', (ctx) => ctx.reply('Forward!'));

		// this.bot.use(menu);

		this.bot.use(async (c, next) => {
			const appCfgJson = await KV.get(KV_CONFIG);
			let appCfg;

			if (appCfgJson) {
				appCfg = JSON.parse(appCfgJson);
			} else {
				appCfg = APP_INITIAL_CONFIG;

				await KV.put(KV_CONFIG, JSON.stringify(appCfg));
			}

			// c.menu = menu;

			c.config = {
				MAIN_ADMIN_TG_USER_ID,
				KV,
				appCfg,
			};

			await next();
		});

		// this.bot.use(async (c, next) => {
		// 	const menu = new Menu('movements')
		// 		.text('^', (ctx) => ctx.reply('Forward!'))
		// 		.row()
		// 		.text('<', (ctx) => ctx.reply('Left!'))
		// 		.text('>', (ctx) => ctx.reply('Right!'))
		// 		.row()
		// 		.text('v', (ctx) => ctx.reply('Backwards!'));
		//
		// 	c.menu = menu;
		//
		// 	console.log(111111111, 'once', menu);
		//
		// 	return menu(c, next);
		// });
	}

	async init() {
		this.bot.use(
			session({
				// Stores data per user.
				getSessionKey: (ctx) => {
					// Give every user their personal session storage
					// (will be shared across groups and in their private chat)
					return ctx.from?.id.toString();
				},
				initial: () => ({ route: null }),
			}),
		);

		const pager = new Pager({
			'/': MainMenuPage,
		});

		this.bot.use(pager.middleware);

		this.bot.command('start', handleStart);
		this.bot.on('callback_query:data', pager._handleQueryData);
		this.bot.on('message', pager._handleMessage);

		// const router = new grammyRouter.Router((c) => c.session.route);
		//
		// mainMenu.route(router);
		//
		// router.otherwise((c) => {
		// 	// TODO: use async send messate
		// 	c.reply('ERROR: Unknown route');
		// });
		//
		// this.bot.use(router);
	}

	/**
	 * This is only for dev
	 */
	botStart() {
		this.bot.start();
	}
}
