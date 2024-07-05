//function to open help overlay
function openHelpOverlay() {
    document.getElementById("helpOverlay").style.display = "block";
}

//function to close help overlay
function closeHelpOverlay() {
    document.getElementById("helpOverlay").style.display = "none";
}

//open help overlay when help button is clicked
document.addEventListener("DOMContentLoaded", function() {
    var helpButton = document.querySelector(".helpButton");
    var helpOverlay = document.getElementById("helpOverlay");
    var closeButton = document.querySelector("#helpOverlay .close");

    helpButton.addEventListener("click", function() {
        console.log("clicked");
        openHelpOverlay();
        
    });

    closeButton.addEventListener("click", closeHelpOverlay);

    helpOverlay.addEventListener("click", function(event) {
        if (event.target === helpOverlay) {
            closeHelpOverlay();
        }
    });
});