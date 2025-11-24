// src/components/ProjectModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createProject, updateProject } from "./ProjectAPIs";
import "../Projects/ProjectModal.css";

const MAX_COMMENT = 250;

/* Multiselect Component */
function MultiSelect({ options = [], value = [], onChange, placeholder = "Select members" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const clickOutside = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const toggle = (opt) => {
    if (value.some((v) => v.id === opt.id)) {
      onChange(value.filter((v) => v.id !== opt.id));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <div className="ms-dropdown" ref={ref}>
      <div className="ms-box" onClick={() => setOpen((s) => !s)}>
        <div className="ms-values">
          {value.length === 0 ? (
            <span className="placeholder">{placeholder}</span>
          ) : (
            value.map((v) => <span key={v.id} className="ms-chip">{v.name}</span>)
          )}
        </div>
        <div className="ms-arrow">▾</div>
      </div>

      {open && (
        <div className="ms-list">
          {options.length === 0 && <div className="ms-empty">No members</div>}
          {options.map((opt) => (
            <label key={opt.id} className="ms-option">
              <input
                type="checkbox"
                checked={value.some((v) => v.id === opt.id)}
                onChange={() => toggle(opt)}
              />
              <span>{opt.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectModal({
  visible,
  onClose,
  onSaved,
  initialData = null,
  membersOptions ,
}) {
  const [preview, setPreview] = useState(null);

  const isEdit = Boolean(initialData?._id);

  useEffect(() => {
    setPreview(initialData?.logoUrl || null);
  }, [initialData]);
console.log(membersOptions)
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
    budget: Yup.number().nullable().min(0, "Budget must be >= 0"),
  });

  const initialValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate?.split("T")[0] || "",
    endDate: initialData?.endDate?.split("T")[0] || "",
    members: initialData?.members || [],
    comment: initialData?.comment || "",
    status: initialData?.status || "planning",
    budget: initialData?.budget ?? "",
    logoFile: null,
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
      // if (values.budget !== "") formData.append("budget", values.budget);
      values.members.forEach((m) => {
        formData.append("members[]", m.id);
      });      
      

      // if (values.logoFile) {
      //   formData.append("logo", values.logoFile);
      // }

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

  if (!visible) return null;

  return (
    <div className="pm-modal-backdrop">
      <div className="pm-modal">
        <div className="pm-modal-header">
          <h3>{isEdit ? "Edit Project" : "Add new project"}</h3>
          <button className="pm-close-btn" onClick={onClose}>✕</button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting, errors }) => (
            <Form className="pm-form">

              {/* Upload */}
              {/* <div className="upload-area">
                <label className="upload-box">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFieldValue("logoFile", file);
                      if (file) setPreview(URL.createObjectURL(file));
                    }}
                    style={{ display: "none" }}
                  />
                  {preview ? (
                    <img src={preview} alt="logo preview" className="logo-preview" />
                  ) : (
                    <>
                      <div className="upload-arrow">↑</div>
                      <div className="upload-placeholder">Upload logo</div>
                    </>
                  )}
                </label>
              </div> */}

              {/* Project Name */}
              <div className="pm-field">
                <label>Project name</label>
                <Field name="name" className="pm-input" placeholder="Name your project" />
                <ErrorMessage name="name" component="div" className="pm-error" />
              </div>

              {/* Description */}
              <div className="pm-field">
                <label>Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="pm-textarea"
                  placeholder="Project description"
                />
                <ErrorMessage name="description" component="div" className="pm-error" />
              </div>

              {/* Grid */}
              <div className="pm-grid">
                <div className="pm-field">
                  <label>Start date</label>
                  <Field type="date" name="startDate" className="pm-input" />
                  <ErrorMessage name="startDate" component="div" className="pm-error" />
                </div>

                <div className="pm-field">
                  <label>End date</label>
                  <Field type="date" name="endDate" className="pm-input" />
                  <ErrorMessage name="endDate" component="div" className="pm-error" />
                </div>

                {/* <div className="pm-field">
                  <label>Budget (USD)</label>
                  <Field type="number" name="budget" className="pm-input" placeholder="Set budget" />
                  <ErrorMessage name="budget" component="div" className="pm-error" />
                </div> */}

                {/* Members */}
                <div className="pm-field">
                  <label>Add members</label>
                  <MultiSelect
                    options={membersOptions}
                    value={values.members}
                    onChange={(val) => setFieldValue("members", val)}
                  />

                  <ErrorMessage name="members" component="div" className="pm-error" />
                </div>
                <div className="pm-field">
                  <label>Status</label>
                  <Field as="select" name="status" className="pm-select">
                    <option value="todo">Todo</option>
                    <option value="in-progress">In progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On hold</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="pm-error" />
                </div>
              </div>

              {/* Comment */}
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
                <ErrorMessage name="comment" component="div" className="pm-error" />
              </div>

              {errors.api && <div className="pm-error">{errors.api}</div>}

              {/* Buttons */}
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
