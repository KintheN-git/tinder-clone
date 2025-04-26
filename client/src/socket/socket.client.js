import io from "socket.io-client";

const SOCKET_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";
let socket = null;

export const initializeSocket = (userId) => {
  if (!userId) {
    throw new Error("userId is required to initialize socket");
  }

  if (socket && socket.auth?.userId === userId) {
    if (socket.connected) {
      return socket;
    } else {
      socket.connect();
      return socket;
    }
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: { userId },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${reason}`);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized");
  }
  return socket;
};

export const joinConversation = (conversationId, authUserId) => {
  const socket = getSocket();
  const room = `conversation_${[authUserId, conversationId].sort().join("_")}`;
  socket.emit("joinConversation", room);
};

export const leaveConversation = (conversationId, authUserId) => {
  const socket = getSocket();
  const room = `conversation_${[authUserId, conversationId].sort().join("_")}`;
  socket.emit("leaveConversation", room);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected and cleared");
  }
};
