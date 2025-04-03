// Function to get a random hex color
function getRandomHexColor() {
  const colors = ["#B0C3E5", "#FFB3EB", "#F3F2E3", "#6CC59B"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Function to update category title background color based on screen size
function updateCategoryTitleColor() {
  const isTabletOrMobile = window.matchMedia("(max-width: 992px)").matches;
  const categoryTitles = document.querySelectorAll(".category-title");

  categoryTitles.forEach(category => {
    if (isTabletOrMobile) {
      category.style.backgroundColor = "#D1BCFF"; // Set color on mobile/tablet
    } else {
      category.style.backgroundColor = ""; // Reset color on larger screens
    }
  });
}

// Function to toggle work cards visibility on mobile/tablet
function toggleWorks(event) {
  const isTabletOrMobile = window.matchMedia("(max-width: 992px)").matches;
  if (!isTabletOrMobile) return; // Exit early if not on mobile/tablet

  const categoryDiv = event.currentTarget.closest('.category');
  const workContainer = categoryDiv.nextElementSibling;

  if (workContainer && workContainer.classList.contains('work-cards-container')) {
    workContainer.classList.toggle('active');
  }
}

// Add event listeners for category titles that should toggle the work cards on mobile
function setupMobileToggle() {
  const isTabletOrMobile = window.matchMedia("(max-width: 992px)").matches;
  const categories = document.querySelectorAll('.category:not(#category-articles)');

  categories.forEach(category => {
    const button = category.querySelector('.category-title');

    if (!button) return;

    button.removeEventListener('click', toggleWorks); // Remove any existing listeners
    category.removeEventListener('click', toggleWorks); // Remove any existing listeners
    if (isTabletOrMobile) {
    // Assign a random hex color to the button
    button.style.backgroundColor = getRandomHexColor();
    button.addEventListener('click', toggleWorks);
    } else {
      button.addEventListener('click', toggleWorks);
     // Desktop reset
     button.style.backgroundColor = '';
     category.style.backgroundColor = '';
   }
 });
}

// Run the updateCategoryTitleColor on page load
updateCategoryTitleColor();

// Listen for screen size changes to update category title color and toggle behavior
window.addEventListener('load', () => {
  setupMobileToggle();
  window.matchMedia('(max-width: 992px)').addEventListener('change', setupMobileToggle);
});

// Add hover effect for desktop (non-mobile)
let lastClickedCard = null;
const cards = document.querySelectorAll('.work-card');
cards.forEach(card => {
  let storedColor = "";

  // Hover effect for desktop
  card.addEventListener("mouseover", function () {
    const isTabletOrMobile = window.matchMedia("(max-width: 992px)").matches;
    if (!isTabletOrMobile) {
      this.style.backgroundColor = getRandomHexColor();
    }
  });

  // Desktop hover effect when mouse moves away
  card.addEventListener("mouseout", function () {
    const isTabletOrMobile = window.matchMedia("(max-width: 992px)").matches;
    if (!isTabletOrMobile) {
      this.style.backgroundColor = lastClickedCard === this ? storedColor : "";
    }
  });

  card.addEventListener("click", function () {
    const title = this.getAttribute("data-title");
    const date = this.getAttribute("data-date");
    const summary = this.getAttribute("data-summary");
    const link = this.getAttribute("data-link");

    openModal(title, date, summary, link);

    // Assign a color when clicked
    storedColor = getRandomHexColor();
    this.style.backgroundColor = storedColor;

    // Remove color from the previous card
    if (lastClickedCard && lastClickedCard !== this) {
      lastClickedCard.style.backgroundColor = "";
    }

    lastClickedCard = this; // Update last clicked card
  });
});

function openModal(title, date, summary, link) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-date").textContent = date;
  document.getElementById("modal-summary").textContent = summary;
  document.getElementById("modal-link").href = link;

  document.getElementById("articleModal").style.display = "block";
}

const modal = document.getElementById("articleModal");
const closeButton = document.querySelector(".close-modal");



closeButton.addEventListener("click", function () {
  modal.style.display = "none";
});

// Close the modal when clicked anywhere outside the modal
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
