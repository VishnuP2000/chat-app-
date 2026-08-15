"use client";

import React, { type JSX, useState, useRef, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { motion, AnimatePresence } from "framer-motion";
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
  IconArrowLeft,
  IconX,
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
import { io, type Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

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
interface IMessageSender {
  _id: string;
  name: string;
  email: string;
}
interface UIMessage {
  id: string;
  content: string;
  sender: "me" | "other";
  senderId: IMessageSender;
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
    name: "Cypress Classic",
    bgClass: "bg-[#004643]",
    primaryGlow: "bg-[#004643]",
    avatarGlow: "bg-[#004643] text-[#F0EDE5]",
    chatBubbleMe:
      "bg-gradient-to-br from-[#004643] to-[rgba(0,70,67,0.82)] text-[#F0EDE5] border border-[rgba(240,237,229,0.15)]",
    chatBubbleOther:
      "bg-[#F0EDE5] text-[#004643] shadow-[0_4px_15px_rgba(0,0,0,0.08)]",
    unreadBadge: "bg-[#F0EDE5] text-[#004643]",
    activeChatBg: "bg-[#F0EDE5] text-[#004643] border-l-[3px] border-[#004643]",
    inputFocus:
      "focus:border-[#F0EDE5] focus:ring-[3px] focus:ring-[rgba(240,237,229,0.08)]",
    onlineDot: "bg-[#F0EDE5] shadow-[0_0_8px_rgba(240,237,229,0.35)]",
  },
  {
    id: "cyberpunk",
    name: "Sand Contrast",
    bgClass: "bg-[#004643]",
    primaryGlow: "bg-[#F0EDE5]",
    avatarGlow: "bg-[#F0EDE5] text-[#004643]",
    chatBubbleMe:
      "bg-[#004643] text-[#F0EDE5] border border-[rgba(240,237,229,0.15)]",
    chatBubbleOther:
      "bg-[#F0EDE5] text-[#004643] shadow-[0_4px_15px_rgba(0,0,0,0.08)]",
    unreadBadge: "bg-[#F0EDE5] text-[#004643]",
    activeChatBg: "bg-[#F0EDE5] text-[#004643] border-l-[3px] border-[#004643]",
    inputFocus:
      "focus:border-[#F0EDE5] focus:ring-[3px] focus:ring-[rgba(240,237,229,0.08)]",
    onlineDot: "bg-[#F0EDE5] shadow-[0_0_8px_rgba(240,237,229,0.35)]",
  },
  {
    id: "ocean",
    name: "Deep Cypress",
    bgClass: "bg-[#003d3a]",
    primaryGlow: "bg-[#004643]",
    avatarGlow: "bg-[#004643] text-[#F0EDE5]",
    chatBubbleMe:
      "bg-gradient-to-br from-[#004643] to-[rgba(0,70,67,0.82)] text-[#F0EDE5] border border-[rgba(240,237,229,0.15)]",
    chatBubbleOther:
      "bg-[#F0EDE5] text-[#004643] shadow-[0_4px_15px_rgba(0,0,0,0.08)]",
    unreadBadge: "bg-[#F0EDE5] text-[#004643]",
    activeChatBg: "bg-[#F0EDE5] text-[#004643] border-l-[3px] border-[#004643]",
    inputFocus:
      "focus:border-[#F0EDE5] focus:ring-[3px] focus:ring-[rgba(240,237,229,0.08)]",
    onlineDot: "bg-[#F0EDE5] shadow-[0_0_8px_rgba(240,237,229,0.35)]",
  },
  {
    id: "garden",
    name: "Dune Soft",
    bgClass: "bg-[#004643]",
    primaryGlow: "bg-[#F0EDE5]",
    avatarGlow: "bg-[rgba(240,237,229,0.15)] text-[#F0EDE5]",
    chatBubbleMe:
      "bg-[#004643] text-[#F0EDE5] border border-[rgba(240,237,229,0.15)]",
    chatBubbleOther:
      "bg-[#F0EDE5] text-[#004643] shadow-[0_4px_15px_rgba(0,0,0,0.08)]",
    unreadBadge: "bg-[#F0EDE5] text-[#004643]",
    activeChatBg: "bg-[#F0EDE5] text-[#004643] border-l-[3px] border-[#004643]",
    inputFocus:
      "focus:border-[#F0EDE5] focus:ring-[3px] focus:ring-[rgba(240,237,229,0.08)]",
    onlineDot: "bg-[#F0EDE5] shadow-[0_0_8px_rgba(240,237,229,0.35)]",
  },
  {
    id: "rose",
    name: "Cypress Ink",
    bgClass: "bg-[#004643]",
    primaryGlow: "bg-[#004643]",
    avatarGlow: "bg-[#004643] text-[#F0EDE5]",
    chatBubbleMe:
      "bg-gradient-to-br from-[#004643] to-[rgba(0,70,67,0.82)] text-[#F0EDE5] border border-[rgba(240,237,229,0.15)]",
    chatBubbleOther:
      "bg-[#F0EDE5] text-[#004643] shadow-[0_4px_15px_rgba(0,0,0,0.08)]",
    unreadBadge: "bg-[#F0EDE5] text-[#004643]",
    activeChatBg: "bg-[#F0EDE5] text-[#004643] border-l-[3px] border-[#004643]",
    inputFocus:
      "focus:border-[#F0EDE5] focus:ring-[3px] focus:ring-[rgba(240,237,229,0.08)]",
    onlineDot: "bg-[#F0EDE5] shadow-[0_0_8px_rgba(240,237,229,0.35)]",
  },
  {
    id: "slate",
    name: "Sand Drift",
    bgClass: "bg-[#004643]",
    primaryGlow: "bg-[#F0EDE5]",
    avatarGlow: "bg-[#F0EDE5] text-[#004643]",
    chatBubbleMe:
      "bg-[#004643] text-[#F0EDE5] border border-[rgba(240,237,229,0.15)]",
    chatBubbleOther:
      "bg-[#F0EDE5] text-[#004643] shadow-[0_4px_15px_rgba(0,0,0,0.08)]",
    unreadBadge: "bg-[#F0EDE5] text-[#004643]",
    activeChatBg: "bg-[#F0EDE5] text-[#004643] border-l-[3px] border-[#004643]",
    inputFocus:
      "focus:border-[#F0EDE5] focus:ring-[3px] focus:ring-[rgba(240,237,229,0.08)]",
    onlineDot: "bg-[#F0EDE5] shadow-[0_0_8px_rgba(240,237,229,0.35)]",
  },
];

const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  console.log("selectedChat", selectedChat);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Mobile sidebar visibility
  const [showSidebar, setShowSidebar] = useState(true);

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
  const { user } = useAuth();

  const [users, setUsers] = useState<IUser[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  console.log("userSearch", userSearch);

  const [messages, setMessages] = useState<UIMessage[]>([]);
  console.log("messages&&&&", messages);
  const [socketState, setSocketState] = useState<Socket | null>();
  console.log("socketState", socketState);

  const [chattUser, setChattUser] = useState<Chat[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("toke", token);
    if (!token) {
      console.log("❌ No access token");
      return;
    }

    const socket = io(import.meta.env.VITE_USER_BASE_URL, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    setSocketState(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

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
  console.log("selectedChatData:", selectedChatData);

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

  const fetchChatUsers = async (chatId: string) => {
    try {
      console.log("chatId", chatId);
      const res = await usersChatFetch(chatId);
      console.log("resssss", res);

      if (res && res.users && res.users.length > 0) {
        setChattUser((prev) =>
          prev.map((chat) => {
            if (chat._id === chatId) {
              const otherUser = res.users[0];
              return {
                ...chat,
                name: otherUser?.name || chat.name || "Unknown User",
              };
            }
            return chat;
          })
        );
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

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

  useEffect(() => {
    const loadChats = async () => {
      try {
        const chats = await getAllChats();
        const userId = localStorage.getItem("userId");
        console.log("userId", userId);
        setChattUser(normalizeChats(chats, userId!));
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };
    loadChats();
  }, []);

  const fetchMessage = async (chatId: string) => {
    try {
      console.log("fetchMessage", chatId);
      const res = await clickUser(chatId);
      const uiMessages = res.messages.map(mapIMessageToUIMessage);
      setMessages(uiMessages);
    } catch (error) {
      console.error("it is fetchMessage error", error);
    }
  };

  const mapIMessageToUIMessage = (msg: IMessage): UIMessage => {
    return {
      id: msg._id,
      content: msg.content,
      senderId: {
        _id: user?.id ?? "",
        name: user?.name ?? "",
        email: user?.email ?? "",
      },
      sender: "other",
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    if (!socketState) {
      console.error("❌ Socket is not initialized");
      toast.error("Socket is not connected");
      return;
    }

    if (!socketState.connected) {
      console.error("❌ Socket is not connected");
      toast.error("Socket is not connected");
      return;
    }

    try {
      setIsSending(true);

      const message = {
        chatId: selectedChat,
        receiverId: selectedChatData?.receiverId,
        content: messageInput.trim(),
      };
      console.log("receiverId:", selectedChatData?.receiverId);
      console.log("📤 Sending message:", message);
      console.log("🔌 Socket ID:", socketState.id);

      socketState.emit("send-message", message);

      const newUIMessage: UIMessage = {
        id: Math.random().toString(36).substring(7),
        content: messageInput.trim(),
        sender: "me",
        senderId: {
          _id: user?.id ?? "",
          name: user?.name ?? "",
          email: user?.email ?? "",
        },
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

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
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentUserId = localStorage.getItem("userId");
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name
      .toLowerCase()
      .includes(userSearch.toLowerCase());
    const isLoggedInUser = String(u._id) === String(currentUserId);
    return matchesSearch && !isLoggedInUser;
  });

  // ── Avatar initials helper ──
  const getInitials = (name?: string) =>
    name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className={`flex h-screen w-full overflow-hidden text-[#F0EDE5] transition-colors duration-500 ${currentTheme.bgClass}`}
      style={{
        backgroundImage:
          "radial-gradient(circle at top right, rgba(240, 237, 229, 0.08), transparent 40%)",
        backgroundColor: "#004643",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastStyle={{
          background: "#004643",
          color: "#F0EDE5",
          border: "1px solid rgba(240, 237, 229, 0.15)",
        }}
      />

      <style>{`
        .chat-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: rgba(0, 70, 67, 0.5);
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(240, 237, 229, 0.35);
          border-radius: 8px;
        }
        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background: #F0EDE5;
        }
      `}</style>

      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`
          flex flex-col border-r border-[rgba(240,237,229,0.12)] bg-[rgba(0,70,67,0.96)] backdrop-blur-xl
          transition-all duration-300
          ${showSidebar ? "flex" : "hidden"}
          w-full md:flex md:w-80 lg:w-96
          absolute inset-0 z-20
          md:relative md:z-auto
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-[rgba(240,237,229,0.12)] px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl border border-[rgba(240,237,229,0.2)] ${currentTheme.primaryGlow}`}
            >
              <IconMessageCircle className="h-4 w-4 text-[#F0EDE5]" />
            </div>
            <h1 className="text-base font-bold tracking-tight text-[#F0EDE5]">
              Messages
            </h1>
          </div>

          <div className="relative flex items-center gap-1">
            {/* New chat */}
            <button
              onClick={() => setShowNewChat(true)}
              className="rounded-xl border border-transparent p-2 text-[rgba(240,237,229,0.65)] transition hover:border-[rgba(240,237,229,0.2)] hover:bg-[#F0EDE5] hover:text-[#004643]"
              title="New chat"
            >
              <GrAdd className="h-4 w-4" />
            </button>

            {/* Theme palette */}
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowUserMenu(false);
              }}
              className="rounded-xl border border-transparent p-2 text-[rgba(240,237,229,0.65)] transition hover:border-[rgba(240,237,229,0.2)] hover:bg-[#F0EDE5] hover:text-[#004643]"
              title="Change theme"
            >
              <IconPalette className="h-4 w-4" />
            </button>

            {/* Menu */}
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowThemeMenu(false);
              }}
              className="rounded-xl border border-transparent p-2 text-[rgba(240,237,229,0.65)] transition hover:border-[rgba(240,237,229,0.2)] hover:bg-[#F0EDE5] hover:text-[#004643]"
              title="Menu"
            >
              <IconDotsVertical className="h-4 w-4" />
            </button>

            {/* User dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-[rgba(240,237,229,0.12)] bg-[rgba(0,70,67,0.98)] p-1.5 shadow-2xl backdrop-blur-xl"
                >
                  <button
                    onClick={() => navigate("/Profile")}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[#F0EDE5] transition hover:bg-[#F0EDE5] hover:text-[#004643]"
                  >
                    <IconUser className="h-4 w-4" />
                    Profile
                  </button>
                  <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[#F0EDE5] transition hover:bg-[#F0EDE5] hover:text-[#004643]">
                    <IconSettings className="h-4 w-4" />
                    Settings
                  </button>
                  <div className="my-1 border-t border-[rgba(240,237,229,0.1)]" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[rgba(240,237,229,0.75)] transition hover:bg-[#F0EDE5] hover:text-[#004643]"
                  >
                    <IconLogout className="h-4 w-4" />
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Theme picker dropdown */}
            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-[rgba(240,237,229,0.12)] bg-[rgba(0,70,67,0.98)] p-2 shadow-2xl backdrop-blur-xl"
                >
                  <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-[rgba(240,237,229,0.5)]">
                    Theme
                  </p>
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition hover:bg-[rgba(240,237,229,0.08)]"
                    >
                      <div
                        className={`h-4 w-4 rounded-full border border-[rgba(240,237,229,0.2)] ${theme.primaryGlow}`}
                      />
                      <span
                        className={
                          currentTheme.id === theme.id
                            ? "font-medium text-[#F0EDE5]"
                            : "text-[rgba(240,237,229,0.75)]"
                        }
                      >
                        {theme.name}
                      </span>
                      {currentTheme.id === theme.id && (
                        <span className="ml-auto text-xs text-[#F0EDE5]">✓</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* New chat modal */}
            <AnimatePresence>
              {showNewChat && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,70,67,0.55)] px-4 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.96, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.96, opacity: 0, y: 10 }}
                    transition={{ type: "spring", damping: 20, stiffness: 250 }}
                    className="w-full max-w-md rounded-2xl border border-[rgba(240,237,229,0.12)] bg-[#004643] p-5 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-[#F0EDE5]">
                          Start a new chat
                        </h3>
                        <p className="text-xs text-[rgba(240,237,229,0.65)]">
                          Search and select a user to message
                        </p>
                      </div>
                      <button
                        onClick={() => setShowNewChat(false)}
                        className="rounded-xl p-1.5 text-[rgba(240,237,229,0.65)] transition hover:bg-[#F0EDE5] hover:text-[#004643]"
                      >
                        <IconX className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="relative mb-3">
                      <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(240,237,229,0.65)]" />
                      <input
                        type="text"
                        placeholder="Find people…"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className={`w-full rounded-xl border border-[rgba(240,237,229,0.15)] bg-[rgba(240,237,229,0.08)] py-2.5 pl-9 pr-4 text-sm text-[#F0EDE5] placeholder:text-[rgba(240,237,229,0.5)] focus:outline-none ${currentTheme.inputFocus}`}
                      />
                    </div>

                    <div className="chat-scroll max-h-64 space-y-1 overflow-y-auto">
                      {filteredUsers.length === 0 ? (
                        <div className="py-8 text-center text-sm text-[rgba(240,237,229,0.65)]">
                          No users found
                        </div>
                      ) : (
                        filteredUsers.map((u) => (
                          <button
                            key={u._id}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[rgba(240,237,229,0.08)]"
                            onClick={async () => {
                              const chat = await addChatUsers(u.email);
                              if (!chat) return;
                              fetchChatUsers(chat._id);
                              setSelectedChat(chat._id);
                              setShowNewChat(false);
                            }}
                          >
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[rgba(240,237,229,0.3)] text-sm font-semibold ${currentTheme.avatarGlow}`}
                            >
                              {getInitials(u.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-[#F0EDE5]">
                                {u.name}
                              </p>
                              <p className="truncate text-xs text-[rgba(240,237,229,0.65)]">
                                {u.email}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-lg border border-[rgba(240,237,229,0.2)] bg-transparent px-2.5 py-1 text-xs text-[#F0EDE5]">
                              Chat
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-[rgba(240,237,229,0.1)] px-4 py-3">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(240,237,229,0.65)]" />
            <input
              type="text"
              placeholder="Search conversations…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl border border-[rgba(240,237,229,0.15)] bg-[rgba(240,237,229,0.08)] py-2 pl-9 pr-4 text-sm text-[#F0EDE5] placeholder:text-[rgba(240,237,229,0.5)] focus:outline-none ${currentTheme.inputFocus}`}
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="chat-scroll flex-1 overflow-y-auto">
          {filteredChats.length > 0 ? (
            <AnimatePresence>
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => {
                    if (selectedChat && selectedChat !== chat._id) {
                      socketState?.emit("leave-chat", selectedChat);
                    }
                    socketState?.emit("join-chat", chat._id);
                    setSelectedChat(chat._id);
                    fetchMessage(chat._id);
                    // Auto-hide sidebar on mobile when chat is selected
                    setShowSidebar(false);
                  }}
                  className={`group relative flex cursor-pointer items-center gap-3 border-b border-[rgba(240,237,229,0.08)] px-4 py-3 transition-all duration-200 ${
                    selectedChat === chat._id
                      ? currentTheme.activeChatBg
                      : "bg-transparent text-[rgba(240,237,229,0.75)] hover:bg-[rgba(240,237,229,0.08)] hover:text-[#F0EDE5]"
                  }`}
                >
                  {/* Active indicator bar */}
                  {selectedChat === chat._id && (
                    <div className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-[#004643]" />
                  )}

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-500 ${
                        selectedChat === chat._id
                          ? "border-[#004643] bg-[rgba(0,70,67,0.08)] text-[#004643]"
                          : `border-[rgba(240,237,229,0.3)] ${currentTheme.avatarGlow}`
                      }`}
                    >
                      {getInitials(chat.name)}
                    </div>
                    {chat.isOnline && (
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#004643] ${currentTheme.onlineDot}`}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`truncate text-sm font-semibold ${
                          selectedChat === chat._id
                            ? "text-[#004643]"
                            : "text-[#F0EDE5]"
                        }`}
                      >
                        {chat.name || "Unknown"}
                      </h3>
                      <span
                        className={`shrink-0 text-[11px] ${
                          selectedChat === chat._id
                            ? "text-[rgba(0,70,67,0.55)]"
                            : "text-[rgba(240,237,229,0.5)]"
                        }`}
                      >
                        {chat.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-xs ${
                          selectedChat === chat._id
                            ? "text-[rgba(0,70,67,0.7)]"
                            : "text-[rgba(240,237,229,0.65)]"
                        }`}
                      >
                        {chat.lastMessage || "No messages yet"}
                      </p>
                      {(chat.unread ?? 0) > 0 && (
                        <span
                          className={`flex h-4.5 min-w-[18px] shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold ${currentTheme.unreadBadge}`}
                        >
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(240,237,229,0.08)]">
                <IconMessageCircle className="h-6 w-6 text-[rgba(240,237,229,0.8)]" />
              </div>
              <p className="text-sm font-medium text-[#F0EDE5]">
                No conversations yet
              </p>
              <p className="mt-1 text-xs text-[rgba(240,237,229,0.65)]">
                {searchQuery
                  ? "No results for that search"
                  : "Start one with the + button above"}
              </p>
            </div>
          )}
        </div>

        {/* Logged-in user strip */}
        {user && (
          <div className="flex items-center gap-2.5 border-t border-[rgba(240,237,229,0.12)] px-4 py-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[rgba(240,237,229,0.3)] text-xs font-bold ${currentTheme.avatarGlow}`}
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#F0EDE5]">
                {user.name}
              </p>
              <p className="truncate text-[10px] text-[rgba(240,237,229,0.65)]">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* ══ MAIN CHAT AREA ═══════════════════════════════════════════════════ */}
      <div
        className={`flex flex-1 flex-col ${showSidebar ? "hidden md:flex" : "flex"}`}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-between border-b border-[rgba(240,237,229,0.12)] bg-[rgba(0,70,67,0.9)] px-4 py-3 backdrop-blur-[16px]"
            >
              <div className="flex items-center gap-3">
                {/* Mobile back button */}
                <button
                  onClick={() => setShowSidebar(true)}
                  className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[rgba(240,237,229,0.65)] transition hover:bg-[#F0EDE5] hover:text-[#004643] md:hidden"
                  aria-label="Back to conversations"
                >
                  <IconArrowLeft className="h-4 w-4" />
                </button>

                <div className="relative shrink-0">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#F0EDE5] text-sm font-semibold ${currentTheme.avatarGlow}`}
                  >
                    {getInitials(selectedChatData?.name)}
                  </div>
                  {selectedChatData?.isOnline && (
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#004643] ${currentTheme.onlineDot}`}
                    />
                  )}
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#F0EDE5]">
                    {selectedChatData?.name}
                  </h2>
                  <p className="text-[11px] text-[rgba(240,237,229,0.65)]">
                    {selectedChatData?.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button className="rounded-xl border border-transparent p-2 text-[rgba(240,237,229,0.65)] transition hover:border-[rgba(240,237,229,0.2)] hover:bg-[#F0EDE5] hover:text-[#004643]">
                  <IconPhone className="h-4 w-4" />
                </button>
                <button className="rounded-xl border border-transparent p-2 text-[rgba(240,237,229,0.65)] transition hover:border-[rgba(240,237,229,0.2)] hover:bg-[#F0EDE5] hover:text-[#004643]">
                  <IconVideo className="h-4 w-4" />
                </button>
                <button className="rounded-xl border border-transparent p-2 text-[rgba(240,237,229,0.65)] transition hover:border-[rgba(240,237,229,0.2)] hover:bg-[#F0EDE5] hover:text-[#004643]">
                  <IconDotsVertical className="h-4 w-4" />
                </button>
              </div>
            </motion.div>

            {/* Messages */}
            <div className="chat-scroll flex-1 overflow-y-auto px-4 py-5 md:px-6">
              <div className="mx-auto max-w-2xl space-y-3">
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(240,237,229,0.08)]">
                        <IconMessageCircle className="h-6 w-6 text-[rgba(240,237,229,0.8)]" />
                      </div>
                      <p className="text-sm text-[#F0EDE5]">No messages yet</p>
                      <p className="mt-1 text-xs text-[rgba(240,237,229,0.65)]">
                        Say hello to start the conversation
                      </p>
                    </motion.div>
                  ) : (
                    messages.map((message, index) => {
                      const currentUserIdLocal = String(user?.id);
                      const senderId =
                        typeof message.senderId === "object"
                          ? String(message.senderId._id)
                          : String(message.senderId);
                      const isMe = currentUserIdLocal === senderId;

                      console.log("CURRENT USER:", currentUserIdLocal);
                      console.log("SENDER:", senderId);
                      console.log("IS ME:", isMe);

                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex max-w-[72%] items-end gap-2 ${
                              isMe ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            {/* Other user avatar */}
                            {!isMe && (
                              <div
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[rgba(240,237,229,0.3)] text-[11px] font-semibold ${currentTheme.avatarGlow}`}
                              >
                                {getInitials(selectedChatData?.name)}
                              </div>
                            )}

                            <div>
                              <div
                                className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                                  isMe
                                    ? `${currentTheme.chatBubbleMe} rounded-br-sm`
                                    : `${currentTheme.chatBubbleOther} rounded-bl-sm`
                                }`}
                              >
                                {message.content}
                              </div>
                              <p
                                className={`mt-1 text-[10px] text-[rgba(240,237,229,0.5)] ${
                                  isMe ? "text-right" : "text-left"
                                }`}
                              >
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="border-t border-[rgba(0,70,67,0.12)] bg-[#F0EDE5] px-4 py-3"
            >
              <div className="mx-auto flex max-w-2xl items-center gap-2">
                <button className="shrink-0 rounded-xl p-2 text-[#004643] transition hover:bg-[rgba(0,70,67,0.08)]">
                  <IconPaperclip className="h-5 w-5" />
                </button>

                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Write a message…"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full rounded-xl border border-[rgba(0,70,67,0.15)] bg-[rgba(0,70,67,0.06)] py-2.5 pl-4 pr-10 text-sm text-[#004643] placeholder:text-[rgba(0,70,67,0.5)] focus:border-[#004643] focus:outline-none focus:ring-[3px] focus:ring-[rgba(0,70,67,0.08)]"
                  />
                  <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[rgba(0,70,67,0.55)] transition hover:text-[#004643]">
                    <IconMoodSmile className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isSending}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#004643] text-[#F0EDE5] transition hover:scale-105 hover:bg-[rgba(0,70,67,0.88)] hover:shadow-[0_6px_20px_rgba(0,70,67,0.25)] disabled:opacity-40 disabled:hover:scale-100"
                  title="Send message"
                >
                  <IconSend className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </>
        ) : (
          /* Empty state — no chat selected */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 items-center justify-center"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(240,237,229,0.2)] bg-[rgba(240,237,229,0.08)]">
                <IconMessageCircle className="h-8 w-8 text-[rgba(240,237,229,0.8)]" />
              </div>
              <h2 className="mb-1 text-lg font-semibold text-[#F0EDE5]">
                Your conversations
              </h2>
              <p className="max-w-xs text-sm text-[rgba(240,237,229,0.65)]">
                Select a chat from the sidebar, or start a new one with the{" "}
                <span className="text-[#F0EDE5]">+</span> button.
              </p>
              {/* Show sidebar button on mobile when no chat is selected */}
              <button
                onClick={() => setShowSidebar(true)}
                className="mt-6 flex items-center gap-2 rounded-xl border border-[rgba(240,237,229,0.2)] bg-transparent px-4 py-2 text-sm font-medium text-[#F0EDE5] transition hover:bg-[#F0EDE5] hover:text-[#004643] md:hidden"
              >
                <IconMessageCircle className="h-4 w-4" />
                View conversations
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
