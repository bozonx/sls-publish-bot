import { t } from './helpers.js';
import { make2SignDigitStr } from './lib.js';
import { PUB_KEYS } from './constants.js';

export function makeIsoDateFromPubState(pubState) {
	return `${pubState[PUB_KEYS.date]}T${pubState[PUB_KEYS.time]}`;
}

export function makeHumanRuDate(c, isoDateStr) {
	const closestDay = makeClosestDayRuString(c, isoDateStr);

	if (closestDay)
		return `${closestDay} ${makeShortDateFromIsoDate(isoDateStr)}`;

	return isoDateToLongLocaleRuDate(isoDateStr);
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

export function isoDateToLongLocaleRuDate(isoDateStr) {
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
	const addMs = secondsToAdd * 1000;

	return tsMs + addMs;
}

export function isValidShortDate(rawDateStr) {
	// TODO: better validate

	return Boolean(
		String(rawDateStr)
			.trim()
			.match(/^\d{1,2}\.\d{1,2}$/),
	);
}

export function isValidShortTime(rawTime) {
	if (
		!String(rawTime)
			.trim()
			.match(/^\d{1,2}\:\d{1,2}$/)
	)
		return false;

	const [hourStr, minuteStr] = rawTime.split(':');
	const hour = Number(hourStr);
	const minute = Number(minuteStr);

	if (Number.isNaN(hour) || Number.isNaN(minute)) return false;
	else if (hour < 0 || hour > 24) return false;
	else if (minute < 0 || minute > 60) return false;

	return true;
}

// make iso date from DD.MM. It adds current year to a date
export function shortRuDateToFullIsoDate(localeShortDate) {
	const [dayStr, monthStr] = localeShortDate.split('.');
	// TODO: с учетом локали +3
	const year = new Date().getFullYear();

	return `${year}-${make2SignDigitStr(monthStr)}-${make2SignDigitStr(dayStr)}`;
}

export function makeIsoDayFromNow(plusDay = 0) {
	const now = new Date();
	// TODO: с учетом локали +3
	const year = now.getFullYear();
	// TODO: с учетом локали +3
	const month = now.getMonth() + 1;
	// TODO: с учетом локали +3
	const day = now.getDate() + Number(plusDay);

	return `${year}-${make2SignDigitStr(month)}-${make2SignDigitStr(day)}`;
}

export function makeClosestDayRuString(c, isoDateStr) {
	const [yearStr, monthStr, dayStr] = isoDateStr.split('-');
	const testMs = Date.UTC(
		Number(yearStr),
		Number(monthStr) - 1,
		Number(dayStr),
	);
	const now = new Date();

	// TODO: check time zone
	const nowMs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
	const diffMs = testMs - nowMs;

	if (diffMs < 0) return;

	const daysNum = diffMs / 24 / 60 / 60 / 1000;

	return t(c, 'closestDays')[daysNum];
}

export function isPastDate(isoDateStr) {
	// TODO: simplify

	// if (
	// 	new Date(isoDateStr).getTime() <
	// 	new Date(makeIsoDayFromNow(0)).getTime()
	// )
	// 	return this.reply(t(c, 'dateIsPastMessage'));
	//
	const [yearStr, monthStr, dayStr] = isoDateStr.split('-');
	const testMs = Date.UTC(
		Number(yearStr),
		Number(monthStr) - 1,
		Number(dayStr),
	);
	const now = new Date();
	const nowMs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

	return testMs < nowMs;
}

// TODO: с учетом локали +3
export function isPastDateTime(isoDateStr, timeStr, minusMinute) {
	const [yearStr, monthStr, dayStr] = isoDateStr.split('-');
	const [hoursStr, minutesStr] = timeStr.split(':');
	const testMs = Date.UTC(
		Number(yearStr),
		Number(monthStr) - 1,
		Number(dayStr),
		Number(hoursStr),
		Number(minutesStr),
	);
	const now = new Date();
	const nowMs = Date.UTC(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		now.getHours(),
		now.getMinutes(),
	);

	return testMs < nowMs - minusMinute * 60 * 1000;
}

export function getCurrentHour(timeZone) {
	return Number(
		new Date().toLocaleString('ru-RU', {
			timeZone: timeZone,
			hour: 'numeric',
			hour12: false,
		}),
	);
}

//////////// TESTS

// console.log(111, makeIsoDayFromNow(0), makeIsoDayFromNow(8));
// console.log(222, shortRuDateToFullIsoDate('5.9'));
// console.log(333, getShortWeekDay('2024-09-04'));
// console.log(444, isoDateToLongLocaleRuDate('2024-09-04'));
// console.log(555, makeShortDateFromIsoDate('2024-09-04'));
// console.log(666, makeHumanRuDateCompact({}, '2024-09-04'));
// console.log(777, makeHumanRuDate({}, '2024-09-04'));
// console.log(
// 	888,
// 	isPastDate('2024-09-03'),
// 	isPastDate('2024-09-04'),
// 	isPastDate('2024-09-05'),
// );
// console.log(888, makeClosestDayRuString({}, '2024-09-06'));
// console.log(999, isPastDateTime('2024-09-04', '14:04', 5));
