import { make2SignDigitStr } from './lib.js';

export function makeIsoDateFromPubState(pubState) {
	return `${pubState[PUB_KEYS.date]}T${pubState[PUB_KEYS.time]}`;
}

export function makeHumanRuDate(c, isoDateStr) {
	// TODO: t(c 'today'), tomorrow, afterTomorrow

	return formatIsoDateToLocaleRuDate(isoDateStr);
}

export function makeHumanRuDateCompact(c, isoDateStr) {
	// TODO: t(c 'today'), tomorrow, afterTomorrow
	// TODO: other date are 05.11

	return formatIsoDateToLocaleRuDate(isoDateStr);
}

export function formatIsoDateToLocaleRuDate(isoDateStr) {
	return new Date(`${isoDateStr}T00:00`).toLocaleDateString('ru-RU', {
		weekday: 'short',
		month: 'long',
		day: 'numeric',
	});
}

export function getLocaleDayOfWeekFromNow(plusDay) {
	return new Date(`${makeIsoDayFromNow(plusDay)}T00:00`).toLocaleDateString(
		'ru-RU',
		{
			weekday: 'short',
		},
	);
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
	const [dayStr, monthStr] = localeShortDate;
	const year = new Date().getFullYear();

	return `${year}-${make2SignDigitStr(monthStr)}-${make2SignDigitStr(dayStr)}`;
}

export function makeIsoDayFromNow(plusDay) {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	// TODO: wrong
	const day = now.getDay() + 1 + Number(plusDay);

	return `${year}-${make2SignDigitStr(month)}-${make2SignDigitStr(day)}`;
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
