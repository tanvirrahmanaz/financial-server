// financial-server/models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Password is optional for Google users
  role: { type: String, enum: ['parent', 'child'], required: true },
  // Child-specific fields
  age: { type: Number },
  favoriteHobby: { type: String },
  favoriteSubject: { type: String },
  favoriteCartoon: { type: String },
  // Parent-specific field
  childrenUsername: { type: String }, // This is the username of the child
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;