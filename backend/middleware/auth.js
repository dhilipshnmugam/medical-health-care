const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  // Check for token in x-auth-token header first (for frontend requests)
  const tokenFromHeader = req.header('x-auth-token');
  
  // Also support Bearer token in Authorization header (for API testing)
  const authHeader = req.headers.authorization;
  
  let token;
  if (tokenFromHeader) {
    token = tokenFromHeader;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
  }
  next();
};
