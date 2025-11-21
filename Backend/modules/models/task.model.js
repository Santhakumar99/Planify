import mongoose from "mongoose";
const TaskSchema = new mongoose.Schema({
    name: {
        type: String, required: [true, "Task Name is required"],
        trim: true,
        minlength: 10
    },
    description: { type: String },
     createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startDate: { type: Date },
    endDate: { type: Date },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
},{ timestamps: true }
)
const Task = mongoose.model("Task", TaskSchema);

export default Task;
