import { useCart } from "../context/CartContext";
import { updateCartItem, removeCartItem } from "../api/cartService";
import { Link } from "react-router-dom";

const Cart = () => {
    const { cart, refreshCart } = useCart();

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await updateCartItem(itemId, newQuantity);
            refreshCart();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to update quantity"
            );
        }
    };

    const handleRemove = async (itemId) => {
        try {
            await removeCartItem(itemId);
            refreshCart();
        } catch (err) {
            alert("Failed to remove item");
        }
    };

    /* EMPTY CART */

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="cart-empty-page">

                <div className="cart-empty-icon">
                    🛒
                </div>

                <h2>Your cart is empty</h2>

                <p>
                    Looks like you haven't added anything to your cart yet.
                </p>

                <Link
                    to="/products"
                    className="cart-browse-button"
                >
                    Browse Products
                </Link>

            </div>
        );
    }

    return (
        <div className="cart-page">

            {/* HEADER */}

            <div className="cart-header">

                <div>
                    <span className="cart-header-label">
                        SHOPPING BAG
                    </span>

                    <h1>Your Cart</h1>
                </div>

                <span className="cart-item-count">
                    {cart.items.length}{" "}
                    {cart.items.length === 1 ? "item" : "items"}
                </span>

            </div>


            {/* MAIN CART */}

            <div className="cart-layout">

                {/* LEFT SIDE */}

                <div className="cart-items-section">

                    {cart.items.map((item) => {
                            console.log("CART ITEM:", item);
                        const imageUrl = item.primary_image
                            ? `http://localhost:5000${item.primary_image}`
                            : null;

                        return (
                            <div
                                className="cart-item-card"
                                key={item.cart_item_id}
                            >

                                {/* IMAGE */}

                                <div className="cart-item-image">

                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={item.name}
                                        />
                                    ) : (
                                        <div className="cart-no-image">
                                            No Image
                                        </div>
                                    )}

                                </div>


                                {/* DETAILS */}

                                <div className="cart-item-details">

                                    <span className="cart-item-category">
                                        {item.category_name || "Product"}
                                    </span>

                                    <h3>
                                        {item.name}
                                    </h3>

                                    {item.brand && (
                                        <p className="cart-item-brand">
                                            {item.brand}
                                        </p>
                                    )}

                                    <div className="cart-item-price">

                                        <strong>
                                            ₹
                                            {Number(
                                                item.price_after_discount
                                            ).toFixed(2)}
                                        </strong>

                                        {item.price !==
                                            item.price_after_discount && (
                                            <span>
                                                ₹
                                                {Number(
                                                    item.price
                                                ).toFixed(2)}
                                            </span>
                                        )}

                                    </div>


                                    {/* QUANTITY */}

                                    <div className="cart-item-bottom">

                                        <div className="cart-quantity">

                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.cart_item_id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                disabled={
                                                    item.quantity <= 1
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.cart_item_id,
                                                        item.quantity + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                        <button
                                            className="cart-remove-button"
                                            onClick={() =>
                                                handleRemove(
                                                    item.cart_item_id
                                                )
                                            }
                                        >
                                            🗑 Remove
                                        </button>

                                    </div>

                                </div>


                                {/* LINE TOTAL */}

                                <div className="cart-item-total">

                                    <span>Total</span>

                                    <strong>
                                        ₹
                                        {Number(
                                            item.line_total
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            </div>
                        );
                    })}

                </div>


                {/* RIGHT SIDE */}

                <div className="cart-summary">

                    <div className="cart-summary-header">
                        <h2>Order Summary</h2>
                    </div>


                    <div className="cart-summary-row">
                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹{Number(cart.subtotal).toFixed(2)}
                        </strong>
                    </div>


                    <div className="cart-summary-row">
                        <span>
                            Delivery
                        </span>

                        <span className="cart-free">
                            Calculated at checkout
                        </span>
                    </div>


                    <div className="cart-summary-divider"></div>


                    <div className="cart-summary-total">
                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{Number(cart.subtotal).toFixed(2)}
                        </strong>
                    </div>


                    <Link
                        to="/checkout"
                        className="cart-checkout-button"
                    >
                        Proceed to Checkout
                        <span>→</span>
                    </Link>


                    <Link
                        to="/products"
                        className="cart-continue-shopping"
                    >
                        ← Continue Shopping
                    </Link>


                    <div className="cart-secure-payment">

                        <span>🔒</span>

                        <div>
                            <strong>
                                Secure Checkout
                            </strong>

                            <small>
                                Your payment information is protected
                            </small>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Cart;