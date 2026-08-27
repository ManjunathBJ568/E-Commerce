const express = require("express");
const router = express.Router();

const {
    listProducts,
    getProduct,
    addProduct,
    editProduct,
    removeProduct,
    uploadProductImage,
    removeProductImage
} = require("../controllers/productController");

const { listProductReviews } = require("../controllers/reviewController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../config/multerConfig");

// Public routes
router.get("/", listProducts);
router.get("/:id", getProduct);
router.get("/:productId/reviews", listProductReviews);

// Admin-only routes
router.post("/", authenticateToken, authorizeRoles("admin"), addProduct);
router.put("/:id", authenticateToken, authorizeRoles("admin"), editProduct);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), removeProduct);

// Admin-only image routes
router.post("/:id/images", authenticateToken, authorizeRoles("admin"), upload.single("image"), uploadProductImage);
router.delete("/images/:imageId", authenticateToken, authorizeRoles("admin"), removeProductImage);

module.exports = router;