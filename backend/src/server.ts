import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter";
import { connectDB } from "./config/db";

const app = express();
dotenv.config();
connectDB();

app.use(express.json());  // it is use to parse 
app.use(express.urlencoded({ extended: true }));

console.log('first')
app.use("/api", userRouter);

app.use((req, res) => {   // if the router is not match the userRouter so immidiatly working app.use((req,res)=>) 'hello', 
  res.send("hello");       // if the router is match the userRouter so it will not work
});
app.listen(process.env.PORT, () => {
  console.log("server started");
});
