// src/components/ProjectModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createProject, updateProject } from "./ProjectAPIs";
import "../Projects/ProjectModal.css";

const MAX_COMMENT = 250;

/* Simple MultiSelectDropdown (no external libs) */
function MultiSelect({ options = [], value = [], onChange, placeholder = "Select members" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
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
      <div className="ms-input" onClick={() => setOpen((s) => !s)}>
        <div className="ms-values">
          {value.length === 0 ? <span className="placeholder">{placeholder}</span> :
            value.map((v) => <span key={v.id} className="ms-chip">{v.name}</span>)}
        </div>
        <div className="ms-arrow">▾</div>
      </div>

      {open && (
        <div className="ms-list">
          {options.map((opt) => (
            <label key={opt.id} className="ms-option">
              <input type="checkbox" checked={value.some(v => v.id === opt.id)} onChange={() => toggle(opt)} />
              <span>{opt.name}</span>
            </label>
          ))}
          {options.length === 0 && <div className="ms-empty">No members</div>}
        </div>
      )}
    </div>
  );
}

export default function ProjectModal({ visible, onClose, onSaved, initialData = null, membersOptions = [] }) {
  const [preview, setPreview] = useState(null);
  const isEdit = Boolean(initialData && initialData._id);

  useEffect(() => {
    if (initialData?.logoUrl) setPreview(initialData.logoUrl);
    else setPreview(null);
  }, [initialData]);

  const validationSchema = Yup.object().shape({
    projectName: Yup.string().required("Project name is required").max(100),
    description: Yup.string().max(1000),
    startDate: Yup.date().required("Start date required"),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), "End date can't be before start")
      .required("End date required"),
    members: Yup.array().min(1, "Select at least one member"),
    comment: Yup.string().max(MAX_COMMENT),
    status: Yup.string().required("Select status"),
    budget: Yup.number().nullable().min(0, "Budget must be >= 0"),
  });

  const initialValues = {
    projectName: initialData?.projectName || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate ? initialData.startDate.split("T")[0] : "",
    endDate: initialData?.endDate ? initialData.endDate.split("T")[0] : "",
    members: initialData?.members || [],
    comment: initialData?.comment || "",
    status: initialData?.status || "planning",
    budget: initialData?.budget ?? "",
    logoFile: null,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
      // Build multipart form to support file upload
      const formData = new FormData();
      formData.append("projectName", values.projectName);
      formData.append("description", values.description || "");
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      formData.append("comment", values.comment || "");
      formData.append("status", values.status);
      if (values.budget !== "") formData.append("budget", values.budget);
      // members as array of ids
      formData.append("members", JSON.stringify(values.members.map(m => m.id)));

      if (values.logoFile) {
        formData.append("logo", values.logoFile);
      }

      let res;
      if (isEdit) {
        // initialData._id expected
        res = await updateProject(initialData._id, formData);
      } else {
        res = await createProject(formData);
      }

      onSaved(res.data);
      resetForm();
    } catch (err) {
      console.error(err);
      // show generic error (expand per API error structure)
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
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <Formik initialValues={initialValues} validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}>
          {({ values, setFieldValue, isSubmitting, errors }) => (
            <Form className="pm-form">
              {/* Image upload area */}
              <div className="upload-area">
                <label className="upload-drop">
                  <input
                    name="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.currentTarget.files[0];
                      setFieldValue("logoFile", f);
                      if (f) {
                        const url = URL.createObjectURL(f);
                        setPreview(url);
                      } else {
                        setPreview(null);
                      }
                    }}
                    style={{ display: "none" }}
                  />
                  <div className="upload-inner">
                    {preview ? (
                      <img src={preview} alt="logo preview" className="logo-preview" />
                    ) : (
                      <>
                        <div className="upload-arrow">↑</div>
                        <div className="upload-text">Upload logo</div>
                      </>
                    )}
                  </div>
                </label>
              </div>

              <div className="form-row">
                <label>Project name</label>
                <Field name="projectName" placeholder="Name your project" />
                <ErrorMessage name="projectName" component="div" className="field-error" />
              </div>

              <div className="form-row">
                <label>Description</label>
                <Field as="textarea" name="description" rows="3" placeholder="Project description" />
                <ErrorMessage name="description" component="div" className="field-error" />
              </div>

              <div className="form-grid">
                <div>
                  <label>Start date</label>
                  <Field name="startDate" type="date" />
                  <ErrorMessage name="startDate" component="div" className="field-error" />
                </div>
                <div>
                  <label>End date</label>
                  <Field name="endDate" type="date" />
                  <ErrorMessage name="endDate" component="div" className="field-error" />
                </div>
                <div>
                  <label>Budget (USD)</label>
                  <Field name="budget" type="number" placeholder="Set budget" />
                  <ErrorMessage name="budget" component="div" className="field-error" />
                </div>
                <div>
                  <label>Status</label>
                  <Field as="select" name="status">
                    <option value="planning">Planning</option>
                    <option value="in-progress">In progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On hold</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="field-error" />
                </div>
              </div>

              <div className="form-row">
                <label>Invite members</label>
                <MultiSelect
                  options={membersOptions}
                  value={values.members}
                  onChange={(val) => setFieldValue("members", val)}
                  placeholder="Select members"
                />
                <ErrorMessage name="members" component="div" className="field-error" />
              </div>

              <div className="form-row">
                <label>Comment</label>
                <Field as="textarea" name="comment" rows="3" maxLength={MAX_COMMENT} />
                <div className="char-count">{(values.comment || "").length}/{MAX_COMMENT}</div>
                <ErrorMessage name="comment" component="div" className="field-error" />
              </div>

              {errors.api && <div className="field-error api-error">{errors.api}</div>}

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : (isEdit ? "Update Project" : "Create Project")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
