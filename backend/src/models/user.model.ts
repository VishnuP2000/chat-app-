import mongoose, { Document, Schema, Types } from "mongoose";


export interface IUser extends Document<Types.ObjectId> {
        image: {
    publicId: string;
    url: string;
  };
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    image:{
      publicId:{
        type:String,
        default:"",
      },
      url:{
        type:String,
        default:""
      },
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const userModel = mongoose.model<IUser>("User", userSchema);
