import { def } from "./Constants";

export default function GameCanvas({ me, opponent, ball, ...props}) {
	sessionStorage.setItem('id_conv', 0);
	const ref=useRef();
	
	const drawBackground = (context) => {
		context.clearRect(0, 0, def.WIN_W, def.WIN_H);
		context.fillStyle = 'black';
		context.fillRect(0, 0, def.WIN_W, def.WIN_H);
	
		//ligne du centre
		context.fillStyle = "white";
		context.fillRect(def.WIN_W/2, 0, 4, def.WIN_H);
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
	}
	
	//undefined meme apres instansiation voir ce que je fais mal
	const drawBall = (context) => {
		if (ball) {
			//draw ball
			context.fillStyle = 'white';
			context.fillRect(ball.posX, ball.posY, ball.x, ball.y);
		}
	};
	
	const drawAll = () => {
		const canvas = ref.current;
		const context = canvas.getContext('2d');
		
		drawBackground(context);
		drawPlayer(context, me);
		drawPlayer(context, opponent);
		drawBall(context);
		drawScore(context, me);
		  
		requestAnimationFrame(drawAll);
	};
	
	useEffect(() => {
		//dessiner tous les elements q utiliser dqns lq boucleaui servira d anim
		//drawAll();
		const animationFrameId = requestAnimationFrame(drawAll);
		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	
	},  [] );
	return (
		<div className="GameCanvas">
			<canvas ref={ref}  width={props.width} height={props.height} />
		</div>
	)
}
