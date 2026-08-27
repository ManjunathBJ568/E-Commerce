const pool = require("../config/db");

const getOrCreateWishlist = async (userId) => {
    const [existing] = await pool.query(
        `SELECT * FROM wishlist WHERE user_id = ?`,
        [userId]
    );

    if (existing.length > 0) {
        return existing[0];
    }

    const [result] = await pool.query(
        `INSERT INTO wishlist (user_id) VALUES (?)`,
        [userId]
    );

    return { id: result.insertId, user_id: userId };
};

const getWishlistItems = async (wishlistId) => {
    const [rows] = await pool.query(
        `SELECT wi.id AS wishlist_item_id, wi.created_at AS added_at,
                p.id AS product_id, p.name, p.price, p.discount, p.stock, p.status
         FROM wishlist_items wi
         JOIN products p ON wi.product_id = p.id
         WHERE wi.wishlist_id = ?`,
        [wishlistId]
    );
    return rows;
};

const findWishlistItem = async (wishlistId, productId) => {
    const [rows] = await pool.query(
        `SELECT * FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?`,
        [wishlistId, productId]
    );
    return rows[0];
};

const addWishlistItem = async (wishlistId, productId) => {
    const [result] = await pool.query(
        `INSERT INTO wishlist_items (wishlist_id, product_id) VALUES (?, ?)`,
        [wishlistId, productId]
    );
    return result;
};

const removeWishlistItem = async (itemId) => {
    const [result] = await pool.query(
        `DELETE FROM wishlist_items WHERE id = ?`,
        [itemId]
    );
    return result;
};

module.exports = {
    getOrCreateWishlist,
    getWishlistItems,
    findWishlistItem,
    addWishlistItem,
    removeWishlistItem
};