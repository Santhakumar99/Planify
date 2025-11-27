import React from "react";
import "../../Styles/Loader.css";

export default function LoaderOverlay({ loading }) {
    if (!loading) return null;

    return (
        <div className="global-loader-backdrop">
            <div className="global-spinner"></div>
        </div>
    );
}
