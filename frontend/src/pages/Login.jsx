import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axiosInstance.post(
                "/auth/login",
                formData
            );

            const { token, user } = response.data;

            login(user, token);

            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-container">

                {/* LEFT BRAND SECTION */}

                <div className="auth-brand">

                    <div className="auth-brand-content">

                        <div className="auth-logo">
                            M
                        </div>

                        <span className="auth-brand-label">
                            WELCOME BACK
                        </span>

                        <h1>
                            Shop smarter.
                            <br />
                            <span>Live better.</span>
                        </h1>

                        <p>
                            Discover quality products, great prices,
                            and a shopping experience designed around you.
                        </p>

                        <div className="auth-benefits">

                            <div>
                                <span>✓</span>
                                <p>
                                    <strong>Premium Products</strong>
                                    <small>
                                        Carefully selected for you
                                    </small>
                                </p>
                            </div>

                            <div>
                                <span>✓</span>
                                <p>
                                    <strong>Fast Delivery</strong>
                                    <small>
                                        Get your orders delivered quickly
                                    </small>
                                </p>
                            </div>

                            <div>
                                <span>✓</span>
                                <p>
                                    <strong>Secure Shopping</strong>
                                    <small>
                                        Your information stays protected
                                    </small>
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* LOGIN SECTION */}

                <div className="auth-form-section">

                    <div className="auth-form-container">

                        <div className="mobile-auth-logo">
                            M
                        </div>

                        <div className="auth-heading">

                            <span>ACCOUNT</span>

                            <h2>
                                Welcome back
                            </h2>

                            <p>
                                Sign in to continue shopping.
                            </p>

                        </div>

                        {error && (
                            <div className="auth-error">
                                <span>!</span>

                                <div>
                                    <strong>
                                        Login failed
                                    </strong>

                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="auth-form"
                        >

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="auth-input-wrapper">
                                    <span>✉</span>

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

                            <div className="form-group">

                                <div className="password-label-row">

                                    <label htmlFor="password">
                                        Password
                                    </label>

                                </div>

                                <div className="auth-input-wrapper">
                                    <span>🔒</span>

                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="auth-spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <span>→</span>
                                    </>
                                )}
                            </button>

                        </form>

                        <div className="auth-divider">
                            <span>OR</span>
                        </div>

                        <p className="auth-register-text">
                            Don't have an account?

                            <Link to="/register">
                                Create an account
                            </Link>
                        </p>

                        <div className="auth-security">
                            🔒 Secure authentication powered by JWT
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;