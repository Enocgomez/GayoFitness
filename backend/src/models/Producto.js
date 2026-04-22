const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  categoria: String,
  imagen: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);