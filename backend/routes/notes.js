const express = require('express');

const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Gets all notes for the logged-in user
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter = {
      userId: req.user.userId
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    const notes = await Note.find(filter).sort({
      isPinned: -1,
      updatedAt: -1
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    });
  }
});

// Creates a new note
router.post('/', async (req, res) => {
  try {
    const { title, content, color, category, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: 'Title and content are required'
      });
    }

    const note = await Note.create({
      title,
      content,
      color,
      category,
      isPinned,
      userId: req.user.userId
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    });
  }
});

// Updates an existing note owned by the logged-in user
router.put('/:id', async (req, res) => {
  try {
    const { title, content, color, category, isPinned } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId
      },
      {
        title,
        content,
        color,
        category,
        isPinned,
        updatedAt: Date.now()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedNote) {
      return res.status(404).json({
        error: 'Note not found'
      });
    }

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    });
  }
});

// Deletes a note owned by the logged-in user
router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!deletedNote) {
      return res.status(404).json({
        error: 'Note not found'
      });
    }

    res.json({
      message: 'Note deleted'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    });
  }
});

// Toggles pinned status for one note
router.patch('/:id/pin', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!note) {
      return res.status(404).json({
        error: 'Note not found'
      });
    }

    note.isPinned = !note.isPinned;
    note.updatedAt = Date.now();

    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    });
  }
});

module.exports = router;