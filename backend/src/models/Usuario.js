const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String, 
  email: { type: String, unique: true },
  password: String,
  goal: {
    type: String,
    enum: ['perdida_peso', 'ganar_musculo', 'resistencia'],
  },
  avatar: String,
  bio: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);