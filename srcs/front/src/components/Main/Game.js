import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client'
import { def } from "./Game/Constants";
import Canvas from './Game/GameCanvas';
import axios from 'axios';
import env from "react-dotenv";
const socket = io(env.URL_RED2);

//si spectator envoyer un props props.spec a false sinon true et ajouter un roomID si spectator
export default function Game(props)  {
	sessionStorage.setItem('idConv', 0);

	const ref=useRef();
    const [inGame, setInGame] = useState(false);
    const [startedGame, setStartedGame] = useState(false);
    
    let isPlayer = props.spec;
    let players = {};
    let objMatch = {};
    let playerLeft;
    let playerRight;
    let twoConnected = false;
    let rightScore = 0;
    let leftScore = 0;
    
    const ball = {
        x: 20, 
        y: 20, 
        posX: def.WIN_W/2 - 10, 
        posY: def.WIN_H/2 - 10, 
        velX: 1, 
        velY: 1, 
        speed: 3
    };
    
    const me = {
        x: def.PL_W,
        y: def.PL_H,
        posX: 20,
        posY: def.WIN_H/2 - 10,
        speed: 7,
        meScore: 0,
        oppScore: 0,
        isLeft: false,
        roomName: "",
        name: "",
        id: 0,
    };
    
    const opponent = {
        x: def.PL_W,
        y: def.PL_H,
        posX: 760,
        posY: def.WIN_H/2 - 10,
        speed: 7,
        meScore: 0,
        oppScore: 0,
        isLeft: false,
        roomName: "",
        name: "",
        id: 0,
    };

    const handleKeyDown = (event) => {
        if (isPlayer && twoConnected) {
            if (me.isLeft && event.key === 'p' && startedGame === false) {
                playerLeft = me.isLeft ? me : opponent;
                playerRight = me.isLeft ? opponent : me;
                //verifier si besoin de fqire un event server pour receptionner le starrt ga;e
                setStartedGame(true);
                updateBallPosition();
            }
            if (event.key === 'w' && me.posY > 0) {
                me.speed = -5;
                me.posY += me.speed;
                sendPosition(); 
            } 
            else if (event.key === 's' && me.posY + def.PL_H < def.WIN_H) {
                me.speed = 5;
                me.posY += me.speed;
                sendPosition(); // Assurez-vous également de mettre à jour cette fonction pour envoyer la nouvelle position.
            }
        }
    };

    const handleKeyUp = (event) => {
        if (isPlayer) {
            if (event.key === 'w' || event.key === 's') {
                me.speed = 0;
            }
        }
    };
    
    const createRoom = async () => {
        try {
            //condition qui empeche le joueur de setup un game si deja une en cours et donc il est que spectator
            const playerData = JSON.parse(sessionStorage.getItem('userData'));
            const gameID = playerData.ID;
            let jsonMatch;
		    if (sessionStorage.getItem("selectFriend"))
            {
                const otherPlayer = parseInt((sessionStorage.getItem("selectFriend") || 'null'))
                jsonMatch = await axios.get(env.URL_API + `/matches/${gameID}/search/${otherPlayer}`);
            }
            else
                jsonMatch = await axios.get(env.URL_API + `/matches/${gameID}/search`);
            objMatch = jsonMatch.data;
            socket.emit('create_room', objMatch.ID, objMatch);
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la requête:', error);
        }
    };

    const joinRoom = () => {
        console.log("join");
        //voir si il faut faire une requete ou si on recup la roomName d une autre maniere
        socket.emit('join_spectator', props.roomName);
    };

    const sendPosition = () => {
        socket.emit("send_position", me.posY, me.roomName);
    };

    const sendBallPosition = () => {
        socket.emit("send_ball_pos", ball, me.roomName);
    };

    const sendScore = () => {
        socket.emit("send_score", leftScore, rightScore, me.roomName);
    }

    const reset = () => {
        ball.posX = def.WIN_W /2 -10;
        ball.posY = def.WIN_H /2 - 10;

        me.posY = def.WIN_H/2 - 50;
        opponent.posY = def.WIN_H/2 - 50;

        sendPosition();
    }

    const checkGoal = () => {

        if (ball.posX + ball.x >= def.WIN_W - 15) {
            if (me.isLeft) {
                leftScore++;
                document.getElementById('me').textContent = leftScore
            } 
            else {
                rightScore++;
                document.getElementById('opp').textContent = rightScore
            }
            reset();
        }
        else if (ball.posX <= 15) {
            if (me.isLeft) {
                rightScore++;
                document.getElementById('opp').textContent = rightScore;
            } 
            else {
                leftScore++;
                document.getElementById('me').textContent = leftScore;
            }
            reset();
        }

       if (me.isLeft) {
            sendScore();
        }

        //a tester avec Hugo
        if (leftScore === 1 || rightScore === 1) {

            if (me.isLeft) 
                sendRequest(leftScore, rightScore, me);
  
            let user = JSON.parse(sessionStorage.getItem('userData') || 'null')
            sessionStorage.setItem('idConv', '0');
            sessionStorage.setItem('idUserInfos', user.ID);
            sessionStorage.removeItem('selectFriend');
            window.location.replace(env.URL_REACT);
        }
    };

    const updateBallPosition = () => {
        
        // Vérifier les collisions avec les bords verticaux du canvas
        if (ball.posY <= 0  || ball.posY + ball.y >= def.WIN_H) {
            ball.velY = -ball.velY;
        }
        
        //collision horizontale
        if ((ball.posX <= playerLeft.posX + playerLeft.x) && (ball.posX + ball.x >= playerLeft.posX) &&   (ball.posY <= playerLeft.posY + playerLeft.y) && (ball.posY + ball.y >= playerLeft.posY) || 
            (ball.posX + ball.x >= playerLeft.posX) && (ball.posX <= playerLeft.posX + playerLeft.x) && (ball.posY <= playerLeft.posY + playerLeft.y) && (ball.posY >= playerLeft.posY - ball.y)) {
            ball.velY = -ball.velY;
        }

        //collision vertical avec les player
        if (((ball.posX <= playerLeft.posX + playerLeft.x) && (ball.posY + ball.y >= playerLeft.posY) && (ball.posY <= playerLeft.posY + playerLeft.y)) || 
            ((ball.posX + ball.x >= playerRight.posX) && (ball.posY + ball.y >= playerRight.posY) && (ball.posY <= playerRight.posY + playerRight.y))) {
            ball.velX = -ball.velX;
        }

        // // Mettre à jour la position de la balle en fonction de sa vitesse
        ball.posX += ball.velX;
        ball.posY += ball.velY;
        // ball.posX += ball.velX * ball.speed;
        // ball.posY += ball.velY * ball.speed;
        
        //check une fois le deplacement si il y a goal
        checkGoal();
        
        //a mettre dans l interval comme si on send update de la ball au joueur tout les x secondes
        sendBallPosition();
        
        requestAnimationFrame(updateBallPosition);
    };

    const sendRequest = async (score1, score2, me) => {
        try {
            console.log(score1 + " - " +  score2);
            await axios.post(env.URL_API + `/matches/end`,{
                "Score_user1" : score1,
                "Score_user2" : score2,
                "Id": me.roomName
            });

        } catch (error) {
            console.error('Une erreur s\'est produite lors de la requête:', error);
        }
    };

    useEffect(() => {
        //console.log("win win X: " + sizeScreen.width + "win hei Y: " + sizeScreen.height);
        
        if(isPlayer) {
            console.log(isPlayer);
            createRoom();
        }

        else
            joinRoom();

        socket.on('update_players', (backendPlayers) => {
            // console.log(backendPlayers);
            // console.log("connection socket ID: " + socket.id);
            // Mettre à jour les données des joueurs en fonction de backendPlayers

            for (const id in backendPlayers) {
                const backendPlayer = backendPlayers[id];
                console.log(backendPlayer);
                console.log("ID: " + id + " - X: " + backendPlayer.x + " - left:" + backendPlayer.isLeft);

                if (!players[id])
                {
                    console.log("ID: " + id + " - X: " + backendPlayer.x + " - left:" + backendPlayer.isLeft);
                    if (socket.id === id || (!isPlayer && backendPlayer.isLeft)) {
                        me.id = id;
                        me.posX = backendPlayer.x;
                        me.isLeft = backendPlayer.isLeft;
                        me.name = backendPlayer.name;
                        me.roomName = backendPlayer.roomName;
                        me.skin = backendPlayer.skin;
                    }
                    else {
                        opponent.id = id;
                        opponent.posX = backendPlayer.x;
                        opponent.isLeft = backendPlayer.isLeft;
                        opponent.name = backendPlayer.name;
                        opponent.roomName = backendPlayer.roomName;
                        opponent.skin = backendPlayer.skin;
                        twoConnected = true;
                    }
                    players[id] = backendPlayer;
                }
            }

            //supp le/les player si deconnexion
           
            for (const id in players) {
                if (!backendPlayers[id]) {
                    //si doconnexion gerer comme lorsqu on clique sur trancescendqnce et quitte
                    console.log("the other player left the game " + players[id]);
                    //players[id].remove();
                    sendRequest(leftScore, rightScore, me);
                    let user = JSON.parse(sessionStorage.getItem('userData') || 'null')
                    sessionStorage.setItem('idConv', '0');
                    sessionStorage.setItem('idUserInfos', user.ID);
                    sessionStorage.removeItem('selectFriend');
                    window.location.replace(env.URL_REACT);
                }
            }
            //console.log("players in client updated Players");
            //console.log(updatedPlayers);
        });

        socket.on('game_started', (data) => {
            setInGame(data);
            console.log("game started: " + inGame);
        });

        socket.on("receive_position", (data) => {
            opponent.posY = data;
        });

        socket.on('receive_ball_pos', (newBall) => {
            ball.posX= newBall.posX;
            ball.posY= newBall.posY; 
            ball.velX= newBall.velX;
            ball.velY= newBall.velY;
        });

        socket.on('receive_score', (lfScore, rtScore) => {
            leftScore = lfScore;
            rightScore = rtScore;
            checkGoal();

            document.getElementById('me').textContent = leftScore
            document.getElementById('opp').textContent = rightScore

        });

        socket.on('end_game', () => {
            let user = JSON.parse(sessionStorage.getItem('userData') || 'null')
            sessionStorage.setItem('idConv', '0');
            sessionStorage.setItem('idUserInfos', user.ID);
            window.location.replace(env.URL_REACT);
        });

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
            
        // Nettoyage de l'écoute lorsque le composant se démonte
        return () => {
            //clear les input joueur
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            
            //clear les ecoute du serveur
            socket.off('update_players');
            socket.off('receive_position');
            socket.off('receive_ball_pos');
            socket.off('receive_score');
        };

    }, [  ]);
   // }, [ inGame, startedGame ]);
    
    return (
        <Canvas 
            width="800"
            height="600"
            // sizeScreen={sizeScreen}
            // updateScreen={updateScreen}
            me={me}
            opponent={opponent}
            ball={ball}
            //inGame= {inGame}
            //startedGame= {startedGame}
        /> 
    );
}
