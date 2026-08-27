const express = require("express");
const router = express.Router();

const {
    listAddresses,
    getAddress,
    addAddress,
    editAddress,
    removeAddress,
    makeDefault
} = require("../controllers/addressController");

const authenticateToken = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/", listAddresses);
router.get("/:id", getAddress);
router.post("/", addAddress);
router.put("/:id", editAddress);
router.delete("/:id", removeAddress);
router.put("/:id/default", makeDefault);

module.exports = router;