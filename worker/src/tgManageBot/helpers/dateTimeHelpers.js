import { t } from './helpers.js';
import { make2SignDigitStr } from './lib.js';
import { PUB_KEYS } from '../constants.js';

export function makeIsoDateFromPubState(pubState) {
	return `${pubState[PUB_KEYS.date]}T${pubState[PUB_KEYS.time]}`;
}

export function makeHumanRuDate(c, isoDateStr, timeZone) {
	const closestDay = makeClosestDayRuString(c, isoDateStr, timeZone);

	if (closestDay)
		return `${closestDay} ${makeShortDateFromIsoDate(isoDateStr)}`;

	return isoDateToLongLocaleRuDate(isoDateStr);
}

export function makeHumanRuDateCompact(c, isoDateStr, timeZone) {
	const closestDay = makeClosestDayRuString(c, isoDateStr, timeZone);
	const shortDate = makeShortDateFromIsoDate(isoDateStr);

	if (closestDay) return closestDay + ` ${shortDate}`;

	return getShortWeekDay(isoDateStr) + ` ${shortDate}`;
}

export function isoDateToLongLocaleRuDate(isoDateStr) {
	return new Date(`${isoDateStr}T00:00Z`).toLocaleDateString('ru-RU', {
		timeZone: '+00:00',
		weekday: 'short',
		month: 'long',
		day: 'numeric',
	});
}

export function convertDateTimeToTsMinutes(date, time, timeZone) {
	return Math.floor(
		new Date(makeIsoDateFromPubState({ date, time }) + timeZone).getTime() /
		1000 /
		60,
	);
}

export function timeToMinutes(time) {
	if (!time) return 0;

	const [hoursStr, minutesStr] = time.split(':');
	const hourNum = Number(hoursStr);
	const minutesNum = Number(minutesStr);

	if (hourNum >= 0) return hourNum * 60 + minutesNum;
	else return hourNum * 60 - minutesNum;
}

export function makeIsoLocaleDate(specifiedDate, timeZone) {
	const date = specifiedDate ? new Date(specifiedDate) : new Date();
	const timeZoneMs = timeToMinutes(timeZone) * 60 * 1000;
	const zonedDate = new Date(date.getTime() + timeZoneMs);
	const year = zonedDate.getUTCFullYear();
	const month = zonedDate.getUTCMonth() + 1;
	const day = zonedDate.getUTCDate();

	return `${year}-${make2SignDigitStr(month)}-${make2SignDigitStr(day)}`;
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

// if no specifiedDate then current time is used
// better to put full specifiedDate or timestamp
export function getTimeStr(timeZone, specifiedDate) {
	const date = specifiedDate ? new Date(specifiedDate) : new Date();
	return date.toLocaleString('ru-RU', {
		timeZone: timeZone,
		hour: 'numeric',
		minute: 'numeric',
		hour12: false,
	});
}

export function makeClosestDayRuString(c, isoDateStr, timeZone) {
	const timeZoneMs = timeToMinutes(timeZone) * 60 * 1000;
	const testDaysTs = Math.floor(
		new Date(`${isoDateStr}T00:00Z`).getTime() / 1000 / 60 / 60 / 24,
	);
	const nowDaysTs = Math.floor(
		(new Date().getTime() + timeZoneMs) / 1000 / 60 / 60 / 24,
	);
	const diffDays = testDaysTs - nowDaysTs;

	if (diffDays < 0) return;

	return t(c, 'closestDays')[diffDays];
}

export function isPastDate(isoDateStr, timeZone) {
	return isTimePast('00:00', isoDateStr, timeZone, -60 * 24);
}

export function isTimePast(
	normalizedTime,
	isoDateStr,
	timeZone,
	additionalMinutes = 0,
) {
	const testMs = new Date(
		`${isoDateStr}T${normalizedTime}${timeZone}`,
	).getTime();
	const nowMs = new Date().getTime();
	const testMinutesTs = Math.floor(testMs / 1000 / 60);
	const nowMinutesTs = Math.floor(nowMs / 1000 / 60) + additionalMinutes;

	return testMinutesTs < nowMinutesTs;
}

export function normalizeShortDateToIsoDate(localeShortDate, timeZone) {
	const timeZoneMs = timeToMinutes(timeZone) * 60 * 1000;

	if (localeShortDate?.trim().match(/^\d{1,2}$/)) {
		// use only day and get current or next month
		const day = Number(localeShortDate.trim());
		const now = new Date(new Date().getTime() + timeZoneMs);
		const monthDay = now.getDate();
		const year = now.getFullYear();
		const curMonth = now.getMonth() + 1;
		let isoDate;

		if (day >= monthDay) {
			// today or future date of this month
			isoDate = `${year}-${make2SignDigitStr(curMonth)}-${make2SignDigitStr(day)}`;
		} else {
			let fixedMonth = curMonth === 12 ? 1 : curMonth + 1;
			// next month date
			isoDate = `${year}-${make2SignDigitStr(fixedMonth)}-${make2SignDigitStr(day)}`;
		}
		// if exceeded count of days in month then false
		if (new Date(isoDate).toString() === 'Invalid Date') return false;

		return isoDate;
	}

	if (!localeShortDate?.trim().match(/^\d{1,2}\.\d{1,2}$/)) return false;

	const [dayStr, monthStr] = localeShortDate.split('.');
	const year = new Date(new Date().getTime() + timeZoneMs).getFullYear();
	const isoDate = `${year}-${make2SignDigitStr(monthStr)}-${make2SignDigitStr(dayStr)}`;

	if (new Date(isoDate).toString() === 'Invalid Date') return false;

	return isoDate;
}

export function makeShortDateFromIsoDate(isoDateStr) {
	const [, monthStr, dayStr] = isoDateStr.split('-');

	return `${dayStr}.${monthStr}`;
}

export function getShortWeekDay(isoDateStr) {
	return new Date(`${isoDateStr}T00:00Z`).toLocaleDateString('ru-RU', {
		timeZone: '+00:00',
		weekday: 'short',
	});
}

////////// Shared with UI

export function todayPlusDaysIsoDate(plusDay = 0, timeZone) {
	const plusDateTs =
		new Date().getTime() + Number(plusDay) * 24 * 60 * 60 * 1000;

	return makeIsoLocaleDate(plusDateTs, timeZone);
}

export function normalizeTime(rawTime) {
	if (
		!String(rawTime)
			.trim()
			.match(/^\d{1,2}\:\d{1,2}$/)
	)
		return false;

	const [hourStr, minuteStr] = rawTime.trim().split(':');
	const time = `${make2SignDigitStr(hourStr)}:${make2SignDigitStr(minuteStr)}`;

	if (new Date(`2024-08-06T${time}`).toString() === 'Invalid Date')
		return false;

	// const hour = Number(hourStr.trim());
	// const minute = Number(minuteStr.trim());
	//
	// if (Number.isNaN(hour) || Number.isNaN(minute)) return false;
	// else if (hour < 0 || hour > 24) return false;
	// else if (minute < 0 || minute > 60) return false;

	return time;
}
