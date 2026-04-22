const express = require('express');
const router = express.Router();

// CONTROLADORES
const { register, login } = require('../controllers/auth.controller');
const { getRecommendations } = require('../controllers/recomendations.controller');

// MIDDLEWARE
const { authMiddleware } = require('../middleware/auth');

// RUTAS
const usersRoutes = require('./users.js');
const dietsRoutes = require('./diets.js');
const productsRoutes = require('./products.js');
const statsRoutes = require('./stats.js');

//Rutas base
router.use('/usuarios', usersRoutes);
router.use('/dietas', dietsRoutes);
router.use('/products', productsRoutes);


// AUTH
router.post('/auth/register', register);
router.post('/auth/login', login);

// RECOMMENDATIONS
router.get('/recommendations', authMiddleware, getRecommendations);
router.use('/stats', authMiddleware, statsRoutes);

// TEST
router.get('/', (req, res) => {
  res.json({ status: 'API funcionando 🚀' });
});

module.exports = router;