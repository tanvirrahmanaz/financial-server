// financial-server/controllers/adminController.js
const Course = require('../models/Course');
const url = require('url');

const uploadCourse = async (req, res) => {
  const { title, description, youtubePlaylistUrl, quizzes } = req.body;

  try {
    const parsedUrl = new URL(youtubePlaylistUrl);
    const youtubePlaylistId = parsedUrl.searchParams.get('list');

    if (!youtubePlaylistId) {
      return res.status(400).json({ message: 'Invalid YouTube Playlist URL. Please provide a URL that contains a playlist ID.' });
    }

    const newCourse = new Course({
      title,
      description,
      youtubePlaylistId,
      quizzes: Array.isArray(quizzes) ? quizzes : [],
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course uploaded successfully!', course: newCourse });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Get Courses Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Get Course By ID Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  uploadCourse,
  getCourses,
  getCourseById,
};