const Message = require('../models/Message');

/**
 * @desc    Send a message
 * @route   POST /api/messages
 * @access  Private
 */
exports.sendMessage = async (req, res) => {
  try {
    const { recipient, content } = req.body;

    // Validation
    if (!recipient || !content) {
      return res.status(400).json({ 
        message: 'Recipient and content are required' 
      });
    }

    // Prevent self-messaging
    if (recipient === req.user.userId) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    // Trim content
    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const message = new Message({
      sender: req.user.userId,
      recipient,
      content: trimmedContent
    });

    await message.save();
    
    // Populate user details
    await message.populate('sender recipient', 'name profileImage');

    res.status(201).json(message);

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      message: 'Error sending message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get conversation between current user and another user
 * @route   GET /api/messages/conversation/:userId
 * @access  Private
 */
exports.getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: req.user.userId, recipient: otherUserId },
        { sender: otherUserId, recipient: req.user.userId }
      ]
    })
      .sort({ createdAt: 1 }) // Oldest first (chronological order)
      .populate('sender', 'name profileImage')
      .populate('recipient', 'name profileImage');

    // Mark messages as read (if current user is recipient)
    await Message.updateMany(
      { 
        sender: otherUserId, 
        recipient: req.user.userId,
        read: false 
      },
      { read: true }
    );

    res.json(messages);

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Error fetching conversation' });
  }
};

/**
 * @desc    Get all conversations (list of users you've chatted with)
 * @route   GET /api/messages/conversations
 * @access  Private
 */
exports.getAllConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all messages involving the user
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { recipient: userId }
      ]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name profileImage')
      .populate('recipient', 'name profileImage');

    // Group messages by conversation partner
    const conversationMap = new Map();

    messages.forEach(msg => {
      // Determine who the other person is
      const otherPerson = msg.sender._id.toString() === userId 
        ? msg.recipient 
        : msg.sender;
      
      const otherPersonId = otherPerson._id.toString();

      // If this person isn't in the map yet, add them with this message
      if (!conversationMap.has(otherPersonId)) {
        conversationMap.set(otherPersonId, {
          user: otherPerson,
          lastMessage: msg,
          unreadCount: 0
        });
      }

      // Count unread messages (where current user is recipient and message is unread)
      if (msg.recipient._id.toString() === userId && !msg.read) {
        conversationMap.get(otherPersonId).unreadCount++;
      }
    });

    // Convert map to array
    const conversations = Array.from(conversationMap.values());

    res.json(conversations);

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

/**
 * @desc    Mark message as read
 * @route   PUT /api/messages/:id/read
 * @access  Private (Only recipient)
 */
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only recipient can mark as read
    if (message.recipient.toString() !== req.user.userId) {
      return res.status(403).json({ 
        message: 'Not authorized. Only recipient can mark message as read.' 
      });
    }

    message.read = true;
    await message.save();

    res.json(message);

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Error updating message' });
  }
};

/**
 * @desc    Mark all messages in a conversation as read
 * @route   PUT /api/messages/conversation/:userId/read
 * @access  Private
 */
exports.markConversationAsRead = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const result = await Message.updateMany(
      {
        sender: otherUserId,
        recipient: req.user.userId,
        read: false
      },
      { read: true }
    );

    res.json({ 
      message: 'Conversation marked as read',
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Mark conversation as read error:', error);
    res.status(500).json({ message: 'Error marking conversation as read' });
  }
};

/**
 * @desc    Delete a message
 * @route   DELETE /api/messages/:id
 * @access  Private (Only sender)
 */
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete their message
    if (message.sender.toString() !== req.user.userId) {
      return res.status(403).json({ 
        message: 'Not authorized. Only sender can delete this message.' 
      });
    }

    await message.deleteOne();

    res.json({ message: 'Message deleted successfully' });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Error deleting message' });
  }
};

/**
 * @desc    Get unread message count
 * @route   GET /api/messages/unread-count
 * @access  Private
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user.userId,
      read: false
    });

    res.json({ unreadCount: count });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Error fetching unread count' });
  }
};
