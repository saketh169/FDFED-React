const express = require('express');
const connectDB = require('./utils/db'); 
const authRoutes = require('./routes/authRoutes'); 

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
// Connect to the database
connectDB(); 

// Parse incoming JSON requests
app.use(express.json()); 

// --- API Routes ---
// Mounting at '/api' allows the routes in authRoutes.js to be accessed as /api/signup/user, etc.
app.use('/api', authRoutes); 

// Simple test route (kept from your original code)
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Backend ready to accept signups at /api/signup/[role]');
});
