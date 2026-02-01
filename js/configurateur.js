// Configurateur d'enseignes
document.addEventListener('DOMContentLoaded', function() {
    const configurateur = {
        currentStep: 1,
        totalSteps: 5,
        configuration: {
            dimensions: '80x60',
            largeur: 80,
            hauteur: 60,
            materiau: 'pvc',
            eclairage: 'aucun',
            texte: 'VOTRE NOM',
            police: 'arial',
            couleurTexte: '#000000',
            couleurFond: '#ffffff',
            logo: null,
            instructions: '',
            quantite: 1
        },
        
        prix: {
            base: 279,
            materiau: {
                pvc: 0,
                plexiglas: 89,
                aluminium: 129
            },
            eclairage: {
                aucun: 0,
                led: 199,
                'led-color': 299
            }
        }
    };
    
    // Initialisation
    initConfigurateur();
    
    function initConfigurateur() {
        // Navigation entre les étapes
        setupStepNavigation();
        
        // Gestion des dimensions
        setupDimensions();
        
        // Gestion des matériaux
        setupMateriaux();
        
        // Gestion de l'éclairage
        setupEclairage();
        
        // Gestion de la personnalisation
        setupPersonnalisation();
        
        // Gestion du panier
        setupPanier();
        
        // Mise à jour initiale
        updatePreview();
        updateResume();
    }
    
    function setupStepNavigation() {
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const nextStepId = this.getAttribute('data-next');
                goToStep(nextStepId);
            });
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const prevStepId = this.getAttribute('data-prev');
                goToStep(prevStepId);
            });
        });
        
        // Bouton "Modifier la configuration"
        const modifyBtn = document.getElementById('modifyConfig');
        if (modifyBtn) {
            modifyBtn.addEventListener('click', function() {
                goToStep('step-dimensions');
            });
        }
    }
    
    function goToStep(stepId) {
        // Cacher toutes les étapes
        document.querySelectorAll('.config-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Afficher l'étape demandée
        document.getElementById(stepId).classList.add('active');
        
        // Mettre à jour l'étape courante
        const stepNum = stepId.split('-')[1];
        configurateur.currentStep = getStepNumber(stepNum);
        
        // Mettre à jour le récapitulatif si on est sur la dernière étape
        if (stepId === 'step-resume') {
            updateResume();
        }
    }
    
    function getStepNumber(stepName) {
        const steps = {
            'dimensions': 1,
            'materiau': 2,
            'eclairage': 3,
            'personnalisation': 4,
            'resume': 5
        };
        return steps[stepName] || 1;
    }
    
    function setupDimensions() {
        // Dimensions prédéfinies
        const dimensionInputs = document.querySelectorAll('input[name="dimensions"]');
        dimensionInputs.forEach(input => {
            input.addEventListener('change', function() {
                if (this.value === 'surmesure') {
                    document.getElementById('custom-dimensions').style.display = 'block';
                    configurateur.configuration.dimensions = 'surmesure';
                } else {
                    document.getElementById('custom-dimensions').style.display = 'none';
                    configurateur.configuration.dimensions = this.value;
                    
                    // Extraire les dimensions
                    const dims = this.value.split('x');
                    configurateur.configuration.largeur = parseInt(dims[0]);
                    configurateur.configuration.hauteur = parseInt(dims[1]);
                    
                    // Mettre à jour la surface
                    updateSurface();
                }
                
                updatePreview();
                updatePrix();
            });
        });
        
        // Dimensions sur mesure
        const largeurInput = document.getElementById('largeur');
        const hauteurInput = document.getElementById('hauteur');
        
        if (largeurInput && hauteurInput) {
            largeurInput.addEventListener('input', function() {
                configurateur.configuration.largeur = parseInt(this.value);
                updateSurface();
                updatePreview();
                updatePrix();
            });
            
            hauteurInput.addEventListener('input', function() {
                configurateur.configuration.hauteur = parseInt(this.value);
                updateSurface();
                updatePreview();
                updatePrix();
            });
        }
    }
    
    function updateSurface() {
        const surface = (configurateur.configuration.largeur * configurateur.configuration.hauteur) / 10000;
        document.getElementById('surface').textContent = surface.toFixed(2);
    }
    
    function setupMateriaux() {
        const materiauInputs = document.querySelectorAll('input[name="materiau"]');
        materiauInputs.forEach(input => {
            input.addEventListener('change', function() {
                configurateur.configuration.materiau = this.value;
                updatePreview();
                updatePrix();
            });
        });
    }
    
    function setupEclairage() {
        const eclairageInputs = document.querySelectorAll('input[name="eclairage"]');
        eclairageInputs.forEach(input => {
            input.addEventListener('change', function() {
                configurateur.configuration.eclairage = this.value;
                updatePreview();
                updatePrix();
            });
        });
    }
    
    function setupPersonnalisation() {
        // Texte
        const texteInput = document.getElementById('texte-enseigne');
        if (texteInput) {
            texteInput.addEventListener('input', function() {
                configurateur.configuration.texte = this.value.toUpperCase();
                updatePreview();
            });
        }
        
        // Police
        const policeSelect = document.getElementById('police');
        if (policeSelect) {
            policeSelect.addEventListener('change', function() {
                configurateur.configuration.police = this.value;
                updatePreview();
            });
        }
        
        // Couleurs
        const couleurTexte = document.getElementById('couleur-texte');
        const couleurFond = document.getElementById('couleur-fond');
        
        if (couleurTexte) {
            couleurTexte.addEventListener('input', function() {
                configurateur.configuration.couleurTexte = this.value;
                updatePreview();
            });
        }
        
        if (couleurFond) {
            couleurFond.addEventListener('input', function() {
                configurateur.configuration.couleurFond = this.value;
                updatePreview();
            });
        }
        
        // Instructions
        const instructionsInput = document.getElementById('instructions');
        if (instructionsInput) {
            instructionsInput.addEventListener('input', function() {
                configurateur.configuration.instructions = this.value;
            });
        }
        
        // Upload de fichier
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileUpload');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', function() {
                handleFileUpload(this.files[0]);
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
                    handleFileUpload(e.dataTransfer.files[0]);
                }
            });
        }
        
        // Actualiser l'aperçu
        const refreshBtn = document.getElementById('refreshPreview');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', updatePreview);
        }
    }
    
    function handleFileUpload(file) {
        if (!file) return;
        
        // Vérifier la taille
        if (file.size > 10 * 1024 * 1024) {
            alert('Le fichier est trop volumineux (max 10MB)');
            return;
        }
        
        // Vérifier l'extension
        const validExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.ai'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validExtensions.includes(fileExtension)) {
            alert('Format de fichier non supporté. Formats acceptés : JPG, PNG, PDF, AI');
            return;
        }
        
        // Afficher le fichier uploadé
        const uploadedFilesDiv = document.getElementById('uploadedFiles');
        if (uploadedFilesDiv) {
            uploadedFilesDiv.innerHTML = `
                <div class="uploaded-file">
                    <i class="fas fa-file"></i>
                    <span>${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    <button class="remove-file"><i class="fas fa-times"></i></button>
                </div>
            `;
            
            // Bouton pour supprimer
            const removeBtn = uploadedFilesDiv.querySelector('.remove-file');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    uploadedFilesDiv.innerHTML = '';
                    configurateur.configuration.logo = null;
                    fileInput.value = '';
                });
            }
        }
        
        // Sauvegarder le fichier
        configurateur.configuration.logo = file;
        
        // Prévisualiser si c'est une image
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewLogo = document.querySelector('.preview-logo');
                if (previewLogo) {
                    previewLogo.innerHTML = `<img src="${e.target.result}" alt="Logo" style="max-width: 100px; max-height: 50px;">`;
                }
            };
            reader.readAsDataURL(file);
        }
    }
    
    function updatePreview() {
        // Mettre à jour les informations
        const dimensions = configurateur.configuration.dimensions === 'surmesure' 
            ? `${configurateur.configuration.largeur}x${configurateur.configuration.hauteur} cm`
            : `${configurateur.configuration.dimensions} cm`;
        
        document.getElementById('previewDimensions').textContent = dimensions;
        
        // Matériau
        const materiaux = {
            pvc: 'PVC',
            plexiglas: 'Plexiglas',
            aluminium: 'Aluminium'
        };
        document.getElementById('previewMateriau').textContent = materiaux[configurateur.configuration.materiau] || 'PVC';
        
        // Éclairage
        const eclairages = {
            aucun: 'Aucun',
            led: 'LED Blanc',
            'led-color': 'LED RGB'
        };
        document.getElementById('previewEclairage').textContent = eclairages[configurateur.configuration.eclairage] || 'Aucun';
        
        // Aperçu visuel
        const previewEnseigne = document.getElementById('previewEnseigne');
        if (previewEnseigne) {
            const ratio = configurateur.configuration.largeur / configurateur.configuration.hauteur;
            previewEnseigne.style.aspectRatio = `${ratio}`;
            
            const previewFond = previewEnseigne.querySelector('.preview-fond');
            if (previewFond) {
                previewFond.style.backgroundColor = configurateur.configuration.couleurFond;
            }
            
            const previewTexte = previewEnseigne.querySelector('.preview-texte');
            if (previewTexte) {
                previewTexte.textContent = configurateur.configuration.texte;
                previewTexte.style.color = configurateur.configuration.couleurTexte;
                previewTexte.style.fontFamily = getFontFamily(configurateur.configuration.police);
            }
        }
    }
    
    function getFontFamily(police) {
        const fonts = {
            arial: 'Arial, sans-serif',
            montserrat: '"Montserrat", sans-serif',
            roboto: '"Roboto", sans-serif',
            opensans: '"Open Sans", sans-serif'
        };
        return fonts[police] || 'Arial, sans-serif';
    }
    
    function updatePrix() {
        // Calculer le prix total
        let prixTotal = configurateur.prix.base;
        
        // Ajouter le coût du matériau
        prixTotal += configurateur.prix.materiau[configurateur.configuration.materiau] || 0;
        
        // Ajouter le coût de l'éclairage
        prixTotal += configurateur.prix.eclairage[configurateur.configuration.eclairage] || 0;
        
        // Multiplier par la quantité
        prixTotal *= configurateur.configuration.quantite;
        
        // Mettre à jour l'affichage
        updatePriceDisplays(prixTotal);
        
        return prixTotal;
    }
    
    function updatePriceDisplays(prix) {
        // Mettre à jour tous les affichages de prix
        const priceElements = document.querySelectorAll('.price-display');
        priceElements.forEach(el => {
            el.textContent = `${prix}€ HT`;
        });
    }
    
    function updateResume() {
        // Dimensions
        const dimensions = configurateur.configuration.dimensions === 'surmesure' 
            ? `${configurateur.configuration.largeur} x ${configurateur.configuration.hauteur} cm`
            : `${configurateur.configuration.dimensions.replace('x', ' x ')} cm`;
        
        document.getElementById('resumeDimensions').textContent = dimensions;
        
        // Matériau
        const materiaux = {
            pvc: 'PVC Expansé',
            plexiglas: 'Plexiglas',
            aluminium: 'Aluminium'
        };
        document.getElementById('resumeMateriau').textContent = materiaux[configurateur.configuration.materiau] || 'PVC Expansé';
        
        // Éclairage
        const eclairages = {
            aucun: 'Aucun',
            led: 'LED Blanc',
            'led-color': 'LED RGB'
        };
        document.getElementById('resumeEclairage').textContent = eclairages[configurateur.configuration.eclairage] || 'Aucun';
        
        // Texte et police
        document.getElementById('resumeTexte').textContent = configurateur.configuration.texte;
        
        const polices = {
            arial: 'Arial',
            montserrat: 'Montserrat',
            roboto: 'Roboto',
            opensans: 'Open Sans'
        };
        document.getElementById('resumePolice').textContent = polices[configurateur.configuration.police] || 'Arial';
        
        // Instructions
        document.getElementById('resumeInstructions').textContent = 
            configurateur.configuration.instructions || 'Aucune';
        
        // Prix total
        const prixTotal = updatePrix();
        document.getElementById('resumeTotal').textContent = `${prixTotal}€ HT`;
    }
    
    function setupPanier() {
        // Gestion de la quantité
        const qtyButtons = document.querySelectorAll('.qty-btn');
        const qtyInput = document.getElementById('quantite');
        
        qtyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                let value = parseInt(qtyInput.value);
                
                if (action === 'increase') {
                    value = Math.min(value + 1, 10);
                } else {
                    value = Math.max(value - 1, 1);
                }
                
                qtyInput.value = value;
                configurateur.configuration.quantite = value;
                updatePrix();
            });
        });
        
        if (qtyInput) {
            qtyInput.addEventListener('input', function() {
                let value = parseInt(this.value);
                value = Math.max(1, Math.min(10, value));
                this.value = value;
                configurateur.configuration.quantite = value;
                updatePrix();
            });
        }
        
        // Ajout au panier
        const addToCartBtn = document.getElementById('addToCart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                addToCart();
            });
        }
        
        // Voir le panier
        const viewCartBtn = document.getElementById('viewCart');
        if (viewCartBtn) {
            viewCartBtn.addEventListener('click', function() {
                openCartModal();
            });
        }
    }
    
    function addToCart() {
        // Récupérer la configuration actuelle
        const produit = {
            id: Date.now(),
            type: 'enseigne',
            configuration: { ...configurateur.configuration },
            prix: updatePrix(),
            date: new Date().toISOString()
        };
        
        // Récupérer le panier du localStorage
        let panier = JSON.parse(localStorage.getItem('panier-atelier-enseigne')) || [];
        
        // Ajouter le produit
        panier.push(produit);
        
        // Sauvegarder
        localStorage.setItem('panier-atelier-enseigne', JSON.stringify(panier));
        
        // Mettre à jour l'affichage du panier
        updateCartDisplay();
        
        // Afficher un message de confirmation
        alert('Produit ajouté au panier !');
        
        // Optionnel: Ouvrir le panier
        openCartModal();
    }
    
    function updateCartDisplay() {
        const panier = JSON.parse(localStorage.getItem('panier-atelier-enseigne')) || [];
        const cartCount = document.querySelector('.cart-count');
        const cartEmpty = document.getElementById('cartEmpty');
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
                        <p>Total : <strong>${total}€ HT</strong></p>
                    </div>
                `;
            }
        }
    }
    
    function openCartModal() {
        const modal = document.getElementById('cartModal');
        const modalBody = document.getElementById('cartModalBody');
        const panier = JSON.parse(localStorage.getItem('panier-atelier-enseigne')) || [];
        
        if (modal && modalBody) {
            if (panier.length === 0) {
                modalBody.innerHTML = '<p>Votre panier est vide</p>';
            } else {
                let html = '<div class="cart-modal-items">';
                let total = 0;
                
                panier.forEach((item, index) => {
                    total += item.prix;
                    html += `
                        <div class="cart-modal-item">
                            <div class="item-info">
                                <h4>Enseigne personnalisée</h4>
                                <p>Dimensions: ${item.configuration.dimensions === 'surmesure' 
                                    ? `${item.configuration.largeur}x${item.configuration.hauteur} cm` 
                                    : item.configuration.dimensions}</p>
                                <p>Matériau: ${item.configuration.materiau}</p>
                                <p>Prix: ${item.prix}€ HT</p>
                            </div>
                            <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                });
                
                html += `
                    <div class="cart-modal-total">
                        <strong>Total : ${total}€ HT</strong>
                    </div>
                `;
                
                modalBody.innerHTML = html;
                
                // Ajouter les événements pour supprimer les items
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        removeFromCart(index);
                    });
                });
            }
            
            modal.style.display = 'block';
            
            // Fermer le modal
            const closeBtn = document.querySelector('.modal-close');
            const continueBtn = document.getElementById('continueShopping');
            const checkoutBtn = document.getElementById('proceedCheckout');
            
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
    
    function removeFromCart(index) {
        let panier = JSON.parse(localStorage.getItem('panier-atelier-enseigne')) || [];
        panier.splice(index, 1);
        localStorage.setItem('panier-atelier-enseigne', JSON.stringify(panier));
        updateCartDisplay();
        openCartModal(); // Recharger le modal
    }
    
    // Initialiser l'affichage du panier
    updateCartDisplay();
});