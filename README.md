# Book Review Platform

A fullstack MERN application where users can sign up, log in, add books, and review books. This platform features user authentication, book management with CRUD operations, and a comprehensive review system with ratings.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based authentication with password hashing
- **Book Management**: Add, edit, delete, and view books with pagination
- **Review System**: Rate and review books with 1-5 star ratings
- **Search & Filter**: Search books by title/author and filter by genre
- **Responsive Design**: Modern UI built with Tailwind CSS

### Technical Features
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, React Router, Context API
- **Authentication**: JWT tokens, bcrypt password hashing
- **Database**: MongoDB Atlas with proper schema design
- **API**: RESTful API with proper error handling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd BookReview
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `config.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/book-review-platform?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

### 5. Start the Application

#### Backend (Terminal 1)
```bash
cd backend
npm run dev
```

#### Frontend (Terminal 2)
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Book Endpoints

#### Get All Books (with pagination)
```http
GET /api/books?page=1&search=harry&genre=Fiction&sortBy=title
```

#### Get Single Book
```http
GET /api/books/:id
```

#### Add New Book (Protected)
```http
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description...",
  "genre": "Fiction",
  "year": 2023
}
```

#### Update Book (Protected - Owner only)
```http
PUT /api/books/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "author": "Author Name",
  "description": "Updated description...",
  "genre": "Fiction",
  "year": 2023
}
```

#### Delete Book (Protected - Owner only)
```http
DELETE /api/books/:id
Authorization: Bearer <token>
```

#### Get User's Books (Protected)
```http
GET /api/books/my-books
Authorization: Bearer <token>
```

### Review Endpoints

#### Get Book Reviews
```http
GET /api/reviews/book/:bookId
```

#### Add Review (Protected)
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "book_id_here",
  "rating": 5,
  "reviewText": "Great book! Highly recommended."
}
```

#### Update Review (Protected - Owner only)
```http
PUT /api/reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "reviewText": "Updated review text..."
}
```

#### Delete Review (Protected - Owner only)
```http
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

#### Get User's Reviews (Protected)
```http
GET /api/reviews/my-reviews
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Book Schema
```javascript
{
  title: String (required, max 200 chars),
  author: String (required, max 100 chars),
  description: String (required, max 1000 chars),
  genre: String (required, max 50 chars),
  year: Number (required, valid year),
  addedBy: ObjectId (ref: User),
  averageRating: Number (default: 0, min: 0, max: 5),
  totalReviews: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Review Schema
```javascript
{
  bookId: ObjectId (ref: Book, required),
  userId: ObjectId (ref: User, required),
  rating: Number (required, min: 1, max: 5),
  reviewText: String (required, max 500 chars),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Frontend Pages

### Public Pages
- **Home/Book List**: Displays all books with pagination, search, and filters
- **Book Details**: Shows book information, reviews, and average rating
- **Login**: User authentication form
- **Register**: User registration form

### Protected Pages
- **Add Book**: Form to add new books
- **Edit Book**: Form to edit existing books (owner only)
- **My Books**: List of user's added books

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Input validation and sanitization
- CORS configuration
- Error handling

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variable:
   - `REACT_APP_API_URL=https://your-backend-url.com/api`
5. Deploy

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Project Structure

```
BookReview/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── books.js
│   │   └── reviews.js
│   ├── config.env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── BookList.js
│   │   │   ├── BookDetails.js
│   │   │   ├── AddBook.js
│   │   │   ├── EditBook.js
│   │   │   ├── MyBooks.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created as a MERN stack assignment demonstrating full-stack development skills.

## 🆘 Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.

---

**Note**: Remember to change the JWT_SECRET and MongoDB URI in production environments for security.
