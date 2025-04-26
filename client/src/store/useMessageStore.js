import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {
  getSocket,
  joinConversation,
  leaveConversation,
} from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set, get) => ({
  messages: [],
  isLoadingMessages: true,
  sentMessageIds: new Set(), // Gönderilen mesajların ID'lerini takip et

  sendMessage: async (receiverId, content) => {
    try {
      const authUserId = useAuthStore.getState().authUser._id;
      const tempId = `temp_${Date.now()}`; // Geçici benzersiz ID

      // Geçici mesaj ekle
      set((state) => ({
        messages: [
          ...state.messages,
          {
            _id: tempId,
            sender: authUserId,
            receiver: receiverId,
            content,
            createdAt: new Date(),
            isTemp: true, // Geçici mesaj olduğunu işaretle
          },
        ],
      }));

      const res = await axiosInstance.post("/messages/send", {
        receiverId,
        content,
      });

      // Gönderilen mesaj ID'sini kaydet
      set((state) => ({
        sentMessageIds: new Set([
          ...state.sentMessageIds,
          res.data.message._id,
        ]),
      }));

      // Geçici mesajı gerçek mesajla değiştir
      set((state) => ({
        messages: state.messages
          .filter((msg) => msg._id !== tempId) // Geçici mesajı kaldır
          .concat(res.data.message) // Yeni mesajı ekle
          .filter(
            (msg, index, self) =>
              // Son dizide tekrarlanan ID olmadığından emin ol
              index === self.findIndex((m) => m._id === msg._id)
          )
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
      }));
    } catch (error) {
      toast.error(error.response?.data.message || "Something went wrong");
      // Hata durumunda geçici mesajı kaldır
      set((state) => ({
        messages: state.messages.filter((msg) => !msg.isTemp),
      }));
    }
  },

  getMessages: async (userId) => {
    try {
      set({ isLoadingMessages: true });
      const res = await axiosInstance.get(`/messages/conversation/${userId}`);

      set({
        // ID'ye göre benzersiz mesajlardan emin ol
        messages: res.data.messages.filter(
          (msg, index, self) =>
            index === self.findIndex((m) => m._id === msg._id)
        ),
        isLoadingMessages: false,
        sentMessageIds: new Set(), // Yeni konuşma yüklendiğinde temizle
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  subscribeToMessages: (userId, authUserId) => {
    const socket = getSocket();
    joinConversation(userId, authUserId);

    socket.on("newMessage", ({ message }) => {
      set((state) => {
        // Bu mesaj zaten mevcut mu kontrol et
        const messageExists = state.messages.some(
          (msg) => msg._id === message._id
        );
        if (messageExists) {
          return state; // Zaten varsa atla
        }

        // Bu mesaj kullanıcının kendisinin gönderdiği bir mesaj mı?
        if (
          message.sender === authUserId &&
          state.sentMessageIds.has(message._id)
        ) {
          return state; // Kullanıcı zaten bu mesajı göndermişse, soketten gelen mesajı yoksay
        }

        return {
          messages: [...state.messages, message]
            // Olası tekrarları önlemek için ekstra güvenlik kontrolü
            .filter(
              (msg, index, self) =>
                index === self.findIndex((m) => m._id === msg._id)
            )
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
        };
      });
    });
  },

  unsubscribeFromMessages: (userId, authUserId) => {
    const socket = getSocket();
    leaveConversation(userId, authUserId);
    socket.off("newMessage");
  },
}));
