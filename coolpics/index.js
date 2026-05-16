const btn = document.querySelector(".menu-btn");
const menu = document.querySelector("nav");

btn.addEventListener("click", toggleMenu);

function toggleMenu() {
    menu.classList.toggle("hide");
}


// MODAL IMAGE VIEWER

const gallery = document.querySelector("main");
const modal = document.querySelector(".image-viewer");
const modalImage = modal.querySelector("img");
const closeButton = modal.querySelector(".close-viewer");

gallery.addEventListener("click", openModal);

function openModal(e) {

    const img = e.target;

    // only allow image clicks
    if (img.tagName !== "IMG") return;

    const src = img.getAttribute("src");
    const alt = img.getAttribute("alt");

    // replace small image with full image
    const fullImage = src.replace("-sm", "-full");

    modalImage.src = fullImage;
    modalImage.alt = alt;

    modal.showModal();
}


// close button
closeButton.addEventListener("click", () => {
    modal.close();
});


// click outside image closes modal
modal.addEventListener("click", (event) => {

    if (event.target === modal) {
        modal.close();
    }

});