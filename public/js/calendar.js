/**
 * Creates the calendar and event handling functions.
 */
document.addEventListener("DOMContentLoaded", function () {
  let currentMonthOffset = 0;

  console.log("UserId:", userId);
  console.log("UserEmail:", userEmail);

  // sets the game URLs for production environment
  const gameUrls = {
    chess: "https://goldengaming.onrender.com/gamesSpecific/?game=chess",
    checkers: "https://goldengaming.onrender.com/gameCheckersPlay",
    jigsaw: "https://goldengaming.onrender.com/gameJigsawPlay",
    bingo: "https://goldengaming.onrender.com/gameBingoPlay",
    sudoku: "https://goldengaming.onrender.com/gameSudokuPlay"
  };

  // sets the game URLs for development environment
  // const gameUrls = {
  //   chess: "http://localhost:9001/gamesSpecific/?game=chess",
  //   checkers: "http://localhost:9001/gameCheckersPlay",
  //   jigsaw: "http://localhost:9001/gameJigsawPlay",
  //   bingo: "http://localhost:9001/gameBingoPlay",
  //   sudoku: "http://localhost:9001/gameSudokuPlay"
  // };

  /**
   * Fetches events for the specified user and month.
   * @param {string} userId - The user's ID.
   * @param {number} [monthOffset=0] - The offset for the current month.
   * @returns {Promise<Array>} The events for the user.
   */
  async function fetchEvents(userId, monthOffset = 0) {
    try {
      const response = await fetch(`/api/events/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Fetches the friends list.
   * @returns {Promise<Array>} The list of friends.
   */
  async function fetchFriends() {
    try {
      const response = await fetch('/api/friends');
      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Generates the calendar for the specified month offset. 
   * @param {number} [monthOffset=0] - The offset for the current month.
   */
  async function generateCalendar(monthOffset = 0) {
    const now = new Date();
    const month = now.getMonth() + monthOffset;
    const year = now.getFullYear();
    const today = now.getDate();

    const datesElement = document.getElementById("dates");
    if (!datesElement) return;
    datesElement.innerHTML = "";

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyElement = document.createElement("div");
      datesElement.appendChild(emptyElement);
    }

    const events = await fetchEvents(userId, monthOffset);
    console.log(`Events for the month: ${events.length}`);

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.textContent = day;

      if (day === today && month === now.getMonth()) {
        dayElement.classList.add("today");
      }

      // Check if there are any events on this day
      const eventDate = new Date(year, month, day);
      const eventDateString = eventDate.toISOString().split('T')[0];
      const dayEvents = events.filter(event => new Date(event.date).toISOString().split('T')[0] === eventDateString);

      if (dayEvents.length > 0) {
        const eventList = document.createElement("ul");
        dayEvents.forEach(event => {
          const eventItem = document.createElement("li");
          const eventLink = document.createElement("a");
          eventLink.href = gameUrls[event.game];
          eventLink.textContent = event.game;
          eventItem.appendChild(eventLink);
          eventList.appendChild(eventItem);
        });
        dayElement.appendChild(eventList);
      }

      dayElement.addEventListener("click", () => {
        document.getElementById("event-date").value = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        document.getElementById("event-modal").style.display = "block";
      });

      datesElement.appendChild(dayElement);
    }

    document.querySelector(".month-year").textContent = `${new Date(
      year,
      month
    ).toLocaleDateString("default", { month: "long" })} ${year}`;
  }

  document.getElementById("prev-month").addEventListener("click", () => {
    currentMonthOffset--;
    generateCalendar(currentMonthOffset);
  });

  document.getElementById("next-month").addEventListener("click", () => {
    currentMonthOffset++;
    generateCalendar(currentMonthOffset);
  });

  document.getElementById("event-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const participants = Array.from(document.getElementById("event-participants").selectedOptions)
      .map(option => option.value);
    participants.push(userEmail); 

    console.log("Participants before fetch:", participants);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: data.date,
          game: data.game,
          participants,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const eventData = await response.json();
      alert("Event created successfully!");
      document.getElementById("event-modal").style.display = "none";
      generateCalendar(currentMonthOffset);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event: " + error.message);
    }
  });

  /**
   * Populates the friends dropdown with the user's friends.
   */
  async function populateFriendsDropdown() {
    const friends = await fetchFriends();
    const participantsSelect = document.getElementById('event-participants');

    friends.forEach(friend => {
      const option = document.createElement('option');
      option.value = friend.email;
      option.textContent = `${friend.username} (${friend.email})`;
      participantsSelect.appendChild(option);
    });
  }

  populateFriendsDropdown();
  generateCalendar(currentMonthOffset);
});
