# 🎓 EduNexus - Learning Management System

A modern, full-stack Learning Management System (LMS) built with React, Node.js, and MongoDB. EduNexus provides a comprehensive platform for online education with features for students, instructors, and administrators.

![EduNexus Logo](https://img.shields.io/badge/EduNexus-LMS-blue?style=for-the-badge&logo=graduation-cap)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Features
- **User Authentication & Authorization** with JWT tokens
- **Role-based Access Control** (Student, Instructor, Admin)
- **Course Management** with categories, levels, and pricing
- **Real-time Search & Filtering** with debounced search
- **Course Rating & Review System**
- **Assignment Management** with file uploads
- **Lecture Management** with video content
- **Discussion Forums** for course interactions
- **Progress Tracking** for students
- **Admin Panel** for user management

### 🎨 User Experience
- **Responsive Design** for all devices
- **Modern UI/UX** with Tailwind CSS
- **Loading States** and error handling
- **Real-time Data** with dynamic updates
- **Intuitive Navigation** with role-based menus

### 🔧 Technical Features
- **RESTful API** with Express.js
- **Database Integration** with MongoDB
- **File Upload** support for assignments and lectures
- **Password Hashing** with bcrypt
- **CORS Configuration** for cross-origin requests
- **Environment Variables** for configuration

## 🛠 Tech Stack

### Frontend
- **React 19.2.0** - UI Framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool and dev server
- **Font Awesome** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
EduNexus/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/             # API configuration
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   └── assets/          # Static assets
│   ├── public/              # Public assets
│   └── package.json         # Frontend dependencies
├── Backend/                 # Node.js backend application
│   ├── config/              # Database configuration
│   ├── middleware/          # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── uploads/             # File uploads directory
│   └── package.json         # Backend dependencies
└── README.md               # Project documentation
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **Git** for version control

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/edunexus.git
cd edunexus
```

### Step 2: Install Backend Dependencies
```bash
cd Backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../Frontend
npm install
```

### Step 4: Environment Configuration
Create a `.env` file in the Backend directory:
```env
# Database
MONGO_URI=mongodb://127.0.0.1:27017/edunexus

# Server
PORT=5000

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

## ⚙️ Configuration

### Database Setup
1. **Install MongoDB** on your system
2. **Start MongoDB service**
3. **Update MONGO_URI** in `.env` file if using remote database

### Backend Configuration
```bash
cd Backend
# Start the server
npm start

# For development with auto-restart
npm run dev
```

### Frontend Configuration
```bash
cd Frontend
# Start the development server
npm run dev

# Build for production
npm run build
```

## 🎮 Usage

### Starting the Application

#### Option 1: Development Mode
```bash
# Terminal 1 - Backend
cd Backend
npm run dev

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

#### Option 2: Production Mode
```bash
# Build frontend
cd Frontend
npm run build

# Start backend
cd Backend
npm start
```

### Accessing the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api

### Default Test Accounts
After seeding the database, you can use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Student | john@example.com | password123 |
| Student | jane@example.com | password123 |
| Student | mike@example.com | password123 |
| Instructor | sarah@example.com | password123 |
| Instructor | david@example.com | password123 |
| Admin | admin@example.com | password123 |

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
```

### Course Endpoints
```
GET    /api/courses           # Get all courses (with search/filter)
GET    /api/courses/:id       # Get single course
POST   /api/courses           # Create course (instructor)
PUT    /api/courses/:id       # Update course
DELETE /api/courses/:id       # Delete course
POST   /api/courses/:id/enroll # Enroll in course
GET    /api/courses/:id/stats # Get course statistics
POST   /api/courses/:id/rate  # Rate a course
```

### User Endpoints
```
GET /api/users/dashboard/stats # Get user dashboard statistics
```

### Assignment Endpoints
```
POST /api/assignments/:courseId        # Create assignment
POST /api/assignments/submit/:id       # Submit assignment
GET  /api/assignments/:id/submissions  # Get submissions
```

## 👥 User Roles

### 🎓 Student
- **Browse and search courses**
- **Enroll in courses**
- **View course content and lectures**
- **Submit assignments**
- **Rate and review courses**
- **Track learning progress**
- **Participate in discussions**

### 👨‍🏫 Instructor
- **Create and manage courses**
- **Upload lecture videos**
- **Create assignments**
- **View student submissions**
- **Manage course discussions**
- **Track student progress**

### 👨‍💼 Admin
- **Manage all users**
- **View system statistics**
- **Assign user roles**
- **Delete users**
- **Monitor system activity**

## 📱 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Dashboard+View)

### Course Listing
![Courses](https://via.placeholder.com/800x400/059669/FFFFFF?text=Course+Listing)

### Course Detail
![Course Detail](https://via.placeholder.com/800x400/DC2626/FFFFFF?text=Course+Detail)

### User Profile
![Profile](https://via.placeholder.com/800x400/7C3AED/FFFFFF?text=User+Profile)

## 🔧 Development

### Adding New Features
1. **Backend**: Add routes in `/Backend/routes/`
2. **Frontend**: Add pages in `/Frontend/src/pages/`
3. **Components**: Add reusable components in `/Frontend/src/components/`

### Database Seeding
```bash
cd Backend
npm run seed  # Seed with sample data
```

### Code Quality
```bash
# Frontend linting
cd Frontend
npm run lint

# Backend (if ESLint is configured)
cd Backend
npm run lint
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- **Follow React best practices**
- **Use meaningful commit messages**
- **Test your changes thoroughly**
- **Update documentation as needed**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Express.js Team** for the robust backend framework
- **MongoDB Team** for the flexible database
- **Tailwind CSS** for the utility-first CSS framework
- **Font Awesome** for the comprehensive icon library

## 📞 Support

If you have any questions or need help with the project:

- **Create an issue** on GitHub
- **Check the documentation** in the `/docs` folder
- **Review the API endpoints** in the backend routes

---

**Built with ❤️ by the EduNexus Team**

*Empowering education through technology*
