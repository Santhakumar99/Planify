// import React from "react";
// import { formatDate } from "../CommonComponents/DateFormat.JSX";
// export default function ProjectCard({ project, viewType = "grid", onView }) {
//   const { name, endDate, members = [], stats, avatar } = project;
// const renderMembers = (list) => {
//   return list.slice(0, 3).map((m, i) => (
//     <div key={i} className="member-xs" title={m.name}>
//       {m?.name ? m.name[0].toUpperCase() : "?"}
//     </div>
//   ));
// };


//   if (viewType === "list") {
//     return (
//       <div className="project-row">
//         <div className="row-left">
//           <img className="row-avatar" src={avatar} alt={name} />
//           <div className="row-meta">
//             <div className="row-title">{name}</div>
//             <div className="row-sub">Development</div>
//           </div>
//         </div>

//         <div className="row-stats">
//           <div className="stat-num">{Math.round(stats?.progress)}</div>
//           <div className="stat-label">Progress</div>
//         </div>

//         <div className="row-date">
//           <div className="date-value">{endDate ? formatDate(endDate) : "-"}</div>
//           <div className="date-sub">Due date</div>
//         </div>

//         <div className="row-members">
//           {renderMembers(members)}
//           {members.length > 3 && <div className="member-chip more">+{members.length - 3}</div>}
//         </div>

//         <div className="row-actions">
//           <button className="btn-view" onClick={onView}>
//             View
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // GRID CARD
//   return (
//     <div className="project-card">
//       <div className="card-top">
//         {/* <img className="card-avatar" src={avatar} alt={name} /> */}
//         <div className="avatar-circle sm">
//           {name.charAt(0).toUpperCase()}
//         </div>
//       </div>

//       <div className="card-body">
//         <h3 className="card-title">{name}</h3>
//         <div className="card-date">Due to: {endDate ? formatDate(endDate) : "-"}</div>
//         <div className="card-tag">Development</div>
//       </div>

//       <div className="card-footer">
//         <div className="members">{renderMembers(members)}</div>

//         <div className="progress-bar" aria-hidden>
//           <div className="progress" style={{ width: `${Math.min(100, stats?.progress)}%` }} />
//         </div>

//         <div className="card-actions">
//           <button className="btn-view" onClick={onView}>
//             View
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/components/Tasks/TaskCard.jsx
import React from "react";
import { formatDate } from "../CommonComponents/DateFormat.JSX";

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="task-card">
      <div className="task-header">
        <h4>{task.title}</h4>
        <div className="task-actions">
          <button className="icon-btn edit" onClick={onEdit}>✏️</button>
          <button className="icon-btn delete" onClick={onDelete}>🗑️</button>
        </div>
      </div>

      <p className="task-desc">{task.description}</p>

      <div className="task-meta">
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Due:</strong> {task.dueDate ? formatDate(task.dueDate) : "-"}</p>
      </div>
    </div>
  );
}
