document.addEventListener("DOMContentLoaded", () => {
  // ===== Stars UI (כוכבים) =====
  const starsBtns = Array.from(document.querySelectorAll(".stars-filter .star"));
  const starsHidden = document.getElementById("starsValue");

  const paintStars = (value) => {
    starsBtns.forEach((btn) => {
      const v = Number(btn.dataset.value);
      btn.textContent = v <= value ? "★" : "☆";
      btn.classList.toggle("is-on", v <= value);
    });
  };

  if (starsBtns.length && starsHidden) {
    starsBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const clicked = Number(btn.dataset.value);
        const current = Number(starsHidden.value || 0);
        const next = clicked === current ? 0 : clicked; // לחיצה שוב מבטלת
        starsHidden.value = String(next);
        paintStars(next);
      });
    });

    paintStars(Number(starsHidden.value || 0));
  }

  // ===== Filters (סינון אמיתי) =====
  const cards = Array.from(document.querySelectorAll(".card-hotel"));

  const btnApply = document.getElementById("applyFilters");
  const btnClear = document.getElementById("clearFilters");

  const cbBreakfast = document.getElementById("cbBreakfast");
  const cbParking = document.getElementById("cbParking");
  const cbSpa = document.getElementById("cbSpa");
  const cbFreeCancel = document.getElementById("cbFreeCancel");

  function applyFilters() {
    const grid = document.getElementById("hotelsGrid");
    const minStars = Number(starsHidden?.value || 0);

    const needBreakfast = !!cbBreakfast?.checked;
    const needParking = !!cbParking?.checked;
    const needSpa = !!cbSpa?.checked;
    const needFreeCancel = !!cbFreeCancel?.checked;

    let visible = 0;

    cards.forEach((card) => {
      const stars = Number(card.dataset.stars || 0);

      const okStars = minStars === 0 || stars >= minStars;

      const okBreakfast = !needBreakfast || card.dataset.breakfast === "1";
      const okParking = !needParking || card.dataset.parking === "1";
      const okSpa = !needSpa || card.dataset.spa === "1";
      const okFreeCancel = !needFreeCancel || card.dataset.freecancel === "1";

      const show = okStars && okBreakfast && okParking && okSpa && okFreeCancel;

      // מסתירים את העמודה שמכילה את הכרטיס (Bootstrap col)
      const col = card.closest("[class*='col-']") || card;
      col.style.display = show ? "" : "none";

      if (show) visible++;
    });

    // אם יש לך מקום שמציג את כמות התוצאות, תני לו id="resultsCount"
    const resultsCount = document.getElementById("resultsCount");
    if (resultsCount) resultsCount.textContent = `מצאנו ${visible} מלונות מתאימים`;

    // סוגר את ה־offcanvas אחרי "החל סינון"
    const offcanvasEl = document.getElementById("filtersOffcanvas");
    if (offcanvasEl && window.bootstrap) {
      const instance = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
      instance?.hide();
    }
  }

  function clearFilters() {
    if (starsHidden) starsHidden.value = "0";
    paintStars(0);

    if (cbBreakfast) cbBreakfast.checked = false;
    if (cbParking) cbParking.checked = false;
    if (cbSpa) cbSpa.checked = false;
    if (cbFreeCancel) cbFreeCancel.checked = false;

    applyFilters();
  }

  btnApply?.addEventListener("click", applyFilters);
  btnClear?.addEventListener("click", clearFilters);

  // מצב התחלתי (מראה הכל)
  applyFilters();
});
