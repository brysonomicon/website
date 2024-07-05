//Event listener for 'Play' button
document.getElementById('play-game').addEventListener('click', function() {

  //Logic to navigate to the game page
  window.location.href = '/gameJigsawPlay';
});

//Event listener for 'Invite Friends' button
document.getElementById('invite-friends').addEventListener('click', function() {

  //Logic to invite friends, opening a modal to send invites
  openInviteModal();
});

//Event listener for 'Game Settings' button
document.getElementById('game-settings').addEventListener('click', function() {

  //Logic to open game settings, such as showing a settings panel
  openSettingsPanel();
});

//Function to open the invite modal (placeholder function)
function openInviteModal() {

  //Implement the logic to open the invite modal
  console.log('Invite modal opened');
}

//Function to open the settings panel (placeholder function)
function openSettingsPanel() {

  //Implement the logic to open the settings panel
  console.log('Settings panel opened');
}
