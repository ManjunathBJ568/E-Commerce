const express = require("express");
const router = express.Router();

const {
    listCategories,
    getCategory,
    addCategory,
    editCategory,
    removeCategory
} = require("../controllers/categoryController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Public routes
router.get("/", listCategories);
router.get("/:id", getCategory);

// Admin-only routes
router.post("/", authenticateToken, authorizeRoles("admin"), addCategory);
router.put("/:id", authenticateToken, authorizeRoles("admin"), editCategory);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), removeCategory);

module.exports = router;