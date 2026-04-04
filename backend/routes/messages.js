const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');


// 📤 SEND MESSAGE
// POST /api/messages
router.post('/', auth, async (req, res) => {
  try {
    const { recipient, content } = req.body;

    // Validation
    if (!recipient || !content) {
      return res.status(400).json({ message: 'Recipient and content required' });
    }

    const message = new Message({
      sender: req.user.userId,
      recipient,
      content
    });

    await message.save();

    res.status(201).json(message);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message' });
  }
});


// 📥 GET CONVERSATION BETWEEN 2 USERS
// GET /api/messages/:userId
router.get('/:userId', auth, async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: req.user.userId, recipient: otherUserId },
        { sender: otherUserId, recipient: req.user.userId }
      ]
    })
      .sort({ createdAt: 1 }) // oldest first
      .populate('sender', 'name')
      .populate('recipient', 'name');

    res.json(messages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});


// 📋 GET ALL CONVERSATIONS (Optional but useful)
// GET /api/messages
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.userId },
        { recipient: req.user.userId }
      ]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name')
      .populate('recipient', 'name');

    res.json(messages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});


// 📖 MARK MESSAGE AS READ (Optional)
// PUT /api/messages/:id/read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only recipient can mark as read
    if (message.recipient.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    message.read = true;
    await message.save();

    res.json(message);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating message' });
  }
});


module.exports = router;