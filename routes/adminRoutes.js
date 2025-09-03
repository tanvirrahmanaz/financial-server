// financial-server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { uploadCourse } = require('../controllers/adminController');
// const { protect } = require('../middleware/authMiddleware'); // Remove this line

// router.post('/upload-course', protect, uploadCourse); // Change this line
router.post('/upload-course', uploadCourse); // To this line

module.exports = router;