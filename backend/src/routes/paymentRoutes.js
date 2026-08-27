const express = require("express");
const router = express.Router();

const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    createCodPayment
} = require("../controllers/paymentController");

const authenticateToken = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.post("/razorpay/create-order", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);
router.post("/cod", createCodPayment);

module.exports = router;