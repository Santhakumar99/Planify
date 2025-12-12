
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { createTask, updateTask } from "../Tasks/TaskAPIs";
// import "../Projects/ProjectModal.css";

// const API_URL = import.meta.env.VITE_API_URL;
// const MAX_COMMENT = 250;

// /* ---------------- NORMALIZE MEMBERS ------------------ */
// const normalizeMembers = (members = []) => {
//   const mapped = members.filter(Boolean).map((m) => {
//     if (typeof m === "string") return { id: m, name: m };

//     const id = String(m._id || m.id || m.userId || "");
//     const name = m.name || m.username || m.fullname || m.email || id;

//     return { id, name };
//   });

//   return Array.from(new Map(mapped.map((m) => [m.id, m])).values());
// };

// /* ---------------- EXTRACT PROJECT ID SAFELY ------------------ */
// const extractProjectId = (project) => {
//   if (!project) return "";

//   if (typeof project === "string") return project; // shape: "id"

//   if (project?._id) return String(project._id); // shape: { _id: "id" }

//   if (project?.$oid) return String(project.$oid); // shape: { "$oid": "id" }

//   return "";
// };

// /* ---------------- MULTISELECT COMPONENT ------------------ */
// function MultiSelect({ options = [], value = [], onChange, placeholder }) {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const ref = useRef();

//   useEffect(() => {
//     const clickOutside = (e) => {
//       if (!ref.current?.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", clickOutside);
//     return () => document.removeEventListener("mousedown", clickOutside);
//   }, []);

//   const filtered = options.filter((o) =>
//     (o.name || "").toLowerCase().includes(search.toLowerCase())
//   );

//   const toggle = (opt) => {
//     const exists = value.some((v) => v.id === opt.id);
//     const updated = exists
//       ? value.filter((v) => v.id !== opt.id)
//       : [...value, opt];

//     onChange(normalizeMembers(updated));
//   };

//   return (
//     <div className="ms-dropdown" ref={ref}>
//       <div className="ms-box" onClick={() => setOpen((x) => !x)}>
//         <div className="ms-values">
//           {value.length ? (
//             value.map((v) => (
//               <span key={v.id} className="ms-chip">
//                 {v.name}
//               </span>
//             ))
//           ) : (
//             <span className="placeholder">{placeholder}</span>
//           )}
//         </div>
//         <div className="ms-arrow">▾</div>
//       </div>

//       {open && (
//         <div className="ms-list">
//           <input
//             className="ms-search"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <div className="ms-options-container">
//             {filtered.length === 0 ? (
//               <div className="ms-empty">No members</div>
//             ) : (
//               filtered.map((o) => {
//                 const selected = value.some((v) => v.id === o.id);
//                 return (
//                   <div
//                     key={o.id}
//                     className={`ms-option ${selected ? "selected" : ""}`}
//                     onClick={() => toggle(o)}
//                   >
//                     <input type="checkbox" readOnly checked={selected} />
//                     <span>{o.name}</span>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------------- MAIN MODAL ------------------ */
// export default function TaskModal({ visible, onClose, onSaved, initialData = null }) {
//   if (!visible) return null;
//   console.log(initialData, "initialData")
//   const isEdit = Boolean(initialData?._id);

//   const [projectsList, setProjectsList] = useState([]);
//   const [loadingProjects, setLoadingProjects] = useState(false);

//   const [allUsers, setAllUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);

//   /* ---------------- LOAD PROJECTS ------------------ */
//   const loadProjects = async () => {
//     try {
//       setLoadingProjects(true);
//       const token = sessionStorage.getItem("token");

//       const res = await axios.get(`${API_URL}/api/project/allprojects`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const formatted = (res?.data?.projects || []).map((p) => ({
//         id: String(p._id),
//         name: p.name,
//         members: (p.members || []).map((m) => ({
//           id: String(m._id),
//           name: m.name,
//         })),
//       }));

//       setProjectsList(formatted);
//     } catch (err) {
//       setProjectsList([]);
//     } finally {
//       setLoadingProjects(false);
//     }
//   };

//   /* ---------------- LOAD USERS ------------------ */
//   const loadAllUsers = async () => {
//     try {
//       setLoadingUsers(true);
//       const token = sessionStorage.getItem("token");

//       const res = await axios.get(`${API_URL}/api/user/allusers`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setAllUsers(
//         (res?.data?.allUsers || []).map((u) => ({
//           id: String(u._id),
//           name: u.name,
//         }))
//       );
//     } catch (err) {
//       setAllUsers([]);
//     } finally {
//       setLoadingUsers(false);
//     }
//   };

