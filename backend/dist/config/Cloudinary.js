"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cloudinary_1 = require("cloudinary");
console.log('  api_key:', process.env.API_KEY);
console.log('  api_secret:', process.env.API_SECRET);
console.log('cloudinary.config()', cloudinary_1.v2.config());
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
console.log('cloudinary.config()', cloudinary_1.v2.config());
(async () => {
    try {
        const result = await cloudinary_1.v2.api.ping();
        console.log("Cloudinary Ping:", result);
    }
    catch (err) {
        console.error("Cloudinary Ping Error:");
        console.dir(err, { depth: null });
    }
})();
exports.default = cloudinary_1.v2;
