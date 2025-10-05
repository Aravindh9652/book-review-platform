import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          BookReview
        </Link>

        <div className="navbar-nav">
          <Link to="/" className="nav-link">
            Books
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/add-book" className="nav-link">
                Add Book
              </Link>
              <Link to="/my-books" className="nav-link">
                My Books
              </Link>
              <div className="flex items-center gap-4">
                <span>Welcome, {user?.name}</span>
                <button onClick={handleLogout} className="btn btn-danger">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
