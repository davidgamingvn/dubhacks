"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LogOut, User, Home } from "lucide-react";
import ThemeToggleButton from "./theme-toggle";
import { useTheme } from "next-themes";
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
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const isDarkTheme = theme === "dark";

  const { user } = useUser();

  const currentRoute = usePathname();

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex flex-shrink-0 items-center">
            <div className="text-4xl font-bold">
              <Link href="/">Scheduler</Link>
            </div>
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
                        src={user?.picture ?? ""}
                        alt={user?.name ?? "@user"}
                      />
                      <AvatarFallback>
                        {user?.name?.[0] ?? <Spinner />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={currentRoute === "/home" ? "/my-profile" : "/home"}
                    >
                      {currentRoute === "/home" ? (
                        <>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </>
                      ) : (
                        <>
                          <Home className="mr-2 h-4 w-4" />
                          <span>Home</span>
                        </>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <ThemeToggleButton />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="border-none focus:bg-red-400">
                    <Link
                      className="flex flex-row items-center justify-center"
                      href="api/auth/logout"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
