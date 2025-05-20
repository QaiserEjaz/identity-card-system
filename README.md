<div align="center">

# 🆔 Identity Cards Management System

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white)](https://fontawesome.com/)
[![QR Code](https://img.shields.io/badge/QR_Code-000000?style=for-the-badge&logo=qrcode&logoColor=white)](https://www.npmjs.com/package/qrcode)
[![Redux Thunk](https://img.shields.io/badge/Redux_Thunk-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://github.com/reduxjs/redux-thunk)
[![CORS](https://img.shields.io/badge/CORS-000000?style=for-the-badge&logo=cors&logoColor=white)](https://www.npmjs.com/package/cors)

A full-stack web application for managing identity cards with advanced features, built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

[Live Demo](https://identity-card-system.vercel.app) | [Report Bug](https://github.com/QaiserEjaz/identity-card-system/issues)

<!-- <img src="./docs/images/banner.png" alt="Project Banner" width="100%"/> -->

</div>

## ✨ Features

### 🎯 Core Functionality
- Create, read, update, and delete identity cards
- Image upload for photos and signatures
- PDF generation and preview
- QR code generation for each card
- Responsive design for all devices
- Multiple view options (Card/Table view)

### 💡 Advanced Features
- Real-time form validation
- Interactive UI with animations
- Secure file upload handling with size restrictions (500KB max)
- Advanced data visualization with charts
- Pagination and dynamic search
- Role-based authentication
- Admin dashboard with statistics
- Image compression and optimization
- Responsive design across all devices

### 🔒 Security Features
- JWT-based authentication
- Protected routes and API endpoints
- File upload validation and sanitization
- Input data validation
- Rate limiting protection
- Secure password handling

### 📊 Dashboard Features
- Activity trends visualization
- Gender distribution charts
- Religion distribution analytics
- Age group statistics
- Real-time data updates
- Customizable time ranges

___

## 📸 Screenshots & Interface

<div align="center">

### 🔐 Login Interface
![Login Preview](./docs/images/login.png)

### 🖥️ Dashboard View
![Dashboard Preview](./docs/images/dashboard.png)

### 📝 Input Form Interface
![Input Form](./docs/images/input-form.png)

### 🎴 Card View Layout
![Card View](./docs/images/card-view.png)

### 📋 List View Interface
![List View](./docs/images/list-view.png)

### 📱 Card Detail Interface
![Card Detail View](./docs/images/card-detail.png)

### 📄 PDF Export Feature
![Exported Pdf](./docs/images/pdf-preview.png)

</div>

### Key Interface Features:
- Clean and intuitive dashboard layout
- Responsive card detail view
- Professional PDF export design
- Dark/Light mode support
- Mobile-friendly interface
- Interactive data tables
- Modern form controls

___

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- Redux Toolkit for state management
- Bootstrap 5 with custom animations
- Chart.js for data visualization
- Axios for API integration
- jsPDF for document generation
- QR Code generation
- FontAwesome icons
- Custom CSS with responsive design

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Multer for file handling
- CORS enabled
- Rate limiting
- Environment variables

___

## 🚀 Live Demo

- Frontend: [https://identity-card-system.vercel.app](https://identity-card-system.vercel.app)
- Backend: [https://identity-card-system-backend.up.railway.app](https://identity-card-system-backend.up.railway.app)

### 📄 Exported PDF Example
![PDF Export Feature](./docs/images/exported-pdf.png)


___

## 📱 Application Structure
```plaintext
identity-card-system/
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── uploads/
│   ├── .env
│   ├── .env.production
│   ├── db.js
│   ├── index.js
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.production
│   ├── public/
│   ├── index.html
│   ├── README.md
│   ├── vercel.json
│   └── vite.config.js
│
├── docs/
│        
├── .gitignore        
├── package-lock.json        # Project locked dependencies
├── package.json            # Project dependencies
└── README.md
```
___

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm/yarn

### Installation
```bash
git clone https://github.com/QaiserEjaz/identity-card-system.git
cd identity-card-system
 ```
 
2. Backend Setup
```bash
cd backend
npm install
 ```

#### Create .env file in backend directory:

```plaintext
MONGODB_URI=your_mongodb_connection_string
PORT=5000
 ```

3. Frontend Setup
```bash
cd ../frontend
npm install
 ```

#### Create .env file in frontend directory:

```plaintext
VITE_API_URL=http://localhost:5000
 ```
___

## 👏 Acknowledgments

- **Design Inspiration**
  - Material Design Guidelines
  - Bootstrap Documentation & Examples
  - Dribbble ID Card Designs

- **Technical Resources**
  - React.js Documentation
  - MongoDB University Tutorials
  - Express.js Official Guides
  - Redux Toolkit Best Practices
  - Chart.js Examples Gallery

- **Libraries & Tools**
  - Bootstrap Themes
  - FontAwesome Icons
  - jsPDF Documentation
  - QRCode.react Examples
  - Axios HTTP Client
  - Multer File Upload
  - JWT Authentication
  - Vite Build Tool

- **Development Tools**
  - GitHub Version Control
  - Vercel Deployment
  - Railway Platform
  - MongoDB Atlas
  - VS Code Editor
  - Chrome DevTools

<!-- - **Special Thanks**
  - Open Source Community
  - Stack Overflow Contributors
  - GitHub Issues Participants
  - Beta Testers & Early Users -->

<h2 align="center">
Engineered with ⚡ Precision by Qaiser Ejaz
</h2>