const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['active','inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
