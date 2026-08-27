const pool = require("../config/db");

const getAllCategories = async () => {
    const [rows] = await pool.query(
        `SELECT * FROM categories WHERE is_active = 1 ORDER BY name ASC`
    );
    return rows;
};

const getCategoryById = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM categories WHERE id = ?`,
        [id]
    );
    return rows[0];
};

const createCategory = async (data) => {
    const { name, description, image, is_active } = data;

    const [result] = await pool.query(
        `INSERT INTO categories (name, description, image, is_active)
         VALUES (?, ?, ?, ?)`,
        [name, description || null, image || null, is_active !== undefined ? is_active : 1]
    );

    return result;
};

const updateCategory = async (id, data) => {
    const { name, description, image, is_active } = data;

    const [result] = await pool.query(
        `UPDATE categories
         SET name = ?, description = ?, image = ?, is_active = ?
         WHERE id = ?`,
        [name, description, image, is_active, id]
    );

    return result;
};

const deleteCategory = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM categories WHERE id = ?`,
        [id]
    );

    return result;
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};