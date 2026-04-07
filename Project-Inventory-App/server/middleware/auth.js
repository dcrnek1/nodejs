const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
};

const authenticateRole = (role) => {
  return (req, res, next) => {
    if (role === req.user.role) {
      next();
    } else {
      return res.sendStatus(403);
    }
  };
};

module.exports = { authenticateToken, authenticateRole };
