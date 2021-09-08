/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const clearCanvas = () =>
{
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const drawGridSquares = (() =>
{
	const gap = 5;

	const len = canvas.width / 40 - gap;

	const getGridPos = (() =>
	{
		const multiplier = len + gap;
		const halfGap = gap / 2;
		const crispEdgeDecimal = .5;

		const getPos = (index) => halfGap + (multiplier * index) + crispEdgeDecimal;

		return (xIndex, yIndex) => ({
			x: getPos(xIndex),
			y: getPos(yIndex),
		});
	})()

	return (points, color) =>
	{
		ctx.fillStyle = color;
		ctx.beginPath();

		for(const point of points)
		{
			const {x, y} = getGridPos(point.x, point.y);

			ctx.moveTo(x, y);
			ctx.lineTo(x + len, y);
			ctx.lineTo(x + len, y + len);
			ctx.lineTo(x, y + len);
			ctx.lineTo(x, y);
		}

		ctx.fill();
	}
})()

const init = () =>
{
	clearCanvas();
}

init();
