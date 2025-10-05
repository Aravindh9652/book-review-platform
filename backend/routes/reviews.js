const express = require('express');
const { body } = require('express-validator');
const { 
  getBookReviews, 
  addReview, 
  updateReview, 
  deleteReview, 
  getMyReviews,
  getReview
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews/book/:bookId
// @desc    Get reviews for a book
// @access  Public
router.get('/book/:bookId', getBookReviews);

// @route   GET /api/reviews/my-reviews
// @desc    Get current user's reviews
// @access  Private
router.get('/my-reviews', auth, getMyReviews);

// @route   GET /api/reviews/:id
// @desc    Get single review
// @access  Public
router.get('/:id', getReview);

// @route   POST /api/reviews
// @desc    Add review
// @access  Private
router.post('/', auth, [
  body('bookId')
    .notEmpty()
    .withMessage('Book ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Review text must be between 10 and 500 characters')
], addReview);

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', auth, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Review text must be between 10 and 500 characters')
], updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', auth, deleteReview);

module.exports = router;
