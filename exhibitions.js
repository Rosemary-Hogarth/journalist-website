document.addEventListener("DOMContentLoaded", function () {
  function removeContainerPadding() {
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer && window.location.href.includes("/exhibitions")) {
      mainContainer.style.padding = '0';
    }
  }

  removeContainerPadding();

  const showTextButtons = document.querySelectorAll('.show-text');
  const exhibitionGrid = document.getElementById('exhibition-grid');
  const exhibitionText = document.getElementById('exhibition-text');
  const textContent = document.getElementById('text-content');
  const backToGridButton = document.getElementById('back-to-grid');
  const languageToggle = document.getElementById('language-toggle');



  if (!showTextButtons || !exhibitionGrid || !exhibitionText || !textContent || !backToGridButton  || !languageToggle) {
    console.warn('One or more required elements not found');
    return;
  }

  let lastScrollPosition = 0; // Store the last scroll position
  let currentLanguage = 'en'; // Default language
  let activeExhibition = null;

  function renderText(title, location, curated, artists, date, text) {
    const titleElement = textContent.querySelector('.exhibition-details-title');
    const locationElement = textContent.querySelector('.exhibition-details-location');
    const curatedElement = textContent.querySelector('.exhibition-details-curated');
    const artistsElement = textContent.querySelector('.exhibition-details-artists')
    const dateElement = textContent.querySelector('.exhibition-details-date');
    const textElement = textContent.querySelector('.exhibition-details-text');

    titleElement.textContent = title;
    locationElement.textContent = location;
    curatedElement.textContent = curated;
    artistsElement.textContent = artists;
    dateElement.textContent = date;
    textElement.innerHTML = text;
  }

  function getAvailableLanguages(textContainer) {
    const languages = new Set();
    textContainer.querySelectorAll('.exhibition-text').forEach((element) => {
      languages.add(element.dataset.lang);
    });
    return Array.from(languages);
  }

  function updateContentForLanguage(textContainer, language) {
    const title = textContainer.getAttribute("data-exhibition-text-title");
    const location = textContainer.getAttribute("data-exhibition-text-location");
    const curated = textContainer.getAttribute("data-exhibition-text-curated");
    const artists = textContainer.getAttribute("data-exhibition-text-artists");
    const date = textContainer.getAttribute("data-exhibition-text-dates");
    const text = Array.from(
      textContainer.querySelectorAll(`.exhibition-text[data-lang="${language}"]`)
    )[0]?.innerHTML;

    renderText(title, location, curated, artists, date, text || "No text available for this language.");
  }

  function createLanguageButtons(availableLanguages) {
    console.log("Languages received:", availableLanguages);


    // Clear existing buttons
    languageToggle.innerHTML = '';

       // Check if there's only one language available
      if (availableLanguages.length <= 1) {
        // Hide the language toggle
        languageToggle.style.display = 'none';
        return; // Exit the function early
    } else {
        // Show the language toggle if it was previously hidden
        languageToggle.style.display = 'block';
    }

    // Create a button for each language
    availableLanguages.forEach((lang, index) => {
      const button = document.createElement('a');
      button.href = '#';
      button.textContent = lang.toUpperCase();
      button.classList.add('language-link');
      if (lang === currentLanguage) {
        button.classList.add('active-language');
        button.style.color = "black";
      } else {
        button.style.color = "#9D9D9C";
      }


      // Add click event to switch language
      button.addEventListener('click', (event) => {
        event.preventDefault();
        switchLanguage(lang);
      });

      languageToggle.appendChild(button);

      // Add a separator (" | ") between buttons
      if (availableLanguages.indexOf(lang) !== availableLanguages.length - 1) {
        const separator = document.createTextNode(' / ');
        languageToggle.appendChild(separator);
      }
    });


  }

  function switchLanguage(language) {
    if (!activeExhibition) return;

    currentLanguage = language;
    updateContentForLanguage(activeExhibition, currentLanguage);

    // toggle button and define colour
    const buttons = languageToggle.querySelectorAll('.language-link');
    buttons.forEach((button) => {
      const isActive = button.textContent.toLowerCase() === language;
      button.classList.toggle('active-language', isActive);
      button.style.color = isActive ? "black" : "#9D9D9C";
    });
  }

  function showExhibitionText(button) {
    lastScrollPosition = window.scrollY;

    activeExhibition = button; // Set active exhibition container
    currentLanguage = 'en'; // Reset language to default

    // Update content for default language
    updateContentForLanguage(button, currentLanguage);

    // Show/hide language toggle button based on available languages
    const availableLanguages = getAvailableLanguages(button);
    createLanguageButtons(availableLanguages);

    // Hide grid, show text, and scroll to top
    exhibitionGrid.style.display = 'none';
    exhibitionText.style.display = 'block';

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    // Optionally update URL without page reload
    history.pushState(null, '', '/exhibitions');
  }


  function returnToGridView() {
    exhibitionGrid.style.display = 'block';
    exhibitionText.style.display = 'none';

    setTimeout(() => {
      window.scrollTo({
        top: lastScrollPosition,
        behavior: 'smooth'
      });
    }, 0);

    history.pushState(null, '', '/exhibitions');
  }

  // Attach event listeners
  showTextButtons.forEach(button => {
    button.addEventListener('click', function () {
      showExhibitionText(this);
    });
  });

  backToGridButton.addEventListener('click', returnToGridView);


  // slideshow indicators

  const slideshows = document.querySelectorAll(".snap-container");
  console.log("Slideshows found:", slideshows);

  slideshows.forEach(slideshow => {
      console.log("Checking slideshow:", slideshow);

      const exhibItem = slideshow.closest(".carousel-card");
      if (!exhibItem) {
          console.warn("Exhibition item not found for:", slideshow);
          return;
      }

      const indicatorsContainer = exhibItem.querySelector(".carousel-indicators");
      if (!indicatorsContainer) {
          console.warn("Indicators container not found for:", slideshow);
          return;
      }

      console.log("Indicators container found:", indicatorsContainer);

      const indicators = Array.from(indicatorsContainer.querySelectorAll(".indicator"));
      console.log("Indicators found:", indicators);

      let currentIndex = 0;
      const maxVisibleIndicators = 5;

      function updateIndicators(index) {
          // Clear existing indicators
          indicatorsContainer.innerHTML = "";

          // Determine start and end range for visible indicators
          let start = Math.max(0, Math.min(index - 2, indicators.length - maxVisibleIndicators));
          let end = Math.min(indicators.length, start + maxVisibleIndicators);

          for (let i = start; i < end; i++) {
              let dot = document.createElement("div");
              dot.classList.add("indicator");
              if (i === index) dot.classList.add("active");
              indicatorsContainer.appendChild(dot);
          }
      }

      slideshow.addEventListener("scroll", () => {
          let scrollLeft = slideshow.scrollLeft;
          let slideWidth = slideshow.offsetWidth;

          let newIndex = Math.round(scrollLeft / slideWidth);

          if (newIndex !== currentIndex) {
              currentIndex = newIndex;
              updateIndicators(currentIndex);
          }
      });

      updateIndicators(0);
  });





});
