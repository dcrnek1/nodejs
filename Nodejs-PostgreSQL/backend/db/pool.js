const {Pool} = require("pg");

module.exports = new Pool({
  host: "localhost",
  user: "postgres",
  database: "TOP",
  password: "asdasd",
  port: 5432
})