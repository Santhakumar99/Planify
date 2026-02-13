import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createUser, updateUser } from "./UserAPIs";
import "./UserModal.css";

const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    mobile: Yup.string().required("Required"),
    role: Yup.string().required("Required"),
    status: Yup.string().required("Required"),
});

const UserModal = ({ closeModal, editUser, refresh }) => {
    const initialValues = editUser || {
        name: "",
        email: "",
        mobile: "",
        role: "",
        joinedDate: "",
        status: "Active",
        comment: "",
    };

    const handleSubmit = async (values) => {
        if (editUser) {
            await updateUser(editUser._id, values);
        } else {
            await createUser(values);
        }
        refresh();
        closeModal();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <div className="modal-header">
                    <h2>{editUser ? "Edit User" : "Add User"}</h2>
                    <span className="close-btn" onClick={closeModal}>×</span>
                </div>

                <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                    <Form className="form-container">

                        <div className="form-group">
                            <label>Name</label>
                            <Field name="name" className="form-input" />
                            <ErrorMessage name="name" className="error-text" component="div" />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <Field name="email" className="form-input" />
                            <ErrorMessage name="email" className="error-text" component="div" />
                        </div>

                        <div className="form-group">
                            <label>Mobile</label>
                            <Field name="mobile" className="form-input" />
                            <ErrorMessage name="mobile" className="error-text" component="div" />
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <Field as="select" name="role" className="form-input">
                                <option value="">Select</option>
                                <option value="employee">Employee</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </Field>
                        </div>

                        <div className="form-group">
                            <label>Joined Date</label>
                            <Field type="date" name="joinedDate" className="form-input" />
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <Field as="select" name="status" className="form-input">
                                <option>Active</option>
                                <option>Inactive</option>
                            </Field>
                        </div>

                        <div className="form-group full-width">
                            <label>Comment</label>
                            <Field as="textarea" name="comment" className="textarea-input" />
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="cancel-btn" onClick={closeModal}>
                                Cancel
                            </button>
                            <button type="submit" className="confirm-btn">
                                {editUser ? "Update User" : "Create User"}
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default UserModal;
