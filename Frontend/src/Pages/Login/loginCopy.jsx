// import React, { useState } from "react";
// // import logoicon from "../../assets/Occ_icon.png";
// import Clogo from "../../assets/cl2.png";
// import "../Login/Login.css";
// import firefoxlogo from "../../assets/Firefoxlogo.svg";
// import chromelogo from "../../assets/chromelogo.svg";
// import melogo from "../../assets/me-logo.svg";
// import axios from "axios";
// // import { useAuth } from "../Context/ContextProvider";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useAuth } from "../../Auth/Context";

// const LoginSchema = Yup.object().shape({
//   email: Yup.string().required("Username is required"),
//   password: Yup.string().required("Password is required"),
// });
// // ✅ add this import at the top

// const LoginPage1 = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_API_URL;

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: LoginSchema,

//     onSubmit: async (values, { resetForm }) => {
//       setApiError("");

//       try {
//         const Result = await axios.post(`${API_URL}/api/user/login`, values);
//         console.log(Result);
//         if (Result?.data) {
//           const user = Result.data?.user || {};
//           const token = Result.data?.token || "";

//           // Store user session details
//           sessionStorage.setItem("User", JSON.stringify(user));
//           sessionStorage.setItem("UserID", user.id);
//           sessionStorage.setItem("UserName", user.name);
//           sessionStorage.setItem("Email", user.email);
//           sessionStorage.setItem("Role", user.role);
//           // localStorage.setItem.setItem("Role", user.role);
//           // Auth context login
//           login({
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             token,
//           });

//           // // Redirect after login
//           //  setTimeout(() => {
//           navigate("/dashboard", { replace: true });
//           // }, 100);

//           resetForm();
//         } else {
//           setApiError(Result.data?.message || "Invalid credentials");
//         }
//       } catch (error) {
//         setApiError(error.response?.data?.message || "Something went wrong");
//       }
//     },
//   });

//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev);
//   };

//   return (
//     <div className="Login_BgPage">
//       <div className="mainSection">
//         <div className="row">
//           <div className="col-lg-6 col-md-6 col-sm-12 section1">
//             <h1>1</h1>
//           </div>
//           <div className="col-lg-6 col-md-6 col-sm-12 section2">
//             <h1>2</h1>
//           </div>
//         </div>
//       </div>

//       {/* <div className="login_Container">
//         <div className="OccupancyHeader">
//           <h2 className="panel-title clickable-title">Planer</h2>
//         </div>

//         <form onSubmit={formik.handleSubmit}>
//           <div className="FormSection">
//             <label className="addExpenseLabel">Email</label>
//             <input
//               type="text"
//               name="email"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="form-control textfield"
//             />
//             {formik.touched.email && formik.errors.email && (
//               <small style={{ color: "red" }}>{formik.errors.email}</small>
//             )}
//           </div>

//           <div className="FormSection">
//             <label className="addExpenseLabel">Password</label>
//             <div className="password-wrapper">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formik.values.password}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="form-control textfield"
//               />
//               <span
//                 className="password-toggle-icon"
//                 onClick={togglePasswordVisibility}
//                 style={{
//                   cursor: "pointer",
//                   marginLeft: "-30px",
//                   userSelect: "none",
//                 }}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//             {formik.touched.password && formik.errors.password && (
//               <small style={{ color: "red" }}>{formik.errors.password}</small>
//             )}
//           </div>

//           {apiError && (
//             <small
//               style={{ color: "red", display: "block", marginTop: "10px" }}
//             >
//               {apiError}
//             </small>
//           )}

     
//           <div className="actBtn">
//             <button type="submit" className="btn btn-primary lgnsbbtn">
//               {formik.isSubmitting ? "Logging in..." : "Login"}
//             </button>
//           </div>
//         </form>

        
//         <div className="LC_Section">
//           <div className="LogcopyrightSec">
//             <p className="cplabel">Copyright © 2025 All Rights Reserved by</p>
//             <img src={Clogo} width="90px" height="27px" className="c_logo" />
//           </div>
//           <div className="LogoSec">
//             <p className="splabel">Supported Browsers</p>
//             <div className="SBrowserSec">
//               <img src={firefoxlogo} width="12px" height="12px" />
//               <img src={chromelogo} width="12px" height="12px" />
//               <img src={melogo} width="12px" height="12px" />
//             </div>
//           </div>
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default LoginPage1;  

import React from "react";
import "./LoginPage.css";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import loginimg from "../../assets/login_bg1.svg"
const LoginPage = () => {
  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="left-section">
        <h1 className="title">Welcome back!</h1>
        <p className="subtitle">
          Simplify your workflow and boost your productivity <br />
          with <strong>Planify’s App</strong>. Get started for free.
        </p>

        <div className="input-group-custom">
          <input type="text" className="form-control" placeholder="Username" />
        </div>

        <div className="input-group-custom">
          <input type="password" className="form-control" placeholder="Password" />
        </div>

        <p className="forgot">Forgot Password?</p>

        <button className="login-btn">Login</button>

        {/* <div className="or-line">
          <span>or continue with</span>
        </div> */}

        {/* <div className="social-icons">
          <div className="icon-circle"><FaGoogle /></div>
          <div className="icon-circle"><FaApple /></div>
          <div className="icon-circle"><FaFacebookF /></div>
        </div> */}

        <p className="register-text">
          Not a member? <span className="register-link">Register now</span>
        </p>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="illustration-card">
          <img
            src={loginimg}
            alt="illustration"
            className="illustration"
          />
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
