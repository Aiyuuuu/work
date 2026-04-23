import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { TASKS, USERS } from "@/lib/db";


async function getSessionCookie() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session')?.value
    return sessionCookie
}

export async function GET() {
    const sessionCookie = await getSessionCookie();

    if (!sessionCookie) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

    const user = JSON.parse(sessionCookie)

    if (user.role === "MANAGER") {
        return NextResponse.json(TASKS)
    }

    if (user.role === "EMPLOYEE") {
        const tasks = TASKS.filter((t) => t.assignedTo === user.id)
        return NextResponse.json(tasks)
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
}



export async function POST(request: Request) {
    const sessionCookie = await getSessionCookie();

    if (!sessionCookie) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    const user = JSON.parse(sessionCookie)
    if (user.role !== "MANAGER") { return NextResponse.json({ error: "Unauthorized" }, { status: 403 }) }

    const body = await request.json();

    if (!body || !(body.title) || !(body.assignedTo)) { return NextResponse.json({ error: "Bad Request" }, { status: 400 }) }

    const employee = USERS.find((u) => u.id === body.assignedTo)

    if (employee) {
        const newTask = {
            id: Date.now(),
            title: body.title,
            assignedTo: body.assignedTo,
            employeeName: employee.name,
            status: "pending"
        }
        try { TASKS.push(newTask) }
        catch (err) { return NextResponse.json({ error: "Internal Server Error" }, { status: 500 }) }

        return NextResponse.json(newTask)

    }
    return NextResponse.json({ error: `employee ${body.assignedTo} not found` }, { status: 404 })
}


export async function PATCH(request: Request) {
    const sessionCookie = await getSessionCookie();

    if (!sessionCookie) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    const user = JSON.parse(sessionCookie)
    if (user.role !== "EMPLOYEE") { return NextResponse.json({ error: "Unauthorized" }, { status: 403 }) }

    const body = await request.json();

    if (!body || !(body.id) || !(body.status)) { return NextResponse.json({ error: "Bad Request" }, { status: 400 }) }

    const task = TASKS.find((t) => t.id === body.id)

    if (!task) { return NextResponse.json({ error: "Not Found" }, { status: 404 }); }

    if (task?.assignedTo === user.id) {
        task.status = body.status;

        return NextResponse.json(task)
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
}



