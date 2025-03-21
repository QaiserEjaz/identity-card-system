# Identity Card System - Backend

A Node.js backend service for managing identity cards with image upload capabilities, authentication, and MongoDB integration.

## Technologies Used
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file handling
- Rate limiting protection
- CORS enabled
- Environment variables management

## API Endpoints

### Authentication
- POST /api/auth/login - Admin login
  - Body: { email, password }
  - Returns: { token, user }

### Identity Cards
- GET /api/cards - Get all cards (with pagination)
  - Query params:
    - page (default: 1)
    - limit (default: 10)
- GET /api/cards/:id - Get a specific card
- POST /api/cards - Create a new card
- PUT /api/cards/:id - Update an existing card
- DELETE /api/cards/:id - Delete a card

### Dashboard Analytics
- GET /api/dashboard/stats - Get dashboard statistics
  - Query params: 
    - range (default: 7)
    - type (default: 'days')
  - Returns: Activity trends, gender distribution, religion distribution

### File Upload Specifications
- Maximum file size: 500KB
- Supported formats: JPEG, PNG
- Image compression enabled
- Base64 storage in database
- Separate upload handlers for photos and signatures

## Security Features
- JWT-based authentication
- Rate limiting protection
- Input validation
- File size and type validation
- Error handling middleware
- Secure headers with CORS

## Project Structure
```plaintext
backend/
├── middleware/
│   ├── errorHandler.js    # Global error handler
│   └── ratelimiter.js         # Rate limiting middleware
│
├── models/
│   ├── Card.js            # Card schema and model
│   └── User.js            # User schema and model
│
├── routes/
│   └── auth.js            # JWT authentication
│

├── uploads/               # Temporary file storage
│   └── .gitkeep          # Keep empty directory in git
│
├── .env                  # Environment variables
├── .gitignore           # Git ignore configuration
├── db.js
├── index.js             # Application entry point
├── package.json         # Project dependencies
└── README.md            # Project documentation
 ```