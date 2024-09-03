/**
 * Break long array to smaller arrays with maxCount elements.
 * maxCount = 2 means [0,1,2,3,4] => [[0,1], [2,3], [4]]
 */
export function breakArray(arr, maxCount) {
	const result = [];

	for (const index in arr) {
		// make new sub array if it is the start of cycle of if items exceeded max count
		if (!result.length || result[result.length - 1].length >= maxCount) {
			result.push([arr[index]]);
		} else {
			result[result.length - 1].push(arr[index]);
		}
	}

	return result;
}

export function makeStringArrayUnique(rawArr) {
	const obj = {};

	for (const i of rawArr) obj[i] = true;

	return Object.keys(obj);
}

export function isEmptyObj(obj) {
	if (!obj) return true;

	return !Object.keys(obj || {}).length;
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

export function make2SignDigitStr(digit) {
	const num = Number(digit);

	if (num < 9) return `0${num}`;
	else return String(num);
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
