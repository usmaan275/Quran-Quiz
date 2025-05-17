// src/hooks/Viewport.js
import { useEffect } from "react";

export const useFix100vh = () => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh(); // Set initially
    window.addEventListener("resize", setVh);

    return () => window.removeEventListener("resize", setVh);
  }, []);
};
