// import React from "react";
// import Sidebar from "../Sidebar/Sidebar";
// // import Header from "../components/Header";
// import "../Dashboard/Dashboard.css";
// import Header from "../Header/Header";

// const DashboardLayout = () => {
//   return (
//     <div className="layout">
//       <Sidebar />

//       <div className="main-content">
//         <Header />

//         <div className="dashboard-container">
//           {/* Overview Cards */}
//           <section className="overview-section">
//             <div className="card">Card 1</div>
//             <div className="card">Card 2</div>
//             <div className="card">Card 3</div>
//             <div className="card">Card 4</div>
//           </section>

//           {/* Project Summary + Progress Chart */}
//           <div className="grid-2">
//             <div className="box">Project Summary Table</div>
//             <div className="box">Progress Chart</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "../Dashboard/dashboard.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />

      <div className="content-area">
        <Header title="Dashboard" />  {/* Common header */}

        <div className="page-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

