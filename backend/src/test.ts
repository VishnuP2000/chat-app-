import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function test() {
  try {
    console.log('test')
    const result = await cloudinary.uploader.upload("./test.png", {
        folder: "users",
    });

    console.log(result);
  } catch (err) {
    console.dir(err, { depth: null });
  }
}

test();