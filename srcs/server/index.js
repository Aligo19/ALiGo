const axios = require('axios');
const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config(); // Import dotenv package


app.use(cors());

const server = http.createServer(app);
const io  = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        optionsSuccessStatus: 204,
    },
    //transports: ['websocket', 'polling'], 
});

let rooms = {};

io.on("connection", (socket) => {

    //co sans room
    // socket.once('new_player', (data) => {
    //     console.log("new player connected: " + socket.id);
    //     //setup dans players avec le socket id les data envoyer (voir si autre chose que x et y necessaire)
    //     players[socket.id] = data;
    //     console.log("current nb players: " +Object.keys(players).length);
    //     console.log("players: ", players);
    //     io.emit('update_players', players);
    // });

    //connexion avec room
    socket.once('create_room', (roomName, objMatch) => {
        if (!rooms[roomName]) {
            rooms[roomName] = {
                players: {},
                spectators: {}, //a set dans l event joinRoom
                status: false
            };
        }

        // if (rooms[roomName].players.length < 2) {
        //     rooms[roomName].push(socket.id);
        // }

        socket.join(roomName);

        // if (objMatch.ID_user2 === null){
        if (objMatch.ID_user2===null || objMatch.Status === -1) {
            rooms[roomName].players[socket.id] = {
                //rooms[roomName].players[socket.id] = {
                x: 20,
                isLeft: true,
                name: objMatch.ID_user1.Pseudo,
                skin: objMatch.ID_user1.Actual_skin,
                roomName: objMatch.ID
            };
        }
        else if (objMatch.ID_user2) {
        // } else if (objMatch.Status === 1) {
            //allPlayers[socket.id] = {
            rooms[roomName].players[socket.id] = {
                x: 760,
                isLeft: false, 
                name: objMatch.ID_user2.Pseudo, 
                skin: objMatch.ID_user2.Actual_skin,
                roomName: objMatch.ID
            };
            rooms[roomName].status = true;

            io.to(roomName).emit('game_started', true);
        }

        //on passait player avant et ca marchait 
        io.to(roomName).emit('update_players', rooms[roomName].players);

        console.log("player: " + Object.keys(rooms[roomName].players) + " | in room:" + roomName);
    });

    socket.on('join_spectator', (roomName) => {
        //envoier une var dans client pour qu il n ait pas acces au input
        //rooms[roomName].push(socket.id);
        console.log("spsect: " + Object.keys(rooms[roomName].spectators) + " | in room:" + roomName);
        socket.join(roomName);
        io.to(roomName).emit('update_players', rooms[roomName].players);

    });

    socket.on('send_position', (data, roomName) => {
        // Diffusez la nouvelle position à tous les autres joueurs sauf l'expéditeur
        socket.to(roomName).emit('receive_position', data);
    });
    
    socket.on('send_ball_pos', (data, roomName) => {
        //envoi au joueur inviter la pos de la ball
        socket.to(roomName).emit('receive_ball_pos', data);
    });
    
    socket.on('send_score', (leftScore, rightScore, roomName) => {
        //envoi au joueur inviter la pos de la ball
        socket.to(roomName).emit('receive_score', leftScore, rightScore);
    });

    //deco avec room 
    socket.on('disconnect', function() {

        console.log("ID been disconnected: " + socket.id);
        
        for (const roomName in rooms) {
            const room = rooms[roomName];

            if (socket.id in room.players)  {
                    
                // Si la salle n'a plus de joueurs, vous pouvez la supprimer si nécessaire
                console.log("nb player in room: " + Object.keys(rooms[roomName].players).length);
                // Émettre un événement pour informer les autres joueurs de la déconnexion
                //error si room delete...
                io.to(roomName).emit('update_players', rooms[roomName].players);
                io.to(roomName).emit('end_game');
                
                delete rooms[roomName].players[socket.id];

                if (Object.keys(rooms[roomName].players).length === 0) {
                    if (!rooms[roomName].status) {
                        axios.get(process.env.URL_API + `/matches/delete/${roomName}`);
                    }
                    console.log("deleted room");
                    delete rooms[roomName];
                }
            }

            // Vous pouvez également gérer le cas où le joueur est un spectateur
            if (socket.id in room.spectators) {
                delete room.spectators[socket.id];
            }
        }
    });
});

server.listen(3002, () => {
    console.log("SERVER IS RUNNING");
});