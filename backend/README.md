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
├── index.js          # Main application file
├── routes/          
│   └── auth.js       # Authentication routes
├── models/           # Database models
├── middleware/       # Custom middleware
└── uploads/          # Temporary storage for uploads
 ```

## Security Features
- Rate limiting to prevent abuse
- Password hashing
- JWT authentication
- File size restrictions
- CORS enabled

## Error Handling
The application includes a global error handler that manages:

- Validation errors
- Authentication errors
- File upload errors
- Database errors

## Development
To start the development server with hot reload:

```bash
npm run dev
 ```

For production:

```bash
npm start
 ```


 ## Environment Variables
 ### Variable                              Description Required MONGODB_URI

MongoDB connection string                   Yes 

JWT_SECRET Secret key for JWT               Yes

PORT Server port (default: 5000)            No

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

## Setup

1. Install dependencies:
```bash
npm install