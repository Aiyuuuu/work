import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getEmployees } from "@/lib/db";

async function getSessionCookie() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session')?.value
    return sessionCookie
}

export async function GET() {
    const sessionCookie = await getSessionCookie();
    if (!sessionCookie) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    const user = await JSON.parse(sessionCookie)



    if (user.role === "MANAGER") {
        const employees = (await getEmployees()).map((u) => { return { id: u.id, email: u.email, name: u.name } })
        return NextResponse.json(employees)
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
}