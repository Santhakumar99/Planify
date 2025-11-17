import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/Connection.js";
import path from "path"
import authRoutes from "./modules/routes/user.route.js";
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join("public")));


app.use('/api/user', authRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>console.log(`Server running on Port ${PORT}`));
 