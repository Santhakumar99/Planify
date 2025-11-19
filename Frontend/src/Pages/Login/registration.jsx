import React, { useState } from "react";
import "./registration.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginimg from "../../assets/login_bg1.svg";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FiCloudLightning } from "react-icons/fi";

// VALIDATION SCHEMA
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Please select a role"),
  password: Yup.string()
    .min(4, "Min 4 characters")
    .required("Password is required"),
});

const Registration = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "",
      password: "",
    },
    validationSchema: RegisterSchema,

    onSubmit: async (values, { resetForm }) => {
      setApiError("");
      setSuccessMsg("");

      try {
        const response = await axios.post(
          `${API_URL}/api/user/register`,
          values
        );
       console.log(response)
        if (response.data?.success ) {
          setSuccessMsg("Registration successful! Redirecting...");
          resetForm();

          setTimeout(() => navigate("/"), 1500);
      } 
        else {
          setApiError(response.data?.message || "Something went wrong");
        }
      } catch (error) {
        setApiError(error.response?.data?.message || "Something went wrong");
      }
    },
  });

  return (
    <div className="register-container">
      {/* LEFT SECTION */}
      <div className="register-left-section">
        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">
          Register your account and start using <strong>Planify’s App</strong>{" "}
          today.
        </p>

        <form onSubmit={formik.handleSubmit} className="register-form">
          {/* NAME */}
          <div className="register-input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <small className="register-error">{formik.errors.name}</small>
            )}
          </div>

          {/* EMAIL */}
          <div className="register-input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <small className="register-error">{formik.errors.email}</small>
            )}
          </div>

          {/* ROLE */}
          <div className="register-input-group">
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <small className="register-error">{formik.errors.role}</small>
            )}
          </div>

          {/* PASSWORD */}
          <div className="register-input-group">
            <div className="register-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="register-password-input"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <span
                className="register-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {formik.touched.password && formik.errors.password && (
              <small className="register-error">{formik.errors.password}</small>
            )}
          </div>

          {/* API ERROR */}
          {apiError && <small className="register-error">{apiError}</small>}

          {/* SUCCESS MESSAGE */}
          {successMsg && (
            <small className="register-success">{successMsg}</small>
          )}

          <button type="submit" className="register-btn">
            Register
          </button>

          <p className="register-footer-text">
            Already have an account?{" "}
            <span className="register-link" onClick={() => navigate("/login")}>
              Login now
            </span>
          </p>
        </form>
      </div>

      {/* RIGHT SECTION */}
      <div className="register-right-section">
        <div className="register-illustration-card">
          <img
            src={loginimg}
            alt="illustration"
            className="register-illustration"
          />
          <p className="register-right-text">
            Join
            <strong>Planify’s App</strong> and boost productivity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
