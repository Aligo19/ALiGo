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

let players = {  };
let gameStarted = false;
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
                players: [],
                spectators: [] //a set dans l event joinRoom
            };
        }
        console.log(rooms[roomName].players.length);
        if (rooms[roomName].players.length < 5) {
            rooms[roomName].players.push(socket.id);
        }

        socket.join(roomName);

        if (objMatch.ID_user2 === null){
        // if (objMatch.Status === -1 || objMatch.Status === 0) {
            players[socket.id] = {
                x: 20,
                isLeft: true,
                name: objMatch.ID_user1.Pseudo,
                roomName: objMatch.ID
            };
            console.log(players[socket.id]);
        } else if (objMatch.ID_user2) {
        // } else if (objMatch.Status === 1) {
            players[socket.id] = {
                x: 760,
                isLeft: false, 
                name: objMatch.ID_user2.Pseudo, 
                roomName: objMatch.ID
            };
            console.log(players[socket.id]);
            gameStarted = true;
            io.to(roomName).emit('game_started', true);
        }
        io.to(roomName).emit('update_players', players);

        console.log("player: " + socket.id + " | joined room:" + roomName);
        console.log("player: " + rooms[roomName].players + " | in room:" + roomName);
    });

    socket.on('join_room', (roomName) => {
            //envoier une var dans client pour qu il n ait pas acces au input
            rooms[roomName].spectators.push(socket.id);
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
    
    // //deco sans room
    // socket.on('disconnect', function() {
    //     delete players[socket.id];
    //     console.log("player left: " +socket.id);
    //     console.log("current nb players: " +Object.keys(players).length);
    //     console.log("server side -> the other player left the game " + socket.id);
    //     io.emit('update_players', players);
    // });

    //deco avec room 
    socket.on('disconnect', function() {
        //console.log(reason);
        delete players[socket.id];
        
        //console.log("ID been disconnected: " + socket.id);
        
        for (const roomName in rooms) {
            const room = rooms[roomName];
            
            // Supprimer le joueur de la liste des joueurs de la salle
            //console.log(rooms[roomName].players);
            const playerIndex = rooms[roomName].players.indexOf(socket.id); //find index
            if (playerIndex !== -1) {
                console.log(room.players);
                room.players.splice(playerIndex, 2);

                // Si la salle n'a plus de joueurs, vous pouvez la supprimer si nécessaire
                console.log("nb player in room: " + rooms[roomName].players.length);
                if (rooms[roomName].players.length === 0) {
                    console.log("deleted room");
                    delete rooms[roomName];
                }

                // Émettre un événement pour informer les autres joueurs de la déconnexion
                io.to(roomName).emit('update_players', players);
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