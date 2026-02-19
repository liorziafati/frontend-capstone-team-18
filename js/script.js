document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".stars-filter .star");
  const hidden = document.getElementById("starsValue");
  if (!stars.length || !hidden) return;

  const paint = (value) => {
    stars.forEach((btn) => {
      const v = Number(btn.dataset.value);
      btn.textContent = v <= value ? "★" : "☆";
      btn.classList.toggle("active", v <= value);
    });
  };

  stars.forEach((btn) => {
    btn.addEventListener("click", () => {
      const clicked = Number(btn.dataset.value);
      const current = Number(hidden.value);

      const next = (clicked === current) ? 0 : clicked; // לחיצה על אותו כוכב מבטלת
      hidden.value = String(next);
      paint(next);
    });
  });

  paint(Number(hidden.value));
});

