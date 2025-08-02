const express = require('express');
const { getUserById } = require('../controllers/UserController')
const router = express.Router();

router.get('/', (req, res) => {
    res.send({data: "Here is your data for users"})
})

router.get('/:userId', getUserById);

router.post('/', (req, res) => {
    res.send({data: "User created"})
})

router.put('/', (req, res) => {
    res.send({data: "User updated"})
})

router.delete('/', (req, res) => {
    res.send({data: "User deleted"})
})

module.exports = router;
