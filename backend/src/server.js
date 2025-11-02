const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db'); 
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

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

// Chatbot routes mounted at '/api/chatbot'
app.use('/api/chatbot', chatbotRoutes);

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