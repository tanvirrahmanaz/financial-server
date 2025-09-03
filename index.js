// financial-server/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Import your route files
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Assuming this exists
const courseRoutes = require('./routes/courseRoutes'); // <-- Add this line

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();


// Enable Cross-Origin Resource Sharing (CORS) for all origins
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes); // <-- Add this line


// A simple route to check if the API is running
app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

const PORT = process.env.PORT || 5000;


// Connect to the MongoDB database using the URI from your .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // Start the server only after a successful database connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log('MongoDB connected successfully.');
  })
  .catch((err) => {
    // Log any connection errors and exit the process
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });