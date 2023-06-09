const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const emoji = require('node-emoji');
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (dat) => {
    socket.join(dat);
    console.log(`User with ID: ${socket.id} joined room: ${dat}`);
  });

  socket.on("send_message", (data) => {
    const emojifiedMessage = emoji.emojify(data.message);
    const messageData = {
      ...data,
      message: emojifiedMessage,
    };
    socket.to(data.room).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
