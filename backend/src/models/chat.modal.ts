// backend/src/models/chat.modal.ts
import mongoose, { Schema, Types, Document } from "mongoose";

export interface IChat extends Document {
  users: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  unreadCounts?: Map<string, number> | Record<string, number>;
  createdAt?: Date;
  updatedAt?: Date;
  messages?: Types.ObjectId[];
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

// 👉 Add this here
chatSchema.pre("save", function (next) {
  // Always sort users so [A, B] and [B, A] are treated the same pair
  this.users = this.users.sort();
  next();
});

// 👉 Correct unique pair index
chatSchema.index({ users: 1 }, { unique: true });
// chatSchema.index({ users: 1, users: 1 }, { unique: true });

export const ChatModel = mongoose.model<IChat>("Chat", chatSchema);
