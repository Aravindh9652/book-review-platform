import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    search: '',
    genre: '',
    sortBy: '',
  });

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.page) params.append('page', filters.page);
      
      const response = await api.get(`/books?${params.toString()}`);
      setBooks(response.data.books || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1, search: e.target.search.value });
  };

  const handleSearchInput = (e) => {
    setFilters({ ...filters, page: 1, search: e.target.value });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, page: 1, [key]: value });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const renderStars = (rating) => {
    if (!rating || rating === 0) return '☆☆☆☆☆';
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }

    if (hasHalfStar) {
      stars.push('☆');
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆');
    }

    return stars.join(' ');
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: '50px' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '20px' }}>Book Collection</h1>
      
      {/* Search and Filters */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleSearchInput}
              placeholder="Search books by title, author, or description..."
              className="form-input"
              style={{ 
                flex: 1,
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none'
              }}
              autoComplete="off"
            />
            <button 
              type="button" 
              onClick={() => setFilters({ ...filters, search: '', page: 1 })}
              className="btn btn-secondary"
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="form-input"
            style={{ 
              width: '200px',
              padding: '10px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: 'white'
            }}
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Thriller">Thriller</option>
            <option value="Biography">Biography</option>
            <option value="History">History</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="form-input"
            style={{ 
              width: '150px',
              padding: '10px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: 'white'
            }}
          >
            <option value="">Sort by</option>
            <option value="title">Title A-Z</option>
            <option value="author">Author A-Z</option>
            <option value="year">Year (Newest)</option>
            <option value="rating">Rating (Highest)</option>
          </select>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee', color: '#c33', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-3">
        {books.map((book) => (
          <div key={book.id} className="card">
            <h3 style={{ marginBottom: '10px' }}>{book.title}</h3>
            <p style={{ color: '#666', marginBottom: '10px' }}>by {book.author}</p>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>
              {book.genre} • {book.year}
            </p>
            
            <p style={{ marginBottom: '15px', fontSize: '14px' }}>
              {book.description}
            </p>

            <div style={{ marginBottom: '15px' }}>
              <span className="stars">{renderStars(book.averageRating || 0)}</span>
              <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
                {(book.averageRating || 0).toFixed(1)} ({book.totalReviews || 0} reviews)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <Link to={`/book/${book.id}`} style={{ color: '#3b82f6' }}>
                View Details
              </Link>
              <span style={{ fontSize: '12px', color: '#888' }}>
                Added by {book.addedBy?.name || 'Unknown User'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <div style={{ display: 'inline-flex', gap: '5px' }}>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="btn"
              style={{ opacity: !pagination.hasPrev ? 0.5 : 1 }}
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={page === pagination.currentPage ? 'btn btn-primary' : 'btn'}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="btn"
              style={{ opacity: !pagination.hasNext ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {books.length === 0 && !loading && (
        <div className="text-center" style={{ padding: '50px' }}>
          <p style={{ color: '#666' }}>No books found. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BookList;
