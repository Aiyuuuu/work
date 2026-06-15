"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";
import apiClient from "@/lib/axios/axios";

export type LoginFormProps = {
  onToggle: () => void;
};

export default function LoginForm({ onToggle }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post("/api/auth/login", { email, password });
      router.push("/home");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>Login</h2>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className={styles.toggle}>
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onToggle} className={styles.link}>
          Sign up
        </button>
      </p>
    </div>
  );
}