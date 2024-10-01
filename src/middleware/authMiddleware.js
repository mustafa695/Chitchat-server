// middleware/auth.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Extract token from cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token
  const JWT_SECRET = "mySuperSecretKey12345";

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Attach the user ID to the request object for further use
    req.id = decoded.id;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authMiddleware;
