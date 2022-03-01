module.exports = {
    IsAuthenticated: (req, res, next) => {

      if (req.isAuthenticated()) {
        return next();
      }

      return res.status(404).json({
        status: false,
        error : "Not authorized!"
      })
    }
  };