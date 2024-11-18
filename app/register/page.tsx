"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");

  const handleRegister = async () => {
    const startResponse = await fetch("/api/webauthn/register/start", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    const options = await startResponse.json();

    const credential = await navigator.credentials.create({ publicKey: options });
    const verifyResponse = await fetch("/api/webauthn/register/verify", {
      method: "POST",
      body: JSON.stringify({ email, response: credential }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await verifyResponse.json();
    if (result.success) {
      alert("Passkey registration successful!");
    } else {
      alert("Registration failed.");
    }
  };

  return (
    <div>
      <h1>Register with Passkey</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
