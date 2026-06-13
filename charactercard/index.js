const character = {
    name: "Snortleblat",
    class: "Swamp Beast Diplomat",
    level: 5,
    health: 100,
    image: "img.webp"
};

// Cache elements once
const elements = {
    name: document.getElementById("name"),
    class: document.getElementById("class"),
    level: document.getElementById("level"),
    health: document.getElementById("health"),
    image: document.getElementById("character-image"),
    deathBanner: document.getElementById("death-banner"),
    attackBtn: document.getElementById("attack-btn"),
    levelBtn: document.getElementById("levelup-btn")
};

function updateCard() {
    elements.name.textContent = character.name;
    elements.class.textContent = character.class;
    elements.level.textContent = character.level;
    elements.health.textContent = character.health;
    elements.image.src = character.image;
}

function attackCharacter() {
    character.health = Math.max(0, character.health - 20);

    if (character.health === 0) {
        elements.deathBanner.classList.add("show");
    }

    updateCard();
}

function levelUpCharacter() {
    character.level++;
    updateCard();
}

// Event listeners
elements.attackBtn.addEventListener("click", attackCharacter);
elements.levelBtn.addEventListener("click", levelUpCharacter);

// Initial render
updateCard();