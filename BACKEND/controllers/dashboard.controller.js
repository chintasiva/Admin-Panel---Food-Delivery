const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.summary = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const revenueAgg = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
  res.json({ totalUsers, totalProducts, totalOrders, totalRevenue });
};
