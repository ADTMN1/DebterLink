import { Server } from "socket.io";
import registerMessageSocket from "./message.socket.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    }
  });

  io.on("connection", (socket) => {
    try {
      console.log("User connected:", socket.id);

      // Register messaging socket events
      registerMessageSocket(io, socket);

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    } catch (err) {
      console.error("Error handling socket:", err);
      // Optionally notify client that something went wrong
      socket.emit("error_message", { message: "Server error occurred" });
    }
  });

  // Handle errors at server level
  io.engine.on("connection_error", (err) => {
    console.error("Connection error:", err.req?.url, err.message);
  });
}

export function getIO() {
  return io;
}
