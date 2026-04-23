'use client';
import { useQuery } from '@tanstack/react-query';

type Task = {
    id: number;
    title: string;
    assignedTo: string;
    employeeName: string;
    status: string;
};


export default function EmployeeTaskList() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => fetch('/api/tasks').then(res => res.json())
  });

  if (isLoading) return <p>Loading your tasks...</p>;

  return (
    <div>
      <h3>Your Tasks</h3>
      {tasks?.length === 0 && <p>You have no tasks! Good job.</p>}
      <ul>
        {tasks?.map((t: Task) => (
          <li key={t.id} value={t.id}>{t.title}. Status: {t.status}</li>
        ))}
      </ul>
    </div>
  );
}