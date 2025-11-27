import express from 'express'
const router = express.Router();
import { createProject ,getAllProjects,updateProject, deleteProject,getProject } from "../controllers/project.controller.js";
import protection from "../../Auth/auth.js";

router.post("/addProject",protection, createProject);
router.put("/updateProject/:id", protection, updateProject);
router.delete("/deleteProject/:id", protection, deleteProject);
router.get('/allProjects', protection, getAllProjects);
router.get('/:id', protection, getProject);
// module.exports = router;
export default router