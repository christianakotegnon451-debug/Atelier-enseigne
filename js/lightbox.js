document.addEventListener('DOMContentLoaded', function () {

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');

  let currentImages = [];
  let currentIndex = 0;

  // OUVERTURE LIGHTBOX (images injectées)
  document.addEventListener('click', function (e) {
    const link = e.target.closest('.lightbox-link');
    if (!link) return;

    e.preventDefault();

    const gallery = link.closest('.galerie-grid');
    currentImages = Array.from(gallery.querySelectorAll('.lightbox-link'));
    currentIndex = currentImages.indexOf(link);

    openLightbox(
  link.href,
  link.dataset.title,
  link.dataset.type
);


  });

  function openLightbox(src, caption, type = 'image') {
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  lightboxImage.style.display = 'none';

  const oldVideo = lightbox.querySelector('video');
  if (oldVideo) oldVideo.remove();

  if (type === 'video') {
  const video = document.createElement('video');
  video.src = src;
  video.controls = true;
  video.autoplay = true;
  video.className = 'lightbox-video';

  lightbox.querySelector('.lightbox-content').appendChild(video);
}

}

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextImage() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  const img = currentImages[currentIndex];
  openLightbox(img.href, img.dataset.title, img.dataset.type);
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  const img = currentImages[currentIndex];
  openLightbox(img.href, img.dataset.title, img.dataset.type);
}


  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNextImage);
  lightboxPrev.addEventListener('click', showPrevImage);

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

});
