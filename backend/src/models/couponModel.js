const pool = require("../config/db");

const getCouponByCode = async (code) => {
    const [rows] = await pool.query(
        `SELECT * FROM coupons WHERE code = ?`,
        [code]
    );
    return rows[0];
};

const getAllCoupons = async () => {
    const [rows] = await pool.query(
        `SELECT * FROM coupons ORDER BY created_at DESC`
    );
    return rows;
};

const getCouponById = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM coupons WHERE id = ?`,
        [id]
    );
    return rows[0];
};

const createCoupon = async (data) => {
    const {
        code, description, discount_type, discount_value,
        minimum_order_amount, maximum_discount, usage_limit,
        start_date, end_date, is_active
    } = data;

    const [result] = await pool.query(
        `INSERT INTO coupons
            (code, description, discount_type, discount_value, minimum_order_amount, maximum_discount, usage_limit, start_date, end_date, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            code.toUpperCase(), description || null, discount_type, discount_value,
            minimum_order_amount || 0, maximum_discount || null, usage_limit || null,
            start_date, end_date, is_active !== undefined ? is_active : 1
        ]
    );

    return result;
};

const updateCoupon = async (id, data) => {
    const {
        code, description, discount_type, discount_value,
        minimum_order_amount, maximum_discount, usage_limit,
        start_date, end_date, is_active
    } = data;

    const [result] = await pool.query(
        `UPDATE coupons
         SET code = ?, description = ?, discount_type = ?, discount_value = ?,
             minimum_order_amount = ?, maximum_discount = ?, usage_limit = ?,
             start_date = ?, end_date = ?, is_active = ?
         WHERE id = ?`,
        [
            code.toUpperCase(), description, discount_type, discount_value,
            minimum_order_amount, maximum_discount, usage_limit,
            start_date, end_date, is_active, id
        ]
    );

    return result;
};

const deleteCoupon = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM coupons WHERE id = ?`,
        [id]
    );
    return result;
};

const incrementUsedCount = async (id) => {
    const [result] = await pool.query(
        `UPDATE coupons SET used_count = used_count + 1 WHERE id = ?`,
        [id]
    );
    return result;
};

module.exports = {
    getCouponByCode,
    getAllCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    incrementUsedCount
};