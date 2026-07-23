import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  console.log('through backend url')
  if (!socket) {
    socket = io("http://localhost:5173", {  // your backend URL
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: false,   // ✅ don't connect until user logs in
    });
  }
  return socket;
};

export const connectSocket = (token: string) => {
  console.log('try to connect socket.io')
  const s = getSocket();
  s.auth = { token };       // ✅ pass JWT token for auth middleware
  s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};