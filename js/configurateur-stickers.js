// Configurateur de stickers
document.addEventListener('DOMContentLoaded', function() {
    const configurateur = {
        currentStep: 1,
        configuration: {
            type: 'vitrine',
            format: 'a4',
            largeur: 21,
            hauteur: 29.7,
            quantite: 1,
            materiau: 'standard',
            finish: 'contour',
            fichier: null
        },
        
        prix: {
            base: {
                vitrine: 45,
                vehicule: 89,
                interieur: 29
            },
            formats: {
                a4: 1.0,
                a3: 1.8,
                a2: 2.9,
                surmesure: 0
            },
            materiaux: {
                standard: 1.0,
                premium: 1.25,
                repositionnable: 1.15,
                fluo: 1.35
            },
            finitions: {
                contour: 0,
                lettrage: 20,
                kisscut: 10
            }
        }
    };
    
    // Initialisation
    initConfigurateurStickers();
    
    function initConfigurateurStickers() {
        // Navigation entre les étapes
        setupStepNavigation();
        
        // Gestion du type
        setupType();
        
        // Gestion du format
        setupFormat();
        
        // Gestion de la quantité
        setupQuantite();
        
        // Gestion du matériau
        setupMateriau();
        
        // Gestion de la finition
        setupFinish();
        
        // Gestion de l'upload
        setupUpload();
        
        // Gestion du panier
        setupPanierStickers();
        
        // Mise à jour initiale
        updateResumeStickers();
    }
    
    function setupStepNavigation() {
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const nextStepId = this.getAttribute('data-next');
                goToStepStickers(nextStepId);
            });
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const prevStepId = this.getAttribute('data-prev');
                goToStepStickers(prevStepId);
            });
        });
        
        // Bouton "Modifier la configuration"
        const modifyBtn = document.getElementById('modifyStickerConfig');
        if (modifyBtn) {
            modifyBtn.addEventListener('click', function() {
                goToStepStickers('step-type');
            });
        }
    }
    
    function goToStepStickers(stepId) {
        // Cacher toutes les étapes
        document.querySelectorAll('.config-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Afficher l'étape demandée
        document.getElementById(stepId).classList.add('active');
    }
    
    function setupType() {
        const typeInputs = document.querySelectorAll('input[name="type"]');
        typeInputs.forEach(input => {
            input.addEventListener('change', function() {
                configurateur.configuration.type = this.value;
                updateResumeStickers();
            });
        });
    }
    
    function setupFormat() {
        const formatInputs = document.querySelectorAll('input[name="format"]');
        formatInputs.forEach(input => {
            input.addEventListener('change', function() {
                configurateur.configuration.format = this.value;
                
                // Afficher/masquer les dimensions sur mesure
                if (this.value === 'surmesure') {
                    document.getElementById('custom-format').style.display = 'block';
                } else {
                    document.getElementById('custom-format').style.display = 'none';
                    
                    // Définir les dimensions prédéfinies
                    const dimensions = {
                        a4: { largeur: 21, hauteur: 29.7 },
                        a3: { largeur: 29.7, hauteur: 42 },
                        a2: { largeur: 42, hauteur: 59.4 }
                    };
                    
                    if (dimensions[this.value]) {
                        configurateur.configuration.largeur = dimensions[this.value].largeur;
                        configurateur.configuration.hauteur = dimensions[this.value].hauteur;
                        
                        // Mettre à jour les inputs
                        const largeurInput = document.getElementById('largeur-sticker');
                        const hauteurInput = document.getElementById('hauteur-sticker');
                        if (largeurInput && hauteurInput) {
                            largeurInput.value = dimensions[this.value].largeur;
                            hauteurInput.value = dimensions[this.value].hauteur;
                        }
                    }
                }
                
                updateResumeStickers();
            });
        });
        
        // Dimensions sur mesure
        const largeurInput = document.getElementById('largeur-sticker');
        const hauteurInput = document.getElementById('hauteur-sticker');
        
        if (largeurInput && hauteurInput) {
            largeurInput.addEventListener('input', function() {
                configurateur.configuration.largeur = parseFloat(this.value);
                updateResumeStickers();
            });
            
            hauteurInput.addEventListener('input', function() {
                configurateur.configuration.hauteur = parseFloat(this.value);
                updateResumeStickers();
            });
        }
    }
    
    function setupQuantite() {
        const qtyInput = document.getElementById('quantite-sticker');
        const qtyButtons = document.querySelectorAll('.qty-btn');
        
        if (qtyInput) {
            qtyInput.addEventListener('input', function() {
                let value = parseInt(this.value);
                value = Math.max(1, Math.min(100, value));
                this.value = value;
                configurateur.configuration.quantite = value;
                updateResumeStickers();
            });
        }
        
        qtyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                let value = parseInt(qtyInput.value);
                
                if (action === 'increase') {
                    value = Math.min(value + 1, 100);
                } else {
                    value = Math.max(value - 1, 1);
                }
                
                qtyInput.value = value;
                configurateur.configuration.quantite = value;
                updateResumeStickers();
            });
        });
    }
    
    function setupMateriau() {
        const materiauInputs = document.querySelectorAll('input[name="materiau"]');
        materiauInputs.forEach(input => {
            input.addEventListener('change', function() {
                configurateur.configuration.materiau = this.value;
                updateResumeStickers();
            });
        });
    }
    
    function setupFinish() {
        const finishInputs = document.querySelectorAll('input[name="finish"]');
        finishInputs.forEach(input => {
            input.addEventListener('change', function() {
                configurateur.configuration.finish = this.value;
                updateResumeStickers();
            });
        });
    }
    
    function setupUpload() {
        const uploadArea = document.getElementById('uploadAreaSticker');
        const fileInput = document.getElementById('fileUploadSticker');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', function() {
                handleFileUploadSticker(this.files[0]);
            });
            
            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--primary-color)';
                uploadArea.style.backgroundColor = 'rgba(234, 0, 113, 0.05)';
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = '';
                uploadArea.style.backgroundColor = '';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '';
                uploadArea.style.backgroundColor = '';
                
                if (e.dataTransfer.files.length) {
                    handleFileUploadSticker(e.dataTransfer.files[0]);
                }
            });
        }
    }
    
    function handleFileUploadSticker(file) {
        if (!file) return;
        
        // Vérifier la taille
        if (file.size > 20 * 1024 * 1024) {
            alert('Le fichier est trop volumineux (max 20MB)');
            return;
        }
        
        // Vérifier l'extension
        const validExtensions = ['.ai', '.eps', '.pdf', '.jpg', '.jpeg', '.png'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validExtensions.includes(fileExtension)) {
            alert('Format de fichier non supporté. Formats acceptés : AI, EPS, PDF, JPG, PNG');
            return;
        }
        
        // Sauvegarder le fichier
        configurateur.configuration.fichier = file;
        
        // Afficher un aperçu si c'est une image
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('stickerPreview');
                if (preview) {
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Aperçu du sticker" style="max-width: 100%; border-radius: 5px;">
                    `;
                }
            };
            reader.readAsDataURL(file);
        } else {
            // Pour les fichiers vectoriels, afficher une icône
            const preview = document.getElementById('stickerPreview');
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
    
    function calculatePrice() {
        let prix = configurateur.prix.base[configurateur.configuration.type];
        
        // Appliquer le coefficient du format
        const formatCoef = configurateur.prix.formats[configurateur.configuration.format];
        if (configurateur.configuration.format === 'surmesure') {
            // Calcul personnalisé pour sur mesure
            const surface = (configurateur.configuration.largeur * configurateur.configuration.hauteur) / 10000; // en m²
            prix = surface * 150; // 150€ HT par m²
        } else {
            prix *= formatCoef;
        }
        
        // Appliquer le coefficient du matériau
        prix *= configurateur.prix.materiaux[configurateur.configuration.materiau];
        
        // Ajouter la finition
        prix += configurateur.prix.finitions[configurateur.configuration.finish];
        
        // Multiplier par la quantité
        prix *= configurateur.configuration.quantite;
        
        return Math.round(prix * 100) / 100;
    }
    
    function updateResumeStickers() {
        // Type
        const types = {
            vitrine: 'Sticker Vitrine',
            vehicule: 'Sticker Véhicule',
            interieur: 'Sticker Intérieur'
        };
        document.getElementById('resumeType').textContent = types[configurateur.configuration.type] || 'Sticker';
        
        // Format
        let formatText = '';
        if (configurateur.configuration.format === 'surmesure') {
            formatText = `${configurateur.configuration.largeur}x${configurateur.configuration.hauteur} cm`;
        } else {
            const formats = {
                a4: 'A4 (21x29,7cm)',
                a3: 'A3 (29,7x42cm)',
                a2: 'A2 (42x59,4cm)'
            };
            formatText = formats[configurateur.configuration.format] || 'Format personnalisé';
        }
        document.getElementById('resumeFormat').textContent = formatText;
        
        // Quantité
        document.getElementById('resumeQuantite').textContent = configurateur.configuration.quantite;
        
        // Matériau
        const materiaux = {
            standard: 'Vinyle Standard',
            premium: 'Vinyle Premium',
            repositionnable: 'Vinyle Repositionnable',
            fluo: 'Vinyle Fluorescent'
        };
        document.getElementById('resumeMateriau').textContent = materiaux[configurateur.configuration.materiau] || 'Vinyle Standard';
        
        // Finition
        const finitions = {
            contour: 'Découpe contour',
            lettrage: 'Découpe lettrage',
            kisscut: 'Kiss-cut'
        };
        document.getElementById('resumeFinish').textContent = finitions[configurateur.configuration.finish] || 'Découpe contour';
        
        // Prix total
        const prixTotal = calculatePrice();
        document.getElementById('resumeTotal').textContent = `${prixTotal}€ HT`;
        
        return prixTotal;
    }
    
    function setupPanierStickers() {
        // Ajout au panier
        const addToCartBtn = document.getElementById('addStickerToCart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                addStickerToCart();
            });
        }
        
        // Voir le panier
        const viewCartBtn = document.getElementById('viewCartSticker');
        if (viewCartBtn) {
            viewCartBtn.addEventListener('click', function() {
                openStickerCartModal();
            });
        }
        
        // Mettre à jour l'affichage du panier
        updateStickerCartDisplay();
    }
    
    function addStickerToCart() {
        // Vérifier qu'un fichier a été uploadé
        if (!configurateur.configuration.fichier) {
            alert('Veuillez télécharger votre fichier avant de commander');
            return;
        }
        
        // Récupérer la configuration actuelle
        const produit = {
            id: Date.now(),
            type: 'sticker',
            sousType: configurateur.configuration.type,
            configuration: { ...configurateur.configuration },
            prix: calculatePrice(),
            date: new Date().toISOString()
        };
        
        // Récupérer le panier du localStorage
        let panier = JSON.parse(localStorage.getItem('panier-atelier-enseigne')) || [];
        
        // Ajouter le produit
        panier.push(produit);
        
        // Sauvegarder
        localStorage.setItem('panier-atelier-enseigne', JSON.stringify(panier));
        
        // Mettre à jour l'affichage du panier
        updateStickerCartDisplay();
        
        // Afficher un message de confirmation
        alert('Stickers ajoutés au panier !');
        
        // Optionnel: Ouvrir le panier
        openStickerCartModal();
    }
    
    function updateStickerCartDisplay() {
        const panier = JSON.parse(localStorage.getItem('panier-atelier-enseigne')) || [];
        const cartCount = document.querySelector('.cart-count');
        const cartEmpty = document.getElementById('cartEmptySticker');
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
    
    function openStickerCartModal() {
        const modal = document.getElementById('stickerCartModal');
        const modalBody = document.getElementById('stickerCartModalBody');
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
                                <p>${getItemDescriptionSticker(item)}</p>
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
                        updateStickerCartDisplay();
                        openStickerCartModal();
                    });
                });
            }
            
            modal.style.display = 'block';
            
            // Fermer le modal
            const closeBtn = modal.querySelector('.modal-close');
            const continueBtn = document.getElementById('continueSticker');
            const checkoutBtn = document.getElementById('checkoutSticker');
            
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
    
    function getItemDescriptionSticker(item) {
        if (item.type === 'sticker') {
            const config = item.configuration;
            const types = {
                vitrine: 'Vitrine',
                vehicule: 'Véhicule',
                interieur: 'Intérieur'
            };
            
            let desc = `Type: ${types[config.type] || 'Sticker'}`;
            
            if (config.format === 'surmesure') {
                desc += `, Dimensions: ${config.largeur}x${config.hauteur}cm`;
            } else {
                desc += `, Format: ${config.format.toUpperCase()}`;
            }
            
            desc += `, Quantité: ${config.quantite}`;
            
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
    updateStickerCartDisplay();
});