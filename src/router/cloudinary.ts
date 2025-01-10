import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudinaryConfig: ConfigOptions = {
  cloud_name:"dssioh7gb",
  api_key:"559118989889916",
  api_secret:"1pTZdHCh6E2g5nhIWBMjiA3KTOo",
};

cloudinary.config(cloudinaryConfig);

export default cloudinary;
