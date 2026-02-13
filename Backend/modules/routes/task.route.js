import express from 'express'
const router = express.Router();
import { getAllTasks,createTask,updateTask,deleteTask,addComment, getTask} from '../controllers/task.controller.js';
import protection from '../../Auth/auth.js';

router.post("/createTask", protection, createTask);
router.get("/getAllTasks", protection, getAllTasks);
router.put("/:id", protection, updateTask);
router.delete("/:id", protection, deleteTask);
router.get("/:id", protection, getTask)
router.post("/comment/:id", protection, addComment);


export default router;