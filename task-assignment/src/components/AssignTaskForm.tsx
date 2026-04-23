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
        <form onSubmit={handleSubmit} style={{ border: '1px solid black', padding: '1rem', marginBottom: '1rem' }}>
            <h3>Assign a New Task</h3>
            <input
                placeholder="Task Title" value={title} required
                onChange={e => setTitle(e.target.value)} style={{ marginRight: '10px' }}
            />
            <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} required style={{ marginRight: '10px' }}>
                <option value="">Select Employee...</option>
                {employees?.map((emp: {id: string, email: string, name:string}) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
            </select>
            <button type="submit" disabled={isPending}>
                {isPending ? 'Assigning...' : 'Assign'}
            </button>
        </form>
    );
}


