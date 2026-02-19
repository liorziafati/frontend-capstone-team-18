document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("modeBtn");

  // טעינת מצב שמור
  const saved = localStorage.getItem("theme");

  if (saved === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  // אם אין כפתור בדף, עדיין עובד
  if (!btn) return;

  updateButtonText();

  btn.addEventListener("click", () => {

    const current =
      document.documentElement.getAttribute("data-theme");

    if (current === "light") {

      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");

    } else {

      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");

    }

    updateButtonText();

  });

  function updateButtonText() {

    const current =
      document.documentElement.getAttribute("data-theme");

    if (current === "light") {
      btn.textContent = "מצב כהה";
    } else {
      btn.textContent = "מצב בהיר";
    }

  }

});