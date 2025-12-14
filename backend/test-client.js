import { io } from "socket.io-client";

const socket = io("http://localhost:2000", {
  reconnectionAttempts: 3, // try only 3 times
  timeout: 5000,           // 5 seconds timeout
});

socket.on("connect", () => {
  console.log("✅ Connected! Socket ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("⚠️ Disconnected:", reason);
});
