// =================================
// DEIN GEHEIMES LÖSUNGSWORT
// =================================

const LOESUNGSWORT = "BLUME";

// Hier kannst du die Nachricht ändern:
const GEWONNEN = "Du hast es geschafft! ♡ Herzlichen Glückwunsch!";
const VERLOREN = "Leider nicht geschafft! Das Lösungswort war: " + LOESUNGSWORT;


// =================================
// SPIELEINSTELLUNGEN
// =================================

const WORTLAENGE = 5;
const VERSUCHE = 6;

let guesses = [];
let currentGuess = "";
let gameOver = false;
let won = false;

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");


// =================================
// SPIELFELD ERSTELLEN
// =================================

function drawBoard() {
    board.innerHTML = "";

    for (let i = 0; i < VERSUCHE; i++) {
        const row = document.createElement("div");
        row.className = "row";

        for (let j = 0; j < WORTLAENGE; j++) {
            const tile = document.createElement("div");
            tile.className = "tile";

            if (guesses[i]) {
                tile.textContent = guesses[i].word[j];
                tile.classList.add(guesses[i].colors[j]);
            } else if (i === guesses.length && !gameOver) {
                tile.textContent = currentGuess[j] || "";
            }

            row.appendChild(tile);
        }

        board.appendChild(row);
    }
}


// =================================
// TASTATUR ERSTELLEN
// =================================

const rows = [
    "QWERTZUIOP",
    "ASDFGHJKL",
    "YXCVBNM"
];

function drawKeyboard() {
    keyboard.innerHTML = "";

    rows.forEach((letters, index) => {
        const row = document.createElement("div");
        row.className = "key-row";

        if (index === 2) {
            addKey("ENTER", "wide", row);
        }

        letters.split("").forEach(letter => {
            addKey(letter, "", row);
        });

        if (index === 2) {
            addKey("⌫", "wide", row);
        }

        keyboard.appendChild(row);
    });
}

function addKey(letter, extraClass, row) {
    const button = document.createElement("button");
    button.textContent = letter;
    button.className = "key " + extraClass;

    button.addEventListener("click", () => {
        handleInput(letter);
    });

    row.appendChild(button);
}


// =================================
// EINGABEN VERARBEITEN
// =================================

function handleInput(key) {
    if (gameOver) return;

    if (key === "ENTER") {
        submitGuess();
        return;
    }

    if (key === "⌫" || key === "BACKSPACE") {
        currentGuess = currentGuess.slice(0, -1);
        drawBoard();
        return;
    }

    if (/^[A-Z]$/.test(key) && currentGuess.length < WORTLAENGE) {
        currentGuess += key;
        drawBoard();
    }
}


// =================================
// WORT AUSWERTEN
// =================================

function checkWord(guess, solution) {
    let colors = Array(WORTLAENGE).fill("absent");
    let remaining = solution.split("");

    // Zuerst richtige Positionen prüfen
    for (let i = 0; i < WORTLAENGE; i++) {
        if (guess[i] === solution[i]) {
            colors[i] = "correct";
            remaining[i] = null;
        }
    }

    // Danach Buchstaben an falscher Position prüfen
    for (let i = 0; i < WORTLAENGE; i++) {
        if (colors[i] !== "correct") {
            const position = remaining.indexOf(guess[i]);

            if (position !== -1) {
                colors[i] = "present";
                remaining[position] = null;
            }
        }
    }

    return colors;
}


// =================================
// VERSUCH ABSCHICKEN
// =================================

function submitGuess() {
    if (currentGuess.length !== WORTLAENGE) {
        message.textContent = "Bitte gib fünf Buchstaben ein! ♡";
        return;
    }

    const colors = checkWord(currentGuess, LOESUNGSWORT);

    guesses.push({
        word: currentGuess,
        colors: colors
    });

    if (currentGuess === LOESUNGSWORT) {
        gameOver = true;
        won = true;
        message.textContent = GEWONNEN;
    } else if (guesses.length === VERSUCHE) {
        gameOver = true;
        message.textContent = VERLOREN;
    } else {
        message.textContent = "";
    }

    currentGuess = "";

    drawBoard();
    drawKeyboard();
}


// =================================
// TASTATUR DES COMPUTERS
// =================================

document.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        handleInput("ENTER");
    } else if (event.key === "Backspace") {
        handleInput("BACKSPACE");
    } else if (/^[a-zA-Z]$/.test(event.key)) {
        handleInput(event.key.toUpperCase());
    }
});


// =================================
// SPIEL STARTEN
// =================================

drawBoard();
drawKeyboard();