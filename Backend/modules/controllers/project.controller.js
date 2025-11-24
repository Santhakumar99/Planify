import Project from "../models/project.model.js";

export const createProject = async (req, res) => {
    try {
      const { name, description, startDate, endDate, members, status } = req.body;
      console.log(req.body)
        const userId = req.user._id;
        const project = new Project({ name, description, createdBy: userId, members,startDate, endDate, status});
        await project.save();
        res.status(200).json({
            status: "success",
            message: "Project created successfully",
            project
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}  
export const updateProject = async (req, res) => {
    try {
      const projectId = req.params.id;
      const userId = req.user._id;
  
      // find project
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ status: "error", message: "Project not found" });
      }
  
      // check permission
      if (project.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({ 
          status: "error", 
          message: "You are not allowed to update this project" 
        });
      }
  
      // update fields
      project.name = req.body.name || project.name;
      project.description = req.body.description || project.description;
      project.members = req.body.members || project.members;
  
      await project.save();
  
      res.status(200).json({
        status: "success",
        message: "Project updated successfully",
        project
      });
  
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };
  export const deleteProject = async (req, res) => {
    try {
      const projectId = req.params.id;
      const userId = req.user._id;
  
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ status: "error", message: "Project not found" });
      }
  
      // check permission
      if (project.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({
          status: "error",
          message: "You are not allowed to delete this project"
        });
      }
      await project.deleteOne();
  
      res.status(200).json({
        status: "success",
        message: "Project deleted successfully"
      });
  
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };
  
export const getAllProjects = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const projects = await Project.find({
        $or: [
          { createdBy: userId },
          { members: userId }
        ]
      }).populate("createdBy", "name email")
        .populate("members", "name email");
  
      res.status(200).json({
        status: "success",
        count: projects.length,
        projects
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };
  