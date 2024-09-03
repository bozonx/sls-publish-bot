import { Bot } from 'grammy';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import {
	CTX_KEYS,
	KV_KEYS,
	PUBLISHING_MINUS_MINUTES,
	PUBLICATION_ADD_NOW_SEC,
	PUBLICATION_TIME_ZONE,
} from './constants.js';
import { loadFromKv, makeIsoDateFromPubState } from './helpers.js';
import { doFullFinalPublicationProcess } from './publishHelpres.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

// When true (between 5 minutes)
// 21:59 minutes = false
// 21:00 minutes = true
// 21:01 minutes = true
// 21:02 minutes = true
// 21:03 minutes = true
// 21:04 minutes = true
// 21:05 minutes = false

export async function handleScheduled(TG_TOKEN, DESTINATION_CHANNEL_ID, KV) {
	let c = {
		ctx: {
			[CTX_KEYS.KV]: KV,
			[CTX_KEYS.DESTINATION_CHANNEL_ID]: DESTINATION_CHANNEL_ID,
		},
	};

	const scheduledItems = await loadFromKv(c, KV_KEYS.scheduled, []);
	const itemsToPublish = scheduledItems.filter((item) => {
		// full date in Moscow
		const itemDate = dayjs(
			makeIsoDateFromPubState(item) + PUBLICATION_TIME_ZONE,
		);

		// TODO: uncomment on prod

		// now in Moscow
		const nowDate = dayjs().tz(PUBLICATION_TIME_ZONE);
		// const nowDate = dayjs('2024-09-03T21:01' + PUBLICATION_TIME_ZONE);
		const nowExtendedDate = nowDate.add(PUBLICATION_ADD_NOW_SEC, 'second');
		// now minus 5 minutes
		const nowMinusShift = nowExtendedDate.subtract(
			PUBLISHING_MINUS_MINUTES,
			'minute',
		);

		return itemDate.isBetween(nowMinusShift, nowExtendedDate);
	});

	// if nothing to publish just do nothing
	if (!itemsToPublish.length) return;

	// TODO: check sort

	// publish only one item per schedule check to not flood
	const sortedItems = itemsToPublish.sort(
		(a, b) =>
			new Date(makeIsoDateFromPubState(a)) -
			new Date(makeIsoDateFromPubState(b)),
	);

	// get closest to current item
	const item = sortedItems[0];
	const bot = new Bot(TG_TOKEN);
	const config = await loadFromKv(c, KV_KEYS.config);

	if (!config) throw new Error(`ERROR: Can't get config`);

	c = {
		...c,
		api: bot.api,
		ctx: {
			...c.ctx,
			config,
		},
	};

	await doFullFinalPublicationProcess(c, item);
}
