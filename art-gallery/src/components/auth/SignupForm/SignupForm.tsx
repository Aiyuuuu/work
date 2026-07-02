"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import apiClient from "@/lib/client/axios/apiClient";

import styles from "./SignupForm.module.css";

export type SignupFormProps = {
  onToggle: () => void;
};

export default function SignupForm({ onToggle }: SignupFormProps) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await apiClient.post("/api/auth/signup", {
        username: username.trim(),
        email: email.trim(),
        password,
      });

      router.replace("/home");
      router.refresh();
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.error?.message ??
            "Signup failed. Please try again.",
        );
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>Sign Up</h2>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="username">Username</label>

          <input
            id="username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
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
            disabled={loading}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword">Confirm Password</label>

          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          <video
            className={styles.btnVideo}
            src="/stars_240p.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onCanPlay={(e) => {
              e.currentTarget.playbackRate = 5;
            }}
          />

          <span className={styles.buttonText}>
            {loading ? "Creating account..." : "Sign Up"}
          </span>
        </button>
      </form>

      <p className={styles.toggle}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className={styles.link}
          disabled={loading}
        >
          Login
        </button>
      </p>
    </div>
  );
}