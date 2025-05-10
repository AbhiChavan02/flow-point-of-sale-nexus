
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="relative rounded-full w-10 h-10 overflow-hidden group"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="sr-only">Toggle theme</span>
      <span 
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${
          theme === "dark" ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Sun className="h-5 w-5 text-yellow-300" />
      </span>
      <span 
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${
          theme === "dark" ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <Moon className="h-5 w-5 text-blue-400" />
      </span>
      <span 
        className="absolute inset-0 bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"
      ></span>
    </Button>
  );
};

export default ThemeToggle;
