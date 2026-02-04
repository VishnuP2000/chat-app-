"use client";

import React, { JSX, useState, useRef, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { motion, AnimatePresence } from "framer-motion";
import { privateAxios } from "@/service/axiosInstance/userInstance";
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
import {
  usersChatAdd,
  usersChatFetch,
  usersFetch,
} from "@/service/Api/chatApi";
import { IChat, IChatRoom, IMessage, IUser } from "@/types/chat";
import { clickUser, sendMessage } from "@/service/Api/messageApi";

interface Chat extends IChatRoom {
  name?: string;
  timestamp?: string;
  unread?: number;
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

const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  // console.log('selectedChat',selectedChat)
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [users, setUsers] = useState<IUser[]>([]); //   fetch full loged data
  // console.log('users',users)
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const [messages, setMessages] = useState<UIMessage[]>([]);

  console.log("messages", messages);

  const [resChatUsers, setResChatUsers] = useState<IChat | null>(null);
  // useEffect(() => {
  //   setMessages()
  // }, []);
  /* add the database chat users in the chattUser after click the fetching function */
  const [chattUser, setChattUser] = useState<Chat[]>([]);
  console.log("chatttts", chattUser);
  // useEffect(()=>{
  //   console.log('demochat',chattUser)
  // },[chattUser])

  /*--------------------Fetching Users for Listing------------------------*/

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      // const token = localStorage.getItem("access-token");

      const res = await usersFetch();
      console.log("res", res);
      console.log("res.data.users", res);
      setUsers(res);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setLoadingUsers(false);
    }
  };

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
  // console.log('selectedChatData',selectedChatData)

  /*-----------------Load all chats on mount-------------------*/

  // useEffect(() => {
  //   const loadAllChats = async () => {
  //     try {
  //       const allChats = await getAllChats();
  //       console.log("All chats loaded:", allChats);

  //       // Transform backend chat data to Chat interface with user names
  //       // The backend should return chats with populated users
  //       const transformedChats: Chat[] = allChats.map((chatRoom: any) => {
  //         // Get the other user's name (not the current logged-in user)
  //         // Backend should populate users array
  //         let otherUserName = "Unknown User";
  //         if (chatRoom.users && Array.isArray(chatRoom.users) && chatRoom.users.length > 0) {
  //           // If users is populated with name/email, get the first user
  //           const otherUser = chatRoom.users.find((u: any) => typeof u === 'object' && u.name) || chatRoom.users[0];
  //           otherUserName = otherUser?.name || otherUser?.email || "Unknown User";
  //         }

  //         return {
  //           ...chatRoom,
  //           name: otherUserName,
  //           timestamp: chatRoom.lastMessageTime || chatRoom.updatedAt || "",
  //           lastMessage: chatRoom.lastMessage?.content || "",
  //           unread: chatRoom.userUnreadCount || 0,
  //         };
  //       });

  //       setChattUser(transformedChats);
  //     } catch (error) {
  //       console.error("Failed to load chats:", error);
  //     }
  //   };

  //   loadAllChats();
  // }, []);

  /*-----------------add chat users in the database --------------------*/

  const addChatUsers = async (userMail: string) => {
    try {
      console.log("userMail", userMail);
      const chat = await usersChatAdd(userMail);
      console.log("chat data", chat);
      if (!chat) return;

      // Find the user from the users list to get their name
      const user = users.find((u) => u.email === userMail);
      console.log("user", user);
      setChattUser((prev) => {
        if (prev.some((c) => c._id === chat._id)) return prev;
        return [...prev, { ...chat, name: user?.name || "Unknown User" }];
      });
      setSelectedChat(chat._id);
      setShowNewChat(false);
      return chat;
    } catch (err) {
      toast.error("Failed to start chat");
    }
  };

  /*-----------------Fetching chat Users------------------*/

  const fetchChatUsers = async (chatId: string) => {
    try {
      // const token = localStorage.getItem("access-token");
      console.log("chatId", chatId);

      const res = await usersChatFetch(chatId);
      console.log("resssss", res);
      setResChatUsers(res);

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

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

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
    if (!messageInput.trim() || !selectedChat) return;

    try {
      setIsSending(true);
      console.log("handleSendMessage");
      const messageDatas = await sendMessage({
        chatId: selectedChat,
        content: messageInput.trim(),
      });
      console.log("messageDatas", messageDatas);
      console.log("messageDatas", messageDatas.messages);
      // console.log('messageDatas',messageDatas)

      if (!messageDatas) return;

      // const uiMessage = mapIMessageToUIMessage(messageDatas);
      const latestMessage =
      messageDatas.messages[messageDatas.messages.length-1];


      setMessages((prev) => [...prev,mapIMessageToUIMessage(latestMessage),]);
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

  const filteredChats = chattUser.filter((chat) =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-linear-to-br from-slate-950 via-indigo-950 to-purple-900 text-white">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-purple-500 to-indigo-500">
              <IconMessageCircle className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Messages</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => {
                setShowNewChat(true);
                fetchUsers(); // 🔥 THIS WAS MISSING
              }}
              className="mr-1 rounded-full p-2 transition hover:bg-white/10"
            >
              <GrAdd className="h-5 w-5" />
            </button>
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
                          className="w-full rounded-xl border border-white/15 bg-white/5 px-10 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                        />
                      </div>
                    </div>
                    <div className="mt-4 max-h-72 overflow-y-auto">
                      {users
                        .filter((u) =>
                          u.name
                            .toLowerCase()
                            .includes(userSearch.toLowerCase()),
                        )
                        .map((u) => (
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
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-purple-400 to-indigo-400 text-sm font-semibold">
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
              className="w-full rounded-xl border border-white/15 bg-white/5 px-10 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
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
                      setSelectedChat(chat._id);
                      fetchMessage(chat._id);
                    }}
                    className={`group relative flex cursor-pointer items-center gap-3 border-b border-white/5 p-4 transition ${
                      selectedChat === chat._id
                        ? "bg-white/10"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r from-purple-400 to-indigo-400 text-sm font-semibold">
                        {chat.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      {chat.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-400" />
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
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-500 px-1.5 text-xs font-semibold text-white">
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-purple-400 to-indigo-400 text-sm font-semibold">
                    {selectedChatData?.name?.charAt(0)}
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
                      // key={message.id}
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
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 text-xs font-semibold">
                            {selectedChatData?.name?.charAt(0)}
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
                      onKeyDown={handleKeyPress}
                      className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                    />
                  </div>
                  <button className="rounded-full p-2 transition hover:bg-white/10">
                    <IconMoodSmile className="h-5 w-5 text-slate-400" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || isSending}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
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
