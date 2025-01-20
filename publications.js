document.addEventListener("DOMContentLoaded", function () {
  // Bind Fancybox for publications gallery
  Fancybox.bind('[data-fancybox^="publication-"]', {
    hideScrollbar: false, // Prevent scrollbars from disappearing
    autoFocus: false, // Disable automatic focus on input elements
    Thumbs: { autoStart: false }, // Thumbnails are available but don't open by default
    Toolbar: true, // Enable toolbar with default actions
    arrows: true, // Display navigation arrows
    dragToClose: true, // Allow dragging to close
    Image: {
      zoom: false, // Enable zooming on double click
      click: 'next', // Clicking the image moves to the next slide
    },
    Carousel: {
      friction: 0, // Smooth slide transitions
    },
    click: false, // Disable default click behavior
    infinite: true, // Enable looping through images
  });

  // Custom handler for background clicks
  document.addEventListener('click', function (event) {
    // Check if the click is within a Fancybox slide container
    const fancyboxSlide = event.target.closest('.fancybox__slide');
    const fancyboxContainer = event.target.closest('.fancybox__container');

    if (fancyboxContainer && fancyboxSlide && !event.target.closest('.fancybox__content')) {
      // If clicked outside the image/content, move to the next slide
      const instance = Fancybox.getInstance();
      if (instance) {
        instance.next();
        event.preventDefault();
      }
    }
  });
});
