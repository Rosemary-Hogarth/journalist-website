document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".about-content");

  // Exit if tabs or contents are not present
  if (tabs.length === 0 || contents.length === 0) {
    return; // No tabs or content sections on this page
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(content => content.classList.remove("active"));

       // Add active class to clicked tab and corresponding content
      tab.classList.add("active");
      const target = tab.getAttribute("data-target");
      document.getElementById(target).classList.add("active");
    })
  })

// Set the first tab as active by default
tabs[0].classList.add("active");
contents[0].classList.add("active")


const aboutExhibitionText = document.getElementById('about-exhibition-text');
const aboutTextContent = document.getElementById('about-text-content');
const aboutTextContainer = document.getElementById('text-container')

function showAboutText(button) {
  // Save the current scroll position of the grid (in memory)
  lastScrollPosition = window.scrollY;
  console.log('Saved scroll position:', lastScrollPosition);


  const text = button.dataset.aboutText;
  const title = button.dataset.aboutTextTitle;
  const author = button.dataset.aboutTextAuthor;
  const description = button.dataset.aboutTextDescription;



  renderText(title, author, description, text);
  aboutTextContainer.style.display = 'none';
  aboutExhibitionText.style.display = 'block';

  document.body.offsetHeight;

    // Scroll to the top of the exhibition text
  // Delay the scroll to top
  setTimeout(() => {
    window.scrollTo(0, 0);
}, 0);


  // Optionally update URL without page reload
  history.pushState(null, '', '/about');
}

function returnToGridView() {
  console.log('Returning to position:', lastScrollPosition);
  aboutTextContainer.style.display = 'block';
  aboutExhibitionText.style.display = 'none';


    // Use setTimeout to ensure the scroll happens after the display change
setTimeout(() => {
  window.scrollTo({
    top: lastScrollPosition,
    behavior: 'smooth'
  });
  console.log('Scrolled to:', window.scrollY);
}, 0);


  // Optionally update URL back to exhibitions
  history.pushState(null, '', '/about');
}

})
