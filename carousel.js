document.addEventListener('DOMContentLoaded', () => {

  // Initialize all carousels
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carousel => {
    console.log('Initializing carousel for:', carousel);
      // Initialize the carousel with Bootstrap's functionality, disabling auto-sliding
      const bootstrapCarousel = new bootstrap.Carousel(carousel, {
        interval: false, // Disable auto-sliding
        touch: true // Enable swipe on mobile
      });



    // In case images are not the full width of carousel
    const clickAreas = carousel.querySelectorAll('.carousel-click-area');
    clickAreas.forEach(area => {
      area.addEventListener('click', function(event) {
        event.stopPropagation(); // ensures click on the .carousel-click-area element doesn’t trigger any other click event listeners higher up in the DOM
        console.log('Click area clicked:', this.classList);
        if (this.classList.contains('left')) {
          console.log('Navigating to previous item (via click area)');
          bootstrapCarousel.prev();
        } else {
          console.log('Navigating to next item (via click area)');
          bootstrapCarousel.next();
        }
      });
    });
  });
});
