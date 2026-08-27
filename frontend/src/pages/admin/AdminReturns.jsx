import { useState, useEffect } from "react";
import "../../styles/admin.css";
import { getAllReturnsAdmin, updateReturnStatusAdmin } from "../../api/returnService";

const RETURN_STATUS_OPTIONS = ["requested", "approved", "rejected", "picked_up", "received", "completed"];

const AdminReturns = () => {
    const [returns, setReturns] = useState([]);
    const [message, setMessage] = useState("");

    const fetchReturns = async () => {
        try {
            const data = await getAllReturnsAdmin();
            setReturns(data);
        } catch (err) {
            console.error("Failed to load returns", err);
        }
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    const handleStatusChange = async (returnId, newStatus) => {
        try {
            await updateReturnStatusAdmin(returnId, newStatus);
            setMessage(`Return #${returnId} updated to '${newStatus}'`);
            fetchReturns();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to update status");
        }
    };

    if (returns.length === 0) {
        return <p>No return requests yet.</p>;
    }

    return (
    <div className="admin-page">

        {/* PAGE HEADER */}
        <div className="admin-page-header">

            <div>
                <h2>Return Requests</h2>

                <p>
                    Review and manage customer return requests.
                </p>
            </div>

            <div className="admin-returns-count">
                {returns.length} Request{returns.length !== 1 ? "s" : ""}
            </div>

        </div>


        {/* MESSAGE */}
        {message && (
            <div className="admin-message">
                ✓ {message}
            </div>
        )}


        {/* RETURNS TABLE */}
        <div className="admin-table-wrapper">

            <table className="admin-table">

                <thead>

                    <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Reason</th>
                        <th>Status</th>
                    </tr>

                </thead>

                <tbody>

                    {returns.map((r) => (

                        <tr key={r.id}>

                            {/* ORDER */}

                            <td>
                                <div className="admin-order-number">
                                    #{r.order_number}
                                </div>

                                <div className="admin-order-id">
                                    Return ID: {r.id}
                                </div>
                            </td>


                            {/* CUSTOMER */}

                            <td>

                                <div className="admin-customer-info">

                                    <div className="admin-customer-avatar">
                                        {r.customer_name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>

                                        <div className="admin-customer-name">
                                            {r.customer_name}
                                        </div>

                                        <div className="admin-customer-email">
                                            {r.customer_email}
                                        </div>

                                    </div>

                                </div>

                            </td>


                            {/* REASON */}

                            <td>

                                <div className="admin-return-reason">
                                    {r.reason || "No reason provided"}
                                </div>

                            </td>


                            {/* STATUS */}

                            <td>

                                <select
                                    className={`admin-status-select status-${r.status}`}
                                    value={r.status}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            r.id,
                                            e.target.value
                                        )
                                    }
                                >

                                    {RETURN_STATUS_OPTIONS.map((s) => (

                                        <option
                                            key={s}
                                            value={s}
                                        >
                                            {s
                                                .replace("_", " ")
                                                .replace(
                                                    /\b\w/g,
                                                    (char) =>
                                                        char.toUpperCase()
                                                )}
                                        </option>

                                    ))}

                                </select>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    </div>
);
};

export default AdminReturns;