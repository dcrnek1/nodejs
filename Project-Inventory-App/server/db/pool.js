const {Pool} = require("pg");

module.exports = new Pool({
  host: "localhost",
  user: "postgres",
  database: "InventoryApp",
  password: "asdasd",
  port: 5432
})