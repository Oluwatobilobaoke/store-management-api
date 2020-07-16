const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
    addCategory,
    updateCategory,
    deleteCategory,
    getCategories,
} = require('../controllers/category');

const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/user');


const router = express.Router();

router
    .route('/')
    .post(protect, addCategory)
    .get(protect, getCategories);
router
    .route('/:categoryId')
    .put(protect, authorize('admin', 'attendant'), updateCategory)
    .delete(protect, authorize('admin'), deleteCategory);

    router
    .route('/:categoryId/products')
    .post(protect, authorize('admin', 'attendant'), createProduct)
    .get(protect, getProducts);

router
    .route('/:categoryId/products/:productId')
    .get(protect, getProduct)
    .put(protect, authorize('admin', 'attendant'), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
