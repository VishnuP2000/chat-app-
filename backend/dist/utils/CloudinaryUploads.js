"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const Cloudinary_1 = __importDefault(require("../config/Cloudinary"));
const fs_1 = __importDefault(require("fs"));
const uploadToCloudinary = async (filePath) => {
    console.log("File exists:", fs_1.default.existsSync(filePath));
    try {
        const result = await Cloudinary_1.default.uploader.upload(filePath, {
            folder: "users",
        });
        console.log("result cloudinary", result);
        return {
            publicId: result.public_id,
            url: result.secure_url,
        };
    }
    catch (err) {
        console.dir(err, { depth: null });
        console.log("message:", err.message);
        console.log("http_code:", err.http_code);
        console.log("name:", err.name);
        if (err.response) {
            console.dir(err.response, { depth: null });
        }
        throw err;
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
