import { NextResponse } from "next/server";
import { findUserByCredentials } from "@/lib/db";

export async function POST(request: Request) {
    const { email, password } = await request.json()
    const user = await findUserByCredentials(email, password)

    if (!user) {
        return NextResponse.json({ error: 'Invalid Credentials' }, { status: 401 })
    }

    const response = NextResponse.json({ role: user.role })
    response.cookies.set('auth_session', JSON.stringify({ id: user.id, role: user.role, name: user.name }), {
        httpOnly: true,
        secure: false,
        path: '/'
    })
    return response
}
