/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const columnRowNum = 40;

const clearCanvas = () =>
{
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const drawGridSquares = (() =>
{
	const gap = 5;

	const len = canvas.width / columnRowNum - gap;

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

const snake = (() =>
{
	const body = [
		{
			x: 14,
			y: 19,
		},
		{
			x: 15,
			y: 19,
		},
		{
			x: 16,
			y: 19,
		},
		{
			x: 17,
			y: 19,
		},
		{
			x: 18,
			y: 19,
		},
		{
			x: 19,
			y: 19,
		},
	]

	const direction = (() =>
	{
		const directionMap = {
			
			up: 0,
			down: 1,
			left: 2,
			right: 3,
		}

		let currDirection = directionMap.right;

		const isMovingBackWards = (a, b) =>
		{
			const absDiffIsOne = Math.abs(a - b) === 1;
			const smallestIsOne = Math.min(a, b) !== 1;
			const biggestIsTwo = Math.max(a, b) !== 2;
			const isNotOneAndTwo = smallestIsOne && biggestIsTwo;

			return absDiffIsOne && (isNotOneAndTwo);
		}

		return {
			get: () => currDirection,
			change: (newDirection) =>
			{
				newDirection = directionMap[newDirection];

				if(isMovingBackWards(newDirection, currDirection)) return;

				currDirection = newDirection;
			},
		}
	})()

	const getNewHead = (() =>
	{
		const dupe = (obj) => JSON.parse(JSON.stringify(obj));
	
		return () =>
		{
			const newHead = dupe(body[body.length - 1]);
	
			switch(direction.get())
			{
				case 0:
					newHead.y--;
					break;
	
				case 1:
					newHead.y++;
					break;
	
				case 2:
					newHead.x--;
					break;
	
				case 3:
					newHead.x++;
					break;
	
				default:
					throw new Error(`Direction ${direction.get()} is invalid`);
			}
	
			return newHead;
		}
	})()

	const update = (() =>
	{
		const hasHitWall = ({ x, y }) => x >= columnRowNum || x < 0 || y >= columnRowNum || y < 0;

		const hasHitSelf = (() =>
		{
			const minLenToHitSelf = 5;

			const isPosIsSame = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => x1 === x2 && y1 === y2;

			return (body, newHead) =>
			{
				if(body.length < minLenToHitSelf) return false;
				
				for(let i = 0; i < body.length - 1; i++)
				{
					const samePos = isPosIsSame(body[i], newHead);

					if(samePos) return true;
				}

				return false;
			}
		})()

		const move = (newHead) =>
		{
			body.shift();
			body.push(newHead);
		}

		return () =>
		{
			const newHead = getNewHead();

			if(hasHitWall(newHead) || hasHitSelf(body, newHead)) return;
	
			move(newHead);
			clearCanvas();
			drawGridSquares(body, 'white');
		}
	})()

	const grow = () => body.push(getNewHead());

	return {
		update,
		grow,
		direction: direction.change,
	}
})();

const addEventListeners = () =>
{
	document.addEventListener('keydown', (e) =>
	{
		const arrow = 'Arrow';

		if(e.key.includes(arrow))
		{
			const direction = e.key.replace(arrow, '').toLowerCase();
			snake.direction(direction);
		}
	})
}

const gameLoop = () =>
{
	snake.update();
}

const init = () =>
{
	clearCanvas();
	addEventListeners();
	setInterval(gameLoop, 100);
}

init();

// const gameLoop = (() =>
// {
// 	let oldTimeStamp = 0;

// 	return (timeStamp) =>
// 	{
// 		const time = (timeStamp - oldTimeStamp) / 1000;
// 		oldTimeStamp = timeStamp;

// 		// Call update with time
		
// 		requestAnimationFrame(gameLoop);
// 	}
// })()

// requestAnimationFrame(gameLoop);
