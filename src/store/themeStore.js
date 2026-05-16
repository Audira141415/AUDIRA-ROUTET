"use client";

import { create } from "zustand";

const useThemeStore = create(() => ({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
  initTheme: () => {},
}));

export default useThemeStore;
