const express = require('express');
const path = require('path');
require('dotenv').config();

// Import routes
const indexRoutes = require('./routes/index');
const compareRoutes = require('./routes/compare');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRoutes);
app.use('/compare', compareRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).render('error', {
    title: 'Server Error',
    message: 'An unexpected error occurred. Please try again later.'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  
  // Check if API key is configured
  if (!process.env.FOOTBALL_API_KEY) {
    console.warn('⚠️  WARNING: FOOTBALL_API_KEY is not set in environment variables!');
    console.warn('   Please create a .env file with your API key.');
  }
});

module.exports = app;



