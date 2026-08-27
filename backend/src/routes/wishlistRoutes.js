const express = require("express");
const router = express.Router();

const {
    viewWishlist,
    addToWishlist,
    removeFromWishlist
} = require("../controllers/wishlistController");

const authenticateToken = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/", viewWishlist);
router.post("/add", addToWishlist);
router.delete("/remove/:itemId", removeFromWishlist);

module.exports = router;