import { def } from "./Constants";
import { useEffect, useRef } from 'react';


export default function Canvas({ me, opponent, ball, ...props}) {
	const ref = useRef(null);
	let canvas = ref.current;

	const drawBackground = (context) => {
		context.clearRect(0, 0, def.WIN_W, def.WIN_H);
		context.fillStyle = 'black';
		context.fillRect(0, 0, def.WIN_W, def.WIN_H);
	
		//ligne du centre
		context.fillStyle = "white";
		context.fillRect(def.WIN_W/2 - 2, 0, 4, def.WIN_H);
	};
	
	const drawPlayer = (context, player) => {
	
		//draw player
		context.fillStyle = "white";
		context.fillRect(player.posX, player.posY, player.x, player.y);
	};
	
	const drawScore = (context, player) => {
		if (me.isLeft) {
			context.fillText(player.meScore, def.WIN_W / 2 - (2*def.PL_W), 50, 100);
			context.fillText(player.oppScore, def.WIN_W / 2 + (2*def.PL_W), 50, 100);
		}
		else {
			context.fillText(player.oppScore, def.WIN_W / 2 - (2*def.PL_W), 50, 100);
			context.fillText(player.meScore, def.WIN_W / 2 + (2*def.PL_W), 50, 100);
		}
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

		drawBackground(context);
		drawPlayer(context, me);
		drawPlayer(context, opponent);
		drawBall(context);
		drawScore(context, me);
		  
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
		//drawAll();
		const animationFrameId = requestAnimationFrame(drawAll);
		//window.addEventListener('resize', handleResize);
		
		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	
	},  [] );
	return (
		//modifier width et height avec les nouvelle propriete de update screen pour la mise a jouer du canva
		<div className="GameCanvas">
			<canvas ref={ref}  width={props.width} height={props.height} />
		</div>
	)
}
