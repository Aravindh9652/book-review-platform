const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let users = [
  {
    id: 1,
    name: "Default",
    email: "default@example.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    createdAt: new Date()
  }
];
let books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A classic American novel set in the Jazz Age, following the mysterious Jay Gatsby and his obsession with the beautiful Daisy Buchanan.",
    genre: "Fiction",
    year: 1925,
    addedBy: 1,
    createdAt: new Date(),
    averageRating: 4.2,
    totalReviews: 15
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A philosophical novel that tells the story of Santiago, a young shepherd who dreams of discovering a hidden treasure.",
    genre: "Fiction",
    year: 1988,
    addedBy: 1,
    createdAt: new Date(),
    averageRating: 4.5,
    totalReviews: 23
  }
];
let reviews = [];
let nextId = 3;

// Helper functions
const generateId = () => nextId++;

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Debug endpoint to see current users and books
app.get('/api/debug', (req, res) => {
  res.json({
    users: users.map(u => ({ id: u.id, name: u.name, email: u.email })),
    books: books.map(b => ({ id: b.id, title: b.title, addedBy: b.addedBy })),
    totalUsers: users.length,
    totalBooks: books.length
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: generateId(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(user);

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Book routes
app.get('/api/books', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const search = req.query.search || '';
  const genre = req.query.genre || '';
  const sortBy = req.query.sortBy || '';

  let filteredBooks = [...books];

  // Apply search filter
  if (search) {
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply genre filter
  if (genre) {
    filteredBooks = filteredBooks.filter(book => book.genre === genre);
  }

  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case 'title':
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'author':
        filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'year':
        filteredBooks.sort((a, b) => b.year - a.year);
        break;
      case 'rating':
        filteredBooks.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      default:
        break;
    }
  }

  const totalBooks = filteredBooks.length;
  const totalPages = Math.ceil(totalBooks / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  // Add user information to books
  const booksWithUsers = paginatedBooks.map(book => {
    const user = users.find(u => u.id === book.addedBy);
    return {
      ...book,
      addedBy: user ? { id: user.id, name: user.name } : { id: book.addedBy, name: 'Default' }
    };
  });

  res.json({
    books: booksWithUsers,
    pagination: {
      currentPage: page,
      totalPages,
      totalBooks,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});

app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  // Add user information to book
  const user = users.find(u => u.id === book.addedBy);
  const bookWithUser = {
    ...book,
    addedBy: user ? { id: user.id, name: user.name } : { id: book.addedBy, name: 'Unknown User' }
  };
  
  res.json(bookWithUser);
});

app.post('/api/books', authenticateToken, (req, res) => {
  try {
    const { title, author, description, genre, year } = req.body;

    const book = {
      id: generateId(),
      title,
      author,
      description,
      genre,
      year: parseInt(year),
      addedBy: req.user.userId,
      createdAt: new Date()
    };

    books.push(book);
    res.status(201).json(book);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Failed to add book' });
  }
});

app.put('/api/books/:id', authenticateToken, (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (books[bookIndex].addedBy !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, author, description, genre, year } = req.body;
    books[bookIndex] = {
      ...books[bookIndex],
      title,
      author,
      description,
      genre,
      year: parseInt(year)
    };

    res.json(books[bookIndex]);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Failed to update book' });
  }
});

app.delete('/api/books/:id', authenticateToken, (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (books[bookIndex].addedBy !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    books.splice(bookIndex, 1);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

app.get('/api/books/my-books', authenticateToken, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  const userBooks = books.filter(book => book.addedBy === req.user.userId);
  const totalBooks = userBooks.length;
  const totalPages = Math.ceil(totalBooks / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBooks = userBooks.slice(startIndex, endIndex);

  // Add user information to books
  const booksWithUsers = paginatedBooks.map(book => {
    const user = users.find(u => u.id === book.addedBy);
    return {
      ...book,
      addedBy: user ? { id: user.id, name: user.name } : { id: book.addedBy, name: 'Default' }
    };
  });

  res.json({
    books: booksWithUsers,
    pagination: {
      currentPage: page,
      totalPages,
      totalBooks,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});

// Review routes
app.get('/api/reviews/book/:bookId', (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const bookReviews = reviews.filter(r => r.bookId === bookId);
  res.json(bookReviews);
});

app.post('/api/reviews', authenticateToken, (req, res) => {
  try {
    const { bookId, rating, reviewText } = req.body;

    const review = {
      id: generateId(),
      bookId: parseInt(bookId),
      userId: req.user.userId,
      rating: parseInt(rating),
      reviewText,
      createdAt: new Date()
    };

    reviews.push(review);
    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to add review' });
  }
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Using in-memory database for testing');
});
