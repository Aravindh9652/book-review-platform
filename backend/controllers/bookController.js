const { validationResult } = require('express-validator');
const Book = require('../models/Book');

// @desc    Get all books with pagination
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    
    const { search, genre, sortBy } = req.query;
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }
    
    // Build sort
    let sort = { createdAt: -1 }; // Default sort by newest
    if (sortBy === 'title') sort = { title: 1 };
    if (sortBy === 'author') sort = { author: 1 };
    if (sortBy === 'year') sort = { year: -1 };
    if (sortBy === 'rating') sort = { averageRating: -1 };
    
    const books = await Book.find(query)
      .populate('addedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Book.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      books,
      pagination: {
        currentPage: page,
        totalPages,
        totalBooks: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error while fetching books' });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'name email');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error while fetching book' });
  }
};

// @desc    Add new book
// @route   POST /api/books
// @access  Private
const addBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, author, description, genre, year } = req.body;
    
    const book = await Book.create({
      title,
      author,
      description,
      genre,
      year,
      addedBy: req.user._id
    });
    
    const populatedBook = await Book.findById(book._id)
      .populate('addedBy', 'name email');
    
    res.status(201).json({
      message: 'Book added successfully',
      book: populatedBook
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ message: 'Server error while adding book' });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if user is the book creator
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }
    
    const { title, author, description, genre, year } = req.body;
    
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, description, genre, year },
      { new: true, runValidators: true }
    ).populate('addedBy', 'name email');
    
    res.json({
      message: 'Book updated successfully',
      book: updatedBook
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error while updating book' });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if user is the book creator
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }
    
    await Book.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error while deleting book' });
  }
};

// @desc    Get user's books
// @route   GET /api/books/my-books
// @access  Private
const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ addedBy: req.user._id })
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(books);
  } catch (error) {
    console.error('Get my books error:', error);
    res.status(500).json({ message: 'Server error while fetching your books' });
  }
};

module.exports = {
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
  getMyBooks
};
