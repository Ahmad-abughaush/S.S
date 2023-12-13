const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer')) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }

      if (!decoded?.userId || !decoded?.role) {
        return res.status(403).json({ error: 'Invalid token payload' });
      }

      try {
        if (decoded.role.toLowerCase() === 'provider') {
          req.user = await Provider.findById(decoded.ProviderId);
        } else {
          req.user = await User.findById(decoded.userId);
        }

        if (!req.user) {
          return res.status(403).json({ error: 'User not found' });
        }

        next();
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server Error' });
      }
    }
  );
};

module.exports = verifyJWT;
