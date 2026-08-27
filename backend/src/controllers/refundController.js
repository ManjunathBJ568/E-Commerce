const { createRefund, getRefundByOrderId, updateRefundStatus } = require("../models/refundModel");
const { getOrderById, updateOrderPaymentStatus } = require("../models/orderModel");
const { getPaymentByOrderId } = require("../models/paymentModel");
const { getReturnByOrderId } = require("../models/returnModel");

// POST /api/refunds (admin only)
const initiateRefund = async (req, res) => {
    try {
        const { orderId, refundMethod } = req.body;

        if (!orderId || !refundMethod) {
            return res.status(400).json({ message: "orderId and refundMethod are required" });
        }

        const order = await getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const payment = await getPaymentByOrderId(orderId);
        if (!payment) {
            return res.status(404).json({ message: "No payment found for this order" });
        }

        if (payment.status !== "success") {
            return res.status(400).json({
                message: "Cannot refund a payment that was not successful"
            });
        }

        const existingRefund = await getRefundByOrderId(orderId);
        if (existingRefund) {
            return res.status(409).json({ message: "A refund already exists for this order" });
        }

        // Link to a return request if one exists (optional)
        const returnRequest = await getReturnByOrderId(orderId);

        const result = await createRefund(
            orderId,
            payment.id,
            returnRequest ? returnRequest.id : null,
            order.total_amount,
            refundMethod,
            req.body.reason
        );

        res.status(201).json({
            message: "Refund initiated",
            refundId: result.insertId
        });
    } catch (error) {
        console.error("Initiate refund error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/refunds/:orderId
const getRefundStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { orderId } = req.params;

        const order = await getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user_id !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "You do not have access to this order" });
        }

        const refund = await getRefundByOrderId(orderId);
        if (!refund) {
            return res.status(404).json({ message: "No refund found for this order" });
        }

        res.status(200).json({ refund });
    } catch (error) {
        console.error("Get refund status error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/refunds/:id/complete (admin only) — simulates marking a refund as done
const completeRefund = async (req, res) => {
    try {
        const { id } = req.params;
        const { transactionId } = req.body;

        await updateRefundStatus(id, "completed", transactionId);

        res.status(200).json({ message: "Refund marked as completed" });
    } catch (error) {
        console.error("Complete refund error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    initiateRefund,
    getRefundStatus,
    completeRefund
};