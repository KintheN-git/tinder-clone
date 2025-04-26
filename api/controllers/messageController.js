import Message from "../models/Message.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

export const sendMessage = async (req, res) => {
  try {
    const { content, receiverId } = req.body;

    const newMessage = await Message.create({
      sender: req.user.id,
      reciever: receiverId,
      content,
    });

    const io = getIO();
    const room = `conversation_${[req.user.id, receiverId].sort().join("_")}`;

    io.to(room).emit("newMessage", {
      message: newMessage,
    });

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error in sendMessage:", error);
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
    console.error("Error in getConversation:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
