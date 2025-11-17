import React, { useState } from "react";
// import logoicon from "../../assets/Occ_icon.png";
import Clogo from "../../assets/cl2.png";
import "../Login/Login.css";
import firefoxlogo from "../../assets/Firefoxlogo.svg";
import chromelogo from "../../assets/chromelogo.svg";
import melogo from "../../assets/me-logo.svg";
import axios from "axios";
// import { useAuth } from "../Context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../Auth/Context";

const LoginSchema = Yup.object().shape({
  email: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});
// ✅ add this import at the top

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

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
        console.log(Result);
        if (Result?.data) {
          const user = Result.data?.user || {};
          const token = Result.data?.token || "";

          // Store user session details
          sessionStorage.setItem("User", JSON.stringify(user));
          sessionStorage.setItem("UserID", user.id);
          sessionStorage.setItem("UserName", user.name);
          sessionStorage.setItem("Email", user.email );
          sessionStorage.setItem("Role", user.role);
          // localStorage.setItem.setItem("Role", user.role);
          // Auth context login
          login({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
          });

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
    <div className="Login_BgPage">
      <div className="login_Container">
        <div className="OccupancyHeader">
          <h2 className="panel-title clickable-title">Planer</h2>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="FormSection">
            <label className="addExpenseLabel">Email</label>
            <input
              type="text"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="form-control textfield"
            />
            {formik.touched.email && formik.errors.email && (
              <small style={{ color: "red" }}>{formik.errors.email}</small>
            )}
          </div>

          <div className="FormSection">
            <label className="addExpenseLabel">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control textfield"
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
            </div>
            {formik.touched.password && formik.errors.password && (
              <small style={{ color: "red" }}>{formik.errors.password}</small>
            )}
          </div>

          {/* API Error */}
          {apiError && (
            <small
              style={{ color: "red", display: "block", marginTop: "10px" }}
            >
              {apiError}
            </small>
          )}

          {/* Login Button */}
          <div className="actBtn">
            <button type="submit" className="btn btn-primary lgnsbbtn">
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        {/* Footer Section */}
        <div className="LC_Section">
          <div className="LogcopyrightSec">
            <p className="cplabel">Copyright © 2025 All Rights Reserved by</p>
            <img src={Clogo} width="90px" height="27px" className="c_logo" />
          </div>
          <div className="LogoSec">
            <p className="splabel">Supported Browsers</p>
            <div className="SBrowserSec">
              <img src={firefoxlogo} width="12px" height="12px" />
              <img src={chromelogo} width="12px" height="12px" />
              <img src={melogo} width="12px" height="12px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
