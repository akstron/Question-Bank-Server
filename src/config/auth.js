module.exports = {
    IsAuthenticated: (req, res, next) => {

      if (req.isAuthenticated()) {
        return next();
      }

      res.json({
        "err": "Not authorized!"
      })
    }
  };