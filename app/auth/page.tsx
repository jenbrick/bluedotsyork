"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./auth.module.css";

function AuthInner() {
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for access key in the query string
  useEffect(() => {
    const rtkn = searchParams.get("rtkn");
    if (rtkn) {
      setAccessKey(rtkn);
      handleAuth(rtkn); // Automatically try to log in if the token is present
    }
  }, [searchParams]);

  // Updated auth handler to accept an optional token argument
  const handleAuth = async (key = accessKey) => {
    setLoading(true);
    setError("");

    try {
      // Validate the access key
      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessKey: key }),
      });

      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        const data = await response.json();

        if (data.valid) {
          // Set the cookie with the access key
          Cookies.set("accessKey", key, { expires: 1 });
          router.push("/business-directory");
        } else {
          setError("Access could not be granted.");
        }
      } else {
        const text = await response.text();
        setError("Unexpected response format. Please try again later." + text);
      }
    } catch (error) {
      console.error("Error during auth:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["auth-page"]}>
      <div className={styles["auth-container"]}>
        <div className={styles["auth-card"]}>
          <h1 className={styles["auth-title"]}>Welcome to Blue Dots of York</h1>
          <p className={styles["auth-subtitle"]}>
            {loading ? "Authorizing..." : "Redirecting"}
          </p>

          {error && <p className={styles["error-message"]}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Auth() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthInner />
    </Suspense>
  );
}
