import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/orderService";

const OrderConfirmation = () => {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderById(id);
                setOrder(data);
            } catch (err) {
                console.error("Failed to load order", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    /* ================= LOADING ================= */

    if (loading) {
        return (
            <div className="order-page">
                <div className="order-loading">

                    <div className="order-spinner"></div>

                    <h3>Loading your order...</h3>

                    <p>
                        Please wait while we fetch your order details.
                    </p>

                </div>
            </div>
        );
    }

    /* ================= ORDER NOT FOUND ================= */

    if (!order) {
        return (
            <div className="order-page">
                <div className="order-error">

                    <div className="order-error-icon">
                        !
                    </div>

                    <h2>Order Not Found</h2>

                    <p>
                        We couldn't find the order you're looking for.
                    </p>

                    <Link
                        to="/products"
                        className="order-primary-btn"
                    >
                        Continue Shopping →
                    </Link>

                </div>
            </div>
        );
    }

    return (
        <div className="order-page">

            <div className="order-container">

                {/* ================= SUCCESS ================= */}

                <div className="order-success">

                    <div className="success-icon">
                        ✓
                    </div>

                    <span className="success-eyebrow">
                        ORDER CONFIRMED
                    </span>

                    <h1>
                        Thank you for your order!
                    </h1>

                    <p>
                        Your order has been successfully placed.
                        We'll keep you updated about its delivery.
                    </p>

                </div>

                {/* ================= ORDER SUMMARY ================= */}

                <div className="order-summary-card">

                    <div className="order-summary-header">

                        <div>
                            <span>
                                ORDER NUMBER
                            </span>

                            <h3>
                                #{order.order_number}
                            </h3>
                        </div>

                        <div className="order-status">
                            {order.status}
                        </div>

                    </div>

                    <div className="order-summary-divider"></div>

                    <div className="order-meta">

                        <div>
                            <span>Total Amount</span>

                            <strong>
                                ₹{order.total_amount}
                            </strong>
                        </div>

                        <div>
                            <span>Payment Status</span>

                            <strong>
                                {order.payment_status || "Confirmed"}
                            </strong>
                        </div>

                        <div>
                            <span>Order Status</span>

                            <strong>
                                {order.status}
                            </strong>
                        </div>

                    </div>

                </div>

                {/* ================= ITEMS ================= */}

                <div className="order-items-card">

                    <div className="order-card-heading">

                        <div>
                            <span className="order-heading-eyebrow">
                                YOUR PURCHASE
                            </span>

                            <h2>
                                Order Items
                            </h2>
                        </div>

                        <span className="order-item-count">
                            {order.items.length}{" "}
                            {order.items.length === 1
                                ? "item"
                                : "items"}
                        </span>

                    </div>

                    <div className="order-items">

                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="order-item"
                            >

                                <div className="order-item-icon">
                                    🛍️
                                </div>

                                <div className="order-item-info">

                                    <h3>
                                        {item.product_name}
                                    </h3>

                                    <p>
                                        Quantity: {item.quantity}
                                    </p>

                                </div>

                                <div className="order-item-price">

                                    ₹{item.total_price}

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

                {/* ================= ACTIONS ================= */}

                <div className="order-actions">

                    <Link
                        to="/products"
                        className="order-primary-btn"
                    >
                        Continue Shopping
                        <span>→</span>
                    </Link>

                    <Link
                        to="/"
                        className="order-secondary-btn"
                    >
                        Back to Home
                    </Link>

                </div>

                {/* ================= FOOTER MESSAGE ================= */}

                <div className="order-footer">

                    <span>🔒</span>

                    <p>
                        Your order information is securely stored.
                    </p>

                </div>

            </div>

        </div>
    );
};

export default OrderConfirmation;