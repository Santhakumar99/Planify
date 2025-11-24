import mongoose from "mongoose";
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Project Name is required"],
    trim: true,
    minlength: 3,
  },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String , default: "todo" },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments:{ type :String, maxlength:250},
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // optional project members
  createdAt: { type: Date, default: Date.now },
});
const Project = mongoose.model("Project", ProjectSchema);

export default Project;