document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector(".login-form");
  
    /**
   * Validates the login form fields before submission.
   * Checks if the email and password fields are not empty.
   * @param {Event} event - The form submission event.
   */
    loginForm.addEventListener("submit", function(event) {
      const email = document.getElementById("email-phone").value;
      const password = document.getElementById("password").value;
  
      if (email.trim() === "") {
        alert("Email is required.");
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
  