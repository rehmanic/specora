import express from "express";
import * as projectsController from "./projectsController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import { requirePermissions } from "../../middlewares/common/requirePermissions.js";
import requireFields from "../../middlewares/common/requireFields.js";
import { validateProjectDataInput } from "../../middlewares/projects/inputValidation.js";
import checkProjectExists from "../../middlewares/projects/checkProjectExists.js";

const router = express.Router();
const projectWriteChain = [requireFields(["name", "start_date", "end_date"]),validateProjectDataInput];

router.use(verifyToken);

// --- Core Project CRUD ---
router.post("/",requirePermissions("create_project"), ...projectWriteChain,checkProjectExists("create"),projectsController.createProject);
router.get("/all", requirePermissions("view_projects"), projectsController.getAllProjects);
router.get("/:userId", requirePermissions("view_projects"), projectsController.getSingleUserProjects);
router.put("/:projectId",requirePermissions("update_project"), ...projectWriteChain,checkProjectExists("update"),projectsController.updateProject);
router.delete("/:projectId", requirePermissions("delete_project"), projectsController.deleteProject);

// --- Member Management ---
router.get("/:projectId/members", requirePermissions("view_project_members"), projectsController.getProjectMembers);
router.post("/:projectId/members", requirePermissions("add_project_member"), projectsController.addProjectMember);
router.delete("/:projectId/members/:memberId", requirePermissions("remove_project_member"), projectsController.removeProjectMember);

// --- Tag Management ---
router.get("/:projectId/tags", requirePermissions("view_project_tags"), projectsController.getProjectTags);
router.post("/:projectId/tags", requirePermissions("add_project_tag"), projectsController.addProjectTag);
router.delete("/:projectId/tags/:tag", requirePermissions("remove_project_tag"), projectsController.removeProjectTag);

export default router;