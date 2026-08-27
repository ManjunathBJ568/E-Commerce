const {
    getCouponByCode,
    getAllCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon
} = require("../models/couponModel");

// Reusable validation logic — used by both /validate and later by Orders
const validateCouponForAmount = (coupon, orderAmount) => {
    const now = new Date();

    if (!coupon) {
        return { valid: false, message: "Invalid coupon code" };
    }

    // MySQL returns DECIMAL columns as strings — convert them to numbers here
    coupon.discount_value = Number(coupon.discount_value);
    coupon.minimum_order_amount = Number(coupon.minimum_order_amount);
    coupon.maximum_discount = coupon.maximum_discount !== null ? Number(coupon.maximum_discount) : null;

    if (!coupon.is_active) {
        return { valid: false, message: "This coupon is no longer active" };
    }

    if (now < new Date(coupon.start_date)) {
        return { valid: false, message: "This coupon is not active yet" };
    }

    if (now > new Date(coupon.end_date)) {
        return { valid: false, message: "This coupon has expired" };
    }

    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
        return { valid: false, message: "This coupon has reached its usage limit" };
    }

    if (orderAmount < coupon.minimum_order_amount) {
        return {
            valid: false,
            message: `Minimum order amount for this coupon is ₹${coupon.minimum_order_amount}`
        };
    }

    // Calculate discount
    let discount;
    if (coupon.discount_type === "percentage") {
        discount = (orderAmount * coupon.discount_value) / 100;
        if (coupon.maximum_discount && discount > coupon.maximum_discount) {
            discount = coupon.maximum_discount;
        }
    } else {
        discount = coupon.discount_value;
    }

    // Discount should never exceed the order amount itself
    if (discount > orderAmount) {
        discount = orderAmount;
    }

    return {
        valid: true,
        discount: Number(discount.toFixed(2)),
        message: "Coupon applied successfully"
    };
};

// POST /api/coupons/validate
const validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;

        if (!code || orderAmount === undefined) {
            return res.status(400).json({ message: "code and orderAmount are required" });
        }

        const coupon = await getCouponByCode(code.toUpperCase());

        const result = validateCouponForAmount(coupon, orderAmount);

        if (!result.valid) {
            return res.status(400).json({ message: result.message });
        }

        res.status(200).json({
            message: result.message,
            discount: result.discount,
            couponId: coupon.id
        });
    } catch (error) {
        console.error("Validate coupon error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/coupons (admin only)
const listCoupons = async (req, res) => {
    try {
        const coupons = await getAllCoupons();
        res.status(200).json({ coupons });
    } catch (error) {
        console.error("List coupons error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/coupons (admin only)
const addCoupon = async (req, res) => {
    try {
        const { code, discount_type, discount_value, start_date, end_date } = req.body;

        if (!code || !discount_type || !discount_value || !start_date || !end_date) {
            return res.status(400).json({
                message: "code, discount_type, discount_value, start_date and end_date are required"
            });
        }

        const result = await createCoupon(req.body);

        res.status(201).json({
            message: "Coupon created successfully",
            couponId: result.insertId
        });
    } catch (error) {
        console.error("Create coupon error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Coupon code already exists" });
        }

        res.status(500).json({ message: "Server error" });
    }
};

// PUT /api/coupons/:id (admin only)
const editCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getCouponById(id);
        if (!existing) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        await updateCoupon(id, req.body);

        res.status(200).json({ message: "Coupon updated successfully" });
    } catch (error) {
        console.error("Update coupon error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/coupons/:id (admin only)
const removeCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getCouponById(id);
        if (!existing) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        await deleteCoupon(id);

        res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
        console.error("Delete coupon error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    validateCoupon,
    listCoupons,
    addCoupon,
    editCoupon,
    removeCoupon,
    validateCouponForAmount
};