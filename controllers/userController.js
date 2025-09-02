// controllers/userController.js
const User = require('../models/ userModel');
// const jwt = require('jsonwebtoken'); // No longer needed

// The generateToken function is removed as we are not using JWT.

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  const { displayName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      displayName,
      email,
      password,
    });

    if (user) {
      // Respond with user data but WITHOUT the password and token
      res.status(201).json({
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Auth user (Login)
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      // Respond with user data but WITHOUT the password and token
      res.json({
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { registerUser, loginUser };