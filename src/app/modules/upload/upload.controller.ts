import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UploadServices } from "./upload.service";
import httpStatus from "http-status";
const uploadFile = catchAsync(async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const file = req.file?.filename;

  if (!file) {
    // Handle the case where the file is missing
    throw new Error("File is required for upload.");
  }

  const uploadedFile = await UploadServices.uploadFile({ title, pdf: file });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "File uploaded successfully",
    data: uploadedFile,
  });
});
const getFile = catchAsync(async (req, res) => {
  const files = await UploadServices.getFile();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "File uploaded successfully",
    data: files,
  });
});

export const UploadControllers = {
  uploadFile,
  getFile,
};
