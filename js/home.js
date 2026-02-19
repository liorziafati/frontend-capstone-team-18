document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ home.js loaded");


  // ========= ELEMENTS =========
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

  // אם חסרים אלמנטים קריטיים – לא להפיל את כל העמוד
  if (!form || !city || !checkin || !checkout) {
    console.log("❌ Missing critical elements (form/city/checkin/checkout). Check IDs in HTML.");
    return;
  }

  // ========= DATES (no past, local timezone) =========
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const todayStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  checkin.min = todayStr;
  checkout.min = todayStr;

  function enforceDates() {
    const inVal = checkin.value;
    const outVal = checkout.value;

    if (inVal) {
      // מינימום לעזיבה = יום אחרי ההגעה
const inDateObj = new Date(inVal);
inDateObj.setDate(inDateObj.getDate() + 1);
const minCheckout = new Date(inDateObj.getTime() - inDateObj.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];

checkout.min = minCheckout;

if (outVal && outVal < minCheckout) checkout.value = "";
    } else {
      checkout.min = todayStr;
    }

    if (!checkin.value || !checkout.value) {
      if (nightsInfo) nightsInfo.textContent = "";
      return;
    }

    const inDate = new Date(checkin.value);
    const outDate = new Date(checkout.value);
    const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    if (nightsInfo) nightsInfo.textContent = diff > 0 ? `${diff} לילות` : "";
  }

  checkin.addEventListener("change", enforceDates);
  checkout.addEventListener("change", enforceDates);
  enforceDates();

  // ========= AUTOCOMPLETE =========
  if (!suggestBox) {
  console.log("ℹ️ No suggestBox (#citySuggest). Autocomplete disabled.");}
  else {
  const destinations = [
    "קוסמוי, תאילנד","קופנגן, תאילנד","קוס, יוון","פוקט, תאילנד","בנגקוק, תאילנד",
    "דובאי, איחוד האמירויות","רומא, איטליה","פריז, צרפת","לונדון, אנגליה","ברצלונה, ספרד",
    "אתונה, יוון","מיקונוס, יוון","סנטוריני, יוון","תל אביב, ישראל","ירושלים, ישראל","אילת, ישראל","חיפה, ישראל"
  ];

  function closeSuggest() {
    if (!suggestBox) return;
    suggestBox.hidden = true;
    suggestBox.innerHTML = "";
    city.setAttribute("aria-expanded", "false");
  }

  function openSuggest() {
    if (!suggestBox) return;
    suggestBox.hidden = false;
    city.setAttribute("aria-expanded", "true");
  }

  function getMatches(q) {
    const query = q.trim().toLowerCase();
    return destinations.filter((d) => d.toLowerCase().includes(query));
  }

  function renderSuggest(list) {
    if (!suggestBox) return;
    suggestBox.innerHTML = "";
    if (list.length === 0) return closeSuggest();

    list.slice(0, 6).forEach((name) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "suggest-item";
      btn.setAttribute("role", "option");
      btn.textContent = name;

      btn.addEventListener("mousedown", (e) => {
        e.preventDefault();
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
  }

  // ========= GUESTS DROPDOWN =========
  function setGuestsSummary() {
    if (!guestsSummary || !adultsInput || !childrenInput || !roomsInput) return;
    guestsSummary.textContent =
      `מבוגר ${adultsInput.value} • ילדים ${childrenInput.value} • חדר ${roomsInput.value}`;
  }

  function syncGuestUI() {
    if (!adultsInput || !childrenInput || !roomsInput) return;
    if (adultsVal) adultsVal.textContent = adultsInput.value;
    if (childrenVal) childrenVal.textContent = childrenInput.value;
    if (roomsVal) roomsVal.textContent = roomsInput.value;

    setGuestsSummary();
  }

  function openGuests() {
    if (!guestsPanel || !guestsBtn) return;
    guestsPanel.hidden = false;
    guestsBtn.setAttribute("aria-expanded", "true");
  }

  function closeGuestsPanel() {
    if (!guestsPanel || !guestsBtn) return;
    guestsPanel.hidden = true;
    guestsBtn.setAttribute("aria-expanded", "false");
  }

  if (guestsBtn && guestsPanel) {
    guestsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      guestsPanel.hidden ? openGuests() : closeGuestsPanel();
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
        if (!adultsInput || !childrenInput || !roomsInput) return;

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
  }

  // ========= SUBMIT =========
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (formError) formError.textContent = "";
    if (successMsg) successMsg.textContent = "";

    const cityVal = city.value.trim();
    if (cityVal.length < 2) {
      if (formError) formError.textContent = "אנא הזיני יעד.";
      city.focus();
      return;
    }

    if (!checkin.value || !checkout.value) {
      if (formError) formError.textContent = "אנא בחרי תאריכים.";
      return;
    }

    if (checkout.value <= checkin.value) {
      if (formError) formError.textContent = "תאריך העזיבה חייב להיות אחרי ההגעה.";
      checkout.focus();
      return;
    }

    const adults = adultsInput ? adultsInput.value : "1";
    const children = childrenInput ? childrenInput.value : "0";
    const rooms = roomsInput ? roomsInput.value : "1";

    const summary =
      `${cityVal} | ${checkin.value} → ${checkout.value} | מבוגרים:${adults}, ילדים:${children}, חדרים:${rooms}`;
    localStorage.setItem("olm_last_search", summary);

    const params = new URLSearchParams({
      city: cityVal,
      checkin: checkin.value,
      checkout: checkout.value,
      adults,
      children,
      rooms
    });

    window.location.href = `results.html?${params.toString()}`;
  });
});