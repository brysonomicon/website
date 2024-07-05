document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.querySelector(".login-form");
  
    /**
   * Validates the signup form fields before submission.
   * Checks if the email is valid and if the username and password fields are not empty.
   * @param {Event} event - The form submission event.
   */
    signupForm.addEventListener("submit", function(event) {
      const email = document.getElementById("email-phone").value;
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  
      if (!email.match(emailPattern)) {
        alert("Please enter a valid email address.");
        event.preventDefault();
        return;
      }
  
      if (username.trim() === "") {
        alert("Username is required.");
        event.preventDefault();
        return;
      }
  
      if (password.trim() === "") {
        alert("Password is required.");
        event.preventDefault();
        return;
      }
    });
  });
  