import express from 'express';
import Note from '../models/Note.js';
import auth from '../middleware/auth.js';
import { generateSummary, suggestTags } from '../services/aiService.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get all notes with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    
    let query = { user: req.userId };
    
    // Search by content or title
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    
    // Filter by tag
    if (req.query.tag) {
      query.tags = req.query.tag;
    }
    
    const total = await Note.countDocuments(query);
    const notes = await Note.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      notes,
      hasMore: skip + notes.length < total,
      total,
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Generate summary using AI
    const summary = await generateSummary(content);
    
    // Generate tags if none provided
    let finalTags = tags;
    if (!tags || tags.length === 0) {
      finalTags = await suggestTags(title, content);
    }
    
    const note = new Note({
      title,
      content,
      tags: finalTags,
      summary,
      user: req.userId,
    });
    
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Find note
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Update note fields
    note.title = title;
    note.content = content;
    note.tags = tags;
    
    // Regenerate summary if content changed
    if (content !== note.content) {
      note.summary = await generateSummary(content);
    }
    
    await note.save();
    res.json(note);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;