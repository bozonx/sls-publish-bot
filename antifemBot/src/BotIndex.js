import { Bot, session } from 'grammy';
import { handleStart } from './BotLogic.js';
import { KV_CONFIG, APP_INITIAL_CONFIG } from './constants.js';
import { Pager } from './Pager.js';
import { MainMenuPage } from './pageMainMenu.js';
import { PubTextPage } from './pagePubText.js';

export class BotIndex {
	bot;

	constructor(TG_TOKEN, MAIN_ADMIN_TG_USER_ID, KV) {
		this.bot = new Bot(TG_TOKEN);
		this.bot.use(async (c, next) => {
			const appCfgJson = await KV.get(KV_CONFIG);
			let appCfg;

			if (appCfgJson) {
				appCfg = JSON.parse(appCfgJson);
			} else {
				appCfg = APP_INITIAL_CONFIG;

				await KV.put(KV_CONFIG, JSON.stringify(appCfg));
			}

			c.config = {
				MAIN_ADMIN_TG_USER_ID,
				KV,
				appCfg,
			};

			await next();
		});
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
			home: MainMenuPage,
			'pub-text': PubTextPage,
		});

		await pager.init();

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
