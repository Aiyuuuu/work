'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function AssignTaskForm() {
    const [title, setTitle] = useState("")
    const [assignedTo, setAssignedTo] = useState("")
    const queryClient = useQueryClient()

    const { data: employees } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const res = await fetch('/api/employees');
            return res.json();
        }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (newTask: { title: string, assignedTo: string }) => {
            await fetch('/api/tasks', {
                method: 'POST',
                body: JSON.stringify(newTask)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
            setTitle("")
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!assignedTo) return alert('Please select an employee!');
        mutate({ title, assignedTo });
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Assign a New Task</h3>
            <div className="mt-4 space-y-4">
                <input
                    placeholder="Task Title" value={title} required
                    onChange={e => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-400"
                />
                <select
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-400"
                >
                    <option value="">Select Employee...</option>
                    {employees?.map((emp: {id: string, email: string, name:string}) => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? 'Assigning...' : 'Assign'}
                </button>
            </div>
        </form>
    );
}


