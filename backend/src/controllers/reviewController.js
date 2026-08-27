const {
    getApprovedReviewsByProduct,
    findEligibleOrderForReview,
    findExistingReview,
    createReview,
    getReviewById,
    updateReviewStatus,
    deleteReview
} = require("../models/reviewModel");

// GET /api/products/:productId/reviews
const listProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await getApprovedReviewsByProduct(productId);
        res.status(200).json({ reviews });
    } catch (error) {
        console.error("List reviews error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/reviews
const addReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, rating, comment } = req.body;

        if (!productId || !rating) {
            return res.status(400).json({ message: "productId and rating are required" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Check if user already reviewed this product
        const existing = await findExistingReview(userId, productId);
        if (existing) {
            return res.status(409).json({ message: "You have already reviewed this product" });
        }

        // Check if user actually bought and received this product
        const eligibleOrder = await findEligibleOrderForReview(userId, productId);
        if (!eligibleOrder) {
            return res.status(403).json({
                message: "You can only review products from delivered orders"
            });
        }

        const result = await createReview(userId, productId, eligibleOrder.order_id, rating, comment);

        res.status(201).json({
            message: "Review submitted and pending approval",
            reviewId: result.insertId
        });
    } catch (error) {
        console.error("Add review error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/reviews/:id/status (admin only)
const changeReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
        }

        const review = await getReviewById(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        await updateReviewStatus(id, status);

        res.status(200).json({ message: `Review ${status}` });
    } catch (error) {
        console.error("Update review status error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/reviews/:id
const removeReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const review = await getReviewById(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Owner or admin can delete
        if (review.user_id !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "You do not have access to this review" });
        }

        await deleteReview(id);

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Delete review error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    listProductReviews,
    addReview,
    changeReviewStatus,
    removeReview
};