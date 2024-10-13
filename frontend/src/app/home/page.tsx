import { Card, CardContent, CardHeader } from "~/components/ui/card";
import Navbar from "~/components/NavBar";
import { getSession } from "@auth0/nextjs-auth0";
import WeeklyCalendar from "~/components/WeeklyCalendar";
import { Suspense } from "react";
import { Spinner } from "~/components/ui/spinner";


export default async function HomeworkScheduler() {
  const session = await getSession();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-[#FFFBEB] dark:bg-slate-700">
      <Navbar />

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Card className="border-none bg-white dark:bg-gray-800">
          <CardHeader className="rounded-t-xl bg-[#FAF17C] p-4 text-2xl font-bold tracking-wider dark:text-slate-800">
            Hello {user?.name ?? "User"}! Here is your homework schedule this
            week:
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Spinner />}>
              <WeeklyCalendar />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
