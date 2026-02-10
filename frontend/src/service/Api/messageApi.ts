import { privateAxios } from "../axiosInstance/userInstance";
import { IChat, IMessage } from "../../types/chat";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const sendMessage = async (payload: {
  chatId: string;
  content: string;
}): Promise<IChat> => {
try {
  console.log('sendMessage')
  const response = await privateAxios.post<ApiResponse<IChat>>(
    "/message/send",
    {payload}
  );
  console.log('response.messages', response.data.data.messages)
  console.log('response.data', response.data.data)
  return response.data.data;
} catch (error) {
      console.error(error);
    throw error;
}
};
export const clickUser = async (chatId: string): Promise<IChat> => {
  try {
    console.log("clickUser");
    const response = await privateAxios.get<ApiResponse<IChat>>(
      `/message/findUser/${chatId}`,
    );
    console.log("response.data.messages", response.data.data.messages);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
