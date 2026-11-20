import mongoose from "mongoose";
import { AvailableUserRoles, UserRoleEnum } from "../utils/constants.js";

const projectMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRoleEnum.MEMBER,
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectMember = mongoose.model(
  "ProjectMember",
  projectMemberSchema,
);