//   useEffect(() => {
//     loadProjects();
//     loadAllUsers();
//   }, []);

//   /* ---------------- INITIAL VALUES (FINAL FIX) ------------------ */
//   const initialValues = {
//     name: initialData?.name || "",
//     description: initialData?.description || "",
//     startDate:
//       typeof initialData?.startDate === "string"
//         ? initialData.startDate.split("T")[0]
//         : "",
//     endDate:
//       typeof initialData?.endDate === "string"
//         ? initialData.endDate.split("T")[0]
//         : "",

//     // FINAL FIX:
//     projectId: extractProjectId(initialData?.project),

//     members: isEdit
//       ? normalizeMembers(initialData?.members || [])
//       : [],

//     priority: initialData?.priority || "medium",
//     status: initialData?.status || "todo",
//     comment: initialData?.comment || "",
//   };

//   /* ---------------- SAVE HANDLER ------------------ */
//   const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
//     try {
//       const payload = {
//         name: values.name,
//         description: values.description,
//         startDate: values.startDate || null,
//         endDate: values.endDate,
//         projectId: values.projectId,
//         members: values.members.map((m) => m.id),
//         priority: values.priority,
//         status: values.status,
//         comment: values.comment,
//       };

//       let res;
//       if (isEdit) res = await updateTask(initialData._id, payload);
//       else res = await createTask(payload);

//       onSaved(res.data);
//       resetForm();
//       onClose();
//     } catch (err) {
//       setErrors({ api: err.response?.data?.message || "Failed to save task" });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ---------------- UI ------------------ */
//   return (
//     <div className="pm-modal-backdrop">
//       <div className="pm-modal">
//         <div className="pm-modal-header">
//           <h3>{isEdit ? "Edit Task" : "Add Task"}</h3>
//           <button className="pm-close-btn" onClick={onClose}>✕</button>
//         </div>

//         <Formik
//           initialValues={initialValues}
//           validationSchema={Yup.object({
//             name: Yup.string().required("Task name is required"),
//             endDate: Yup.string().required("Due date required"),
//             projectId: Yup.string().required("Select project"),
//             members: Yup.array().min(1, "Select at least one member"),
//           })}
//           enableReinitialize
//           onSubmit={handleSubmit}
//         >
//           {({ values, setFieldValue, isSubmitting }) => (
//             <Form className="pm-form">

//               {/* TITLE */}
//               <div className="pm-field">
//                 <label>Task Title</label>
//                 <Field name="name" className="pm-input" />
//                 <ErrorMessage name="name" className="pm-error" component="div" />
//               </div>

//               {/* DESCRIPTION */}
//               <div className="pm-field">
//                 <label>Description</label>
//                 <Field as="textarea" name="description" className="pm-textarea" />
//               </div>

//               <div className="pm-grid">

//                 {/* START DATE */}
//                 <div className="pm-field">
//                   <label>Start Date</label>
//                   <Field type="date" name="startDate" className="pm-input" />
//                 </div>

//                 {/* END DATE */}
//                 <div className="pm-field">
//                   <label>Due Date</label>
//                   <Field type="date" name="endDate" className="pm-input" />
//                 </div>

//                 {/* PROJECT SELECT (FINAL FIXED VERSION) */}
//                 <div className="pm-field">
//                   <label>Select Project</label>

//                   <Field name="projectId">
//                     {({ field, form }) => (
//                       <select
//                         {...field}
//                         value={field.value || ""}
//                         className="pm-select"
//                         onChange={(e) => {
//                           const pid = e.target.value;
//                           form.setFieldValue("projectId", pid);
//                         }}
//                       >
//                         <option value="">
//                           {loadingProjects ? "Loading..." : "Select Project"}
//                         </option>

//                         {projectsList.map((p) => (
//                           <option key={p.id} value={p.id}>
//                             {p.name}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </Field>

//                   <ErrorMessage name="projectId" className="pm-error" component="div" />
//                 </div>

//                 {/* MEMBERS */}
//                 <div className="pm-field">
//                   <label>Assign Members</label>

//                   <MultiSelect
//                     options={allUsers}
//                     value={values.members}
//                     onChange={(val) => setFieldValue("members", normalizeMembers(val))}
//                     placeholder={
//                       loadingUsers ? "Loading members..." : "Select members"
//                     }
//                   />

