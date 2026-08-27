import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../api/wishlistService";

const Wishlist = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [message, setMessage] = useState("");

    const fetchWishlist = async () => {
        try {
            const data = await getWishlist();
            setItems(data.items);
        } catch (err) {
            console.error("Failed to load wishlist", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (itemId) => {
        setRemovingId(itemId);
        setMessage("");

        try {
            await removeFromWishlist(itemId);

            setMessage("Item removed from wishlist");

            await fetchWishlist();
        } catch (err) {
            setMessage("Failed to remove item");
        } finally {
            setRemovingId(null);
        }
    };

    /* ================= LOADING ================= */

    if (loading) {
        return (
            <div className="wishlist-page">

                <div className="wishlist-loading">

                    <div className="wishlist-spinner"></div>

                    <h3>Loading your wishlist...</h3>

                    <p>
                        Please wait while we fetch your saved products.
                    </p>

                </div>

            </div>
        );
    }

    /* ================= EMPTY ================= */

    if (items.length === 0) {
        return (
            <div className="wishlist-page">

                <div className="wishlist-empty">

                    <div className="wishlist-empty-icon">
                        ♡
                    </div>

                    <span className="wishlist-eyebrow">
                        YOUR COLLECTION
                    </span>

                    <h2>
                        Your wishlist is empty
                    </h2>

                    <p>
                        Save products you love and come back to them
                        whenever you're ready.
                    </p>

                    <Link
                        to="/products"
                        className="wishlist-shop-btn"
                    >
                        Browse Products
                        <span>→</span>
                    </Link>

                </div>

            </div>
        );
    }

    return (
        <div className="wishlist-page">

            <div className="wishlist-container">

                {/* ================= HEADER ================= */}

                <div className="wishlist-header">

                    <div>

                        <span className="wishlist-eyebrow">
                            YOUR COLLECTION
                        </span>

                        <h1>
                            Wishlist
                        </h1>

                        <p>
                            Products you've saved for later.
                        </p>

                    </div>

                    <div className="wishlist-count">

                        <strong>
                            {items.length}
                        </strong>

                        <span>
                            {items.length === 1
                                ? "Item"
                                : "Items"}
                        </span>

                    </div>

                </div>

                {/* ================= MESSAGE ================= */}

                {message && (
                    <div className="wishlist-message">
                        <span>✓</span>
                        {message}
                    </div>
                )}

                {/* ================= WISHLIST ================= */}

                <div className="wishlist-list">

                    {items.map((item) => (

                        <div
                            key={item.wishlist_item_id}
                            className="wishlist-card"
                        >

                            {/* PRODUCT */}

                            <Link
                                to={`/products/${item.product_id}`}
                                className="wishlist-product"
                            >

                                <div className="wishlist-product-icon">
                                    ♡
                                </div>

                                <div className="wishlist-product-info">

                                    <span>
                                        SAVED PRODUCT
                                    </span>

                                    <h3>
                                        {item.name}
                                    </h3>

                                    <strong>
                                        ₹{Number(item.price).toFixed(2)}
                                    </strong>

                                </div>

                            </Link>

                            {/* ACTION */}

                            <div className="wishlist-actions">

                                <Link
                                    to={`/products/${item.product_id}`}
                                    className="wishlist-view-btn"
                                >
                                    View Product
                                    <span>→</span>
                                </Link>

                                <button
                                    onClick={() =>
                                        handleRemove(
                                            item.wishlist_item_id
                                        )
                                    }
                                    disabled={
                                        removingId ===
                                        item.wishlist_item_id
                                    }
                                    className="wishlist-remove-btn"
                                >
                                    {removingId ===
                                    item.wishlist_item_id
                                        ? "Removing..."
                                        : "Remove"}
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

                {/* ================= CONTINUE SHOPPING ================= */}

                <div className="wishlist-bottom">

                    <Link
                        to="/products"
                        className="wishlist-continue"
                    >
                        ← Continue Shopping
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default Wishlist;