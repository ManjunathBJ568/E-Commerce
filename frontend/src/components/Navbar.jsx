import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const cartCount = cart.items?.length || 0;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
            setMenuOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
    };

    return (
        <header className="navbar">
            <div className="navbar-inner container">
                <Link to="/" className="navbar-logo">MANJU & CO.</Link>

                <form className="navbar-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" aria-label="Search">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>
                </form>

                <button
                    className="navbar-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {menuOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        )}
                    </svg>
                </button>

                <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
                    <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>

                    <Link to="/cart" className="navbar-cart" onClick={() => setMenuOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Cart
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>

                    {user ? (
                        <div className="navbar-user">
                            <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                            {user.role === "admin" && (
                                <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                            )}
                            <span className="navbar-username">Hi, {user.name.split(" ")[0]}</span>
                            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <div className="navbar-auth">
                            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;