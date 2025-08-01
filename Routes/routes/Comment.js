const express = require('express');
const router = express.Router();



router.get('/', (req, res) => {
    res.send({data: "Here is your data for comments"})
})

router.post('/', (req, res) => {
    res.send({data: "Comment created"})
})

router.put('/', (req, res) => {
    res.send({data: "Comment updated"})
})

router.delete('/', (req, res) => {
    res.send({data: "Comment deleted"})
})

module.exports = router;