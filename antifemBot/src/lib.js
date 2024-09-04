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

export function applyStringTemplate(tmpl, data) {
	return tmpl.replace(
		/\${\s*([^{}\s]+)\s*}/g,
		(match, key) => data[key.trim()] || '',
	);
}

export function makeStringArrayUnique(rawArr) {
	const obj = {};

	for (const i of rawArr) obj[i] = true;

	return Object.keys(obj);
}

export function isEmptyObj(obj) {
	return !Object.keys(obj || {}).length;
}

export function make2SignDigitStr(digit) {
	const num = Number(digit);

	if (num < 10) return `0${num}`;
	else return String(num);
}
