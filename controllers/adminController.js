import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();

    const totalRevenue = await orderModel.aggregate([
      { $match: { payment: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalUsers,
        totalProducts
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Dashboard error" });
  }
};
export const getRevenueChart = async (req, res) => {
  try {
    const days = Number(req.query.days) || 7;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const revenue = await orderModel.aggregate([
      {
        $match: {
          payment: true,
          date: { $gte: fromDate.getTime() }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$date" }
            }
          },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: revenue.map(r => ({
        date: r._id,
        revenue: r.revenue
      }))
    });

  } catch (error) {
    res.status(500).json({ success: false });
  }
};
