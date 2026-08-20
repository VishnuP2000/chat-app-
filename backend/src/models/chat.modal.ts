import mongoose, { Schema, Types, Document } from "mongoose";
import { IMessage } from "./message.modal";

export interface IChat extends Document {
  users: Types.ObjectId[];
  participantsKey: string;
  lastMessage?: Types.ObjectId| IMessage;
  unreadCounts?: Map<string, number> | Record<string, number>;
  createdAt?: Date;
  updatedAt?: Date;
  messages?: Types.ObjectId[]|IMessage[];
}

const chatSchema = new Schema<IChat>(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    participantsKey: {
      type: String,
      unique: true,
      required: true,
    },

    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model<IChat>("Chat", chatSchema);