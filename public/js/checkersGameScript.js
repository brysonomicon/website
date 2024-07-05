//Global variables and arrays
let currentPlayer = 1;
let posNewPosition = [];
let capturedPosition = [];
const modal = document.getElementById("easyModal");
let game = document.getElementById("game");

/**
 * Defining inital state of the board with 0s, 1s, and -1s representing empty, player 1, and player 2 pieces
 * 
 * Refactored original board code which stopped functioning, suggestion to 'use this board to avoid unknown issue with code' 
 * Microsoft Co-pilot
 * 
 * @author https://copilot.microsoft.com/
 */
let board = [
  [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
  [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0],
  [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
  [-1, 0, -1, 0, -1, 0, -1, 0, -1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
];

//Call function to build initial board
builBoard();

//Piece class with a constructor and a method to compare pieces
class Piece {
  constructor(row, column) {

    this.row = row;
    this.column = column;
  }

  compare(piece) {

    return piece.row === this.row && piece.column === this.column;
  }
}

//Function to move a piece when clicked
function movePiece(e) {

  let piece = e.target;
  const row = parseInt(piece.getAttribute("row"));
  const column = parseInt(piece.getAttribute("column"));
  let p = new Piece(row, column);

  if (capturedPosition.length > 0) {

    enableToCapture(p);
  } else {
    if (posNewPosition.length > 0) {

      enableToMove(p);
    }
  }

  if (currentPlayer === board[row][column]) {

    player = reverse(currentPlayer);
    if (!findPieceCaptured(p, player)) {

      findPossibleNewPosition(p, player);
    }
  }
}

//Function logic that allows capturing peices
function enableToCapture(p) {

  let find = false;
  let pos = null;
  capturedPosition.forEach((element) => {

    if (element.newPosition.compare(p)) {

      find = true;
      pos = element.newPosition;
      old = element.pieceCaptured;
      return;
    }
  });

  if (find) {

    //If the current piece can move on, edit the board and rebuild
    //Move the piece
    board[pos.row][pos.column] = currentPlayer;
    //Delete the old position
    board[readyToMove.row][readyToMove.column] = 0; 
    
    //Delete the piece that had been captured
    board[old.row][old.column] = 0;

    //Reinit ready to move value
    readyToMove = null;
    capturedPosition = [];
    posNewPosition = [];
    displayCurrentPlayer();
    builBoard();

    //Check if there are possibility to capture other piece
    currentPlayer = reverse(currentPlayer);
  } else {

    builBoard();
  }
}

//Function which allows peices to move
function enableToMove(p) {

  let find = false;
  let newPosition = null;
  
  //Check if the case where the player play the selected piece can move on
  posNewPosition.forEach((element) => {

    if (element.compare(p)) {

      find = true;
      newPosition = element;
      return;
    }
  });

  if (find) moveThePiece(newPosition);
  else builBoard();
}

//Function to move the piece to the new position
function moveThePiece(newPosition) {

  //If the current piece can move on, edit the board and rebuild
  board[newPosition.row][newPosition.column] = currentPlayer;
  board[readyToMove.row][readyToMove.column] = 0;

  //Init values
  readyToMove = null;
  posNewPosition = [];
  capturedPosition = [];

  currentPlayer = reverse(currentPlayer);

  displayCurrentPlayer();
  builBoard();
}

//Function to find possible new positions for a piece
function findPossibleNewPosition(piece, player) {

  if (board[piece.row + player][piece.column + 1] === 0) {

    readyToMove = piece;
    markPossiblePosition(piece, player, 1);
  }

  if (board[piece.row + player][piece.column - 1] === 0) {

    readyToMove = piece;
    markPossiblePosition(piece, player, -1);
  }
}

//Function to mark possible positions on the board
function markPossiblePosition(p, player = 0, direction = 0) {

  attribute = parseInt(p.row + player) + "-" + parseInt(p.column + direction);

  position = document.querySelector("[data-position='" + attribute + "']");
  if (position) {

    position.style.background = "gray";

    //save where it can move
    posNewPosition.push(new Piece(p.row + player, p.column + direction));
  }
}

/**
 * Function to build or rebuild the board
 * 
 * Original code was given to co pilot to refactor and it gave this way to build the board along with the let board code snippet
 * Microsoft Co-pilot
 * 
 * @author https://copilot.microsoft.com/
 */
function builBoard() {

  game.innerHTML = "";
  let black = 0;
  let red = 0;
  for (let i = 0; i < board.length; i++) {

    const element = board[i];

    //Create div for each row
    let row = document.createElement("div"); 
    row.setAttribute("class", "row");

    for (let j = 0; j < element.length; j++) {

      const elmt = element[j];

      //Create div for each case
      let col = document.createElement("div"); 
      let piece = document.createElement("div");
      let caseType = "";
      let occupied = "";

      if (i % 2 === 0) {

        if (j % 2 === 0) {

          caseType = "redcase";
        } else {

          caseType = "blackCase";
        }
      } else {

        if (j % 2 !== 0) {

          caseType = "redcase";
        } else {

          caseType = "blackCase";
        }
      }

      //Add the piece if the case isn't empty
      if (board[i][j] === 1) {

        occupied = "redPiece";
      } else if (board[i][j] === -1) {

        occupied = "blackPiece";
      } else {

        occupied = "empty";
      }

      piece.setAttribute("class", "occupied " + occupied);

      //Set row and colum in the case
      piece.setAttribute("row", i);
      piece.setAttribute("column", j);
      piece.setAttribute("data-position", i + "-" + j);

      //Add event listener to each piece
      piece.addEventListener("click", movePiece);

      col.appendChild(piece);

      col.setAttribute("class", "column " + caseType);
      row.appendChild(col);

      //Counter number of each piece
      if (board[i][j] === -1) {

        black++;
      } else if (board[i][j] === 1) {

        red++;
      }

      //Display the number of piece for each player
      displayCounter(black, red);
    }

    game.appendChild(row);
  }

  if (black === 0 || red === 0) {

    modalOpen(black);
  }
}

//Function to display the current player's turn
function displayCurrentPlayer() {

  var container = document.getElementById("next-player");
  if (container.classList.contains("redPiece")) {

    container.setAttribute("class", "occupied blackPiece");
  } else {
    container.setAttribute("class", "occupied redPiece");
  }
}

//Function to find and mark pieces that can be captured
function findPieceCaptured(p, player) {

  let found = false;
  if (
    board[p.row - 1][p.column - 1] === player &&
    board[p.row - 2][p.column - 2] === 0
  ) {

    found = true;
    newPosition = new Piece(p.row - 2, p.column - 2);
    readyToMove = p;
    markPossiblePosition(newPosition);

    //Save the new position and the opponent's piece position
    capturedPosition.push({

      newPosition: newPosition,
      pieceCaptured: new Piece(p.row - 1, p.column - 1),
    });
  }

  if (
    board[p.row - 1][p.column + 1] === player &&
    board[p.row - 2][p.column + 2] === 0
  ) {

    found = true;
    newPosition = new Piece(p.row - 2, p.column + 2);
    readyToMove = p;
    markPossiblePosition(newPosition);

    //Save the new position and the opponent's piece position
    capturedPosition.push({
      
      newPosition: newPosition,
      pieceCaptured: new Piece(p.row - 1, p.column + 1),
    });
  }

  if (
    board[p.row + 1][p.column - 1] === player &&
    board[p.row + 2][p.column - 2] === 0
  ) {

    found = true;
    newPosition = new Piece(p.row + 2, p.column - 2);
    readyToMove = p;
    markPossiblePosition(newPosition);

    //Save the new position and the opponent's piece position
    capturedPosition.push({

      newPosition: newPosition,
      pieceCaptured: new Piece(p.row + 1, p.column - 1),
    });
  }

  if (
    board[p.row + 1][p.column + 1] === player &&
    board[p.row + 2][p.column + 2] === 0
  ) {

    found = true;
    newPosition = new Piece(p.row + 2, p.column + 2);
    readyToMove = p;
    markPossiblePosition(newPosition);

    //Save the new position and the opponent's piece position
    capturedPosition.push({

      newPosition: newPosition,
      pieceCaptured: new Piece(p.row + 1, p.column + 1),
    });
  }

  return found;
}

//Function to display the counter of pieces for each player
function displayCounter(black, red) {

  var blackContainer = document.getElementById("black-player-count-pieces");
  var redContainer = document.getElementById("red-player-count-pieces");
  blackContainer.innerHTML = black;
  redContainer.innerHTML = red;
}

//Function to open the modal when the game ends
function modalOpen(black) {

  document.getElementById("winner").innerHTML = black === 0 ? "red" : "Black";
  document.getElementById("loser").innerHTML = black !== 0 ? "red" : "Black";
  modal.classList.add("effect");
}

function modalClose() {
  
  modal.classList.remove("effect");
}

//Function to reverse the player's turn
function reverse(player) {
  
  return player === -1 ? 1 : -1;
}