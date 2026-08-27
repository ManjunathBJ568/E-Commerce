const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authenticateToken, (req, res) => {
    res.status(200).json({
        message: "You accessed a protected route!",
        user: req.user
    });
});

// Admin-only test route
router.get("/admin-only", authenticateToken, authorizeRoles("admin"), (req, res) => {
    res.status(200).json({
        message: "Welcome, admin! You have special access.",
        user: req.user
    });
});

module.exports = router;