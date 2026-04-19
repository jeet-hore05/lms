import crypto from "crypto";
import { razorpay } from "../server.js";
import Payment from "../models/Payment.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";

const getRazorpayKey = (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
  });
};

const createOrder = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const { id: userId } = req.user;

    // Check user
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Check role (admin should not buy)
    if (user.role === "ADMIN") {
      return next(new AppError("Admin cannot purchase courses", 403));
    }

    // Validate courseId
    if (!courseId) {
      return next(new AppError("Course ID is required", 400));
    }

    // Check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    // Prevent duplicate purchase
    const alreadyPurchased = user.purchasedCourses?.some(
      (c) => c.toString() === courseId
    );

    if (alreadyPurchased) {
      return next(new AppError("You already purchased this course", 400));
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: course.price * 100, // ₹ → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({ 
      success: true,
      order,
      courseId,
    });

  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};


const verifyPayment = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    if (!courseId) {
      return next(new AppError("Course ID is required", 400));
    }

    // Generate signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Verify signature
    if (generatedSignature !== razorpay_signature) {
      return next(new AppError("Payment verification failed", 400));
    }

    // Get course
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    // Save payment in DB
    const payment = await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user: userId,
      course: courseId,
      amount: course.price,
      status: "paid",
    });

    // Unlock course for user
    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Prevent duplicate purchase
    const alreadyPurchased = user.purchasedCourses.some(
      (c) => c.toString() === courseId
    );

    if (!alreadyPurchased) {
      user.purchasedCourses.push(courseId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment verified & course unlocked",
      payment,
    });

  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};


const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({})
      .populate("user", "fullName email")
      .populate("course", "title price")
      .sort({ createdAt: -1 });

    // Total sales
    const totalSales = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    // Monthly sales
    const monthlySales = await Payment.aggregate([
      { $match: { status: "paid" },
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalRevenue: { $sum: "$amount" },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Monthly user orders
    const monthlyUserOrders = await Payment.aggregate([
      { $match: { status: "paid" },
        $group: {
          _id: {
            user: "$user",
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$amount" }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      payments,
      analytics: {
        totalRevenue: totalSales[0]?.totalRevenue || 0,
        totalOrders: totalSales[0]?.totalOrders || 0,
        monthlySales,
        monthlyUserOrders
      }
    });

  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export{
    createOrder,
    verifyPayment,
    getRazorpayKey,
    getAllPayments
};  