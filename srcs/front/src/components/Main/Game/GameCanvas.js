import { def } from "./Constants";
import { useEffect, useRef } from 'react';
import {extractColors} from "../../../utils"


export default function Canvas({me, opponent, ball,  ...props}) {
//export default function Canvas({me, opponent, ball, inGame, startedGame, ...props}) {
	const ref = useRef(null);
	let canvas = ref.current;

	let start;

	const drawBackground = (context) => {
		context.clearRect(0, 0, def.WIN_W, def.WIN_H);
		context.fillStyle = 'black';
		context.fillRect(0, 0, def.WIN_W, def.WIN_H);
	
		//ligne du centre
		context.fillStyle = "white";
		context.fillRect(def.WIN_W/2 - 2, 0, 4, def.WIN_H);
	};

	const drawPlayerLeft = (context, player) => {
		//draw player
		if(player.skin)
			context.fillStyle = extractColors(player.skin).color;
		else
			context.fillStyle = "white";
		context.fillRect(player.posX, player.posY, player.x, player.y);

		context.fillText(player.name, def.WIN_W / 4, 200);
	};
	
	const drawPlayerRight = (context, player) => {
		//draw player
		if(player.skin)
			context.fillStyle = extractColors(player.skin).color;
		else
			context.fillStyle = "white";
		context.fillRect(player.posX, player.posY, player.x, player.y);

		context.fillText(player.name, (def.WIN_W / 4 *3), 200);	
	};

	
	//undefined meme apres instansiation voir ce que je fais mal
	const drawBall = (context) => {
		if (ball) {
			//draw ball
			context.fillStyle = 'white';
			context.fillRect(ball.posX, ball.posY, ball.x, ball.y);
		}
	};
	
	const drawAll = () => {
		
		canvas = ref.current;
		const context = canvas.getContext('2d');
		context.font = 'bold 20px Verdana, Arial, serif';
		context.textAlign = 'center';

		drawBackground(context);
		if (me.isLeft) {

			drawPlayerLeft(context, me);
			drawPlayerRight(context, opponent);
		}
		else {
			drawPlayerLeft(context, opponent);
			drawPlayerRight(context, me);
		}

		// if (!inGame) {
		// 	context.fillText("Waiting another player to join", def.WIN_W / 2, def.WIN_H / 2);
		// }

		// if (inGame && !startedGame) {
		// 	context.fillText("Player left press p to start", def.WIN_W / 2, def.WIN_H / 2);
		// }

		drawBall(context);
		
		//console.log(start);

		requestAnimationFrame(drawAll);
	};

	// const handleResize = () => {
	// 	const newWidth = canvas.clientWidth;
  	// 	const newHeight = canvas.clientHeight;

	// 	updateScreen({
	// 		...sizeScreen,
	// 		width: newWidth,
	// 		height: newHeight
	// 	});

	// 	canvas.width = newWidth;
	// 	canvas.height = newHeight;

	// 	console.log("client canva w: " + canvas.clientWidth);
	// 	console.log("client canva h: " + canvas.clientHeight);
	// 	console.log("canva w: " + canvas.width);
	// 	console.log("canva h: " + canvas.height);
	// 	console.log("sizeScreen w: " + sizeScreen.width);
	// 	console.log("sizeScreen h: " + sizeScreen.height);
	// };
	
	useEffect(() => {
		//dessiner tous les elements q utiliser dqns lq boucleaui servira d anim
		const animationFrameId = requestAnimationFrame(drawAll);
		//window.addEventListener('resize', handleResize);
		//start = inGame;
		
		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	
	}, [  ]);
	//}, [ inGame, startedGame ]);

	return (
		<div className="GameCanvas">
			<div className="Score">
				<span id='me'>0</span>
				<span>	-	</span>
				<span id='opp'>0</span>
			</div>
			<canvas ref={ref} width={props.width} height={props.height}  /> 
		</div>
	)
}
