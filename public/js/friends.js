document.addEventListener("DOMContentLoaded", function () {
  const socket = io();

  const toggleChatOverlayButton = document.getElementById("toggle-chat-overlay");
  const friendsChatOverlay = document.getElementById("friends-chat-overlay");
  const addFriendForm = document.getElementById("add-friend-form");
  const friendsList = document.getElementById("friends-list");
  const chatModal = document.getElementById("chat-modal");
  const chatRoomIdElement = document.getElementById("chat-room-id");
  const typingIndicator = document.getElementById("typing-indicator");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");

  let currentChatRoomId = null;
  let hasUnreadMessages = false;

  /**
   * Toggles the chat overlay by setting the display element.
   */
  toggleChatOverlayButton.addEventListener("click", () => {
    friendsChatOverlay.classList.toggle("show");
  });

  const closeChatModalButton = document.querySelector("#chat-modal button[data-button='close']");
  closeChatModalButton.addEventListener("click", () => {
    chatModal.classList.remove("show");
  });

  async function fetchFriends() {
    try {
      const response = await fetch("/api/friends");
      const text = await response.text();
      console.log("Raw response text:", text);
      const friends = JSON.parse(text);
      friendsList.innerHTML = '';
      hasUnreadMessages = false;

      for (const friend of friends) {
        const listItem = document.createElement("li");

        try {
          const unreadCountResponse = await fetch(`/api/friends/unread-messages/${friend._id}`);
          const { unreadCount } = await unreadCountResponse.json();
          listItem.textContent = `${friend.username} ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`;

          if (unreadCount > 0) {
            const unreadDot = document.createElement("span");
            unreadDot.classList.add("unread-dot");
            listItem.appendChild(unreadDot);
            hasUnreadMessages = true;
          }
        } catch (error) {
          console.error("Error fetching unread messages count:", error);
        }

        const img = document.createElement("img");
        img.src = friend.pfp || '/images/stock.jpg';
        img.style.height = '25px';
        img.style.width = '25px';
        img.style.borderRadius = '50%';
        img.style.border = "1px solid white";

        listItem.appendChild(img);
        const textNode = document.createTextNode(` ${friend.username} (${friend.email})`);
        listItem.appendChild(textNode);

        listItem.addEventListener("click", () => openChat(friend._id));
        friendsList.appendChild(listItem);
      }

      const chatIcon = document.getElementById("toggle-chat-overlay");
      if (hasUnreadMessages) {
        const unreadDot = document.createElement("span");
        unreadDot.classList.add("unread-dot");
        chatIcon.appendChild(unreadDot);
      } else {
        const existingDot = chatIcon.querySelector(".unread-dot");
        if (existingDot) {
          chatIcon.removeChild(existingDot);
        }
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }

  /**
   * Submits a request to add a new friend by email.
   * @param {Event} e - The form submission event.
   */
  addFriendForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = addFriendForm.elements["friend-email"].value;
    const response = await fetch("/api/friends/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    if (result.message) {
      alert(result.message);
      fetchFriends();
    } else {
      alert(result.error);
    }
  });

  /**
   * Opens a chat with the specified friend.
   * @param {string} friendId - The ID of the friend to chat with.
   */
  async function openChat(friendId) {
    socket.emit("joinChatRoom", friendId);
    socket.once("setChatRoomId", async (roomId) => {
      currentChatRoomId = roomId;
    });
    socket.on("chatHistory", (messages) => {
      chatRoomIdElement.innerHTML = messages.map(msg => `
        <li class="${msg.senderId === userId ? 'sent' : 'received'}">
          ${msg.username}: ${msg.message}
        </li>`).join('');
      chatModal.style.display = "block";
      scrollToBottom();
    });

    socket.emit('mark-as-read', friendId);
    fetchFriends();
  }

  /**
   * Handles the submission of a new chat message.
   * @param {Event} e - The form submission event.
   */
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (chatInput.value && currentChatRoomId) {
      const message = chatInput.value;
      socket.emit("chat message", { chatRoomId: currentChatRoomId, message });
      chatInput.value = "";
      socket.emit("stop typing", currentChatRoomId);
      scrollToBottom();
    }
  });

  /**
   * Emits a typing event when the user starts typing a message.
   */
  chatInput.addEventListener("keypress", () => {
    if (chatInput.value && currentChatRoomId) {
      socket.emit("typing", currentChatRoomId);
    }
  });

  /**
   * Handles receiving a new chat message and appends it to the chat window.
   * @param {Object} msg - The message object containing sender details and message content.
   */
  socket.on("chat message", (msg) => {
    const newMessage = document.createElement("li");
    newMessage.className = msg.senderId === userId ? "sent" : "received";
    newMessage.textContent = `${msg.username}: ${msg.message}`;
    chatRoomIdElement.appendChild(newMessage);
    scrollToBottom();
    fetchFriends(); 
  });

  /**
   * Displays a typing indicator when another user is typing.
   * @param {string} username - The username of the user who is typing.
   */
  socket.on("typing", (username) => {
    typingIndicator.textContent = `${username} is typing...`;

    clearTimeout(typingIndicator.timer);
    typingIndicator.timer = setTimeout(() => {
      typingIndicator.textContent = "";
    }, 3000);
  });

  socket.on("stop typing", () => {
    typingIndicator.textContent = "";
  });

  function scrollToBottom() {
    chatRoomIdElement.scrollTop = chatRoomIdElement.scrollHeight;
  }

  fetchFriends();
});
