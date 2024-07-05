const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendshipSchema = new Schema({
  user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

/**
 * The model of friendship. Detailing the everlasting friendship of 
 * user1 and user2 and marking the occasion with a date object.
 */
const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = Friendship;
