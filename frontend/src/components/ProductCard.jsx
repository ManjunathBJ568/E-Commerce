import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    const discount = Number(product.discount || 0);
    const price = Number(product.price);

    const finalPrice = (
        price - (price * discount) / 100
    ).toFixed(2);

    const imageUrl = product.primary_image
        ? `http://localhost:5000${product.primary_image}`
        : null;

    return (
        <Link
            to={`/products/${product.id}`}
            className="product-card"
        >
            {/* IMAGE */}
            <div className="product-card-image">

                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        onError={(e) => {
                            console.error(
                                "Image failed:",
                                imageUrl
                            );
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="product-card-placeholder">
                        <span>📦</span>
                        <p>No Image</p>
                    </div>
                )}

                {/* DISCOUNT */}
                {discount > 0 && (
                    <span className="product-card-discount">
                        -{discount}%
                    </span>
                )}

                {/* WISHLIST */}
                <button
                    className="product-wishlist"
                    onClick={(e) => e.preventDefault()}
                >
                    ♡
                </button>

            </div>

            {/* BODY */}
            <div className="product-card-body">

                <p className="product-card-category">
                    {product.category_name || "Collection"}
                </p>

                <h3 className="product-card-name">
                    {product.name}
                </h3>

                {/* RATING */}
                <div className="product-card-rating">
                    <span>★★★★★</span>
                    <small>4.5</small>
                </div>

                {/* PRICE */}
                <div className="product-card-price">

                    <span className="price-final">
                        ₹{finalPrice}
                    </span>

                    {discount > 0 && (
                        <span className="price-original">
                            ₹{price.toFixed(2)}
                        </span>
                    )}

                </div>

                {/* STOCK */}
                <div
                    className={`stock-label ${
                        product.stock > 0
                            ? "in-stock"
                            : "out-stock"
                    }`}
                >
                    <span className="stock-dot"></span>

                    {product.stock > 0
                        ? "In Stock"
                        : "Out of Stock"}
                </div>

                {/* ACTION */}
                <div className="product-card-action">
                    View Product
                    <span>→</span>
                </div>

            </div>

        </Link>
    );
};

export default ProductCard;