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

})
