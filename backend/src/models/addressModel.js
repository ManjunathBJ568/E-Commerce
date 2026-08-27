const pool = require("../config/db");

const getAddressesByUser = async (userId) => {
    const [rows] = await pool.query(
        `SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC`,
        [userId]
    );
    return rows;
};

const getAddressById = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM addresses WHERE id = ?`,
        [id]
    );
    return rows[0];
};

const createAddress = async (userId, data) => {
    const {
        full_name, phone, address_line1, address_line2,
        city, state, postal_code, country, address_type, is_default
    } = data;

    const [result] = await pool.query(
        `INSERT INTO addresses
            (user_id, full_name, phone, address_line1, address_line2, city, state, postal_code, country, address_type, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userId, full_name, phone, address_line1, address_line2 || null,
            city, state, postal_code, country || "India",
            address_type || "home", is_default ? 1 : 0
        ]
    );

    return result;
};

const updateAddress = async (id, data) => {
    const {
        full_name, phone, address_line1, address_line2,
        city, state, postal_code, country, address_type
    } = data;

    const [result] = await pool.query(
        `UPDATE addresses
         SET full_name = ?, phone = ?, address_line1 = ?, address_line2 = ?,
             city = ?, state = ?, postal_code = ?, country = ?, address_type = ?
         WHERE id = ?`,
        [full_name, phone, address_line1, address_line2, city, state, postal_code, country, address_type, id]
    );

    return result;
};

const deleteAddress = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM addresses WHERE id = ?`,
        [id]
    );
    return result;
};

// Unset default on all of a user's addresses (used before setting a new default)
const clearDefaultForUser = async (userId) => {
    const [result] = await pool.query(
        `UPDATE addresses SET is_default = 0 WHERE user_id = ?`,
        [userId]
    );
    return result;
};

const setAsDefault = async (id) => {
    const [result] = await pool.query(
        `UPDATE addresses SET is_default = 1 WHERE id = ?`,
        [id]
    );
    return result;
};

module.exports = {
    getAddressesByUser,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    clearDefaultForUser,
    setAsDefault
};