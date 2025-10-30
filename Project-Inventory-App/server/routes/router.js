const express = require('express');
const router = express.Router();
const productsRouter = require('./product.routes');
const categoriesRouter = require('./category.routes');


router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);

module.exports = router;