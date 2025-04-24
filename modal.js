function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.right = menu.style.right === "0px" ? "-100%" : "0px";
}

function openModal(title, date, summary, link) {
  const modal = document.getElementById("articleModal");
  const modalTitle = document.getElementById("modal-title");
  const modalDate = document.getElementById("modal-date");
  const modalSummary = document.getElementById("modal-summary");
  const modalLinkContainer = document.getElementById("modal-link-container"); // New container for the button

  // Clear previous button if it exists
  modalLinkContainer.innerHTML = "";

  // Update content
  modalTitle.innerText = title;
  modalDate.innerText = `Published: ${date}`;
  modalSummary.innerText = summary;

  // Create the button
  const modalButton = document.createElement("a"); // Use <a> to make it a real link
  modalButton.innerText = "Zum Artikel";
  modalButton.href = link;
  modalButton.target = "_blank"; // Open in new tab
  modalButton.style.display = "inline-block";
  modalButton.style.padding = "6px 15px";
  modalButton.style.marginTop = "15px";
  modalButton.style.backgroundColor = "#D1BCFF";
  modalButton.style.color = "black";
  modalButton.style.textDecoration = "none";
  modalButton.style.borderRadius = "25px";



  // Show the modal
  if (window.innerWidth <= 768) {
    modalTitle.style.fontSize = "24px";
    modalSummary.style.fontSize = "16px";
    modalDate.style.fontSize = "14px";
  } else {
    modalTitle.style.fontSize = "30px";
    modalSummary.style.fontSize = "20px";
  }


  // Append the button inside the modal
  modalLinkContainer.appendChild(modalButton);

   // Show the modal
  modal.style.display = "block";
}


// Function to close modal
function closeModal() {
  document.getElementById("articleModal").style.display = "none";
}

// Attach event listener to all work cards
document.querySelectorAll(".work-card").forEach((card) => {
  card.addEventListener("click", function () {
    openModal(
      this.dataset.title,
      this.dataset.date,
      this.dataset.summary,
      this.dataset.link
    );
  });
});

// Close modal when clicking outside content
document.getElementById("articleModal").addEventListener("click", function (event) {
  if (event.target === this) {
    closeModal();
  }
});
