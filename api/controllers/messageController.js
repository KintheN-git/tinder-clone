import Message from "../models/Message.js";

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

    // todo : socket.io ile mesaj gönderme gerçek zamanlı
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.log("Error in sendMessage:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getConversation = async (req, res) => {
  const { userId } = req.params;
  try {
    // mesajları al
    const messages = await Message.find({
      // gönderenden alıcıya veya alıcıdan gönderene gönderilen mesajları al
      $or: [
        { sender: req.user.id, reciever: userId },
        { sender: userId, reciever: req.user.id },
      ],
    }).sort({ createdAt });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log("Error in getConversation:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
