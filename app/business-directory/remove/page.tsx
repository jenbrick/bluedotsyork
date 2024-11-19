"use client";

import Breadcrumb from '../../components/Breadcrumb'; // Adjust the path as necessary

export default function BusinessActions() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                padding: "20px",
                backgroundColor: "rgba(236, 244, 254)",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                maxWidth: "640px", // Limits the container width
                margin: "20px auto", // Centers the container
            }}
        >
            {/* Breadcrumb aligned to the left */}
            <div
                style={{
                    width: "100%", // Makes the container full-width
                    textAlign: "left", // Aligns breadcrumb content to the left
                }}
            >
                <Breadcrumb />
            </div>

            {/* Remove Business Card */}
            <div
                style={{
                    flex: "1",
                    maxWidth: "300px",
                    padding: "20px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                }}
            >
                <i
                    className="fa-solid fa-minus-circle"
                    style={{
                        fontSize: "40px",
                        color: "#ff4d4f",
                        marginBottom: "10px",
                    }}
                ></i>
                <h3 style={{ fontSize: "18px", color: "#333", margin: "10px 0" }}>
                    Remove Business/Organization
                </h3>
                <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
                    Contact us at{' '}
                    <a
                        href="mailto:bluedotsyorkpa@gmail.com?subject=Request to Remove a Business/Organization&body=Please include the name and details of the business/organization you want to remove."
                        style={{ color: "#007bff", textDecoration: "underline" }}
                    >
                        bluedotsyorkpa@gmail.com
                    </a>{' '}
                    to remove a business or organization from the directory.
                </p>
                <button
                    onClick={() =>
                        (window.location.href =
                            "mailto:bluedotsyorkpa@gmail.com?subject=Request to Remove a Business/Organization&body=Please include the name and details of the business/organization you want to remove.")
                    }
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#ff4d4f",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                >
                    Remove
                </button>
            </div>
        </div>
    );
}
