"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    console.log("🔌 Attempting to plug into MongoDB…");
    try {
        await mongoose_1.default.connect(process.env.MONGODB_CONNECTION);
        console.log("✅ MongoDB says: “Connection successful!”");
        console.log("🍀 Your data has found its happy home in the database!");
    }
    catch (err) {
        console.log("🚨 MongoDB Connection Failed!");
        console.log(`👻 Error: ${err.message || err}`);
        console.log("☕ Maybe give the server another cup of coffee?");
    }
};
exports.connectDB = connectDB;
