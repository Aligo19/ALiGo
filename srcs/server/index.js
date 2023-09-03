const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);
const io  = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    //transports: ['websocket', 'polling'], 
});

let send_players = {  };
let gameStarted = false;
let rooms = {};

io.on("connection", (socket) => {

    //save les joueurs d une autre facon 
    //l idee c est que les players soit savent dans un tableau player avec leur id et qu a cet endroit on save la room name pour la recup avec le socket  id pour palier quand le player quitte et quand faut le kick
    // const players[socket.id] = {
    //     roomName: "",
    // }

    socket.on('create_room', (roomName, objMatch) => {
        if (!rooms[roomName]) {
            rooms[roomName] = {
                players: [],
                spectators: []
            };
        }
        if (Object.keys(rooms[roomName].players) < 3) {
            rooms[roomName].players.push(socket.id);
        }
        else {
            //envoier une var dans client pour qu il n ait pas acces au input
            rooms[roomName].spectators.push(socket.id);
        }
        socket.join(roomName);

        if (objMatch.ID_user2 === null) {
            send_players[socket.id] = {
                x: 20,
                isLeft: true
            };
            console.log(send_players[socket.id]);
            io.to(roomName).emit('setup_player', send_players);
        } else if (objMatch.ID_user2) {
            send_players[socket.id] = {
                x: 760,
                isLeft: false
            };
            console.log(send_players[socket.id]);
            gameStarted = true;
            io.to(roomName).emit('setup_player', send_players);
        }

        console.log("player: " + socket.id + " | joined room:" + roomName);
    });

    //voir si besoin de passer des data
    socket.on('join_spectator', () => {

    });

    socket.on('send_position', (data, roomName) => {
        // Diffusez la nouvelle position à tous les autres joueurs sauf l'expéditeur
        socket.to(roomName).emit('receive_position', data);
    });
    
    socket.on('send_ball_pos', (data, roomName) => {
        //envoi au joueur inviter la pos de la ball
        socket.to(roomName).emit('receive_ball_pos', data);
    });
    
    socket.on('send_score', (data, roomName) => {
        //envoi au joueur inviter la pos de la ball
        socket.to(roomName).emit('receive_score', data);
    });

    socket.on('disconnecting', () => {

    });
    
    socket.on('disconnect', (reason) => {
        console.log(reason);
        delete send_players[socket.id];
        
        console.log("ID been disconnected: " + socket.id);
        
        for (const roomName in rooms) {
            const room = rooms[roomName];
            
            // Supprimer le joueur de la liste des joueurs de la salle
            const playerIndex = room.players.indexOf(socket.id);
            if (playerIndex !== -1) {
                console.log(room.players);
                room.players.splice(playerIndex, 1);
                io.in(room).emit('setup_player', send_players);

                // Si la salle n'a plus de joueurs, vous pouvez la supprimer si nécessaire
                if (room.players.length === 0) {
                    delete rooms[roomName];
                }

                // Émettre un événement pour informer les autres joueurs de la déconnexion
                io.to(roomName).emit('player_disconnect', socket.id);
            }

            // Vous pouvez également gérer le cas où le joueur est un spectateur
            const spectatorIndex = room.spectators.indexOf(socket.id);
            if (spectatorIndex !== -1) {
                room.spectators.splice(spectatorIndex, 1);
            }
        }
    });
});

server.listen(3002, () => {
    console.log("SERVER IS RUNNING");
});