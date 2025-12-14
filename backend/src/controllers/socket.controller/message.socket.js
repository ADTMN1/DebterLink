import messageService from '../../services/message.service.js';

const onlineUsers = new Map();

export default function registerMessageSocket(io, socket) {

  socket.on("join", (user_id) => {
    onlineUsers.set(user_id, socket.id);
    socket.user_id = user_id;
  });

  socket.on("join_admin", ({ adminId, role }) => {
    if (role !== "admin") return;
    socket.join("admins");
    console.log("Admin joined:", adminId);
  });

  socket.on("send_message", async ({ senderId, receiverId, content, attachment_url }) => {
    try {
      const savedMessage = await messageService.save_Message({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        attachment_url
      });

      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", savedMessage);
      }

      socket.emit("message_sent", savedMessage);

      io.to("admins").emit("admin_log", {
        event: "message_sent",
        senderId,
        receiverId,
        content,
        attachment_url,
        time: new Date()
      });

    } catch (err) {
      console.log("Message error:", err);
      socket.emit("error_message", "Message failed to send.");
    }
  });

  socket.on("disconnect", () => {
    if (socket.user_id) {
      onlineUsers.delete(socket.user_id);
    }
  });
}
