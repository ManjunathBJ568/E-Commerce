const express = require("express");
const router = express.Router();

const {
    validateCoupon,
    listCoupons,
    addCoupon,
    editCoupon,
    removeCoupon
} = require("../controllers/couponController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Logged-in users can validate a coupon at checkout
router.post("/validate", authenticateToken, validateCoupon);

// Admin-only management
router.get("/", authenticateToken, authorizeRoles("admin"), listCoupons);
router.post("/", authenticateToken, authorizeRoles("admin"), addCoupon);
router.put("/:id", authenticateToken, authorizeRoles("admin"), editCoupon);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), removeCoupon);

module.exports = router;