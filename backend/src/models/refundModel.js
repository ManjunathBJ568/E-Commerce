const pool = require("../config/db");

const createRefund = async (orderId, paymentId, returnId, amount, refundMethod, reason) => {
    const [result] = await pool.query(
        `INSERT INTO refunds (order_id, payment_id, return_id, amount, refund_method, status, reason)
         VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
        [orderId, paymentId, returnId || null, amount, refundMethod, reason || null]
    );
    return result;
};

const getRefundByOrderId = async (orderId) => {
    const [rows] = await pool.query(
        `SELECT * FROM refunds WHERE order_id = ?`,
        [orderId]
    );
    return rows[0];
};

const updateRefundStatus = async (id, status, transactionId) => {
    const [result] = await pool.query(
        `UPDATE refunds SET status = ?, transaction_id = ? WHERE id = ?`,
        [status, transactionId || null, id]
    );
    return result;
};

module.exports = {
    createRefund,
    getRefundByOrderId,
    updateRefundStatus
};