import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createProject, updateProject } from "./ProjectAPIs";
import "../Projects/ProjectModal.css";

const MAX_COMMENT = 250;

/* ---------------------------------------------------------
   NORMALIZE MEMBERS (PREVENT DUPLICATES, FIX EDIT MODE)
----------------------------------------------------------*/
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

/* ---------------------------------------------------------
   MULTISELECT COMPONENT
----------------------------------------------------------*/
function MultiSelect({ options = [], value = [], onChange, placeholder = "Select members" }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();

  // Close when clicked outside
  useEffect(() => {
    const clickOutside = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // Auto-remove duplicates
  useEffect(() => {
    const cleaned = normalizeMembers(value);
    if (cleaned.length !== value.length) {
      onChange(cleaned);
    }
  }, [value]);

  const toggle = (opt) => {
    const exists = value.some((v) => v.id === opt.id);
    const updated = exists
      ? value.filter((v) => v.id !== opt.id)
      : [...value, opt];

    onChange(normalizeMembers(updated));
  };

  // Search filter
  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ms-dropdown" ref={ref}>
      {/* SELECT BOX */}
      <div className="ms-box" onClick={() => setOpen(!open)}>
        <div className="ms-values">
          {value.length === 0 ? (
            <span className="placeholder">{placeholder}</span>
          ) : (
            value.map((v) => (
              <span key={v.id} className="ms-chip">
                {v.name}
              </span>
            ))
          )}
        </div>
        <div className="ms-arrow">▾</div>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="ms-list">
          <input
            className="ms-search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="ms-options-container">
            {filteredOptions.length === 0 && (
              <div className="ms-empty">No matching members</div>
            )}

            {filteredOptions.map((opt) => {
              const selected = value.some((v) => v.id === opt.id);
              return (
                <div
                  key={opt.id}
                  className={`ms-option ${selected ? "selected" : ""}`}
                  onClick={() => toggle(opt)}
                >
                  <input type="checkbox" checked={selected} readOnly />
                  <span>{opt.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   MAIN PROJECT MODAL
----------------------------------------------------------*/
export default function ProjectModal({
  visible,
  onClose,
  onSaved,
  initialData = null,
  membersOptions,
}) {

  if (!visible) return null;

  const isEdit = Boolean(initialData?._id);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Project name is required"),
    description: Yup.string(),
    startDate: Yup.date().required("Start date required"),
    endDate: Yup.date()
      .min(Yup.ref("startDate"), "End date can't be before start")
      .required("End date required"),
    members: Yup.array().min(1, "Select at least one member"),
    comment: Yup.string().max(MAX_COMMENT),
    status: Yup.string().required("Select a status"),
  });

  const initialValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate?.split("T")[0] || "",
    endDate: initialData?.endDate?.split("T")[0] || "",
    members: normalizeMembers(initialData?.members || []),
    comment: initialData?.comment || "",
    status: initialData?.status || "todo",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      formData.append("comment", values.comment || "");
      formData.append("status", values.status);

      values.members.forEach((m) => {
        formData.append("members[]", m.id);
      });

      let res;
      if (isEdit) {
        res = await updateProject(initialData._id, formData);
      } else {
        res = await createProject(formData);
      }

      onSaved(res.data);
      resetForm();
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Failed to save project" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pm-modal-backdrop">
      <div className="pm-modal">

        {/* HEADER */}
        <div className="pm-modal-header">
          <h3>{isEdit ? "Edit Project" : "Add Project"}</h3>
          <button className="pm-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* FORM */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="pm-form">

              {/* TITLE */}
              <div className="pm-field">
                <label>Project name</label>
                <Field name="name" className="pm-input" />
                <ErrorMessage name="name" component="div" className="pm-error" />
              </div>

              {/* DESCRIPTION */}
              <div className="pm-field">
                <label>Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="pm-textarea"
                />
              </div>

              {/* GRID */}
              <div className="pm-grid">
                <div className="pm-field">
                  <label>Start date</label>
                  <Field type="date" name="startDate" className="pm-input" />
                </div>

                <div className="pm-field">
                  <label>End date</label>
                  <Field type="date" name="endDate" className="pm-input" />
                </div>

                {/* MULTISELECT */}
                <div className="pm-field">
                  <label>Add members</label>
                  <MultiSelect
                    options={membersOptions}
                    value={values.members}
                    onChange={(val) => setFieldValue("members", val)}
                  />
                  <ErrorMessage name="members" component="div" className="pm-error" />
                </div>

                {/* STATUS */}
                <div className="pm-field">
                  <label>Status</label>
                  <Field as="select" name="status" className="pm-select">
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
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
                <div className="char-count">
                  {(values.comment || "").length}/{MAX_COMMENT}
                </div>
              </div>

              {/* API ERRORS */}
              <ErrorMessage name="api" component="div" className="pm-error" />

              {/* ACTION BUTTONS */}
              <div className="modal-actions">
                <button type="button" className="pm-btn pm-btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="pm-btn pm-btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
                </button>
              </div>

            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
}
