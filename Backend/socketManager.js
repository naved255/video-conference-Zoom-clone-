import { Server } from "socket.io";

let connection = {};
let messages = {};
let timeOnline = {};

const createSocketConnection = (server) => {

    let io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        socket.on("join-call", (path) => {

            if (connection[path] === undefined) {
                connection[path] = [];
            }

            connection[path].push(socket.id);

            timeOnline[socket.id] = new Date();

            for (let a = 0; a < connection[path].length; a++) {
                io.to(connection[path][a]).emit("user-joined", socket.id, connection[path]);
            }

            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; a++) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'], messages[path][a]['sender'], messages[path][a]['socket-id-sender']);
                }
            }
        })

        socket.on('signal', (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message", (data, sender) => {

            const [matchingRoom, found] = Object.entries(connection).reduce(([room, isFound], [roomKey, roomValue]) => {
                if (!isFound && roomValue.includes(socket.id)) {
                    return [roomKey, true]
                }

                return [room, isFound];
            }, ['', false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({ 'sender': sender, 'data': data, 'socket-id-sender': socket.id });
                console.log('message', matchingRoom, ":", sender, data);

                connection[matchingRoom].forEach(elem => {
                    io.to(elem).emit("chat-message", data, sender, socket.id);
                });
            }
        })
        
        socket.on("disconnect", () => {
            let roomKey = null;

            // Find which room this socket belongs to
            for (const [key, users] of Object.entries(connection)) {
                if (users.includes(socket.id)) {
                    roomKey = key;
                    break;
                }
            }

            if (!roomKey) return;

            // Notify others
            connection[roomKey].forEach((id) => {
                io.to(id).emit("user-left", socket.id);
            });

            // Remove socket
            connection[roomKey] = connection[roomKey].filter(
                (id) => id !== socket.id
            );

            // Cleanup empty room
            if (connection[roomKey].length === 0) {
                delete connection[roomKey];
                delete messages[roomKey];
            }

            delete timeOnline[socket.id];
        });

    })

    return io;
}

export default createSocketConnection;