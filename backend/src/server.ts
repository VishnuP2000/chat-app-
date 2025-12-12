import "reflect-metadata";
import cors from 'cors';
import express,{Request,Response} from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter";
import { connectDB } from "./config/db";

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

app.use((req:Request, res:Response) => {   // if the router is not match the userRouter so immidiatly working app.use((req,res)=>) 'hello', 
  res.send("router is not exist ");       // if the router is match the userRouter so it will not work
});
app.listen(process.env.PORT, () => {
  console.log("server started");
});
