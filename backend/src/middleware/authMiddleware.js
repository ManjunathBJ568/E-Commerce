const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    // Token is usually sent like: Authorization: Bearer <token>
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains userId and email
        next(); // Move on to the actual route
    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateToken;