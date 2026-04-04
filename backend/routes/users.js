const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Error' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.userId,
      req.body,
      { new: true }
    ).select('-password');

    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Error' });
  }
});


router.get('/mentors', async (req, res) => {
  try {
    const { skill } = req.query;

    let query = { role: 'mentor' };

    if (skill) {
      query.skills = { $in: [skill] };
    }

    const mentors = await User.find(query).select('-password');

    res.json(mentors);

  } catch (err) {
    res.status(500).json({ message: 'Error fetching mentors' });
  }
});

module.exports = router;