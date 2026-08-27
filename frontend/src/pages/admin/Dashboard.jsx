import { useState, useEffect } from "react";
import { getDashboardStats } from "../../api/adminService";

const Dashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to load dashboard", err);
            }
        };

        fetchStats();
    }, []);

    if (!stats) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">

            {/* HEADER */}
            <div className="admin-page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>
                        Welcome back! Here's what's happening with your store today.
                    </p>
                </div>
            </div>


            {/* STAT CARDS */}
            <div className="dashboard-stats">

                {/* CUSTOMERS */}
                <div className="dashboard-stat-card customers-card">
                    <div className="dashboard-card-top">
                        <div className="dashboard-stat-icon">
                            👥
                        </div>

                        <span className="dashboard-card-label">
                            Customers
                        </span>
                    </div>

                    <h2>{stats.totalCustomers}</h2>

                    <p>Total registered customers</p>
                </div>


                {/* ORDERS */}
                <div className="dashboard-stat-card orders-card">
                    <div className="dashboard-card-top">
                        <div className="dashboard-stat-icon">
                            📦
                        </div>

                        <span className="dashboard-card-label">
                            Orders
                        </span>
                    </div>

                    <h2>{stats.totalOrders}</h2>

                    <p>Total orders received</p>
                </div>


                {/* REVENUE */}
                <div className="dashboard-stat-card revenue-card">
                    <div className="dashboard-card-top">
                        <div className="dashboard-stat-icon">
                            ₹
                        </div>

                        <span className="dashboard-card-label">
                            Revenue
                        </span>
                    </div>

                    <h2>
                        ₹{Number(stats.totalRevenue || 0).toLocaleString("en-IN")}
                    </h2>

                    <p>Total store revenue</p>
                </div>


                {/* RETURNS */}
                <div className="dashboard-stat-card returns-card">
                    <div className="dashboard-card-top">
                        <div className="dashboard-stat-icon">
                            ↩
                        </div>

                        <span className="dashboard-card-label">
                            Returns
                        </span>
                    </div>

                    <h2>{stats.pendingReturns}</h2>

                    <p>Pending return requests</p>
                </div>


                {/* PRODUCTS */}
                <div className="dashboard-stat-card products-card">
                    <div className="dashboard-card-top">
                        <div className="dashboard-stat-icon">
                            🛍
                        </div>

                        <span className="dashboard-card-label">
                            Products
                        </span>
                    </div>

                    <h2>{stats.activeProducts}</h2>

                    <p>Currently active products</p>
                </div>

            </div>


            {/* QUICK OVERVIEW */}
            <div className="dashboard-overview">

                <div className="dashboard-overview-header">
                    <div>
                        <h2>Store Overview</h2>
                        <p>Quick summary of your store</p>
                    </div>
                </div>

                <div className="dashboard-overview-grid">

                    <div className="overview-item">
                        <span className="overview-icon">👥</span>

                        <div>
                            <strong>{stats.totalCustomers}</strong>
                            <span>Customers</span>
                        </div>
                    </div>


                    <div className="overview-item">
                        <span className="overview-icon">📦</span>

                        <div>
                            <strong>{stats.totalOrders}</strong>
                            <span>Orders</span>
                        </div>
                    </div>


                    <div className="overview-item">
                        <span className="overview-icon">💰</span>

                        <div>
                            <strong>
                                ₹{Number(stats.totalRevenue || 0).toLocaleString("en-IN")}
                            </strong>

                            <span>Revenue</span>
                        </div>
                    </div>


                    <div className="overview-item">
                        <span className="overview-icon">↩</span>

                        <div>
                            <strong>{stats.pendingReturns}</strong>
                            <span>Pending Returns</span>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;