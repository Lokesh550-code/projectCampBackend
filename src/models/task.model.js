import mongoose from "mongoose";
import { TaskStatusEnum, AvailableTaskStatus } from "../utils/constants/js";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: TaskStatusEnum,
      default: TaskStatusEnum.TODO,
    },
    attachments: {
      type: [
        {
          url: String,
          mimeType: String,
          size: Number,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Task = mongoose.model("Task", taskSchema);
