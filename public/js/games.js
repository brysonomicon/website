//Each game card is hardcoded to route to a specific page
document.getElementById("game1").addEventListener('click', function() {
    window.location.href = "/gamesSpecific/?game=chess";
});

document.getElementById("game2").addEventListener('click', function() {
    window.location.href = "/gameCheckersHub";
})

document.getElementById("game3").addEventListener('click', function() {
    window.location.href = "/gameJigsawHub";
})

document.getElementById("game4").addEventListener('click', function() {

    window.location.href = "/gameBingoHub";
})

document.getElementById("game5").addEventListener('click', function() {

    window.location.href = "/gameSudokuHub";
})

document.getElementById("game6").addEventListener('click', function() {
    window.location.href = "/gamesSpecific/?game=wordle";
})
