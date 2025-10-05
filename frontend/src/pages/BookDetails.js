import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookDetails();
    fetchReviews();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await api.get(`/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/book/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reviews', {
        bookId: id,
        rating,
        reviewText
      });
      setReviewText('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await api.delete(`/books/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!book) {
    return <div className="container">Book not found</div>;
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="container">
      <div className="book-details">
        <div className="book-header">
          <h1>{book.title}</h1>
          <div className="book-meta">
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Year:</strong> {book.year}</p>
            <p><strong>Average Rating:</strong> {averageRating} ⭐ ({reviews.length} reviews)</p>
          </div>
        </div>

        <div className="book-description">
          <h3>Description</h3>
          <p>{book.description}</p>
        </div>

        {user && user._id === book.addedBy && (
          <div className="book-actions">
            <button 
              onClick={() => navigate(`/edit-book/${id}`)}
              className="btn btn-primary"
            >
              Edit Book
            </button>
            <button 
              onClick={handleDeleteBook}
              className="btn btn-danger"
            >
              Delete Book
            </button>
          </div>
        )}

        <div className="reviews-section">
          <h3>Reviews ({reviews.length})</h3>
          
          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>Rating:</label>
                <select 
                  value={rating} 
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="form-control"
                >
                  <option value={1}>1 ⭐</option>
                  <option value={2}>2 ⭐</option>
                  <option value={3}>3 ⭐</option>
                  <option value={4}>4 ⭐</option>
                  <option value={5}>5 ⭐</option>
                </select>
              </div>
              <div className="form-group">
                <label>Review:</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="form-control"
                  rows="4"
                  placeholder="Write your review..."
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <strong>{review.userId.name}</strong>
                  <span className="rating">{'⭐'.repeat(review.rating)}</span>
                </div>
                <p>{review.reviewText}</p>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
