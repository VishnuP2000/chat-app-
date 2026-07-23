// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { Socket } from "socket.io-client";
// import { connectSocket, disconnectSocket, getSocket } from "../socket/socket";
// import { useSelector } from "react-redux"; // or your auth hook

// interface SocketContextType {
//   socket: Socket | null;
//   onlineUsers: string[];
// }

// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   onlineUsers: [],
// });

// export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

//   // ✅ get token from your auth state (Redux / Context / localStorage)
//   const token = useSelector((state: any) => state.auth.token);
//   // or: const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token) return;

//     // Connect socket with JWT token
//     const s = connectSocket(token);
//     setSocket(s);

//     // Track online users
//     s.on("user_online", ({ userId }: { userId: string }) => {
//       setOnlineUsers((prev) => [...new Set([...prev, userId])]);
//     });

//     s.on("user_offline", ({ userId }: { userId: string }) => {
//       setOnlineUsers((prev) => prev.filter((id) => id !== userId));
//     });

//     s.on("connect", () => console.log("✅ Socket connected:", s.id));
//     s.on("connect_error", (err) => console.error("❌ Socket error:", err.message));

//     return () => {
//       disconnectSocket();
//     };
//   }, [token]);

//   return (
//     <SocketContext.Provider value={{ socket, onlineUsers }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);