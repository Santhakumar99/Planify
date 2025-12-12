import React, { useEffect, useState } from "react";
import { fetchUserById, deleteUser } from "./UserAPIs";
import "./UserView.css";

const UserDetails = () => {
    const id = window.location.pathname.split("/").pop();
    const [user, setUser] = useState(null);

    const getDetails = async () => {
        const data = await fetchUserById(id);
        setUser(data);
    };

    useEffect(() => {
        getDetails();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="project-details-container">
            <div className="details-header">
                <h1>{user.name}</h1>

                <div className="detail-actions">
                    <button onClick={() => (window.location.href = `/edit-user/${id}`)}>Edit</button>
                    <button
                        className="delete-btn"
                        onClick={async () => {
                            await deleteUser(id);
                            window.location.href = "/users";
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="details-info-grid">
                <div className="info-card">
                    <h3>Email</h3>
                    <p>{user.email}</p>
                </div>

                <div className="info-card">
                    <h3>Mobile</h3>
                    <p>{user.mobile}</p>
                </div>

                <div className="info-card">
                    <h3>Role</h3>
                    <p>{user.role}</p>
                </div>

                <div className="info-card">
                    <h3>Status</h3>
                    <p>{user.status}</p>
                </div>
            </div>

            <div className="details-sections">
                <div className="left-section">
                    <h2>User Details</h2>
                    <p><strong>Joined:</strong> {user.joinedDate}</p>
                    <p><strong>Comment:</strong> {user.comment}</p>
                </div>

                <div className="right-section">
                    <h2>Assigned Projects</h2>
                    {user.projects?.map((p) => (
                        <div key={p._id} className="team-member">
                            {p.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
