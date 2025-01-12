import express from "express";
import multer from "multer";
import { UploadControllers } from "./upload.controller";
const router = express.Router();
// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage: storage });
// Define upload routes
router.post(
  "/upload-file",
  upload.single("file"),
  UploadControllers.uploadFile
);
router.get("/get-files", UploadControllers.getFile);
export const uploadRouter = router;
