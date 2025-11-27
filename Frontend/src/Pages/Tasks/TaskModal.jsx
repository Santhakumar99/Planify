import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createTask, updateTask } from "../Tasks/TaskAPIs";
import "../Projects/ProjectModal.css";

const API_URL = import.meta.env.VITE_API_URL;
const MAX_COMMENT = 250;

/* ---------------- NORMALIZE MEMBERS ------------------ */
const normalizeMembers = (members = []) => {
  return Array.from(
    new Map(
      members
        .filter(Boolean)
        .map((m) => {
          const id = m.id || m._id || m.userId;
          const name = m.name || m.username || m.fullname || "";
          return [id, { id, name }];
        })
    ).values()
  );
};

/* ---------------- MULTISELECT COMPONENT ------------------ */
function MultiSelect({ options = [], value = [], onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();

  useEffect(() => {
    const clickOutside = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // remove duplicates
  useEffect(() => {
    const cleaned = normalizeMembers(value);
    if (cleaned.length !== value.length) onChange(cleaned);
  }, [value]);

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (opt) => {
    const exists = value.some((v) => v.id === opt.id);
    const updated = exists
      ? value.filter((v) => v.id !== opt.id)
      : [...value, opt];
    onChange(normalizeMembers(updated));
  };

  return (
    <div className="ms-dropdown" ref={ref}>
      <div className="ms-box" onClick={() => setOpen(!open)}>
        <div className="ms-values">
          {value.length ? (
            value.map((v) => <span key={v.id} className="ms-chip">{v.name}</span>)
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <div className="ms-arrow">▾</div>
      </div>

      {open && (
        <div className="ms-list">
          <input
            className="ms-search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="ms-options-container">
            {filtered.length === 0 ? (
              <div className="ms-empty">No members</div>
            ) : (
              filtered.map((o) => {
                const selected = value.some((v) => v.id === o.id);
                return (
                  <div
                    key={o.id}
                    className={`ms-option ${selected ? "selected" : ""}`}
                    onClick={() => toggle(o)}
                  >
                    <input type="checkbox" readOnly checked={selected} />
                    <span>{o.name}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- MAIN TASK MODAL ------------------ */
export default function TaskModal({
  visible,
  onClose,
  onSaved,
  initialData = null,
}) {

  if (!visible) return null;

  const isEdit = Boolean(initialData?._id);

  /* ---------------- STATE: PROJECTS LIST ------------------ */
  const [projectsList, setProjectsList] = useState([]);

  /* ---------------- LOAD PROJECTS ------------------ */
  const loadProjects = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await axios.get(`${API_URL}/api/project/allprojects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = res.data.projects.map((p) => ({
        id: p._id,
        name: p.name,
        members: p.members?.map((m) => ({
          id: m._id,
          name: m.name,
        })) || [],
      }));

      setProjectsList(formatted);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ---------------- VALIDATION ------------------ */
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Task title is required"),
    description: Yup.string(),
    startDate: Yup.date(),
    dueDate: Yup.date().required("Due date required"),
    projectId: Yup.string().required("Select Project"),
    assignedTo: Yup.array().min(1, "Assign at least one member"),
    priority: Yup.string().required(),
    status: Yup.string().required(),
    comment: Yup.string().max(MAX_COMMENT),
  });

  /* ---------------- INITIAL VALUES ------------------ */
  const initialValues = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate?.split("T")[0] || "",
    dueDate: initialData?.dueDate?.split("T")[0] || "",
    projectId: initialData?.projectId || initialData?.project || "",
    assignedTo: normalizeMembers(initialData?.assignedTo || []),
    priority: initialData?.priority || "medium",
    status: initialData?.status || "todo",
    comment: initialData?.comment || "",
  };

  /* ---------------- SUBMIT ------------------ */
  // const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
  //   try {
  //     const form = new FormData();

  //     form.append("title", values.title);
  //     form.append("description", values.description);
  //     form.append("startDate", values.startDate);
  //     form.append("dueDate", values.dueDate);
  //     form.append("priority", values.priority);
  //     form.append("status", values.status);
  //     form.append("projectId", values.projectId);
  //     form.append("comment", values.comment);

  //     values.assignedTo.forEach((m) => form.append("assignedTo[]", m.id));
  //     console.log(form);
  //     let res;
  //     if (isEdit) res = await updateTask(initialData._id, form);
  //     else res = await createTask(form);

  //     onSaved(res.data);
  //     resetForm();
  //   } catch (err) {
  //     setErrors({ api: err.response?.data?.message || "Failed to save task" });
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
      const form = new FormData();

      form.append("title", values.title);
      form.append("description", values.description || "");
      form.append("startDate", values.startDate || "");
      form.append("dueDate", values.dueDate);
      form.append("priority", values.priority);
      form.append("status", values.status);
      form.append("projectId", values.projectId);
      form.append("comment", values.comment || "");

      values.assignedTo.forEach((m) => {
        form.append("assignedTo[]", m.id);
      });

      // 🔥 Debug print - shows actual form data
      for (let p of form.entries()) {
        console.log(p[0] + ": " + p[1]);
      }

      let res;
      if (isEdit) {
        res = await updateTask(initialData._id, form);
      } else {
        res = await createTask(form);
      }

      onSaved(res.data);
      resetForm();
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Failed to save task" });
    } finally {
      setSubmitting(false);
    }
  };
  
  /* ---------------- AUTO LOAD MEMBERS WHEN PROJECT SELECTED ------------------ */
  // const ProjectMembersLoader = ({ projectId, setFieldValue }) => {
  //   useEffect(() => {
  //     if (!projectId) return;

  //     const selected = projectsList.find((p) => p.id === projectId);
  //     if (selected) {
  //       setFieldValue("assignedTo", normalizeMembers(selected.members));
  //     }
  //   }, [projectId]);

  //   return null;
  // };
  // <ProjectMembersLoader
  //   projectId={values.projectId}
  //   setFieldValue={setFieldValue}
  // />

  /* ---------------- UI ------------------ */
  return (
    <div className="pm-modal-backdrop">
      <div className="pm-modal">

        <div className="pm-modal-header">
          <h3>{isEdit ? "Edit Task" : "Add Task"}</h3>
          <button className="pm-close-btn" onClick={onClose}>✕</button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="pm-form">

              {/* <ProjectMembersLoader
                projectId={values.projectId}
                setFieldValue={setFieldValue}
              /> */}

              {/* TITLE */}
              <div className="pm-field">
                <label>Task Title</label>
                <Field name="title" className="pm-input" />
                <ErrorMessage name="title" component="div" className="pm-error" />
              </div>

              {/* DESCRIPTION */}
              <div className="pm-field">
                <label>Description</label>
                <Field as="textarea" name="description" className="pm-textarea" />
              </div>

              {/* GRID */}
              <div className="pm-grid">

                {/* START DATE */}
                <div className="pm-field">
                  <label>Start Date</label>
                  <Field type="date" name="startDate" className="pm-input" />
                </div>

                {/* DUE DATE */}
                <div className="pm-field">
                  <label>Due Date</label>
                  <Field type="date" name="dueDate" className="pm-input" />
                  <ErrorMessage name="dueDate" component="div" className="pm-error" />
                </div>

                {/* PROJECT SELECT */}
                <div className="pm-field">
                  <label>Select Project</label>
                  <Field as="select" name="projectId" className="pm-select">
                    <option value="">Select Project</option>
                    {projectsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.members.length} Members)
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="projectId" component="div" className="pm-error" />
                </div>

                {/* ASSIGN MEMBERS */}
                {/* <div className="pm-field">
                  <label>Assign Members</label>
                  <MultiSelect
                    options={
                      projectsList.find((p) => p.id === values.projectId)?.members || []
                    }
                    value={values.assignedTo}
                    onChange={(val) => setFieldValue("assignedTo", val)}
                    placeholder="Select members"
                  />
                  <ErrorMessage name="assignedTo" component="div" className="pm-error" />
                </div> */}
                <div className="pm-field">
                  <label>Assign Members</label>
                  <MultiSelect
                    options={
                      projectsList.find((p) => p.id === values.projectId)?.members || []
                    }
                    value={values.assignedTo}
                    onChange={(val) => setFieldValue("assignedTo", val)}
                    placeholder="Select members"
                  />
                  <ErrorMessage name="assignedTo" component="div" className="pm-error" />
                </div>
                {/* PRIORITY */}
                <div className="pm-field">
                  <label>Priority</label>
                  <Field as="select" name="priority" className="pm-select">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Field>
                </div>

                {/* STATUS */}
                <div className="pm-field">
                  <label>Status</label>
                  <Field as="select" name="status" className="pm-select">
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </Field>
                </div>
              </div>

              {/* COMMENT */}
              <div className="pm-field">
                <label>Comment</label>
                <Field
                  as="textarea"
                  name="comment"
                  className="pm-textarea"
                  maxLength={MAX_COMMENT}
                />
                <div className="char-count">
                  {(values.comment || "").length}/{MAX_COMMENT}
                </div>
              </div>

              {/* API ERROR */}
              <ErrorMessage name="api" component="div" className="pm-error" />

              {/* ACTIONS */}
              <div className="modal-actions">
                <button type="button" className="pm-btn pm-btn-cancel" onClick={onClose}>
                  Cancel
                </button>

                <button type="submit" className="pm-btn pm-btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
                </button>
              </div>

            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
}
