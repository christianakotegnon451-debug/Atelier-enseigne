// Page contact
document.addEventListener('DOMContentLoaded', function() {
    // Formulaire de contact
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            // Simulation d'envoi
            setTimeout(() => {
                // Masquer le formulaire
                contactForm.style.display = 'none';
                
                // Afficher le message de succès
                contactSuccess.style.display = 'block';
                
                // Réinitialiser le bouton
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Optionnel: Envoyer les données au serveur
                // const formData = new FormData(this);
                // fetch('/api/contact', { method: 'POST', body: formData })
                //   .then(response => response.json())
                //   .then(data => console.log(data));
                
            }, 1500);
        });
    }
    
    // Modal rendez-vous
    const rdvModal = document.getElementById('rdvModal');
    const rdvPhoneBtn = document.getElementById('rdv-phone');
    const rdvAtelierBtn = document.getElementById('rdv-atelier');
    const rdvClose = rdvModal.querySelector('.modal-close');
    const rdvForm = document.getElementById('rdvForm');
    
    // Ouvrir le modal
    if (rdvPhoneBtn) {
        rdvPhoneBtn.addEventListener('click', function() {
            openRdvModal('telephone');
        });
    }
    
    if (rdvAtelierBtn) {
        rdvAtelierBtn.addEventListener('click', function() {
            openRdvModal('atelier');
        });
    }
    
    function openRdvModal(type) {
        // Pré-sélectionner le type
        const typeSelect = document.getElementById('rdv-type');
        if (typeSelect) {
            typeSelect.value = type;
        }
        
        // Afficher le modal
        rdvModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Fermer le modal
    if (rdvClose) {
        rdvClose.onclick = function() {
            rdvModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }
    
    // Fermer en cliquant en dehors
    window.onclick = function(event) {
        if (event.target == rdvModal) {
            rdvModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
    
    // Formulaire rendez-vous
    if (rdvForm) {
        rdvForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les données
            const formData = new FormData(this);
            
            // Simulation d'envoi
            alert('Demande de rendez-vous envoyée ! Nous vous confirmons par email.');
            
            // Fermer le modal
            rdvModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Réinitialiser le formulaire
            this.reset();
            
            // Optionnel: Envoyer au serveur
            // fetch('/api/rdv', { method: 'POST', body: formData })
        });
    }
    
    // Date minimum pour le rendez-vous (demain)
    const rdvDate = document.getElementById('rdv-date');
    if (rdvDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        rdvDate.min = tomorrow.toISOString().split('T')[0];
        
        // Maximum 3 mois à l'avance
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        rdvDate.max = maxDate.toISOString().split('T')[0];
    }
    
    // FAQ Contact - Accordéon
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        
        if (question) {
            question.addEventListener('click', function() {
                // Fermer tous les autres
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                    }
                });
                
                // Ouvrir/fermer celui-ci
                item.classList.toggle('active');
            });
        }
    });
});