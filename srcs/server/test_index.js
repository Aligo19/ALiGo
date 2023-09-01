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
    transports: ['websocket', 'polling'], 
});

const players = {  };
const gameStarted = false;
let matches = {};

io.on("connection", async (socket) => {

    //a la connexion emit un event 
    socket.emit("setupGame", socket.id);

    // socket.once(eventName, listener)
    // Adds a one-time listener function for the event named eventName
    //utilisée pour écouter un événement une seule fois.

    //a voir si ca fonctionne du fait qu'on set pas de game avant?
    socket.once("setup_game", (objMatch) => {
        matches = objMatch;
        //console.log(matches);
        console.log(objMatch);
        if (objMatch.ID_user2 === null) {
            console.log("ici");
            players[socket.id] = {      //[objMatch.ID_user1.ID] = {
                x: 20,
                isLeft: true
            };
            console.log(players);
            console.log(players[socket.id]);
            //pas sur car le obj playe peu changer et ne plus avoir les datas dont j ai besoin a voir
            socket.join(matches.ID);
            io.to(matches.ID).emit('updatePlayers', players);
        } else if (objMatch.ID_user2) {
            console.log(players);
            players[socket.id] = {
                x: 760,
                isLeft: false
            };
            //voir si pas de soucis du fait que je set pas de room avant et etre sur que les data sont tjr au bon endroit apres le socket join
            //pas sur car le obj playe peu changer et ne plus avoir les datas dont j ai besoin a voir
            socket.join(matches.ID);
            io.to(matches.ID).emit('updatePlayers', players);
        }
    });
   
    //si la game demarre on emet plus vers le client car il a les donnees necessaire au client
    //cela pourrait il causer des problemes pour les gens qui veulent regarder la game? ou alors tuot fonctionnerai bien avec le join game dudessus
    // if (!gameStarted) {
    //     io.to(objMatch.ID).emit('updatePlayers', players);

    //     if (Object.keys(players).length === 2) {
    //         gameStarted = true;
    //     }
    // }
    

    socket.on("send_position", (data) => {
        // Diffusez la nouvelle position à tous les autres joueurs sauf l'expéditeur
        socket.to(matches.ID).emit('receive_position', data);
    });
    
    socket.on("send_ball_pos", (data) => {
        //envoi au joueur inviter la pos de la ball
        socket.to(matches.ID).emit('receive_ball_pos', data);
    });
    
    socket.on("send_score", (data) => {
        //envoi au joueur inviter la pos de la ball
        socket.to(matches.ID).emit('receive_score', data);
    });
    
    socket.on('disconnect', (reason) => {
        console.log(reason);
        delete players[socket.id];
        io.in(matches.ID).emit('updatePlayers', players);
    });
});

server.listen(3002, () => {
    console.log("SERVER IS RUNNING");
});