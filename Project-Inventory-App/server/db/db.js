const pool = require("./pool");

const db = async (text, params = [], res = null) => {
  if (!text || typeof text !== 'string') {
    console.log("Query text must be a non-empty string");
    throw new Error("Query text must be a non-empty string");
  }

  try {
    const result = await pool.query(text, params);
    return {rows: result.rows, result: result}
  } catch (error) {
    console.error("Database query error for query:", text, ", Error message:", error.message);
    if (res) res.status(500).json({error: error, message: "Internal server error."});
  }
};

db.transaction = async function (callback) {
  const client = await pool.connect(); // get a dedicated connectio

  try {
    await client.query("BEGIN"); // start transaction
    const result = await callback(client); // run your callback, pass in the client
    await client.query("COMMIT"); // commit if all went well
    return result;
  } catch (err) {
    await client.query("ROLLBACK"); // rollback on any error
    console.error("Transaction rolled back due to error:", err.message);
    throw err;
  } finally {
    client.release(); // release client back to pool
  }
};



module.exports = db;