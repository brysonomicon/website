const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const User = require('../models/user');

/**
 * Creates a new event and associates it with the participants.
 * @param {Object} req - contains the date, the game to be played, and the participants array
 * @param {Object} res - Express response object.
 */
router.post('/', async (req, res) => {
  const { date, game, participants } = req.body;
  console.log('Incoming request body:', req.body);

  try {
    const users = await User.find({ email: { $in: participants } });
    const participantIds = users.map(user => user._id);

    const event = new Event({ date, game, participants: participantIds });
    await event.save();

    await User.updateMany(
      { _id: { $in: participantIds } },
      { $push: { events: event._id } }
    );

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * Fetches all events associated with a specific user.
 * @param {Object} req - request object containing userId 
 * @param {Object} res - response object that updates the status
 */
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('events');
    res.status(200).json(user.events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
