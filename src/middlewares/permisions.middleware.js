import mongoose from "mongoose";
import { ProjectMember } from "../models/projectMember.model";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const validatePermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "Project id is missing");
    }

    const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const givenRole = project?.role;
    req.user.role = givenRole;

    if (!roles.includes(givenRole)) {
      throw new ApiError(403, "Access denied");
    }
    next();
  });
};
