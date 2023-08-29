import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client'
import { def } from "./Game/Constants";
import Canvas from './Game/GameCanvas';



export default function Game() { 
	sessionStorage.setItem('idConv', 0);

    const socket = io.connect("http://127.0.0.1:3002");
	const ref=useRef();
    
    const ball = {
        x: 20, 
        y: 20, 
        posX: def.WIN_W/2 - 10, 
        posY: def.WIN_H/2 - 10, 
        velX: 1, 
        velY: 1, 
        speed: 3
    };
    
    let me = {
        x: def.PL_W, 
        y: def.PL_H, 
        posX: 20,
        posY: def.WIN_H/2 - 10,
        speed: 5, 
        // meScore: 0, 
        // oppScore: 0
    };
    
    let opponent = {
        x: def.PL_W, 
        y: def.PL_H, 
        posX: 20,
        posY: def.WIN_H/2 - 10,
        speed: 5, 
        meScore: 0, 
        oppScore: 0
    };
    const [players, setPlayers] = useState({});
    
    //je peux passer la nouvelle position en parametre et puis l envoyer en param de socket emit
    const sendPosition = () => {
        socket.emit("send_position", me.posY);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'w' && me.posY > 0) {
            me.speed = -5;
            me.posY += me.speed;
            sendPosition();
        }
        else if (event.key === 's' && me.posY + def.PL_H < def.WIN_H) {
            me.speed = 5;
            me.posY += me.speed;
            sendPosition();
        }
    };

    const handleKeyUp = (event) => {
        if (players[socket.id]) {
            if (event.key === 'w' || event.key === 's') {
                me.speed = 0;
            }
        }
    };

    //faire un update ball pos qui contient le calcul des bords de la ball 
    //et faire un send pos ball comme pour la pos de la ball  
    const sendBallPosition = () => {
        socket.emit("send_ball_pos", ball);
    };

    const sendScore = () => {
        socket.emit("send_score", me);
    }

    //reset la ball lorsquelle sort
    const resetBall = () => {
        ball.posX = def.WIN_W /2 -10;
        ball.posY = def.WIN_H /2 - 10;
    }

    const checkGoal = () => {

        if (ball.posX + ball.x >= def.WIN_W - 15) {
            if (me.isLeft) {
                //me.score += 1;
                me.meScore ++;
            } 
            else {
                me.oppScore ++;
                //opponent.score += 1;
            }
            resetBall();
        }
        else if (ball.posX <= 15) {
            if (me.isLeft) {
                me.oppScore ++;
                //opponent.score += 1;
            } 
            else {
                me.meScore ++;
                //me.score += 1;
            }
            resetBall();
        }

        if (me.isLeft) {
            sendScore();
        }
    };

    //lancer l update de la ball dans l interval 
    const updateBallPosition = () => {
 
        let playerLeft = me.isLeft ? me : opponent;
        let playerRight = me.isLeft ? opponent : me;

        // Vérifier les collisions avec les bords verticaux du canvas
        if (ball.posY <= 0  || ball.posY + ball.y >= def.WIN_H) {
            ball.velY = -ball.velY;
        }

        //collision avec les player
        if (((ball.posX <= playerLeft.posX + playerLeft.x) && (ball.posY + ball.y >= playerLeft.posY) && (ball.posY <= playerLeft.posY + playerLeft.y)) || 
            ((ball.posX + ball.x >= playerRight.posX) && (ball.posY + ball.y >= playerRight.posY) && (ball.posY <= playerRight.posY + playerRight.y))) {
            ball.velX = -ball.velX;
        }
        
        // // Mettre à jour la position de la balle en fonction de sa vitesse
        ball.posX += ball.velX * ball.speed;
        ball.posY += ball.velY * ball.speed;
        
        //check une fois le deplacement si il y a goal
        checkGoal();
        
        //a mettre dans l interval comme si on send update de la ball au joueur tout les x secondes
        sendBallPosition();
    };

    useEffect(() => {

        socket.on('updatePlayers', (backendPlayers) => {
            // Créer une copie mise à jour des joueurs
            const updatedPlayers = { ...players };

            // Mettre à jour les données des joueurs en fonction de backendPlayers
            
            for (const id in backendPlayers) {
                const backendPlayer = backendPlayers[id];
                if (!updatedPlayers[id])
                {      
                    if (socket.id === id) {
                        me.posX= backendPlayer.x;
                        me.id= id;
                        me.isLeft= backendPlayer.isLeft;
                        me.meScore= 0;
                        me.oppScore= 0;

                        updatedPlayers[id] = me;
                    }
                    else {
                        opponent.posX= backendPlayer.x; 
                        opponent.id= id;
                        opponent.isLeft= backendPlayer.isLeft;

                        updatedPlayers[id] = opponent;
                    }
                }
            }
            
            //supp le/les player si deconnexion
            for (const id in updatedPlayers) {
                if (!backendPlayers[id]) {
                    delete updatedPlayers[id];
                }
            }
            setPlayers(updatedPlayers);
        });
        
        socket.on("receive_position", (data) => {
            //envoye bien les donnee a l adversaire!
            opponent.posY = data;
        });

        // Écouter les mises à jour de la position de la balle depuis le serveur
        socket.on('receive_ball_pos', (newBall) => {
            ball.posX= newBall.posX;
            ball.posY= newBall.posY; 
            ball.velX= newBall.velX;
            ball.velY= newBall.velY;
        });

        socket.on('receive_score', (scores) => {
            if (!me.isLeft) {
                me.meScore = scores.oppScore;
                me.oppScore = scores.meScore;
            }

            console.log("me" + me.meScore);
            console.log("opp" + me.oppScore);
        });

        //voir si je peux utiliser intervalle pour le deplacement de la ball
        
        const interval = setInterval(() => {
            if (me.isLeft) {
                updateBallPosition();
            }

        }, 1000/60);
        
        //ecoute des input 
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
            
        // Nettoyage de l'écoute lorsque le composant se démonte
        return () => {
            //clear les input joueur
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            
            //clear les ecoute du serveur
            socket.off('updatePlayers');
            socket.off('receive_position');
            socket.off('receive_ball_pos');
            socket.off('receive_score');

            clearInterval(interval);
        };

    }, [ ]);
    
    return (
        <Canvas 
            width="800"
            height="600"
            myId={socket.id}
            me={me}
            opponent={opponent}
            ball={ball}
            />
    );
}
