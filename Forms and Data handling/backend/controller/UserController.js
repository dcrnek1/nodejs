
const { body, validationResult, matchedData } = require("express-validator");
const UserModel = require('../model/userModel');

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName").trim()
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
]

module.exports = {
  get: (req, res, next) => {
    res.send(UserModel.getUsers());
  },
  post: [validateUser, (req, res, next) => {
    const errors = validationResult(req);
    console.log(matchedData(req));
    if (!errors.isEmpty()) {
      return res.status(400).send(errors)
    }
    
    UserModel.addUser(req.body)
    res.send("This is response for POST.")
  }],
  delete: (req, res, next) => {
    res.send("This is response for DELETE.")
  }
}