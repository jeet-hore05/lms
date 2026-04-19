import { model, Schema } from 'mongoose';

const paymentSchema = new Schema(
  {
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
      unique: true, // prevent duplicate entries
    },
    razorpay_signature: {
      type: String,
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // must know who paid
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true, // must know which course
    },

    amount: {
      type: Number,
      required: true, // good for records
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "paid", // since we store after verification
    }

  },
  {
    timestamps: true,
  }
);

const Payment = model('Payment', paymentSchema);

export default Payment;