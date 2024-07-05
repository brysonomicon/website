import Stack from './stack.js';

var numSelected = null;
var undoMoves = new Stack();
var redoMoves = new Stack();

// Add click events to undo and redo buttons
const undoButton = document.getElementById("undo-button");
undoButton.addEventListener("click", undoMove);
const redoButton = document.getElementById("redo-button");
redoButton.addEventListener("click", redoMove);

// Sudoku board
let sudoku = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let sudoku2 = JSON.parse(JSON.stringify(sudoku));

let changesMade = false;
let fields = [];
let counter = 0;
let sudoku3;

// When page loads up generate a sudoku board and set up the game
window.onload = function () {
    generateRandomSudoku(25);
    setGame();
}

// Set up the game
function setGame() {
    // Set up digits 1-9 buttons
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Set up eraser button
    let eraser = document.createElement("div");
    eraser.id = "";
    eraser.addEventListener("click", selectNumber);
    eraser.classList.add("number");
    let img = document.createElement("img");
    img.src = "/images/eraser.png";
    img.alt = "Eraser";
    img.style.width = "100%";
    eraser.appendChild(img);
    document.getElementById("digits").appendChild(eraser);

    // Set up hint button
    let hint = document.createElement("div");
    hint.id = "H";
    hint.innerText = "H";
    hint.addEventListener("click", selectNumber);
    hint.classList.add("number");
    document.getElementById("digits").appendChild(hint);

    // Set up board
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (sudoku3[r][c] != "0") {
                tile.innerText = sudoku3[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("sudokuBoard").appendChild(tile);
        }
    }
}

// Select a digit
function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

// Select a board tile and write the selected digit to it
function selectTile() {
    if (numSelected.id === "H") {
        if (this.classList.contains("tile-start")) {
            return;
        }
        const coords = this.id.split("-");
        const r = parseInt(coords[0]);
        const c = parseInt(coords[1]);
        const enteredNumber = sudoku[r][c];
        let current = this.innerText;
        this.style.color = "black";
        this.innerText = enteredNumber;
        undoMoves.push([r, c, current, this.innerText]);
        redoMoves.clear();
        evaluateBoard();
    } else if (numSelected) {
        if (this.classList.contains("tile-start")) {
            return;
        }
        const coords = this.id.split("-");
        const r = parseInt(coords[0]);
        const c = parseInt(coords[1]);
        const enteredNumber = numSelected.id;
        const correctNumber = sudoku[r][c];
        let current = this.innerText;

        if (enteredNumber !== correctNumber.toString()) {
            this.style.color = "red";
        } else {
            this.style.color = "black";
        }
        this.innerText = enteredNumber;
        undoMoves.push([r, c, current, this.innerText]);
        redoMoves.clear();
        evaluateBoard();
    }
}

// Check if the board is complete and if it is correct or not
function evaluateBoard() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let onBoard = document.getElementById(r + "-" + c).innerText;
            let onSolution = sudoku3[r][c];
            if (onBoard === "") {
                return;
            }
        }
    }
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let onBoard = document.getElementById(r + "-" + c).innerText;
            let onSolution = sudoku[r][c].toString();
            if (onBoard != onSolution) {
                alert("Incorrect solution!");
                return;
            }
        }
    }
    alert("You win!");
}

// Undo the last move the player made
function undoMove() {
    if (undoMoves.isEmpty()) {
        return;
    }
    let content = undoMoves.pop();
    redoMoves.push(content);
    let r = content[0].toString();
    let c = content[1].toString();
    let prev = content[2];
    if (sudoku[r][c] != prev) {
        document.getElementById(r + "-" + c).style.color = 'red';
    } else {
        document.getElementById(r + "-" + c).style.color = 'black';
    }
    document.getElementById(r + "-" + c).innerText = prev;
}

// Redo the last move the player undid
function redoMove() {
    if (redoMoves.isEmpty()) {
        return;
    }
    let content = redoMoves.pop();
    undoMoves.push(content);
    let r = content[0].toString();
    let c = content[1].toString();
    let prev = content[3];
    if (sudoku[r][c] != prev) {
        document.getElementById(r + "-" + c).style.color = 'red';
    } else {
        document.getElementById(r + "-" + c).style.color = 'black';
    }
    document.getElementById(r + "-" + c).innerText = prev;
    evaluateBoard();
}

// Solve the sudoku board
function solveSudoku() {
    fill_possible_fields();

    changesMade = false;
    counter = 0;

    while (!sudoku_complete()) {
        counter++;
        test_rows_and_cols();
        test_blocks();
        test_possible_fields();
        if (!changesMade) {
            break;
        } else {
            changesMade = false;
        }
        if (counter === 100) {
            break;
        }
    }
}

// Check if there are duplicate numbers in a row
function duplicateNumberInRow(s, fieldY) {
    let numbers = new Array();
    for (var i = 0; i < 9; i++) {
        if (s[i][fieldY] !== 0) {
            if (numbers.includes(s[i][fieldY])) {
                return true;
            } else {
                numbers.push(s[i][fieldY]);
            }
        }
    }
    return false;
}

