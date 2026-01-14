import { useEffect, useState } from "react";

export default function useTheme() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return { darkMode, toggleTheme };
}
