import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]

console.log(rightGuessString)

/**
 * Initialise le plateau dans lequel s'affichent tentatives. Chaque ligne représente une tentative,
 * le nombre de tentative correspondant à la constante `NUMBER_OF_GUESSES`.
 */
function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div");
        row.className = "letter-row";
        
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }

        board.appendChild(row);
    }
}

initBoard()

/**
 * Insert dans une case du plateau de jeu la lettre pressée par l'utilisateur, sinon ne fait rien.
 * @param {String} pressedKey La touche pressée par l'utilisateur
 * @returns 
 */
function insertLetter(pressedKey) {
    // S'il y a déjà 5 lettres d'écrites, on ignore
    if (nextLetter === 5) { return; }

    pressedKey = pressedKey.toLowerCase();

    // On récupère la ligne du plateau selon le nombre de tentatives restantes
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];

    let box = row.children[nextLetter];
    animateCSS(box, "pulse");
    box.textContent = pressedKey;
    box.classList.add("filled-box");

    currentGuess.push(pressedKey);
    nextLetter += 1;
}

/**
 * Supprime une lettre de la tentative en cours.
 */
function deleteLetter() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess.pop();
    nextLetter -= 1;
}

/**
 * Donne une couleur à une case du plateau, en fonction de la lettre.
 * @param {String} letter La lettre à colorer
 * @param {String} color La couleur à donner
 */
function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === "green") { return; }
            if (oldColor === "yellow" && color !== "green") { return; }
            elem.style.backgroundColor = color;

            // Désactivation des touches qui sont en gris
            if (color === "grey") { elem.disabled = true; }
            break;
        }
    }
}

/**
 * Vérifie la tentative entrée par le joueur. Change la couleur des lettres en fonction de leur présence et de leur position dans le mot à deviner.
 */
function checkGuess() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let guessString = "";

    // Transforme la string en tableau de caractère
    let rightGuess = Array.from(rightGuessString);

    for (const val of currentGuess) {
        guessString += val;
    }

    if (guessString.length != 5) {
        toastr.error("Pas assez de lettres !");
        return;
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Le mot n'est pas dans la liste !");
        return;
    }

    for (let i = 0; i < 5; i++) {
        let letterColor = "";
        let box = row.children[i];
        let letter = currentGuess[i];

        let letterPosition = rightGuess.indexOf(currentGuess[i]);

        // Si la lettre n'est pas dans le mot à deviner...
        if (letterPosition === -1) {
            letterColor = "grey";
        } else {
            // Sinon, la lettre est dans le mot
            if (currentGuess[i] === rightGuess[i]) {
                // Bonne position
                letterColor = 'green';
            } else {
                letterColor = 'yellow';
            }

            rightGuess[letterPosition] = "#";
        }

        let delay = 250 * i;
        setTimeout(()=> {
            // Réalise un effet de rotation de haut en bas
            animateCSS(box, "flipInX");

            // On change la couleur de la case sur la ligne de tentative
            box.style.backgroundColor = letterColor;
            shadeKeyBoard(letter, letterColor);
        }, delay);
    }

    if (guessString === rightGuessString) {
        toastr.success("Vous avez trouvé le mot ! Félicitations !");
        guessesRemaining = 0;
        return;
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.error("You've run out of guesses! Game over!");
            toastr.info(`The right word was: "${rightGuessString}"`);
        }
    }
}

document.addEventListener("keyup", (e) => {
    // On ignore l'entrée lorsque le nombre de tentative max est atteint
    if (guessesRemaining === 0) { return; }

    let pressedKey = String(e.key);
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === "Enter") {
        checkGuess();
        return;
    }

    // On ignore l'entrée si ce n'est pas une touche représentant une lettre
    let found = pressedKey.match(/[a-z]/gi);
    if (!found || found.length > 1) { return; }
    else { insertLetter(pressedKey); }
});

// Un clic sur le clavier de la page
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target;
    if (!target.classList.contains("keyboard-button")) { return; }

    let key = target.textContent;
    if (key === "Del") { key = "Backspace"; }

    // On simule une touche du clavier de l'ordinateur
    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
});

// Gestion des animations
const animateCSS = (element, animation, prefix = "animate__") =>
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = element;
        node.style.setProperty('--animate-duration', '0.3s');
        
        node.classList.add(`${prefix}animated`, animationName);

        // Gestion de la fin de l'animation
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener("animationend", handleAnimationEnd, { once: true });
    });
    