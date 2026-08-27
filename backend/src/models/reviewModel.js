const pool = require("../config/db");

// Get approved reviews for a product (public)
const getApprovedReviewsByProduct = async (productId) => {
    const [rows] = await pool.query(
        `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.product_id = ? AND r.status = 'approved'
         ORDER BY r.created_at DESC`,
        [productId]
    );
    return rows;
};

// Check if this user has an order containing this product, with delivered status
const findEligibleOrderForReview = async (userId, productId) => {
    const [rows] = await pool.query(
        `SELECT o.id AS order_id
         FROM orders o
         JOIN order_items oi ON oi.order_id = o.id
         WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'
         LIMIT 1`,
        [userId, productId]
    );
    return rows[0];
};

// Check if user already reviewed this product
const findExistingReview = async (userId, productId) => {
    const [rows] = await pool.query(
        `SELECT * FROM reviews WHERE user_id = ? AND product_id = ?`,
        [userId, productId]
    );
    return rows[0];
};

const createReview = async (userId, productId, orderId, rating, comment) => {
    const [result] = await pool.query(
        `INSERT INTO reviews (product_id, user_id, order_id, rating, comment, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [productId, userId, orderId, rating, comment || null]
    );
    return result;
};

const getReviewById = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM reviews WHERE id = ?`,
        [id]
    );
    return rows[0];
};

const updateReviewStatus = async (id, status) => {
    const [result] = await pool.query(
        `UPDATE reviews SET status = ? WHERE id = ?`,
        [status, id]
    );
    return result;
};

const deleteReview = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM reviews WHERE id = ?`,
        [id]
    );
    return result;
};

module.exports = {
    getApprovedReviewsByProduct,
    findEligibleOrderForReview,
    findExistingReview,
    createReview,
    getReviewById,
    updateReviewStatus,
    deleteReview
};