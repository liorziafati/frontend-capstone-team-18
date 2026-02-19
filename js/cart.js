document.addEventListener("DOMContentLoaded", () => {

  const data = localStorage.getItem("olm_last_search");

  const emptyCart = document.getElementById("emptyCart");
  const cartContent = document.getElementById("cartContent");

  if(!data){
    emptyCart.style.display = "block";
    return;
  }

  emptyCart.style.display = "none";
  cartContent.hidden = false;

  const parts = data.split("|");

  document.getElementById("cartCity").textContent =
    parts[0];

  document.getElementById("cartCheckin").textContent =
    parts[1].split("→")[0];

  document.getElementById("cartCheckout").textContent =
    parts[1].split("→")[1];

  document.getElementById("cartGuests").textContent =
    parts[2];

});


document.getElementById("clearCartBtn").onclick = () => {

  localStorage.removeItem("olm_last_search");

  location.reload();

};