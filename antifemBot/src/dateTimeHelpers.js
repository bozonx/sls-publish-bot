import { t } from './helpers.js';
import { make2SignDigitStr } from './lib.js';

export function makeIsoDateFromPubState(pubState) {
	return `${pubState[PUB_KEYS.date]}T${pubState[PUB_KEYS.time]}`;
}

export function makeHumanRuDate(c, isoDateStr) {
	const closestDay = makeClosestDayRuString(c, isoDateStr);

	if (closestDay) return closestDay;

	return formatIsoDateToLocaleRuDate(isoDateStr);
}

export function makeHumanRuDateCompact(c, isoDateStr) {
	const closestDay = makeClosestDayRuString(c, isoDateStr);

	if (closestDay) return closestDay;

	return makeShortDateFromIsoDate(isoDateStr);
}

export function makeShortDateFromIsoDate(isoDateStr) {
	const [, monthStr, dayStr] = isoDateStr.split('-');

	return `${dayStr}.${monthStr}`;
}

export function makeClosestDayRuString(c, isoDateStr) {
	// TODO: add
	return isoDateStr;
}

export function formatIsoDateToLocaleRuDate(isoDateStr) {
	return new Date(`${isoDateStr}T00:00`).toLocaleDateString('ru-RU', {
		weekday: 'short',
		month: 'long',
		day: 'numeric',
	});
}

export function getShortWeekDay(isoDateStr) {
	return new Date(`${isoDateStr}T00:00`).toLocaleDateString('ru-RU', {
		weekday: 'short',
	});
}

// operate with timestamp in milliseconds in UTC
export function dateSubtractMinutes(tsMs, minutesToSubtract) {
	return dateSubtractSeconds(tsMs, minutesToSubtract * 60);
}

// operate with timestamp in milliseconds in UTC
export function dateSubtractSeconds(tsMs, secondsToSubtract) {
	const subtractMs = secondsToSubtract * 1000;

	return tsMs - subtractMs;
}

// operate with timestamp in milliseconds in UTC
export function dateAddSeconds(tsMs, secondsToAdd) {
	const subtractMs = secondsToAdd * 1000;

	return tsMs + subtractMs;
}

export function isValidShortDate(rawDateStr) {
	return Boolean(
		String(rawDateStr)
			.trim()
			.match(/^\d{1,2}\.\d{1,2}$/),
	);
}

export function shortRuDateToFullIsoDate(localeShortDate) {
	// TODO: review
	const [dayStr, monthStr] = localeShortDate;
	const year = new Date().getFullYear();

	return `${year}-${make2SignDigitStr(monthStr)}-${make2SignDigitStr(dayStr)}`;
}

// TODO: review
export function makeIsoDayFromNow(plusDay = 0) {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	// TODO: wrong
	const day = now.getDay() + 1 + Number(plusDay);

	return `${year}-${make2SignDigitStr(month)}-${make2SignDigitStr(day)}`;
}

// TODO: review
export function isPastDate(isoDateStr) {
	//
}

// // it returns number of day of week. 0 = monday, 1 = tuesday, ...
// export function getDayOfWeekNum(someDate) {
// 	// start from sunday = 0
// 	// TODO: с какой зоной он возьмёт день?
// 	const dayOfWeek = new Date(someDate).getDay();
//
// 	if (dayOfWeek === 0) return 7;
//
// 	return dayOfWeek - 1;
// }
//
