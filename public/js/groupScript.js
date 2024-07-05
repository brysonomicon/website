//Event listener for 'View All Groups' button
document.getElementById('view-groups').addEventListener('click', function() {
  
  //Show the groups container and hide the create group container
  document.getElementById('groups-container').style.display = 'block';
  document.getElementById('create-group-container').style.display = 'none';

});

//Event listener for 'Create New Group' button
document.getElementById('create-group').addEventListener('click', function() {

  //Show the create group container and hide the groups container
  document.getElementById('create-group-container').style.display = 'block';
  document.getElementById('groups-container').style.display = 'none';

});

//Array to keep track of users added to the group
let usersToAdd = [];

//Add event listeners to all 'Add' buttons
document.querySelectorAll('.add-user').forEach(button => {
  button.addEventListener('click', function() {

    //Get the user ID from the data attribute
    let userId = this.getAttribute('data-user-id');

    //Add the user ID to the array if not already present
    if(!usersToAdd.includes(userId)) {
      usersToAdd.push(userId);

      //Hide the 'Add' button and show the 'Remove' button
      this.style.display = 'none';
      this.nextElementSibling.style.display = 'inline';
    }

    //Update the hidden input field with the array of added users
    document.getElementById('users-to-add').value = usersToAdd.join(',');
    
  });

});

//Add event listeners to all 'Remove' buttons
document.querySelectorAll('.remove-user').forEach(button => {
  button.addEventListener('click', function() {

    //Get the user ID from the data attribute
    let userId = this.getAttribute('data-user-id');

    //Remove the user ID from the array
    usersToAdd = usersToAdd.filter(id => id !== userId);

    //Hide the 'Remove' button and show the 'Add' button
    this.style.display = 'none';
    this.previousElementSibling.style.display = 'inline';

    //Update the hidden input field with the array of added users
    document.getElementById('users-to-add').value = usersToAdd.join(',');
  });

});