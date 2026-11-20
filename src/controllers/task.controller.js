import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { SubTask } from "../models/subTask.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AvailableTaskStatus, TaskStatusEnum } from "../utils/constants.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

export const getTasks = asyncHandler(async (req, res) => {
  // placeholder
});

export const getTaskById = asyncHandler(async (req, res) => {
  // placeholder
});

export const createTask = asyncHandler(async (req, res) => {
  // placeholder
});

export const updateTask = asyncHandler(async (req, res) => {
  // placeholder
});

export const deleteTask = asyncHandler(async (req, res) => {
  // placeholder
});

export const createSubTask = asyncHandler(async (req, res) => {
  // placeholder
});

export const updateSubTask = asyncHandler(async (req, res) => {
  // placeholder
});

export const deleteSubTask = asyncHandler(async (req, res) => {
  // placeholder
});
