// Mock authentication middleware for testing
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    req.user = {
      userId: 'test-user-id',
      role: 'admin'
    };
  }
  next();
};

const checkRole = (role) => (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

module.exports = { authenticateToken, checkRole };
