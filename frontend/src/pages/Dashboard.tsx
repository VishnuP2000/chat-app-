"use client";

import React, { type JSX, useState, useRef, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { motion, AnimatePresence } from "framer-motion";
// import { privateAxios } from "@/service/axiosInstance/userInstance";
import {
  IconSearch,
  IconSend,
  IconDotsVertical,
  IconLogout,
  IconUser,
  IconSettings,
  IconMessageCircle,
  IconPhone,
  IconVideo,
  IconPaperclip,
  IconMoodSmile,
  IconPalette,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllChats,
  usersChatAdd,
  usersChatFetch,
  usersFetch,
} from "@/service/Api/chatApi";
import type { IChat, IMessage, IUser } from "@/types/chat";
import { clickUser } from "@/service/Api/messageApi";
// import { connectSocket } from "@/socket/socket";
import { io, type Socket } from "socket.io-client";
// import { Socket } from "dgram";

// interface Chat extends IChatRoom {
//   name?: string;
//   timestamp?: string;
//   unread?: number;
//   avatar?: string;
//   isOnline?: boolean;
// }

interface Chat {
  _id: string;
  name: string;
  receiverId: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
  isOnline?: boolean;
}

interface UIMessage {
  id: string;
  text: string;
  sender: "me" | "other";
  timestamp: string;
  avatar?: string;
}

interface Theme {
  id: string;
  name: string;
  bgClass: string;
  primaryGlow: string;
  avatarGlow: string;
  chatBubbleMe: string;
  chatBubbleOther: string;
  unreadBadge: string;
  activeChatBg: string;
  inputFocus: string;
  onlineDot: string;
}

const themes: Theme[] = [
  {
    id: "midnight",
    name: "Midnight Purple",
    bgClass: "bg-linear-to-br from-slate-950 via-indigo-950 to-purple-900",
    primaryGlow: "bg-linear-to-r from-purple-500 to-indigo-500",
    avatarGlow: "bg-linear-to-r from-purple-400 to-indigo-400",
    chatBubbleMe: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
    chatBubbleOther: "bg-white/10 text-white backdrop-blur",
    unreadBadge: "bg-purple-500",
    activeChatBg: "bg-white/10",
    inputFocus: "focus:border-purple-400 focus:ring-purple-400/20",
    onlineDot: "bg-green-400",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Neon",
    bgClass: "bg-linear-to-br from-zinc-950 via-neutral-900 to-zinc-950",
    primaryGlow: "bg-linear-to-r from-cyan-500 to-fuchsia-500",
    avatarGlow: "bg-linear-to-r from-cyan-400 to-fuchsia-400",
    chatBubbleMe: "bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-500 text-white shadow-[0_0_10px_rgba(217,70,239,0.3)]",
    chatBubbleOther: "bg-zinc-800/80 border border-cyan-500/20 text-white backdrop-blur",
    unreadBadge: "bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]",
    activeChatBg: "bg-cyan-500/10 border-l-2 border-cyan-500",
    inputFocus: "focus:border-cyan-400 focus:ring-cyan-400/20",
    onlineDot: "bg-cyan-400 animate-pulse",
  },
  {
    id: "ocean",
    name: "Sapphire Ocean",
    bgClass: "bg-linear-to-br from-slate-950 via-blue-950 to-cyan-950",
    primaryGlow: "bg-linear-to-r from-blue-600 to-cyan-500",
    avatarGlow: "bg-linear-to-r from-blue-400 to-cyan-400",
    chatBubbleMe: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white",
    chatBubbleOther: "bg-slate-800/60 border border-blue-500/10 text-white",
    unreadBadge: "bg-cyan-500",
    activeChatBg: "bg-blue-500/10",
    inputFocus: "focus:border-cyan-400 focus:ring-cyan-400/20",
    onlineDot: "bg-emerald-400",
  },
  {
    id: "garden",
    name: "Emerald Garden",
    bgClass: "bg-linear-to-br from-stone-950 via-emerald-950 to-teal-900",
    primaryGlow: "bg-linear-to-r from-emerald-600 to-teal-500",
    avatarGlow: "bg-linear-to-r from-emerald-400 to-teal-400",
    chatBubbleMe: "bg-gradient-to-r from-emerald-600 to-teal-500 text-white",
    chatBubbleOther: "bg-emerald-900/25 border border-emerald-500/10 text-white",
    unreadBadge: "bg-emerald-500",
    activeChatBg: "bg-emerald-500/10",
    inputFocus: "focus:border-emerald-400 focus:ring-emerald-400/20",
    onlineDot: "bg-emerald-400",
  },
  {
    id: "rose",
    name: "Sunset Rose",
    bgClass: "bg-linear-to-br from-zinc-950 via-stone-900 to-rose-950",
    primaryGlow: "bg-linear-to-r from-rose-500 to-amber-500",
    avatarGlow: "bg-linear-to-r from-rose-400 to-amber-400",
    chatBubbleMe: "bg-gradient-to-r from-rose-500 to-amber-500 text-white",
    chatBubbleOther: "bg-stone-800/80 border border-rose-500/10 text-white",
    unreadBadge: "bg-rose-500",
    activeChatBg: "bg-rose-500/10",
    inputFocus: "focus:border-rose-400 focus:ring-rose-400/20",
    onlineDot: "bg-amber-400",
  },
  {
    id: "slate",
    name: "Crimson Slate",
    bgClass: "bg-linear-to-br from-slate-950 via-slate-900 to-rose-950",
    primaryGlow: "bg-linear-to-r from-red-600 to-rose-500",
    avatarGlow: "bg-linear-to-r from-red-400 to-rose-400",
    chatBubbleMe: "bg-gradient-to-r from-red-600 to-rose-500 text-white",
    chatBubbleOther: "bg-slate-800/80 border border-red-500/10 text-white",
    unreadBadge: "bg-red-600",
    activeChatBg: "bg-red-500/10",
    inputFocus: "focus:border-red-400 focus:ring-red-400/20",
    onlineDot: "bg-red-400",
  },
];

const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  console.log('selectedChat',selectedChat)
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("chat-theme");
    return themes.find((t) => t.id === saved) || themes[0];
  });
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("chat-theme", theme.id);
    setShowThemeMenu(false);
  };

  const [users, setUsers] = useState<IUser[]>([]); //   fetch full loged data
  // console.log('users',users)
  // const [loadingUsers, setLoadingUsers] = useState(false);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const [messages, setMessages] = useState<UIMessage[]>([]);

  const [socketState,setSocketState]=useState <Socket|null> ()

  /* add the database chat users in the chattUser after click the fetching function */
  const [chattUser, setChattUser] = useState<Chat[]>([]);


