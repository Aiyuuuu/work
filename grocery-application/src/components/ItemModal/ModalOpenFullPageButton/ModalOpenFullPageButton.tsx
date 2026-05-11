"use client";

import styles from "./ModalOpenFullPageButton.module.css";

export default function ModalOpenFullPageButton({ itemId }: { itemId: string }) {
  return (
    <button 
      className={styles.viewPage} 
      onClick={() => {
        window.location.href = `/items/${itemId}`;
      }}
    >
      Open full page
    </button>
  );
}
