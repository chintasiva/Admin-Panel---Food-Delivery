const User = require('../models/User');

exports.list = async (req, res) => {
  const users = await User.find().lean();
  res.json(users);
};

exports.create = async (req, res) => {
  const { name, email, mobile } = req.body;
  const user = new User({ name, email, mobile });
  await user.save();
  res.status(201).json(user);
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const update = req.body;
  const user = await User.findByIdAndUpdate(id, update, { new: true });
  if (!user) return res.status(404).json({ error: true, message: 'User not found' });
  res.json(user);
};

exports.remove = async (req, res) => {
  const id = req.params.id;
  await User.findByIdAndDelete(id);
  res.json({ ok: true });
};
