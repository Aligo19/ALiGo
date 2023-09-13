const axios = require('axios');
const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();


app.use(cors());

const server = http.createServer(app);
const io  = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        optionsSuccessStatus: 204,
    }
});

let rooms: { [key: string]: any } = {};

io.on("connection", (socket:any) => {
    socket.once('create_room', (roomName:any, objMatch:any) => {
        if (!rooms[roomName]) {
            rooms[roomName] = {
                players: {},
                spectators: {},
                status: false
            };
        }
        socket.join(roomName);
        if (objMatch.ID_user2===null || objMatch.Status === -1) {
            rooms[roomName].players[socket.id] = {
                x: 20,
                isLeft: true,
                name: objMatch.ID_user1.Pseudo,
                skin: objMatch.ID_user1.Actual_skin,
                roomName: objMatch.ID
            };
        }
        else if (objMatch.ID_user2) {
            rooms[roomName].players[socket.id] = {
                x: 760,
                isLeft: false, 
                name: objMatch.ID_user2.Pseudo, 
                skin: objMatch.ID_user2.Actual_skin,
                roomName: objMatch.ID
            };
            rooms[roomName].status = true;
        }
        io.to(roomName).emit('update_players', rooms[roomName].players);
    });

    socket.on('join_spectator', (roomName:any) => {
        socket.join(roomName);
        io.to(roomName).emit('update_players', rooms[roomName].players);

    });

    socket.on('send_position', (me:any, roomName:any, opponent:any) => {
        socket.to(roomName).emit('receive_position', me);
        socket.to(roomName).emit('rec_pos_spec', me, opponent);
    });
    
    socket.on('send_ball_pos', (data:any, roomName:any) => {
        socket.to(roomName).emit('receive_ball_pos', data);
    });
    
    socket.on('send_score', (leftScore:any, rightScore:any, roomName:any) => {
        socket.to(roomName).emit('receive_score', leftScore, rightScore);
    });

    socket.on('disconnect', function() {
        console.log("ID been disconnected: " + socket.id);
        for (const roomName in rooms) {
            const room = rooms[roomName];
            if (socket.id in room.players)  {
                io.to(roomName).emit('end_game');
                console.log("nb player in room: " + Object.keys(rooms[roomName].players).length);
                io.to(roomName).emit('update_players', rooms[roomName].players);
                
                delete rooms[roomName].players[socket.id];
                axios.get(process.env.URL_API + `/matches/delete/${roomName}`);
                if (Object.keys(rooms[roomName].players).length === 0) {
                    if (!rooms[roomName].status) {
                        axios.get(process.env.URL_API + `/matches/delete/${roomName}`);
                    }
                    console.log("deleted room");
                    delete rooms[roomName];
                }
            }
            if (socket.id in room.spectators) {
                delete room.spectators[socket.id];
            }
        }
    });
});

server.listen(3002, () => {
    console.log("SERVER IS RUNNING");
});