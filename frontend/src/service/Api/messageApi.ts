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
}

const handleError = (error: any): never => {
  console.error(error);
  throw error;
};


export const getMessage = async (chatId: string): Promise<IChatRoom> => {
  try {
    console.log("getMessage",chatId);
    const response = await privateAxios.post<ChatResponse<IChatRoom>>( "/message/getMessages", { chatId });
    return response.data.data!;
  } catch (error) {
    return handleError(error);
  }
};


