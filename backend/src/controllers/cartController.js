const {
    getOrCreateCart,
    getCartItems,
    findCartItem,
    addCartItem,
    updateCartItemQuantity,
    removeCartItem,
    clearCartItems
} = require("../models/cartModel");

const { getProductById } = require("../models/productModel");

// Helper: calculate totals for a cart's items
const calculateTotals = (items) => {
    let subtotal = 0;

    const itemsWithFinalPrice = items.map((item) => {
        const priceAfterDiscount = item.price - (item.price * (item.discount || 0)) / 100;
        const lineTotal = priceAfterDiscount * item.quantity;
        subtotal += lineTotal;

        return {
            ...item,
            price_after_discount: Number(priceAfterDiscount.toFixed(2)),
            line_total: Number(lineTotal.toFixed(2))
        };
    });

    return {
        items: itemsWithFinalPrice,
        subtotal: Number(subtotal.toFixed(2))
    };
};

// GET /api/cart
const viewCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cart = await getOrCreateCart(userId);
        const items = await getCartItems(cart.id);

        const totals = calculateTotals(items);

        res.status(200).json({
            cartId: cart.id,
            ...totals
        });
    } catch (error) {
        console.error("View cart error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/cart/add
const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, variantId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                message: "productId and a valid quantity are required"
            });
        }

        // Check product exists and is active
        const product = await getProductById(productId);
        if (!product || product.status !== "active") {
            return res.status(404).json({ message: "Product not found or unavailable" });
        }

        const cart = await getOrCreateCart(userId);

        // Check if item already in cart
        const existingItem = await findCartItem(cart.id, productId, variantId);

        const desiredQuantity = existingItem
            ? existingItem.quantity + quantity
            : quantity;

        // Check stock
        if (desiredQuantity > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} item(s) in stock`
            });
        }

        if (existingItem) {
            await updateCartItemQuantity(existingItem.id, desiredQuantity);
        } else {
            await addCartItem(cart.id, productId, variantId, quantity);
        }

        res.status(200).json({ message: "Item added to cart" });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/cart/update/:itemId
const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Valid quantity is required" });
        }

        await updateCartItemQuantity(itemId, quantity);

        res.status(200).json({ message: "Cart item updated" });
    } catch (error) {
        console.error("Update cart item error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/cart/remove/:itemId
const removeItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        await removeCartItem(itemId);

        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        console.error("Remove cart item error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/cart/clear
const clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cart = await getOrCreateCart(userId);
        await clearCartItems(cart.id);

        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    viewCart,
    addToCart,
    updateCartItem,
    removeItem,
    clearCart
};