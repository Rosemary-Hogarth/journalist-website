document.addEventListener('DOMContentLoaded', function () {


  console.log("DOM fully loaded");

  function updateGalleryForMobile() {
      const isTabletOrMobile = window.matchMedia("(max-width: 992px)").matches;
      const workItems = document.querySelectorAll(".work-item a");

      workItems.forEach((item) => {
          if (!item.dataset.originalFancybox) {
              item.dataset.originalFancybox = item.getAttribute("data-fancybox"); // Store original value
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

      console.log("Mobile Mode:", isTabletOrMobile);
      console.log("Fancybox attributes updated.");

      if (!isTabletOrMobile) {
          resetFancybox();
      }
  }

  function resetFancybox() {
      console.log("Resetting Fancybox...");

      // **Confirm Fancybox is defined before calling methods**
      if (typeof Fancybox === "undefined") {
          console.error("Fancybox is not defined!");
          return;
      }

      // **Ensure there are elements to bind Fancybox to**
      const galleryItems = document.querySelectorAll('[data-fancybox="gallery"]');
      const installationItems = document.querySelectorAll('[data-fancybox^="installation-"]');
      const bookItems = document.querySelectorAll('[data-fancybox^="book-"]');

      console.log("Gallery Items:", galleryItems.length);
      console.log("Installation Items:", installationItems.length);
      console.log("Book Items:", bookItems.length);

      if (galleryItems.length === 0 && installationItems.length === 0 && bookItems.length === 0) {
          console.warn("No Fancybox elements found.");
          return;
      }

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
          Toolbar: {
              display: ["close", "counter"],
          },
          arrows: true,
          dragToClose: true,
          Image: { zoom: false, click: 'next' },
          Carousel: { friction: 0 },
          click: false,
          infinite: true,
          on: {
              click: (fancybox, event) => {
                  if (!event.target.closest('.fancybox__content')) {
                      event.preventDefault();
                      fancybox.next();
                  }
              },
          },
      };

      // **Bind Fancybox only if elements exist**
      Fancybox.bind('[data-fancybox="gallery"]', fancyboxOptions);

      document.querySelectorAll('[data-fancybox^="installation-"], [data-fancybox^="book-"]').forEach(item => {
          Fancybox.bind(`[data-fancybox="${item.getAttribute('data-fancybox')}"]`, fancyboxOptions);
      });

      console.log("Fancybox initialized.");
  }

  // **Ensure Fancybox initializes AFTER elements are available**
  setTimeout(() => {
      updateGalleryForMobile();
      resetFancybox();
  }, 500);

  // **Handle screen resizing properly**
  window.addEventListener("resize", updateGalleryForMobile);






// Filter functionality
const works = document.querySelectorAll('.work-item');
const categoriesSet = new Set();


works.forEach(work => {
  const category = work.getAttribute('data-category');
  if (category) {
    categoriesSet.add(category);
  }
});

const filterButtonsContainer = document.getElementById('filter-buttons');

if (filterButtonsContainer) {
  filterButtonsContainer.innerHTML = ''; // Clear existing buttons

  // Define filter button order
  const orderedCategories = [
    'Installation',
    'Painting',
    'Watercolour',
    'Collage',
    'Object',
    'Book',
    'Drawing',
    'All',
  ];

  // Create buttons in the desired order
  orderedCategories.forEach(category => {
    if (category === 'All' || categoriesSet.has(category)) {
      const button = document.createElement('button');
      button.classList.add('filter-button');

      if (category === 'All') {
        button.classList.add('active'); // Set 'All' as the active button by default
        button.setAttribute('data-filter', '');
      } else {
        button.setAttribute('data-filter', category.toLowerCase());
      }

      button.textContent = category;
      filterButtonsContainer.appendChild(button);
    }
  });

  const filterButtons = document.querySelectorAll('.filter-button');

  // Function to filter works based on the selected filter
  function filterWorks(filter) {
    works.forEach(work => {
      const workCategory = work.getAttribute('data-category')?.toLowerCase();
      const mobileCaption = work.nextElementSibling;

      if (filter === '' || workCategory === filter) {
        work.classList.remove('visually-hidden');
        if (mobileCaption && mobileCaption.classList.contains('mobile-caption')) {
          mobileCaption.classList.remove('visually-hidden');
        }
      } else {
        work.classList.add('visually-hidden');
        if (mobileCaption && mobileCaption.classList.contains('mobile-caption')) {
          mobileCaption.classList.add('visually-hidden');
        }
      }
    });

    // After filtering, update Fancybox bindings
    resetFancybox();
  }


  // Event listener for filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter').toLowerCase();
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      filterWorks(filter);
    });
  });

  // Initial filtering to show all works
  filterWorks('');
}

;

  const slideshows = document.querySelectorAll(".mobile-view .mobile-slideshow-works");
  console.log("Works slideshows found:", slideshows);

  slideshows.forEach(slideshow => {
      console.log("Checking work slideshow:", slideshow);

      // Move up to the closest work-item and then find the indicators
      const workItem = slideshow.closest(".work-item");
      if (!workItem) {
          console.warn("Work item not found for:", slideshow);
          return;
      }

      const indicatorsContainer = workItem.querySelector(".carousel-indicators-works");

      if (!indicatorsContainer) {
          console.warn("Indicators container not found for:", slideshow);
          return; // Stop execution if indicators are missing
      }

      console.log("Indicators container found:", indicatorsContainer);

      const indicators = indicatorsContainer.querySelectorAll(".indicator-works");
      console.log("Indicators found:", indicators);

      let currentIndex = 0;

      function updateIndicators(index) {
          indicators.forEach(indicator => indicator.classList.remove("active"));
          if (indicators[index]) {
              indicators[index].classList.add("active");
          }
      }

      slideshow.addEventListener("scroll", () => {
          let scrollLeft = slideshow.scrollLeft;
          let slideWidth = slideshow.offsetWidth;

          let newIndex = Math.round(scrollLeft / slideWidth);
          console.log("Scrolled to index:", newIndex);

          if (newIndex !== currentIndex) {
              currentIndex = newIndex;
              updateIndicators(currentIndex);
          }
      });

      updateIndicators(0);
  });

})
