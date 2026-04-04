const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Connection = require('../models/Connection');

//  Send connection request
router.post('/', auth, async (req, res) => {
  try {
    const { to, type } = req.body;

    //  Validation
    if (!to || !type) {
      return res.status(400).json({ message: 'to and type are required' });
    }
    const existing = await Connection.findOne({
      from: req.user.userId,
      to,
      type
    });

    if (existing) {
      return res.status(400).json({ message: 'Request already sent' });
    }
    const connection = new Connection({
      from: req.user.userId,
      to,
      type
    });

    await connection.save();

    res.status(201).json(connection);

  } catch (err) {
    console.error('Connection Error:', err); //  IMPORTANT
    res.status(500).json({ message: err.message });
  }
});


//  Get my connections
router.get('/', auth, async (req, res) => {
  try {
    const data = await Connection.find({
      $or: [
        { from: req.user.userId },
        { to: req.user.userId }
      ]
    })
      .populate('from', 'name')
      .populate('to', 'name')
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ message: err.message });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Not found' });
    }

    // Only receiver can accept/reject
    if (connection.to.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    connection.status = status;
    await connection.save();

    res.json(connection);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;