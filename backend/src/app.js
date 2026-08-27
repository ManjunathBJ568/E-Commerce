const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const couponRoutes = require("./routes/couponRoutes");
const returnRoutes = require("./routes/returnRoutes");
const refundRoutes = require("./routes/refundRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/db-test", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users LIMIT 1");
        res.json({ message: "MySQL connected successfully", users: rows });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ message: "Database connection failed" });
    }
});
module.exports = app;