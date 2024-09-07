import { parseJsonSafelly } from '../helpers/helpers.js';
import { CTX_KEYS, CACHE_PREFIX, USER_KEYS } from '../constants.js';

export async function loadFromKv(c, key, defaultValue) {
	let resStr;

	try {
		resStr = await c.ctx[CTX_KEYS.KV].get(key);
	} catch (e) {
		throw new Error(`ERROR: Can't load value of "${key}": ${e}`);
	}

	const parsed = parseJsonSafelly(resStr);

	// TODO: а оно не null возвращает?

	return typeof parsed === 'undefined' ? defaultValue : parsed;
}

export async function saveToKv(c, key, value) {
	const valueStr = JSON.stringify(value);

	// TODO: если передан undefined то значение очистится???
	try {
		return c.ctx[CTX_KEYS.KV].put(key, valueStr);
	} catch (e) {
		throw new Error(`ERROR: Can't save value ${valueStr} of "${key}": ${e}`);
	}
}

export async function loadFromCache(c, key, specifiedUserId) {
	const currentUserId = specifiedUserId || c.ctx[CTX_KEYS.me][USER_KEYS.id];
	const fullKey = `${CACHE_PREFIX}|${currentUserId}|${key}`;
	let resStr;

	try {
		resStr = await c.ctx[CTX_KEYS.KV].get(fullKey);
	} catch (e) {
		throw new Error(`ERROR: Can't load value from cache "${key}": ${e}`);
	}

	return parseJsonSafelly(resStr);
}

// on expire the key-value pair will be deleted
export async function saveToCache(c, key, value, expireFromNowSec) {
	const currentUserId = c.ctx[CTX_KEYS.me][USER_KEYS.id];
	const fullKey = `${CACHE_PREFIX}|${currentUserId}|${key}`;
	const valueStr = JSON.stringify(value);

	try {
		return c.ctx[CTX_KEYS.KV].put(fullKey, valueStr, {
			expirationTtl: expireFromNowSec,
		});
	} catch (e) {
		throw new Error(
			`ERROR: Can't save cache value ${valueStr} of "${key}": ${e}`,
		);
	}
}
