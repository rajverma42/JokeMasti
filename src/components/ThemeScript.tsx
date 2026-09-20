// Runs before paint to avoid a flash of the wrong theme. Reads the same
// localStorage key that src/lib/storage.ts (getStoredTheme/setStoredTheme)
// uses, so this must stay in sync with the "jm:theme" key name there.
const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("jm:theme");
    var theme = stored === "light" || stored === "dark" ? stored : "system";
    var resolved = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;
    document.documentElement.setAttribute("data-theme", resolved);
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
