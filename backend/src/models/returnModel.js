const pool = require("../config/db");

const createReturnRequest = async (orderId, userId, reason) => {
    const [result] = await pool.query(
        `INSERT INTO returns (order_id, user_id, reason, status)
         VALUES (?, ?, ?, 'requested')`,
        [orderId, userId, reason]
    );
    return result;
};

const getReturnsByUser = async (userId) => {
    const [rows] = await pool.query(
        `SELECT * FROM returns WHERE user_id = ? ORDER BY requested_at DESC`,
        [userId]
    );
    return rows;
};

const getReturnById = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM returns WHERE id = ?`,
        [id]
    );
    return rows[0];
};

const getReturnByOrderId = async (orderId) => {
    const [rows] = await pool.query(
        `SELECT * FROM returns WHERE order_id = ?`,
        [orderId]
    );
    return rows[0];
};

const updateReturnStatus = async (id, status) => {
    const [result] = await pool.query(
        `UPDATE returns SET status = ? WHERE id = ?`,
        [status, id]
    );
    return result;
};
const getAllReturns = async () => {
    const [rows] = await pool.query(
        `SELECT r.*, u.name AS customer_name, u.email AS customer_email, o.order_number
         FROM returns r
         JOIN users u ON r.user_id = u.id
         JOIN orders o ON r.order_id = o.id
         ORDER BY r.requested_at DESC`
    );
    return rows;
};

module.exports = {
    createReturnRequest,
    getReturnsByUser,
    getReturnById,
    getReturnByOrderId,
    updateReturnStatus,
    getAllReturns
};