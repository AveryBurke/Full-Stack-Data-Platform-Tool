const rotateCoordinates = (oldX: number, oldY: number, theta: number): [number, number] => {
	const newX = oldX * Math.cos(theta) + oldY * Math.sin(theta);
	const newY = -1 * oldX * Math.sin(theta) + oldY * Math.cos(theta);

	return [newX, newY];
};

export default rotateCoordinates;
