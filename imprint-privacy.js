
// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
  // Select all elements with the 'data-toggle' attribute
  const toggleLinks = document.querySelectorAll('[data-toggle]');

  // Add click event listeners to each toggle link
  toggleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Prevent the default link behavior (navigating to a new page)
      e.preventDefault();

      // Get the ID of the content to toggle from the data-toggle attribute
      const targetId = link.getAttribute('data-toggle');

      // Call the toggleContent function with the target ID
      toggleContent(targetId);
    });
  });
});

// Keep track of the currently visible content
let currentlyVisibleId = null;

// Function to toggle the visibility of content
function toggleContent(targetId) {
  // Select all elements with the 'toggle-content' class
  const allContent = document.querySelectorAll('.toggle-content');

  // Loop through all toggle-content elements
  allContent.forEach(content => {
    if (content.id === targetId) {
      // If this content is already visible, hide it and reset currentlyVisibleId
      if (content.style.display === 'block') {
        content.style.display = 'none';
        currentlyVisibleId = null;
      } else {
        // If it's not visible, show it and update currentlyVisibleId
        content.style.display = 'block';
        currentlyVisibleId = targetId;
      }
    } else {
      // Hide all other content
      content.style.display = 'none';
    }
  });

// This is only necessay if imprint/privacy are on other pages ///
  // const backButton = document.getElementById('back-to-grid');

  // backButton.addEventListener('click', () => {
  //   console.log('clicked')
  //   const url = backButton.getAttribute('data-url');
  //   window.location.href = url;
  // })
}
