export interface IChatRoom {
  _id: string;
  lastMessage?: string;
  userUnreadCount: number;
  providerUnreadCount: number;
  lastMessageTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  image:{
    url:string
  }  
  name: string;
  email: string;
}

// export interface IChat {
//   _id: string;
//   users: IUser[];
//   messages: IMessage[];
//   unreadCounts: Record<string, number>;
//   createdAt: string;
//   updatedAt: string;
//   lastMessage: string;
//   content: string;
// }
export interface IChat {
  _id: string;
  users: IUser[];
  messages: IMessage[];
  unreadCounts: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  lastMessage: string | IMessage | null;
}


export interface IMessage {
  _id?: string;
  chatRoomId: string;
  senderId: string;
  senderType: "user" | "provider";
  content: string;
  image?: string;
  replyToMessageId?: string;
  replyToMessage?: IMessage;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  // text: string;
  // sender: "me" | "other";
  // timestamp: string;
  // avatar?: string;
}
