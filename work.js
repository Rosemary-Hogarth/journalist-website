// Function to get a random color from a predefined list
function getRandomHexColor() {
  const colors = ["#B0C3E5", "#FFB3EB", "#F3F2E3", "#97D6B8"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Select all work cards
const cards = document.querySelectorAll('.work-card');

// Function to check if the device is mobile or desktop
function isMobile() {
  return window.innerWidth <= 768; // You can adjust this value based on your breakpoint
}

// Loop through each card and add interactivity
cards.forEach(card => {
  // When mouse hovers over a card, apply a random background color
  card.addEventListener("mouseover", function () {
    if (!isMobile()) {
      this.style.backgroundColor = getRandomHexColor();
    }
  });

  // When mouse leaves the card, reset the background
  card.addEventListener("mouseout", function () {
    if (!isMobile()) {
      this.style.backgroundColor = ""; // Reset background color when mouse leaves (only on desktop)
    }
  });

  // When a card is clicked
  card.addEventListener("click", function () {
    // Grab data from the card's custom attributes
    const title = this.getAttribute("data-title");
    const date = this.getAttribute("data-date");
    const summary = this.getAttribute("data-summary");
    const link = this.getAttribute("data-link");

    // Open modal and populate with data
    openModal(title, date, summary, link);

    // Apply color change only on mobile
    if (isMobile()) {
      this.style.backgroundColor = getRandomHexColor();
    } else {
      this.style.backgroundColor = ""; // Reset background color on desktop
    }
  });
});

// Function to populate and show the modal
function openModal(title, date, summary, link) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-date").textContent = date;
  document.getElementById("modal-summary").textContent = summary;
  document.getElementById("modal-link").href = link;

  document.getElementById("articleModal").style.display = "block";
}

// Modal close setup
const modal = document.getElementById("articleModal");
const closeButton = document.querySelector(".close-modal");

// Close when clicking the X button
closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Setup the expandable functionality for work card containers
function setupExpandableWorkCards() {
  document.querySelectorAll('.work-cards-container').forEach(container => {
    const workCards = container.querySelectorAll('.work-card:not(.arrow-card)');
    const arrowCard = container.querySelector('.arrow-card');

    if (arrowCard) {
      arrowCard.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent bubbling up to other event listeners
        const isExpanded = arrowCard.dataset.expanded === 'true';

        // If not expanded yet, show all cards
        if (!isExpanded) {
          workCards.forEach(card => card.classList.remove("hidden-card"));
          arrowCard.dataset.expanded = 'true';
        } else {
          // If already expanded, hide cards beyond the first 3
          workCards.forEach((card, index) => {
            if (index > 2) card.classList.add("hidden-card");
          });
          arrowCard.dataset.expanded = "false";
        }
      });
    }
  });
}

// Collapse all cards beyond the first 3 in each container
function resetCollapsedState() {
  document.querySelectorAll('.work-cards-container').forEach(container => {
    const workCards = container.querySelectorAll('.work-card:not(.arrow-card)');
    const arrowCard = container.querySelector('.arrow-card');

    if (workCards.length > 3) {
      // Hide everything beyond the first 3
      workCards.forEach((card, idx) => {
        if (idx > 2) card.classList.add('hidden-card');
        else card.classList.remove('hidden-card');
      });
      if (arrowCard) arrowCard.dataset.expanded = "false";
    } else {
      // Show all cards if 3 or fewer
      workCards.forEach(card => card.classList.remove('hidden-card'));
      if (arrowCard) arrowCard.dataset.expanded = "false";
    }
  });
}

// Prevent clicks on arrow cards from triggering other handlers
document.addEventListener("click", (event) => {
  if (event.target.closest(".arrow-card")) {
    event.stopPropagation();
  }
});

