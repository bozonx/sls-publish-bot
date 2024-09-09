import { t } from './helpers.js';
import { make2SignDigitStr } from './lib.js';
import { PUB_KEYS } from '../constants.js';

export function makeIsoDateFromPubState(pubState) {
	return `${pubState[PUB_KEYS.date]}T${pubState[PUB_KEYS.time]}`;
}

// TODO: пишет завтра когда не надо
export function makeHumanRuDate(c, isoDateStr) {
	const closestDay = makeClosestDayRuString(c, isoDateStr);

	if (closestDay)
		return `${closestDay} ${makeShortDateFromIsoDate(isoDateStr)}`;

	return isoDateToLongLocaleRuDate(isoDateStr);
}

// TODO: пишет завтра когда не надо
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

export function convertDateTimeToTsMinutes(date, time, timeZone) {
	return (
		new Date(makeIsoDateFromPubState({ date, time }) + timeZone).getTime() /
		1000 /
		60
	);
}

// make iso date from DD.MM. It adds current year to a date
export function shortRuDateToFullIsoDate(localeShortDate, timeZone) {
	const timeZoneMs = timeZoneToMinutes(timeZone) * 60 * 1000;
	const [dayStr, monthStr] = localeShortDate.split('.');
	const year = new Date(new Date().getTime() + timeZoneMs).getFullYear();

	return `${year}-${make2SignDigitStr(monthStr)}-${make2SignDigitStr(dayStr)}`;
}

export function timeZoneToMinutes(timeZone) {
	if (!timeZone) return 0;

	const [hours, minutes] = timeZone.split(':');
	const hourNum = Number(hours);

	if (hourNum >= 0) return hourNum * 60 + Number(minutes);
	else return hourNum * 60 - Number(minutes);
}

export function todayPlusDaysIsoDate(plusDay = 0, timeZone) {
	const plusDateTs =
		new Date().getTime() + Number(plusDay) * 24 * 60 * 60 * 1000;

	return makeIsoLocaleDate(plusDateTs, timeZone);
}

export function makeIsoLocaleDate(specifiedDate, timeZone) {
	const date = specifiedDate ? new Date(specifiedDate) : new Date();
	const timeZoneMs = timeZoneToMinutes(timeZone) * 60 * 1000;
	const zonedDate = new Date(date.getTime() + timeZoneMs);
	const year = zonedDate.getUTCFullYear();
	const month = zonedDate.getUTCMonth() + 1;
	const day = zonedDate.getUTCDate();

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

// console.log(1111, todayPlusDaysIsoDate(6, '+03:00'));
// console.log(2222, makeIsoLocaleDate('2024-09-10T00:00Z', '+03:00'));

export function getCurrentHour(timeZone) {
	return Number(
		new Date().toLocaleString('ru-RU', {
			timeZone: timeZone,
			hour: 'numeric',
			hour12: false,
		}),
	);
}

// if no specifiedDate then current time is used
// better to put full specifiedDate of timestamp
export function getTimeStr(timeZone, specifiedDate) {
	const date = specifiedDate ? new Date(specifiedDate) : new Date();
	return date.toLocaleString('ru-RU', {
		timeZone: timeZone,
		hour: 'numeric',
		minute: 'numeric',
		hour12: false,
	});
}

export function isPastDate(isoDateStr) {
	// TODO: simplify

	// if (
	// 	new Date(isoDateStr).getTime() <
	// 	new Date(makeIsoDate(0)).getTime()
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

export function isValidShortDate(rawDateStr) {
	// TODO: better validate

	return Boolean(
		String(rawDateStr)
			.trim()
			.match(/^\d{1,2}\.\d{1,2}$/),
	);
}

// TODO: review
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

// TODO: с учетом локали +3
// export function isPastDateTime(isoDateStr, timeStr, minusMinute) {
// 	const [yearStr, monthStr, dayStr] = isoDateStr.split('-');
// 	const [hoursStr, minutesStr] = timeStr.split(':');
// 	const testMs = Date.UTC(
// 		Number(yearStr),
// 		Number(monthStr) - 1,
// 		Number(dayStr),
// 		Number(hoursStr),
// 		Number(minutesStr),
// 	);
// 	const now = new Date();
// 	const nowMs = Date.UTC(
// 		now.getFullYear(),
// 		now.getMonth(),
// 		now.getDate(),
// 		now.getHours(),
// 		now.getMinutes(),
// 	);
//
// 	return testMs < nowMs - minusMinute * 60 * 1000;
// }

// // operate with timestamp in milliseconds in UTC
// export function dateSubtractMinutes(tsMs, minutesToSubtract) {
// 	return dateSubtractSeconds(tsMs, minutesToSubtract * 60);
// }
//
// // operate with timestamp in milliseconds in UTC
// export function dateSubtractSeconds(tsMs, secondsToSubtract) {
// 	const subtractMs = secondsToSubtract * 1000;
//
// 	return tsMs - subtractMs;
// }

// // operate with timestamp in milliseconds in UTC
// export function dateAddSeconds(tsMs, secondsToAdd) {
// 	const addMs = secondsToAdd * 1000;
//
// 	return tsMs + addMs;
// }

//////////// TESTS

// console.log(111, makeIsoDate(0), makeIsoDate(8));
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
