import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getAddresses } from "../api/addressService";
import { validateCoupon } from "../api/couponService";
import { placeOrder } from "../api/orderService";
import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    payWithCod,
} from "../api/paymentService";
import AddressForm from "../components/AddressForm";

const Checkout = () => {
    const { cart, refreshCart } = useCart();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);

    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState("");

    const fetchAddresses = async () => {
        try {
            const data = await getAddresses();

            setAddresses(data);

            const defaultAddr =
                data.find((a) => a.is_default) || data[0];

            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
            }
        } catch (err) {
            console.error("Failed to load addresses", err);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponMessage("Please enter a coupon code.");
            setCouponApplied(false);
            return;
        }

        setCouponMessage("");

        try {
            const result = await validateCoupon(
                couponCode.trim(),
                cart.subtotal
            );

            setCouponDiscount(Number(result.discount) || 0);
            setCouponMessage(result.message || "Coupon applied successfully!");
            setCouponApplied(true);
        } catch (err) {
            setCouponDiscount(0);
            setCouponApplied(false);

            setCouponMessage(
                err.response?.data?.message || "Invalid coupon code"
            );
        }
    };

    const removeCoupon = () => {
        setCouponCode("");
        setCouponDiscount(0);
        setCouponMessage("");
        setCouponApplied(false);
    };

    const deliveryCharge = cart.subtotal >= 500 ? 0 : 50;

    const totalAmount = Number(
        (
            Number(cart.subtotal) +
            deliveryCharge -
            couponDiscount
        ).toFixed(2)
    );

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            setError("Please select a delivery address.");
            return;
        }

        setError("");
        setPlacing(true);

        try {
            const orderResult = await placeOrder(
                selectedAddressId,
                couponCode || undefined
            );

            if (paymentMethod === "cod") {
                await payWithCod(orderResult.orderId);

                await refreshCart();

                navigate(
                    `/order-confirmation/${orderResult.orderId}`
                );
            } else {
                const razorpayData = await createRazorpayOrder(
                    orderResult.orderId
                );

                const options = {
                    key: razorpayData.keyId,
                    amount: razorpayData.amount,
                    currency: razorpayData.currency,
                    order_id: razorpayData.razorpayOrderId,

                    name: "MyStore",
                    description: `Order #${orderResult.orderNumber}`,

                    handler: async (response) => {
                        try {
                            await verifyRazorpayPayment({
                                razorpay_order_id:
                                    response.razorpay_order_id,

                                razorpay_payment_id:
                                    response.razorpay_payment_id,

                                razorpay_signature:
                                    response.razorpay_signature,

                                orderId: orderResult.orderId,
                            });

                            await refreshCart();

                            navigate(
                                `/order-confirmation/${orderResult.orderId}`
                            );
                        } catch (err) {
                            setError(
                                "Payment verification failed. Please contact support."
                            );
                        }
                    },

                    modal: {
                        ondismiss: () => {
                            setPlacing(false);
                        },
                    },

                    theme: {
                        color: "#111827",
                    },
                };

                const rzp = new window.Razorpay(options);

                rzp.open();
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to place order. Please try again."
            );
        } finally {
            setPlacing(false);
        }
    };

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="checkout-empty">
                <div className="empty-icon">🛒</div>

                <h2>Your cart is empty</h2>

                <p>
                    Add some products to your cart before proceeding
                    to checkout.
                </p>

                <button
                    className="shop-btn"
                    onClick={() => navigate("/")}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-page">

            {/* Header */}
            <div className="checkout-header">
                <div>
                    <span className="checkout-label">
                        SECURE CHECKOUT
                    </span>

                    <h1>Complete Your Order</h1>

                    <p>
                        Review your details and choose your preferred
                        payment method.
                    </p>
                </div>

                <div className="secure-badge">
                    🔒 Secure Checkout
                </div>
            </div>

            <div className="checkout-layout">

                {/* LEFT SIDE */}
                <div className="checkout-main">

                    {/* ADDRESS */}
                    <section className="checkout-card">

                        <div className="section-header">
                            <div className="section-number">
                                01
                            </div>

                            <div>
                                <h2>Delivery Address</h2>
                                <p>
                                    Where should we deliver your order?
                                </p>
                            </div>
                        </div>

                        {addresses.length === 0 && (
                            <div className="no-address">
                                <span>📍</span>

                                <div>
                                    <strong>
                                        No saved addresses
                                    </strong>

                                    <p>
                                        Add an address to continue.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="address-list">
                            {addresses.map((addr) => (
                                <label
                                    key={addr.id}
                                    className={`address-card ${
                                        selectedAddressId === addr.id
                                            ? "selected"
                                            : ""
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={
                                            selectedAddressId ===
                                            addr.id
                                        }
                                        onChange={() =>
                                            setSelectedAddressId(
                                                addr.id
                                            )
                                        }
                                    />

                                    <div className="radio-custom">
                                        {selectedAddressId ===
                                            addr.id && "✓"}
                                    </div>

                                    <div className="address-content">

                                        <div className="address-top">
                                            <strong>
                                                {addr.full_name}
                                            </strong>

                                            {addr.is_default && (
                                                <span className="default-badge">
                                                    DEFAULT
                                                </span>
                                            )}
                                        </div>

                                        <p>
                                            {addr.address_line1}
                                            {addr.address_line2
                                                ? `, ${addr.address_line2}`
                                                : ""}
                                        </p>

                                        <p>
                                            {addr.city},{" "}
                                            {addr.state} -{" "}
                                            {addr.postal_code}
                                        </p>

                                        {addr.phone && (
                                            <span className="phone">
                                                📞 {addr.phone}
                                            </span>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>

                        <button
                            className="add-address-btn"
                            onClick={() =>
                                setShowAddressForm(
                                    !showAddressForm
                                )
                            }
                        >
                            <span>
                                {showAddressForm ? "×" : "+"}
                            </span>

                            {showAddressForm
                                ? "Cancel"
                                : "Add New Address"}
                        </button>

                        {showAddressForm && (
                            <div className="address-form-wrapper">
                                <AddressForm
                                    onAddressAdded={() => {
                                        fetchAddresses();
                                        setShowAddressForm(false);
                                    }}
                                />
                            </div>
                        )}
                    </section>

                    {/* COUPON */}
                    <section className="checkout-card">

                        <div className="section-header">
                            <div className="section-number">
                                02
                            </div>

                            <div>
                                <h2>Have a Coupon?</h2>
                                <p>
                                    Apply a promo code and save more.
                                </p>
                            </div>
                        </div>

                        <div className="coupon-box">

                            <div className="coupon-input-wrapper">
                                <span>🏷️</span>

                                <input
                                    value={couponCode}
                                    onChange={(e) => {
                                        setCouponCode(
                                            e.target.value.toUpperCase()
                                        );

                                        if (couponApplied) {
                                            setCouponApplied(false);
                                        }
                                    }}
                                    placeholder="Enter coupon code"
                                />
                            </div>

                            {couponApplied ? (
                                <button
                                    className="remove-coupon-btn"
                                    onClick={removeCoupon}
                                >
                                    Remove
                                </button>
                            ) : (
                                <button
                                    className="apply-coupon-btn"
                                    onClick={handleApplyCoupon}
                                >
                                    Apply
                                </button>
                            )}
                        </div>

                        {couponMessage && (
                            <div
                                className={`coupon-message ${
                                    couponApplied
                                        ? "success"
                                        : "error"
                                }`}
                            >
                                <span>
                                    {couponApplied ? "✓" : "!"}
                                </span>

                                {couponMessage}
                            </div>
                        )}
                    </section>

                    {/* PAYMENT */}
                    <section className="checkout-card">

                        <div className="section-header">
                            <div className="section-number">
                                03
                            </div>

                            <div>
                                <h2>Payment Method</h2>
                                <p>
                                    Choose how you'd like to pay.
                                </p>
                            </div>
                        </div>

                        <div className="payment-options">

                            {/* COD */}
                            <label
                                className={`payment-card ${
                                    paymentMethod === "cod"
                                        ? "selected"
                                        : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={
                                        paymentMethod === "cod"
                                    }
                                    onChange={() =>
                                        setPaymentMethod("cod")
                                    }
                                />

                                <div className="payment-icon">
                                    💵
                                </div>

                                <div className="payment-info">
                                    <strong>
                                        Cash on Delivery
                                    </strong>

                                    <span>
                                        Pay when your order arrives
                                    </span>
                                </div>

                                <div className="payment-check">
                                    {paymentMethod === "cod" && "✓"}
                                </div>
                            </label>

                            {/* RAZORPAY */}
                            <label
                                className={`payment-card ${
                                    paymentMethod === "razorpay"
                                        ? "selected"
                                        : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={
                                        paymentMethod ===
                                        "razorpay"
                                    }
                                    onChange={() =>
                                        setPaymentMethod(
                                            "razorpay"
                                        )
                                    }
                                />

                                <div className="payment-icon razorpay">
                                    💳
                                </div>

                                <div className="payment-info">
                                    <strong>
                                        Pay Online
                                    </strong>

                                    <span>
                                        Secure payment powered by
                                        Razorpay
                                    </span>
                                </div>

                                <div className="payment-check">
                                    {paymentMethod ===
                                        "razorpay" && "✓"}
                                </div>
                            </label>
                        </div>

                        <div className="payment-security">
                            🔒 Your payment information is encrypted
                            and secure.
                        </div>
                    </section>

                    {/* ERROR */}
                    {error && (
                        <div className="checkout-error">
                            <span>!</span>

                            <div>
                                <strong>
                                    Something went wrong
                                </strong>

                                <p>{error}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE */}
                <aside className="order-summary">

                    <div className="summary-header">
                        <div>
                            <span>YOUR ORDER</span>
                            <h2>Order Summary</h2>
                        </div>

                        <span className="item-count">
                            {cart.items.length}{" "}
                            {cart.items.length === 1
                                ? "item"
                                : "items"}
                        </span>
                    </div>

                    {/* PRODUCTS */}
                    <div className="summary-products">

                        {cart.items.map((item) => (
                            <div
                                className="summary-product"
                                key={item.cart_item_id}
                            >
                                <div className="product-image">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                        />
                                    ) : (
                                        <span>🛍️</span>
                                    )}

                                    <span className="quantity">
                                        {item.quantity}
                                    </span>
                                </div>

                                <div className="product-details">
                                    <strong>
                                        {item.name}
                                    </strong>

                                    <span>
                                        ₹{Number(item.price).toFixed(2)}
                                    </span>
                                </div>

                                <strong className="product-total">
                                    ₹
                                    {Number(
                                        item.line_total
                                    ).toFixed(2)}
                                </strong>
                            </div>
                        ))}
                    </div>

                    <div className="summary-divider" />

                    {/* PRICE */}
                    <div className="price-row">
                        <span>Subtotal</span>
                        <strong>
                            ₹
                            {Number(cart.subtotal).toFixed(2)}
                        </strong>
                    </div>

                    <div className="price-row">
                        <span>Delivery</span>

                        {deliveryCharge === 0 ? (
                            <strong className="free">
                                FREE
                            </strong>
                        ) : (
                            <strong>
                                ₹{deliveryCharge.toFixed(2)}
                            </strong>
                        )}
                    </div>

                    {couponDiscount > 0 && (
                        <div className="price-row discount-row">
                            <span>Coupon Discount</span>

                            <strong>
                                -₹
                                {couponDiscount.toFixed(2)}
                            </strong>
                        </div>
                    )}

                    {deliveryCharge > 0 && (
                        <div className="free-delivery-hint">
                            🚚 Add ₹
                            {Math.max(
                                0,
                                500 - Number(cart.subtotal)
                            ).toFixed(2)}{" "}
                            more for FREE delivery
                        </div>
                    )}

                    <div className="summary-divider" />

                    <div className="total-row">
                        <div>
                            <span>Total Amount</span>
                            <small>Inclusive of applicable taxes</small>
                        </div>

                        <strong>
                            ₹{totalAmount.toFixed(2)}
                        </strong>
                    </div>

                    <button
                        className="place-order-btn"
                        onClick={handlePlaceOrder}
                        disabled={placing}
                    >
                        {placing ? (
                            <>
                                <span className="spinner" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {paymentMethod === "cod"
                                    ? "Place Order"
                                    : "Pay Securely"}

                                <span>→</span>
                            </>
                        )}
                    </button>

                    <div className="trust-section">

                        <div>
                            <span>🔒</span>

                            <div>
                                <strong>
                                    Secure Checkout
                                </strong>

                                <small>
                                    Your information is protected
                                </small>
                            </div>
                        </div>

                        <div>
                            <span>↩️</span>

                            <div>
                                <strong>
                                    Easy Returns
                                </strong>

                                <small>
                                    Hassle-free returns
                                </small>
                            </div>
                        </div>

                        <div>
                            <span>🚚</span>

                            <div>
                                <strong>
                                    Fast Delivery
                                </strong>

                                <small>
                                    Delivered to your doorstep
                                </small>
                            </div>
                        </div>

                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Checkout;