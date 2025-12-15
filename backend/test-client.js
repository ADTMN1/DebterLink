import { io } from "socket.io-client";

const socket = io("http://localhost:2000"); // your server URL

// Join a user
socket.emit("join", "3dbc4375-c185-4844-a15f-1b809f07a4da"); // 
socket.on("receive_message", (msg) => console.log("Received:", msg));
socket.on("message_sent", (msg) => console.log("Sent confirmation:", msg));
socket.on("error_message", (err) => console.log("Error:", err));


socket.emit("send_message", {
  senderId: "3dbc4375-c185-4844-a15f-1b809f07a4da",  // Alice
  receiverId: "629eb052-4103-4e20-9728-2e3118baf194", // Bob
  type: "text",
  content: "Hello Bob!",
  attachment_url: null
});

// File/message with URL
socket.emit("send_message", {
  senderId: "3dbc4375-c185-4844-a15f-1b809f07a4da",  // Alice
  receiverId: "629eb052-4103-4e20-9728-2e3118baf194",
  type: "media",
  content: null,
  attachment_url: "http://localhost:5000/uploads/dummy-file.png"
});
