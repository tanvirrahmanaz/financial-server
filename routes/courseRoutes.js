// financial-server/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { getCourses, getCourseById } = require('../controllers/adminController'); // Assuming the functions are in this controller

router.get('/', getCourses);
router.get('/:id', getCourseById);

module.exports = router;