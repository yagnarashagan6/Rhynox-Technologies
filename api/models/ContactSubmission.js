import mongoose from "mongoose";

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    message: String,
    source: String,
    service: String,
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
    },
    notes: [
      { text: String, author: String, date: { type: Date, default: Date.now } },
    ],
  },
  { timestamps: true, collection: "contact_submissions" },
);

export default mongoose.models.ContactSubmission ||
  mongoose.model("ContactSubmission", contactSubmissionSchema);
