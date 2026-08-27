const {
    createReturnRequest,
    getReturnsByUser,
    getReturnById,
    getReturnByOrderId,
    updateReturnStatus,
    getAllReturns
} = require("../models/returnModel");

const { getOrderById, updateOrderStatus } = require("../models/orderModel");

const VALID_RETURN_STATUSES = ["requested", "approved", "rejected", "picked_up", "received", "completed"];

// POST /api/returns
const requestReturn = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { orderId, reason } = req.body;

        if (!orderId || !reason) {
            return res.status(400).json({ message: "orderId and reason are required" });
        }

        const order = await getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user_id !== userId) {
            return res.status(403).json({ message: "You do not have access to this order" });
        }

        if (order.status !== "delivered") {
            return res.status(400).json({
                message: "Only delivered orders can be returned"
            });
        }

        const existingReturn = await getReturnByOrderId(orderId);
        if (existingReturn) {
            return res.status(409).json({ message: "A return request already exists for this order" });
        }

        const result = await createReturnRequest(orderId, userId, reason);

        res.status(201).json({
            message: "Return request submitted",
            returnId: result.insertId
        });
    } catch (error) {
        console.error("Request return error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/returns
const listMyReturns = async (req, res) => {
    try {
        const userId = req.user.userId;
        const returns = await getReturnsByUser(userId);
        res.status(200).json({ returns });
    } catch (error) {
        console.error("List returns error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/returns/:id
const getSingleReturn = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const returnRequest = await getReturnById(id);
        if (!returnRequest) {
            return res.status(404).json({ message: "Return request not found" });
        }

        if (returnRequest.user_id !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "You do not have access to this return request" });
        }

        res.status(200).json({ return: returnRequest });
    } catch (error) {
        console.error("Get return error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/returns/:id/status (admin only)
const changeReturnStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !VALID_RETURN_STATUSES.includes(status)) {
            return res.status(400).json({
                message: `Status must be one of: ${VALID_RETURN_STATUSES.join(", ")}`
            });
        }

        const returnRequest = await getReturnById(id);
        if (!returnRequest) {
            return res.status(404).json({ message: "Return request not found" });
        }

        await updateReturnStatus(id, status);

        // If the return is completed, mark the order itself as 'returned'
        if (status === "completed") {
            await updateOrderStatus(returnRequest.order_id, "returned");
        }

        res.status(200).json({ message: `Return status updated to '${status}'` });
    } catch (error) {
        console.error("Update return status error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// GET /api/returns/all (admin only)
const listAllReturns = async (req, res) => {
    try {
        const returns = await getAllReturns();
        res.status(200).json({ returns });
    } catch (error) {
        console.error("List all returns error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = {
    requestReturn,
    listMyReturns,
    getSingleReturn,
    changeReturnStatus,
    listAllReturns
};