import { getTasks, type Task } from "@/lib/db";

export default async function ManagerTaskList() {
    const tasks = await getTasks();

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">All Tasks</h3>
            <ul className="mt-4 space-y-3">
                {tasks?.map((t: Task) => (
                    <li key={t.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="font-medium text-slate-900">{t.title}</p>
                        <p className="mt-1 text-sm text-slate-600">Assigned to: {t.employeeName}</p>
                        <p className="mt-1 text-sm text-slate-600">Status: {t.status}</p>
                    </li>
                ))}
            </ul>
        </section>
    )
}