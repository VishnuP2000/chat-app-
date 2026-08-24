import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  // Don't create multiple connections
  if (socket) {
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  socket = io(import.meta.env.VITE_USER_BASE_URL, {
    auth: {
      token,
    },
    autoConnect: false,
  });

  socket.connect();
console.log('before socket connected')
  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket?.id);
  });

  socket.on("connect_error", (error) => {
    console.error("🔴 Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("🟡 Socket disconnected:", reason);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};