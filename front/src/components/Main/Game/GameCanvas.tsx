import { def } from "./Constants";
import { useEffect, useRef } from 'react';
import {extractColors} from "../../../utils"
import React from "react";


export default function Canvas({me, opponent, ball,  ...props}: any) {
	const ref = useRef(null);
	let canvas:any = ref.current;

	const drawBackground = (context:any) => {
		context.clearRect(0, 0, def.WIN_W, def.WIN_H);
		context.fillStyle = 'black';
		context.fillRect(0, 0, def.WIN_W, def.WIN_H);
		context.fillStyle = "white";
		context.fillRect(def.WIN_W/2 - 2, 0, 4, def.WIN_H);
	};

	const drawPlayerLeft = (context:any, player:any) => {
		if(player.skin)
			context.fillStyle = extractColors(player.skin).color;
		else
			context.fillStyle = "white";
		context.fillRect(player.posX, player.posY, player.x, player.y);
		context.fillText(player.name, def.WIN_W / 4, 200);
	};
	
	const drawPlayerRight = (context:any, player:any) => {
		if(player.skin)
			context.fillStyle = extractColors(player.skin).color;
		else
			context.fillStyle = "white";
		context.fillRect(player.posX, player.posY, player.x, player.y);
		context.fillText(player.name, (def.WIN_W / 4 *3), 200);	
	};

	const drawBall = (context:any) => {
		if (ball) {
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
		drawBall(context);
		requestAnimationFrame(drawAll);
	};

	useEffect(() => {
		const animationFrameId = requestAnimationFrame(drawAll);
		return () => {
			cancelAnimationFrame(animationFrameId);
		};
    // eslint-disable-next-line
	}, []);

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
