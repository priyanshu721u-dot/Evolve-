const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const messageController = require('../controllers/messageController');

// @route   GET /api/messages/conversations
router.get('/conversations', auth, messageController.getAllConversations);
// @route   GET /api/messages/unread-count
router.get('/unread-count', auth, messageController.getUnreadCount);
// @route   GET /api/messages/conversation/:userId
router.get('/conversation/:userId', auth, messageController.getConversation);
// @route   PUT /api/messages/conversation/:userId/read
router.put('/conversation/:userId/read', auth, messageController.markConversationAsRead);
// @route   POST /api/messages
router.post('/', auth, messageController.sendMessage);
// @route   PUT /api/messages/:id/read
router.put('/:id/read', auth, messageController.markAsRead);
// @route   DELETE /api/messages/:id
router.delete('/:id', auth, messageController.deleteMessage);

module.exports = router;