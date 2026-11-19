import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/projectMember.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { UserRoleEnum } from "../utils/constants.js";

export const getProjects = asyncHandler(async (req, res) => {
  // placeholder
});

export const getProjectsById = asyncHandler(async (req, res) => {
  // placeholder
});

export const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name && !description) {
    throw new ApiError(400, "Title or description are required");
  }

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    const [project] = await Project.create(
      [
        {
          name,
          description,
          createdBy: new mongoose.Types.ObjectId(req.user._id),
        },
      ],
      { session },
    );

    await ProjectMember.create(
      [
        {
          user: new mongoose.Types.ObjectId(req.user._id),
          project: project._id,
          role: UserRoleEnum.ADMIN,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    res
      .status(201)
      .json(new ApiResponse(201, project, "Project created successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError(500, "Project creation unsuccessful.");
  } finally {
    await session.endSession();
  }
});

export const updateProject = asyncHandler(async (req, res) => {
  // placeholder
});

export const deleteProject = asyncHandler(async (req, res) => {
  // placeholder
});

export const addMembersToProject = asyncHandler(async (req, res) => {
  // placeholder
});

export const getProjectMembers = asyncHandler(async (req, res) => {
  // placeholder
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  // placeholder
});

export const deleteMember = asyncHandler(async (req, res) => {
  // placeholder
});
