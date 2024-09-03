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
