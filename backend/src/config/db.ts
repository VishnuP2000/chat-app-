import mongoose from "mongoose";

export const connectDB = async () => {
  console.log("🔌 Attempting to plug into MongoDB…");

  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION as string);
    
    console.log("✅ MongoDB says: “Connection successful!”");
    console.log("🍀 Your data has found its happy home in the database!");
  } catch (err: any) {
    console.log("🚨 MongoDB Connection Failed!");
    console.log(`👻 Error: ${err.message || err}`);
    console.log("☕ Maybe give the server another cup of coffee?");
  }
};
