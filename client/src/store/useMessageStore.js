import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set) => ({
  messages: [],
  isLoadingMessages: true,

  sendMessage: async (recieverId, content) => {
    try {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            _id: Date.now(),
            sender: useAuthStore.getState().authUser._id,
            content,
          },
        ],
      }));
      const res = await axiosInstance.post("/messages/send", {
        recieverId,
        content,
      });
      console.log("Message sent successfully:", res.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  },
  getMessages: async (userId) => {
    try {
      set({ isLoadingMessages: true });
      const res = await axiosInstance.get(`/messages/conversation/${userId}`);
      set({ messages: res.data.messages, isLoadingMessages: false });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  subscribeToMessages: (userId) => {
    const socket = getSocket();
    socket.on("newMessage", ({ message }) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = getSocket();
    socket.off("newMessage");
  },
}));
