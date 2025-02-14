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



    // Separate the image into left and right areas
    const images = carousel.querySelectorAll('.carousel-item img');
    images.forEach(image => {
      image.addEventListener('click', function(event) {
        console.log('Image clicked: ', image.src);
        console.log('Event object:', event);
        const rect = image.getBoundingClientRect();
        const x = event.clientX - rect.left;
        console.log('Click position: ', x);
        if (x < rect.width / 2) {
          console.log('Navigating to previous item');
          bootstrapCarousel.prev();
        } else {
          console.log('Navigating to next item');
          bootstrapCarousel.next();
        }
      });
    });

    // In case images are not the full width of carousel
    const clickAreas = carousel.querySelectorAll('.carousel-click-area');
    clickAreas.forEach(area => {
      area.addEventListener('click', function(event) {
        event.stopPropagation();
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
