const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Colors for differentiating users
const colors = ["red", "blue", "green", "purple", "orange","pink","black"];
let currentColorIndex = 0;

// Mapping of user ID to color
const userColors = {};

io.on("connection", (socket) => {
    // Assign a unique user ID
    const userId = uuidv4();
    
    // Assign a color to the user
    const userColor = colors[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    userColors[userId] = userColor;
    
    // Send the user ID and color to the client
    socket.emit("init", { userId, userColor });

    // Handle user messages
    socket.on("user-message", (data) => {
        // Include the user's color in the message data
        const messageData = {
            message: data.message,
            userColor: userColors[data.userId]
        };
        io.emit("message", messageData);
    });
});

app.get("/", (req, res) => {
    const indexFilePath = path.resolve(__dirname, 'public', 'chatUI.html');
    res.sendFile(indexFilePath);
});

server.listen(9000, () => {
    console.log("Server Started at PORT: 9000");
});
