/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const clearCanvas = () =>
{
	const prevColor = ctx.fillStyle;

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = prevColor;
}

const moveSquare = (() =>
{
	const gap = 5;

	const size = {
		w: 10,
		h: 10,
	}

	const getNewPos = (gap, len, index) => gap + (len + gap) * index;

	const draw = () =>
	{
		// console.log(axis, sign, coords[axis]);

		clearCanvas();
		const prevColor = ctx.fillStyle;

		ctx.fillStyle = 'white';

		const pos = {
			x: getNewPos(gap, size.w, coords.x),
			y: getNewPos(gap, size.h, coords.y),
		}

		ctx.fillRect(pos.x, pos.y, size.w, size.h);

		ctx.fillStyle = prevColor;

		coords[axis] += sign;
		requestAnimationFrame(draw)
	}

	let axis = 'x';
	let sign = 1;
	const coords = {
		x: 0,
		y: 0,
	}

	requestAnimationFrame(draw);

	return (a, s) =>
	{
		axis = a;
		sign = Math.sign(s);
	}
})()

document.addEventListener('keydown', (e) =>
{
	const key = e.key;
	if(!key.includes('Arrow')) return;

	const axis = key === 'ArrowUp' || key === 'ArrowDown' ? 'y' : 'x';
	const sign = key === 'ArrowDown' || key === 'ArrowRight' ? 1 : -1;

	moveSquare(axis, sign);
})

const init = () =>
{
	clearCanvas();
}

init();
