const express = require('express');
const router = express.Router();
const productsRouter = require('./product.routes');
const categoriesRouter = require('./category.routes');


router.use('api/products', productsRouter);
router.use('api/categories', categoriesRouter);

module.exports = router;