document.addEventListener('DOMContentLoaded', () => {

  const galerie = document.getElementById('galerieGrid');
  const pagination = document.getElementById('pagination');
  if (!galerie || !pagination) return;

  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;
  let currentCategory = 'tous';

  /* =========================
     LISTE DES RÉALISATIONS
  ========================== */
  const realisations = [
    { file: 'enseigne-1 (1).jpg', categorie: 'enseignes', titre: 'Enseigne lumineuse' },
    { file: 'enseigne-1 (2).jpg', categorie: 'enseignes', titre: 'Enseigne façade' },
    { file: 'enseigne-1 (3).jpg', categorie: 'enseignes', titre: 'Enseigne boutique' },
	{ file: 'enseigne-1 (4).jpg', categorie: 'enseignes', titre: 'Enseigne lumineuse' },
    { file: 'enseigne-1 (5).jpg', categorie: 'enseignes', titre: 'Enseigne façade' },
    { file: 'enseigne-1 (6).jpg', categorie: 'enseignes', titre: 'Enseigne boutique' },
	{ file: 'enseigne-1 (7).jpg', categorie: 'enseignes', titre: 'Enseigne lumineuse' },
    { file: 'enseigne-1 (8).jpg', categorie: 'enseignes', titre: 'Enseigne façade' },
    { file: 'enseigne-1 (9).jpg', categorie: 'enseignes', titre: 'Enseigne boutique' },
	{ file: 'enseigne-1 (10).jpg', categorie: 'enseignes', titre: 'Enseigne lumineuse' },
    { file: 'enseigne-1 (11).jpg', categorie: 'enseignes', titre: 'Enseigne façade' },
    { file: 'enseigne-1 (12).jpg', categorie: 'enseignes', titre: 'Enseigne boutique' },
	{ file: 'enseigne-1 (13).jpg', categorie: 'enseignes', titre: 'Enseigne lumineuse' },
    { file: 'enseigne-1 (14).jpg', categorie: 'enseignes', titre: 'Enseigne façade' },
    { file: 'enseigne-1 (15).jpg', categorie: 'enseignes', titre: 'Enseigne boutique' },
	{ file: 'enseigne-1 (16).jpg', categorie: 'enseignes', titre: 'Enseigne lumineuse' },
    { file: 'enseigne-1 (17).jpg', categorie: 'enseignes', titre: 'Enseigne façade' },
    { file: 'enseigne-1 (18).jpg', categorie: 'enseignes', titre: 'Enseigne boutique' },
	{ file: 'enseigne-1 (19).jpg', categorie: 'enseignes', titre: 'Enseigne lumineuse' },
    { file: 'enseigne-1 (20).jpg', categorie: 'enseignes', titre: 'Enseigne façade' },
    { file: 'enseigne-1 (21).jpg', categorie: 'enseignes', titre: 'Enseigne boutique' },
	{ file: 'enseigne-1 (22).jpg', categorie: 'enseignes', titre: 'Enseigne lumineuse' },
    { file: 'enseigne-1 (23).jpg', categorie: 'enseignes', titre: 'Enseigne façade' },
    { file: 'enseigne-1 (24).jpg', categorie: 'enseignes', titre: 'Enseigne boutique' },
	{ file: 'enseigne-1 (25).jpg', categorie: 'enseignes', titre: 'Enseigne lumineuse' },
    { file: 'enseigne-1 (26).jpg', categorie: 'enseignes', titre: 'Enseigne façade' },
    { file: 'enseigne-1 (27).jpg', categorie: 'enseignes', titre: 'Enseigne boutique' },
	{ file: 'enseigne-1 (28).jpg', categorie: 'enseignes', titre: 'Enseigne lumineuse' },
    { file: 'enseigne-1 (29).jpg', categorie: 'enseignes', titre: 'Enseigne façade' },
	  
    { file: 'Autocollants (1).jpg', categorie: 'marquage', titre: 'Autocollants vitrine' },
    { file: 'Autocollants (2).jpg', categorie: 'marquage', titre: 'Autocollants logo' },
	{ file: 'Autocollants (3).jpg', categorie: 'marquage', titre: 'Autocollants vitrine' },
    { file: 'Autocollants (4).jpg', categorie: 'marquage', titre: 'Autocollants logo' },

    { file: 'Store-banner-1 (1).jpg', categorie: 'store-banne', titre: 'Store banne' },
	{ file: 'Store-banner-1 (2).jpg', categorie: 'store-banne', titre: 'Store banne' },

    { file: 'Vitrophanie-1.jpg', categorie: 'vitrophanie', titre: 'Vitrophanie magasin' },
	{ file: 'Vitrophanie-2.jpg', categorie: 'vitrophanie', titre: 'Vitrophanie magasin' },
	  
	  // VIDÉO (AJOUT ICI)
  {
    type: 'video',
    poster: 'video-enseigne.jpg',
    video: 'Video-1 (1).mp4',
    categorie: 'enseignes',
    titre: 'Enseigne lumineuse'
  }
  ];


  /* =========================
     RENDER GALERIE
  ========================== */
  function renderGallery() {
    galerie.innerHTML = '';

    const filtered = currentCategory === 'tous'
      ? realisations
      : realisations.filter(item => item.categorie === currentCategory);

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    filtered.slice(start, end).forEach(item => {
      const card = document.createElement('div');
      card.className = 'projet-card';

      if (item.type === 'video') {
  card.innerHTML = `
    <a href="../videos/${item.video}"
       class="lightbox-link video"
       data-title="${item.titre}"
       data-type="video">
      <div class="projet-image">
        <img src="../images/realisations/${item.poster}" alt="${item.titre}">
        <div class="video-icon">▶</div>
        <div class="projet-overlay">
          <span>${item.titre}</span>
        </div>
      </div>
    </a>
  `;
} else {
  card.innerHTML = `
    <a href="../images/realisations/${item.file}"
       class="lightbox-link"
       data-title="${item.titre}"
       data-type="image">
      <div class="projet-image">
        <img src="../images/realisations/${item.file}" alt="${item.titre}">
        <div class="projet-overlay">
          <span>${item.titre}</span>
        </div>
      </div>
    </a>
  `;
}


      galerie.appendChild(card);
    });

    renderPagination(filtered.length);
  }

  /* =========================
     PAGINATION
  ========================== */
  function renderPagination(totalItems) {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn';
      if (i === currentPage) btn.classList.add('active');
      btn.textContent = i;

      btn.addEventListener('click', () => {
        currentPage = i;
        renderGallery();
        window.scrollTo({ top: galerie.offsetTop - 120, behavior: 'smooth' });
      });

      pagination.appendChild(btn);
    }
  }

  /* =========================
     FILTRES
  ========================== */
  document.querySelectorAll('.filtre-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtre-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentCategory = btn.dataset.categorie;
      currentPage = 1;
      renderGallery();
    });
  });

  /* INIT */
  renderGallery();

});