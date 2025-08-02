const db = require("../db");

async function getUserById(req, res, next) {
  const { userId } = req.params;

  try {
    const user = await db.getUserById(userId);

    if (!user) {
      throw(`User with ID ${userId} not found`)
      return;
    } else {
      res.send(user);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { getUserById };
