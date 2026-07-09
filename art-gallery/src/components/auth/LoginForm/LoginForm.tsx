"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import apiClient from "@/lib/axios/apiClient";

import styles from "./LoginForm.module.css";
import { API_ENDPOINTS } from "@/constants/apiConstants";

export type LoginFormProps = {
  onToggle: () => void;
};

export default function LoginForm({ onToggle }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await apiClient.post(API_ENDPOINTS.AUTH.login.ENDPOINT, {
        email: email.trim(),
        password,
      });

      router.replace("/home");
      router.refresh();
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.error?.message ??
            "Login failed. Please try again.",
        );
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

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

        <button type="submit" className={styles.button} disabled={loading}>
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
            {loading ? "Logging in..." : "Login"}
          </span>
        </button>
      </form>

      <p className={styles.toggle}>
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className={styles.link}
          disabled={loading}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}
