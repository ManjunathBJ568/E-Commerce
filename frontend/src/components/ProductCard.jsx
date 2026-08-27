import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    const finalPrice = (product.price - (product.price * (product.discount || 0)) / 100).toFixed(2);

    return (
        <div style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}>
            <Link to={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <h3>{product.name}</h3>
                <p style={{ color: "#666" }}>{product.category_name}</p>

                <div>
                    {product.discount > 0 && (
                        <span style={{ textDecoration: "line-through", color: "#999", marginRight: "0.5rem" }}>
                            ₹{product.price}
                        </span>
                    )}
                    <span style={{ fontWeight: "bold" }}>₹{finalPrice}</span>
                </div>

                <p style={{ fontSize: "0.9rem", color: product.stock > 0 ? "green" : "red" }}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>
            </Link>
        </div>
    );
};

export default ProductCard;