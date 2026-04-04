const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      creator: req.user.userId
    });

    await project.save();
    res.json(project);
  } catch {
    res.status(500).json({ message: 'Error' });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('creator', 'name role')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch {
    res.status(500).json({ message: 'Error' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator', 'name role');

    res.json(project);
  } catch {
    res.status(500).json({ message: 'Error' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    Object.assign(project, req.body);
    await project.save();

    res.json(project);
  } catch {
    res.status(500).json({ message: 'Error' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await project.deleteOne();

    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;