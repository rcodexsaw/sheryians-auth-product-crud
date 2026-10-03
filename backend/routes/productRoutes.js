const express = require('express');
const { body } = require('express-validator');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validation');
const { createProduct, listProducts, getProduct, updateProduct, deleteProduct, invalidObjectId } = require('../controllers/productController');

const router = express.Router();
const productRules = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Name must be 2-120 characters'),
  body('description').trim().isLength({ min: 5, max: 1000 }).withMessage('Description must be 5-1000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category').trim().isLength({ min: 2, max: 80 }).withMessage('Category must be 2-80 characters'),
  body('imageUrl').optional({ values: 'falsy' }).isURL().withMessage('Image URL must be a valid URL')
];

router.get('/', listProducts);
router.get('/:id', invalidObjectId, getProduct);
router.post('/', authenticate, productRules, validate, createProduct);
router.put('/:id', authenticate, invalidObjectId, productRules, validate, updateProduct);
router.delete('/:id', authenticate, invalidObjectId, deleteProduct);

module.exports = router;
