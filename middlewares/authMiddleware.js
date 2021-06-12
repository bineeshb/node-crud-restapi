const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.error(err);
        res.status(401).json({
          message: 'Invalid User'
        });
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.status(401).json({
      message: 'Invalid User'
    });
  }
};

module.exports = { requireAuth };
