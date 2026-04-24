import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const sessionCookie = (await cookies()).get("auth_session")?.value;

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const user = JSON.parse(sessionCookie);

    if (user.role === "MANAGER") {
      redirect("/dashboard/manager");
    }

    if (user.role === "EMPLOYEE") {
      redirect("/dashboard/employee");
    }
  } catch {
    redirect("/login");
  }

  redirect("/login");
}
