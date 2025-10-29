const db = require('../db/index');

module.exports = {
  get: async (req, res) => {
    res.send("Accessing user GET");
    try {
      const {rows} = await db("select * from usernames");
      console.log(rows);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  post: async (req, res) => {
    const {username} = req.body;
    
    if (username) {
      try {
        const {rows} = await db("INSERT INTO usernames(username) VALUES ($1) RETURNING *", [username]);
        res.status(201).location(`/users/${rows[0].id}`).send(rows[0]);
      } catch (error) {
        res.status(400).send(error);
      }
    } else {
      res.status(400).send({error: "No username provided."});
    }
  }
}