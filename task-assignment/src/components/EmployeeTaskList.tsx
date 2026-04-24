'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type Task = {
    id: number;
    title: string;
    assignedTo: string;
    employeeName: string;
    status: string;
};


export default function EmployeeTaskList() {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => fetch('/api/tasks').then(res => res.json())
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await fetch('/api/tasks', {
        method: 'PATCH',
        body: JSON.stringify({ id, status })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const toggleStatus = (task: Task) => {
    const currentStatus = task.status.toLowerCase();
    const nextStatus = currentStatus === 'done' ? 'pending' : 'done';

    mutate({ id: task.id, status: nextStatus });
  };

  if (isLoading) return <p>Loading your tasks...</p>;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Your Tasks</h3>
      {tasks?.length === 0 && <p className="mt-4 text-sm text-slate-600">You have no tasks right now. Good job.</p>}
      <ul className="mt-4 space-y-3">
        {tasks?.map((t: Task) => (
          <li key={t.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-slate-900">{t.title}</p>
                <p className="mt-1 text-sm text-slate-600">Status: {t.status}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleStatus(t)}
                disabled={isPending}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t.status.toLowerCase() === 'done' ? 'Mark as Pending' : 'Mark as Done'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}