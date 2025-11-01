const Product = require('../models/Product');

exports.list = async (req, res) => {
  const products = await Product.find().populate('categoryId').lean();
  res.json(products);
};

exports.create = async (req, res) => {
  const { name, categoryId, price, status } = req.body;
  const p = new Product({ name, categoryId, price, status });
  await p.save();
  res.status(201).json(p);
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const update = req.body;
  const prod = await Product.findByIdAndUpdate(id, update, { new: true });
  if (!prod) return res.status(404).json({ error: true, message: 'Product not found' });
  res.json(prod);
};

exports.remove = async (req, res) => {
  const id = req.params.id;
  await Product.findByIdAndDelete(id);
  res.json({ ok: true });
};
