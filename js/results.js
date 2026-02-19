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

document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".card-hotel"));
  const resultsCount = document.getElementById("resultsCount");

  const btnApply = document.getElementById("applyFilters");
  const btnClear = document.getElementById("clearFilters");

  const cbBreakfast = document.getElementById("fBreakfast");
  const cbParking = document.getElementById("fParking");
  const cbSpa = document.getElementById("fSpa");
  const cbPool = document.getElementById("fPool");

  // כוכבים לפי כפתורים שלך
  // תוודאי שלכל כוכב יש data-star
  const starButtons = Array.from(document.querySelectorAll("#filtersOffcanvas .star"));
  let minStars = 0;

  starButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      minStars = Number(btn.dataset.star || 0);

      // צביעה ויזואלית
      starButtons.forEach(b => {
        const s = Number(b.dataset.star || 0);
        b.classList.toggle("is-on", s <= minStars);
      });
    });
  });

  function applyFilters() {
    const needBreakfast = cbBreakfast?.checked;
    const needParking = cbParking?.checked;
    const needSpa = cbSpa?.checked;
    const needPool = cbPool?.checked;

    let visible = 0;

    cards.forEach(card => {
      const stars = Number(card.dataset.stars || 0);

      const okStars = stars >= minStars;

      const okBreakfast = !needBreakfast || card.dataset.breakfast === "1";
      const okParking = !needParking || card.dataset.parking === "1";
      const okSpa = !needSpa || card.dataset.spa === "1";
      const okPool = !needPool || card.dataset.pool === "1";

      const show = okStars && okBreakfast && okParking && okSpa && okPool;

      // מסתיר את העמודה של bootstrap ולא רק את ה article
      const col = card.closest("[class*='col-']") || card;
      col.style.display = show ? "" : "none";

      if (show) visible++;
    });

    if (resultsCount) resultsCount.textContent = `מצאנו ${visible} מלונות מתאימים`;
  }

  function clearFilters() {
    minStars = 0;
    if (cbBreakfast) cbBreakfast.checked = false;
    if (cbParking) cbParking.checked = false;
    if (cbSpa) cbSpa.checked = false;
    if (cbPool) cbPool.checked = false;

    starButtons.forEach(b => b.classList.remove("is-on"));
    applyFilters();
  }

  btnApply?.addEventListener("click", applyFilters);
  btnClear?.addEventListener("click", clearFilters);

  // מצב התחלתי
  applyFilters();
});
