"use client";

export default function Disclaimer() {
    return (
        <div className="container">
            <h1>Disclaimer</h1>
            <p>
                This directory is a user-recommended, evolving list reflecting the shared values of inclusivity, equity, and democracy.
                While the aim is to highlight organizations and businesses aligned with these principles, inclusion in this directory
                does not signify endorsement or partnership with a specific political party.
            </p>
            <p>
                The directory is not exhaustive, and the absence of a business or organization does not indicate disapproval or
                exclusion due to non-alignment. Businesses and organizations listed may vary in their practices, and users are
                encouraged to research independently before making decisions.
            </p>
            <p>
                The creators of this directory are not liable for any inaccuracies, omissions, or misrepresentations. The content is
                provided "as-is" without guarantees of completeness or accuracy. For any corrections or updates, please contact us.
            </p>
            <p>
                By using this directory, you agree to hold its creators harmless for any issues arising from the use of the
                information provided. Your feedback and suggestions are always welcome to help improve this resource.
            </p>
            <a href="/business-directory" style={{ color: '#007bff', textDecoration: 'underline' }}>
                Back to Business/Organization Directory
            </a>
        </div>
    );
}