//                   <ErrorMessage name="members" className="pm-error" component="div" />
//                 </div>

//                 {/* PRIORITY */}
//                 <div className="pm-field">
//                   <label>Priority</label>
//                   <Field as="select" name="priority" className="pm-select">
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                   </Field>
//                 </div>

//                 {/* STATUS */}
//                 <div className="pm-field">
//                   <label>Status</label>
//                   <Field as="select" name="status" className="pm-select">
//                     <option value="todo">Todo</option>
//                     <option value="in-progress">In Progress</option>
//                     <option value="review">Review</option>
//                     <option value="completed">Completed</option>
//                   </Field>
//                 </div>

//               </div>

//               {/* COMMENT */}
//               <div className="pm-field">
//                 <label>Comment</label>
//                 <Field
//                   as="textarea"
//                   name="comment"
//                   className="pm-textarea"
//                   maxLength={MAX_COMMENT}
//                 />
//                 <div className="char-count">
//                   {(values.comment || "").length}/{MAX_COMMENT}
//                 </div>
//               </div>

//               {/* API ERROR */}
//               <ErrorMessage name="api" className="pm-error" component="div" />

//               {/* ACTION BUTTONS */}
//               <div className="modal-actions">
//                 <button type="button" className="pm-btn pm-btn-cancel" onClick={onClose}>
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="pm-btn pm-btn-primary"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
//                 </button>
//               </div>

//             </Form>
//           )}
//         </Formik>

//       </div>
//     </div>
//   );
// }
// src/Tasks/TaskModal.jsx


// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { createTask, updateTask } from "../Tasks/TaskAPIs";
// import "../Projects/ProjectModal.css";

// const API_URL = import.meta.env.VITE_API_URL;
// const MAX_COMMENT = 250;

// /* ---------------- NORMALIZE MEMBERS ------------------ */
// const normalizeMembers = (members = []) => {
//   const mapped = members.filter(Boolean).map((m) => {
//     if (typeof m === "string") return { id: m, name: m };

//     const id = String(m._id || m.id || m.userId || "");
//     const name = m.name || m.username || m.fullname || m.email || id;

//     return { id, name };
//   });

//   return Array.from(new Map(mapped.map((m) => [m.id, m])).values());
// };

// /* ---------------- EXTRACT PROJECT ID SAFELY (FINAL FIX) ------------------ */
// const extractProjectId = (project) => {
//   if (!project) return "";

//   if (typeof project === "string") return project;         // "id"
//   if (project?._id) return String(project._id);            // { _id: "id" }
//   if (project?.$oid) return String(project.$oid);          // { $oid: "id" }

//   return "";
// };

// /* ---------------- MULTISELECT COMPONENT ------------------ */
// function MultiSelect({ options = [], value = [], onChange, placeholder }) {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const ref = useRef();

//   useEffect(() => {
//     const clickOutside = (e) => {
//       if (!ref.current?.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", clickOutside);
//     return () => document.removeEventListener("mousedown", clickOutside);
//   }, []);

//   const filtered = options.filter((o) =>
//     (o.name || "").toLowerCase().includes(search.toLowerCase())
//   );

//   const toggle = (opt) => {
//     const exists = value.some((v) => v.id === opt.id);
//     const updated = exists
//       ? value.filter((v) => v.id !== opt.id)
//       : [...value, opt];

//     onChange(normalizeMembers(updated));
//   };

//   return (
//     <div className="ms-dropdown" ref={ref}>
//       <div className="ms-box" onClick={() => setOpen((x) => !x)}>
//         <div className="ms-values">
//           {value.length ? (
//             value.map((v) => (
//               <span key={v.id} className="ms-chip">
//                 {v.name}
//               </span>
//             ))
//           ) : (
//             <span className="placeholder">{placeholder}</span>
//           )}
//         </div>
//         <div className="ms-arrow">▾</div>
//       </div>

//       {open && (
//         <div className="ms-list">
//           <input
//             className="ms-search"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <div className="ms-options-container">
//             {filtered.length === 0 ? (
//               <div className="ms-empty">No members</div>
//             ) : (
//               filtered.map((o) => {
//                 const selected = value.some((v) => v.id === o.id);
//                 return (
//                   <div
//                     key={o.id}
//                     className={`ms-option ${selected ? "selected" : ""}`}
//                     onClick={() => toggle(o)}
//                   >
//                     <input type="checkbox" readOnly checked={selected} />
//                     <span>{o.name}</span>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------------- MAIN MODAL ------------------ */
// export default function TaskModal({ visible, onClose, onSaved, initialData = null }) {
//   if (!visible) return null;

