// src/components/ImageModal/ImageModalSkeleton.tsx
"use client";

import { useEffect } from "react"; // 🟢 Added useEffect
import styles from "./ImageModal.module.css";
import { Black_Ops_One } from "next/font/google";

const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
});

export default function ImageModalSkeleton() {
  // 🟢 FIX 1: Lock body scrolling instantly on skeleton mount to match the modal's scroll state
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className={styles.backdrop}>
      <div className={styles.content}>
        
        {/* Left Side Image Skeleton */}
        <div 
          className={styles.imageWrap} 
          style={{ 
            aspectRatio: "832 / 1280", 
            background: "#25262b", 
            borderRadius: "12px",
            animation: "pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite" 
          }} 
        />

        {/* Right Side Info Panel Skeleton */}
        <div 
          className={`${styles.infoContainer} ${blackOpsOne.className}`}
          style={{ animation: "pulse 1.8s infinite" }}
        >
          <div className={styles.infoHeading}>IMAGE INFO</div>
          
          {/* 🟢 FIX 2: Force overflow: hidden so the skeleton never renders an inner scrollbar */}
          <div className={styles.infoBody} style={{ overflow: "hidden" }}>
            <div style={{ width: "60%", height: "24px", background: "#2c2e33", margin: "10px auto 20px", borderRadius: "4px" }} />
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", width: "100%" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    flexBasis: "calc(50% - 12px)", 
                    flexGrow: 1,
                    minWidth: "120px",
                    height: "36px", 
                    background: "#2c2e33", 
                    borderRadius: "10px", 
                    margin: "6px" 
                  }} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}