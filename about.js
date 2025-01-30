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

  // Set all tabs and contents inactive initially
  const resetTabs = () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(content => content.classList.remove("active"));
  };

  // Tab click functionality
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Reset all tabs and contents
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(content => {
        content.classList.remove("active");
        content.style.display = "none"; // Ensure all are hidden
      });

      // Set the clicked tab and corresponding content to active
      tab.classList.add("active");
      const target = tab.getAttribute("data-target");
      const targetContent = document.getElementById(target);
      if (targetContent) {
        targetContent.classList.add("active");
        targetContent.style.display = "block"; // Ensure only the active one is shown
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

  let currentLanguage = 'en'; // Default language
  let activeTextItem = null;

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

  function getAvailableLanguages(textItem) {
    const languages = new Set();
    textItem.querySelectorAll('.text-item-text').forEach((element) => {
      languages.add(element.dataset.lang);
    });
    return Array.from(languages);
  }


  function updateContentForLanguage(textItem, language) {
    const title = textItem.getAttribute("data-text-title");
    const author = textItem.getAttribute("data-text-author");
    const details = textItem.getAttribute("data-text-details");
    const text = textItem.querySelector(`.text-item-text[data-lang="${language}"]`)?.innerHTML || "No text available for this language.";

    renderText(title, author, details, text);
  }



  function createLanguageButtons(availableLanguages) {


    languageToggle.innerHTML = '';
    availableLanguages.forEach((lang, index) => {
      const button = document.createElement('a');
      button.href = '#';
      button.textContent = lang.toUpperCase();
      button.classList.add('language-link');
      if (lang === currentLanguage) {
        button.classList.add('active-language');
      }

      if (lang === currentLanguage) {
        button.classList.add('active-language');
        button.style.color = "black";
      } else {
        button.style.color = "#9D9D9C";
      }

      button.addEventListener('click', (event) => {
        event.preventDefault();
        switchLanguage(lang);
      });

      languageToggle.appendChild(button);


      if (index !== availableLanguages.length - 1) {
        const separator = document.createTextNode(' / ');
        languageToggle.appendChild(separator);
      }
    });
  }




  function switchLanguage(language) {
    if (!activeTextItem) return;

    currentLanguage = language;
    updateContentForLanguage(activeTextItem, currentLanguage);

    const buttons = languageToggle.querySelectorAll('.language-link');
    buttons.forEach((button) => {
      const isActive =  button.textContent.trim().toLowerCase() === language;
      button.classList.toggle('active-language', isActive);
      button.style.color = isActive ? "black" : "#9D9D9C"
    });
  }


  function showFullText(textItem) {
    activeTextItem = textItem;
    currentLanguage = 'en';

    updateContentForLanguage(textItem, currentLanguage);

    const availableLanguages = getAvailableLanguages(textItem);
    createLanguageButtons(availableLanguages);

    textList.style.display = 'none';
    fullTextView.style.display = 'block';

    window.scrollTo(0, 0);
  }

  function returnToTextList() {
    textList.style.display = 'block';
    fullTextView.style.display = 'none';
  }

  // Attach event listeners
  textItems.forEach(item => {
    item.addEventListener('click', function () {
      showFullText(this);
    });
  });

  backToListButton.addEventListener('click', returnToTextList);

  const practiceLanguageToggle = document.getElementById("language-toggle-about-practice");
  const practiceContents = document.querySelectorAll("#practice .practice-content");

  function createPracticeLanguageButtons() {
    const availableLanguages = Array.from(practiceContents).map(content => content.dataset.lang);

    practiceLanguageToggle.innerHTML = '';
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

      button.addEventListener('click', (event) => {
        event.preventDefault();
        switchPracticeLanguage(lang);
      });

      practiceLanguageToggle.appendChild(button);

      if (index !== availableLanguages.length - 1) {
        const separator = document.createTextNode(' / ');
        practiceLanguageToggle.appendChild(separator);
      }
    });
  }

  function switchPracticeLanguage(language) {
    currentLanguage = language;
    practiceContents.forEach(content => {
      content.style.display = content.dataset.lang === language ? 'block' : 'none';
    });

    const buttons = practiceLanguageToggle.querySelectorAll('.language-link');
    buttons.forEach((button) => {
      const isActive = button.textContent.trim().toLowerCase() === language;
      button.classList.toggle('active-language', isActive);
      button.style.color = isActive ? "black" : "#9D9D9C";
    });
  }

  // Call this function to initialize the practice language toggle
  createPracticeLanguageButtons();
});
