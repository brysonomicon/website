document.addEventListener("DOMContentLoaded", function () {
  // all the pages in an array
    const tutorialContent = [
      `<h2>Welcome to Golden Gaming</h2><p>This is the first page of your tutorial.</p>
      <p>Use the "Next" and "Previous" buttons to navigate through the tutorial pages</p>
      <p>Close the tutorial at any time using the "Close" button or clicking outside of the popup</p>`,

      `<h2>Navigating around</h2><p>We can use to buttons at the bottom of the screen for navigation</p>
      <img style="width: 100%" src="/images/tutorial/ss1.png">
      <br><br>
      <p>And the buttons at the top</p>
      <img style="width: 100%" src="/images/tutorial/ss2.png">
      <br><br><br>
      <p>For mobile, the buttons at the top can be accessed using the three lines</p>
      <img style="width: 60%" src="/images/tutorial/ss3.png">`,

      `<h2>Social feature</h2><p>We can click the button in the bottom right corner to access friends and chats</p>
      <img style="width: 10%" src="/images/tutorial/ss4.png">
      <br><br>
      <p>We can enter our friend's email address and click the "Add Friend" button to add them to our friend's list</p>
      <img style="width: 40%" src="/images/tutorial/ss5.png">
      <br><br>
      <p>Click on one of your friends to start chatting!</p>
      <img style="width: 40%" src="/images/tutorial/ss6.png">
      <br><br>
      <p>This will open a chat in the bottom right corner of your screen, you can press the box to enter a message</p>
      <img style="width: 40%" src="/images/tutorial/ss7.png">
      <br><br><br>
      <p>You can see your friend's displayed on the social page!</p>
      <img style="width: 80%" src="/images/tutorial/ss8.png">`,

      `<h2>Games</h2><p>Lets navigate to the games page to play and have fun!</p>
      <p>We can choose a game we want to play and click on it</p>
      <img style="width: 100%" src="/images/tutorial/ss9.png">
      <br><br>
      <p>If at any point you need help with the game, feel free to click the yellow "Help" button</p>
      <img style="width: 30%" src="/images/tutorial/ss10.png">`,

      `<h2>Profile</h2><p>Lets navigate to the profile page and spice up our profile!</p>
      <p>To change our profile picture, click the "Change picture" button</p>
      <img style="width: 50%" src="/images/tutorial/ss11.png">
      <br><br><br>
      <p>We can choose from one of the default images, or upload one from our computer. After we are done, we click the "Upload photo" button</p>
      <img style="width: 60%" src="/images/tutorial/ss12.png">
      <br><br>
      <p>Change your username and email in the same way, by clicking the button and filling out the text box</p>
      <img style="width: 60%" src="/images/tutorial/ss13.png">
      <br><br>
      <p>Set your favourite game by clicking the "Edit" button and change your bio by clicking the bio text, typing your new bio, and pressing the "Update Bio" button</p>
      <img style="width: 70%" src="/images/tutorial/ss14.png">`,

      `<h2>Calender</h2><p>Lets navigate to the calender page to view events and create our own!</p>
      <p>Here we can see the current month with the current day highlighted. Use the "Next" and "Previous" buttons to navigate the months</p>
      <img style="width: 80%" src="/images/tutorial/ss15.png">
      <br><br><br>
      <p>Click a date to create an event. Edit the date, choose the game, and select participants. Click on a single participant or click multiple to add many friends to your event! Finally click "Create Event" to upload the event</p>
      <img style="width: 70%" src="/images/tutorial/ss16.png">
      <br><br>
      <p>Access an event by clicking the highlighted event name on a calendar date</p>
      <img style="width: 30%" src="/images/tutorial/ss17.png">`,

      `<h2>Themes</h2><p>Click the cog icon in the top right to access themes</p>
      <img style="width: 50%" src="/images/tutorial/ss18.png">
      <p>This will open a couple theme options, click one and see what you like!</p>
      <img style="width: 50%" src="/images/tutorial/ss19.png">`,
    ];
  
    let currentPage = 0;
  
    const tutorialBody = document.getElementById("tutorialBody");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");

    //everytime new page is loaded, scroll to top
    function scrollToTopOfModal() {
      var modalContent = document.querySelector('.modal-content'); // Assuming your modal content has this class
      if (modalContent) {
        modalContent.scrollTop = 0; // Scroll to the top of the modal content
      }
    }
  //update content and buttons
    function updateModalContent() {
      tutorialBody.innerHTML = tutorialContent[currentPage];
      prevButton.style.display = currentPage === 0 ? "none" : "inline-block";
      nextButton.textContent = currentPage === tutorialContent.length - 1 ? "Finish" : "Next";
    }
  
    //go to previous page
    prevButton.addEventListener("click", function () {
      if (currentPage > 0) {
        currentPage--;
        updateModalContent();
        scrollToTopOfModal();
      }
    });
  
    //go to next page and if its the last page, the nextButton turns to "Finish" and it closes the modal on click
    nextButton.addEventListener("click", function () {
      if (currentPage < tutorialContent.length - 1) {
        $(nextButton).attr("data-dismiss", "");
        currentPage++;
        updateModalContent();
        scrollToTopOfModal();
      } else {
        $(nextButton).attr("data-dismiss", "modal");
      }
    });
  
    document.getElementById("tutorialButton").addEventListener("click", function () {
      currentPage = 0;
      updateModalContent();
    });
  
    updateModalContent();  // Initialize modal with the first page content
  });