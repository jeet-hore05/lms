import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  getRazorpayKey,
  getAllPayments, 
} from '../controllers/payment.controller.js';

import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

// Create order (buy course)
router.post('/order', isLoggedIn, createOrder);

// Verify payment
router.post('/verify', isLoggedIn, verifyPayment);

// Get Razorpay public key
router.get('/razorpay-key', getRazorpayKey);

// Admin: view all payments
router.get('/', isLoggedIn, authorizedRoles("ADMIN"), getAllPayments);

export default router;