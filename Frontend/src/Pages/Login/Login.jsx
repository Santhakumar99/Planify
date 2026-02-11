import React, { useState } from "react";
import "./LoginPage.css";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import loginimg from "../../assets/login_bg1.svg";
import axios from "axios";
// import { useAuth } from "../Context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../Auth/Context";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Store/Slices/authSlice";
const LoginSchema = Yup.object().shape({
  email: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,

    onSubmit: async (values, { resetForm }) => {
      setApiError("");

      try {
        const Result = await axios.post(`${API_URL}/api/user/login`, values);
        // console.log(Result);
        if (Result?.data) {
          const user = Result.data?.user || {};
          const token = Result.data?.token || "";

          // Store user session details
          sessionStorage.setItem("User", JSON.stringify(user));
          sessionStorage.setItem("UserID", user.id);
          sessionStorage.setItem("UserName", user.name);
          sessionStorage.setItem("Email", user.email);
          sessionStorage.setItem("Role", user.role);
          sessionStorage.setItem("token", token);
          // localStorage.setItem.setItem("Role", user.role);
          // Auth context login
          login({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
          });
          dispatch(
            loginSuccess({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
              },
              token
            })
          )
          // // Redirect after login
          //  setTimeout(() => {
          navigate("/dashboard", { replace: true });
          // }, 100);

          resetForm();
        } else {
          setApiError(Result.data?.message || "Invalid credentials");
        }
      } catch (error) {
        setApiError(error.response?.data?.message || "Something went wrong");
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="left-section">
        <h1 className="title">Welcome back!</h1>
        <p className="subtitle">
          Simplify your workflow and boost your productivity <br />
          with <strong>Planify’s App</strong>. Get started for free.
        </p>

        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <div className="input-group-custom">
            <div className="password-wrapper">
              <input
                type="text"
                name="email"
                className="form-control"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <small style={{ color: "red" }}>{formik.errors.email}</small>
              )}
            </div>
          </div>

          {/* <div className="input-group-custom">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
              style={{
                cursor: "pointer",
                marginLeft: "-30px",
                userSelect: "none",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            {formik.touched.password && formik.errors.password && (
              <small style={{ color: "red" }}>{formik.errors.password}</small>
            )}
          </div> */}
          <div className="input-group-custom">
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control password-input"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <span
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {formik.touched.password && formik.errors.password && (
              <small style={{ color: "red" }}>{formik.errors.password}</small>
            )}
          </div>

          {apiError && (
            <small
              style={{ color: "red", display: "block", marginTop: "10px" }}
            >
              {apiError}
            </small>
          )}

          <p className="forgot">Forgot Password?</p>

          <button type="submit" className="login-btn">
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-text">
          Not a member? <span className="register-link" onClick={() => navigate("/register")}>Register now</span>
        </p>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="illustration-card">
          <img src={loginimg} alt="illustration" className="illustration" />
          <p className="right-text">
            Make your work easier and organized <br />
            with <strong>Planify’s App</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
