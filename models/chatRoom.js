const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
  name: { type: String, unique: true, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  lastMessage: String,
  lastMessageTimestamp: Date,
});

/**
 * Requires a name that is a string. Participants are made of User objects.
 * Includes a Date object for when it was created. Keeps track of the last message
 * and when it was created.
 */
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
