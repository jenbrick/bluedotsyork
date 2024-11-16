"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./Login.module.css";

export default function Login() {
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const correctKey = process.env.NEXT_PUBLIC_ACCESS_KEY || "bluedotsyork";

    if (accessKey === correctKey) {
      Cookies.set("accessKey", accessKey, { expires: 1 });
      router.push("/business-directory");
    } else {
      setError("Invalid access key. Please try again.");
    }
  };

  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-container"]}>
        <div className={styles["login-card"]}>
          <h1 className={styles["login-title"]}>Welcome to Blue Dots of York</h1>
          <p className={styles["login-subtitle"]}>Please enter the access key to continue</p>

          <input
            type="password"
            placeholder="Access Key"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            className={styles["input-field"]}
          />
          <button onClick={handleLogin} className={styles["login-button"]}>
            Login
          </button>

          {error && <p className={styles["error-message"]}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
