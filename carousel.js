document.addEventListener('DOMContentLoaded', () => {
  // Initialize all carousels
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carousel => {
    // Log the first active carousel item for debugging
    console.log("Initializing carousel with interval: false");


      // Initialize the carousel with Bootstrap's functionality, disabling auto-sliding
      const bootstrapCarousel = new bootstrap.Carousel(carousel, {
        interval: false, // Disable auto-sliding
        touch: true // Enable swipe on mobile
      });

      console.log(bootstrapCarousel._config.interval);
    // Add click event listeners to images for custom navigation
    const images = carousel.querySelectorAll('.carousel-item img');
    images.forEach(image => {
      image.addEventListener('click', function(event) {
        const rect = image.getBoundingClientRect();
        const x = event.clientX - rect.left;
        if (x < rect.width / 2) {
          $(carousel).carousel('prev'); // Navigate to previous carousel item
        } else {
          $(carousel).carousel('next'); // Navigate to next carousel item
        }
      });
    });
   });
});
