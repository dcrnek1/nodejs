const express = require('express');
const router = express.Router();
const controller = require('../controllers/CommentController')



router.get('/', controller.get)

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