import { privateAxios } from "../axiosInstance/userInstance";
import { IChat, IChatRoom, IMessage, IUser } from "../../types/chat";

interface ChatResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  chatRoom?: IChatRoom;
  chatRooms?: IChatRoom[];
  messages?: IMessage[];
  unreadCount?: number;
  messagesMarkedAsSeen?: boolean;
  users?: IUser[];
  totalPages:number;

}
interface UsersFetchResponse {
  users: IUser[];
  totalPages: number;
}

const handleError = (error: any): never => {
  // console.error(error);
  console.log(error)
  throw error;
};


export const usersFetch = async (page:number,limit:number=10): Promise<UsersFetchResponse> => {
  try {
    console.log("frontend service");
    const res = await privateAxios.get<ChatResponse<IUser[]>>(
      `/chat/users?page=${page}&limit=${limit}`
    );
    console.log("resApi", res);
    console.log("res.data.totalPages", res.data.totalPages);
    const users = res.data.data ?? res.data.users;
    if (!users) {
      throw new Error("No users received");
    }
    console.log("res.users", users);
    return {
          users:users,
    totalPages: res.data.totalPages,
    }
  } catch (error) {
    return handleError(error);
  }
};

export const usersChatAdd = async (userMail: string): Promise<IChat> => { // IchatRoom changed
  try {
    console.log("usersChatAdd");
    const response = await privateAxios.post<ChatResponse<IChat>>(
      "/chat/create",
      { userMail }
    );
    return response.data.data!;
  } catch (error) {
    return handleError(error);
  }
};

export const usersChatFetch = async (chatId: string): Promise<IChat> => {
  try {
    console.log("usersChatFetch");
    const response = await privateAxios.get<ChatResponse<IChat>>(
      `/chat/chatData/${chatId}`);
      const chat = response.data.data;
      console.log('getMessageResponse',chat)

    if (!chat) {
      throw new Error("Chat not found");
    }

    return chat; // ✅ IChat
  } catch (error) {
    return handleError(error);
  }
};

export const getAllChats = async (): Promise<any[]> => {
  try {
    console.log("getAllChat Chat API");
    const response = await privateAxios.get<ChatResponse<any[]>>(
      "/chat/all"
    );
    const chats = response.data.data;
    if (!chats) {
      throw new Error("No chats received");
    }
    return chats;
  } catch (error) {
    return handleError(error);
  }
};
