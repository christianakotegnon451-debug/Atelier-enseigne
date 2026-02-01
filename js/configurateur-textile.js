// Configurateur textile
document.addEventListener('DOMContentLoaded', function() {
    const configurateur = {
        currentStep: 1,
        configuration: {
            produit: 'tshirt',
            couleur: 'blanc',
            tailles: {},
            design: null,
            position: 'poitrine-gauche',
            tailleDesign: 10,
            technique: 'flocage',
            options: []
        },
        
        produits: {
            tshirt: {
                nom: 'T-shirt Basic',
                prix: 12,
                couleurs: [
                    { id: 'blanc', nom: 'Blanc', code: '#ffffff' },
                    { id: 'noir', nom: 'Noir', code: '#000000' },
                    { id: 'bleu', nom: 'Bleu marine', code: '#1e3a5f' },
                    { id: 'rouge', nom: 'Rouge', code: '#c41e3a' },
                    { id: 'gris', nom: 'Gris', code: '#808080' },
                    { id: 'vert', nom: 'Vert', code: '#228b22' }
                ],
                tailles: ['S', 'M', 'L', 'XL', '2XL', '3XL']
            },
            polo: {
                nom: 'Polo Professionnel',
                prix: 18,
                couleurs: [
                    { id: 'noir', nom: 'Noir', code: '#000000' },
                    { id: 'bleu', nom: 'Bleu marine', code: '#1e3a5f' },
                    { id: 'blanc', nom: 'Blanc', code: '#ffffff' },
                    { id: 'rouge', nom: 'Rouge bordeaux', code: '#800000' },
                    { id: 'gris', nom: 'Gris anthracite', code: '#36454f' },
                    { id: 'vert', nom: 'Vert forêt', code: '#228b22' }
                ],
                tailles: ['S', 'M', 'L', 'XL', '2XL', '3XL']
            },
            sweat: {
                nom: 'Sweatshirt Premium',
                prix: 24,
                couleurs: [
                    { id: 'gris', nom: 'Gris', code: '#808080' },
                    { id: 'noir', nom: 'Noir', code: '#000000' },
                    { id: 'bleu', nom: 'Bleu', code: '#1e3a5f' },
                    { id: 'rouge', nom: 'Rouge', code: '#c41e3a' },
                    { id: 'vert', nom: 'Vert', code: '#228b22' },
                    { id: 'marron', nom: 'Marron', code: '#8b4513' }
                ],
                tailles: ['S', 'M', 'L', 'XL', '2XL', '3XL']
            }
        },
        
        techniques: {
            flocage: { nom: 'Flocage', supplement: 0 },
            broderie: { nom: 'Broderie', supplement: 3 },
            serigraphie: { nom: 'Sérigraphie', supplement: 1 }
        },
        
        optionsSuppl: {
            'emballage': { nom: 'Emballage individuel', prix: 0.5 },
            'etiquette': { nom: 'Étiquette nominative', prix: 1 },
            'urgence': { nom: 'Production urgente', pourcentage: 15 }
        }
    };
    
    // Initialisation
    initConfigurateurTextile();
    
    function initConfigurateurTextile() {
        // Initialiser les tailles
        initTailles();
        
        // Navigation entre les étapes
        setupStepNavigation();
        
        // Gestion du produit
        setupProduit();
        
        // Gestion des couleurs
        setupCouleurs();
        
        // Gestion des tailles et quantités
        setupTaillesQuantites();
        
        // Gestion de l'upload
        setupUploadTextile();
        
        // Gestion des options
        setupOptions();
        
        // Gestion du panier
        setupPanierTextile();
        
        // Mise à jour initiale
        updatePreviewTextile();
        updateResumeTextile();
    }
    
    function initTailles() {
        // Initialiser l'objet tailles avec des quantités à 0
        const produit = configurateur.produits[configurateur.configuration.produit];
        produit.tailles.forEach(taille => {
            configurateur.configuration.tailles[taille] = 0;
        });
    }
    
    function setupStepNavigation() {
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const nextStepId = this.getAttribute('data-next');
                goToStepTextile(nextStepId);
            });
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const prevStepId = this.getAttribute('data-prev');
                goToStepTextile(prevStepId);
            });
        });
        
        // Bouton "Modifier"
        const modifierBtn = document.getElementById('modifierTextile');
        if (modifierBtn) {
            modifierBtn.addEventListener('click', function() {
                goToStepTextile('step-produit');
            });
        }
    }
    
    function goToStepTextile(stepId) {
        // Cacher toutes les étapes
        document.querySelectorAll('.config-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Afficher l'étape demandée
        document.getElementById(stepId).classList.add('active');
        
        // Si on va à l'étape 2, mettre à jour les couleurs
        if (stepId === 'step-personnalisation') {
            updateCouleursOptions();
            updateTaillesTable();
        }
        
        // Si on va à l'étape 3, mettre à jour le récapitulatif
        if (stepId === 'step-resume') {
            updateResumeTextile();
        }
    }
    
    function setupProduit() {
        const produitInputs = document.querySelectorAll('input[name="produit"]');
        produitInputs.forEach(input => {
            input.addEventListener('change', function() {
                configurateur.configuration.produit = this.value;
                
                // Réinitialiser les tailles
                initTailles();
                
                // Mettre à jour les couleurs
                updateCouleursOptions();
                
                // Mettre à jour les tailles
                updateTaillesTable();
                
                // Mettre à jour l'aperçu
                updatePreviewTextile();
            });
        });
    }
    
    function updateCouleursOptions() {
        const produit = configurateur.produits[configurateur.configuration.produit];
        const container = document.getElementById('couleursOptions');
        
        if (!container) return;
        
        let html = '';
        produit.couleurs.forEach(couleur => {
            const isActive = configurateur.configuration.couleur === couleur.id;
            html += `
                <div class="couleur-option ${isActive ? 'active' : ''}" data-couleur="${couleur.id}">
                    <div class="couleur-preview" style="background-color: ${couleur.code};"></div>
                    <span class="couleur-nom">${couleur.nom}</span>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Ajouter les événements
        document.querySelectorAll('.couleur-option').forEach(option => {
            option.addEventListener('click', function() {
                const couleurId = this.getAttribute('data-couleur');
                configurateur.configuration.couleur = couleurId;
                
                // Mettre à jour l'affichage
                document.querySelectorAll('.couleur-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                
                // Mettre à jour l'aperçu
                updatePreviewTextile();
            });
        });
    }
    
    function setupCouleurs() {
        // Déjà géré par updateCouleursOptions()
    }
    
    function setupTaillesQuantites() {
        // Initialement vide, sera rempli par updateTaillesTable()
    }
    
    function updateTaillesTable() {
        const produit = configurateur.produits[configurateur.configuration.produit];
        const container = document.getElementById('taillesTable');
        
        if (!container) return;
        
        let html = '';
        let totalPieces = 0;
        
        produit.tailles.forEach(taille => {
            const quantite = configurateur.configuration.tailles[taille] || 0;
            totalPieces += quantite;
            const prixUnite = produit.prix;
            const total = quantite * prixUnite;
            
            html += `
                <tr>
                    <td>${taille}</td>
                    <td>
                        <input type="number" class="quantite-taille" data-taille="${taille}" 
                               value="${quantite}" min="0" max="100">
                    </td>
                    <td>${prixUnite}€</td>
                    <td>${total.toFixed(2)}€</td>
                </tr>
            `;
        });
        
        container.innerHTML = html;
        
        // Mettre à jour les totaux
        document.getElementById('totalPieces').textContent = totalPieces;
        document.getElementById('totalHT').textContent = (totalPieces * produit.prix).toFixed(2) + '€ HT';
        
        // Ajouter les événements aux inputs
        document.querySelectorAll('.quantite-taille').forEach(input => {
            input.addEventListener('input', function() {
                const taille = this.getAttribute('data-taille');
                const quantite = parseInt(this.value) || 0;
                configurateur.configuration.tailles[taille] = quantite;
                
                // Mettre à jour les totaux
                updateTotauxTextile();
            });
        });
    }
    
    function updateTotauxTextile() {
        const produit = configurateur.produits[configurateur.configuration.produit];
        let totalPieces = 0;
        let totalHT = 0;
        
        // Calculer le total des pièces et le prix HT de base
        Object.values(configurateur.configuration.tailles).forEach(quantite => {
            totalPieces += quantite;
        });
        
        totalHT = totalPieces * produit.prix;
        
        // Ajouter le supplément de technique
        const technique = configurateur.techniques[configurateur.configuration.technique];
        totalHT += totalPieces * technique.supplement;
        
        // Ajouter les options supplémentaires
        configurateur.configuration.options.forEach(optionId => {
            const option = configurateur.optionsSuppl[optionId];
            if (option.pourcentage) {
                totalHT += totalHT * (option.pourcentage / 100);
            } else if (option.prix) {
                totalHT += totalPieces * option.prix;
            }
        });
        
        // Mettre à jour l'affichage
        document.getElementById('totalPieces').textContent = totalPieces;
        document.getElementById('totalHT').textContent = totalHT.toFixed(2) + '€ HT';
        
        return { totalPieces, totalHT };
    }
    
    function setupUploadTextile() {
        const uploadZone = document.getElementById('uploadZoneTextile');
        const fileInput = document.getElementById('fileUploadTextile');
        
        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', function() {
                handleFileUploadTextile(this.files[0]);
            });
            
            // Drag and drop
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = 'var(--primary-color)';
                uploadZone.style.backgroundColor = 'rgba(234, 0, 113, 0.05)';
            });
            
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.style.borderColor = '';
                uploadZone.style.backgroundColor = '';
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = '';
                uploadZone.style.backgroundColor = '';
                
                if (e.dataTransfer.files.length) {
                    handleFileUploadTextile(e.dataTransfer.files[0]);
                }
            });
        }
        
        // Position du design
        const positionSelect = document.getElementById('positionDesign');
        if (positionSelect) {
            positionSelect.addEventListener('change', function() {
                configurateur.configuration.position = this.value;
                updatePreviewTextile();
            });
        }
        
        // Taille du design
        const tailleSlider = document.getElementById('tailleDesign');
        const tailleValue = document.getElementById('tailleValue');
        
        if (tailleSlider && tailleValue) {
            tailleSlider.addEventListener('input', function() {
                configurateur.configuration.tailleDesign = parseInt(this.value);
                tailleValue.textContent = this.value + ' cm';
                updatePreviewTextile();
            });
        }
        
        // Technique de marquage
        const techniqueSelect = document.getElementById('technique');
        if (techniqueSelect) {
            techniqueSelect.addEventListener('change', function() {
                configurateur.configuration.technique = this.value;
                updateTotauxTextile();
            });
        }
    }
    
    function handleFileUploadTextile(file) {
        if (!file) return;
        
        // Vérifier la taille
        if (file.size > 20 * 1024 * 1024) {
            alert('Le fichier est trop volumineux (max 20MB)');
            return;
        }
        
        // Vérifier l'extension
        const validExtensions = ['.png', '.jpg', '.jpeg', '.ai', '.eps'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validExtensions.includes(fileExtension)) {
            alert('Format de fichier non supporté. Formats acceptés : PNG, JPG, AI, EPS');
            return;
        }
        
        // Sauvegarder le fichier
        configurateur.configuration.design = file;
        
        // Afficher un aperçu si c'est une image
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('designPreview');
                if (preview) {
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Aperçu du design" 
                             style="max-width: 100%; max-height: 200px; border-radius: 5px;">
                    `;
                }
                
                // Mettre à jour l'aperçu du vêtement
                updatePreviewTextile(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            // Pour les fichiers vectoriels
            const preview = document.getElementById('designPreview');
            if (preview) {
                preview.innerHTML = `
                    <div class="file-preview">
                        <i class="fas fa-file-alt" style="font-size: 3rem; color: var(--primary-color);"></i>
                        <p>${file.name}</p>
                        <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small>
                    </div>
                `;
            }
        }
    }
    
    function updatePreviewTextile(designUrl = null) {
        const produit = configurateur.produits[configurateur.configuration.produit];
        const couleur = produit.couleurs.find(c => c.id === configurateur.configuration.couleur);
        
        // Mettre à jour l'aperçu final
        const preview = document.getElementById('finalPreviewTextile');
        if (preview) {
            preview.innerHTML = `
                <div class="vetement-preview">
                    <div class="vetement-image">
                        <img src="../images/textile/${configurateur.configuration.produit}-${configurateur.configuration.couleur}.jpg" 
                             alt="${produit.nom} ${couleur.nom}" 
                             style="max-width: 100%; border-radius: 5px;">
                    </div>
                    ${designUrl ? `
                    <div class="design-overlay" style="
                        position: absolute;
                        top: ${getDesignPosition().top}%;
                        left: ${getDesignPosition().left}%;
                        width: ${configurateur.configuration.tailleDesign}%;
                        transform: translate(-50%, -50%);
                    ">
                        <img src="${designUrl}" alt="Design" style="max-width: 100%; opacity: 0.8;">
                    </div>
                    ` : ''}
                </div>
            `;
        }
    }
    
    function getDesignPosition() {
        const positions = {
            'poitrine-gauche': { top: 40, left: 25 },
            'poitrine-droite': { top: 40, left: 75 },
            'centré': { top: 40, left: 50 },
            'dos': { top: 40, left: 50 },
            'manche': { top: 20, left: 10 }
        };
        return positions[configurateur.configuration.position] || { top: 40, left: 25 };
    }
    
    function setupOptions() {
        const optionCheckboxes = document.querySelectorAll('input[name="options"]');
        optionCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const optionId = this.id.replace('option-', '');
                
                if (this.checked) {
                    // Ajouter l'option
                    if (!configurateur.configuration.options.includes(optionId)) {
                        configurateur.configuration.options.push(optionId);
                    }
                } else {
                    // Retirer l'option
                    const index = configurateur.configuration.options.indexOf(optionId);
                    if (index > -1) {
                        configurateur.configuration.options.splice(index, 1);
                    }
                }
                
                // Mettre à jour les totaux
                updateTotauxTextile();
            });
        });
    }
    
    function updateResumeTextile() {
        const produit = configurateur.produits[configurateur.configuration.produit];
        const couleur = produit.couleurs.find(c => c.id === configurateur.configuration.couleur);
        const technique = configurateur.techniques[configurateur.configuration.technique];
        const totaux = updateTotauxTextile();
        
        // Produit
        document.getElementById('resumeProduit').textContent = produit.nom;
        document.getElementById('resumeCouleur').textContent = couleur.nom;
        
        // Tailles
        const taillesResume = document.getElementById('taillesResume');
        let taillesHtml = '';
        Object.entries(configurateur.configuration.tailles).forEach(([taille, quantite]) => {
            if (quantite > 0) {
                taillesHtml += `<div>${taille}: ${quantite} pièce(s)</div>`;
            }
        });
        taillesResume.innerHTML = taillesHtml || '<p>Aucune taille sélectionnée</p>';
        
        // Personnalisation
        document.getElementById('resumeTechnique').textContent = technique.nom;
        document.getElementById('resumePosition').textContent = getPositionText(configurateur.configuration.position);
        document.getElementById('resumeTailleDesign').textContent = configurateur.configuration.tailleDesign + ' cm';
        
        // Options
        const optionsResume = document.getElementById('optionsResume');
        if (configurateur.configuration.options.length > 0) {
            let optionsHtml = '';
            configurateur.configuration.options.forEach(optionId => {
                const option = configurateur.optionsSuppl[optionId];
                optionsHtml += `<div>${option.nom}</div>`;
            });
            optionsResume.innerHTML = optionsHtml;
        } else {
            optionsResume.innerHTML = '<p>Aucune option supplémentaire</p>';
        }
        
        // Totaux
        document.getElementById('resumeTotalPieces').textContent = totaux.totalPieces;
        document.getElementById('resumeTotalHT').textContent = totaux.totalHT.toFixed(2) + '€ HT';
        
        // Livraison
        const livraisonEl = document.getElementById('resumeLivraison');
        livraisonEl.textContent = totaux.totalPieces >= 30 ? 'Offerte' : '12€ HT';
    }
    
    function getPositionText(position) {
        const positions = {
            'poitrine-gauche': 'Poitrine gauche',
            'poitrine-droite': 'Poitrine droite',
            'centré': 'Centré poitrine',
            'dos': 'Dos complet',
            'manche': 'Manche gauche'
        };
        return positions[position] || position;
    }
    
    function setupPanierTextile() {
        // Ajout au panier
        const addToCartBtn = document.getElementById('ajouterTextilePanier');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                // Vérifier le minimum de pièces
                const totalPieces = Object.values(configurateur.configuration.tailles)
                    .reduce((sum, qty) => sum + qty, 0);
                
                if (totalPieces < 10) {
                    alert('Commande minimum : 10 pièces');
                    return;
                }
                
                // Vérifier qu'un design a été uploadé
                if (!configurateur.configuration.design) {
                    alert('Veuillez télécharger votre design avant de commander');
                    return;
                }
                
                addTextileToCart();
            });
        }
        
        // Voir le panier
        const viewCartBtn = document.getElementById('voirPanierTextile');
        if (viewCartBtn) {
            viewCartBtn.addEventListener('click', function() {
                openTextileCartModal();
            });
        }
        
        // Mettre à jour l'affichage du panier
        updateTextileCartDisplay();
    }
    
    function addTextileToCart() {
        const totaux = updateTotauxTextile();
        
        // Récupérer la configuration actuelle
        const produit = {
            id: Date.now(),
            type: 'textile',
            sousType: configurateur.configuration.produit,
            configuration: { ...configurateur.configuration },
            prix: totaux.totalHT,
            date: new Date().toISOString()
        };
        
        // Récupérer le panier du localStorage
        let panier = JSON.parse(localStorage.getItem('panier-atelier-enseigne')) || [];
        
        // Ajouter le produit
        panier.push(produit);
        
        // Sauvegarder
        localStorage.setItem('panier-atelier-enseigne', JSON.stringify(panier));
        
        // Mettre à jour l'affichage du panier
        updateTextileCartDisplay();
        
        // Afficher un message de confirmation
        alert('Textile ajouté au panier !');
        
        // Optionnel: Ouvrir le panier
        openTextileCartModal();
    }
    
    function updateTextileCartDisplay() {
        const panier = JSON.parse(localStorage.getItem('panier-atelier-enseigne')) || [];
        const cartCount = document.querySelector('.cart-count');
        const cartEmpty = document.getElementById('cartEmptyTextile');
        const cartItems = document.querySelector('.cart-items');
        
        if (cartCount) {
            cartCount.textContent = panier.length;
        }
        
        // Mettre à jour l'affichage du panier flottant
        if (panier.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (cartItems) cartItems.innerHTML = '<div class="cart-empty">Votre panier est vide</div>';
        } else {
            if (cartEmpty) cartEmpty.style.display = 'none';
            
            // Calculer le total
            const total = panier.reduce((sum, item) => sum + item.prix, 0);
            
            if (cartItems) {
                cartItems.innerHTML = `
                    <div class="cart-item-summary">
                        <p>${panier.length} produit(s) dans le panier</p>
                        <p>Total : <strong>${total.toFixed(2)}€ HT</strong></p>
                    </div>
                `;
            }
        }
    }
    
    function openTextileCartModal() {
        const modal = document.getElementById('textileCartModal');
        const modalBody = document.getElementById('textileCartModalBody');
        const panier = JSON.parse(localStorage.getItem('panier-atelier-enseigne')) || [];
        
        if (modal && modalBody) {
            if (panier.length === 0) {
                modalBody.innerHTML = '<p>Votre panier est vide</p>';
            } else {
                let html = '<div class="cart-modal-items">';
                let total = 0;
                
                panier.forEach((item, index) => {
                    total += item.prix;
                    
                    let typeText = '';
                    switch(item.type) {
                        case 'enseigne':
                            typeText = 'Enseigne personnalisée';
                            break;
                        case 'sticker':
                            typeText = 'Stickers personnalisés';
                            break;
                        case 'textile':
                            typeText = 'Textile personnalisé';
                            break;
                        default:
                            typeText = 'Produit personnalisé';
                    }
                    
                    html += `
                        <div class="cart-modal-item">
                            <div class="item-info">
                                <h4>${typeText}</h4>
                                <p>${getItemDescriptionTextile(item)}</p>
                                <p>Prix: ${item.prix.toFixed(2)}€ HT</p>
                            </div>
                            <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                });
                
                html += `
                    <div class="cart-modal-total">
                        <strong>Total : ${total.toFixed(2)}€ HT</strong>
                    </div>
                `;
                
                modalBody.innerHTML = html;
                
                // Ajouter les événements pour supprimer les items
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        removeFromCart(index);
                        updateTextileCartDisplay();
                        openTextileCartModal();
                    });
                });
            }
            
            modal.style.display = 'block';
            
            // Fermer le modal
            const closeBtn = modal.querySelector('.modal-close');
            const continueBtn = document.getElementById('continuerTextile');
            const checkoutBtn = document.getElementById('commanderTextile');
            
            if (closeBtn) {
                closeBtn.onclick = function() {
                    modal.style.display = 'none';
                };
            }
            
            if (continueBtn) {
                continueBtn.onclick = function() {
                    modal.style.display = 'none';
                };
            }
            
            if (checkoutBtn) {
                checkoutBtn.onclick = function() {
                    // Rediriger vers la page de commande
                    window.location.href = '../commande.html';
                };
            }
            
            // Fermer en cliquant en dehors
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            };
        }
    }
    
    function getItemDescriptionTextile(item) {
        if (item.type === 'textile') {
            const config = item.configuration;
            const produits = {
                tshirt: 'T-shirt',
                polo: 'Polo',
                sweat: 'Sweatshirt'
            };
            
            let desc = `Type: ${produits[config.produit] || 'Textile'}`;
            
            // Ajouter les tailles
            const tailles = Object.entries(config.tailles)
                .filter(([_, qty]) => qty > 0)
                .map(([taille, qty]) => `${taille}: ${qty}`)
                .join(', ');
            
            if (tailles) {
                desc += `, Tailles: ${tailles}`;
            }
            
            desc += `, Technique: ${config.technique}`;
            
            return desc;
        }
        
        return 'Produit personnalisé';
    }
    
    function removeFromCart(index) {
        let panier = JSON.parse(localStorage.getItem('panier-atelier-enseigne')) || [];
        panier.splice(index, 1);
        localStorage.setItem('panier-atelier-enseigne', JSON.stringify(panier));
    }
    
    // Initialiser l'affichage du panier
    updateTextileCartDisplay();
});