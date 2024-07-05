var usedNums = new Array(55);
var numbers = [];

function newCard() {
    //Starting loop through each square card
    for (var i = 0; i < 24; i++) {  
        setSquare(i);
    }
}


function setSquare(thisSquare) {
    var currSquare = "square" + thisSquare;
    var newNum;

    do {
        newNum = getNewNum();
    }
    while (usedNums[newNum]);

    usedNums[newNum] = true;
    document.getElementById(currSquare).innerHTML = newNum;
}

function getNewNum() {
    return Math.floor(Math.random() * 50);

}
function getBingoNum(elementId) {
    var currNum = Math.floor(Math.random() * 50);
    // Update the HTML content of the specified element with the new number
    document.getElementById(elementId).innerHTML = currNum;
    numbers.push(currNum);
    displayClickedNumbersHistory();
}

// Function to display the history of clicked numbers
function displayClickedNumbersHistory() {
    document.getElementById("lastNumbers").textContent = numbers;
}

function anotherCard() {
    for (var i = 0; i < 24; i++) {
        var currSquare = document.getElementById("square" + i);
        // Remove any added classes (e.g., "highlighted")
        currSquare.classList.remove("highlighted");
    }
    // Generate a new card
    newCard();
}

// Assuming your squares have IDs like "square0", "square1", etc.
function setupSquareClickHandlers() {
    for (var i = 0; i < 24; i++) {
        var currSquare = document.getElementById("square" + i);
        currSquare.addEventListener("click", toggleHighlight);
    }
}

function toggleHighlight(event) {
    // Toggle the "highlighted" class when a square is clicked
    event.target.classList.toggle("highlighted");
}

// Call this function to set up the click handlers when your page loads
document.addEventListener("DOMContentLoaded", function() {
    setupSquareClickHandlers();
});




