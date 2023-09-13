import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { def } from "./Game/Constants";
import Canvas from './Game/GameCanvas';
import axios from 'axios';
import env from "react-dotenv";

const socket = io(env.URL_RED2);

interface GameProps {
  spec: boolean; // Assurez-vous que le type de props est correct
  roomName: string; // Assurez-vous que le type de props est correct
}

export default function Game(props: GameProps) {
  sessionStorage.setItem('idConv', '0');

  const ref = useRef<any>();
  const [inGame, setInGame] = useState(false);
  const [startedGame, setStartedGame] = useState(false);

  const isPlayer = props.spec;
  let players: { [key: string]: any } = {};
  let objMatch: any = {};
  let playerLeft: any;
  let playerRight: any;
  let twoConnected = false;
  let endGame = false;
  let rightScore = 0;
  let leftScore = 0;
  let req: number;

  const ball = {
    x: 20,
    y: 20,
    posX: def.WIN_W / 2 - 10,
    posY: def.WIN_H / 2 - 10,
    velX: 1,
    velY: 1,
    speed: 3
  };

  const me = {
    x: def.PL_W,
    y: def.PL_H,
    posX: 20,
    posY: def.WIN_H / 2 - def.PL_H / 2,
    speed: 7,
    meScore: 0,
    oppScore: 0,
    isLeft: false,
    roomName: "",
    name: "",
    id: 0,
    skin: 0
  };

  const opponent = {
    x: def.PL_W,
    y: def.PL_H,
    posX: 760,
    posY: def.WIN_H / 2 - def.PL_H / 2,
    speed: 7,
    meScore: 0,
    oppScore: 0,
    isLeft: false,
    roomName: "",
    name: "",
    id: 0,
    skin: 0
  };

  const handleKeyDown = (event: any) => {
    if (isPlayer && twoConnected) {
      if (me.isLeft && event.key === 'p' && startedGame === false) {
        playerLeft = me.isLeft ? me : opponent;
        playerRight = me.isLeft ? opponent : me;
        // vérifier si besoin de faire un event server pour recevoir le start game
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
        sendPosition();
      }
    }
  };

  const handleKeyUp = (event: any) => {
    if (isPlayer) {
      if (event.key === 'w' || event.key === 's') {
        me.speed = 0;
      }
    }
  };

  const createRoom = async () => {
    try {
      // condition qui empêche le joueur de configurer un jeu s'il y en a déjà un en cours et donc il est que spectateur
      const playerData = JSON.parse(sessionStorage.getItem('userData') || '{}');
      const gameID = playerData.ID;
      let jsonMatch;
      if (sessionStorage.getItem("selectFriend")) {
        const otherPlayer = parseInt(sessionStorage.getItem("selectFriend") || '0', 10);
        jsonMatch = await axios.get(env.URL_API + `/matches/${gameID}/search/${otherPlayer}`);
      } else {
        jsonMatch = await axios.get(env.URL_API + `/matches/${gameID}/search`);
      }
      objMatch = jsonMatch.data;
      socket.emit('create_room', objMatch.ID, objMatch);
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la requête:', error);
    }
  };

  const joinRoom = () => {
    console.log("join");
    // voir si il faut faire une requête ou si on récupère la roomName d'une autre manière
    socket.emit('join_spectator', props.roomName);
  };

  const sendPosition = () => {
    socket.emit("send_position", me, me.roomName, opponent);
  };

  const sendBallPosition = () => {
    socket.emit("send_ball_pos", ball, me.roomName);
  };

  const sendScore = () => {
    socket.emit("send_score", leftScore, rightScore, me.roomName);
  };

  const reset = () => {
    ball.posX = def.WIN_W / 2 - 10;
    ball.posY = def.WIN_H / 2 - 10;

    me.posY = def.WIN_H / 2 - 50;
    opponent.posY = def.WIN_H / 2 - 50;

    sendPosition();
  };

  const checkGoal = () => {
    if (ball.posX + ball.x >= def.WIN_W - 15) {
      if (me.isLeft) {
        leftScore++;
        const meElement = document.getElementById('me');
        if (meElement) {
          meElement.textContent = leftScore.toString();
        }
      } else {
        rightScore++;
        const oppElement = document.getElementById('opp');
        if (oppElement) {
          oppElement.textContent = rightScore.toString();
        }
      }
      reset();
    } else if (ball.posX <= 15) {
      if (me.isLeft) {
        rightScore++;
        const oppElement = document.getElementById('opp');
        if (oppElement) {
          oppElement.textContent = rightScore.toString();
        }
      } else {
        leftScore++;
        const meElement = document.getElementById('me');
        if (meElement) {
          meElement.textContent = leftScore.toString();
        }
      }
      reset();
    }

    if (me.isLeft) {
      sendScore();
    }

    if (leftScore === 1 || rightScore === 1) {
      if (me.isLeft) {
        sendRequest(leftScore, rightScore, me);
      }
      const user = JSON.parse(sessionStorage.getItem('userData') || '{}');
      sessionStorage.setItem('idConv', '0');
      sessionStorage.setItem('idUserInfos', user.ID);
      sessionStorage.removeItem('selectFriend');
      window.location.replace(env.URL_REACT);
    }
  };

  const updateBallPosition = () => {
    // Vérifier les collisions avec les bords verticaux du canvas
    if (ball.posY <= 0 || ball.posY + ball.y >= def.WIN_H) {
      ball.velY = -ball.velY;
    }

    // collision horizontale
    if (
      (ball.posX <= playerLeft.posX + playerLeft.x) &&
      (ball.posX + ball.x >= playerLeft.posX) &&
      (ball.posY <= playerLeft.posY + playerLeft.y) &&
      (ball.posY + ball.y >= playerLeft.posY) ||
      (ball.posX + ball.x >= playerLeft.posX) &&
      (ball.posX <= playerLeft.posX + playerLeft.x) &&
      (ball.posY <= playerLeft.posY + playerLeft.y) &&
      (ball.posY >= playerLeft.posY - ball.y)
    ) {
      ball.velY = -ball.velY;
    }

    // collision verticale avec les joueurs
    if (
      ((ball.posX <= playerLeft.posX + playerLeft.x) &&
        (ball.posY + ball.y >= playerLeft.posY) &&
        (ball.posY <= playerLeft.posY + playerLeft.y)) ||
      ((ball.posX + ball.x >= playerRight.posX) &&
        (ball.posY + ball.y >= playerRight.posY) &&
        (ball.posY <= playerRight.posY + playerRight.y))
    ) {
      ball.velX = -ball.velX;
    }

    // Mettre à jour la position de la balle en fonction de sa vitesse
    ball.posX += ball.velX;
    ball.posY += ball.velY;

    checkGoal();

    sendBallPosition();

    if (!endGame) {
      req = requestAnimationFrame(updateBallPosition);
    } else {
      cancelAnimationFrame(req);
    }
  };

  const sendRequest = async (score1: number, score2: number, me: any) => {
    try {
      console.log(score1 + " - " + score2);
      await axios.post(env.URL_API + `/matches/end`, {
        "Score_user1": score1,
        "Score_user2": score2,
        "Id": me.roomName
      });

    } catch (error) {
      console.error('Une erreur s\'est produite lors de la requête:', error);
    }
  };

  useEffect(() => {
    if (isPlayer) {
      createRoom();
    } else {
      joinRoom();
    }

    socket.on('update_players', (backendPlayers) => {
      for (const id in backendPlayers) {
        const backendPlayer = backendPlayers[id];

        if (!players[id]) {
          console.log("ID: " + id + " - X: " + backendPlayer.x + " - left:" + backendPlayer.isLeft);
          if (socket.id === id || (!isPlayer && backendPlayer.isLeft)) {
            me.id = parseInt(id);
            me.posX = backendPlayer.x;
            me.isLeft = backendPlayer.isLeft;
            me.name = backendPlayer.name;
            me.roomName = backendPlayer.roomName;
            me.skin = backendPlayer.skin;
          } else {
            opponent.id = parseInt(id);
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

      for (const id in players) {
        if (!backendPlayers[id]) {
          console.log("the other player left the game " + players[id]);
          sendRequest(leftScore, rightScore, me);
          const user = JSON.parse(sessionStorage.getItem('userData') || '{}');
          sessionStorage.setItem('idConv', '0');
          sessionStorage.setItem('idUserInfos', user.ID);
          sessionStorage.removeItem('selectFriend');
          window.location.replace(env.URL_REACT);
        }
      }
    });

    socket.on("receive_position", (data) => {
      opponent.posY = data.posY;
    });

    socket.on('receive_ball_pos', (newBall) => {
      ball.posX = newBall.posX;
      ball.posY = newBall.posY;
      ball.velX = newBall.velX;
      ball.velY = newBall.velY;
    });

    socket.on('receive_score', (lfScore, rtScore) => {
      leftScore = lfScore;
      rightScore = rtScore;
      checkGoal();

      const meElement = document.getElementById('me');
      if (meElement) {
        meElement.textContent = leftScore.toString();
      }

      const oppElement = document.getElementById('opp');
      if (oppElement) {
        oppElement.textContent = rightScore.toString();
      }
    });

    socket.on('end_game', () => {
      const user = JSON.parse(sessionStorage.getItem('userData') || '{}');
      sessionStorage.setItem('idConv', '0');
      sessionStorage.setItem('idUserInfos', user.ID);
      window.location.replace(env.URL_REACT);
    });

    if (!endGame) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);

      socket.off('update_players');
      socket.off('receive_position');
      socket.off('receive_ball_pos');
      socket.off('receive_score');
      socket.off('end_game');
    };

  }, []);

  return (
    <Canvas
      width="800"
      height="600"
      me={me}
      opponent={opponent}
      ball={ball}
    />
  );
}
