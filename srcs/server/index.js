const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

//import Paddle from '../client/src/game/Paddle.js';
//const def  = import('../client/src/game/Constants.js'); 

app.use(cors());

const server = http.createServer(app);
const io  = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    //transports: ['websocket', 'polling'], 
});


const players = {  };
// a chaque connection d un user
io.on("connection", (socket) => {
    //modifier en fonction des var de Hugo si player 1 (personne qui lance la game) 
    //ou 2 persopnne qui accepte
    console.log("players");
    console.log(players);
    if (Object.keys(players).length <= 2) {
        if (Object.keys(players).length === 0) {
            console.log("if nb obj: " + Object.keys(players).length);
            players[socket.id] = {
                x: 20,
                isLeft: true
            };
        }
         else if(Object.keys(players).length === 1) {
            console.log("else if nb obj: " + Object.keys(players).length);
            players[socket.id] = {
                x: 760, 
                isLeft: false
            };
        }
    }
    
    if (Object.keys(players).length !== 2) {
        //serveur emet quand quelqu un se co
        console.log("update player: " + Object.keys(players).length);
        io.emit('updatePlayers', players);
    }
    
    //update la position du player quand il bouge (normalement)
    //recois un event comme quoi la position du joueur a bouge
    //il faut renvoyer un event pour prevenir tous les autres
    socket.on("send_position", (data) => {
        // Diffusez la nouvelle position à tous les autres joueurs sauf l'expéditeur
        socket.broadcast.emit('receive_position', data);
    });
    
    socket.on("send_ball_pos", (data) => {
        //envoi au joueur inviter la pos de la ball
        socket.broadcast.emit('receive_ball_pos', data);
    });
    
    socket.on("send_score", (data) => {
        //envoi au joueur inviter la pos de la ball
        socket.broadcast.emit('receive_score', data);
    });
    
    socket.on('disconnect', (reason) => {
        console.log(reason);
        delete players[socket.id];
        io.emit('updatePlayers', players);
    
        // Informez tous les autres joueurs qu'un joueur s'est déconnecté
        socket.broadcast.emit('playerDisconnected', socket.id);
    });
});


server.listen(3002, () => {
    console.log("SERVER IS RUNNING");
});