import ManagerTaskList from "@/components/ManagerTaskList"
import AssignTaskForm from "@/components/AssignTaskForm"
import LogoutButton from "@/components/LogoutButton"
import { cookies } from "next/headers"


export default async function ManagerDashboard() {
    const cookieStore = await cookies();

    const user = JSON.parse(
        cookieStore.get('auth_session')?.value || '{}'
    );

    return (
        <main className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Manager Dashboard</p>
                        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Welcome, Boss ({user?.name || "guest"})</h1>
                        <p className="mt-2 text-sm text-slate-600">Assign work and keep track of the team from one place.</p>
                    </div>
                    <LogoutButton />
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[360px,1fr]">
                <AssignTaskForm />
                <ManagerTaskList />
            </section>
        </main>
    );
}