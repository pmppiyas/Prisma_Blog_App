import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

cloudinary.config({
  cloud_name: envVars.CD.CLOUD_NAME,
  api_key: envVars.CD.API_KEY,
  api_secret: envVars.CD.API_SECRET,
});

export const cloudinaryUpload = cloudinary;
