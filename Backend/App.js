import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/Connection.js";
import path from "path"
import authRoutes from "./modules/routes/user.route.js";
import projectRoutes from "./modules/routes/project.route.js"
import taskRoutes from "./modules/routes/task.route.js"
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join("public")));


app.use('/api/user', authRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/task', taskRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>console.log(`Server running on Port ${PORT}`));
 