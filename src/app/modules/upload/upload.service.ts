import { PdfDetails } from "./upload.model";

// Helper function to format the date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const uploadFile = async ({ title, pdf }: { title: string; pdf: string }) => {
  // Add the current date in the desired format
  const date = formatDate(new Date());
  const fileData = await PdfDetails.create({ title, pdf, date });
  return fileData;
};
const getFile = async () => {
  const files = await PdfDetails.find();
  return files;
};
export const UploadServices = {
  uploadFile,
  getFile,
};
