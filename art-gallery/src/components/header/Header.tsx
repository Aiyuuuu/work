"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { FaSearch } from "react-icons/fa";
import { Avatar } from "@mui/material";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/client/axios/apiClient";

export default function Header() {
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const [profileDropdown, setProfileDropdown] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      const res = await apiClient.post("/api/auth/logout");
      if (res.data.success) {
        router.replace("/auth");
        router.refresh()
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image
          src="/civitlogo.png"
          alt="Civit Logo"
          className={styles.image}
          width={120}
          height={40}
          priority
          unoptimized
          onClick={() => router.push("/home")}
        />
      </div>

      <div className={styles.searchContainer}>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          className={styles.search}
        />

        <IconButton className={styles.searchButton} aria-label="search">
          <FaSearch className={styles.searchIcon} />
        </IconButton>
      </div>

      <div className={styles.profile} ref={profileRef}>
        <div
          className={styles.avatarWrapper}
          onClick={() => setProfileDropdown((prev) => !prev)}
        >
          <Avatar
            className={styles.avatar}
            alt="Travis Howard"
            src="/user.png"
          />
        </div>

        {profileDropdown && (
          <div className={styles.dropdown}>
            <button type="button" className={styles.dropdownItem}>
              Profile
            </button>
            <button type="button" className={styles.dropdownItem}>
              Settings
            </button>
            <button
              type="button"
              className={styles.dropdownItem}
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
