const express = require("express");
const router = express.Router();

const {
    initiateRefund,
    getRefundStatus,
    completeRefund
} = require("../controllers/refundController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.use(authenticateToken);

router.post("/", authorizeRoles("admin"), initiateRefund);
router.get("/:orderId", getRefundStatus);
router.put("/:id/complete", authorizeRoles("admin"), completeRefund);

module.exports = router;