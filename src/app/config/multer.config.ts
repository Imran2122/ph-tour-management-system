/* eslint-disable no-useless-escape */
// font to font data image data --->multer--> Body---bodyData tow part  --req(body+file)

import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

import multer from "multer";

//

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      // my image.png  =>54ttgfrg-fd -my image.phg
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-") //replace empty space
        .replace(/\./g, "-")
        .replace(/[^a-z0-9\-\.]/g, "");
      const extension = file.originalname.split(".").pop();

      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName +
        "." +
        extension;

      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage: storage });
