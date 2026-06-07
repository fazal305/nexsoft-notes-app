const jwt = require('jsonwebtoken');

// Checks if request has a valid JWT token
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Not authorized'
      });
    }

    const token = authHeader.split(' ')[1];

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedUser;

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Not authorized'
    });
  }
}

module.exports = authMiddleware;