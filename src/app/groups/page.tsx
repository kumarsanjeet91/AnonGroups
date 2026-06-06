import { redirect } from "next/navigation";
import { GroupList } from "@/components/GroupList";
import { Navbar } from "@/components/Navbar";
import { connectToDatabase } from "@/lib/db";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { Group } from "@/models/Group";
import { seedDefaultGroups } from "@/server/seed";
import { GroupDto } from "@/types/chat";

export default async function GroupsPage() {
  const user = await getCurrentUserFromCookies();
  if (!user) redirect("/login");

  await connectToDatabase();
  await seedDefaultGroups();
  const groups = await Group.find({}).sort({ createdAt: 1 }).lean();
  const serialized: GroupDto[] = groups.map((group) => ({
    _id: group._id.toString(),
    name: group.name,
    description: group.description,
    createdAt: group.createdAt.toISOString()
  }));

  return (
    <>
      <Navbar username={user.username} centerLabel="Public Groups" />
      <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-6 dark:bg-[#0F172A]">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 rounded-md border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111827]">
            <h1 className="text-2xl font-black text-slate-950 dark:text-[#F8FAFC]">Public groups</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-[#94A3B8]">Choose a room. Everything here is public to that group.</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm dark:border-white/[0.08] dark:bg-[#111827]">
            <GroupList groups={serialized} />
          </div>
        </div>
      </main>
    </>
  );
}
