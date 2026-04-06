const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const connectionController = require('../controllers/connectionController');

// @route   GET /api/connections/received
router.get('/received', auth, connectionController.getReceivedRequests);

// @route   GET /api/connections/sent
router.get('/sent', auth, connectionController.getSentRequests);

// @route   GET /api/connections/network
router.get('/network', auth, connectionController.getNetwork);

// @route   POST /api/connections
router.post('/', auth, connectionController.sendConnectionRequest);

// @route   GET /api/connections
router.get('/', auth, connectionController.getMyConnections);

// @route   PUT /api/connections/:id
router.put('/:id', auth, connectionController.updateConnectionStatus);

// @route   DELETE /api/connections/:id
router.delete('/:id', auth, connectionController.deleteConnection);

module.exports = router;