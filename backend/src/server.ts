import "reflect-metadata";
import cors from 'cors';
import express,{Request,Response} from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter";
import { connectDB } from "./config/db";
import chatRouter from "./routes/chatRouter";
import messageRouter from "./routes/messageRouter";
import "./models/chat.modal"
import "./models/message.modal"
import "./models/user.model"

console.log('enter to server.ts')
const app = express();
dotenv.config();
connectDB();

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

app.use(express.json());  // it is use to parse 
app.use(express.urlencoded({ extended: true }));

console.log('first')
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

app.use((req:Request, res:Response) => { 
  res.send("router is not exist ");       
});
app.listen(process.env.PORT, () => {
  console.log("server started");
});
