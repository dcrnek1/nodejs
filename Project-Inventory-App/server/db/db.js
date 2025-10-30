const pool = require("./pool");

module.exports = async (text, params = []) => {
  if (!text || typeof text !== 'string') {
    console.log("Query text must be a non-empty string");
    throw new Error("Query text must be a non-empty string");
  }

  try {
    const result = await pool.query(text, params);
    console.log("Executed query:", text);
    return {rows: result.rows, result: result}
  } catch (error) {
    console.error("Database query error for query:", text, ", Error message:", error.message);
    throw error;
  }
};