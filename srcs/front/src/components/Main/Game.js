import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client'
import { def } from "./Game/Constants";
import Canvas from './Game/GameCanvas';
import axios from 'axios';

//si spectator envoyer un props isPlayer a false sinon true et ajouter un roomID si spectator
export default function Game()  {
	sessionStorage.setItem('idConv', 0);

    const socket = io("http://127.0.0.1:3002");

    // const [sizeScreen, updateScreen] = useState({width: 800, height: 600});
    // let ratioX = sizeScreen.height/def.WIN_H;
    // let ratioY = sizeScreen.width/def.WIN_W;
	const ref=useRef();
    const [players, setPlayers] = useState({});
    const [inGame, setInGame] = useState(false);
    let createdRoom = false;
    let playerLeft;
    let playerRight;
    //a passer en parametre dans game
    let isPlayer = true;
    //let inGame = false;
    
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
        id: 0,
    };

    const handleKeyDown = (event) => {
        if (isPlayer) {
            if (me.isLeft && event.key === 'p') {
                playerLeft = me.isLeft ? me : opponent;
                playerRight = me.isLeft ? opponent : me;
                updateBallPosition();
            }
            if (event.key === 'w' && me.posY > 0) {
                me.speed = -5;
                me.posY += me.speed;
                sendPosition(); 
            } else if (event.key === 's' && me.posY + def.PL_H < def.WIN_H) {
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
            console.log("player started game");
            const playerData = JSON.parse(sessionStorage.getItem('userData'));
            //console.log(playerData);
            const gameID = playerData.ID;
            //console.log(gameID);
            const jsonMatch = await axios.get(`http://127.0.0.1:3001/matches/${gameID}/search`);
            const objMatch = jsonMatch.data;
            //console.log(objMatch); 
            socket.emit('create_room', objMatch.ID, objMatch);
            createdRoom = true;
            me.roomName = objMatch.ID;
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la requête:', error);
        }
    };

    // const launchGame = () => {
    //     socket.emit('set_player', objMatch.ID, objMatch);
    //     me.roomName = objMatch.ID;
    // };

    // const joinRoom = () => {
    //     //voir si il faut faire une requete ou si on recup la roomName d une autre maniere
    //     socket.emit('join_spectator', 4);
    // };

    const sendPosition = () => {
        socket.emit("send_position", me.posY, me.roomName);
    };

    const sendBallPosition = () => {
        socket.emit("send_ball_pos", ball, me.roomName);
    };

    const sendScore = () => {
        socket.emit("send_score", me, me.roomName);
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
            axios.post({
                "Score_user1" : me.meScore,
                "Score_user2" : me.oppScore,
                "Id": me.roomName
            });
        }
    };

    const updateBallPosition = () => {
        
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

    const sendRequest = async () => {
        try {
            await axios.post(`http://127.0.0.1:3001/matches/end`,{
                "Score_user1" : 5,
                "Score_user2" : 0,
                "Id": me.roomName
            });
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la requête:', error);
        }
    };

    useEffect(() => {
        //console.log("win win X: " + sizeScreen.width + "win hei Y: " + sizeScreen.height);
 
        if (isPlayer && !createdRoom) {
            createRoom();
        }

        if(!isPlayer) {
            //joinRoom();
        }

        socket.on('update_players', (backendPlayers) => {
            // console.log(backendPlayers);
            // console.log("connection socket ID: " + socket.id);
            // Créer une copie mise à jour des joueurs
            const updatedPlayers = { ...players };
            console.log(backendPlayers);
    
            // Mettre à jour les données des joueurs en fonction de backendPlayers
    
            for (const id in backendPlayers) {
                const backendPlayer = backendPlayers[id];
                console.log(backendPlayer);
                if (!updatedPlayers[id] && Object.keys(updatedPlayers).length < 3)
                {
                    console.log("ID: " + id + " - X: " + backendPlayer.x + " - left:" + backendPlayer.isLeft);
                    if (socket.id === id) {
                        me.id = id;
                        me.posX = backendPlayer.x;
                        me.isLeft = backendPlayer.isLeft;
                    }
                    else {
                        opponent.id = id;
                        opponent.posX = backendPlayer.x;
                        opponent.isLeft = backendPlayer.isLeft;
                    }
                    console.log("ME ID: " + me.id + " -ME X: " + me.posX + " -ME left:" + me.isLeft);
                    console.log("OP ID: " + opponent.id + " -OP X: " + opponent.posX + " -OP left:" + opponent.isLeft);
                    updatedPlayers[id] = backendPlayer;
                }
            }

            if(!inGame && players.length > 1) {
                console.log("start game");
                setInGame(true);
                socket.emit("game_started", inGame, me.roomName);
                //inGame = true;
            }

            //supp le/les player si deconnexion
            for (const id in updatedPlayers) {
                if (!backendPlayers[id]) {
                    console.log("the other player left the game " + updatedPlayers[id]);
                    updatedPlayers[id].remove();
                    delete updatedPlayers[id];
                }
            }
            //console.log("players in client updated Players");
            //console.log(updatedPlayers);
            setPlayers(updatedPlayers);
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

        socket.on('receive_score', (scores) => {
            if (!me.isLeft) {
                me.meScore = scores.oppScore;
                me.oppScore = scores.meScore;
            }

            console.log("me" + me.meScore);
            console.log("opp" + me.oppScore);
        });
        
        socket.on('player_left', (disconnectID) => {
            //definir qui est user 1 et 2 (genre le player qui lance la game est 1 et l autre 2)
            //dans ce cas ajouter des conditions isLeft....
            console.log("the other player left the game " + disconnectID);
            sendRequest();
        });

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
            
        // Nettoyage de l'écoute lorsque le composant se démonte
        return () => {
            //clear les input joueur
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            
            //clear les ecoute du serveur
            socket.off('setup_player');
            socket.off('receive_position');
            socket.off('receive_ball_pos');
            socket.off('receive_score');
            socket.off('player_left');
        };

    }, [ ]);
    
    return (
        <Canvas 
            width="800"
            height="600"
            // sizeScreen={sizeScreen}
            // updateScreen={updateScreen}
            me={me}
            opponent={opponent}
            ball={ball}
            inGame= {inGame}
        /> 
    );
}
