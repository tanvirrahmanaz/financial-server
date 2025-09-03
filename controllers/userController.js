// financial-server/controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    if (role === 'parent' && childrenUsername) {
        const childExists = await User.findOne({ displayName: childrenUsername, role: 'child' });
        if (!childExists) {
            return res.status(400).json({ message: 'The specified child username does not exist.' });
        }
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = new User({ 
      displayName, 
      email, 
      password: hashedPassword, 
      role, 
      childrenUsername: role === 'parent' ? childrenUsername : null,
      age: role === 'child' ? age : null, 
      favoriteHobby: role === 'child' ? favoriteHobby : null, 
      favoriteSubject: role === 'child' ? favoriteSubject : null, 
      favoriteCartoon: role === 'child' ? favoriteCartoon : null,
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'User created successfully',
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      childrenUsername: user.childrenUsername
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Hardcoded Admin Credentials (Zero Security)
  const ADMIN_EMAIL = 'admin@gmail.com';
  const ADMIN_PASSWORD = 'admin@123';

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email: ADMIN_EMAIL, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({
      message: 'Admin login successful',
      token,
      user: { displayName: 'Admin', email: ADMIN_EMAIL, role: 'admin' }
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.password && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({
        message: 'Login successful',
        token,
        user: { _id: user._id, displayName: user.displayName, email: user.email, role: user.role }
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { registerUser, loginUser };