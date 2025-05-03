import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Smart Notes API is running' });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // For demo purposes, we'll use a local MongoDB or MongoDB Atlas
    // In production, use environment variables for the connection string
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartnotes';
    
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();