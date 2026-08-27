const express = require("express");
const router = express.Router();

const {
    requestReturn,
    listMyReturns,
    getSingleReturn,
    changeReturnStatus,
    listAllReturns
} = require("../controllers/returnController");;

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.use(authenticateToken);

router.post("/", requestReturn);
router.get("/", listMyReturns);
router.get("/all", authorizeRoles("admin"), listAllReturns);
router.get("/:id", getSingleReturn);
router.put("/:id/status", authorizeRoles("admin"), changeReturnStatus);

module.exports = router;