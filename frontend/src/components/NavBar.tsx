"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Spinner } from "./ui/spinner";
import Link from "next/link";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const isDarkTheme = theme === "dark";

  const { user } = useUser();

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex flex-shrink-0 items-center">
            <div className="text-4xl font-bold">Scheduler</div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <Suspense fallback={<div>Loading profile...</div>}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.picture ?? "/placeholder-avatar.jpg"}
                          alt={user?.name ?? "@user"}
                        />
                        <AvatarFallback>
                          {user?.name?.[0] ?? <Spinner />}
                        </AvatarFallback>
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
                      <Link className="flex flex-row items-center justify-center" href="api/auth/logout">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
