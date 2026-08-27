
const { getOrCreateCart, getCartItems, clearCartItems } = require("../models/cartModel");
const { getAddressById } = require("../models/addressModel");
const { createOrderWithItems, getOrdersByUser, getOrderById, getOrderItems, updateOrderStatus, restoreStockForOrder } = require("../models/orderModel");
const { getCouponByCode, incrementUsedCount } = require("../models/couponModel");
const { validateCouponForAmount } = require("./couponController");

// Helper: calculate totals (same logic as cart)
const calculateCartTotals = (items) => {
    let subtotal = 0;

    const itemsWithFinalPrice = items.map((item) => {
        const priceAfterDiscount = item.price - (item.price * (item.discount || 0)) / 100;
        subtotal += priceAfterDiscount * item.quantity;

        return { ...item, price_after_discount: priceAfterDiscount };
    });

    return { items: itemsWithFinalPrice, subtotal: Number(subtotal.toFixed(2)) };
};

// POST /api/orders
const placeOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { addressId } = req.body;

        if (!addressId) {
            return res.status(400).json({ message: "addressId is required" });
        }

        // Verify address belongs to this user
        const address = await getAddressById(addressId);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }
        if (address.user_id !== userId) {
            return res.status(403).json({ message: "You do not have access to this address" });
        }

        // Get cart and items
        const cart = await getOrCreateCart(userId);
        const rawItems = await getCartItems(cart.id);

        if (rawItems.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        // Attach cart_id to each item (needed for clearing cart after order)
        const cartItems = rawItems.map((item) => ({ ...item, cart_id: cart.id, sku: item.sku || "N/A" }));

        const { items, subtotal } = calculateCartTotals(cartItems);

        // Simple delivery charge rule: free above ₹500, else ₹50
        const deliveryCharge = subtotal >= 500 ? 0 : 50;

let discount = 0;
let appliedCoupon = null;

if (req.body.couponCode) {
    const coupon = await getCouponByCode(req.body.couponCode.toUpperCase());
    const validation = validateCouponForAmount(coupon, subtotal);

    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    discount = validation.discount;
    appliedCoupon = coupon;
}

const totalAmount = Number((subtotal + deliveryCharge - discount).toFixed(2));

const { orderId, orderNumber } = await createOrderWithItems(
    userId, addressId, items, subtotal, discount, deliveryCharge, totalAmount
);

// Track that this coupon was used
if (appliedCoupon) {
    await incrementUsedCount(appliedCoupon.id);
}
        
        res.status(201).json({
            message: "Order placed successfully",
            orderId,
            orderNumber,
            totalAmount
        });

    } catch (error) {
        console.error("Place order error:", error);

        if (error.message && error.message.startsWith("Insufficient stock")) {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: "Server error" });
    }
};
// GET /api/orders
const listMyOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await getOrdersByUser(userId);
        res.status(200).json({ orders });
    } catch (error) {
        console.error("List orders error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// GET /api/orders/:id
const getSingleOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const order = await getOrderById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Ownership check — admins can view any order, customers only their own
        if (order.user_id !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "You do not have access to this order" });
        }

        const items = await getOrderItems(id);

        res.status(200).json({ order: { ...order, items } });
    } catch (error) {
        console.error("Get order error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const VALID_STATUSES = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"];

// PUT /api/orders/:id/status (admin only)
const changeOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                message: `Status must be one of: ${VALID_STATUSES.join(", ")}`
            });
        }

        const order = await getOrderById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await updateOrderStatus(id, status);

        res.status(200).json({ message: `Order status updated to '${status}'` });
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const NON_CANCELLABLE_STATUSES = ["shipped", "out_for_delivery", "delivered", "cancelled", "returned"];

// PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const order = await getOrderById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user_id !== userId) {
            return res.status(403).json({ message: "You do not have access to this order" });
        }

        if (NON_CANCELLABLE_STATUSES.includes(order.status)) {
            return res.status(400).json({
                message: `Order cannot be cancelled once it is '${order.status}'`
            });
        }

        await updateOrderStatus(id, "cancelled");
        await restoreStockForOrder(id);

        res.status(200).json({ message: "Order cancelled successfully" });
    } catch (error) {
        console.error("Cancel order error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    placeOrder,
    listMyOrders,
    getSingleOrder,
    changeOrderStatus,
    cancelOrder
};