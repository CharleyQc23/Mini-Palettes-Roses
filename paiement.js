const stripe = Stripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"); // remplace avec ta clé publique

document.getElementById("checkout-button").addEventListener("click", () => {
  fetch("/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ panier: JSON.parse(localStorage.getItem('panier')) })
  })
  .then(res => res.json())
  .then(data => {
    return stripe.redirectToCheckout({ sessionId: data.id });
  })
  .catch(err => console.error(err));
});
