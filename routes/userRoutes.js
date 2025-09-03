// financial-server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Define your routes using the 'router' object
router.post('/register', registerUser);
router.post('/login', loginUser);

// Export the router so it can be used in other files (like index.js)
module.exports = router;