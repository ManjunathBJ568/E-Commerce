import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../api/productService";
import ProductCard from "../components/ProductCard";

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await getAllProducts();
                setFeaturedProducts(data.slice(0, 4));
            } catch (err) {
                console.error(
                    "Failed to load featured products",
                    err
                );
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    return (
        <div className="home-page">

            {/* ================= HERO ================= */}

            <section className="home-hero">
                <div className="home-hero-overlay"></div>

                <div className="container home-hero-content">

                    <div className="hero-badge">
                        ✨ New Season Arrivals
                    </div>

                    <h1>
                        Everything you need,
                        <br />
                        <span>delivered to your door.</span>
                    </h1>

                    <p>
                        Quality products, unbeatable prices,
                        and fast shipping — all in one place.
                    </p>

                    <div className="hero-actions">
                        <Link
                            to="/products"
                            className="home-primary-btn"
                        >
                            Shop Now
                            <span>→</span>
                        </Link>

                        <Link
                            to="/products"
                            className="home-secondary-btn"
                        >
                            Explore Collection
                        </Link>
                    </div>

                    <div className="hero-trust">

                        <div>
                            <span>🚚</span>
                            <div>
                                <strong>Fast Delivery</strong>
                                <small>Across India</small>
                            </div>
                        </div>

                        <div>
                            <span>🔒</span>
                            <div>
                                <strong>Secure Payment</strong>
                                <small>100% Protected</small>
                            </div>
                        </div>

                        <div>
                            <span>↩️</span>
                            <div>
                                <strong>Easy Returns</strong>
                                <small>7-Day Returns</small>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* ================= CATEGORIES ================= */}

            <section className="home-category-section">

                <div className="container">

                    <div className="home-section-heading">

                        <div>
                            <span className="section-eyebrow">
                                SHOP BY CATEGORY
                            </span>

                            <h2>
                                Find what you're looking for
                            </h2>
                        </div>

                        <Link
                            to="/products"
                            className="home-view-link"
                        >
                            View All →
                        </Link>

                    </div>

                    <div className="home-category-grid">

                        {[
                            {
                                name: "Electronics",
                                icon: "💻",
                                description:
                                    "Smart tech & gadgets",
                            },
                            {
                                name: "Clothing",
                                icon: "👕",
                                description:
                                    "Style for every occasion",
                            },
                            {
                                name: "Home & Kitchen",
                                icon: "🏠",
                                description:
                                    "Make your home better",
                            },
                            {
                                name: "Sports & Fitness",
                                icon: "🏃",
                                description:
                                    "Move. Train. Perform.",
                            },
                        ].map((category) => (
                            <Link
                                key={category.name}
                                to={`/products?category=${encodeURIComponent(
                                    category.name
                                )}`}
                                className="home-category-card"
                            >
                                <div className="category-icon">
                                    {category.icon}
                                </div>

                                <div>
                                    <h3>{category.name}</h3>

                                    <p>
                                        {category.description}
                                    </p>
                                </div>

                                <span className="category-arrow">
                                    →
                                </span>
                            </Link>
                        ))}

                    </div>

                </div>

            </section>

            {/* ================= FEATURED PRODUCTS ================= */}

            <section className="home-products-section">

                <div className="container">

                    <div className="home-section-heading">

                        <div>
                            <span className="section-eyebrow">
                                HANDPICKED FOR YOU
                            </span>

                            <h2>
                                Featured Products
                            </h2>

                            <p>
                                Discover some of our most popular
                                products.
                            </p>
                        </div>

                        <Link
                            to="/products"
                            className="home-view-link"
                        >
                            View All →
                        </Link>

                    </div>

                    {loading ? (
                        <div className="home-loading">

                            <div className="loading-spinner"></div>

                            <p>
                                Finding the best products for you...
                            </p>

                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-products home-product-grid">

                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}

                        </div>
                    ) : (
                        <div className="home-no-products">
                            <span>🛍️</span>

                            <h3>
                                No products available
                            </h3>

                            <p>
                                Please check back soon.
                            </p>
                        </div>
                    )}

                </div>

            </section>

            {/* ================= PROMO ================= */}

            <section className="home-promo">

                <div className="container">

                    <div className="home-promo-card">

                        <div className="promo-content">

                            <span className="promo-eyebrow">
                                LIMITED-TIME BENEFIT
                            </span>

                            <h2>
                                Free Delivery
                                <br />
                                on Orders Above ₹500
                            </h2>

                            <p>
                                Shop more, save more — plus enjoy
                                easy 7-day returns on eligible products.
                            </p>

                            <Link
                                to="/products"
                                className="promo-btn"
                            >
                                Explore Deals
                                <span>→</span>
                            </Link>

                        </div>

                        <div className="promo-visual">
                            <div className="promo-circle promo-circle-one"></div>
                            <div className="promo-circle promo-circle-two"></div>

                            <div className="promo-box">
                                🚚
                            </div>
                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default Home;