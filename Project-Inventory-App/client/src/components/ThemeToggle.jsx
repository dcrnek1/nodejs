import { useState, useEffect } from "react";
import { Sun, Moon, Desktop } from "@phosphor-icons/react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("system"); // 'light' | 'dark' | 'system'
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (mode) => {
      const isDark =
        mode === "dark" || (mode === "system" && mediaQuery.matches);
      document.documentElement.classList.toggle("dark", isDark);
    };

    applyTheme(savedTheme);

    const handleChange = () => {
      if (theme === "system") applyTheme("system");
    };
    mediaQuery.addEventListener("change", handleChange);

    setMounted(true);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setThemeMode = (mode) => {
    setTheme(mode);
    localStorage.setItem("theme", mode);

    const isDark =
      mode === "dark" ||
      (mode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  };

  if (!mounted) return null;

  const iconProps = { size: 18, weight: "regular" };
  const baseBtn =
    "flex items-center gap-2 p-2 sm:p-1 rounded-full text-sm font-medium";
  const active =
    "bg-white dark:bg-gray-700 ring-1 ring-gray-950/15 text-gray-900 dark:text-gray-50 dark:ring-1 dark:ring-gray-500";
  const inactive =
    "text-gray-500 hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800 dark:ring-1 dark:ring-gray-500/0";

  return (
    <div className="flex items-center bg-gray-950/5 dark:bg-white/10 p-1 gap-1 sm:gap-2 rounded-full">
      <button
        onClick={() => setThemeMode("light")}
        className={`${baseBtn} ${
          theme === "light" ? active : inactive
        }`}
      >
        <Sun {...iconProps} />
        
      </button>
      <button
        onClick={() => setThemeMode("dark")}
        className={`${baseBtn} ${theme === "dark" ? active : inactive}`}
      >
        <Moon {...iconProps} />
        
      </button>
      <button
        onClick={() => setThemeMode("system")}
        className={`${baseBtn} ${
          theme === "system" ? active : inactive
        }`}
      >
        <Desktop {...iconProps} />
        
      </button>
    </div>
  );
}
