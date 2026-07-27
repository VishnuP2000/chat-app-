import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
console.log('  api_key:', process.env.API_KEY)
console.log('  api_secret:',process.env.API_SECRET)
console.log('cloudinary.config()',cloudinary.config());
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
console.log('cloudinary.config()',cloudinary.config());
(async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary Ping:", result);
  } catch (err: any) {
    console.error("Cloudinary Ping Error:");
    console.dir(err, { depth: null });
  }
})();

export default cloudinary;