import { NextResponse } from "next/server";
import { USERS } from "@/lib/db";

export async function POST(request: Request) {
    const { email, password } = await request.json()
    const user = USERS.find((u) => { return u.email === email && u.password === password })

    if (!user) {
        return NextResponse.json({ error: 'Invalid Credentials', status: 401 })
    }

    else {
        const response = NextResponse.json({ role: user.role })
        response.cookies.set('auth_session', JSON.stringify({ id: user.id, role: user.role, name: user.name }), {
            httpOnly: true,
            secure: false,
            path: '/'
        })
        return response
    }
}
