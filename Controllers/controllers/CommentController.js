module.exports = {
  get: (req, res, next) => {
    next(new Error("Test"));
    
  }
}