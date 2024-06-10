export function genColor() {
	let nextCol = 1;
	return function () {
		let ret = [];
		if (nextCol < 16777215) {
			ret.push(nextCol & 0xff); // Red
			ret.push((nextCol & 0xff00) >> 8); // Green
			ret.push((nextCol & 0xff0000) >> 16); // Blue
			nextCol += 1;
		}
		let col = "rgb(" + ret.join(",") + ")";
		return col;
	};
}