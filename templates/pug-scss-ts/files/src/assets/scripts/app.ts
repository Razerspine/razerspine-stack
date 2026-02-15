import { ConsoleLogger, ThemeService } from "@razerspine/starter-core-scripts";

(function () {
  const logger = new ConsoleLogger();
  logger.success("app.ts successfully initialized and is now active!");

  // Theme Service Demo

  const themeService = new ThemeService();
  themeService.init();

  document.addEventListener("DOMContentLoaded", () => {
    const switcher = document.getElementById("themeSwitcher");

    if (!switcher) return;
    const initial =
      themeService.getTheme() ||
      document.documentElement.getAttribute("data-theme") ||
      "light";
    const iconSelector = ".button-icon use";

    const setIcon = (theme: string) => {
      const useEl = switcher.querySelector(iconSelector);
      if (!useEl) return;
      const id = theme === "dark" ? "#icon-light-mode" : "#icon-dark-mode";
      try {
        useEl.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", id);
        useEl.setAttribute("href", id);
      } catch {}
    };

    setIcon(initial);
    switcher.setAttribute(
      "aria-pressed",
      initial === "dark" ? "true" : "false",
    );

    switcher.addEventListener("click", () => {
      const now = themeService.getTheme() || "light";
      const next = now === "dark" ? "light" : "dark";
      themeService.setTheme(next);
      setIcon(next);
      switcher.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
    });
  });
})();
