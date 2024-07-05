document.addEventListener('DOMContentLoaded', function() {
   const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

   /* Menu show */
   navToggle.addEventListener('click', () =>{
      console.log("clicked");
      navMenu.classList.add('show-menu')
   })

   /* Menu hidden */
   navClose.addEventListener('click', () =>{
      navMenu.classList.remove('show-menu')
   })

   document.getElementById('login-btn').addEventListener('click', function() {
      window.location.href = "/profile";
   })
});
