"use client";

import { useState } from "react";
import styles from "./auth.module.css";
import LoginForm from "@/components/auth/LoginForm/LoginForm";
import SignupForm from "@/components/auth/SignupForm/SignupForm";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className={styles.container}>
      <h1 className={styles.mainHeading}>ART GALLERY</h1>
      {isSignup ? ( //conditional rendering
        <SignupForm onToggle={() => setIsSignup(false)} />
      ) : (
        <LoginForm onToggle={() => setIsSignup(true)} />
      )}
    </div>
  );
}