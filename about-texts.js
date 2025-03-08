document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".about-content");
  const textItems = document.querySelectorAll(".text-item");
  const fullTextView = document.getElementById("full-text-view");
  const backToListButton = document.getElementById('back-to-list');
  const textContent = document.getElementById('text-content');
  const textList = document.getElementById("texts");
  const languageToggle = document.getElementById("language-toggle-about");

  if (tabs.length === 0 || contents.length === 0) return;


  // Resets all tabs and contents to inactive state.
  const resetTabs = () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(content => content.classList.remove("active"));
  };

  // Tab click functionality
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      resetTabs();

      tab.classList.add("active");
      const target = tab.getAttribute("data-target");
      const targetContent = document.getElementById(target);
      if (targetContent) {
        targetContent.classList.add("active");
        targetContent.style.display = "block";
      }
    });
  });

  // Default: Activate first tab and content
  tabs[0].classList.add("active");
  contents[0].classList.add("active");

  if (!textItems.length || !textList || !fullTextView || !textContent || !backToListButton || !languageToggle) {
    console.warn('One or more required elements not found');
    return;
  }

  let currentLanguage = 'en';
  let activeTextItem = null;




  // Renders the full text view with given details and content.
  function renderText(title, author, details, text) {
    textContent.innerHTML = `
      <div class="full-text-details">
        <p class="text-title">${title}</p>
        <p class="text-author">${author}</p>
        <p class="text-details">${details}</p>
      </div>
      <div class="full-text-content">${text}</div>
    `;
  }


   // Gets available languages from the selected text item.
  function getAvailableLanguages(textItem) {
    const languages = new Set();
    textItem.querySelectorAll('.text-item-text').forEach((element) => {
      languages.add(element.dataset.lang);
    });
    return Array.from(languages);
  }


   // Updates the text content based on the selected language.
  function updateContentForLanguage(textItem, language) {
    const title = textItem.getAttribute("data-text-title");
    const author = textItem.getAttribute("data-text-author");
    const details = textItem.getAttribute("data-text-details");
    const text = textItem.querySelector(`.text-item-text[data-lang="${language}"]`)?.innerHTML || "No text available for this language.";
    renderText(title, author, details, text);
  }

  // Update the quote content based on the selected language
function updateQuoteForLanguage() {
  const englishQuote = document.querySelector('.quote-text[data-lang="en"]');
  const germanQuote = document.querySelector('.quote-text[data-lang="de"]');

  // Hide both quotes initially
  if (englishQuote) englishQuote.style.display = 'none';
  if (germanQuote) germanQuote.style.display = 'none';

  // Show the quote corresponding to the current language
  if (currentLanguage === 'en' && englishQuote) {
    englishQuote.style.display = 'block';
  } else if (currentLanguage === 'de' && germanQuote) {
    germanQuote.style.display = 'block';
  }
}



   // Creates language toggle buttons based on available languages.
  function createLanguageButtons(availableLanguages) {
    languageToggle.innerHTML = '';
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
      if (index !== availableLanguages.length - 1) {
        languageToggle.appendChild(document.createTextNode(' / '));
      }
    });
  }


   // Switches the content language and updates styles.
  function switchLanguage(language) {
    if (!activeTextItem) return;
    currentLanguage = language;
    updateContentForLanguage(activeTextItem, currentLanguage);


  }


   // Displays the full text view when a text item is clicked.
  function showFullText(textItem) {
    activeTextItem = textItem;
    currentLanguage = 'en';
    updateContentForLanguage(textItem, currentLanguage);
    createLanguageButtons(getAvailableLanguages(textItem));
    textList.style.display = 'none';
    fullTextView.style.display = 'block';
    window.scrollTo(0, 0);
  }


  // Returns to the text list view.
  function returnToTextList() {
    textList.style.display = 'block';
    fullTextView.style.display = 'none';
  }

  backToListButton.addEventListener('click', returnToTextList);

  textItems.forEach(item => {
    item.addEventListener('click', function () {
      showFullText(this);
    });
  });
});
