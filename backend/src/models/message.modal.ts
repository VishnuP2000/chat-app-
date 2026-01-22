import mongoose, { Schema, Types } from "mongoose";

export interface IMessage {
  _id?: Types.ObjectId;
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  createdAt?: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", messageSchema);
