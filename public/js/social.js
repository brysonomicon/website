document.addEventListener("DOMContentLoaded", async function () {
    try {
      // get friends list
      const response = await fetch("/api/friends");
      const friends = await response.json();
      console.log(friends);
  
      const friendsCardsContainer = document.getElementById("friends-cards");
      friends.forEach(async friend => {

        //declare pfp using friend.pfp
        let pfp = friend.pfp
        
        //if pfp is undefined, declare it with a stock profile picture image
        if (!pfp) {
          pfp = "/images/stock.jpg";
        }

        //create cards for each friend with pfp and username dynamically loaded in
        const card = document.createElement("div");
        card.className = "col-12 col-sm-6 col-lg-3";
        card.innerHTML = `
          <div class="single_advisor_profile wow fadeInUp" data-wow-delay="0.2s" style="visibility: visible; animation-delay: 0.2s; animation-name: fadeInUp;">
            <div class="advisor_thumb">
              <img src="${pfp}" alt="Profile Picture">
            </div>
            <div class="single_advisor_details_info">
              <h6>${friend.username}</h6>
            </div>
          </div>
        `;
        console.log("here")
        friendsCardsContainer.appendChild(card);


        const socialCard = document.getElementById("friends-cards");
        const friendsChatOverlay = document.getElementById("friends-chat-overlay");

        //when any social card is clicked on, it brings up the friends list overlay where the user can choose to chat
        socialCard.addEventListener("click", () => {
          if (friendsChatOverlay.classList.contains("show")) {
            friendsChatOverlay.classList.remove("show");
          } else {
            friendsChatOverlay.classList.add("show");
          }
        });
      });
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  });
  