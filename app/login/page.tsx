"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./Login.module.css";

export default function Login() {
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);
    setError("");

    try {
      // Send the access key to the server for validation
      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessKey }),
      });

      const data = await response.json();

      if (data.valid) {
        // Set the cookie with the access key (expires in 1 day)
        Cookies.set("accessKey", accessKey, { expires: 1 });
        router.push("/business-directory");
      } else {
        setError("Invalid access key. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-container"]}>
        <div className={styles["login-card"]}>
          <h1 className={styles["login-title"]}>Welcome to Blue Dots of York</h1>
          <p className={styles["login-subtitle"]}>Please enter the access key to continue</p>

          {/* Form element to handle Enter key press */}
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Access Key"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className={styles["input-field"]}
            />
            <button
              type="submit"
              className={styles["login-button"]}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && <p className={styles["error-message"]}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
