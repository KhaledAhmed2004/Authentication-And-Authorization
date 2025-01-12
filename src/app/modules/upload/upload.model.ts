import { model, Schema } from "mongoose";

// Define the pdfDetails schema using the Mongoose Schema class
const pdfDetailsSchema = new Schema({
  pdf: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: { type: String, required: true },
});

// Export the model
export const PdfDetails = model("pdfDetails", pdfDetailsSchema);
