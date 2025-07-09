let panier = JSON.parse(localStorage.getItem('panier')) || [];

function majNbItems() {
  const totalArticles = panier.reduce((acc, item) => acc + item.quantite, 0);
  document.getElementById('nb-items').textContent = totalArticles;
}

function afficherPanier() {
  const liste = document.getElementById('liste-panier');
  liste.innerHTML = '';
  let total = 0;

  panier.forEach((item, index) => {
    total += item.prix;
    const li = document.createElement('li');
    li.innerHTML = `${item.nom} (${item.taille}, ${item.personnalisation}) x${item.quantite} - ${item.prix.toFixed(2)} $ 
      <button class="btn-supprimer" data-index="${index}" title="Supprimer">🗑️</button>`;
    liste.appendChild(li);
  });

  document.getElementById('total').textContent = total.toFixed(2);
  majNbItems();

  document.querySelectorAll('.btn-supprimer').forEach(btn => {
    btn.onclick = e => {
      const i = parseInt(e.target.dataset.index);
      panier.splice(i, 1);
      localStorage.setItem('panier', JSON.stringify(panier));
      afficherPanier();
    };
  });
}

document.getElementById('btn-panier').addEventListener('click', () => {
  document.getElementById('sidebar-panier').classList.toggle('open');
});
document.getElementById('btn-fermer-panier').addEventListener('click', () => {
  document.getElementById('sidebar-panier').classList.remove('open');
});

document.getElementById('vider-panier').addEventListener('click', () => {
  if (confirm("Es-tu sûr(e) de vouloir vider ton panier ?")) {
    panier = [];
    localStorage.setItem('panier', JSON.stringify(panier));
    afficherPanier();
  }
});

document.getElementById('payer').addEventListener('click', () => {
  window.location.href = 'confirmation.html';
});

const params = new URLSearchParams(window.location.search);
const idProduit = params.get('id');

fetch('produits.json')
  .then(res => res.json())
  .then(produits => {
    if (!idProduit || !produits[idProduit]) {
      document.getElementById('fiche-produit').innerHTML = '<p>Produit introuvable.</p>';
      return;
    }

    const produit = produits[idProduit];
    const div = document.getElementById('fiche-produit');
    div.innerHTML = `
      <img src="${produit.image}" alt="${produit.nom}" />
      <h2>${produit.nom}</h2>
      <p><strong>${produit.prix.toFixed(2)} $</strong></p>

      <label for="taille">Choisis une grandeur :</label><br>
      <select id="taille">
        <option value="">-- Sélectionner --</option>
        <option value="X-Small">X-Small</option>
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
        <option value="X-Large">X-Large</option>
      </select><br><br>

      <label for="perso">Personnalisation :</label><br>
      <select id="perso">
        <option value="">-- Sélectionner --</option>
        <option value="Aucune|0">Aucune (0$)</option>
        <option value="Broderie NOM|7">Broderie NOM (+7.00 $)</option>
        <option value="Broderie NUMÉRO|5.5">Broderie NUMÉRO (+5.50 $)</option>
        <option value="Broderie NOM et NUMÉRO|10">Broderie NOM et NUMÉRO (+10.00 $)</option>
      </select><br><br>

      <label for="quantite">Quantité :</label><br>
      <input type="number" id="quantite" name="quantite" min="1" value="1" style="width: 60px; padding: 0.3rem; border-radius: 6px; border: 1px solid #ccc;" /><br><br>

      <button id="ajouter-panier" class="btn-ajouter" disabled>Ajouter au panier</button><br>
      <button class="btn-retour" onclick="window.location.href='index.html'">← Retour à l'accueil</button>
    `;

    const selectTaille = document.getElementById('taille');
    const selectPerso = document.getElementById('perso');
    const inputQuantite = document.getElementById('quantite');
    const boutonAjouter = document.getElementById('ajouter-panier');

    function checkReady() {
      const qte = parseInt(inputQuantite.value);
      boutonAjouter.disabled = (selectTaille.value === '' || selectPerso.value === '' || !qte || qte < 1);
    }

    selectTaille.addEventListener('change', checkReady);
    selectPerso.addEventListener('change', checkReady);
    inputQuantite.addEventListener('input', checkReady);

    boutonAjouter.addEventListener('click', () => {
      const taille = selectTaille.value;
      const [persoText, persoPrix] = selectPerso.value.split('|');
      const quantite = parseInt(inputQuantite.value);
      const prixUnitaire = produit.prix + parseFloat(persoPrix);
      const prixFinal = prixUnitaire * quantite;

      panier.push({
        nom: produit.nom,
        prix: prixFinal,
        taille: taille,
        personnalisation: persoText,
        quantite: quantite,
        prixUnitaire: prixUnitaire
      });

      localStorage.setItem('panier', JSON.stringify(panier));
      afficherPanier();
      majNbItems();

      // Effet bouton “Ajouté !”
      boutonAjouter.textContent = '✔️ Ajouté !';
      boutonAjouter.disabled = true;
      setTimeout(() => {
        boutonAjouter.textContent = 'Ajouter au panier';
        boutonAjouter.disabled = false;
      }, 1200);
    });

    checkReady(); // Pour initialiser l’état du bouton
    afficherPanier();
    majNbItems();
  });

// Init au chargement
afficherPanier();
majNbItems();
