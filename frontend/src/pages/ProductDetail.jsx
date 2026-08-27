import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProductReviews } from "../api/productService";
import { addToCart } from "../api/cartService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { addToWishlist } from "../api/wishlistService";

const ProductDetail = () => {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const { refreshCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productData = await getProductById(id);
                setProduct(productData);

                const reviewData = await getProductReviews(id);
                setReviews(reviewData);
            } catch (err) {
                setError("Product not found");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            await addToCart(product.id, 1);

            setMessage("Added to cart!");

            refreshCart();

            setTimeout(() => setMessage(""), 2000);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Failed to add to cart"
            );
        }
    };

    const handleAddToWishlist = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            await addToWishlist(product.id);

            setMessage("Added to wishlist!");

            setTimeout(() => setMessage(""), 2000);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Failed to add to wishlist"
            );
        }
    };

    if (loading) {
        return (
            <div className="product-detail-loading">
                <div className="product-loading-spinner"></div>
                <p>Loading product...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-detail-error">
                <div className="product-error-icon">!</div>
                <h2>Product Not Found</h2>
                <p>{error}</p>

                <button
                    className="product-back-button"
                    onClick={() => navigate("/products")}
                >
                    Back to Products
                </button>
            </div>
        );
    }

    const finalPrice =
        product.price -
        (product.price * (product.discount || 0)) / 100;

    return (
        <div className="product-detail-page">

            {/* =================================================
                PRODUCT SECTION
            ================================================= */}

            <div className="product-detail-container">

                {/* IMAGE */}
                <div className="product-detail-gallery">

                    <div className="product-detail-main-image">

                        {product.discount > 0 && (
                            <span className="product-detail-discount">
                                -{product.discount}%
                            </span>
                        )}

                        {product.images &&
                        product.images.length > 0 ? (
                            <img
                                src={`http://localhost:5000${product.images[0].image_url}`}
                                alt={product.name}
                            />
                        ) : (
                            <div className="product-detail-no-image">
                                No Image Available
                            </div>
                        )}

                    </div>

                </div>


                {/* PRODUCT INFORMATION */}
                <div className="product-detail-info">

                    <div className="product-detail-category">
                        {product.category_name || "Product"}
                    </div>

                    <h1 className="product-detail-title">
                        {product.name}
                    </h1>

                    {product.brand && (
                        <p className="product-detail-brand">
                            by <strong>{product.brand}</strong>
                        </p>
                    )}


                    {/* PRICE */}

                    <div className="product-detail-price-section">

                        <span className="product-detail-final-price">
                            ₹{finalPrice.toFixed(2)}
                        </span>

                        {product.discount > 0 && (
                            <>
                                <span className="product-detail-original-price">
                                    ₹{Number(product.price).toFixed(2)}
                                </span>

                                <span className="product-detail-save">
                                    Save ₹
                                    {(
                                        product.price - finalPrice
                                    ).toFixed(2)}
                                </span>
                            </>
                        )}

                    </div>


                    {/* STOCK */}

                    <div
                        className={
                            product.stock > 0
                                ? "product-detail-stock available"
                                : "product-detail-stock unavailable"
                        }
                    >
                        <span className="product-detail-stock-dot"></span>

                        {product.stock > 0
                            ? `${product.stock} available in stock`
                            : "Currently out of stock"}
                    </div>


                    {/* DESCRIPTION */}

                    <div className="product-detail-description">

                        <h3>About this product</h3>

                        <p>
                            {product.description ||
                                "No description available for this product."}
                        </p>

                    </div>


                    {/* MESSAGE */}

                    {message && (
                        <div className="product-detail-message">
                            ✓ {message}
                        </div>
                    )}


                    {/* ACTIONS */}

                    <div className="product-detail-actions">

                        <button
                            className="product-add-cart"
                            disabled={product.stock === 0}
                            onClick={handleAddToCart}
                        >
                            🛒 Add to Cart
                        </button>

                        <button
                            className="product-wishlist-button"
                            onClick={handleAddToWishlist}
                        >
                            ♡
                            <span>Add to Wishlist</span>
                        </button>

                    </div>


                    {/* FEATURES */}

                    <div className="product-detail-features">

                        <div className="product-feature">
                            <span className="product-feature-icon">
                                🚚
                            </span>

                            <div>
                                <strong>Fast Delivery</strong>
                                <small>
                                    Quick delivery to your address
                                </small>
                            </div>
                        </div>


                        <div className="product-feature">
                            <span className="product-feature-icon">
                                ↩
                            </span>

                            <div>
                                <strong>Easy Returns</strong>
                                <small>
                                    Simple return process
                                </small>
                            </div>
                        </div>


                        <div className="product-feature">
                            <span className="product-feature-icon">
                                🔒
                            </span>

                            <div>
                                <strong>Secure Payment</strong>
                                <small>
                                    Your payment is protected
                                </small>
                            </div>
                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                REVIEWS
            ================================================= */}

            <div className="product-reviews-section">

                <div className="product-reviews-header">

                    <div>
                        <span className="product-reviews-label">
                            CUSTOMER FEEDBACK
                        </span>

                        <h2>
                            Reviews
                            <span>
                                {reviews.length}
                            </span>
                        </h2>
                    </div>

                </div>


                {reviews.length === 0 ? (

                    <div className="product-no-reviews">

                        <div className="product-no-reviews-icon">
                            ★
                        </div>

                        <h3>No reviews yet</h3>

                        <p>
                            Be the first person to review this product.
                        </p>

                    </div>

                ) : (

                    <div className="product-reviews-list">

                        {reviews.map((review) => (

                            <div
                                className="product-review-card"
                                key={review.id}
                            >

                                <div className="product-review-top">

                                    <div className="product-review-user">

                                        <div className="product-review-avatar">
                                            {review.user_name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>
                                            <strong>
                                                {review.user_name}
                                            </strong>

                                            <div className="product-review-stars">
                                                {"⭐".repeat(review.rating)}
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                <p>
                                    {review.comment}
                                </p>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default ProductDetail;