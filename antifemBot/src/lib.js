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
