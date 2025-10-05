const express = require('express');
const { body } = require('express-validator');
const { 
  getBooks, 
  getBook, 
  addBook, 
  updateBook, 
  deleteBook, 
  getMyBooks 
} = require('../controllers/bookController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/books
// @desc    Get all books with pagination
// @access  Public
router.get('/', getBooks);

// @route   GET /api/books/my-books
// @desc    Get current user's books
// @access  Private
router.get('/my-books', auth, getMyBooks);

// @route   GET /api/books/:id
// @desc    Get single book
// @access  Public
router.get('/:id', getBook);

// @route   POST /api/books
// @desc    Add new book
// @access  Private
router.post('/', auth, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author name must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('genre')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Genre must be between 1 and 50 characters'),
  body('year')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Please provide a valid year')
], addBook);

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private
router.put('/:id', auth, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author name must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('genre')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Genre must be between 1 and 50 characters'),
  body('year')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Please provide a valid year')
], updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private
router.delete('/:id', auth, deleteBook);

module.exports = router;
