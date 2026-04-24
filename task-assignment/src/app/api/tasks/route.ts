import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { addTask, getTasks, getUsers, updateTaskStatus } from "@/lib/db";


async function getSessionCookie() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session')?.value
    return sessionCookie
}

export async function GET() {
    const sessionCookie = await getSessionCookie();

    if (!sessionCookie) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

    const user = JSON.parse(sessionCookie)
    const tasks = await getTasks();

    if (user.role === "MANAGER") {
        return NextResponse.json(tasks)
    }

    if (user.role === "EMPLOYEE") {
        const employeeTasks = tasks.filter((t) => t.assignedTo === user.id)
        return NextResponse.json(employeeTasks)
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

    const users = await getUsers();
    const employee = users.find((u) => u.id === body.assignedTo)

    if (employee) {
        const newTask = {
            id: Date.now(),
            title: body.title,
            assignedTo: body.assignedTo,
            employeeName: employee.name,
            status: "pending"
        }
        try { await addTask(newTask) }
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

    const tasks = await getTasks();
    const task = tasks.find((entry) => entry.id === body.id)

    if (!task) { return NextResponse.json({ error: "Not Found" }, { status: 404 }); }

    if (task.assignedTo === user.id) {
        const updatedTask = await updateTaskStatus(body.id, body.status)
        return NextResponse.json(updatedTask)
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
}



