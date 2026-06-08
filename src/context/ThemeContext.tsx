"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "rose" | "gold" | "cyan" | "violet" | "emerald";
export type Appearance = "light" | "dark";

interface ThemeContextType {
  activeTheme: Theme;
  isPreferenceSet: boolean;
  appearance: Appearance;
  setTheme: (theme: Theme) => void;
  setAppearance: (appearance: Appearance) => void;
  toggleAppearance: () => void;
  resetToRotation: () => void;
}

const THEMES: Theme[] = ["rose", "gold", "cyan", "violet", "emerald"];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialAppearance = (): Appearance => {
  if (typeof window !== "undefined") {
    const attr = document.documentElement.getAttribute("data-appearance") as Appearance;
    if (attr === "light" || attr === "dark") return attr;
  }
  return "dark";
};

const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme") as Theme;
    if (attr && THEMES.includes(attr)) return attr;
  }
  return "rose";
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<Theme>(getInitialTheme);
  const [appearance, setAppearanceState] = useState<Appearance>(getInitialAppearance);
  const [isPreferenceSet, setIsPreferenceSet] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initial load logic
    const savedTheme = localStorage.getItem("theme_choice") as Theme;
    const savedAppearance = localStorage.getItem("appearance_choice") as Appearance;
    const preferenceFlag = localStorage.getItem("theme_preference_set") === "true";
    const lastRotationTime = localStorage.getItem("theme_last_rotation_time");
    const now = Date.now();
    const rotationInterval = 1.5 * 60 * 1000; // 1.5 minutes

    if (savedAppearance && (savedAppearance === "light" || savedAppearance === "dark")) {
      setAppearanceState(savedAppearance);
    } else {
      // Check system preference if user hasn't set one
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setAppearanceState(systemPrefersDark ? "dark" : "light");
    }

    if (preferenceFlag && savedTheme && THEMES.includes(savedTheme)) {
      // User has a locked preference
      setActiveTheme(savedTheme);
      setIsPreferenceSet(true);
    } else {
      // Auto-rotate mode is active
      setIsPreferenceSet(false);

      const lastActive = localStorage.getItem("theme_last_active") as Theme;
      let shouldRotate = false;

      if (!lastActive || !lastRotationTime) {
        shouldRotate = true;
      } else {
        const timeElapsed = now - Number(lastRotationTime);
        if (timeElapsed >= rotationInterval) {
          shouldRotate = true;
        }
      }

      if (shouldRotate) {
        // Rotate immediately on visit
        const currentTheme = lastActive || "rose";
        const otherThemes = THEMES.filter((t) => t !== currentTheme);
        const randomTheme = otherThemes[Math.floor(Math.random() * otherThemes.length)];

        setActiveTheme(randomTheme);
        localStorage.setItem("theme_last_active", randomTheme);
        localStorage.setItem("theme_last_rotation_time", now.toString());
      } else {
        // Load the last active theme
        setActiveTheme(lastActive || "rose");
      }
    }

    setMounted(true);
  }, []);

  // Set up 1.5-minute rotation interval timer
  useEffect(() => {
    if (!mounted || isPreferenceSet) return;

    let timerId: NodeJS.Timeout;
    const rotationInterval = 1.5 * 60 * 1000; // 1.5 minutes

    const checkAndRotate = () => {
      const lastRotationTime = localStorage.getItem("theme_last_rotation_time");
      const lastActive = localStorage.getItem("theme_last_active") as Theme;
      const now = Date.now();

      let timeElapsed = 0;
      if (lastRotationTime) {
        timeElapsed = now - Number(lastRotationTime);
      }

      if (!lastRotationTime || timeElapsed >= rotationInterval) {
        // Pick another theme
        const currentTheme = lastActive || activeTheme;
        const otherThemes = THEMES.filter((t) => t !== currentTheme);
        const randomTheme = otherThemes[Math.floor(Math.random() * otherThemes.length)];

        setActiveTheme(randomTheme);
        localStorage.setItem("theme_last_active", randomTheme);
        localStorage.setItem("theme_last_rotation_time", now.toString());

        scheduleTimer(rotationInterval);
      } else {
        scheduleTimer(rotationInterval - timeElapsed);
      }
    };

    const scheduleTimer = (delayMs: number) => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        checkAndRotate();
      }, delayMs);
    };

    const lastRotationTime = localStorage.getItem("theme_last_rotation_time");
    const now = Date.now();

    let initialDelay = rotationInterval;
    if (lastRotationTime) {
      const timeElapsed = now - Number(lastRotationTime);
      if (timeElapsed < rotationInterval) {
        initialDelay = rotationInterval - timeElapsed;
      } else {
        initialDelay = 0;
      }
    } else {
      initialDelay = 0;
    }

    if (initialDelay === 0) {
      checkAndRotate();
    } else {
      scheduleTimer(initialDelay);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [mounted, isPreferenceSet, activeTheme]);

  // Update data-theme and data-appearance attribute on <html>
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", activeTheme);
      document.documentElement.setAttribute("data-appearance", appearance);
      
      const timer = setTimeout(() => {
        document.documentElement.classList.remove("no-transitions");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTheme, appearance, mounted]);

  const setTheme = (theme: Theme) => {
    setActiveTheme(theme);
    setIsPreferenceSet(true);
    localStorage.setItem("theme_choice", theme);
    localStorage.setItem("theme_last_active", theme);
    localStorage.setItem("theme_preference_set", "true");
  };

  const setAppearance = (newAppearance: Appearance) => {
    setAppearanceState(newAppearance);
    localStorage.setItem("appearance_choice", newAppearance);
  };

  const toggleAppearance = () => {
    const newAppearance = appearance === "dark" ? "light" : "dark";
    setAppearance(newAppearance);
  };

  const resetToRotation = () => {
    setIsPreferenceSet(false);
    localStorage.removeItem("theme_choice");
    localStorage.removeItem("theme_preference_set");

    // Pick a new one immediately for feedback, update last active and rotation timestamp
    const otherThemes = THEMES.filter((t) => t !== activeTheme);
    const randomTheme = otherThemes[Math.floor(Math.random() * otherThemes.length)];

    setActiveTheme(randomTheme);
    localStorage.setItem("theme_last_active", randomTheme);
    localStorage.setItem("theme_last_rotation_time", Date.now().toString());
  };

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        isPreferenceSet,
        appearance,
        setTheme,
        setAppearance,
        toggleAppearance,
        resetToRotation,
      }}
    >
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
