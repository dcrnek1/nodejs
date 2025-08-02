const messages = require("../model/Message");

module.exports = {
  get: (req, res, next) => {
    res.send(messages.GetAllMessages());
  },
  post: (req, res, next) => {
    try {
      messages.NewMessage(req.body.user, req.body.content, req.body.tstamp);
      res.send("New message added");
    } catch (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }
  },
  delete: (req, res, next) => {
    try {
      messages.DeleteMessage(req.params.id);
      res.send("Message deleted");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};
