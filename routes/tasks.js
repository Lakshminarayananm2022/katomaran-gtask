const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const router = express.Router();

// Middleware to check if task belongs to user
const checkTaskOwnership = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all tasks for current user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create new task
router.post('/',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
    body('status').isIn(['Open', 'Complete']).withMessage('Invalid status')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const task = new Task({
        ...req.body,
        user: req.user._id
      });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error creating task' });
    }
  }
);

// Update task
router.patch('/:id',
  auth,
  checkTaskOwnership,
  [
    body('title').optional().trim().notEmpty(),
    body('status').optional().isIn(['Open', 'Complete']),
    body('dueDate').optional().isISO8601()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updates = Object.keys(req.body);
      updates.forEach(update => req.task[update] = req.body[update]);
      await req.task.save();
      res.json(req.task);
    } catch (error) {
      res.status(500).json({ message: 'Error updating task' });
    }
  }
);

// Delete task
router.delete('/:id', auth, checkTaskOwnership, async (req, res) => {
  try {
    await req.task.remove();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;
