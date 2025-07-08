let panier = [];

function ajouterAuPanier(nom, prix) {
  panier.push({ nom, prix });
  afficherPanier();
}

function afficherPanier() {
  const liste = document.getElementById('liste-panier');
  liste.innerHTML = '';
  let total = 0;
  panier.forEach((item) => {
    total += item.prix;
    const li = document.createElement('li');
    li.textContent = `${item.nom} - ${item.prix.toFixed(2)} $`;
    liste.appendChild(li);
  });
  document.getElementById('total').textContent = total.toFixed(2);
}

function payer() {
  alert("Paiement non encore intégré. Tu pourras connecter Stripe ici bientôt !");
}

window.addEventListener('DOMContentLoaded', () => {
  fetch('produits.html')
    .then(response => response.text())
    .then(html => {
      const galerie = document.getElementById('galerie-produits');
      galerie.innerHTML = html;

      // ➕ Crée dynamiquement les boutons pour chaque produit
      document.querySelectorAll('.produit').forEach(produit => {
        const nom = produit.dataset.nom;
        const prix = parseFloat(produit.dataset.prix);

        const bouton = document.createElement('button');
        bouton.textContent = "Ajouter au panier";
        bouton.className = "btn-ajouter";
        bouton.addEventListener('click', () => ajouterAuPanier(nom, prix));

        produit.appendChild(bouton);
      });
    });
});
