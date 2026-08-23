"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
async function test() {
    try {
        console.log('test');
        const result = await cloudinary_1.v2.uploader.upload("./test.png", {
            folder: "users",
        });
        console.log(result);
    }
    catch (err) {
        console.dir(err, { depth: null });
    }
}
test();
