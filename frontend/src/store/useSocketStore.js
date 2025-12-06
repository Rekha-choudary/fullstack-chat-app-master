import { create } from "zustand";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";

export const useSocketStore = create((set, get) => ({
  socket: null,

  initializeSocket: () => {
    const { authUser } = useAuthStore.getState();
    if (!authUser || get().socket) return;

    const socket = io("http://localhost:5000", {
      query: { userId: authUser._id },
      transports: ["websocket"],
    });

    set({ socket });
  },

  disconnectSocket: () => {
    if (get().socket) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));
