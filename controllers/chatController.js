const ChatRoom = require("../models/chatRoom");
const Message = require("../models/message");

/**
 * Creates a new chat instance if one doesn't already exist.
 * 
 * If the room name is not provided or is empty, status 400 and an error message.
 * Tries to find a room with the same name. If there isn't one then it creates 
 * one and gives you that sweet, sweet status 201.
 * @param {Object} req contains the name and participants for the room
 * @param {Object} res a chat room
 * @returns 
 */
exports.createRoom = async (req, res) => {
  const { name, participants } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: "Room name is required" });
  }

  try {
    let room = await ChatRoom.findOne({ name });
    if (!room) {
      room = new ChatRoom({ name, participants, createdAt: new Date() });
      await room.save();
    }
    res.status(201).json({ chatRoomId: room._id.toString(), name: room.name });
  } catch (error) {
    console.error("Error creating chat room:", error);
    res.status(500).json({ error: "Failed to create chat room" });
  }
};

/**
 * Sends a message from senderId to a chatRoomId
 * 
 * Allows an authenticated user to send a message to a chat room. Without a senderId it returns
 * a 401 error and message. Otherwise it builds a message from the chatRoomId, senderId, message object
 * with a timestamp. 
 * @param {Object} req contains chatRoomId and message
 * @param {*} res the message
 * @returns 
 */
exports.sendMessage = async (req, res) => {
  const { chatRoomId, message } = req.body;
  const senderId = req.session.userId;

  if (!senderId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  // console.log(`Entering sendMessage: ${message} to room: ${chatRoomId} by user: ${senderId}`);

  try {
    const newMessage = new Message({
      chatRoomId,
      senderId,
      message,
      timestamp: new Date(),
      isRead: false,
    });

    await newMessage.save();

    // console.log(`Exiting sendMessage: ${message} saved with ID: ${newMessage._id}`);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

/**
 * Surprisingly, getChatHistory gets the chat history.
 * 
 * Gets all the messages for a chatRoomId and sorts them in ascending order. Then it maps
 * the message with the chatRoomId, senderId, username of the sender, the message and the timestamp.
 * Gives you the lesser status 200 which still represents success, but lacks the creativity of 201.
 * @param {Object} req contains the roomId
 * @param {*} res chat history for the room
 */
exports.getChatHistory = async (req, res) => {
  const { roomId } = req.params;

  try {
    // console.log(`Fetching chat history for roomId: ${roomId}`);
    const messages = await Message.find({ chatRoomId: roomId }).sort({ timestamp: 1 }).populate('senderId', 'username');
    // console.log(`Fetched messages: ${messages.length}`, messages);

    await Message.updateMany({ chatRoomId: roomId, isRead: false }, { $set: { isRead: true } });

    const messagesWithUsernames = messages.map(msg => ({
      chatRoomId: msg.chatRoomId,
      senderId: msg.senderId._id,
      username: msg.senderId.username,
      message: msg.message,
      timestamp: msg.timestamp,
      isRead: msg.isRead,
    }));

    console.log("Chat history:", JSON.stringify(messagesWithUsernames, null, 2));
    res.status(200).json(messagesWithUsernames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get chat history." });
  }
};
