import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, cancelOrder } from "../api/orderService";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    const fetchOrders = async () => {
        try {
            const data = await getMyOrders();
            setOrders(data);
        } catch (err) {
            console.error("Failed to load orders", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancel = async (orderId) => {
        if (
            !window.confirm(
                "Are you sure you want to cancel this order?"
            )
        ) {
            return;
        }

        setCancellingId(orderId);
        setMessage("");

        try {
            await cancelOrder(orderId);

            setMessage("Order cancelled successfully");

            await fetchOrders();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                    "Failed to cancel order"
            );
        } finally {
            setCancellingId(null);
        }
    };

    const CANCELLABLE_STATUSES = [
        "placed",
        "confirmed",
        "processing",
    ];

    /* ================= LOADING ================= */

    if (loading) {
        return (
            <div className="orders-page">

                <div className="orders-loading">

                    <div className="orders-spinner"></div>

                    <h3>Loading your orders...</h3>

                    <p>
                        Please wait while we fetch your order history.
                    </p>

                </div>

            </div>
        );
    }

    /* ================= EMPTY ================= */

    if (orders.length === 0) {
        return (
            <div className="orders-page">

                <div className="orders-empty">

                    <div className="empty-orders-icon">
                        🛍️
                    </div>

                    <span className="orders-eyebrow">
                        YOUR ORDERS
                    </span>

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        You haven't placed any orders yet.
                        Start shopping and your orders will appear here.
                    </p>

                    <Link
                        to="/products"
                        className="orders-shop-btn"
                    >
                        Start Shopping
                        <span>→</span>
                    </Link>

                </div>

            </div>
        );
    }

    return (
        <div className="orders-page">

            <div className="orders-container">

                {/* ================= HEADER ================= */}

                <div className="orders-header">

                    <div>
                        <span className="orders-eyebrow">
                            ACCOUNT
                        </span>

                        <h1>
                            My Orders
                        </h1>

                        <p>
                            Track and manage your recent purchases.
                        </p>
                    </div>

                    <div className="orders-count">
                        <strong>
                            {orders.length}
                        </strong>

                        <span>
                            {orders.length === 1
                                ? "Order"
                                : "Orders"}
                        </span>
                    </div>

                </div>

                {/* ================= MESSAGE ================= */}

                {message && (
                    <div
                        className={
                            message.includes("successfully")
                                ? "orders-message success"
                                : "orders-message error"
                        }
                    >
                        <span>
                            {message.includes("successfully")
                                ? "✓"
                                : "!"}
                        </span>

                        {message}

                    </div>
                )}

                {/* ================= ORDER LIST ================= */}

                <div className="orders-list">

                    {orders.map((order) => {

                        const canCancel =
                            CANCELLABLE_STATUSES.includes(
                                order.status
                            );

                        return (
                            <div
                                key={order.id}
                                className="order-list-card"
                            >

                                {/* TOP */}

                                <div className="order-list-top">

                                    <div className="order-number-section">

                                        <span>
                                            ORDER
                                        </span>

                                        <h3>
                                            #{order.order_number}
                                        </h3>

                                        <p>
                                            {new Date(
                                                order.created_at
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </p>

                                    </div>

                                    <div className="order-price-section">

                                        <strong>
                                            ₹{order.total_amount}
                                        </strong>

                                        <span
                                            className={`order-status-badge status-${order.status}`}
                                        >
                                            {order.status}
                                        </span>

                                    </div>

                                </div>

                                {/* DIVIDER */}

                                <div className="order-list-divider"></div>

                                {/* BOTTOM */}

                                <div className="order-list-bottom">

                                    <div className="order-mini-info">

                                        <span className="mini-order-icon">
                                            📦
                                        </span>

                                        <div>
                                            <strong>
                                                Order #{order.order_number}
                                            </strong>

                                            <small>
                                                Placed on{" "}
                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )}
                                            </small>
                                        </div>

                                    </div>

                                    <div className="order-actions">

                                        <Link
                                            to={`/order-confirmation/${order.id}`}
                                            className="view-order-btn"
                                        >
                                            View Details
                                            <span>→</span>
                                        </Link>

                                        {canCancel && (
                                            <button
                                                onClick={() =>
                                                    handleCancel(
                                                        order.id
                                                    )
                                                }
                                                disabled={
                                                    cancellingId ===
                                                    order.id
                                                }
                                                className="cancel-order-btn"
                                            >
                                                {cancellingId ===
                                                order.id
                                                    ? "Cancelling..."
                                                    : "Cancel Order"}
                                            </button>
                                        )}

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>

                {/* ================= CONTINUE SHOPPING ================= */}

                <div className="orders-bottom">

                    <Link
                        to="/products"
                        className="continue-shopping-link"
                    >
                        ← Continue Shopping
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default Orders;