import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div style={{ display: "flex", minHeight: "80vh" }}>
            <aside style={{ width: "200px", borderRight: "1px solid #ccc", padding: "1rem" }}>
                <h3>Admin Panel</h3>
                <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <Link to="/admin">Dashboard</Link>
                    <Link to="/admin/products">Products</Link>
                    <Link to="/admin/categories">Categories</Link>
                    <Link to="/admin/orders">Orders</Link>
                    <Link to="/admin/returns">Returns</Link>
                </nav>
            </aside>
            <main style={{ flex: 1, padding: "1rem" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;