import { Bot } from 'grammy';
import { PrismaClient } from '@prisma/client';
import {
	doFullFinalPublicationProcess,
	convertDbPostToPubState,
} from './tgManageBot/helpers/publishHelpres.js';
import {
	CTX_KEYS,
	PUBLICATION_ADD_NOW_SEC,
	DB_TABLE_NAMES,
	POST_KEYS,
} from './tgManageBot/constants.js';

export async function handleScheduled(TG_TOKEN, TEST_MODE, prismaAdapter) {
	const prisma = new PrismaClient(prismaAdapter && { adapter: prismaAdapter });
	const curTimeMinutes = new Date().getTime() / 1000 / 60;
	// const curTimeMinutes = 28768620; // new Date('2024-09-12T08:00+03:00').getTime() / 1000 / 60
	const [item] = await prisma[DB_TABLE_NAMES.Post].findMany({
		where: {
			[POST_KEYS.pubMsgId]: null,
			// TODO: another name
			[POST_KEYS.pubTimestampMinutes]: {
				// TODO: get from config
				// get items shich are a bit stale
				gte: curTimeMinutes - PUBLISHING_MINUS_MINUTES,
				// get items from very near future
				lte: curTimeMinutes + PUBLICATION_ADD_NOW_SEC / 60,
			},
		},
		// sort from small to high value
		orderBy: [{ [POST_KEYS.pubTimestampMinutes]: 'asc' }],
		take: 1,
	});
	// return if nothing found
	if (!item) return;
	// make bot context stub to load config
	let c = {
		ctx: {
			[CTX_KEYS.KV]: KV,
		},
	};

	// const config = await loadFromKv(c, KV_KEYS.config);
	//
	// if (!config) throw new Error(`ERROR: Can't get config`);

	const bot = new Bot(TG_TOKEN);

	c = {
		...c,
		api: bot.api,
		ctx: {
			...c.ctx,
			// TODO: надо взять из sm
			[CTX_KEYS.DESTINATION_CHANNEL_ID]: DESTINATION_CHANNEL_ID,
			[CTX_KEYS.config]: config,
			[CTX_KEYS.DB_CRUD]: {
				async updateItem(tableName, fullData, where) {
					const { id, ...data } = fullData;

					return prisma[tableName].update({
						where: {
							id,
							...where,
						},
						data,
					});
				},
			},
		},
	};

	// console.log('======= ITEM PUBLISHED', item);

	await doFullFinalPublicationProcess(c, convertDbPostToPubState(item));
}
