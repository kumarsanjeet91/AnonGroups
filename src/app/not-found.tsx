import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-black">Room not found</h1>
        <p className="mt-2 text-sm text-ink/65 dark:text-paper/65">That public group does not exist.</p>
        <Link className="mt-5 inline-flex rounded-md bg-ink px-4 py-3 font-bold text-paper dark:bg-paper dark:text-ink" href="/groups">
          Back to groups
        </Link>
      </div>
    </main>
  );
}