// Check if there are duplicate numbers in a column
function duplicateNumberInCol(s, fieldX) {
    let numbers = new Array();
    for (var i = 0; i < 9; i++) {
        if (s[fieldX][i] !== 0) {
            if (numbers.includes(s[fieldX][i])) {
                return true;
            } else {
                numbers.push(s[fieldX][i]);
            }
        }
    }
    return false;
}

/**
 * Check if there are duplicate numbers in a box
 * Generated by ChatGPT 3.5
 *
 * @author https://chat.openai.com/
 */
function duplicateNumberInBox(s, fieldX, fieldY) {
    let boxX = Math.floor(fieldX / 3);
    let boxY = Math.floor(fieldY / 3);
    let numbers = new Array();
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            let x = i + 3 * boxX;
            let y = j + 3 * boxY;
            if (s[x][y] !== 0) {
                if (numbers.includes(s[x][y])) {
                    return true;
                } else {
                    numbers.push(s[x][y]);
                }
            }
        }
    }
    return false;
}

// Check if there are duplicate numbers on the board
function duplicateNumberExists(s, fieldX, fieldY) {
    if (duplicateNumberInRow(s, fieldY)) {
        return true;
    }
    if (duplicateNumberInCol(s, fieldX)) {
        return true;
    }
    if (duplicateNumberInBox(s, fieldX, fieldY)) {
        return true;
    }
    return false;
}

// Generate a random sudoku board
function generateRandomSudoku(numbers) {
    while (!sudoku_complete() || sudoku_invalid(sudoku)) {
        // new empty sudoku
        sudoku3 = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        sudoku = JSON.parse(JSON.stringify(sudoku3));

        let numbersDone = 0;

        while (numbersDone < numbers) {
            let fieldX = Math.floor(Math.random() * 9);
            let fieldY = Math.floor(Math.random() * 9);
            let number = Math.floor(Math.random() * 9) + 1;

            if (sudoku3[fieldX][fieldY] === 0) {
                sudoku3[fieldX][fieldY] = number;
                if (duplicateNumberExists(sudoku3, fieldX, fieldY)) {
                    sudoku3[fieldX][fieldY] = 0;
                    continue;
                } else {
                    numbersDone++;
                }
            }
        }
        sudoku = JSON.parse(JSON.stringify(sudoku3));
        solveSudoku();
    }
}

/**
 * Fill in the possible fields of a sudoku board
 * Generated by ChatGPT 3.5
 *
 * @author https://chat.openai.com/
 */
function fill_possible_fields() {
    for (var i = 0; i < 9; i++) {
        fields[i] = [];
    }
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            fields[i][j] = [];
        }
    }

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            for (var k = 0; k < 9; k++) {
                fields[i][j][k] = k + 1;
            }
        }
    }
}

/**
 * Test the possible fields of a sudoku board
 * Generated by ChatGPT 3.5
 *
 * @author https://chat.openai.com/
 */
function test_possible_fields() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (sudoku[i][j] === 0) {
                var numbers = 0;
                var number = 0;
                for (var k = 0; k < 9; k++) {
                    if (fields[i][j][k] !== 0) {
                        number = k + 1;
                        numbers++;
                    }
                }
                if (numbers === 1) {
                    sudoku[i][j] = number;
                    changesMade = true;
                }
            }
        }
    }
}

/**
 * Test the rows and columns of a sudoku board
 * Generated by ChatGPT 3.5
 *
 * @author https://chat.openai.com/
 */
function test_rows_and_cols() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (sudoku[i][j] !== 0) {
                var number = sudoku[i][j];
                for (var k = 0; k < 9; k++) {
                    if (sudoku[i][k] === 0) {
                        if (fields[i][k][number - 1] !== 0) {
                            changesMade = true;
                        }
                        fields[i][k][number - 1] = 0;
                    }
                }
                var number = sudoku[i][j];
                for (var k = 0; k < 9; k++) {
                    if (sudoku[k][j] === 0) {
                        if (fields[k][j][number - 1] !== 0) {
                            changesMade = true;
                        }
                        fields[k][j][number - 1] = 0;
                    }
                }
            }
        }
    }
}

/**
 * Test the boxes of a sudoku board
 * Generated by ChatGPT 3.5
 *
 * @author https://chat.openai.com/
 */
function test_blocks() {
    for (var k = 0; k < 3; k++) {
        for (var l = 0; l < 3; l++) {
            for (var i = 0 + k * 3; i < 3 + k * 3; i++) {
                for (var j = 0 + l * 3; j < 3 + l * 3; j++) {
                    if (sudoku[i][j] !== 0) {
                        var number = sudoku[i][j];
                        for (var a = 0 + k * 3; a < 3 + k * 3; a++) {
                            for (var b = 0 + l * 3; b < 3 + l * 3; b++) {
                                if (sudoku[a][b] === 0) {
                                    if (fields[a][b][number - 1] !== 0) {
                                        changesMade = true;
                                    }
                                    fields[a][b][number - 1] = 0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// Check that a sudoku board is complete
function sudoku_complete() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (sudoku[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}

// Check if a sudoku board is invalid
function sudoku_invalid(s) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (duplicateNumberExists(s, i, j)) {
                return true;
            }
        }
    }
    return false;
}
