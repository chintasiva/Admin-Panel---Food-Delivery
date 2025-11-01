const Category = require('../models/Category');

exports.list = async (req, res) => {
  const categories = await Category.find().lean();
  res.json(categories);
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  const c = new Category({ name, description });
  await c.save();
  res.status(201).json(c);
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const update = req.body;
  const cat = await Category.findByIdAndUpdate(id, update, { new: true });
  if (!cat) return res.status(404).json({ error: true, message: 'Category not found' });
  res.json(cat);
};

exports.remove = async (req, res) => {
  const id = req.params.id;
  await Category.findByIdAndDelete(id);
  res.json({ ok: true });
};