//   console.log("initialData.project →", initialData);

//   const isEdit = Boolean(initialData?._id);

//   const [projectsList, setProjectsList] = useState([]);
//   const [loadingProjects, setLoadingProjects] = useState(false);

//   const [allUsers, setAllUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);

//   /* ---------------- LOAD PROJECTS ------------------ */
//   const loadProjects = async () => {
//     try {
//       setLoadingProjects(true);
//       const token = sessionStorage.getItem("token");

//       const res = await axios.get(`${API_URL}/api/project/allprojects`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const formatted = (res?.data?.projects || []).map((p) => ({
//         id: String(p._id), // 🔥 ALWAYS STRING
//         name: p.name,
//         members: (p.members || []).map((m) => ({
//           id: String(m._id),
//           name: m.name,
//         })),
//       }));

//       setProjectsList(formatted);
//     } catch {
//       setProjectsList([]);
//     } finally {
//       setLoadingProjects(false);
//     }
//   };

//   /* ---------------- LOAD USERS ------------------ */
//   const loadAllUsers = async () => {
//     try {
//       setLoadingUsers(true);
//       const token = sessionStorage.getItem("token");

//       const res = await axios.get(`${API_URL}/api/user/allusers`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setAllUsers(
//         (res?.data?.allUsers || []).map((u) => ({
//           id: String(u._id),
//           name: u.name,
//         }))
//       );
//     } catch {
//       setAllUsers([]);
//     } finally {
//       setLoadingUsers(false);
//     }
//   };

//   useEffect(() => {
//     loadProjects();
//     loadAllUsers();
//   }, []);

//   /* ---------------- INITIAL VALUES (FULLY FIXED) ------------------ */
//   const initialValues = {
//     name: initialData?.name || "",
//     description: initialData?.description || "",
//     startDate:
//       typeof initialData?.startDate === "string"
//         ? initialData.startDate.split("T")[0]
//         : "",
//     endDate:
//       typeof initialData?.endDate === "string"
//         ? initialData.endDate.split("T")[0]
//         : "",

//     projectId: extractProjectId(initialData?.project),   // 🔥 FINAL FIX

//     members: isEdit
//       ? normalizeMembers(initialData?.members || [])
//       : [],

//     priority: initialData?.priority || "medium",
//     status: initialData?.status || "todo",
//     comment: initialData?.comment || "",
//   };

//   /* ---------------- SAVE HANDLER ------------------ */
//   const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
//     try {
//       const payload = {
//         name: values.name,
//         description: values.description,
//         startDate: values.startDate || null,
//         endDate: values.endDate,
//         projectId: values.projectId,             // 🔥 CORRECT
//         members: values.members.map((m) => m.id),
//         priority: values.priority,
//         status: values.status,
//         comment: values.comment,
//       };

//       let res;
//       if (isEdit) res = await updateTask(initialData._id, payload);
//       else res = await createTask(payload);

//       onSaved(res.data);
//       resetForm();
//       onClose();
//     } catch (err) {
//       setErrors({ api: "Failed to save task" });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ---------------- UI ------------------ */
//   return (
//     <div className="pm-modal-backdrop">
//       <div className="pm-modal">

//         <div className="pm-modal-header">
//           <h3>{isEdit ? "Edit Task" : "Add Task"}</h3>
//           <button className="pm-close-btn" onClick={onClose}>✕</button>
//         </div>

//         <Formik
//           initialValues={initialValues}
//           enableReinitialize
//           validationSchema={Yup.object({
//             name: Yup.string().required("Task name is required"),
//             endDate: Yup.string().required("Due date required"),
//             projectId: Yup.string().required("Select project"),
//             members: Yup.array().min(1, "Select at least one member"),
//           })}
//           onSubmit={handleSubmit}
//         >
//           {({ values, setFieldValue }) => (
//             <Form className="pm-form">

//               <div className="pm-field">
//                 <label>Task Title</label>
//                 <Field name="name" className="pm-input" />
//               </div>

//               <div className="pm-field">
//                 <label>Description</label>
//                 <Field as="textarea" name="description" className="pm-textarea" />
//               </div>

//               <div className="pm-grid">

//                 <div className="pm-field">
//                   <label>Start Date</label>
//                   <Field type="date" name="startDate" className="pm-input" />
//                 </div>

