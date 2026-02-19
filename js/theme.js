(() => {
  // קובע theme הכי מוקדם שאפשר
  const saved = localStorage.getItem("olm_theme");
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const initial = saved || (prefersLight ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", initial);
})();

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("modeBtn");
  if (!btn) return;

  function setBtnText(theme) {
    btn.textContent = theme === "light" ? "מצב כהה" : "מצב בהיר";
  }

  const current = document.documentElement.getAttribute("data-theme") || "dark";
  setBtnText(current);

  btn.addEventListener("click", () => {
    const now = document.documentElement.getAttribute("data-theme") || "dark";
    const next = now === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("olm_theme", next);
    setBtnText(next);
  });
});