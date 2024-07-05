document.addEventListener("DOMContentLoaded", function() {
  const bioTextarea = document.getElementById("bioTextarea");
  const updateBioButton = document.getElementById("updateBioButton");

  //show "update bio" button when bio text area is clicked
  bioTextarea.addEventListener("click", function() {
    updateBioButton.style.display = "inline-block";
  });

  //confirmation message for update bio
  updateBioButton.addEventListener("click", function(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to update your bio?")) {
      document.getElementById("bioForm").submit();
    }
  });

  //confirmation message for update favourite game
  const favGameButton = document.getElementById("favGameButton");
  favGameButton.addEventListener("click", function(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to update your favorite game?")) {
      document.getElementById("favGameForm").submit();
    }
  });

  //confirmation message for changeing username
  const usernameButton = document.getElementById("usernameButton");
  usernameButton.addEventListener("click", function(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to update your username?")) {
      document.getElementById("usernameForm").submit();
    }
  });

  //confirmationi message for changing email
  const emailButton = document.getElementById("emailButton");
  emailButton.addEventListener("click", function(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to update your email?")) {
      document.getElementById("emailForm").submit();
    }
  });

  //confirmation message for updating profile picture
  const pfpButton = document.getElementById("pfpButton");
  pfpButton.addEventListener("click", function(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to update your profile picture?")) {
      document.getElementById("pfpForm").submit();
    }
  });
});
