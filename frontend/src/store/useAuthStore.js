import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// BACKEND runs on PORT 5000
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  onlineUsers: [],
  socket: null,

  // ----------------------------
  // CHECK AUTH ON PAGE LOAD
  // ----------------------------
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      // Connect socket after auth success
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ----------------------------
  // SIGNUP
  // ----------------------------
  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);

      set({ authUser: res.data });
      toast.success("Account created successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ----------------------------
  // LOGIN
  // ----------------------------
  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ----------------------------
  // LOGOUT
  // ----------------------------
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      set({ authUser: null });
      toast.success("Logged out successfully");

      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  // ----------------------------
  // UPDATE PROFILE
  // ----------------------------
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/update-profile", data);

      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ----------------------------
  // SOCKET CONNECT
  // ----------------------------
  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser) return;

    // 🔥 Prevent duplicate socket connections
    if (socket && socket.connected) return;

    // Create a new socket connection
    const newSocket = io(BASE_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
    });

    // Save socket instance
    set({ socket: newSocket });

    // Handle online users update
    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // ----------------------------
  // SOCKET DISCONNECT
  // ----------------------------
  disconnectSocket: () => {
    const { socket } = get();

    if (socket?.connected) socket.disconnect();
  },
}));
