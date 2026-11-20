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

const router = express.Router();

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:projectId", getProjectsById);
router.patch("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);
router.post("/member/:projectId", addMembersToProject);
router.get("/member/:projectId", getProjectMembers);
router.patch("/member/:projectId/:userId", updateMemberRole);
router.delete("/member/:projectId/:userId", deleteMember);

export default router;
