"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Moon, Sun, LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";

export default function HomeworkScheduler() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const { theme, setTheme } = useTheme();

  const isDarkTheme = theme === "dark";

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex flex-shrink-0 items-center">
              <div className="text-4xl font-bold">Scheduler</div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/placeholder-avatar.jpg"
                          alt="@user"
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
                    >
                      {isDarkTheme ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : (
                        <Moon className="mr-2 h-4 w-4" />
                      )}
                      <span>{isDarkTheme ? "Light" : "Dark"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="border-none focus:bg-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="bg-[#FAF17C] p-4 text-xl font-bold text-black rounded-t-xl">
            Hello User! Here is your homework schedule this week:
          </CardHeader>
          <CardContent>
            <div className="mt-4 grid grid-cols-7 gap-4">
              {days.map((day) => (
                <div key={day} className="text-center font-semibold">
                  {day}
                </div>
              ))}
              {days.map((day) => (
                <div
                  key={`${day}-schedule`}
                  className="h-40 rounded-md border border-gray-200 p-2"
                >
                  {/* Add homework items here */}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
