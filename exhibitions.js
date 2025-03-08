document.addEventListener("DOMContentLoaded", function () {

   // Removes padding from the main container if the URL contains "/exhibitions".
  function removeContainerPadding() {
    const mainContainer = document.querySelector('.main-container');
      // check if the element exists
    if (mainContainer) {
      if (window.location.href.includes("/exhibitions")) {
        mainContainer.style.padding = '0';
      }
    } else {
        console.warn('.main-container missing!');
    }
  }

  removeContainerPadding();



  // Grab DOM elements
  const showTextButtons = document.querySelectorAll('.show-text');
  const exhibitionGrid = document.getElementById('exhibition-grid');
  const exhibitionText = document.getElementById('exhibition-text');
  const textContent = document.getElementById('text-content');
  const backToGridButton = document.getElementById('back-to-grid');
  const languageToggle = document.getElementById('language-toggle');

  // Safety Check: Prevent Errors
  if (!showTextButtons.length || !exhibitionGrid || !exhibitionText || !textContent || !backToGridButton || !languageToggle) {
    console.warn('One or more required elements not found');
    return;
  }



  // Define global variables - help track user state when navigating between views.
  let lastScrollPosition = 0; // Stores scroll position before navigating to text view
  let currentLanguage = 'en'; // Default language
  let activeExhibition = null; // Stores the currently active exhibition




  // Render Exhibition Text - updates exhibition details dynamically with values from the dataset
  function renderText(title, location, curated, artists, date, text) {
    textContent.querySelector('.exhibition-details-title').textContent = title;
    textContent.querySelector('.exhibition-details-location').textContent = location;
    textContent.querySelector('.exhibition-details-curated').textContent = curated;
    textContent.querySelector('.exhibition-details-artists').textContent = artists;
    textContent.querySelector('.exhibition-details-date').textContent = date;
    textContent.querySelector('.exhibition-details-text').innerHTML = text;
  }




   // Finds all available languages by extracting data-lang attributes from .exhibition-text elements
  function getAvailableLanguages(textContainer) {
    return Array.from(new Set(                                                            // Array.from Converts the Set back into an array and new Set removes duplicate language codes
      [...textContainer.querySelectorAll('.exhibition-text')].map(el => el.dataset.lang) // spread operator (...) converts node list into an array
    ));
  }




  // Grabs exhibition details from data-attributes and displays text in the selected language
  function updateContentForLanguage(textContainer, language) {

    const title = textContainer.getAttribute("data-exhibition-text-title");
    const location = textContainer.getAttribute("data-exhibition-text-location");
    const curated = textContainer.getAttribute("data-exhibition-text-curated");
    const artists = textContainer.getAttribute("data-exhibition-text-artists");
    const date = textContainer.getAttribute("data-exhibition-text-dates");
    const textElement = textContainer.querySelector(`.exhibition-text[data-lang="${language}"]`);



    renderText(title, location, curated, artists, date, textElement ? textElement.innerHTML : "No text available for this language.");
  }




   // Dynamically creates language buttons and adds event listeners to switch languages
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
      button.classList.add('language-link'); // JS adds the class to the newly created a tag
      button.style.color = lang === currentLanguage ? "black" : "#9D9D9C";

      button.addEventListener('click', (event) => {
        event.preventDefault();
        switchLanguage(lang);
      });

      languageToggle.appendChild(button);  // appends button as a child to the languageToggle DOM element
      if (index < availableLanguages.length - 1) {
        languageToggle.appendChild(document.createTextNode(' / ')); // If it's not the last button, it adds a " / " separator between language buttons.
      }
    });
  }





   // Updates the active language and adjusts button styles.
  function switchLanguage(language) {
    if (!activeExhibition) return;  // If activeExhibition is  null, undefined, false or 0, the function exits

    currentLanguage = language;
    updateContentForLanguage(activeExhibition, currentLanguage);

    // Update button styles to reflect the active language
    languageToggle.querySelectorAll('.language-link').forEach((button) => {
      const isActive = button.textContent.toLowerCase() === language;
      button.style.color = isActive ? "black" : "#9D9D9C";
    });
  }






   // Saves scroll position, updates content, and switches to the exhibition text view.
  function showExhibitionText(button) {
    lastScrollPosition = window.scrollY;
    activeExhibition = button; // Stores the clicked button as the active exhibition
    currentLanguage = 'en'; // Reset to default language

    updateContentForLanguage(button, currentLanguage); // call function and updates the exhibition text based on the selected language
    createLanguageButtons(getAvailableLanguages(button)); // gets available languages and creates buttons

    exhibitionGrid.style.display = 'none';
    exhibitionText.style.display = 'block';

    setTimeout(() => window.scrollTo(0, 0), 0);
    history.pushState(null, '', '/exhibitions'); // Update URL
  }





   // Restores the exhibition grid view and scrolls back to the previous position.
  function returnToGridView() {
    exhibitionGrid.style.display = 'block';
    exhibitionText.style.display = 'none';

    setTimeout(() => window.scrollTo({ top: lastScrollPosition, behavior: 'smooth' }), 0);
    // Modifies  URL without reloading the page using the History API and changes URL to "/exhibitions" so users can use the back button
    history.pushState(null, '', '/exhibitions');
  }

  // Adds click events to the more info buttons to open exhibition text.
  showTextButtons.forEach(button => {
    button.addEventListener('click', () => showExhibitionText(button));
  });

  backToGridButton.addEventListener('click', returnToGridView); // adds click to the close button 'X'





    // Handle Slideshow Indicators - updates slideshow indicator dots based on the current index.
  document.querySelectorAll(".snap-container").forEach(slideshow => {
    const exhibItem = slideshow.closest(".carousel-card");
    const indicatorsContainer = exhibItem?.querySelector(".carousel-indicators");

    if (!exhibItem || !indicatorsContainer) {
      console.warn("Missing slideshow elements");
      return;
    }

    let currentIndex = 0;
    const indicators = Array.from(indicatorsContainer.querySelectorAll(".indicator"));

    // Function to update the active class on the indicator
    function updateIndicators(index) {
      // Remove active class from all indicators
      indicators.forEach(indicator => indicator.classList.remove("active"));
      // Add active class to the specific indicator
      indicators[index]?.classList.add("active");
    }

    // Add scroll event listener to the slideshow container
    slideshow.addEventListener("scroll", () => {
      // Calculate the new index based on scroll position
      let newIndex = Math.round(slideshow.scrollLeft / slideshow.offsetWidth);
      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        updateIndicators(currentIndex); // Update the active indicator
      }
    });

    updateIndicators(0); // Set the first indicator as active when the page loads
  });

})
