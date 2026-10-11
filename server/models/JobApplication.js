
import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: 120,
    },

    role: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
      maxlength: 120,
    },

    location: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    source: {
      type: String,
      enum: ["LinkedIn", "Naukri", "Indeed", "Company Website", "Referral", "Other"],
      default: "Other",
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Assessment",
        "Interview",
        "Offer",
        "Rejected",
        "Withdrawn",
      ],
      default: "Applied",
      index: true,
    },

    applicationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    interviewDate: {
      type: Date,
      default: null,
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    jobUrl: {
      type: String,
      trim: true,
      default: "",
    },

    notes: {
      type: String,
      maxlength: 3000,
      default: "",
    },

    resumeVersion: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

jobApplicationSchema.index({ user: 1, createdAt: -1 });

const JobApplication = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);

export default JobApplication;
