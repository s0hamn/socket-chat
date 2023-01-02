const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const PORT = 3000;


const generateMessage = (username, message) => {
    return {
        username,
        message,
    }
}
const users = [];

const userJoin = (id, username, room) => {
    const user = {
        id,
        username,
        room
    }

    users.push(user);
    return user;
}

const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
}

const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getRoomUsers = (room) => {
    return users.filter(user => user.room === room);
}


io.on('connection', (socket) => {
    socket.on('join-room', (data) => {
        const user = userJoin(socket.id, data.username, data.room);
        socket.join(user.room);


        socket.emit("new-user", generateMessage("System", "Welcome to the chat"));
        socket.broadcast.to(user.room).emit("new-user", generateMessage("System", `${user.username} has joined the chat`));
    });


    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            socket.broadcast.emit("new-user", generateMessage("System", `${user.username} has left the chat`));
        }
    });



    // Listen for chatMessage
    socket.on('chatMessage', (message) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', generateMessage(user.username, message));
    });
});



app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