// Assign random background color to categories beyond the first 4
function styleCategoriesWithRandomColor() {
  const firstFourCategories = [
    'category-print-journalismus',
    'category-online-journalismus',
    'category-digitale-kommunikation',
    'category-multimedia'
  ];

  document.querySelectorAll('.category').forEach(category => {
    if (!firstFourCategories.includes(category.id)) {
      category.style.backgroundColor = getRandomHexColor();
    }
  });
}

// Initialize logic once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  styleCategoriesWithRandomColor();
  setupExpandableWorkCards();
  setupFilters();
  updateArrowCardsVisibility("");
});


// Show/hide the arrow card based on the filter and how many cards are visible
function updateArrowCardsVisibility(currentFilter = "") {
  document.querySelectorAll('.work-cards-container').forEach(container => {
    const allCards = container.querySelectorAll('.work-card:not(.arrow-card)');
    const arrowCard = container.querySelector('.arrow-card');

    if (!arrowCard) return;

    // Only show arrow if on the "All" filter and there are more than 3 cards
    if (currentFilter === "") {
      arrowCard.style.display = allCards.length > 3 ? 'block' : 'none';
      arrowCard.style.display = "flex";
      arrowCard.style.justifyContent = "center";
    } else {
      // Hide arrow on any filtered view
      arrowCard.style.display = 'none';
    }
  });
}

// ⭐️ Main filter setup function
function setupFilters() {
  const works = document.querySelectorAll(".work-card");
  const filterDropdownMenu = document.getElementById("filter-dropdown-menu");
  const filterToggle = document.getElementById("filter-toggle");

  if (!filterDropdownMenu) return;

  // Step 1: Collect original tags from work items
  const originalTags = [...works]
    .map(work => work.querySelector('.tag')?.getAttribute('data-tag'))
    .filter(Boolean);

  // Step 2: Normalize tags to lowercase and trim for uniqueness
  const tagMap = new Map();
  originalTags.forEach(tag => {
    const normalized = tag.trim().toLowerCase();
    if (!tagMap.has(normalized)) {
      tagMap.set(normalized, tag.trim()); // Store original version to display
    }
  });

  // Step 3: Clear old filter buttons
  filterDropdownMenu.innerHTML = "";

  // Step 4: Add default "All" filter button
  const allButton = document.createElement("button");
  allButton.classList.add("filter-button", "active");
  allButton.textContent = "All";
  allButton.setAttribute("data-filter", "");
  filterDropdownMenu.appendChild(allButton);

  // Step 5: Create a filter button for each unique tag
  tagMap.forEach((originalTag, normalizedTag) => {
    const button = document.createElement("button");
    button.classList.add("filter-button");
    button.textContent = originalTag;
    button.setAttribute("data-filter", normalizedTag);
    filterDropdownMenu.appendChild(button);
  });

  // Toggle dropdown visibility on icon click
  filterToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevents click from triggering document listener
    filterDropdownMenu.classList.toggle("active");
  });

  // Close dropdown when clicking outside of it
  document.addEventListener("click", () => {
    filterDropdownMenu.classList.remove("active");
  });

  // Step 6: Filtering logic
  filterDropdownMenu.addEventListener("click", (e) => {
    const target = e.target;
    if (!target.classList.contains("filter-button")) return;

    // Update active button style
    filterDropdownMenu.querySelectorAll(".filter-button").forEach(btn => btn.classList.remove("active"));
    target.classList.add("active");

    // Get filter value (empty string for 'All')
    const filter = target.getAttribute("data-filter");

    // Show or hide work cards based on tag
    works.forEach(work => {
      const workTag = work.querySelector('.tag')?.getAttribute('data-tag').toLowerCase();

      if (filter === "" || workTag === filter) {
        work.classList.remove("hidden-card");
      } else {
        work.classList.add("hidden-card");
      }
    });

    // Reset layout and arrows if "All" is selected
    if (filter === "") {
      resetCollapsedState();
    }

    // Show/hide arrow based on filter state
    updateArrowCardsVisibility(filter);

    // Hide the dropdown menu after selecting a filter
    filterDropdownMenu.classList.remove("active");
  });
}
