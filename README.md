<div align="center">

# 🆔 Identity Card Management System

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

A full-stack web application for managing identity cards with advanced features, built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

[Live Demo](https://your-demo-link.com) | [Documentation](./docs) | [Report Bug](https://github.com/QaiserEjaz/identity-card-system/issues)

<img src="./docs/images/banner.png" alt="Project Banner" width="100%"/>

</div>

![Dashboard Preview](./docs/images/dashboard.png)

<div style="background: linear-gradient(to right, #4880EC, #019CAD); height: 2px; margin: 20px 0;"></div>

<table>
<tr>
<td bgcolor="#f6f8fa">

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
- Secure file upload handling
- Pagination for large datasets
- Search and filter capabilities

</td>
</tr>
</table>

![Card Detail View](./docs/images/card-detail.png)

<div style="background: linear-gradient(to right, #019CAD, #4880EC); height: 2px; margin: 20px 0;"></div>

<table>
<tr>
<td bgcolor="#f6f8fa">

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- Bootstrap 5 for styling
- Axios for API calls
- jsPDF for PDF generation
- QR Code generation
- FontAwesome icons

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Multer for file handling
- CORS enabled
- Rate limiting
- Environment variables

</td>
</tr>
</table>

## 🚀 Live Demo

- Frontend: [https://identity-card-system.vercel.app](https://identity-card-system.vercel.app)
- Backend: [https://identity-card-api.onrender.com](https://identity-card-api.onrender.com)

![PDF Export Feature](./docs/images/pdf-export.png)

<div style="background: linear-gradient(to right, #4880EC, #019CAD); height: 2px; margin: 20px 0;"></div>

## 📱 Application Structure
```plaintext
identity-card-system/
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── uploads/
│   ├── .env
│   ├── db.js
│   └── index.js
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
│   │   └── main.jsx
│   ├── public/
│   └── index.html
│
├── .gitignore        
├── package-lock.json        # Project locked dependencies
├── package.json            # Project dependencies
└── README.md
```

## 🚀 Quick Start

<table>
<tr>
<td bgcolor="#f6f8fa">

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm/yarn

### Installation
```bash
git clone https://github.com/yourusername/identity-card-system.git
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

 ## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments
- Bootstrap themes and components
- React documentation
- MongoDB documentation
- Express.js guides

# Made with ❤️ by Qaiser Ejaz