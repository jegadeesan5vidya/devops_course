const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'up' : 'down';

  res.status(200).json({
    backend: 'up',
    mongo: mongoStatus
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack, next);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


const connectWithRetry = require('./db');

// Start DB connection with retry logic
connectWithRetry();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mongo DB Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Changed again to - Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});
