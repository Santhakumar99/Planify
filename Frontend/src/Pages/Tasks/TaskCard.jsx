
// import React from "react";
// import { formatDate } from "../CommonComponents/DateFormat.JSX";
// import "./TaskCard.css"

// export default function TaskCard({ task, onEdit, onDelete }) {
//   return (
//     <div className="task-card">
//       <div className="task-header">
//         <h4>{task.title}</h4>
//         <div className="task-actions">
//           <button className="icon-btn edit" onClick={onEdit}>✏️</button>
//           <button className="icon-btn delete" onClick={onDelete}>🗑️</button>
//         </div>
//       </div>

//       <p className="task-desc">{task.description}</p>

//       <div className="task-meta">
//         <p><strong>Status:</strong> {task.status}</p>
//         <p><strong>Priority:</strong> {task.priority}</p>
//         <p><strong>Due:</strong> {task.dueDate ? formatDate(task.dueDate) : "-"}</p>
//       </div>
//     </div>
//   );
// }
import React from "react";
import "./TaskCard.css"; // Your own overrides if needed

export default function TaskCard({ task, viewType, onEdit, onDelete }) {
  const title = task?.name || task?.title || "Untitled Task";
  const description = task?.description || "";
  const dueDate = task?.endDate
    ? new Date(task.endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "-";

  const members = task?.members || [];

  /* ------------------------------------------------------------------
      GRID VIEW (Same structure as ProjectCard grid)
  ------------------------------------------------------------------ */
  if (viewType === "grid") {
    return (
      <div className="project-card">
        {/* Top Avatar */}
        <div className="card-top">
          <div className="avatar-circle sm">
            {title.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Body */}
        <div className="card-body">
          <div className="card-title">{title}</div>
          <div className="card-date">Due: {dueDate}</div>

          <span className="card-tag">
            {task.status?.replace("-", " ") || "Status"}
          </span>
        </div>

        {/* Footer */}
        <div className="card-footer">
          {/* Members preview */}
          <div style={{ display: "flex", gap: "8px" }}>
            {members.slice(0, 3).map((m) => (
              <div key={m._id} className="member-xs">
                {m.name?.charAt(0).toUpperCase()}
              </div>
            ))}

            {members.length > 3 && (
              <div className="member-xs">+{members.length - 3}</div>
            )}
          </div>

          {/* Right Button */}
          <button className="btn-view" onClick={onEdit}>
            View
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------
      LIST VIEW (Exact ProjectCard List style)
  ------------------------------------------------------------------ */
  return (
    <div className="project-row">
      {/* LEFT SIDE */}
      <div className="row-left">
        <div className="avatar-circle sm">
          {title.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="row-title">{title}</div>
          <div className="row-sub">{description.slice(0, 55)}...</div>
        </div>
      </div>

      {/* CENTER: STATUS */}
      <div className="row-stats">
        <div className="stat-num">{task.priority || "-"}</div>
        <div className="stat-label">Priority</div>
      </div>

      {/* DUE DATE */}
      <div className="row-date">
        {dueDate}
        <div className="stat-label">Due date</div>
      </div>

      {/* MEMBERS */}
      <div className="row-members">
        {members.slice(0, 3).map((m) => (
          <div key={m._id} className="member-chip">
            {m.name?.charAt(0).toUpperCase()}
          </div>
        ))}

        {members.length > 3 && (
          <div className="member-chip">+{members.length - 3}</div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="row-actions">
        <button className="btn-view" onClick={onEdit}>
          View
        </button>
      </div>
    </div>
  );
}
