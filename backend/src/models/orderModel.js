const pool = require("../config/db");

// Generate a unique order number like ORD-1735000000000
const generateOrderNumber = () => {
    return `ORD-${Date.now()}`;
};

const createOrderWithItems = async (userId, addressId, cartItems, subtotal, discount, deliveryCharge, totalAmount) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const orderNumber = generateOrderNumber();

        // 1. Insert the order
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, address_id, order_number, subtotal, discount, delivery_charge, total_amount)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, addressId, orderNumber, subtotal, discount, deliveryCharge, totalAmount]
        );

        const orderId = orderResult.insertId;

        // 2. Insert each order item + reduce stock
        for (const item of cartItems) {
            const itemTotal = item.price_after_discount * item.quantity;

            await connection.query(
                `INSERT INTO order_items
                    (order_id, product_id, variant_id, product_name, sku, quantity, unit_price, discount, total_price)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    orderId, item.product_id, item.variant_id || null,
                    item.name, item.sku, item.quantity,
                    item.price, item.discount || 0, itemTotal
                ]
            );

            // Reduce stock
            const [stockResult] = await connection.query(
                `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`,
                [item.quantity, item.product_id, item.quantity]
            );

            // If no rows were updated, stock wasn't sufficient — abort everything
            if (stockResult.affectedRows === 0) {
                throw new Error(`Insufficient stock for product: ${item.name}`);
            }
        }

        // 3. Clear the cart
        await connection.query(
            `DELETE FROM cart_items WHERE cart_id = ?`,
            [cartItems[0].cart_id]
        );

        await connection.commit();

        return { orderId, orderNumber };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
const getOrdersByUser = async (userId) => {
    const [rows] = await pool.query(
        `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
    );
    return rows;
};
const getOrderById = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM orders WHERE id = ?`,
        [id]
    );
    return rows[0];
};

const getOrderItems = async (orderId) => {
    const [rows] = await pool.query(
        `SELECT * FROM order_items WHERE order_id = ?`,
        [orderId]
    );
    return rows;
};
const updateOrderStatus = async (id, status) => {
    const [result] = await pool.query(
        `UPDATE orders SET status = ? WHERE id = ?`,
        [status, id]
    );
    return result;
};
const restoreStockForOrder = async (orderId) => {
    const [items] = await pool.query(
        `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
        [orderId]
    );

    for (const item of items) {
        await pool.query(
            `UPDATE products SET stock = stock + ? WHERE id = ?`,
            [item.quantity, item.product_id]
        );
    }
};
const updateOrderPaymentStatus = async (orderId, paymentStatus) => {
    const [result] = await pool.query(
        `UPDATE orders SET payment_status = ? WHERE id = ?`,
        [paymentStatus, orderId]
    );
    return result;
};
module.exports = {
    createOrderWithItems,
    getOrdersByUser,
    getOrderById,
    getOrderItems,
    updateOrderStatus,
    restoreStockForOrder,
    updateOrderPaymentStatus
};