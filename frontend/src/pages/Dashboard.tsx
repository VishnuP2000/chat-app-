"use client";

import React, { JSX, useState, useRef, useEffect } from "react";
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
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  timestamp: string;
  avatar?: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
  isOnline?: boolean;
}

const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock data - replace with real data from your API
  const [chats] = useState<Chat[]>([
    {
      id: "1",
      name: "Alice Johnson",
      lastMessage: "Hey! How are you doing?",
      timestamp: "2:30 PM",
      unread: 2,
      isOnline: true,
    },
    // {
    //   id: "2",
    //   name: "Bob Smith",
    //   lastMessage: "See you tomorrow!",
    //   timestamp: "1:15 PM",
    //   unread: 0,
    //   isOnline: true,
    // },
    // {
    //   id: "3",
    //   name: "Charlie Brown",
    //   lastMessage: "Thanks for the help!",
    //   timestamp: "12:00 PM",
    //   unread: 1,
    //   isOnline: false,
    // },
    // {
    //   id: "4",
    //   name: "Diana Prince",
    //   lastMessage: "Can we schedule a meeting?",
    //   timestamp: "Yesterday",
    //   unread: 0,
    //   isOnline: true,
    // },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! How are you doing?",
      sender: "other",
      timestamp: "2:25 PM",
    },
    {
      id: "2",
      text: "I'm doing great, thanks for asking! How about you?",
      sender: "me",
      timestamp: "2:26 PM",
    },
    {
      id: "3",
      text: "Pretty good! Just working on some projects.",
      sender: "other",
      timestamp: "2:27 PM",
    },
  ]);

  useEffect(() => {
    if (selectedChat) {
      scrollToBottom();
    }
  }, [messages, selectedChat]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access-token");
    navigate("/sign-in");
    toast.success("Logged out successfully");
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatData = chats.find((chat) => chat.id === selectedChat);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-900 text-white">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
              <IconMessageCircle className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Messages</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="rounded-full p-2 transition hover:bg-white/10"
            >
              <IconDotsVertical className="h-5 w-5" />
              
            </button>
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 z-50 w-48 rounded-xl bg-white/10 p-2 backdrop-blur-xl ring-1 ring-white/20"
                >
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/10">
                    <IconUser className="h-4 w-4" />
                    Profile
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/10">
                    <IconSettings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-300 transition hover:bg-white/10"
                  >
                    <IconLogout className="h-4 w-4" />
                    Logout
                  </button>
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
              className="w-full rounded-xl border border-white/15 bg-white/5 px-10 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedChat(chat.id)}
                className={`group relative flex cursor-pointer items-center gap-3 border-b border-white/5 p-4 transition ${
                  selectedChat === chat.id ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 text-sm font-semibold">
                    {chat.name.charAt(0)}
                  </div>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-400" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="truncate font-semibold text-white">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-slate-400">{chat.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm text-slate-300">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-500 px-1.5 text-xs font-semibold text-white">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 text-sm font-semibold">
                    {selectedChatData?.name.charAt(0)}
                  </div>
                  {selectedChatData?.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-400" />
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
                        message.sender === "me" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-[70%] items-end gap-2 ${
                          message.sender === "me" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {message.sender === "other" && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 text-xs font-semibold">
                            {selectedChatData?.name.charAt(0)}
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2.5 ${
                            message.sender === "me"
                              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                              : "bg-white/10 text-white backdrop-blur"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`mt-1 text-xs ${
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
                      onKeyPress={handleKeyPress}
                      className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                    />
                  </div>
                  <button className="rounded-full p-2 transition hover:bg-white/10">
                    <IconMoodSmile className="h-5 w-5 text-slate-400" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
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