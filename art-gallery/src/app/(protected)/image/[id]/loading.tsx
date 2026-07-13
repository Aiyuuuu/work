// src/app/(protected)/image/[id]/loading.tsx
"use client"; // Required because we are importing local CSS Modules

import styles from "./page.module.css";
import { Black_Ops_One } from "next/font/google";

const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
});

export default function ImagePageLoading() {
  return (
    <div className={styles.page}>
      {/* Note: We omit the background video in the skeleton so it loads instantly */}

      {/* 1. Topbar Skeleton */}
      <div className={styles.topbar}>
        <div 
          style={{ 
            width: "60px", 
            height: "16px", 
            background: "#25262b", 
            borderRadius: "4px", 
            animation: "pulse 1.8s infinite" 
          }} 
        />
      </div>

      {/* 2. Main Content Split Pane */}
      <div className={styles.content}>
        
        {/* 2a. Left Side Image Skeleton (Locked to portrait aspect-ratio) */}
        <div 
          className={styles.imageWrap} 
          style={{ 
            aspectRatio: "832 / 1280", 
            background: "#25262b", 
            borderRadius: "12px",
            animation: "pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite" 
          }} 
        />

        {/* 2b. Right Side Info Panel Skeleton */}
        <div 
          className={`${styles.infoContainer} ${blackOpsOne.className}`}
          style={{ animation: "pulse 1.8s infinite" }}
        >
          <div className={styles.infoHeading}>IMAGE INFO</div>
          
          {/* 🟢 Force overflow: hidden so the skeleton never renders an inner scrollbar */}
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

      {/* Pulse Keyframe Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}