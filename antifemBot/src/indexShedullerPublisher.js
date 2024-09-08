import { Bot } from 'grammy';
import { PrismaClient } from '@prisma/client';
import {
	doFullFinalPublicationProcess,
	convertDbScheduledToPubState,
} from './helpers/publishHelpres.js';
import { loadFromKv } from './io/KVio.js';
import {
	dateSubtractMinutes,
	dateAddSeconds,
	makeIsoDateFromPubState,
} from './helpers/dateTimeHelpers.js';
import {
	CTX_KEYS,
	KV_KEYS,
	PUBLISHING_MINUS_MINUTES,
	PUBLICATION_ADD_NOW_SEC,
	PUBLICATION_TIME_ZONE,
	DB_TABLE_NAMES,
	PUB_SCHEDULED_KEYS,
} from './constants.js';

export async function handleScheduled(
	TG_TOKEN,
	DESTINATION_CHANNEL_ID,
	KV,
	prismaAdapter,
) {
	const prisma = new PrismaClient(prismaAdapter && { adapter: prismaAdapter });
	const curTime = new Date().getTime() / 1000 / 60;
	// const curTime = 28761420; // 2024-09-07T08:00+03:00
	const found = await prisma[DB_TABLE_NAMES.PubScheduled].findMany({
		where: {
			[PUB_SCHEDULED_KEYS.pubTimestampMinutes]: {
				gte: curTime - PUBLISHING_MINUS_MINUTES,
				lte: curTime + PUBLICATION_ADD_NOW_SEC / 60,
			},
		},
		// sort from small to high value
		orderBy: [{ [PUB_SCHEDULED_KEYS.pubTimestampMinutes]: 'asc' }],
	});

	// return if nothing found
	if (!found.length) return;

	const item = found[0];
	let c = {
		ctx: {
			[CTX_KEYS.KV]: KV,
			[CTX_KEYS.DESTINATION_CHANNEL_ID]: DESTINATION_CHANNEL_ID,
		},
	};

	// const scheduledItems = await loadFromKv(c, KV_KEYS.scheduled, []);
	// const item = findItemToPublish(scheduledItems);
	// just do nothing if nothing found
	// if (!item) return;

	const bot = new Bot(TG_TOKEN);
	const config = await loadFromKv(c, KV_KEYS.config);

	if (!config) throw new Error(`ERROR: Can't get config`);

	c = {
		...c,
		api: bot.api,
		ctx: {
			...c.ctx,
			[CTX_KEYS.config]: config,
			[CTX_KEYS.DB_CRUD]: {
				async deleteItem(tableName, itemId) {
					return await prisma[tableName].delete({
						where: {
							id: itemId,
						},
					});
				},
			},
		},
	};

	console.log('======= ITEM PUBLISHED', item);

	await doFullFinalPublicationProcess(c, convertDbScheduledToPubState(item));
}

// When true (between 5 minutes) - now is 10:00
// 09:54 false
// 09:55 true
// 09:56 true
// 09:57 true
// 09:58 true
// 09:59 true
// 10:00 true
// 10:01 false
// function findItemToPublish(allItems) {
// 	const itemsToPublish = allItems.filter((item) => {
// 		// uncomment on prod
// 		const nowDateTs = new Date().getTime();
// 		// uncomment on dev
// 		// const nowDateTs = new Date(
// 		// 	'2024-09-03T10:00' + PUBLICATION_TIME_ZONE,
// 		// ).getTime();
// 		// full date in Moscow
// 		const itemTsMs = new Date(
// 			makeIsoDateFromPubState(item) + PUBLICATION_TIME_ZONE,
// 		).getTime();
// 		const extendedNowTsMs = dateAddSeconds(nowDateTs, PUBLICATION_ADD_NOW_SEC);
// 		const nowMinusShiftTsMs = dateSubtractMinutes(
// 			nowDateTs,
// 			PUBLISHING_MINUS_MINUTES,
// 		);
//
// 		return itemTsMs >= nowMinusShiftTsMs && itemTsMs <= extendedNowTsMs;
// 	});
//
// 	// if nothing to publish just do nothing
// 	if (!itemsToPublish.length) return;
//
// 	// publish only one item per schedule check to not flood
// 	const sortedItems = itemsToPublish.sort(
// 		(a, b) =>
// 			new Date(makeIsoDateFromPubState(a)) -
// 			new Date(makeIsoDateFromPubState(b)),
// 	);
//
// 	// get closest to current item
// 	return sortedItems[0];
// }
