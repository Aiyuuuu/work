"use client"
import { useQuery } from "@tanstack/react-query"

type Task = {
    id: number;
    title: string;
    assignedTo: string;
    employeeName: string;
    status: string;
};


export default function ManagerTaskList() {
    const { data: tasks, isLoading } = useQuery<Task[]>(
        {
            queryKey: ['tasks'],
            queryFn: async () => {
                const res = await fetch("/api/tasks")
                return res.json()
            }
        })


    if (isLoading) return <p>Loading all tasks...</p>;

    return (
        <ul>
            {tasks?.map((t: Task) => (
                <li key={t.id}>
                    <p>
                        {t.employeeName} needs to {t.title}. status: {t.status}
                    </p>
                </li>
            ))}
        </ul>
    )
}