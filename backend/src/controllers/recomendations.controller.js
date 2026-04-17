// const Recommendation = require('../models/Recommendation');
// const User = require('../models/User');

const getRecommendations = async (req, res) => {
  try {
    const userId = req.userId;

    // Cuando conectes Mongo real, aquí buscarás el usuario por userId
    // const user = await User.findById(userId);

    const fakeUser = {
      _id: userId,
      goal: 'ganar_musculo',
    };

    if (!fakeUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const recommendations = [
      {
        title: 'HIIT Cardio Intenso',
        type: 'Entrenamiento',
        kcal: '420 kcal',
        emoji: '🏋️',
      },
      {
        title: 'Pollo con arroz',
        type: 'Nutrición',
        kcal: '600 kcal',
        emoji: '🍗',
      },
    ];

    res.json(recommendations);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error servidor' });
  }
};

module.exports = { getRecommendations };