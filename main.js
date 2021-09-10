/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const columnRowNum = 40;
const maxGameSpeed = 200;
const minGameSpeed = 80;

let gameSpeed = maxGameSpeed;
let isGameOver = false;

const gameOver = (() =>
{
	const textArray = [
		{
			text: 'GAME OVER',
			height: 30,
		},
		{
			text: 'Press Enter to restart',
			height: 20,
		},
	]

	const pos = {
		x: canvas.width / 2,
		y: canvas.height / 2,
	}

	return () =>
	{
		isGameOver = true;

		ctx.textBaseline = 'middle';
		ctx.textAlign = "center";
		ctx.fillStyle = 'red';

		for(let i = 0; i < textArray.length; i++)
		{
			ctx.font = '';

			const { text, height } = textArray[i];
			
			ctx.font = `${height}px sans-serif`;
			ctx.fillText(text, pos.x, pos.y + (i * 20));
		}
	}
})()

const apple = (() =>
{
	const getRandPos = () => Math.floor(Math.random() * (columnRowNum));

	const pos = {
		x: getRandPos(),
		y: getRandPos(),
	}

	const eat = (() =>
	{
		const isNotInSnake = (axis, coord, snakeBody) =>
		{
			for(const snakePart of snakeBody)
			{
				if(snakePart[axis] === coord) return false;
			}

			return true;
		}

		return () =>
		{
			const snakeBody = snake.get();
	
			for(const axis in pos)
			{
				let isInvalidPos = true;
	
				while(isInvalidPos)
				{
					const newPos = getRandPos();

					if(isNotInSnake(axis, newPos, snakeBody))
					{
						isInvalidPos = false;
						pos[axis] = newPos;
					}
				}
			}
		}
	})()

	const draw = () => drawGridSquares([pos], 'red');

	return {
		get: () => pos,
		eat,
		draw,
	}
})()

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
	const dupe = (obj) => JSON.parse(JSON.stringify(obj));

	const getStartSnake = (() =>
	{
		const startingSnake = [
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

		return () => dupe(startingSnake);
	})()

	const body = getStartSnake();

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

	const getNewHead =  () =>
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

	const update = (() =>
	{
		const hasHitWall = ({ x, y }) => x >= columnRowNum || x < 0 || y >= columnRowNum || y < 0;

		const hasHitSelf = (() =>
		{
			const minLenToHitSelf = 5;

			const isPosIsSame = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => x1 === x2 && y1 === y2;

			return (newHead) =>
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

		const isInApple = (newHead) =>
		{
			const applePos = apple.get();
			
			for(const pos in newHead)
			{
				if(applePos[pos] !== newHead[pos]) return false;
			}

			return true;
		}

		const move = (newHead) =>
		{
			body.shift();
			body.push(newHead);
		}

		return () =>
		{
			const newHead = getNewHead();

			if(hasHitWall(newHead) || hasHitSelf(newHead))
			{
				draw()
				gameOver();
			}
			else {
				if(isInApple(newHead))
				{
					grow();
					apple.eat();
					if(gameSpeed > minGameSpeed) gameSpeed -= 5;
				}
				else move(newHead);

				draw()
				prevLastBody = body[0];
			}
		}
	})()

	const draw = () =>
	{
		drawGridSquares(body, 'white');
	}

	const grow = () => body.push(getNewHead());

	const restart = () =>
	{
		direction.change('right');
		body.length = [];

		const newBody = getStartSnake();

		for(const snakePart of newBody)
		{
			body.push(snakePart);
		}
	}

	const init = () =>
	{
		drawGridSquares(body, 'white');
	}

	return {
		get: () => body,
		update,
		init,
		restart,
		direction: direction.change,
	}
})();

const restart = () =>
{
	isGameOver = false;
	gameSpeed = maxGameSpeed;
	snake.restart();
	apple.eat();
}

const addEventListeners = () =>
{
	document.addEventListener('keydown', (e) =>
	{
		const arrow = 'Arrow';
		const key = e.key;

		if(e.key.includes(arrow))
		{
			const direction = key.replace(arrow, '').toLowerCase();
			snake.direction(direction);
		}
		else if(isGameOver && key === 'Enter') restart();
	})
}

const gameLoop = (() =>
{
	let oldTimeStamp = 0;

	const update = () =>
	{
		if(!isGameOver)
		{
			clearCanvas();
			snake.update();
			apple.draw();
		}
	}

	return (timeStamp) =>
	{
		const ms = timeStamp - oldTimeStamp;

		if(ms >= gameSpeed)
		{
			oldTimeStamp = timeStamp;
			update();
		}
		
		requestAnimationFrame(gameLoop);
	}
})() 

const init = () =>
{
	clearCanvas();
	snake.init();
	apple.draw();
	addEventListeners();
	requestAnimationFrame(gameLoop);
}

init();
