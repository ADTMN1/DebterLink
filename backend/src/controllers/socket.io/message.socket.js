const onlineUsers = new Map();
// console.log(onlineUsers)
export default function registerMessageSocket(io, socket) {
  
  // 1. user sends own userId to join
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // 2. send message to receiver
  socket.on("send_message", ({ senderId, receiverId, message }) => {
    const receiverSocket = onlineUsers.get(receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_message", {
        senderId,
        message
      });
    }
  });
}


/*
I CANT 4NDERSTAND TH5S C6NCE*T BY THE WAY
 🟢 server.js (main file)
import express from "express";
import http from "http";
import { initSocket } from "./socket/index.js";

const app = express();
app.use(express.json());

const server = http.createServer(app);

// Initialize socket server
initSocket(server);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});

🟢 socket/index.js (socket setup)
import { Server } from "socket.io";
import registerMessageSocket from "./message.socket.js";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register messaging socket events
    registerMessageSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

export function getIO() {
  return io;
}

🟢 socket/message.socket.js (REAL-TIME messaging logic)
const onlineUsers = new Map();

export default function registerMessageSocket(io, socket) {
  
  // 1. user sends own userId to join
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // 2. send message to receiver
  socket.on("send_message", ({ senderId, receiverId, message }) => {
    const receiverSocket = onlineUsers.get(receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_message", {
        senderId,
        message
      });
    }
  });
}

*/