//                 <div className="pm-field">
//                   <label>Due Date</label>
//                   <Field type="date" name="endDate" className="pm-input" />
//                 </div>

//                 {/* -------- PROJECT DROPDOWN (FINAL FIXED) -------- */}
//                 <div className="pm-field">
//                   <label>Select Project</label>

//                   <Field name="projectId">
//                     {({ field, form }) => (
//                       <select
//                         {...field}
//                         className="pm-select"
//                         value={field.value || ""}
//                         onChange={(e) => {
//                           form.setFieldValue("projectId", String(e.target.value));
//                         }}
//                       >
//                         <option value="">
//                           {loadingProjects ? "Loading..." : "Select Project"}
//                         </option>

//                         {projectsList.map((p) => (
//                           <option key={p.id} value={p.id}>
//                             {p.name}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </Field>

//                   <ErrorMessage name="projectId" className="pm-error" component="div" />
//                 </div>

//                 {/* MEMBERS */}
//                 <div className="pm-field">
//                   <label>Assign Members</label>

//                   <MultiSelect
//                     options={allUsers}
//                     value={values.members}
//                     onChange={(val) =>
//                       setFieldValue("members", normalizeMembers(val))
//                     }
//                     placeholder={loadingUsers ? "Loading..." : "Select members"}
//                   />

//                   <ErrorMessage name="members" className="pm-error" component="div" />
//                 </div>

//                 {/* PRIORITY */}
//                 <div className="pm-field">
//                   <label>Priority</label>
//                   <Field as="select" name="priority" className="pm-select">
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                   </Field>
//                 </div>

//                 {/* STATUS */}
//                 <div className="pm-field">
//                   <label>Status</label>
//                   <Field as="select" name="status" className="pm-select">
//                     <option value="todo">Todo</option>
//                     <option value="in-progress">In Progress</option>
//                     <option value="review">Review</option>
//                     <option value="completed">Completed</option>
//                   </Field>
//                 </div>

//               </div>

//               {/* COMMENT */}
//               <div className="pm-field">
//                 <label>Comment</label>
//                 <Field
//                   as="textarea"
//                   name="comment"
//                   className="pm-textarea"
//                   maxLength={MAX_COMMENT}
//                 />
//               </div>

//               <ErrorMessage name="api" className="pm-error" component="div" />

//               <div className="modal-actions">
//                 <button type="button" className="pm-btn pm-btn-cancel" onClick={onClose}>
//                   Cancel
//                 </button>

//                 <button type="submit" className="pm-btn pm-btn-primary">
//                   {isEdit ? "Update Task" : "Create Task"}
//                 </button>
//               </div>

//             </Form>
//           )}
//         </Formik>

//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createTask, updateTask } from "../Tasks/TaskAPIs";
import "../Projects/ProjectModal.css";

const API_URL = import.meta.env.VITE_API_URL;
const MAX_COMMENT = 250;

/* ---------------------------------------------------------
   NORMALIZE MEMBERS (same as ProjectModal)
----------------------------------------------------------*/
const normalizeMembers = (members = []) => {
  return Array.from(
    new Map(
      members
        .filter(Boolean)
        .map((m) => {
          const id = m.id || m._id || m.userId;
          const name = m.name || m.username || m.fullname || m.email || "";
          return [id, { id, name }];
        })
    ).values()
  );
};

/* ---------------------------------------------------------
   SAFELY EXTRACT PROJECT ID
----------------------------------------------------------*/
// const extractProjectId = (project) => {
//   if (!project) return "";
//   if (typeof project === "string") return project;
//   if (project?._id) return String(project._id);
//   if (project?.$oid) return String(project.$oid);
//   return "";
// };

const getCorrectProjectId = () => {
  if (initialData?.projectId?._id) return String(initialData.projectId._id);
  if (typeof initialData?.projectId === "string") return initialData.projectId;

  // fallback only if projectId doesn't exist
  return extractProjectId(initialData?.project);
};

