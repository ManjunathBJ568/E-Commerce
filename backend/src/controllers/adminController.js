const {
    getDashboardStats,
    getAllUsers,
    updateUserActiveStatus,
    getAllOrders
} = require("../models/adminModel");

// GET /api/admin/dashboard
const dashboard = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        res.status(200).json({ stats });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/admin/users
const listUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json({ users });
    } catch (error) {
        console.error("List users error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/admin/users/:id/status
const setUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        if (is_active === undefined) {
            return res.status(400).json({ message: "is_active is required (true or false)" });
        }

        await updateUserActiveStatus(id, is_active ? 1 : 0);

        res.status(200).json({
            message: `User ${is_active ? "activated" : "deactivated"} successfully`
        });
    } catch (error) {
        console.error("Set user status error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/admin/orders
const listAllOrders = async (req, res) => {
    try {
        const orders = await getAllOrders();
        res.status(200).json({ orders });
    } catch (error) {
        console.error("List all orders error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    dashboard,
    listUsers,
    setUserStatus,
    listAllOrders
};