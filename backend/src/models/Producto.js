const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  stock: Number,
  categoria: String,
  imagen: String,
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);