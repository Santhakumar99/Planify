import React from "react";
export default function ProjectCard({ project, viewType = "grid", onView }) {
  const { projectName, endDate, members = [], progress = 0, avatar } = project;

  const renderMembers = (list) => {
    return list.slice(0, 3).map((m, i) => (
      <div key={i} className="member-xs" title={m}>
        {m[0] ? m[0].toUpperCase() : "?"}
      </div>
    ));
  };

  if (viewType === "list") {
    return (
      <div className="project-row">
        <div className="row-left">
          <img className="row-avatar" src={avatar} alt={projectName} />
          <div className="row-meta">
            <div className="row-title">{projectName}</div>
            <div className="row-sub">Development</div>
          </div>
        </div>

        <div className="row-stats">
          <div className="stat-num">{Math.round(progress)}</div>
          <div className="stat-label">Progress</div>
        </div>

        <div className="row-date">
          <div className="date-value">{endDate}</div>
          <div className="date-sub">Due date</div>
        </div>

        <div className="row-members">
          {renderMembers(members)}
          {members.length > 3 && <div className="member-chip more">+{members.length - 3}</div>}
        </div>

        <div className="row-actions">
          <button className="btn-view" onClick={onView}>
            View
          </button>
        </div>
      </div>
    );
  }

  // GRID CARD
  return (
    <div className="project-card">
      <div className="card-top">
        <img className="card-avatar" src={avatar} alt={projectName} />
      </div>

      <div className="card-body">
        <h3 className="card-title">{projectName}</h3>
        <div className="card-date">Due to: {endDate}</div>
        <div className="card-tag">Development</div>
      </div>

      <div className="card-footer">
        <div className="members">{renderMembers(members)}</div>

        <div className="progress-bar" aria-hidden>
          <div className="progress" style={{ width: `${Math.min(100, progress)}%` }} />
        </div>

        <div className="card-actions">
          <button className="btn-view" onClick={onView}>
            View
          </button>
        </div>
      </div>
    </div>
  );
}
