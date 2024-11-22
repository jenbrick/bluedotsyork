"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./auth.module.css";

function AuthInner() {
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState<React.ReactNode | null>(null); // Update state to handle React elements
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for access key in the query string
  useEffect(() => {
    const rtkn = searchParams.get("rtkn");
    console.log("useEffect - rtkn from query params:", rtkn);

    if (rtkn) {
      setAccessKey(rtkn);
      console.log("useEffect - Initiating handleAuth with rtkn:", rtkn);
      handleAuth(rtkn); // Automatically try to log in if the token is present
    } else {
      setError(
        <>
          <span>Authorization token is missing.</span>
          <br />
          <span>Please use URL in private group to reauthenticate.</span>
          <br />
          <span>
            Cookies may have been cleared or a page was bookmarked without this
            token.
          </span>
        </>
      );
    }
  }, [searchParams]);

  // Updated auth handler to accept an optional token argument
  const handleAuth = async (key = accessKey) => {
    console.log("handleAuth - Started with key:", key);
    setLoading(true);
    setError(null);

    try {
      // Validate the access key
      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessKey: key }),
      });

      console.log("handleAuth - Response status:", response.status);

      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        const data = await response.json();
        console.log("handleAuth - Response JSON data:", data);

        if (data.valid) {
          console.log(
            "handleAuth - Access key is valid. Setting cookie and redirecting."
          );
          // Set the cookie with the access key
          Cookies.set("accessKey", key, { expires: 1 });

          console.log(
            "handleAuth - Redirecting to /business-directory with rtkn:",
            key
          );
          router.push(`/business-directory/?rtkn=${key}`);
        } else {
          setError(<span>Access could not be granted.</span>);
        }
      } else {
        const text = await response.text();
        setError(
          <>
            <span>Unexpected response format. Please try again later.</span>
            <br />
            <span>{text}</span>
          </>
        );
      }
    } catch (err) {
      setError(
        <>
          <span>An error occurred. Please try again later.</span>
          <br />
          <span>{String(err)}</span>
        </>
      );
    } finally {
      setLoading(false);
      console.log("handleAuth - Finished.");
    }
  };

  return (
    <div className={styles["auth-page"]}>
      <div className={styles["auth-container"]}>
        <div className={styles["auth-card"]}>
          <h1 className={styles["auth-title"]}>Welcome to Blue Dots of York</h1>
          <p className={styles["auth-subtitle"]}>
            {loading ? "Authorizing..." : error ? "Error" : "Redirecting"}
          </p>

          {error && <div className={styles["error-message"]}>{error}</div>}
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
