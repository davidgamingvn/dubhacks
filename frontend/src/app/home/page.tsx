import { Card, CardContent, CardHeader } from "~/components/ui/card";
import Navbar from "~/components/NavBar";
import { getSession } from "@auth0/nextjs-auth0";

export default async function HomeworkScheduler() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const session = await getSession();
  const user = session?.user;

  const constraints = [
    {
      name: "sleep",
      days: [0, 1, 2, 3, 4, 5, 6], // Days 0-6 represent Sunday to Saturday (entire week)
      from: "22:00",
      to: "06:00",
    },
    {
      name: "workout",
      days: [1, 3, 5], // Days 1, 3, 5 represent Monday, Wednesday, Friday
      from: "07:00",
      to: "08:00",
    },
    {
      name: "study",
      days: [2, 4], // Days 2, 4 represent Tuesday and Thursday
      from: "16:00",
      to: "18:00",
    },
  ];

  const mockSchedule = days.map((day, index) => {
    const dayConstraints = constraints
      .filter((constraint) => constraint.days.includes(index))
      .map((constraint) => ({
        name: constraint.name,
        from: constraint.from,
        to: constraint.to,
      }));
    return { day, constraints: dayConstraints };
  });

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
            <div className="mt-4 grid grid-cols-7 gap-4">
              {mockSchedule.map(({ day, constraints }) => (
                <div key={day} className="text-center font-semibold">
                  <div>{day}</div>
                  {constraints.map((constraint, idx) => (
                    <div
                      key={idx}
                      className="mt-2 rounded-md border border-gray-200 p-2"
                    >
                      <div className="font-bold">{constraint.name}</div>
                      <div>
                        {constraint.from} - {constraint.to}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
