import { useEffect } from 'react';
import io from 'socket.io-client'
import { def } from "./Game/Constants";
import Canvas from './Game/GameCanvas';
import env from "react-dotenv";
import React from 'react';
const socket = io(env.URL_RED2);

export default function GameSpec(props:any )  {
	sessionStorage.setItem('idConv', '0');
    
    let players: { [key: string]: any } = {};
    
    const ball = {
        x: 20, 
        y: 20, 
        posX: def.WIN_W/2 - 10, 
        posY: def.WIN_H/2 - 10, 
        velX: 1, 
        velY: 1, 
        speed: 3
    };
    
    const left = {
        x: def.PL_W,
        y: def.PL_H,
        posX: 20,
        posY: def.WIN_H/2 - def.PL_H/2,
        speed: 7,
        meScore: 0,
        oppScore: 0,
        isLeft: false,
        roomName: "",
        name: "",
        id: 0,
        skin: 0
    };
    
    const right = {
        x: def.PL_W,
        y: def.PL_H,
        posX: 760,
        posY: def.WIN_H/2 - def.PL_H/2,
        speed: 7,
        meScore: 0,
        oppScore: 0,
        isLeft: false,
        roomName: "",
        name: "",
        id: 0,
        skin: 0
    };
    

    const joinRoom = () => {
        console.log("join");
        socket.emit('join_spectator', props.roomName);
    };

    useEffect(() => {    
        joinRoom();

        socket.on('update_players', (backendPlayers:any) => {
            for (const id in backendPlayers) {
                const backendPlayer = backendPlayers[id];
                if (!players[id])
                {
                    if (backendPlayer.isLeft) {
                        left.id = parseInt(id);
                        left.posX = backendPlayer.x;
                        left.isLeft = backendPlayer.isLeft;
                        left.name = backendPlayer.name;
                        left.roomName = backendPlayer.roomName;
                        left.skin = backendPlayer.skin;
                    }
                    else {
                        right.id = parseInt(id);
                        right.posX = backendPlayer.x;
                        right.isLeft = backendPlayer.isLeft;
                        right.name = backendPlayer.name;
                        right.roomName = backendPlayer.roomName;
                        right.skin = backendPlayer.skin;
                    }
                    players[id] = backendPlayer;
                }
            }

            for (const id in players) {
                if (!backendPlayers[id]) {
                    console.log("the other player left the game " + players[id]);

                    let user = JSON.parse(sessionStorage.getItem('userData') || 'null')
                    sessionStorage.setItem('idConv', '0');
                    sessionStorage.setItem('idUserInfos', user.ID);
                    sessionStorage.removeItem('selectFriend');
                    window.location.replace(env.URL_REACT);
                }
            }
        });

        socket.on("rec_pos_spec", (me:any, opponent:any) => {
            if(me.isLeft) {
                left.posX = me.posX;
                left.posY = me.posY;
                right.posX = opponent.posX;
                right.posY = opponent.posY;
            }
            else {
                left.posX = opponent.posX;
                left.posY = opponent.posY;
                right.posX = me.posX;
                right.posY = me.posY;
            }
        });

        socket.on('receive_ball_pos', (newBall:any) => {
            ball.posX= newBall.posX;
            ball.posY= newBall.posY; 
            ball.velX= newBall.velX;
            ball.velY= newBall.velY;
        });

        socket.on('receive_score', (lfScore:any, rtScore:any) => {
            const meElement = document.getElementById('me');
            if (meElement) {
                meElement.textContent = lfScore.toString();
            }
            const oppElement = document.getElementById('opp');
            if (oppElement) {
                oppElement.textContent = rtScore.toString();
            }
        });

        socket.on('end_game', () => {
            let user = JSON.parse(sessionStorage.getItem('userData') || 'null')
            sessionStorage.setItem('idConv', '0');
            sessionStorage.setItem('idUserInfos', user.ID);
            window.location.replace(env.URL_REACT);
        });


        return () => {
            socket.off('update_players');
            socket.off('rec_pos_spec');
            socket.off('receive_ball_pos');
            socket.off('receive_score');
            socket.off('end_game');
        };
    // eslint-disable-next-line
    }, []);
    
    return (
        <Canvas
        width="800"
        height="600"
            me={left}
            opponent={right}
            ball={ball}
        /> 
    );
}
