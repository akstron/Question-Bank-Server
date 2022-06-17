module.exports = {
  IsAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    return res.status(401).json({
      status: false,
      error: "Not authorized",
    });
  },

  IsVerified: (req, res, next) => {
    if (req.user.isVerified) {
      return next();
    }

    return res.status(403).json({
      status: false,
      error: 'Email not verified'
    });
  },
};
