const API_KEY = "AIzaSyBDdKJZilRuR9S8QQNZQYpEBBrDkJlfwDg";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const bookGrid = document.getElementById("book-grid");

async function searchBooks(query) {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12&key=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        displayBooks(data.items ? data.items.slice(0, 12) : []);
    } catch (error) {
        console.error("Error fetching books:", error);
        bookGrid.innerHTML = `<p style="color: red;">Error: ${error.message}. Ensure your API key is correct and Books API is enabled.</p>`;
    }
}

function displayBooks(books) {
    bookGrid.innerHTML = "";

    if (!books || books.length === 0) {
        bookGrid.innerHTML = "<p>No books found.</p>";
        return;
    }

    books.forEach(book => {
        const volumeInfo = book.volumeInfo; // Google Books stores metadata here

        const coverURL = volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail
            ? volumeInfo.imageLinks.thumbnail
            : "images/no-cover.png";

        const author = volumeInfo.authors && volumeInfo.authors.length > 0
            ? volumeInfo.authors[0]
            : "Unknown Author";

        const title = volumeInfo.title || "Untitled Book";

        const card = document.createElement("div");
        card.classList.add("book-card");

        card.innerHTML = `
            <img src="${coverURL}" alt="${title}">
            <h3>${title}</h3>
            <p>${author}</p>
            <button class="save-btn">
                📚 Save Book
            </button>
        `;

        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("save-btn")) return;

            localStorage.setItem("selectedBook", JSON.stringify(book));
            window.location.href = "books.html";
        });

        const saveButton = card.querySelector(".save-btn");
        saveButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Stop click from bubbling up to the parent card element

            let readingList = JSON.parse(localStorage.getItem("readingList")) || [];
            
            if (!readingList.some(item => item.id === book.id)) {
                readingList.push(book);
                localStorage.setItem("readingList", JSON.stringify(readingList));
                alert(`"${title}" saved to your reading list!`);
            } else {
                alert(`"${title}" is already in your reading list.`);
            }
        });

        bookGrid.appendChild(card);
    });
}

searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if(query !== ""){
        searchBooks(query);
    }
});

searchInput.addEventListener("keypress", (event) => {
    if(event.key === "Enter"){
        const query = searchInput.value.trim();
        if(query !== ""){
            searchBooks(query);
        }
    }
});

window.addEventListener("DOMContentLoaded", () => {
    // Check if the user clicked "View Similar Books" from the details page
    const similarQuery = localStorage.getItem("similarSearchQuery");

    if (similarQuery) {
        searchBooks(similarQuery);
        
        // Clear it immediately so visiting the Home Page normally later 
        // still defaults to "best sellers"
        localStorage.removeItem("similarSearchQuery"); 
    } else {
        // Default home page load
        searchBooks("best sellers");
    }
});

const genreButtons = document.querySelectorAll(".genre-btn");

genreButtons.forEach(button => {
    button.addEventListener("click", () => {
        const genre = button.getAttribute("data-genre");
        searchBooks(genre);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. Select your recommendations heading (the h3 inside .recommendations-section)
  const heading = document.querySelector(".recommendations-section h3");
  
  // 2. Select all your genre buttons
  const buttons = document.querySelectorAll(".genre-buttons .genre-btn");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // Remove an 'active' class from all buttons to reset styling
      buttons.forEach(btn => btn.classList.remove("active"));
      
      // Add 'active' class to the button that was clicked
      button.classList.add("active");

      // 3. Get the genre name from the data-genre attribute (e.g., "fantasy" or "science fiction")
      const rawGenre = button.getAttribute("data-genre");

      // 4. Format the genre name so it looks clean (e.g., capitalize "fantasy" to "Fantasy")
      const formattedGenre = capitalizeWords(rawGenre);

      // 5. Update the heading text
      if (formattedGenre) {
        heading.textContent = `Featured ${formattedGenre} Recommendations`;
      } else {
        heading.textContent = "Featured Recommendations";
      }
    });
  });
});

// Helper function to capitalize words beautifully (e.g., "science fiction" -> "Science Fiction")
function capitalizeWords(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}