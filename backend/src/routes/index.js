const express = require('express');
const router = express.Router();

// CONTROLADORES
const { register, login } = require('../controllers/auth.controller');

// ⚠️ IMPORTANTE: nombre EXACTO como tu archivo
const { getRecommendations } = require('../controllers/recomendations.controller');

// MIDDLEWARE
const { authMiddleware } = require('../middleware/auth');

// RUTAS BASE
const usersRoutes = require('./users.js');
const dietsRoutes = require('./diets.js');
const productsRoutes = require('./products.js');

router.use('/usuarios', usersRoutes);
router.use('/dietas', dietsRoutes);
router.use('/productos', productsRoutes);

// AUTH
router.post('/auth/register', register);
router.post('/auth/login', login);

// 🔥 ESTA ES LA CLAVE
router.get('/recommendations', authMiddleware, getRecommendations);

// TEST
router.get('/', (req, res) => {
  res.json({ status: 'API funcionando 🚀' });
});

module.exports = router;