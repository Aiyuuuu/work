"use client";

import styles from "./Header.module.css";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
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
          onClick={() => { router.push("/home") }}
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
    </header>
  );
}



