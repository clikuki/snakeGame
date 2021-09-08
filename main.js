/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const specialDraw = (color, drawFunc) =>
{
	const prevColor = ctx.fillStyle;

	ctx.fillStyle = color;
	drawFunc();
	ctx.fillStyle = prevColor;
};

const clearCanvas = (() =>
{
	const drawBlack = () => ctx.fillRect(0, 0, canvas.width, canvas.height);

	return () => specialDraw('black', drawBlack);
})()

const drawSquare = (() =>
{
	const gap = 5;

	const len = canvas.height / 40 - gap;

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

	return (x, y, color) =>
	{
		const pos = getGridPos(x, y);

		specialDraw(color, () => ctx.fillRect(pos.x, pos.y, len, len));
	}
})()

const init = () =>
{
	clearCanvas();
}

init();

for(let i = 0; i < 40; i++)
{
	if(drawSquare(i, 0, 'white'))
	{
		console.log(i);
		break;
	}
}
