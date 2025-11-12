const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db'); 
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const progressRoutes = require('./routes/progressRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const statusRoutes = require('./routes/statusRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactusRoutes = require('./routes/contactusRoutes');
const crudRoutes = require('./routes/crudRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dietitianRoutes = require('./routes/dietitianRoutes');

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
// Connect to the database
connectDB(); 

// Enable CORS
app.use(cors());

// Parse incoming JSON requests
app.use(express.json()); 

// --- API Routes ---
// Auth routes mounted at '/api' for signup and signin
app.use('/api', authRoutes);

// Profile routes mounted at '/api' for profile image operations
app.use('/api', profileRoutes);

// Progress routes mounted at '/api'
app.use('/api', progressRoutes);

// Chatbot routes mounted at '/api/chatbot'
app.use('/api/chatbot', chatbotRoutes);

// Verify routes mounted at '/api/verify'
app.use('/api/verify', verifyRoutes);

// Status routes mounted at '/api/status'
app.use('/api/status', statusRoutes);

// Blog routes mounted at '/api/blogs'
app.use('/api/blogs', blogRoutes);

// Contact us routes mounted at '/api/contact'
app.use('/api/contact', contactusRoutes);

// Booking routes mounted at '/api/bookings'
app.use('/api/bookings', bookingRoutes);

// CRUD routes mounted at '/api' for admin user management
app.use('/api', crudRoutes);

// Dietitian routes mounted at '/api'
app.use('/api', dietitianRoutes);

// Simple test route (kept from your original code)
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Backend ready to accept signups at /api/signup/[role]');
  console.log('Chatbot API available at /api/chatbot/*');
});