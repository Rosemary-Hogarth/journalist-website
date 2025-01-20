document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  const navToggle = document.getElementById("navToggle");
  console.log("navToggle element:", navToggle);
  const fullscreenMenu = document.getElementById("fullscreenMenu");

  navToggle.addEventListener("click", () => {
    fullscreenMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  // handle close button on fullscreen menu
  document.getElementById('closeMenu').addEventListener('click', function() {
    fullscreenMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// Create a new MutationObserver
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      const fancyboxOpen = document.querySelector('.fancybox__container') !== null;
      const navToggle = document.getElementById("navToggle");

      if (fancyboxOpen) {
        console.log("Fancybox is open, hiding navToggle");
        navToggle.style.display = 'none';
      } else {
        console.log("Fancybox is closed, showing navToggle");
        navToggle.style.display = 'block';
      }
    }
  });
});

// Start observing the document body for changes
observer.observe(document.body, {
  attributes: true,
  subtree: true,
  childList: true
});
