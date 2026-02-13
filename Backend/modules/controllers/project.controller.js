import Project from "../models/project.model.js";

function getProjectProgress(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  const totalDays = (end - start) / (1000 * 60 * 60 * 24);
  const completedDays = (today - start) / (1000 * 60 * 60 * 24);

  if (completedDays < 0) return 0; 
  if (completedDays >= totalDays) return 100; 

  return Math.round((completedDays / totalDays) * 100);
}
function getProjectStats(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  // -------- Total Days ----------
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  // -------- Completed Days ----------
  const completedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24));

  // -------- Progress ----------
  let progress = 0;
  if (completedDays >= totalDays) progress = 100;
  else if (completedDays > 0) progress = Math.round((completedDays / totalDays) * 100);

  // -------- Days Left ----------
  const daysLeft = Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));

  return { progress, daysLeft, totalDays, completedDays };
}


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
// export const updateProject = async (req, res) => {
//     try {
//       const projectId = req.params.id;
//       const userId = req.user._id;
  
//       // find project
//       const project = await Project.findById(projectId);
  
//       if (!project) {
//         return res.status(404).json({ status: "error", message: "Project not found" });
//       }
  
//       // check permission
//       if (project.createdBy.toString() !== userId.toString()) {
//         return res.status(403).json({ 
//           status: "error", 
//           message: "You are not allowed to update this project" 
//         });
//       }
  
//       // update fields
//       project.name = req.body.name || project.name;
//       project.description = req.body.description || project.description;
//       project.members = req.body.members || project.members;
  
//       await project.save();
  
//       res.status(200).json({
//         status: "success",
//         message: "Project updated successfully",
//         project
//       });
  
//     } catch (error) {
//       res.status(500).json({ status: "error", message: error.message });
//     }
//   };
// export const updateProject = async (req, res) => {
//   try {
//     const projectId = req.params.id;
//     const userId = req.user._id;

//     // Find project
//     const project = await Project.findById(projectId);

//     if (!project) {
//       return res.status(404).json({
//         status: "error",
//         message: "Project not found",
//       });
//     }

//     // Permission: only creator can update
//     if (project.createdBy.toString() !== userId.toString()) {
//       return res.status(403).json({
//         status: "error",
//         message: "You are not allowed to update this project",
//       });
//     }

//     // Update only valid fields
//     const allowedFields = [
//       "name",
//       "description",
//       "startDate",
//       "endDate",
//       "comment",
//       "status",
//       // "budget",
//       "members",
//     ];

//     allowedFields.forEach((field) => {
//       if (req.body[field] !== undefined) {
//         project[field] = req.body[field];
//       }
//     });

//     // Fix members[] (FormData arrays come as strings or arrays)
//     if (Array.isArray(req.body["members[]"])) {
//       project.members = req.body["members[]"];
//     } else if (req.body["members[]"]) {
//       project.members = [req.body["members[]"]];
//     }

//     await project.save();

//     return res.status(200).json({
//       status: "success",
//       message: "Project updated successfully",
//       project,
//     });

//   } catch (error) {
//     console.error("UPDATE PROJECT ERROR:", error);
//     return res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };
export const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user._id;

    console.log("Incoming body:", req.body);

    // Find project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    // Permission check: only creator can update
    if (project.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "error",
        message: "You are not allowed to update this project",
      });
    }

    // Update simple fields
    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.startDate = req.body.startDate || project.startDate;
    project.endDate = req.body.endDate || project.endDate;
    project.status = req.body.status || project.status;
    project.comment = req.body.comment || project.comment;

    // ⭐ MEMBERS FIX (matches updateTask logic)
    if (req.body.members) {
      project.members = Array.isArray(req.body.members)
        ? req.body.members
        : [req.body.members];
    }

    await project.save();

    return res.status(200).json({
      status: "success",
      message: "Project updated successfully",
      project,
    });

  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
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
        $or: [{ createdBy: userId }, { members: userId }]
      })
        .populate("createdBy", "name email")
        .populate("members", "name email");
  
      // Add stats for each project
      const projectsWithStats = projects.map((project) => {
        const stats = getProjectStats(project.startDate, project.endDate);
  
        return {
          ...project._doc,
          stats
        };
      });
  
      res.status(200).json({
        status: "success",
        count: projectsWithStats.length,
        projects: projectsWithStats
      });
  
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };
  
export const getProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user._id;

    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { createdBy: userId },
        { members: userId }
      ]
    })
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        status: "error",
        message: "Project not found"
      });
    }

    // 🔹 Progress, Total Days, Days Left
    const stats = getProjectStats(project.startDate, project.endDate);

    res.json({
      status: "success",
      project: {
        ...project._doc,
        stats
      }
    });

  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};
