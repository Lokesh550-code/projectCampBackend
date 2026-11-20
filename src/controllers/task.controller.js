import mongoose from "mongoose";
// import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
// import { SubTask } from "../models/subTask.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import { AvailableTaskStatus, TaskStatusEnum } from "../utils/constants.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

export const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Task not found");
  }

  const tasks = Task.find({
    project: new mongoose.Types.ObjectId(project._id),
  }).populate("assignedTo", "avatar username fullname");

  res
    .status(200)
    .json(new ApiResponse(200, tasks, "Fetched tasks successfully"));
});

export const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = Task.aggregate([
    {
      $match: {
        _id: new mogoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            _id: 1,
            username: 1,
            fullname: 1,
            avatar: 1,
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
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
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
  ]);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json(new ApiResponse(200, task[0], "Task fetched successfully"));
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { ProjectId } = req.params;

  const project = await Project.findById(ProjectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(ProjectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

// export const updateTask = asyncHandler(async (req, res) => {
//   // placeholder
// });

// export const deleteTask = asyncHandler(async (req, res) => {
//   // placeholder
// });

// export const createSubTask = asyncHandler(async (req, res) => {
//   // placeholder
// });

// export const updateSubTask = asyncHandler(async (req, res) => {
//   // placeholder
// });

// export const deleteSubTask = asyncHandler(async (req, res) => {
//   // placeholder
// });
