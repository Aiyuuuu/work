"use client";

import { useRouter } from "next/navigation";
import styles from "./ModalCloseButton.module.css";

export default function ModalCloseButton() {
  const router = useRouter();

  return (
    <button className={styles.close} onClick={() => router.back()}>
      Close
    </button>
  );
}
