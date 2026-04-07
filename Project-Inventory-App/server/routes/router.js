const express = require('express');
const router = express.Router();
const productsRouter = require('./product.routes');
const categoriesRouter = require('./category.routes');
const authRouter = require('./auth.routes');
const adminRouter = require('./admin.routes');
const {authenticateRole, authenticateToken} = require('../middleware/auth')


router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/auth', authRouter)
router.use(authenticateToken, authenticateRole('admin'));
router.use('/admin', adminRouter)

module.exports = router;