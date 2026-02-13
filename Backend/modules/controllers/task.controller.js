import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

function getStats(startDate, endDate) {
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
export const getAllTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({
      $or: [
        { createdBy: userId },
        { members: userId },
      ]
    })
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .populate({
        path: "projectId",
        select: "name description members status",
        populate: {
          path: "members",
          select: "name email"
        }
      });
    const tasksWithStats = tasks.map((task) => {
      const stats = getStats(task.startDate, task.endDate);

      return {
        ...task._doc,
        stats
      };
    });
    res.status(200).json({
      status: "success",
      count: tasksWithStats.length,
      tasks: tasksWithStats
    });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};


export const createTask = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      members,
      projectId,
      status,
      priority,
      comment,
    } = req.body;

    const userId = req.user._id;

    const task = new Task({
      name,
      description,
      startDate,
      endDate,
      members,
      projectId,
      createdBy: userId,
      status: status || "todo",
      priority: priority || "medium",
      comment: comment || "",
    });

    await task.save();

    res.status(200).json({
      status: "success",
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;
    console.log(req.body.projectId ,"projectID");
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ status: "error", message: "Task not found" });
    }

    // Permission check                                                                            
    if (task.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "error",
        message: "You are not allowed to update this task",
      });
    }

    // Update fields
    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.startDate = req.body.startDate || task.startDate;
    task.endDate = req.body.endDate || task.endDate;
    task.members = req.body.members || task.members;
    task.status = req.body.status || task.status;

    // 🔥 IMPORTANT FIX
    task.projectId = req.body.projectId ;

    // Optional fields
    task.priority = req.body.priority || task.priority;
    task.comment = req.body.comment || task.comment;

    await task.save();
     console.log("upda",task)
      res.status(200).json({
      status: "success",
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

  export const deleteTask = async (req, res) => {
    try {
      const taskId = req.params.id;
      const userId = req.user._id;
  
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ status: "error", message: "Task not found" });
      }
  
      if (task.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({
          status: "error",
          message: "You are not allowed to delete this task"
        });
      }
  
      await task.deleteOne();
  
      res.status(200).json({
        status: "success",
        message: "Task deleted successfully"
      });
  
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };
  export const addComment = async (req, res) => {
    try {
      const taskId = req.params.id;
      const userId = req.user._id;
  
      const { message } = req.body;
  
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ message: "Task not found" });
  
      task.comment.push({
        user: userId,
        message
      });
  
      await task.save();
  
      res.status(200).json({
        status: "success",
        message: "Comment added",
        task
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
export const getTask = async (req, res) => {
  try
  {
   const taskId = req.params.id;
  const userId = req.user._id;
  const task= await Task.findOne({
    _id: taskId,
    $or: [
      { createdBy: userId },
      { members: userId }
    ]
  })
    .populate("createdBy", "name email")
    .populate("members", "name email");
  
  if (!task) return res.status(404).json({ message: "Task not found" });
  // 🔹 Progress, Total Days, Days Left
    const stats = getStats(task.startDate, task.endDate);

  res.json({
    status: "success",
    task: {
      ...task._doc,
      stats
    }
  });

} catch (error) {
  console.error("Get Task error:", error);
  res.status(500).json({
    status: "error",
    message: "Server error"
  });
}

  }