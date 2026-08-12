/* =================================================================
   MedCare Clinic - Testimonials Carousel Module
   ================================================================ */

const track = document.querySelector('.carousel-track');
const cards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.carousel-controls .carousel-btn:first-child');
const nextBtn = document.querySelector('.carousel-controls .carousel-btn:last-child');

if (track && cards.length > 0 && prevBtn && nextBtn) {
  let currentIndex = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  nextBtn.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateCarousel();
    } else {
      currentIndex = 0;
      updateCarousel();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    } else {
      currentIndex = cards.length - 1;
      updateCarousel();
    }
  });
}
