document.addEventListener("DOMContentLoaded", function () {
  // Check if the current page is the publications page
  if (window.location.pathname.includes("publications")) {
    document.body.classList.add("publications-page"); // Add the page-specific class

    const catalogueGroups = document.querySelectorAll('[data-fancybox^="catalogue-"]');
    catalogueGroups.forEach((group) => {
      const catalogueId = group.getAttribute('data-fancybox');

      // Bind Fancybox for catalogue groups
      Fancybox.bind(`[data-fancybox="${catalogueId}"]`, {
        baseClass: "fancybox-publications", // Custom class for publications
        hideScrollbar: false,
        autoFocus: false,
        Thumbs: { autoStart: false },

        arrows: true,
        dragToClose: true,
        Image: {
          zoom: false,
          click: "next",
        },
        Carousel: {
          friction: 0,
        },
        click: false,
        infinite: true,

        on: {
          init: (fancybox) => {
            // This will apply the custom dark background on the publications page only
            if (document.body.classList.contains("publications-page")) {
              const backdrop = document.querySelector(".fancybox__backdrop");
              if (backdrop) {
                backdrop.style.backgroundColor = " #131313"; // Apply dark background
                backdrop.style.setProperty('background-color', ' #131313', 'important');

              }
            }
            console.log("Fancybox initialized with baseClass:", fancybox.options.baseClass);
          },
          destroy: (fancybox) => {
            // Reset the background color when Fancybox is destroyed
            const backdrop = document.querySelector(".fancybox__backdrop");
            if (backdrop) {
              backdrop.style.backgroundColor = ""; // Reset background color
            }
          },
        },
      });
    }); // Closing bracket for forEach loop
  } // Closing bracket for if (window.location.pathname.includes("publications"))

  // Restore focus to the last focused element when Fancybox is closed
  let lastFocusedElement;
  document.addEventListener("fancybox:open", function () {
    lastFocusedElement = document.activeElement;
  });

  document.addEventListener("fancybox:close", function () {
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  });

  // Custom handler for background clicks inside Fancybox
  document.addEventListener("click", function (event) {
    const fancyboxSlide = event.target.closest(".fancybox__slide");
    const fancyboxContainer = event.target.closest(".fancybox__container");

    if (fancyboxContainer && fancyboxSlide && !event.target.closest(".fancybox__content")) {
      const instance = Fancybox.getInstance();
      if (instance) {
        instance.next(); // Move to the next slide
        event.preventDefault();
      }
    }
  });
});