/* ---------------------------------------------------------
   MULTISELECT (same behavior as ProjectModal)
----------------------------------------------------------*/
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

  // Remove duplicates
  useEffect(() => {
    const cleaned = normalizeMembers(value);
    if (cleaned.length !== value.length) onChange(cleaned);
  }, [value]);

  const toggle = (opt) => {
    const exists = value.some((v) => v.id === opt.id);
    const updated = exists
      ? value.filter((v) => v.id !== opt.id)
      : [...value, opt];

    onChange(normalizeMembers(updated));
  };

  const filtered = options.filter((o) =>
    (o.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ms-dropdown" ref={ref}>
      <div className="ms-box" onClick={() => setOpen((o) => !o)}>
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
            {!filtered.length ? (
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

/* ---------------------------------------------------------
   MAIN TASK MODAL
----------------------------------------------------------*/
export default function TaskModal({ visible, onClose, onSaved, initialData }) {
  if (!visible) return null;

  const isEdit = Boolean(initialData?._id);

  const [projectsList, setProjectsList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  /* LOAD PROJECTS */
  useEffect(() => {
    (async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/project/allprojects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProjectsList(
          (res.data.projects || []).map((p) => ({
            id: String(p._id),
            name: p.name,
          }))
        );
      } catch {
        setProjectsList([]);
      }
    })();
  }, []);

  /* LOAD USERS (members list) */
  useEffect(() => {
    (async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/user/allusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAllUsers(
          (res.data.allUsers || []).map((u) => ({
            id: String(u._id),
            name: u.name,
          }))
        );
      } catch {
        setAllUsers([]);
      }
    })();
  }, []);


  const initialValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate?.split("T")[0] || "",
    endDate: initialData?.endDate?.split("T")[0] || "",
    projectId:
      initialData?.projectId?._id
        ? String(initialData.projectId._id)
        : typeof initialData?.projectId === "string"
          ? initialData.projectId
          : extractProjectId(initialData?.project),

    members: normalizeMembers(initialData?.members || []),
    priority: initialData?.priority || "medium",
    status: initialData?.status || "todo",
    comment: initialData?.comment || "",
  };
  


  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const payload = {
        ...values,
        members: values.members.map((m) => m.id),
      };

      const res = isEdit
        ? await updateTask(initialData._id, payload)
        : await createTask(payload);

      onSaved(res.data);
      onClose();
    } catch {
      setErrors({ api: "Failed to save task" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pm-modal-backdrop">
      <div className="pm-modal">

        {/* HEADER */}
        <div className="pm-modal-header">
          <h3>{isEdit ? "Edit Task" : "Add Task"}</h3>
          <button className="pm-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* KEY FIXES DEFAULT PROJECT SELECTION ISSUE */}
        <Formik
          key={initialData?._id || "new"}
          initialValues={initialValues}
          enableReinitialize
          validationSchema={Yup.object({
            name: Yup.string().required(),
            projectId: Yup.string().required(),
            members: Yup.array().min(1),
            endDate: Yup.string().required(),
          })}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="pm-form">

              {/* TASK TITLE */}
              <div className="pm-field">
                <label>Task Title</label>
                <Field name="name" className="pm-input" />
              </div>

              {/* DESCRIPTION */}
              <div className="pm-field">
                <label>Description</label>
                <Field as="textarea" name="description" className="pm-textarea" />
              </div>

              <div className="pm-grid">

                <div className="pm-field">
                  <label>Start Date</label>
                  <Field type="date" name="startDate" className="pm-input" />
                </div>

                <div className="pm-field">
                  <label>Due Date</label>
                  <Field type="date" name="endDate" className="pm-input" />
                </div>

                {/* PROJECT DROPDOWN (NOW MATCHES PROJECTMODAL) */}
                <div className="pm-field">
                  <label>Select Project</label>
                  <Field as="select" name="projectId" className="pm-select">
                    <option value="">Select Project</option>
                    {projectsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="projectId" className="pm-error" component="div" />
                </div>

                {/* MEMBERS DROPDOWN (ALWAYS SHOW allUsers ONLY) */}
                <div className="pm-field">
                  <label>Assign Members</label>
                  <MultiSelect
                    options={allUsers}
                    value={values.members}
                    onChange={(v) => setFieldValue("members", v)}
                    placeholder="Select members"
                  />
                  <ErrorMessage name="members" className="pm-error" component="div" />
                </div>

                <div className="pm-field">
                  <label>Priority</label>
                  <Field as="select" name="priority" className="pm-select">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Field>
                </div>

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
                  maxLength={MAX_COMMENT}
                  className="pm-textarea"
                />
              </div>

              <ErrorMessage name="api" className="pm-error" component="div" />

              <div className="modal-actions">
                <button type="button" className="pm-btn pm-btn-cancel" onClick={onClose}>
                  Cancel
                </button>

                <button type="submit" className="pm-btn pm-btn-primary">
                  {isEdit ? "Update Task" : "Create Task"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
