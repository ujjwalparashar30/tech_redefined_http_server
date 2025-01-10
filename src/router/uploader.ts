import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary";

// Configure Cloudinary storage
const storage = new CloudinaryStorage(
  {
  cloudinary,
  params: {
    //@ts-ignore
    folder: "Tech-redefined-assets", // Specify the folder in Cloudinary
    allowed_formats: ["jpg", "png"], // Allowed file formats
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage });

export default upload;
