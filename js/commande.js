// Système de commande
document.addEventListener('DOMContentLoaded', function() {
    // Charger le panier
    const panier = JSON.parse(localStorage.getItem('panier-atelier-enseigne')) || [];
    
    // Éléments DOM
    const recapItems = document.getElementById('recapItems');
    const sousTotalEl = document.getElementById('sousTotal');
    const tvaPrixEl = document.getElementById('tvaPrix');
    const totalTTCEl = document.getElementById('totalTTC');
    const cartCount = document.querySelector('.cart-count');
    const continuerBtn = document.getElementById('continuerCommande');
    
    // Initialisation
    initCommande();
    
    function initCommande() {
        // Mettre à jour l'affichage du panier
        updateCartDisplay();
        
        // Afficher les articles
        displayRecapItems();
        
        // Calculer les totaux
        updateTotals();
        
        // Gestion du code promo
        setupCoupon();
        
        // Gestion du formulaire
        setupForm();
    }
    
    function updateCartDisplay() {
        if (cartCount) {
            cartCount.textContent = panier.length;
        }
    }
    
    function displayRecapItems() {
        if (panier.length === 0) {
            recapItems.innerHTML = `
                <div class="empty-cart">
                    <p>Votre panier est vide</p>
                    <a href="boutique/index.html" class="btn-primary">Retour à la boutique</a>
                </div>
            `;
            return;
        }
        
        let html = '';
        panier.forEach((item, index) => {
            html += `
                <div class="recap-item">
                    <div class="item-info">
                        <h4>${getItemTitle(item)}</h4>
                        <p>${getItemDescription(item)}</p>
                        <p class="item-quantity">Quantité: ${item.configuration.quantite || 1}</p>
                    </div>
                    <div class="item-price">
                        ${item.prix}€ HT
                    </div>
                </div>
            `;
        });
        
        recapItems.innerHTML = html;
    }
    
    function getItemTitle(item) {
        switch(item.type) {
            case 'enseigne':
                return 'Enseigne personnalisée';
            case 'sticker':
                return 'Stickers personnalisés';
            case 'textile':
                return 'Textile personnalisé';
            default:
                return 'Produit personnalisé';
        }
    }
    
    function getItemDescription(item) {
        if (item.type === 'enseigne') {
            const config = item.configuration;
            const dimensions = config.dimensions === 'surmesure' 
                ? `${config.largeur}x${config.hauteur} cm` 
                : `${config.dimensions} cm`;
            
            return `Dimensions: ${dimensions}, Matériau: ${config.materiau}, Éclairage: ${config.eclairage}`;
        }
        return 'Produit sur mesure';
    }
    
    function updateTotals() {
        if (panier.length === 0) {
            sousTotalEl.textContent = '0€ HT';
            tvaPrixEl.textContent = '0€';
            totalTTCEl.textContent = '0€';
            return;
        }
        
        // Calcul du sous-total
        const sousTotal = panier.reduce((sum, item) => sum + item.prix, 0);
        const tva = sousTotal * 0.20; // 20% de TVA
        const totalTTC = sousTotal + tva;
        
        // Mettre à jour l'affichage
        sousTotalEl.textContent = `${sousTotal.toFixed(2)}€ HT`;
        tvaPrixEl.textContent = `${tva.toFixed(2)}€`;
        totalTTCEl.textContent = `${totalTTC.toFixed(2)}€`;
        
        return {
            sousTotal,
            tva,
            totalTTC
        };
    }
    
    function setupCoupon() {
        const applyBtn = document.getElementById('applyCoupon');
        const couponInput = document.getElementById('couponCode');
        
        if (applyBtn && couponInput) {
            applyBtn.addEventListener('click', function() {
                const code = couponInput.value.trim().toUpperCase();
                
                if (!code) {
                    alert('Veuillez entrer un code promo');
                    return;
                }
                
                // Codes promo valides (exemple)
                const validCoupons = {
                    'BIENVENUE10': 0.10, // 10% de réduction
                    'ETE2023': 0.15,     // 15% de réduction
                    'PROFESSIONNEL': 0.20 // 20% de réduction
                };
                
                if (validCoupons[code]) {
                    const reduction = validCoupons[code];
                    const totals = updateTotals();
                    
                    if (totals) {
                        const remise = totals.sousTotal * reduction;
                        const nouveauTotalTTC = totals.totalTTC - remise;
                        
                        // Ajouter une ligne de remise
                        const recapTotal = document.querySelector('.recap-total');
                        const existingRemise = document.querySelector('.remise-line');
                        
                        if (existingRemise) {
                            existingRemise.remove();
                        }
                        
                        const remiseLine = document.createElement('div');
                        remiseLine.className = 'total-line remise-line';
                        remiseLine.innerHTML = `
                            <span>Remise code promo</span>
                            <span>-${remise.toFixed(2)}€</span>
                        `;
                        
                        recapTotal.insertBefore(remiseLine, recapTotal.querySelector('.total-line.total'));
                        
                        // Mettre à jour le total TTC
                        totalTTCEl.textContent = `${nouveauTotalTTC.toFixed(2)}€`;
                        
                        alert(`Code promo appliqué ! Remise de ${reduction * 100}%`);
                    }
                } else {
                    alert('Code promo invalide');
                }
            });
        }
    }
    
    function setupForm() {
        const livraisonForm = document.getElementById('livraisonForm');
        
        if (livraisonForm) {
            // Validation du formulaire
            livraisonForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!validateForm()) {
                    alert('Veuillez remplir tous les champs obligatoires');
                    return;
                }
                
                // Passer à l'étape suivante
                goToNextStep();
            });
        }
        
        // Option d'adresse de facturation différente
        const facturationDiff = document.getElementById('facturation-different');
        if (facturationDiff) {
            facturationDiff.addEventListener('change', function() {
                const facturationSection = document.createElement('div');
                facturationSection.id = 'facturation-section';
                facturationSection.innerHTML = `
                    <h3>Adresse de facturation</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="fact-nom">Nom *</label>
                            <input type="text" id="fact-nom" required>
                        </div>
                        <div class="form-group">
                            <label for="fact-prenom">Prénom *</label>
                            <input type="text" id="fact-prenom" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="fact-adresse">Adresse *</label>
                        <input type="text" id="fact-adresse" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="fact-cp">Code postal *</label>
                            <input type="text" id="fact-cp" required>
                        </div>
                        <div class="form-group">
                            <label for="fact-ville">Ville *</label>
                            <input type="text" id="fact-ville" required>
                        </div>
                    </div>
                `;
                
                if (this.checked) {
                    const infoSection = document.querySelector('.info-section');
                    infoSection.appendChild(facturationSection);
                } else {
                    const existingSection = document.getElementById('facturation-section');
                    if (existingSection) {
                        existingSection.remove();
                    }
                }
            });
        }
    }
    
    function validateForm() {
        const requiredFields = [
            'nom', 'prenom', 'adresse', 'codePostal', 'ville', 'pays', 'telephone', 'email'
        ];
        
        for (const field of requiredFields) {
            const input = document.getElementById(field);
            if (!input || !input.value.trim()) {
                return false;
            }
        }
        
        // Validation email
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Veuillez entrer un email valide');
            return false;
        }
        
        // Validation téléphone
        const telephone = document.getElementById('telephone').value;
        const phoneRegex = /^[0-9\s\-\(\)\.]+$/;
        if (!phoneRegex.test(telephone) || telephone.replace(/\D/g, '').length < 10) {
            alert('Veuillez entrer un numéro de téléphone valide');
            return false;
        }
        
        return true;
    }
    
    function goToNextStep() {
        if (panier.length === 0) {
            alert('Votre panier est vide');
            return;
        }
        
        // Récupérer les informations du formulaire
        const commandeData = {
            client: {
                nom: document.getElementById('nom').value,
                prenom: document.getElementById('prenom').value,
                entreprise: document.getElementById('entreprise').value,
                adresse: document.getElementById('adresse').value,
                codePostal: document.getElementById('codePostal').value,
                ville: document.getElementById('ville').value,
                pays: document.getElementById('pays').value,
                telephone: document.getElementById('telephone').value,
                email: document.getElementById('email').value,
                instructions: document.getElementById('instructions').value
            },
            livraison: document.querySelector('input[name="livraison"]:checked').value,
            panier: panier,
            date: new Date().toISOString(),
            numero: 'CMD' + Date.now()
        };
        
        // Adresse de facturation différente
        if (document.getElementById('facturation-different').checked) {
            commandeData.facturation = {
                nom: document.getElementById('fact-nom').value,
                prenom: document.getElementById('fact-prenom').value,
                adresse: document.getElementById('fact-adresse').value,
                codePostal: document.getElementById('fact-cp').value,
                ville: document.getElementById('fact-ville').value
            };
        }
        
        // Sauvegarder la commande
        localStorage.setItem('commande-en-cours', JSON.stringify(commandeData));
        
        // Rediriger vers la page de paiement
        // Pour l'exemple, on affiche une confirmation
        showConfirmation(commandeData);
    }
    
    function showConfirmation(commandeData) {
        const modal = document.getElementById('confirmationModal');
        const content = document.getElementById('confirmationContent');
        
        if (modal && content) {
            content.innerHTML = `
                <div class="confirmation-success">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Commande confirmée !</h3>
                    <p>Numéro de commande: <strong>${commandeData.numero}</strong></p>
                    <p>Nous vous avons envoyé un email de confirmation à <strong>${commandeData.client.email}</strong></p>
                    <p>Votre commande sera traitée dans les plus brefs délais.</p>
                    
                    <div class="confirmation-actions">
                        <a href="index.html" class="btn-primary">Retour à l'accueil</a>
                        <a href="contact.html" class="btn-secondary">Nous contacter</a>
                    </div>
                </div>
            `;
            
            modal.style.display = 'block';
            
            // Vider le panier
            localStorage.removeItem('panier-atelier-enseigne');
            updateCartDisplay();
            
            // Fermer le modal
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.onclick = function() {
                modal.style.display = 'none';
                window.location.href = 'index.html';
            };
            
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                    window.location.href = 'index.html';
                }
            };
        }
    }
    
    // Bouton continuer
    if (continuerBtn) {
        continuerBtn.addEventListener('click', function() {
            if (panier.length === 0) {
                alert('Votre panier est vide');
                return;
            }
            
            // Valider le formulaire
            if (!validateForm()) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }
            
            goToNextStep();
        });
    }
});