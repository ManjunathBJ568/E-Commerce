import { useState, useEffect } from "react";
import { getAllOrdersAdmin, updateOrderStatusAdmin } from "../../api/adminService";

const STATUS_OPTIONS = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"];

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");

    const fetchOrders = async () => {
        const data = await getAllOrdersAdmin();
        setOrders(data);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatusAdmin(orderId, newStatus);
            setMessage(`Order #${orderId} updated to '${newStatus}'`);
            fetchOrders();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to update status");
        }
    };

    return (
        <div>
            <h2>All Orders</h2>
            {message && <p style={{ color: "blue" }}>{message}</p>}

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
                        <th>Order #</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td>{order.order_number}</td>
                            <td>{order.customer_name}<br /><small>{order.customer_email}</small></td>
                            <td>₹{order.total_amount}</td>
                            <td>{order.payment_status}</td>
                            <td>
                                <select
                                    className={`admin-status-select status-${order.status}`}
                                    value={order.status}
                                    onChange={(e) =>
                                        handleStatusChange(order.id, e.target.value)
                                    }
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>
                                            {s.replaceAll("_", " ")}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;