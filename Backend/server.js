require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect DB
connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edunexus');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/lectures', require('./routes/lectures'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/discussions', require('./routes/discussions'));
app.use('/api/users', require('./routes/users')); // admin user management

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));