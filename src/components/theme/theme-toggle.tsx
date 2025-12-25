import { Monitor, Moon, Sun, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme-provider";

interface ThemeToggleProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
  align?: "start" | "center" | "end";
}

export function ThemeToggle({
  variant = "ghost",
  size = "default",
  showLabel = false,
  align = "end",
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Animation variants for icons
  const iconVariants = {
    sun: "transition-all duration-500 ease-in-out",
    moon: "transition-all duration-500 ease-in-out",
    system: "transition-all duration-300 ease-in-out",
  };

  const getCurrentIcon = () => {
    if (theme === "system") {
      return (
        <Monitor 
          className={`h-4 w-4 ${iconVariants.system} rotate-0 scale-100`}
          aria-hidden="true" 
        />
      );
    }
    
    if (resolvedTheme === "dark") {
      return (
        <Moon 
          className={`h-4 w-4 ${iconVariants.moon} rotate-0 scale-100`}
          aria-hidden="true" 
        />
      );
    }
    
    return (
      <Sun 
        className={`h-4 w-4 ${iconVariants.sun} rotate-0 scale-100`}
        aria-hidden="true" 
      />
    );
  };

  const themeOptions = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Use light theme",
    },
    {
      value: "dark", 
      label: "Dark",
      icon: Moon,
      description: "Use dark theme",
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
      description: "Use system theme",
    },
  ] as const;

  const handleThemeSelect = (newTheme: typeof theme) => {
    setTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`
            relative overflow-hidden transition-all duration-200 ease-in-out
            hover:scale-105 active:scale-95
            focus:ring-2 focus:ring-ring focus:ring-offset-2
            ${showLabel ? "gap-2" : "aspect-square"}
          `}
          aria-label="Toggle theme"
        >
          <div className="relative flex items-center justify-center">
            {getCurrentIcon()}
          </div>
          {showLabel && (
            <span className="text-sm font-medium">
              {themeOptions.find(option => option.value === theme)?.label}
            </span>
          )}
          <span className="sr-only">
            Current theme: {theme === "system" ? `System (${resolvedTheme})` : theme}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align={align} 
        className="w-56 p-2 bg-popover/95 backdrop-blur-sm border border-border/50 shadow-lg"
      >
        <div className="grid gap-1">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = theme === option.value;
            
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleThemeSelect(option.value)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 cursor-pointer
                  transition-all duration-200 ease-in-out
                  hover:bg-accent/80 focus:bg-accent/80
                  rounded-md group
                  ${isSelected ? 'bg-accent/60 text-accent-foreground' : ''}
                `}
              >
                <div className="flex items-center justify-center w-5 h-5">
                  <Icon 
                    className={`
                      h-4 w-4 transition-all duration-200
                      ${isSelected ? 'text-accent-foreground scale-110' : 'text-muted-foreground'}
                      group-hover:scale-105
                    `}
                  />
                </div>
                
                <div className="flex flex-col flex-1 min-w-0">
                  <span className={`
                    text-sm font-medium leading-none
                    ${isSelected ? 'text-accent-foreground' : 'text-foreground'}
                  `}>
                    {option.label}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5 leading-none">
                    {option.description}
                  </span>
                </div>
                
                {isSelected && (
                  <Check className="h-4 w-4 text-accent-foreground animate-in fade-in-0 zoom-in-75 duration-150" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
        
        {resolvedTheme && (
          <div className="border-t border-border/50 mt-2 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
              <div className={`
                w-2 h-2 rounded-full transition-colors duration-200
                ${resolvedTheme === 'dark' ? 'bg-blue-500' : 'bg-amber-500'}
              `} />
              Currently using {resolvedTheme} theme
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simplified version for minimal use cases
export function ThemeToggleSimple() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const handleToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="default"
      onClick={handleToggle}
      className={`
        relative overflow-hidden aspect-square
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95
        focus:ring-2 focus:ring-ring focus:ring-offset-2
      `}
      aria-label={`Switch to ${theme === "light" ? "dark" : theme === "dark" ? "system" : "light"} theme`}
    >
      <div className="relative flex items-center justify-center">
        {theme === "system" && (
          <Monitor className="h-4 w-4 transition-all duration-300 ease-in-out rotate-0 scale-100" />
        )}
        {resolvedTheme === "dark" && theme !== "system" && (
          <Moon className="h-4 w-4 transition-all duration-500 ease-in-out rotate-0 scale-100" />
        )}
        {resolvedTheme === "light" && theme !== "system" && (
          <Sun className="h-4 w-4 transition-all duration-500 ease-in-out rotate-0 scale-100" />
        )}
      </div>
      <span className="sr-only">
        Current theme: {theme === "system" ? `System (${resolvedTheme})` : theme}
      </span>
    </Button>
  );
}