const express = require('express');
const { getAllProducts, getProductByReference, createProduct, updateProduct, deleteProduct } = require('../lib/data');
const router = express.Router();

router.get('/products', getAllProducts);
router.get('/products/:reference', getProductByReference);
router.post('/products', createProduct);
router.put('/products/:reference', updateProduct);
router.delete('/products/:reference', deleteProduct);

module.exports = router;