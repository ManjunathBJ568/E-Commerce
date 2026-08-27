const pool = require("../config/db");

const getDashboardStats = async () => {
    const [[userCount]] = await pool.query(`SELECT COUNT(*) AS total FROM users WHERE role = 'customer'`);
    const [[orderCount]] = await pool.query(`SELECT COUNT(*) AS total FROM orders`);
    const [[revenue]] = await pool.query(`SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE payment_status = 'paid'`);
    const [[pendingReturns]] = await pool.query(`SELECT COUNT(*) AS total FROM returns WHERE status = 'requested'`);
    const [[productCount]] = await pool.query(`SELECT COUNT(*) AS total FROM products WHERE status = 'active'`);

    return {
        totalCustomers: userCount.total,
        totalOrders: orderCount.total,
        totalRevenue: Number(revenue.total),
        pendingReturns: pendingReturns.total,
        activeProducts: productCount.total
    };
};

const getAllUsers = async () => {
    const [rows] = await pool.query(
        `SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC`
    );
    return rows;
};

const updateUserActiveStatus = async (userId, isActive) => {
    const [result] = await pool.query(
        `UPDATE users SET is_active = ? WHERE id = ?`,
        [isActive, userId]
    );
    return result;
};

const getAllOrders = async () => {
    const [rows] = await pool.query(
        `SELECT o.*, u.name AS customer_name, u.email AS customer_email
         FROM orders o
         JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC`
    );
    return rows;
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUserActiveStatus,
    getAllOrders
};