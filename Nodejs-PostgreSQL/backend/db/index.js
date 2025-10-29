const pool = require("./pool");

module.exports = (text, params) => {
  return pool.query(text, params);
};