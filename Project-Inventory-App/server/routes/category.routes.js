const express = require('express');
const categoryController = require('../controllers/category.controller');
const router = express.Router();
const upload = require('../middleware/multer');

router.get('/', categoryController.getAllCategories)
router.delete('/:id', categoryController.deleteCategory)
router.post('/new', upload.single('image'), categoryController.createCategory)
router.put('/update/:category_id', upload.single('image'), categoryController.updateCategory)

module.exports = router;