document.addEventListener('DOMContentLoaded', () => {
  // Select all elements that have the 'data-toggle' attribute
  const toggleLinks = document.querySelectorAll('[data-toggle]');

  // Initialize a variable to keep track of the currently active toggle link
  let currentToggle = null;

  // Loop through each toggle link
  toggleLinks.forEach(link => {
    // Initially set the color of all toggle links to black
    link.style.color = "black";

    // Add a click event listener to each toggle link
    link.addEventListener('click', (e) => {
      // Prevent the default behavior (like navigating to a link)
      e.preventDefault();

      // Get the target content ID from the 'data-toggle' attribute of the link
      const targetId = link.getAttribute('data-toggle');

      // Call the toggleContent function to show/hide the content based on the targetId
      toggleContent(targetId);

      // Loop through all toggle links to update their colors
      toggleLinks.forEach(l => {
        if (l === link) {
          // Set the clicked link's color to black
          l.style.color = "black";

          // Mark this link as the current active toggle
          currentToggle = l;
        } else {
          // Set the other links' color to a grayish color
          l.style.color = "#9D9D9C";
        }
      });
    });


  })

  function toggleContent(targetId) {
    const allContent = document.querySelectorAll('.toggle-content');
    let contentToggled = false; // Track if any content is opened


    allContent.forEach(content => {
      if (content.id === targetId) {
        if (content.style.display === 'block') {
          console.log("Hiding content:", content.id);
          content.style.display = 'none'; // Hide if it's currently shown
        } else {
          console.log("Showing content:", content.id);
          content.style.display = 'block'; // Show if it's currently hidden
          contentToggled = true; // At least one content is visible
        }
      } else {
        console.log("Hiding other content:", content.id);
        content.style.display = 'none'; // Hide all other content
      }
    });

    // Check if any content is still visible
    contentToggled = [...allContent].some(content => content.style.display === 'block');
    console.log("Is any content visible?", contentToggled);

    if (!contentToggled) {
      console.log("No content visible. Resetting toggle link colors.");

      setTimeout(() => {  // Small delay to ensure update
        toggleLinks.forEach(l => {
          l.style.color = "black";
          console.log("Set link back to black:", l.getAttribute('data-toggle'));
        });
      }, 10);  // 10ms should be enough

    } else {
      console.log("Some content is visible. Updating toggle link colors.");
      toggleLinks.forEach(l => {
        if (l.getAttribute('data-toggle') === targetId) {
          l.style.color = "black";
          console.log("Active link set to black:", l.getAttribute('data-toggle'));
        } else {
          l.style.color = "#9D9D9C";
          console.log("Inactive link set to gray:", l.getAttribute('data-toggle'));
        }
      });
    }
  }




})
