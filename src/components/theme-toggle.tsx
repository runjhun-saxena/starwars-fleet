"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  
  if (!mounted) {
    return (
      <div className={cn(
        "h-9 w-16 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse",
        className
      )} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative inline-flex h-9 w-16 items-center justify-center rounded-full transition-all duration-300 ease-out",
        " dark:from-slate-800 dark:to-slate-900",
        "shadow-lg hover:scale-105 active:scale-95",
        "border border-orange-200/50 dark:border-slate-700/50",
        
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >

      <div className="absolute inset-1 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm transition-all duration-300" />
      <div
        className={cn(
          "absolute z-10 h-7 w-7 rounded-full transition-all duration-300 ease-out",
          "bg-white dark:bg-slate-100 shadow-lg",
          "border border-orange-200/30 dark:border-slate-600/30",
          "group-hover:shadow-xl",
          isDark ? "translate-x-3.5" : "-translate-x-3.5"
        )}
      />
      <div
        className={cn(
          "absolute left-2 z-20 transition-all duration-300 ease-out",
          isDark 
            ? "opacity-30 scale-75 rotate-180" 
            : "opacity-100 scale-100 rotate-0"
        )}
      >
        <Sun className="h-4 w-4 text-orange-500 drop-shadow-sm" />
      </div>
      <div
        className={cn(
          "absolute right-2 z-20 transition-all duration-300 ease-out",
          isDark 
            ? "opacity-100 scale-100 rotate-0" 
            : "opacity-30 scale-75 -rotate-180"
        )}
      >
        <Moon className="h-4 w-4 text-blue-400 drop-shadow-sm" />
      </div>
      <div
        className={cn(
          "absolute inset-0 rounded-full opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
          isDark 
            ? "bg-gradient-to-r from-transparent via-blue-500/10 to-blue-500/20"
            : "bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent"
        )}
      />
    </button>
  );
}