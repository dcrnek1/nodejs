
const {body, validationResult} = require('express-validator');
const UserModel = require('../model/userModel');

module.exports = {
  get: (req, res, next) => {
    res.send(UserModel.getUsers());
  },
  post: (req, res, next) => {
    UserModel.addUser(req.body)
    res.send("This is response for POST.")
  },
  delete: (req, res, next) => {
    res.send("This is response for DELETE.")
  }
}