import express from "express";
import {
  addMembersToProject,
  createProject,
  deleteMember,
  deleteProject,
  getProjectMembers,
  getProjects,
  getProjectsById,
  updateMemberRole,
  updateProject,
} from "../controllers/project.controller.js";

import {
  createProjectValidator,
  addMemberToProjectValidator,
} from "../validators/index.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  validate,
  validatePermission,
} from "../middlewares/validator.middleware.js";
import { AvailableUserRoles, UserRoleEnum } from "../utils/constants.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", getProjects);
router.post("/", createProjectValidator(), validate, createProject);
router.get(
  "/:projectId",
  validatePermission(AvailableUserRoles),
  getProjectsById,
);
router.put(
  "/:projectId",
  validatePermission([UserRoleEnum.ADMIN]),
  updateProject,
);
router.delete(
  "/:projectId",
  validatePermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
  deleteProject,
);
router.post(
  "/member/:projectId",
  validatePermission([UserRoleEnum.ADMIN, UserRoleEnum.PROJECT_ADMIN]),
  addMembersToProject,
);
router.get(
  "/member/:projectId",
  validatePermission([
    UserRoleEnum.ADMIN,
    UserRoleEnum.PROJECT_ADMIN,
    UserRoleEnum.MEMBER,
  ]),
  getProjectMembers,
);
router.put(
  "/member/:projectId/:userId",
  validatePermission([UserRoleEnum.ADMIN]),
  updateMemberRole,
);
router.delete(
  "/member/:projectId/:userId",
  validatePermission([UserRoleEnum.ADMIN]),
 deleteMember,
);

export default router;
