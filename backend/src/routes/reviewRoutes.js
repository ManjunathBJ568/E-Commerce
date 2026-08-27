const express = require("express");
const router = express.Router();

const { addReview, changeReviewStatus, removeReview } = require("../controllers/reviewController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/", authenticateToken, addReview);
router.put("/:id/status", authenticateToken, authorizeRoles("admin"), changeReviewStatus);
router.delete("/:id", authenticateToken, removeReview);

module.exports = router;