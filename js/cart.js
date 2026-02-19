document.addEventListener("DOMContentLoaded", () => {
  const data = localStorage.getItem("olm_last_search");

  const emptyCart = document.getElementById("emptyCart");
  const cartContent = document.getElementById("cartContent");

  const clearBtn = document.getElementById("clearCartBtn");
  const payBtn = document.getElementById("payBtn");
  const payBtn2 = document.getElementById("payBtn2");

  // ------- דמו של מלון נבחר (עד שנחבר לעמוד של החברה) -------
  // אפשר לשנות את הערכים האלה חופשי
  const selectedHotel = {
    name: "Sea View Hotel",
    meta: "קרוב לים • דירוג 4.6",
    nightly: 650,
    img: "./images/hotel-placeholder.jpg" // שימי תמונה אמיתית כשיהיה
  };

  // אלמנטים להצגה
  const hotelImg = document.getElementById("hotelImg");
  const hotelName = document.getElementById("hotelName");
  const hotelMeta = document.getElementById("hotelMeta");
  const nightlyPrice = document.getElementById("nightlyPrice");
  const totalPrice = document.getElementById("totalPrice");
  const nightsEl = document.getElementById("nights");

  const cartCity = document.getElementById("cartCity");
  const cartCheckin = document.getElementById("cartCheckin");
  const cartCheckout = document.getElementById("cartCheckout");
  const cartGuests = document.getElementById("cartGuests");

  const summaryHotel = document.getElementById("summaryHotel");
  const summaryNights = document.getElementById("summaryNights");
  const summaryNightly = document.getElementById("summaryNightly");
  const summaryTotal = document.getElementById("summaryTotal");

  function showEmpty() {
    emptyCart.hidden = false;
    cartContent.hidden = true;
  }

  function showContent() {
    emptyCart.hidden = true;
    cartContent.hidden = false;
  }

  function formatILS(num) {
    return `₪${Number(num).toLocaleString("he-IL")}`;
  }

  function calcNights(checkinStr, checkoutStr) {
    const inDate = new Date(checkinStr);
    const outDate = new Date(checkoutStr);
    const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }

  // אם אין כלום בעגלה
  if (!data) {
    showEmpty();
    return;
  }

  showContent();

  // ------- הצגת מלון דמו -------
  hotelImg.src = selectedHotel.img;
  hotelName.textContent = selectedHotel.name;
  hotelMeta.textContent = selectedHotel.meta;
  nightlyPrice.textContent = formatILS(selectedHotel.nightly);

  // ------- פירוק החיפוש מה-home -------
  // פורמט שמור אצלך: "עיר | YYYY-MM-DD → YYYY-MM-DD | מבוגרים: X, ילדים: Y, חדרים: Z"
  const parts = data.split("|").map(s => s.trim());
  const city = parts[0] || "—";

  const datesPart = parts[1] || "";
  const inOut = datesPart.split("→").map(s => s.trim());
  const checkin = inOut[0] || "";
  const checkout = inOut[1] || "";

  const guestsPart = parts[2] || "—";

  cartCity.textContent = city;
  cartCheckin.textContent = checkin || "—";
  cartCheckout.textContent = checkout || "—";
  cartGuests.textContent = guestsPart;

  // ------- חישוב לילות + מחיר -------
  const nights = (checkin && checkout) ? calcNights(checkin, checkout) : 0;
  nightsEl.textContent = nights ? `${nights} לילות` : "—";

  const total = nights ? nights * selectedHotel.nightly : 0;
  totalPrice.textContent = formatILS(total);

  // ------- סיכום צד -------
  summaryHotel.textContent = selectedHotel.name;
  summaryNights.textContent = nights ? `${nights}` : "—";
  summaryNightly.textContent = formatILS(selectedHotel.nightly);
  summaryTotal.textContent = formatILS(total);

  // ------- פעולות -------
  clearBtn?.addEventListener("click", () => {
    localStorage.removeItem("olm_last_search");
    location.reload();
  });

  function goToPayment() {
    // כאן בעתיד נעביר לעמוד payment.html או למסך תשלום אמיתי
    alert("דמו: מעבר לתשלום. בהמשך נחבר לעמוד תשלום אמיתי 🙂");
  }

  payBtn?.addEventListener("click", goToPayment);
  payBtn2?.addEventListener("click", goToPayment);
});