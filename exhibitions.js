document.addEventListener("DOMContentLoaded", function () {
  /**
   * Removes padding from the main container if the URL contains "/exhibitions".
   */
  function removeContainerPadding() {
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer && window.location.href.includes("/exhibitions")) {
      mainContainer.style.padding = '0';
    }
  }

  removeContainerPadding();

  // Cache DOM elements to avoid redundant queries
  const showTextButtons = document.querySelectorAll('.show-text');
  const exhibitionGrid = document.getElementById('exhibition-grid');
  const exhibitionText = document.getElementById('exhibition-text');
  const textContent = document.getElementById('text-content');
  const backToGridButton = document.getElementById('back-to-grid');
  const languageToggle = document.getElementById('language-toggle');

  // Prevent script execution if any required elements are missing
  if (!showTextButtons.length || !exhibitionGrid || !exhibitionText || !textContent || !backToGridButton || !languageToggle) {
    console.warn('One or more required elements not found');
    return;
  }

  let lastScrollPosition = 0; // Stores scroll position before navigating to text view
  let currentLanguage = 'en'; // Default language
  let activeExhibition = null; // Stores the currently active exhibition

  /**
   * Updates exhibition text content based on the provided details.
   */
  function renderText(title, location, curated, artists, date, text) {
    textContent.querySelector('.exhibition-details-title').textContent = title;
    textContent.querySelector('.exhibition-details-location').textContent = location;
    textContent.querySelector('.exhibition-details-curated').textContent = curated;
    textContent.querySelector('.exhibition-details-artists').textContent = artists;
    textContent.querySelector('.exhibition-details-date').textContent = date;
    textContent.querySelector('.exhibition-details-text').innerHTML = text;
  }

  /**
   * Retrieves available languages from the exhibition text container.
   */
  function getAvailableLanguages(textContainer) {
    return Array.from(new Set(
      [...textContainer.querySelectorAll('.exhibition-text')].map(el => el.dataset.lang)
    ));
  }

  /**
   * Updates exhibition content for the selected language.
   */
  function updateContentForLanguage(textContainer, language) {
    const title = textContainer.getAttribute("data-exhibition-text-title");
    const location = textContainer.getAttribute("data-exhibition-text-location");
    const curated = textContainer.getAttribute("data-exhibition-text-curated");
    const artists = textContainer.getAttribute("data-exhibition-text-artists");
    const date = textContainer.getAttribute("data-exhibition-text-dates");
    const textElement = textContainer.querySelector(`.exhibition-text[data-lang="${language}"]`);

    renderText(title, location, curated, artists, date, textElement ? textElement.innerHTML : "No text available for this language.");
  }

  /**
   * Creates language selection buttons dynamically.
   */
  function createLanguageButtons(availableLanguages) {
    languageToggle.innerHTML = ''; // Clear existing buttons

    // Hide language toggle if only one language is available
    if (availableLanguages.length <= 1) {
      languageToggle.style.display = 'none';
      return;
    }

    languageToggle.style.display = 'block';

    availableLanguages.forEach((lang, index) => {
      const button = document.createElement('a');
      button.href = '#';
      button.textContent = lang.toUpperCase();
      button.classList.add('language-link');
      button.style.color = lang === currentLanguage ? "black" : "#9D9D9C";

      button.addEventListener('click', (event) => {
        event.preventDefault();
        switchLanguage(lang);
      });

      languageToggle.appendChild(button);
      if (index < availableLanguages.length - 1) {
        languageToggle.appendChild(document.createTextNode(' / '));
      }
    });
  }

  /**
   * Switches the exhibition text to the selected language.
   */
  function switchLanguage(language) {
    if (!activeExhibition) return;

    currentLanguage = language;
    updateContentForLanguage(activeExhibition, currentLanguage);

    // Update button styles to reflect the active language
    languageToggle.querySelectorAll('.language-link').forEach((button) => {
      const isActive = button.textContent.toLowerCase() === language;
      button.style.color = isActive ? "black" : "#9D9D9C";
    });
  }

  /**
   * Displays exhibition details when a "show text" button is clicked.
   */
  function showExhibitionText(button) {
    lastScrollPosition = window.scrollY;
    activeExhibition = button;
    currentLanguage = 'en'; // Reset to default language

    updateContentForLanguage(button, currentLanguage);
    createLanguageButtons(getAvailableLanguages(button));

    exhibitionGrid.style.display = 'none';
    exhibitionText.style.display = 'block';

    setTimeout(() => window.scrollTo(0, 0), 0);
    history.pushState(null, '', '/exhibitions'); // Update URL
  }

  /**
   * Returns to the exhibition grid view from the details page.
   */
  function returnToGridView() {
    exhibitionGrid.style.display = 'block';
    exhibitionText.style.display = 'none';

    setTimeout(() => window.scrollTo({ top: lastScrollPosition, behavior: 'smooth' }), 0);
    history.pushState(null, '', '/exhibitions');
  }

  // Attach event listeners to buttons
  showTextButtons.forEach(button => {
    button.addEventListener('click', () => showExhibitionText(button));
  });

  backToGridButton.addEventListener('click', returnToGridView);

  /**
   * Initializes and updates slideshow indicators dynamically.
   */
  document.querySelectorAll(".snap-container").forEach(slideshow => {
    const exhibItem = slideshow.closest(".carousel-card");
    const indicatorsContainer = exhibItem?.querySelector(".carousel-indicators");

    if (!exhibItem || !indicatorsContainer) {
      console.warn("Missing slideshow elements");
      return;
    }

    let currentIndex = 0;
    const maxVisibleIndicators = 5;
    const indicators = Array.from(indicatorsContainer.querySelectorAll(".indicator"));

    /**
     * Updates slideshow indicator dots based on the current index.
     */
    function updateIndicators(index) {
      indicatorsContainer.innerHTML = ""; // Clear previous indicators
      const start = Math.max(0, Math.min(index - 2, indicators.length - maxVisibleIndicators));
      const end = Math.min(indicators.length, start + maxVisibleIndicators);

      for (let i = start; i < end; i++) {
        let dot = document.createElement("div");
        dot.classList.add("indicator");
        if (i === index) dot.classList.add("active");
        indicatorsContainer.appendChild(dot);
      }
    }

    // Scroll event listener to update indicators dynamically
    slideshow.addEventListener("scroll", () => {
      let newIndex = Math.round(slideshow.scrollLeft / slideshow.offsetWidth);
      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        updateIndicators(currentIndex);
      }
    });

    updateIndicators(0); // Initialize indicators
  });
});
