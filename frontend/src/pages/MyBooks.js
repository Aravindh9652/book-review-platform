import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const MyBooks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMyBooks();
  }, [currentPage]);

  const fetchMyBooks = async () => {
    try {
      const response = await api.get(`/books/my-books?page=${currentPage}&limit=6`);
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching my books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await api.delete(`/books/${bookId}`);
      fetchMyBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>My Books</h2>
        <button 
          onClick={() => navigate('/add-book')}
          className="btn btn-primary"
        >
          Add New Book
        </button>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <h3>No books added yet</h3>
          <p>Start building your book collection by adding your first book!</p>
          <button 
            onClick={() => navigate('/add-book')}
            className="btn btn-primary"
          >
            Add Your First Book
          </button>
        </div>
      ) : (
        <>
          <div className="books-grid">
            {books.map((book) => (
              <div key={book._id} className="book-card">
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Genre:</strong> {book.genre}</p>
                  <p><strong>Year:</strong> {book.year}</p>
                  <p className="book-description">{book.description}</p>
                </div>
                <div className="book-actions">
                  <button 
                    onClick={() => navigate(`/book/${book._id}`)}
                    className="btn btn-secondary"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => navigate(`/edit-book/${book._id}`)}
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteBook(book._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyBooks;
