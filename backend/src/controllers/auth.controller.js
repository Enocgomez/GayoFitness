const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usuario');

// REGISTER
const register = async (req, res) => {
  try {
    console.log('BODY REGISTER:', req.body);

    const name = req.body.name || req.body.nombre;
    const email = req.body.email;
    const password = req.body.password;
    const goal = req.body.goal || 'ganar_musculo';

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: 'Email ya existe' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      goal,
      avatar: '',
      bio: '',
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '30d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        goal: user.goal,
      },
    });
  } catch (err) {
    console.log('ERROR REGISTER:', err);
    return res.status(500).json({
      error: err.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan campos' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Usuario no existe' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Password incorrecta' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '30d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        goal: user.goal,
      },
    });
  } catch (err) {
    console.log('ERROR LOGIN:', err);
    return res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = { register, login };