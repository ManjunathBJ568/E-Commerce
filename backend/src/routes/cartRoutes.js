const express = require("express");
const router = express.Router();

const {
    viewCart,
    addToCart,
    updateCartItem,
    removeItem,
    clearCart
} = require("../controllers/cartController");

const authenticateToken = require("../middleware/authMiddleware");

// All cart routes require login — apply middleware to every route below
router.use(authenticateToken);

router.get("/", viewCart);
router.post("/add", addToCart);
router.put("/update/:itemId", updateCartItem);
router.delete("/remove/:itemId", removeItem);
router.delete("/clear", clearCart);

module.exports = router;