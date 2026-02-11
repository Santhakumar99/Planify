import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/Connection.js";
import path from "path"
import authRoutes from "./modules/routes/user.route.js";
import projectRoutes from "./modules/routes/project.route.js";
import taskRoutes from "./modules/routes/task.route.js";
dotenv.config();
connectDB();
const app = express();
app.use(cors()); //Enables CORS (Cross-Origin Resource Sharing).
app.use(express.json()); // Parses incoming JSON request bodies
app.use(express.static(path.join("public"))); // Serves static files (HTML, CSS, JS, images) from the public folder.


app.use('/api/user', authRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/task', taskRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>console.log(`Server running on Port ${PORT}`));
 