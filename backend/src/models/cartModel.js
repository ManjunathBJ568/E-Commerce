const pool = require("../config/db");

// Get or create a cart for a user (every user should have exactly one cart)
const getOrCreateCart = async (userId) => {
    const [existing] = await pool.query(
        `SELECT * FROM cart WHERE user_id = ?`,
        [userId]
    );

    if (existing.length > 0) {
        return existing[0];
    }

    const [result] = await pool.query(
        `INSERT INTO cart (user_id) VALUES (?)`,
        [userId]
    );

    return { id: result.insertId, user_id: userId };
};

// Get all items in a cart, joined with product details
// Get all items in a cart, joined with product details and primary image
const getCartItems = async (cartId) => {
    const [rows] = await pool.query(
        `SELECT 
            ci.id AS cart_item_id,
            ci.quantity,
            ci.variant_id,

            p.id AS product_id,
            p.name,
            p.sku,
            p.price,
            p.discount,
            p.stock,
            p.status,

            pi.image_url AS primary_image

         FROM cart_items ci

         JOIN products p 
            ON ci.product_id = p.id

         LEFT JOIN product_images pi
            ON pi.product_id = p.id
            AND pi.is_primary = 1

         WHERE ci.cart_id = ?`,
        [cartId]
    );

    return rows;
};

// Check if a product is already in the cart
const findCartItem = async (cartId, productId, variantId) => {
    const [rows] = await pool.query(
        `SELECT * FROM cart_items
         WHERE cart_id = ? AND product_id = ? AND variant_id ${variantId ? "= ?" : "IS NULL"}`,
        variantId ? [cartId, productId, variantId] : [cartId, productId]
    );
    return rows[0];
};

const addCartItem = async (cartId, productId, variantId, quantity) => {
    const [result] = await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, variant_id, quantity)
         VALUES (?, ?, ?, ?)`,
        [cartId, productId, variantId || null, quantity]
    );
    return result;
};

const updateCartItemQuantity = async (cartItemId, quantity) => {
    const [result] = await pool.query(
        `UPDATE cart_items SET quantity = ? WHERE id = ?`,
        [quantity, cartItemId]
    );
    return result;
};

const removeCartItem = async (cartItemId) => {
    const [result] = await pool.query(
        `DELETE FROM cart_items WHERE id = ?`,
        [cartItemId]
    );
    return result;
};

const clearCartItems = async (cartId) => {
    const [result] = await pool.query(
        `DELETE FROM cart_items WHERE cart_id = ?`,
        [cartId]
    );
    return result;
};

module.exports = {
    getOrCreateCart,
    getCartItems,
    findCartItem,
    addCartItem,
    updateCartItemQuantity,
    removeCartItem,
    clearCartItems
};