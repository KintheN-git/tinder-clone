import { Server } from "socket.io";

let io;

const connectedUsers = new Map(); // Kullanıcıların oturumunu tutan bir map

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL, // Izin verilen originler
      credentials: true, // Kullanıcı adı ve şifreyi gizli olacak mı?
    },
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("Authentication error"));
    }
    socket.userId = userId;
    next();
  });
  io.on("connection", (socket) => {
    // Kullanıcı oturumunu oluşturma
    connectedUsers.set(socket.userId, socket.id);
    console.log("A user connected:", socket.id);
    socket.on("disconnect", () => {
      connectedUsers.delete(socket.userId);
      console.log("A user disconnected:", socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
};

export const getConnectedUsers = () => connectedUsers;
