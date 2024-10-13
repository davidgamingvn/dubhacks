// components/ThemeToggleButton.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
      className="flex flex-row items-center w-full justify-start"
    >
      {isDarkTheme ? (
        <>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </>
      )}
    </Button>
  );
}
