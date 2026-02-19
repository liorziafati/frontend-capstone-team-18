document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ home.js loaded");

  const form = document.getElementById("searchForm");
  const city = document.getElementById("city");
  const suggestBox = document.getElementById("citySuggest");

  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");
  const nightsInfo = document.getElementById("nightsInfo");
  const formError = document.getElementById("formError");
  const successMsg = document.getElementById("successMsg");

  const guestsBtn = document.getElementById("guestsBtn");
  const guestsPanel = document.getElementById("guestsPanel");
  const closeGuests = document.getElementById("closeGuests");
  const guestsSummary = document.getElementById("guestsSummary");

  const adultsInput = document.getElementById("adults");
  const childrenInput = document.getElementById("children");
  const roomsInput = document.getElementById("rooms");

  const adultsVal = document.getElementById("adultsVal");
  const childrenVal = document.getElementById("childrenVal");
  const roomsVal = document.getElementById("roomsVal");

  if (!form || !city || !suggestBox || !checkin || !checkout || !guestsBtn || !guestsPanel) {
    console.log("❌ Missing elements. Check IDs in HTML.");
    return;
  }

  // ================== תאריכים - חסימת עבר (תיקון UTC) ==================
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // YYYY-MM-DD לפי זמן מקומי (לא UTC)
  const todayStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  checkin.min = todayStr;
  checkout.min = todayStr;

  // ================== יעד - Autocomplete ==================
  const destinations = [
    "קוסמוי, תאילנד",
    "קופנגן, תאילנד",
    "קוס, יוון",
    "פוקט, תאילנד",
    "בנגקוק, תאילנד",
    "דובאי, איחוד האמירויות",
    "רומא, איטליה",
    "פריז, צרפת",
    "לונדון, אנגליה",
    "ברצלונה, ספרד",
    "אתונה, יוון",
    "מיקונוס, יוון",
    "סנטוריני, יוון",
    "תל אביב, ישראל",
    "ירושלים, ישראל",
    "אילת, ישראל",
    "חיפה, ישראל"
  ];

  function closeSuggest() {
    suggestBox.hidden = true;
    suggestBox.innerHTML = "";
    city.setAttribute("aria-expanded", "false");
  }

  function openSuggest() {
    suggestBox.hidden = false;
    city.setAttribute("aria-expanded", "true");
  }

  function getMatches(q) {
    const query = q.trim().toLowerCase();
    return destinations.filter((d) => d.toLowerCase().includes(query));
  }

  function renderSuggest(list) {
    suggestBox.innerHTML = "";

    if (list.length === 0) {
      closeSuggest();
      return;
    }

    list.slice(0, 6).forEach((name) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "suggest-item";
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-label", `בחר יעד ${name}`);
      btn.textContent = name;

      btn.addEventListener("mousedown", (e) => {
        e.preventDefault(); // כדי שיעבוד לפני blur
        city.value = name;
        closeSuggest();
        city.focus();
      });

      suggestBox.appendChild(btn);
    });

    openSuggest();
  }

  city.addEventListener("input", () => {
    const q = city.value.trim();
    if (q.length < 2) return closeSuggest();
    renderSuggest(getMatches(q));
  });

  city.addEventListener("focus", () => {
    const q = city.value.trim();
    if (q.length >= 2) renderSuggest(getMatches(q));
  });

  city.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSuggest();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".field-suggest")) closeSuggest();
  });

  // ================== אורחים - Dropdown ==================
  function setGuestsSummary() {
    const a = Number(adultsInput.value);
    const c = Number(childrenInput.value);
    const r = Number(roomsInput.value);
    guestsSummary.textContent = `מבוגר ${a} • ילדים ${c} • חדר ${r}`;
  }

  function syncGuestUI() {
    adultsVal.textContent = adultsInput.value;
    childrenVal.textContent = childrenInput.value;
    roomsVal.textContent = roomsInput.value;

    document
      .querySelectorAll('.step-btn[data-field="adults"][data-delta="-1"]')
      .forEach((b) => (b.disabled = Number(adultsInput.value) <= 1));

    document
      .querySelectorAll('.step-btn[data-field="rooms"][data-delta="-1"]')
      .forEach((b) => (b.disabled = Number(roomsInput.value) <= 1));

    document
      .querySelectorAll('.step-btn[data-field="children"][data-delta="-1"]')
      .forEach((b) => (b.disabled = Number(childrenInput.value) <= 0));

    setGuestsSummary();
  }

  function openGuests() {
    guestsPanel.hidden = false;
    guestsBtn.setAttribute("aria-expanded", "true");
  }

  function closeGuestsPanel() {
    guestsPanel.hidden = true;
    guestsBtn.setAttribute("aria-expanded", "false");
  }

  guestsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (guestsPanel.hidden) openGuests();
    else closeGuestsPanel();
  });

  if (closeGuests) {
    closeGuests.addEventListener("click", (e) => {
      e.stopPropagation();
      closeGuestsPanel();
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".field-guests")) closeGuestsPanel();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeGuestsPanel();
  });

  document.querySelectorAll(".step-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const field = btn.dataset.field;
      const delta = Number(btn.dataset.delta);

      const input =
        field === "adults" ? adultsInput :
        field === "children" ? childrenInput :
        roomsInput;

      let val = Number(input.value) + delta;

      if (field === "adults" || field === "rooms") val = Math.max(1, val);
      if (field === "children") val = Math.max(0, val);

      input.value = String(val);
      syncGuestUI();
    });
  });

  syncGuestUI();

  // ================== תאריכים - אכיפה + לילות ==================
  function enforceDates() {
    const inVal = checkin.value;
    const outVal = checkout.value;

    // תמיד לא מאפשרים לבחור checkout לפני checkin
    if (inVal) {
      checkout.min = inVal;

      if (outVal && outVal < inVal) {
        checkout.value = "";
      }
    } else {
      checkout.min = todayStr;
    }

    // חישוב לילות
    if (!checkin.value || !checkout.value) {
      nightsInfo.textContent = "";
      return;
    }

    const inDate = new Date(checkin.value);
    const outDate = new Date(checkout.value);
    const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    nightsInfo.textContent = diff > 0 ? `${diff} לילות` : "";
  }

  checkin.addEventListener("change", enforceDates);
  checkout.addEventListener("change", enforceDates);

  // להפעיל פעם אחת בהתחלה
  enforceDates();

  // ================== Submit ==================
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formError.textContent = "";
    successMsg.textContent = "";

    const cityVal = city.value.trim();
    if (cityVal.length < 2) {
      formError.textContent = "אנא הזיני יעד.";
      city.focus();
      return;
    }

    if (!checkin.value || !checkout.value) {
      formError.textContent = "אנא בחרי תאריכים.";
      return;
    }

    if (checkout.value < checkin.value) {
      formError.textContent = "תאריך העזיבה חייב להיות אחרי ההגעה.";
      checkout.focus();
      return;
    }

    const summary =
      `${cityVal} | ${checkin.value} → ${checkout.value} | ` +
      `מבוגרים: ${adultsInput.value}, ילדים: ${childrenInput.value}, חדרים: ${roomsInput.value}`;

    localStorage.setItem("olm_last_search", summary);
    successMsg.textContent = "מחפש מלונות...";
  });
});