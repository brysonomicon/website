const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  game: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

/** The database model for a calendar event. Contains the Date, the game being scheduled 
 * and an array of the participants.
 */
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;