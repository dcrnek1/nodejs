const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();

router.get('/', productController.getAllProducts)
router.delete('/:id', productController.deleteProduct)

module.exports = router;