const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json());

// 🔌 MongoDB Atlas (NUEVO)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo Atlas conectado ✅'))
  .catch(err => console.error('Error MongoDB:', err));

// 📦 Rutas
const routes = require('./src/routes/index.js');

// 👉 TODA tu API
app.use('/api', routes);

// 🧪 Test
app.get('/', (req, res) => {
  res.json({ status: 'Backend funcionando 🚀' });
});

// 🚀 Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});