'use server';

export default async function LogoutButton() {
  return (
    <form action="/api/logout" method="post" className="inline">
      <button type="submit" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
        Logout
      </button>
    </form>
  );
}