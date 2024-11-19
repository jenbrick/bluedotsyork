"use client";

export default function Disclaimer() {
    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "20px auto",
                padding: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                fontFamily: "Arial, sans-serif",
                color: "#333",
                lineHeight: "1.6",
            }}
        >
            {/* Back to Business Directory Link */}
            <a
                href="/business-directory"
                style={{
                    display: "block",
                    marginBottom: "20px",
                    color: "#007bff",
                    textDecoration: "underline",
                    fontWeight: "bold",
                    fontSize: "14px",
                }}
            >
                ← Back to Business Directory
            </a>

            {/* Disclaimer Content */}
            <h1
                style={{
                    fontSize: "24px",
                    color: "#007bff",
                    marginBottom: "20px",
                    textAlign: "center",
                }}
            >
                Disclaimer
            </h1>
            <p>
                This directory is a user-recommended, evolving list reflecting the shared values of inclusivity, equity, diversity, and democracy.
                While the aim is to highlight organizations and businesses aligned with these principles, inclusion in this directory
                does not signify endorsement or partnership with a specific political party.
            </p><br></br>
            <p>
                The directory is not exhaustive, and the absence of a business or organization does not indicate disapproval or
                exclusion due to non-alignment. Businesses and organizations listed may vary in their practices, and users are
                encouraged to research independently before making decisions.
            </p><br></br>
            <p>
                The creators of this directory are not liable for any inaccuracies, omissions, or misrepresentations. The content is
                provided "as-is" without guarantees of completeness or accuracy. For any corrections or updates, please contact us at {' '}
                    <a
                        href="mailto:bluedotsyorkpa@gmail.com?subject=Request to Remove a Business/Organization&body=Please include the name and details of the business/organization you want to remove."
                        style={{ color: "#007bff", textDecoration: "underline" }}
                    >
                        bluedotsyorkpa@gmail.com
                    </a>{''}.
            </p><br></br>
            <p>
                By using this directory, you agree to hold its creators harmless for any issues arising from the use of the
                information provided. Your feedback and suggestions are always welcome to help improve this resource.
            </p>
        </div>
    );
}
