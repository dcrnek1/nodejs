const express = require('express');
const categoryController = require('../controllers/category.controller');
const router = express.Router();
const {upload} = require('../middleware/multer');
const {body, validationResult} = require('express-validator');

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
    body('product_ids').optional().isArray({min: 0}).withMessage('Products must be of type array'),
    body('product_ids.*').isInt({gt: 0}).withMessage('Each product ID must be a positive integer.'),
    validationErrorCheck,
]

router.get('/', categoryController.getAllCategories)
router.get('/:category_id', categoryController.getCategoryById)
router.delete('/:category_id', categoryController.deleteCategory)
router.post('/', upload([{name: 'image', maxCount: 1, minCount: 1}], ['image/jpeg', 'image/png']), validateCreate, 
             categoryController.createCategory)
router.put('/update/:category_id', upload([{name: 'image', maxCount: 1}], ['image/jpeg', 'image/png']),
             validateCreate, categoryController.updateCategory)

module.exports = router;