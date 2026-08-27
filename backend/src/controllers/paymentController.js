const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay");

const {
    createPayment,
    getPaymentByOrderId,
    markPaymentSuccess,
    markPaymentFailed
} = require("../models/paymentModel");

const { getOrderById, updateOrderPaymentStatus } = require("../models/orderModel");

// POST /api/payments/razorpay/create-order
const createRazorpayOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "orderId is required" });
        }

        const order = await getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user_id !== userId) {
            return res.status(403).json({ message: "You do not have access to this order" });
        }

        if (order.payment_status === "paid") {
            return res.status(400).json({ message: "This order is already paid" });
        }

        // Razorpay needs the amount in paise (smallest currency unit), so multiply by 100
        const amountInPaise = Math.round(order.total_amount * 100);

        const razorpayOrder = await razorpayInstance.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: order.order_number
        });

        // Save a pending payment record linked to this Razorpay order
        await createPayment(orderId, "upi", order.total_amount, razorpayOrder.id);

        res.status(200).json({
            message: "Razorpay order created",
            razorpayOrderId: razorpayOrder.id,
            amount: amountInPaise,
            currency: "INR",
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Create Razorpay order error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/payments/razorpay/verify
const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
            return res.status(400).json({ message: "Missing payment verification details" });
        }

        // Recreate the expected signature using our secret key
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const isValid = generatedSignature === razorpay_signature;

        const payment = await getPaymentByOrderId(orderId);
        if (!payment) {
            return res.status(404).json({ message: "Payment record not found" });
        }

        if (!isValid) {
            await markPaymentFailed(payment.id);
            return res.status(400).json({ message: "Payment verification failed" });
        }

        await markPaymentSuccess(payment.id, razorpay_payment_id);
        await updateOrderPaymentStatus(orderId, "paid");

        res.status(200).json({ message: "Payment verified successfully" });

    } catch (error) {
        console.error("Verify Razorpay payment error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/payments/cod
const createCodPayment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "orderId is required" });
        }

        const order = await getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user_id !== userId) {
            return res.status(403).json({ message: "You do not have access to this order" });
        }

        await createPayment(orderId, "cod", order.total_amount);

        res.status(201).json({ message: "Cash on Delivery selected for this order" });

    } catch (error) {
        console.error("COD payment error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment,
    createCodPayment
};