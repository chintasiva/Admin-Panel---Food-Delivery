const Order = require('../models/Order');

exports.create = async (req, res) => {
  const { userId, items } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: true, message: 'Items required' });
  const totalAmount = items.reduce((s, it) => s + (it.price * it.quantity), 0);
  const order = new Order({ userId, items, totalAmount });
  await order.save();
  res.status(201).json(order);
};


// exports.list = async (req, res) => {
//   const products = await Order.find().populate('userId').lean();
//   console.log("products", products)
//   res.json(products);
// };

exports.list = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email mobile')
      .populate('items.productId', 'name price categoryId')
      .lean();

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: true, message: 'Failed to fetch orders' });
  }
};

