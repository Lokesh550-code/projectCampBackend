import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/projectMember.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { UserRoleEnum } from "../utils/constants.js";

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await ProjectMember.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "projects",
        foreignField: "_id",
        as: "Projects",
        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "projects",
              as: "projectmembers",
            },
          },
          {
            $addFields: {
              members: {
                $size: "$projectmembers",
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$projects",
    },
    {
      $project: {
        project: {
          _id: 1,
          name: 1,
          description: 1,
          members: 1,
          createdAt: 1,
          createdBy: 1,
        },
        role: 1,
        _id: 0,
      },
    },
  ]);

  res.status(
    200,
    new ApiResponse(200, projects, "Projects fetched successfully"),
  );
});

export const getProjectsById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  res.status(200).json(new ApiResponse(200, "Project fetched successfully"));
});

export const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Title and description are required");
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
  const { name, description } = req.body;

  if (!name && !description) {
    throw new ApiError(401, "Name and description are required");
  }

  const project = Project.create({
    name,
    description,
    createdBy: mongoose.Types.ObjectId(req.user._id),
  });

  if (!project) {
    throw new ApiError(500, "Project updation failed");
  }

  res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, project, "Project deleted successfully"));
});

export const addMembersToProject = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const project = await ProjectMember.findByIdAndUpdate(
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role,
    },
    {
      new: true,
      upsert: true,
    },
  );

  res
    .status(201)
    .json(new ApiResponse(201, {}, "Project member added successfully"));
});

export const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const projectMembers = ProjectMember.aggregate([
    {
      $match: {
        project: new mongoose.types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
    {
      $project: {
        project: 1,
        user: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectMembers,
        "Project members fetched successfully",
      ),
    );
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  // placeholder
});

export const deleteMember = asyncHandler(async (req, res) => {
  // placeholder
});
