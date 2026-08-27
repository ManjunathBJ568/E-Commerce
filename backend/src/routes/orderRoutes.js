const express = require("express");
const router = express.Router();


const { placeOrder, listMyOrders, getSingleOrder, changeOrderStatus, cancelOrder } = require("../controllers/orderController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
router.use(authenticateToken);

router.post("/", placeOrder);
router.get("/", listMyOrders);
router.get("/:id", getSingleOrder);
router.put("/:id/status", authorizeRoles("admin"), changeOrderStatus);
router.put("/:id/cancel", cancelOrder);
module.exports = router;