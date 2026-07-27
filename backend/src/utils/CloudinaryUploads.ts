import cloudinary from "../config/Cloudinary";
import fs from "fs";

export const uploadToCloudinary = async (filePath: string) => {
  console.log("File exists:", fs.existsSync(filePath));
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "users",
    });

    console.log("result cloudinary",result);

    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  } catch (err: any) {
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