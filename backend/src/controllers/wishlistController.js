const {
    getOrCreateWishlist,
    getWishlistItems,
    findWishlistItem,
    addWishlistItem,
    removeWishlistItem
} = require("../models/wishlistModel");

const { getProductById } = require("../models/productModel");

// GET /api/wishlist
const viewWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;

        const wishlist = await getOrCreateWishlist(userId);
        const items = await getWishlistItems(wishlist.id);

        res.status(200).json({
            wishlistId: wishlist.id,
            items
        });
    } catch (error) {
        console.error("View wishlist error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/wishlist/add
const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "productId is required" });
        }

        const product = await getProductById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const wishlist = await getOrCreateWishlist(userId);

        const existingItem = await findWishlistItem(wishlist.id, productId);
        if (existingItem) {
            return res.status(409).json({ message: "Product already in wishlist" });
        }

        await addWishlistItem(wishlist.id, productId);

        res.status(201).json({ message: "Product added to wishlist" });
    } catch (error) {
        console.error("Add to wishlist error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/wishlist/remove/:itemId
const removeFromWishlist = async (req, res) => {
    try {
        const { itemId } = req.params;

        await removeWishlistItem(itemId);

        res.status(200).json({ message: "Product removed from wishlist" });
    } catch (error) {
        console.error("Remove from wishlist error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    viewWishlist,
    addToWishlist,
    removeFromWishlist
};