const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    maxlength: [500, 'Review text cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Ensure one review per user per book
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

// Update book's average rating when review is saved/updated/deleted
reviewSchema.post('save', async function() {
  await this.constructor.updateBookRating(this.bookId);
});

reviewSchema.post('findOneAndUpdate', async function() {
  if (this.bookId) {
    await this.constructor.updateBookRating(this.bookId);
  }
});

reviewSchema.post('findOneAndDelete', async function() {
  if (this.bookId) {
    await this.constructor.updateBookRating(this.bookId);
  }
});

// Static method to update book's average rating
reviewSchema.statics.updateBookRating = async function(bookId) {
  const Book = mongoose.model('Book');
  
  const stats = await this.aggregate([
    { $match: { bookId: bookId } },
    {
      $group: {
        _id: '$bookId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: 0,
      totalReviews: 0
    });
  }
};

module.exports = mongoose.model('Review', reviewSchema);
