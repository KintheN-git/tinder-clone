import Message from "../models/Message.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

// mesaj gönder
export const sendMessage = async (req, res) => {
  try {
    // mesaj içeriğini ve alıcıyı al
    const { content, receiverId } = req.body;

    // mesajı veritabanına kaydet
    const newMessage = await Message.create({
      sender: req.user.id,
      reciever: receiverId,
      content,
    });

    // socket.io ile mesaj gönderme gerçek zamanlı

    const io = getIO(); //socket io nesnesini al
    const connectedUsers = getConnectedUsers(); //oturum açan kullanıcıların oturumunu al

    const receiverSocketId = connectedUsers.get(receiverId); // alıcının socket id'sini al

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        message: newMessage,
      });
    } // alıcıya mesaj gönder

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.log("Error in sendMessage:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getConversation = async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, reciever: userId },
        { sender: userId, reciever: req.user.id },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log("Error in getConversation:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
