document.addEventListener("DOMContentLoaded", function () {


  // Handle Fancybox Setup for Different Devices
  function updateGalleryForMobile() {
      const isTabletOrMobile = window.matchMedia("(max-width: 992px)").matches;
      const workItems = document.querySelectorAll(".work-item a");

      workItems.forEach((item) => {
          if (!item.dataset.originalFancybox) {
              item.dataset.originalFancybox = item.getAttribute("data-fancybox");
          }

          if (isTabletOrMobile) {
              item.removeAttribute("data-fancybox");
              item.style.pointerEvents = "none";
              item.classList.add("disabled-fancybox");
          } else {
              if (item.dataset.originalFancybox) {
                  item.setAttribute("data-fancybox", item.dataset.originalFancybox);
              }
              item.style.pointerEvents = "auto";
              item.classList.remove("disabled-fancybox");
          }
      });


      if (!isTabletOrMobile) {
          resetFancybox();
      }
  }

  // ⭐️ Reset and Initialize Fancybox
  function resetFancybox() {
      if (typeof Fancybox === "undefined") {
          console.error("Fancybox is not defined!");
          return;
      }

      Fancybox.unbind(); // Ensure no duplicate bindings

      Fancybox.bind('[data-fancybox="gallery"]', fancyboxOptions);

      // Bind Installations & Books Separately
      document.querySelectorAll('[data-fancybox^="installation-"], [data-fancybox^="book-"]').forEach(item => {
          Fancybox.bind(`[data-fancybox="${item.getAttribute("data-fancybox")}"]`, fancyboxOptions);
      });

      console.log("Fancybox initialized.");
  }

  // ⭐️ Fancybox Configuration
  const fancyboxOptions = {
      customClass: "gallery-fancybox",
      hideScrollbar: false,
      touch: false,
      autoFocus: false,
      Thumbs: false,
      slideshow: true,
      fullScreen: false,
      trapFocus: false,
      wheel: false,
      zoom: false,
      Toolbar: { display: ["close", "counter"] },
      arrows: true,
      dragToClose: true,
      Image: { zoom: false, click: "next" },
      Carousel: { friction: 0 },
      click: false,
      infinite: true,
      on: {
          click: (fancybox, event) => {
              if (!event.target.closest(".fancybox__content")) {
                  event.preventDefault();
                  fancybox.next();
              }
          },
      },
  };

  // ⭐️ Ensure Fancybox Clicks Work Anywhere (except toolbar)
  document.addEventListener("click", function (event) {
      const fancyboxContainer = document.querySelector(".fancybox__container");

      if (fancyboxContainer && fancyboxContainer.contains(event.target)) {
          if (!event.target.closest(".fancybox__toolbar, .fancybox__button--close")) {
              Fancybox.getInstance()?.next();
          }
      }
  });

  // ⭐️ Filter Functionality
  function setupFilters() {
      const works = document.querySelectorAll(".work-item");
      const filterButtonsContainer = document.getElementById("filter-buttons");

      if (!filterButtonsContainer) return;

      const categoriesSet = new Set([...works].map(work => work.getAttribute("data-category")).filter(Boolean));

      const orderedCategories = ["Installation", "Painting", "Watercolour", "Collage", "Object", "Book", "Drawing", "All"];
      filterButtonsContainer.innerHTML = ""; // Clear existing buttons

      orderedCategories.forEach(category => {
          if (category === "All" || categoriesSet.has(category)) {
              const button = document.createElement("button");
              button.classList.add("filter-button");
              button.textContent = category;

              if (category === "All") {
                  button.classList.add("active");
                  button.setAttribute("data-filter", "");
              } else {
                  button.setAttribute("data-filter", category.toLowerCase());
              }

              filterButtonsContainer.appendChild(button);
          }
      });

      // Add event listeners for filtering
      filterButtonsContainer.addEventListener("click", (event) => {
          if (event.target.classList.contains("filter-button")) {
              filterButtonsContainer.querySelectorAll(".filter-button").forEach(btn => btn.classList.remove("active"));
              event.target.classList.add("active");

              filterWorks(event.target.getAttribute("data-filter").toLowerCase());
          }
      });

      filterWorks(""); // Default filter
  }

  // ⭐️ Filter Work Items Based on Category
  function filterWorks(filter) {
      const works = document.querySelectorAll(".work-item");
      let filteredWorks = [];

      works.forEach(work => {
          const workCategory = work.getAttribute("data-category")?.toLowerCase();
          const mobileCaption = work.nextElementSibling;
          const workLinks = work.querySelectorAll("a");

          if (filter === "" || workCategory === filter) {
              work.classList.remove("visually-hidden");
              if (mobileCaption?.classList.contains("mobile-caption")) {
                  mobileCaption.classList.remove("visually-hidden");
              }

              workLinks.forEach(link => {
                  if (["installation", "book"].includes(workCategory)) {
                      filteredWorks.push(link);
                  } else {
                      link.setAttribute("data-fancybox", `filtered-${filter}`);
                      filteredWorks.push(link);
                  }
              });
          } else {
              work.classList.add("visually-hidden");
              if (mobileCaption?.classList.contains("mobile-caption")) {
                  mobileCaption.classList.add("visually-hidden");
              }
          }
      });

      // Rebind Fancybox for Filtered Works
      setTimeout(() => {
          Fancybox.unbind();
          Fancybox.bind(`[data-fancybox="filtered-${filter}"]`, fancyboxOptions);

          document.querySelectorAll('[data-fancybox^="installation-"], [data-fancybox^="book-"]').forEach(item => {
              Fancybox.bind(`[data-fancybox="${item.getAttribute("data-fancybox")}"]`, fancyboxOptions);
          });

          resetFancybox();
      }, 100);
  }

  // ⭐️ Initialize Mobile Slideshow Indicators
  function setupSlideshowIndicators() {
      document.querySelectorAll(".mobile-view .mobile-slideshow-works").forEach(slideshow => {
          const workItem = slideshow.closest(".work-item");
          const indicatorsContainer = workItem?.querySelector(".carousel-indicators-works");

          if (!indicatorsContainer) return;

          const indicators = indicatorsContainer.querySelectorAll(".indicator-works");
          let currentIndex = 0;

          function updateIndicators(index) {
              indicators.forEach(indicator => indicator.classList.remove("active"));
              indicators[index]?.classList.add("active");
          }

          slideshow.addEventListener("scroll", () => {
              let newIndex = Math.round(slideshow.scrollLeft / slideshow.offsetWidth);
              if (newIndex !== currentIndex) {
                  currentIndex = newIndex;
                  updateIndicators(currentIndex);
              }
          });

          updateIndicators(0);
      });
  }

  // ⭐️ Initialize Functions
  setTimeout(() => {
      updateGalleryForMobile();
      resetFancybox();
      setupFilters();
      setupSlideshowIndicators();
  }, 500);

  window.addEventListener("resize", updateGalleryForMobile);
});
