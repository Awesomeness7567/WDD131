document.addEventListener("DOMContentLoaded", () => {
    const listContainer = document.getElementById("reading-list-items");
    const totalCounter = document.getElementById("total-books-counter");

    // Load saved books from localStorage
    function getReadingList() {
        return JSON.parse(localStorage.getItem("readingList")) || [];
    }

    // Save list back to localStorage
    function saveReadingList(list) {
        localStorage.setItem("readingList", JSON.stringify(list));
    }

    // Render the reading list UI
    function renderList() {
        const readingList = getReadingList();
        listContainer.innerHTML = "";

        // Update the summary card counter
        totalCounter.textContent = `Total Saved Books: ${readingList.length}`;

        if (readingList.length === 0) {
            listContainer.innerHTML = `<p class="empty-list-message">Your reading list is empty. Explore and add some books!</p>`;
            return;
        }

        readingList.forEach(book => {
            const volumeInfo = book.volumeInfo || {};
            const title = volumeInfo.title || "Untitled Book";
            
            const author = volumeInfo.authors && volumeInfo.authors.length > 0
                ? volumeInfo.authors[0]
                : "Unknown Author";

            const coverURL = volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail
                ? volumeInfo.imageLinks.thumbnail
                : "images/no-cover.png";

            // Create the horizontal list row
            const itemRow = document.createElement("div");
            itemRow.classList.add("reading-list-item");

            // Build rating stars (render actual Google rating, fall back to 5 empty stars)
            let starsHTML = "";
            const rating = volumeInfo.averageRating || 0;
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(rating)) {
                    starsHTML += `<i class="fa-solid fa-star stars"></i>`;
                } else if (i - 0.5 <= rating) {
                    starsHTML += `<i class="fa-solid fa-star-half-stroke stars"></i>`;
                } else {
                    starsHTML += `<i class="fa-regular fa-star stars" style="color: #ccc;"></i>`;
                }
            }

            itemRow.innerHTML = `
                <img src="${coverURL}" alt="${title}">
                <div class="item-info">
                    <h3>${title}</h3>
                    <p class="author">${author}</p>
                    <div class="rating-stars">
                        ${starsHTML}
                    </div>
                </div>
                <button class="remove-btn" data-id="${book.id}">
                    <i class="fa-regular fa-trash-can"></i> Remove
                </button>
            `;

            // Redirect to detail page when clicking on a row (excluding the remove button)
            itemRow.addEventListener("click", (e) => {
                if (e.target.closest(".remove-btn")) return;
                localStorage.setItem("selectedBook", JSON.stringify(book));
                window.location.href = "books.html";
            });

            // Handle the removal of the book
            const removeButton = itemRow.querySelector(".remove-btn");
            removeButton.addEventListener("click", (e) => {
                e.stopPropagation(); // Stop row click navigation
                removeBook(book.id, title);
            });

            listContainer.appendChild(itemRow);
        });
    }

    // Function to filter out and remove a book by Google ID
    function removeBook(id, title) {
        let readingList = getReadingList();
        readingList = readingList.filter(book => book.id !== id);
        saveReadingList(readingList);
        
        // Re-render UI with updated elements
        renderList();
        
        // Optional user notification
        console.log(`"${title}" removed from your list.`);
    }

    // Initial render call on page load
    renderList();
});