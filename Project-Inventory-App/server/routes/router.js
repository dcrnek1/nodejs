const express = require('express');
const router = express.Router();
const productsRouter = require('./product.routes');
const categoriesRouter = require('./category.routes');
const authRouter = require('./auth.routes');


router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/auth', authRouter)

module.exports = router;