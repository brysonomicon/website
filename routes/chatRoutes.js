const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");


router.post("/create-room", chatController.createRoom);
router.post("/send-message", chatController.sendMessage);
router.get("/chat-history/:roomId", chatController.getChatHistory);

module.exports = router;
