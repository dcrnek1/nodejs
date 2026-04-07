const express = require('express');
const productController = require('../controllers/product.controller');
const {body, validationResult} = require('express-validator');
const { upload } = require('../middleware/multer');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

const validationErrorCheck = (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }

const validateCreate = [
    body('name').trim().notEmpty().withMessage('Name can not be empty.')
    .isAlphanumeric('en-US', {ignore: ' '}).withMessage(`Name can contain letters and numbers only.`),
    body('description').trim().optional(),
    body('stock').trim().optional().isInt({min: 0}),
    body('categories').optional().isArray({min: 0}).withMessage('Categories must be an array'),
    body('categories.*').isInt({gt: 0}).withMessage('Each category ID must be a positive integer.'),
    validationErrorCheck,
]

const validateUpdate = [
    body('name').trim().optional()
    .isAlphanumeric('en-US', {ignore: ' '}).withMessage(`Name can contain letters and numbers only.`),
    body('description').trim().optional(),
    body('stock').trim().optional().isInt({min: 0}),
    body('categories').optional().isArray({min: 0}).withMessage('Categories must be an array'),
    body('categories.*').isInt({gt: 0}).withMessage('Each category ID must be a positive integer.'),
    validationErrorCheck,
]

router.get('/', productController.getAllProducts)
router.get('/category/:category_id', productController.getAllProductsByCategory)
router.get('/:product_id', productController.getProductById)
router.post('/', upload([{name: 'image', maxCount: 1}], ['image/jpeg', 'image/png']), validateCreate, productController.createProduct)
router.put('/:product_id', upload([{name: 'image', maxCount: 1}], ['image/jpeg', 'image/png']), validateUpdate, productController.updateProduct)
router.delete('/:product_id', authenticateToken, productController.deleteProduct)

module.exports = router;