document.addEventListener("DOMContentLoaded", function () {
  console.log("publications.js is running...");
  console.log("DOM fully loaded!");

  if (window.location.pathname.includes("publications")) {
    document.body.classList.add("publications-page");
  }

  function updateGalleryForMobile() {
    const isMobile = window.matchMedia("(max-width: 992px)").matches;
    const publicationItems = document.querySelectorAll(".publication-image-container a");

    publicationItems.forEach((item) => {
      if (isMobile) {
        // Disable Fancybox on mobile
        item.removeAttribute("data-fancybox");
        item.style.pointerEvents = "none";
        item.classList.add("disabled-fancybox");
      } else {
        // Restore Fancybox on desktop
        if (!item.getAttribute("data-fancybox")) {
          const catalogueId = item.closest(".publication-image-container").getAttribute("data-catalogue-id");
          if (catalogueId) {
            item.setAttribute("data-fancybox", `catalogue-${catalogueId}`);
          }
        }
        item.style.pointerEvents = "auto";
        item.classList.remove("disabled-fancybox");
      }
    });

    // Toggle mobile slideshow display
    document.querySelectorAll(".mobile-slideshow").forEach((slideshow) => {
      slideshow.style.display = isMobile ? "flex" : "none";
    });

    // Rebind Fancybox on desktop
    if (!isMobile) {
      updateFancybox();
    }
  }

  function updateFancybox() {
    const fancyboxOptions = {
      customClass: "publications-page",
      hideScrollbar: false,
      autoFocus: false,
      Thumbs: false,
      slideshow: true,
      fullScreen: false,
      zoom: false,
      Toolbar: { display: ["close", "counter"] },
      arrows: true,
      dragToClose: true,
      Image: { zoom: false, click: "next" },
      Carousel: { friction: 0 },
      click: false,
      infinite: true,

      on: {
        init: (fancybox) => {
          // Apply custom dark background on publications page
          if (document.body.classList.contains("publications-page")) {
            const backdrop = document.querySelector(".fancybox__backdrop");
            if (backdrop) {
              backdrop.classList.add("publications-backdrop");
              backdrop.style.setProperty("background-color", "#131313", "important");
            }
          }
          console.log("Fancybox initialized with baseClass:", fancybox.options.baseClass);
        },
        destroy: () => {
          // Reset the background color when Fancybox is destroyed
          const backdrop = document.querySelector(".publications__backdrop");
          if (backdrop) {
            backdrop.classList.remove("publications-backdrop");
            backdrop.style.backgroundColor = "";
          }
        },
      },
    };

    // Bind Fancybox to catalogue images
    Fancybox.bind('[data-fancybox^="catalogue-"]', fancyboxOptions);
  }

  // Run the function initially and on resize
  updateGalleryForMobile();
  window.addEventListener("resize", updateGalleryForMobile);

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

  // Mobile slideshow functionality
  document.querySelectorAll(".mobile-slideshow").forEach((slideshow) => {
    console.log("Checking slideshow:", slideshow);

    const publicationItem = slideshow.closest(".publication-item");
    if (!publicationItem) {
      console.warn("Publication item not found for:", slideshow);
      return;
    }

    const indicatorsContainer = publicationItem.querySelector(".carousel-indicators-publications");
    if (!indicatorsContainer) {
      console.warn("Indicators container not found for:", slideshow);
      return;
    }

    console.log("Indicators container found:", indicatorsContainer);

    const indicators = indicatorsContainer.querySelectorAll(".indicator-publications");
    let currentIndex = 0;

    function updateIndicators(index) {
      indicators.forEach((indicator) => indicator.classList.remove("active"));
      if (indicators[index]) {
        indicators[index].classList.add("active");
      }
    }

    slideshow.addEventListener("scroll", () => {
      const scrollLeft = slideshow.scrollLeft;
      const slideWidth = slideshow.offsetWidth;
      const newIndex = Math.round(scrollLeft / slideWidth);

      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        updateIndicators(currentIndex);
      }
    });

    updateIndicators(0);
  });
});
