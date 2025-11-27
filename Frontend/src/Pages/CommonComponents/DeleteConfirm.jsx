// src/components/Common/DeleteConfirm.jsx
import React from "react";
import "../../Styles/DeleteConfirm.css";

export default function DeleteConfirm({ visible, message, onClose, onConfirm, loading }) {
    if (!visible) return null;

    return (
        <div className="del-popup-backdrop">
            <div className="del-popup">

                <h3 className="del-title">Confirm Delete</h3>

                <p className="del-message">{message}</p>

                <div className="del-actions">

                    <button
                        className="del-btn cancel"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="del-btn delete"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                     

                        {loading ? "Deleting..." : "Delete"}
                    </button>

                </div>
            </div>
            {/* {loading && <span className="del-spinner"></span> } */}
        </div>
    );
}
  