const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));

// ✅ CORS FIX (FINAL)
app.use(cors({
  origin: [
    'https://nourish-link.vercel.app', // your frontend
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

// ❌ REMOVED: app.options('*', cors());  (this was causing crash)

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/sms', require('./routes/smsRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Nourish Link API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});