import mongoose, { Document, Schema, Types } from "mongoose";

export interface IChatRequest extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const chatRequestSchema = new Schema<IChatRequest>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending requests between the same users
chatRequestSchema.index(
  { sender: 1, receiver: 1 },
  { unique: true }
);

export const ChatRequestModel = mongoose.model<IChatRequest>("ChatRequest", chatRequestSchema);