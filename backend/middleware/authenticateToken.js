const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization"); // Get token from headers

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const tokenWithoutBearer = token.replace("Bearer ", ""); // Remove 'Bearer ' prefix if present
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET); // Verify token
    req.user = verified; // Attach decoded user payload to request
    next(); // Move to next middleware/route handler
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = authenticateToken;
