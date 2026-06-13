const character = {
    name: "Snortleblat",
    class: "Swamp Beast Diplomat",
    level: 5,
    health: 100,
    image: "img.webp",

    attacked() {

    this.health -= 20;

    if (this.health <= 0) {

        this.health = 0;

        // Show death banner
        document
            .getElementById("death-banner")
            .classList.add("show");

    } else {

        message.textContent =
            `${this.name} was attacked!`;
    }

    updateCard();
    },

      levelUp() {

        this.level += 1;

        updateCard();
    }
};

const nameElement =
    document.getElementById("name");

const classElement =
    document.getElementById("class");

const levelElement =
    document.getElementById("level");

const healthElement =
    document.getElementById("health");

const imageElement =
    document.getElementById("character-image");

const message =
    document.getElementById("message");

function updateCard() {

    nameElement.textContent =
        character.name;

    classElement.textContent =
        character.class;

    levelElement.textContent =
        character.level;

    healthElement.textContent =
        character.health;

    imageElement.src =
        character.image;
}

document
    .getElementById("attack-btn")
    .addEventListener("click", () => {

        character.attacked();
    });

document
    .getElementById("levelup-btn")
    .addEventListener("click", () => {

        character.levelUp();
    });

updateCard();