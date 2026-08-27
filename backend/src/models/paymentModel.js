const pool = require("../config/db");

const createPayment = async (orderId, paymentMethod, amount, gatewayOrderId = null) => {
    const [result] = await pool.query(
        `INSERT INTO payments (order_id, payment_method, amount, gateway_order_id, status)
         VALUES (?, ?, ?, ?, 'pending')`,
        [orderId, paymentMethod, amount, gatewayOrderId]
    );
    return result;
};

const getPaymentByOrderId = async (orderId) => {
    const [rows] = await pool.query(
        `SELECT * FROM payments WHERE order_id = ?`,
        [orderId]
    );
    return rows[0];
};

const markPaymentSuccess = async (paymentId, transactionId) => {
    const [result] = await pool.query(
        `UPDATE payments
         SET status = 'success', transaction_id = ?, payment_date = NOW()
         WHERE id = ?`,
        [transactionId, paymentId]
    );
    return result;
};

const markPaymentFailed = async (paymentId) => {
    const [result] = await pool.query(
        `UPDATE payments SET status = 'failed' WHERE id = ?`,
        [paymentId]
    );
    return result;
};

module.exports = {
    createPayment,
    getPaymentByOrderId,
    markPaymentSuccess,
    markPaymentFailed
};