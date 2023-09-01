import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client'
import { def } from "./Game/Constants";
import Canvas from './Game/GameCanvas';
import axios from 'axios';


export default function Game() { 
	sessionStorage.setItem('idConv', 0);

    //le soucis vient de l url qui n est pas bon et donc ne sait pas se connecter
    //utiliser une var d environnemen? `${process.env.REACT_APP_BACKEND_SOCKET}`
    const socket = io("http://127.0.0.1:3002");
    // const [sizeScreen, updateScreen] = useState({width: 800, height: 600});
    // let ratioX = sizeScreen.height/def.WIN_H;
    // let ratioY = sizeScreen.width/def.WIN_W;
	const ref=useRef();
    let gameStarted = false;
    let playerLeft;
    let playerRight;
    
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
        speed: 7, 
        meScore: 0, 
        oppScore: 0,
        isLeft:true //test ball
    };
    
    let opponent = {
        x: def.PL_W, 
        y: def.PL_H, 
        posX: 760,
        posY: def.WIN_H/2 - 10,
        speed: 7, 
        meScore: 0, 
        oppScore: 0, 
        isLeft:false //test ball

    };
    const [players, setPlayers] = useState({});
    
    //je peux passer la nouvelle position en parametre et puis l envoyer en param de socket emit
    const sendPosition = () => {
        socket.emit("send_position", me.posY);
    };

    const handleKeyDown = (event) => {
        if (!gameStarted && event.key === 'p') { //me.isLeft &&
            playerLeft = me.isLeft ? me : opponent;
            playerRight = me.isLeft ? opponent : me;
            gameStarted = true;
            updateBallPosition(); // Démarrer la mise à jour de la position de la balle
        }
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
    const reset = () => {
        ball.posX = def.WIN_W /2 -10;
        ball.posY = def.WIN_H /2 - 10;

        me.posY = def.WIN_H/2 - 10;
        sendPosition();
    }

    const checkGoal = () => {

        if (ball.posX + ball.x >= def.WIN_W - 15) {
            if (me.isLeft) {
                me.meScore ++;
            } 
            else {
                me.oppScore ++;
            }
            reset();
        }
        else if (ball.posX <= 15) {
            if (me.isLeft) {
                me.oppScore ++;
            } 
            else {
                me.meScore ++;
            }
            reset();
        }

        if (me.isLeft) {
            sendScore();
        }

        if (me.meScore === 5 || me.oppScore === 5) {
            console.log("game end");
        }
    };

    //lancer l update de la ball dans l interval 
    const updateBallPosition = () => {
        
        // Vérifier les collisions avec les bords verticaux du canvas
        if (ball.posY <= 0  || ball.posY + ball.y >= def.WIN_H) {
            ball.velY = -ball.velY;
        }

        //collision avec les player
        //fonctionne bizarrement quand les player ne sont pas bien setup
        if (((ball.posX <= playerLeft.posX + playerLeft.x) && (ball.posY + ball.y >= playerLeft.posY) && (ball.posY <= playerLeft.posY + playerLeft.y)) || 
            ((ball.posX + ball.x >= playerRight.posX) && (ball.posY + ball.y >= playerRight.posY) && (ball.posY <= playerRight.posY + playerRight.y))) {
            ball.velX = -ball.velX;
        }
        
        // // Mettre à jour la position de la balle en fonction de sa vitesse
        ball.posX += ball.velX;
        ball.posY += ball.velY;
        // ball.posX += ball.velX * ball.speed;
        // ball.posY += ball.velY * ball.speed;
        //console.log("ball posX: " + ball.posX + " - ball posY: " + ball.posY);
        
        //check une fois le deplacement si il y a goal
        checkGoal();
        
        //a mettre dans l interval comme si on send update de la ball au joueur tout les x secondes
        sendBallPosition();
        
        requestAnimationFrame(updateBallPosition);
    };

    useEffect(() => {
        //console.log("win win X: " + sizeScreen.width + "win hei Y: " + sizeScreen.height);

        socket.on('setupGame', async () => {
            try {
                const playerData = JSON.parse(sessionStorage.getItem('userData'));
                //console.log(playerData);
                const gameID = playerData.ID;
                //le gameId est a 2 donc erreur de requete
                //console.log(gameID);
                const jsonMatch = await axios.get(`http://127.0.0.1:3002/matches/${gameID}/search`);
                const objMatch = JSON.parse(jsonMatch.data);
                //console.log(objMatch); 
                socket.emit('setup_game', objMatch);
                //setupPlayer(objMatch);              
            } catch (error) {
                console.error('Une erreur s\'est produite lors de la requête:', error);
            }
        });

        //passe dans ce socket encore et encore pq??
        socket.on('updatePlayers', (backendPlayers) => {
            //verifier si les data setup au premier socket donc avant le socket.mit  du serveur sont tjr bonne
            console.log(backendPlayers);
            console.log("connection socket ID: " + socket.id);
            // Créer une copie mise à jour des joueurs
            const updatedPlayers = { ...players };

            // Mettre à jour les données des joueurs en fonction de backendPlayers
            
            for (const id in backendPlayers) {
                const backendPlayer = backendPlayers[id];
                if (!updatedPlayers[id])
                {
                    console.log("id loop:" + id);
                    const player = {
                        posX: backendPlayer.x,
                        posY: def.WIN_H / 2 - 10,
                        speed: 5,
                        id: id,
                        isLeft: backendPlayer.isLeft,
                        meScore: 0,
                        oppScore: 0
                    };

                    updatedPlayers[id] = player;

                    if (socket.id === id) {
                        me = player;
                        console.log("me socketID is ID: " + socket.id);
                    } else {
                        opponent = player;
                        console.log("me socketID is not ID (socket): " + socket.id + " socketID is not ID(ID): " + id);
                    }
                }
            }
            
            //supp le/les player si deconnexion
            for (const id in updatedPlayers) {
                if (!backendPlayers[id]) {
                    delete updatedPlayers[id];
                }
            }
            console.log("players in client updated Players");
            console.log(updatedPlayers);
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

        console.log("PLAYER LEFT PRESS p TO START GAME");

        //voir si je peux utiliser intervalle pour le deplacement de la ball
        // console.log(me);
        // console.log("is left" + me.isLeft);
        // const interval = setInterval(() => {
        //     updateBallPosition();
        //     if (me.isLeft) {
        //     }

        // }, 1000/60);

        // if (me.isLeft) {
            //updateBallPosition(); // Démarrer la mise à jour de la position de la balle
        // }
        
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

            //clearInterval(interval);
        };

    }, [ ]);
    
    return (
        <Canvas 
            width="800"
            height="600"
            // sizeScreen={sizeScreen}
            // updateScreen={updateScreen}
            myId={socket.id}
            me={me}
            opponent={opponent}
            ball={ball}
            />
    );
}
