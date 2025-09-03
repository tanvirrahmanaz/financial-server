// financial-server/controllers/userController.js
const User = require('../models/ userModel');
const bcrypt = require('bcryptjs');

// Register a new user
const registerUser = async (req, res) => {
  const { 
    displayName, 
    email, 
    password, 
    role, 
    childrenUsername, 
    age, 
    favoriteHobby, 
    favoriteSubject, 
    favoriteCartoon 
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if a parent is trying to register a child's username that doesn't exist
    if (role === 'parent' && childrenUsername) {
        const childExists = await User.findOne({ displayName: childrenUsername, role: 'child' });
        if (!childExists) {
            return res.status(400).json({ message: 'The specified child username does not exist.' });
        }
    }

    // Hash the password only if it's provided (for manual signup)
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = new User({ 
      displayName, 
      email, 
      password: hashedPassword, 
      role, 
      childrenUsername, 
      age, 
      favoriteHobby, 
      favoriteSubject, 
      favoriteCartoon 
    });
    
    await user.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email, regardless of their role
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If the user has a password (i.e., not a Google-only user)
    if (user.password && (await user.comparePassword(password))) {
      res.json({ _id: user._id, displayName: user.displayName, role: user.role });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { registerUser, loginUser };