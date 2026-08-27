const express = require("express");
const router = express.Router();

const {
    dashboard,
    listUsers,
    setUserStatus,
    listAllOrders
} = require("../controllers/adminController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// All admin routes require login AND admin role
router.use(authenticateToken, authorizeRoles("admin"));

router.get("/dashboard", dashboard);
router.get("/users", listUsers);
router.put("/users/:id/status", setUserStatus);
router.get("/orders", listAllOrders);

module.exports = router;