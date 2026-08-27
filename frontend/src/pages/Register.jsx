import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await axiosInstance.post(
                "/auth/register",
                formData
            );

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-container">

                {/* ================= LEFT BRAND ================= */}

                <div className="auth-brand">

                    <div className="auth-brand-content">

                        <div className="auth-logo">
                            M
                        </div>

                        <span className="auth-brand-label">
                            JOIN THE COMMUNITY
                        </span>

                        <h1>
                            Your shopping.
                            <br />
                            <span>Your way.</span>
                        </h1>

                        <p>
                            Create your account and discover a
                            simpler, smarter way to shop for
                            everything you need.
                        </p>

                        <div className="auth-benefits">

                            <div>
                                <span>✓</span>

                                <p>
                                    <strong>
                                        Easy Shopping
                                    </strong>

                                    <small>
                                        Browse thousands of products
                                    </small>
                                </p>
                            </div>

                            <div>
                                <span>✓</span>

                                <p>
                                    <strong>
                                        Track Your Orders
                                    </strong>

                                    <small>
                                        Stay updated from checkout to delivery
                                    </small>
                                </p>
                            </div>

                            <div>
                                <span>✓</span>

                                <p>
                                    <strong>
                                        Exclusive Deals
                                    </strong>

                                    <small>
                                        Get access to special offers
                                    </small>
                                </p>
                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= REGISTER FORM ================= */}

                <div className="auth-form-section">

                    <div className="auth-form-container">

                        <div className="mobile-auth-logo">
                            M
                        </div>

                        <div className="auth-heading">

                            <span>
                                CREATE ACCOUNT
                            </span>

                            <h2>
                                Get started
                            </h2>

                            <p>
                                Create your account to start shopping.
                            </p>

                        </div>


                        {/* ================= ERROR ================= */}

                        {error && (
                            <div className="auth-error">

                                <span>
                                    !
                                </span>

                                <div>

                                    <strong>
                                        Registration failed
                                    </strong>

                                    <p>
                                        {error}
                                    </p>

                                </div>

                            </div>
                        )}


                        {/* ================= SUCCESS ================= */}

                        {success && (
                            <div className="auth-success">

                                <span>
                                    ✓
                                </span>

                                <div>

                                    <strong>
                                        Account created
                                    </strong>

                                    <p>
                                        {success}
                                    </p>

                                </div>

                            </div>
                        )}


                        {/* ================= FORM ================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="auth-form"
                        >

                            {/* NAME */}

                            <div className="form-group">

                                <label htmlFor="name">
                                    Full Name
                                </label>

                                <div className="auth-input-wrapper">

                                    <span>
                                        👤
                                    </span>

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        required
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="auth-input-wrapper">

                                    <span>
                                        ✉
                                    </span>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                        required
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="auth-input-wrapper">

                                    <span>
                                        🔒
                                    </span>

                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                        autoComplete="new-password"
                                        required
                                    />

                                </div>

                            </div>


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="auth-spinner"></span>

                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account

                                        <span>
                                            →
                                        </span>
                                    </>
                                )}

                            </button>

                        </form>


                        {/* ================= DIVIDER ================= */}

                        <div className="auth-divider">
                            <span>
                                OR
                            </span>
                        </div>


                        {/* ================= LOGIN ================= */}

                        <p className="auth-register-text">

                            Already have an account?

                            <Link to="/login">
                                Sign in
                            </Link>

                        </p>


                        {/* ================= SECURITY ================= */}

                        <div className="auth-security">
                            🔒 Your information is securely protected
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Register;