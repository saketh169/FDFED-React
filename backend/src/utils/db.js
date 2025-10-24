const mongoose = require('mongoose');

// It's crucial to load environment variables for security
require('dotenv').config(); 

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/NutriConnectDatabase'; 

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully to NutriConnectDatabase.');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        // Exit process with failure
        process.exit(1); 
    }
};

module.exports = connectDB;
