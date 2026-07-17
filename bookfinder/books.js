document.addEventListener("DOMContentLoaded", () => {
    // 1. Retrieve the selected book data from localStorage
    const selectedBookData = localStorage.getItem("selectedBook");

    // If no book was selected (e.g., someone went straight to books.html), redirect home
    if (!selectedBookData) {
        window.location.href = "home.html";
        return;
    }

    const book = JSON.parse(selectedBookData);
    const volumeInfo = book.volumeInfo || {};

    // 2. Select the HTML elements we need to update
    const coverImg = document.getElementById("detail-cover");
    const titleHeader = document.getElementById("detail-title");
    const authorHeader = document.getElementById("detail-author");
    const ratingText = document.getElementById("detail-rating");
    const starsContainer = document.querySelector(".stars");
    const genresContainer = document.getElementById("detail-genres");
    const descriptionPara = document.getElementById("detail-description");
    const saveButton = document.getElementById("detail-save-btn");

    // 3. Populate basic details
    titleHeader.textContent = volumeInfo.title || "Untitled Book";
    
    const author = volumeInfo.authors && volumeInfo.authors.length > 0
        ? volumeInfo.authors.join(", ")
        : "Unknown Author";
    authorHeader.textContent = `by ${author}`;

    // 4. Handle cover image (fallback to placeholder if missing)
    // Google Books often has larger images like 'medium' or 'large' inside imageLinks
    const coverURL = volumeInfo.imageLinks 
        ? (volumeInfo.imageLinks.medium || volumeInfo.imageLinks.thumbnail)
        : "images/no-cover.png";
    coverImg.src = coverURL;
    coverImg.alt = volumeInfo.title || "Book Cover";

    // 5. Handle Description (Google Books descriptions can contain HTML tags, so we use innerHTML safely)
    descriptionPara.innerHTML = volumeInfo.description 
        ? volumeInfo.description 
        : "No description available for this book.";

    // 6. Handle Genres/Categories
    genresContainer.innerHTML = "";
    if (volumeInfo.categories && volumeInfo.categories.length > 0) {
        volumeInfo.categories.forEach(category => {
            const tag = document.createElement("span");
            tag.classList.add("tag");
            tag.textContent = category;
            genresContainer.appendChild(tag);
        });
    } else {
        // Fallback tag if no category exists
        const tag = document.createElement("span");
        tag.classList.add("tag");
        tag.textContent = "General";
        genresContainer.appendChild(tag);
    }

    // 7. Handle Ratings (Generate stars based on actual API data if available)
    if (volumeInfo.averageRating) {
        const rating = volumeInfo.averageRating;
        const reviewCount = volumeInfo.ratingsCount || 0;
        ratingText.textContent = `${rating} (${reviewCount} reviews)`;

        // Generate gold stars dynamically
        starsContainer.innerHTML = "";
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("i");
            if (i <= Math.floor(rating)) {
                star.className = "fa-solid fa-star"; // Full star
            } else if (i - 0.5 <= rating) {
                star.className = "fa-solid fa-star-half-stroke"; // Half star
            } else {
                star.className = "fa-regular fa-star"; // Empty star
            }
            starsContainer.appendChild(star);
        }
    } else {
        // Default fallback if there are no ratings yet
        ratingText.textContent = "No reviews yet";
        starsContainer.innerHTML = `
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
        `;
    }

    // 8. Handle "Save to Reading List" Button
    saveButton.addEventListener("click", () => {
        let readingList = JSON.parse(localStorage.getItem("readingList")) || [];

        // Check if this book is already in the reading list
        if (!readingList.some(item => item.id === book.id)) {
            readingList.push(book);
            localStorage.setItem("readingList", JSON.stringify(readingList));
            alert(`"${volumeInfo.title}" has been saved to your Reading List!`);
        } else {
            alert(`"${volumeInfo.title}" is already in your Reading List.`);
        }
    });

    // 9. Handle "View Similar Books" Button
    const similarButton = document.getElementById("detail-similar-btn");
    
    similarButton.addEventListener("click", () => {
        let query = "best sellers"; // Fallback query

        // Try to find a category (genre) first
        if (volumeInfo.categories && volumeInfo.categories.length > 0) {
            query = volumeInfo.categories[0];
        } 
        // If no category, search for other books by the same author
        else if (volumeInfo.authors && volumeInfo.authors.length > 0) {
            query = volumeInfo.authors[0];
        } 
        // If neither exists, fall back to the book's title
        else if (volumeInfo.title) {
            query = volumeInfo.title;
        }

        // Save this query in localStorage so the Home Page can read it
        localStorage.setItem("similarSearchQuery", query);
        
        // Redirect the user back to the Home Page
        window.location.href = "home.html";
    });
});