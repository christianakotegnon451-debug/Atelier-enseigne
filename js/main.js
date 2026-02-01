/**
 * L'Atelier de l'Enseigne - Script Principal
 * Nettoyé, ordonné, sans modification de logique
 */

document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     1. MENU MOBILE
  ========================= */
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mainNav = document.querySelector(".main-nav");

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener("click", function () {
      mainNav.classList.toggle("active");
      this.classList.toggle("active");
      document.body.classList.toggle("no-scroll");
    });
  }

  const navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mainNav?.classList.remove("active");
      mobileMenuBtn?.classList.remove("active");
      document.body.classList.remove("no-scroll");
    });
  });

  /* =========================
     2. SERVICES BAR STICKY
  ========================= */
  const servicesBar = document.querySelector(".services-bar");

  if (servicesBar) {
    const stickyPoint = servicesBar.offsetTop;

    window.addEventListener("scroll", () => {
      if (window.scrollY >= stickyPoint) {
        servicesBar.classList.add("is-stuck");
        document.body.style.paddingTop = servicesBar.offsetHeight + "px";
      } else {
        servicesBar.classList.remove("is-stuck");
        document.body.style.paddingTop = "0";
      }
    });
  }

  /* =========================
     3. ONGLET / TABS
  ========================= */
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab || button.getAttribute("data-tab");
      if (!target) return;

      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabPanes.forEach(pane => pane.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(target)?.classList.add("active");
    });
  });

  /* =========================
     4. SCROLL ANIMATIONS
  ========================= */
  const animatedElements = document.querySelectorAll(
    ".service-card, .process-step, .stat-item, .expert-card"
  );

  if (animatedElements.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  /* =========================
     5. SCROLL INTERNE
  ========================= */
  document.querySelectorAll(".category-card a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      target?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll(".scroll-to-form").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(btn.getAttribute("href"));
      target?.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* =========================
     6. PERSONNALISATION (FORM)
  ========================= */
  const personalizeBtns = document.querySelectorAll(".personalize-btn");
  const produitField = document.querySelector("#produit");

  personalizeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (produitField) {
        produitField.value = btn.dataset.produit;
      }
    });
  });

  /* =========================
     7. CONFIGURATEUR MODAL
  ========================= */
  const modal = document.getElementById("configuratorModal");
  const openBtns = document.querySelectorAll(".open-configurator");
  const closeBtn = document.querySelector(".close-modal");
  const title = document.getElementById("configuratorTitle");
  const productInput = document.getElementById("productType");

  openBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const product = btn.dataset.product;
      if (!product || !modal) return;

      productInput.value = product;

      if (product === "prenom-led") {
        title.textContent = "Prénom lumineux LED";
      } else if (product === "plaque-deco") {
        title.textContent = "Plaque décorative personnalisée";
      }

      modal.classList.add("active");
    });
  });

  closeBtn?.addEventListener("click", () => {
    modal?.classList.remove("active");
  });

  modal?.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  /* =========================
     8. FORMULAIRE MULTI-ÉTAPES
  ========================= */
  const steps = document.querySelectorAll(".form-step");
  const indicators = document.querySelectorAll(".devis-steps .step");

  function showStep(stepId) {
    steps.forEach(step => step.classList.remove("active"));
    indicators.forEach(ind => ind.classList.remove("active"));

    const activeStep = document.getElementById(stepId);
    if (!activeStep) return;

    activeStep.classList.add("active");

    const index = [...steps].indexOf(activeStep);
    if (indicators[index]) {
      indicators[index].classList.add("active");
    }
  }

  document.querySelectorAll(".next-step").forEach(btn => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.next;
      if (next) showStep(next);
    });
  });

  document.querySelectorAll(".prev-step").forEach(btn => {
    btn.addEventListener("click", () => {
      const prev = btn.dataset.prev;
      if (prev) showStep(prev);
    });
  });

  const form = document.getElementById("devisForm");
  const successMessage = document.getElementById("successMessage");

  if (form && successMessage) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      form.querySelectorAll(".form-step").forEach(step => step.style.display = "none");
      successMessage.style.display = "block";
    });
  }

  /* =========================
     9. VALIDATION STEP 1
  ========================= */
  const step1Btn = document.querySelector('[data-next="step2"]');

  step1Btn?.addEventListener("click", () => {
    const checked = document.querySelector('input[name="service"]:checked');
    if (!checked) {
      alert("Veuillez sélectionner un service.");
    }
  });

});

  document.addEventListener('DOMContentLoaded', () => {

  const galerie = document.querySelector('.galerie-grid');
  if (!galerie) return;

  fetch('../data/realisations.json')
    .then(response => response.json())
    .then(items => {
      items.forEach(item => {

        const card = document.createElement('div');
        card.className = 'projet-card';
        card.dataset.categorie = item.categorie;

        card.innerHTML = `
          <div class="projet-image">
            <img src="../images/realisations/${item.image}" alt="${item.nom}">
            <div class="projet-overlay">
              <span>${item.nom}</span>
            </div>
          </div>
        `;

        galerie.appendChild(card);
      });
    });

});
