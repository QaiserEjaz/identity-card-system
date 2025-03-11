# Identity Card System - Backend

A Node.js backend service for managing identity cards with image upload capabilities, authentication, and MongoDB integration.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Multer (for file handling)
- bcryptjs (for password hashing)
- CORS
- dotenv (for environment variables)

## API Endpoints
### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Identity Cards
- GET /api/cards - Get all cards (with pagination)
  - Query params:
    - page (default: 1)
    - limit (default: 10)
- GET /api/cards/:id - Get a specific card
- POST /api/cards - Create a new card
- PUT /api/cards/:id - Update an existing card
- DELETE /api/cards/:id - Delete a card

### File Upload Specifications
- Supports image uploads for photos and signatures
- Maximum file size: 5MB
- Accepted file types: Images (jpeg, png, etc.)
- Files are stored as base64 in the database

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