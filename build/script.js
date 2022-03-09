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