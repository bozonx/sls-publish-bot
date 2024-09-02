import { Bot } from 'grammy';
import { CTX_KEYS, KV_KEYS } from './constants.js';
import { loadFromKvDirect, saveToKv } from './helpers.js';

export async function handleScheduled(TG_TOKEN, DESTINATION_CHANNEL_ID, KV) {
	this.bot = new Bot(TG_TOKEN);

	const c = {
		ctx: {
			[CTX_KEYS.KV]: KV,
		},
	};

	const scheduledItems = await loadFromKvDirect(KV, KV_KEYS.scheduled);
	const toPublish = scheduledItems.filter((item) => {
		//
	});

	// if nothing to publish just do nothing
	if (!toPublish) return;

	await this.bot.api.sendMessage(DESTINATION_CHANNEL_ID, {});
}
