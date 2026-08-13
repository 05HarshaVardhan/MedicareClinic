/* =================================================================
   MedCare Clinic - Testimonials Carousel Module
   ================================================================ */

const carouselContainer = document.querySelector('.carousel-container');
const track = document.querySelector('.carousel-track');
const cards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.carousel-controls .carousel-btn:first-child');
const nextBtn = document.querySelector('.carousel-controls .carousel-btn:last-child');

if (track && cards.length > 0 && prevBtn && nextBtn) {
  let currentIndex = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    cards.forEach((card, index) => {
      if (index === currentIndex) {
        card.removeAttribute('aria-hidden');
      } else {
        card.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function goToNext() {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  }

  function goToPrev() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = cards.length - 1;
    }
    updateCarousel();
  }

  nextBtn.addEventListener('click', goToNext);
  prevBtn.addEventListener('click', goToPrev);

  if (carouselContainer) {
    carouselContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        currentIndex = 0;
        updateCarousel();
      } else if (e.key === 'End') {
        e.preventDefault();
        currentIndex = cards.length - 1;
        updateCarousel();
      }
    });
  }

  updateCarousel();
}