useEffect(() => {
  const token = localStorage.getItem("access-token");
  if (!token) return;

  const socket = io(import.meta.env.VITE_USER_BASE_URL, {
    auth: { token },
  });

  setSocketState(socket);

  return () => {
    socket.disconnect();
  };
}, []);

  /*--------------------Fetching Users for Listing------------------------*/



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({});
  };

  const handleLogout = () => {
    localStorage.removeItem("access-token");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/sign-in");
    }, 3000);
  };

  const selectedChatData = chattUser.find((chat) => chat._id === selectedChat);

  /*-----------------add chat users in the database --------------------*/

  const addChatUsers = async (userMail: string) => {
    try {
      const chat: IChat = await usersChatAdd(userMail);
      if (!chat) return;

      const user = users.find((u) => u.email === userMail);

      setChattUser((prev) => {
        if (prev.some((c) => c._id === chat._id)) return prev;

       return [
  ...prev,
  {
    _id: chat._id,
    name: user?.name ?? "Unknown User",
    receiverId: String(user?._id),
    lastMessage:
      typeof chat.lastMessage === "string"
        ? chat.lastMessage
        : (chat.lastMessage?.content ?? ""),
    timestamp: new Date(chat.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    unread: 0,
  },
];
      });

      setSelectedChat(chat._id);
      setShowNewChat(false);
      return chat;
    } catch {
      toast.error("Failed to start chat");
    }
  };

  /*-----------------Fetching chat Users------------------*/

  const fetchChatUsers = async (chatId: string) => {
    try {
      console.log("chatId", chatId);

      const res = await usersChatFetch(chatId);
      console.log("resssss", res);
      // setResChatUsers(res);

      // Update the chat in chattUser with user information
      if (res && res.users && res.users.length > 0) {
        setChattUser((prev) =>
          prev.map((chat) => {
            if (chat._id === chatId) {
              // Get the other user's name (first user in the array, or you can filter by current user ID)
              // For now, we'll use the first user. You can enhance this to filter out current user later
              const otherUser = res.users[0];
              return {
                ...chat,
                name: otherUser?.name || chat.name || "Unknown User",
                // You can also update other fields like lastMessage, timestamp, etc.
              };
            }
            return chat;
          }),
        );
      }

      // setMessages(res as unknown as Message[]);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  //   const normalizeChats = (chats: IChat[], currentUserId: string): Chat[] => {
  //     console.log('normalizeChats',currentUserId)
  //   return chats.map(chat => {
  //     const otherUser = chat.users.find(u => u._id !== currentUserId);

  //     return {
  //       ...chat,
  //       name: otherUser?.name ?? "Unknown User",
  //       lastMessage: chat.lastMessage?.content ?? "",
  //       timestamp: chat.lastMessage
  //         ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
  //             hour: "2-digit",
  //             minute: "2-digit",
  //           })
  //         : "",
  //     };
  //   });
  // };
  const normalizeChats = (chats: IChat[], currentUserId: string): Chat[] => {
    console.log("currentUserId", currentUserId);
    return chats.map((chat) => {
      const otherUser = chat.users.find(
  (u) => String(u._id) !== String(currentUserId)
);
      console.log("chat._id", chat._id);
      console.log("otherUser", otherUser);

      return {
        _id: chat._id,
        name: otherUser?.name ?? "Unknown User",
         receiverId: String(otherUser?._id),
        lastMessage:
          typeof chat.lastMessage === "string"
            ? chat.lastMessage
            : (chat.lastMessage?.content ?? ""),
        timestamp: new Date(chat.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        unread: chat.unreadCounts?.[currentUserId] ?? 0,
      };
    });
  };

  // fetch users in the useEffect
  useEffect(() => {
    const loadChats = async () => {
      try {
        const chats = await getAllChats();
        const userId = localStorage.getItem("userId"); // or from auth state
        console.log("userId", userId);
        setChattUser(normalizeChats(chats, userId!)); //userId as string
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };

    loadChats();
  }, []);

  // when i click the user's pass the _id in the backend and fetch the specific user message

  const fetchMessage = async (chatId: string) => {
    try {
      console.log("fetchMessage", chatId);
      const res = await clickUser(chatId);
      const uiMessages: UIMessage[] = res.messages.map(mapIMessageToUIMessage);
      console.log("uiMessages", uiMessages);

      setMessages(uiMessages);
    } catch (error) {
      console.error("it is fetchMessage error", error);
    }
  };

  // const formatTime = (date: string) =>
  //   new Date(date).toLocaleTimeString([], {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });

  const mapIMessageToUIMessage = (msg: IMessage): UIMessage => {
    return {
      id: msg._id ?? msg.id,
      text: msg.content,
      sender: msg.senderType === "user" ? "me" : "other",
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const handleSendMessage = async () => {
    console.log('handleSendMessage')
    if (!messageInput.trim() || !selectedChat) return;

    try {
      setIsSending(true);
      console.log("enter handleSendMessage");
      const message={
        chatId:selectedChat,
        receiverId:selectedChatData?.receiverId,
        content:messageInput.trim()
      }
      socketState?.emit("send-message",message)
      console.log("message");

      const newUIMessage: UIMessage = {
        id: Math.random().toString(36).substring(7),
        text: messageInput.trim(),
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      console.log('enter newUIMessage')
      setMessages((prev) => [...prev, newUIMessage]);
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("handleKeyPresssss");
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  useEffect(() => {
  if (!socketState) return;

  socketState.on("receive-message", (message) => {
    const uiMessage = mapIMessageToUIMessage(message);

    setMessages((prev) => [...prev, uiMessage]);
  });

  return () => {
    socketState.off("receive-message");
  };
}, [socketState]);

  const filteredChats = chattUser.filter((chat) =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const currentUserId = localStorage.getItem("userId");
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name
      .toLowerCase()
      .includes(userSearch.toLowerCase());
    const isLoggedInUser = String(u._id) === String(currentUserId);
    return matchesSearch && !isLoggedInUser;
  });

  return (
    <div className={`flex h-screen w-full overflow-hidden text-white transition-colors duration-500 ${currentTheme.bgClass}`}>
      <ToastContainer />

      {/* Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex w-full flex-col border-r border-white/10 bg-white/5 backdrop-blur-xl md:w-96"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-500 ${currentTheme.primaryGlow}`}>
              <IconMessageCircle className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold">Messages</h1>
          </div>
          <div className="relative flex items-center">
            <button
              onClick={() => {
                setShowNewChat(true);
              }}
              className="mr-1 rounded-full p-2 transition hover:bg-white/10"
              title="New Chat"
            >
              <GrAdd className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowUserMenu(false);
              }}
              className="mr-1 rounded-full p-2 transition hover:bg-white/10 text-slate-300 hover:text-white"
              title="Change Theme"
            >
              <IconPalette className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowThemeMenu(false);
              }}
              className="rounded-full p-2 transition hover:bg-white/10"
              title="Menu"
            >
              <IconDotsVertical className="h-5 w-5" />
            </button>

            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 z-50 w-52 rounded-xl bg-slate-900/95 p-2 backdrop-blur-xl ring-1 ring-white/20 shadow-2xl"
                >
                  <p className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Theme</p>
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/10 ${
                        currentTheme.id === t.id ? "bg-white/15 font-semibold text-white" : "text-slate-300"
                      }`}
                    >
                      <span className={`h-3 w-3 rounded-full shrink-0 ${t.primaryGlow}`} />
                      {t.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 z-50 w-48 rounded-xl bg-slate-900/95 p-2 backdrop-blur-xl ring-1 ring-white/20 shadow-2xl"
                >
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10">
                    <IconUser className="h-4 w-4" />
                    Profile
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10">
                    <IconSettings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-400 transition hover:bg-white/10"
                  >
                    <IconLogout className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showNewChat && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                >
                  <motion.div
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.96, opacity: 0 }}
                    transition={{ type: "spring", damping: 18, stiffness: 220 }}
                    className="w-full max-w-lg rounded-2xl bg-black p-6 text-white shadow-2xl ring-1 ring-white/15"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Start a new chat
                        </h3>
                        <p className="text-xs text-slate-300">
                          Search and select a user
                        </p>
                      </div>
                      <button
                        onClick={() => setShowNewChat(false)}
                        className="rounded-full px-3 py-1 text-sm text-slate-300 transition hover:bg-white/10"
                      >
                        Close
                      </button>
                    </div>
                    <div className="mt-4">
                      <div className="relative">
                        <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Find users..."
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          className={`w-full rounded-xl border border-white/15 bg-white/5 px-10 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 ${currentTheme.inputFocus}`}
                        />
                      </div>
                    </div>
                    <div className="mt-4 max-h-72 overflow-y-auto">
                      {filteredUsers.map((u) => (
                          <button
                            key={u._id}
                            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-white/10"
                            onClick={async () => {
                              const chat = await addChatUsers(u.email);
                              if (!chat) return;
                              fetchChatUsers(chat._id);
                              setSelectedChat(chat._id);
                              setShowNewChat(false);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-500 ${currentTheme.avatarGlow}`}>
                                {/* {u.name.charAt(0)} */}
                              </div>
                              <div>
                                <p className="font-semibold">{u.name}</p>
                                <p className="text-xs text-slate-400">
                                  {u.email}
                                </p>
                              </div>
                            </div>
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                              Chat
                            </span>
                          </button>
                        ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-white/10 p-4">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl border border-white/15 bg-white/5 px-10 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 ${currentTheme.inputFocus}`}
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredChats.length > 0
              ? filteredChats.map((chat, index) => (
                  <motion.div
                    key={chat._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                        if (selectedChat && selectedChat !== chat._id) {
                          socketState?.emit("leave-chat", selectedChat);
                        }
                        socketState?.emit("join-chat", chat._id);
                      setSelectedChat(chat._id);
                      fetchMessage(chat._id);
                    }}
                    className={`group relative flex cursor-pointer items-center gap-3 border-b border-white/5 p-4 transition-all duration-300 ${
                      selectedChat === chat._id
                        ? currentTheme.activeChatBg
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="relative">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition-all duration-500 ${currentTheme.avatarGlow}`}>
                        {chat.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      {chat.isOnline && (
                        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 transition-colors duration-500 ${currentTheme.onlineDot}`} />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="truncate font-semibold text-white">
                          {chat.name || "Unknown User"}
                        </h3>
                        <span className="text-xs text-slate-400">
                          {chat.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm text-slate-300">
                          {chat.lastMessage}
                        </p>
                        {(chat.unread ?? 0) > 0 && (
                          <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold text-white transition-colors duration-500 ${currentTheme.unreadBadge}`}>
                            {chat.unread ?? 0}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              : "users not exists"}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-500 ${currentTheme.avatarGlow}`}>
                    {selectedChatData?.name?.charAt(0)}
                  </div>
                  {selectedChatData?.isOnline && (
                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 transition-colors duration-500 ${currentTheme.onlineDot}`} />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-white">
                    {selectedChatData?.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {selectedChatData?.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-full p-2 transition hover:bg-white/10">
                  <IconPhone className="h-5 w-5" />
                </button>
                <button className="rounded-full p-2 transition hover:bg-white/10">
                  <IconVideo className="h-5 w-5" />
                </button>
                <button className="rounded-full p-2 transition hover:bg-white/10">
                  <IconDotsVertical className="h-5 w-5" />
                </button>
              </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mx-auto max-w-3xl space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div 
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${
                        message.sender === "me"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-[70%] items-end gap-2 ${
                          message.sender === "me"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        {message.sender === "other" && (
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-500 ${currentTheme.avatarGlow}`}>
                            {selectedChatData?.name?.charAt(0)}
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2.5 transition-all duration-500 ${
                            message.sender === "me"
                              ? currentTheme.chatBubbleMe
                              : currentTheme.chatBubbleOther
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`mt-1 text-xs transition-colors duration-500 ${
                              message.sender === "me"
                                ? "text-white/70"
                                : "text-slate-400"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="border-t border-white/10 bg-white/5 p-4 backdrop-blur-xl"
            >
              <div className="mx-auto max-w-3xl">
                <div className="flex items-end gap-2">
                  <button className="rounded-full p-2 transition hover:bg-white/10">
                    <IconPaperclip className="h-5 w-5 text-slate-400" />
                  </button>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className={`w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 ${currentTheme.inputFocus}`}
                    />
                  </div>
                  <button className="rounded-full p-2 transition hover:bg-white/10">
                    <IconMoodSmile className="h-5 w-5 text-slate-400" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || isSending}
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${currentTheme.primaryGlow}`}
                    title="Send message"
                  >
                    <IconSend className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 items-center justify-center"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                <IconMessageCircle className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">
                Select a conversation
              </h2>
              <p className="text-slate-400">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
