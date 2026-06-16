import axios from "axios";

export async function checkSession(): Promise<boolean> {
  try {
    await axios.get("/api/auth/session");
    return true;
  } catch {
    return false;
  }
}