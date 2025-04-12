// Function to get a random hex color
function getRandomHexColor() {
  const colors = ["#B0C3E5", "#FFB3EB", "#F3F2E3", "#6CC59B"];
  return colors[Math.floor(Math.random() * colors.length)];
}




// Add hover effect and click events for work cards
let lastClickedCard = null;
const cards = document.querySelectorAll('.work-card');

cards.forEach(card => {
  let storedColor = "";

  // Hover effect for all screens
  card.addEventListener("mouseover", function () {
    this.style.backgroundColor = getRandomHexColor();
  });

  card.addEventListener("mouseout", function () {
    this.style.backgroundColor = lastClickedCard === this ? storedColor : "";
  });

  // Click event to open the modal
  card.addEventListener("click", function () {
    const title = this.getAttribute("data-title");
    const date = this.getAttribute("data-date");
    const summary = this.getAttribute("data-summary");
    const link = this.getAttribute("data-link");

    openModal(title, date, summary, link);

    // Assign a color when clicked
    storedColor = getRandomHexColor();
    this.style.backgroundColor = storedColor;

    if (lastClickedCard && lastClickedCard !== this) {
      lastClickedCard.style.backgroundColor = "";
    }

    lastClickedCard = this;
  });
});

// Modal functions
function openModal(title, date, summary, link) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-date").textContent = date;
  document.getElementById("modal-summary").textContent = summary;
  document.getElementById("modal-link").href = link;

  document.getElementById("articleModal").style.display = "block";
}

const modal = document.getElementById("articleModal");
const closeButton = document.querySelector(".close-modal");

closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Setup expandable work cards (applies to all screen sizes)
function setupExpandableWorkCards() {
  document.querySelectorAll('.work-cards-container').forEach(container => {
    const workCards = container.querySelectorAll('.work-card:not(.arrow-card)');
    const arrowCard = container.querySelector('.arrow-card');

    if (arrowCard) {
      arrowCard.addEventListener("click", (event) => {
        event.stopPropagation();
        const isExpanded = arrowCard.dataset.expanded === 'true';

        if (!isExpanded) {
          workCards.forEach(card => card.classList.remove("hidden-card"));
          arrowCard.dataset.expanded = 'true';
        } else {
          workCards.forEach((card, index) => {
            if (index > 2) card.classList.add("hidden-card");
          });
          arrowCard.dataset.expanded = "false";
        }
      });
    }
  });
}

// Prevent click propagation on arrow card
document.addEventListener("click", (event) => {
  if (event.target.closest(".arrow-card")) {
    event.stopPropagation();
  }
});

// Function to assign a random color to categories beyond the first four
function styleCategoriesWithRandomColor() {
  const firstFourCategories = [
    'category-digitale-kommunikation',
    'category-multimedia',
    'category-online-journalismus',
    'category-print-journalismus'
  ];

  document.querySelectorAll('.category').forEach(category => {
    // If the category is not one of the first four, assign a random color
    if (!firstFourCategories.includes(category.id)) {
      category.style.backgroundColor = getRandomHexColor();
    }
  });
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  styleCategoriesWithRandomColor();
  setupExpandableWorkCards();

  })
