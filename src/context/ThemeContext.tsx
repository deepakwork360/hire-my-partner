"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "rose" | "gold" | "cyan" | "violet" | "emerald";

interface ThemeContextType {
  activeTheme: Theme;
  isPreferenceSet: boolean;
  setTheme: (theme: Theme) => void;
  resetToRotation: () => void;
}

const THEMES: Theme[] = ["rose", "gold", "cyan", "violet", "emerald"];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<Theme>("rose");
  const [isPreferenceSet, setIsPreferenceSet] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initial load logic
    const savedTheme = localStorage.getItem("theme_choice") as Theme;
    const preferenceFlag = localStorage.getItem("theme_preference_set") === "true";
    const sessionActive = sessionStorage.getItem("theme_session_active") === "true";

    if (preferenceFlag && savedTheme && THEMES.includes(savedTheme)) {
      // User has a locked preference
      setActiveTheme(savedTheme);
      setIsPreferenceSet(true);
    } else if (!sessionActive) {
      // New session (Revisit) - Pick a new random theme
      const currentStored = (localStorage.getItem("theme_last_active") as Theme) || "rose";
      const otherThemes = THEMES.filter((t) => t !== currentStored);
      const randomTheme = otherThemes[Math.floor(Math.random() * otherThemes.length)];
      
      setActiveTheme(randomTheme);
      localStorage.setItem("theme_last_active", randomTheme);
      sessionStorage.setItem("theme_session_active", "true");
    } else {
      // Refresh in same session - use last active
      const lastActive = (localStorage.getItem("theme_last_active") as Theme) || "rose";
      setActiveTheme(lastActive);
    }

    setMounted(true);
  }, []);

  // Update data-theme attribute on <html>
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", activeTheme);
    }
  }, [activeTheme, mounted]);

  const setTheme = (theme: Theme) => {
    setActiveTheme(theme);
    setIsPreferenceSet(true);
    localStorage.setItem("theme_choice", theme);
    localStorage.setItem("theme_last_active", theme);
    localStorage.setItem("theme_preference_set", "true");
  };

  const resetToRotation = () => {
    setIsPreferenceSet(false);
    localStorage.removeItem("theme_choice");
    localStorage.removeItem("theme_preference_set");
    // Pick a new one immediately for feedback
    const otherThemes = THEMES.filter((t) => t !== activeTheme);
    const randomTheme = otherThemes[Math.floor(Math.random() * otherThemes.length)];
    setActiveTheme(randomTheme);
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, isPreferenceSet, setTheme, resetToRotation }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
